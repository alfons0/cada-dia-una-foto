type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  imageMediaMetadata?: {
    width?: number;
    height?: number;
  };
};

let cachedFiles: DriveFile[] | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60 * 60 * 1000;

let cachedAccessToken: string | null = null;
let accessTokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < accessTokenExpiresAt - 60_000) {
    return cachedAccessToken;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Faltan credenciales de Google. Configurá GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET y GOOGLE_REFRESH_TOKEN en .env.local"
    );
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`No se pudo refrescar el token de Google: ${res.status} ${text}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedAccessToken = data.access_token;
  accessTokenExpiresAt = Date.now() + data.expires_in * 1000;
  return cachedAccessToken;
}

async function fetchFolderImages(): Promise<DriveFile[]> {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    throw new Error("Falta GOOGLE_DRIVE_FOLDER_ID en .env.local");
  }

  const accessToken = await getAccessToken();
  const files: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL("https://www.googleapis.com/drive/v3/files");
    url.searchParams.set(
      "q",
      `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`
    );
    url.searchParams.set(
      "fields",
      "files(id,name,mimeType,imageMediaMetadata(width,height)),nextPageToken"
    );
    url.searchParams.set("orderBy", "name");
    url.searchParams.set("pageSize", "1000");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Drive respondió ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      files?: DriveFile[];
      nextPageToken?: string;
    };
    if (data.files) files.push(...data.files);
    pageToken = data.nextPageToken;
  } while (pageToken);

  return files;
}

export async function getFolderImages(): Promise<DriveFile[]> {
  if (cachedFiles && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedFiles;
  }
  const files = await fetchFolderImages();
  cachedFiles = files;
  cachedAt = Date.now();
  return files;
}

export async function fetchFileBinary(
  id: string
): Promise<{ body: ReadableStream<Uint8Array>; contentType: string }> {
  const accessToken = await getAccessToken();
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?alt=media`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(`No se pudo obtener archivo ${id}: ${res.status} ${text}`);
  }
  return {
    body: res.body,
    contentType: res.headers.get("content-type") || "application/octet-stream",
  };
}

export type { DriveFile };
