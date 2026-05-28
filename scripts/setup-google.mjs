#!/usr/bin/env node
import http from "node:http";
import { URL } from "node:url";
import { exec } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ENV_PATH = resolve(process.cwd(), ".env.local");
const REDIRECT_URI = "http://localhost:9876/callback";
const SCOPE = "https://www.googleapis.com/auth/drive.readonly";

function readEnv() {
  if (!existsSync(ENV_PATH)) {
    console.error("✗ No encuentro .env.local. Copiá .env.example primero:");
    console.error("    cp .env.example .env.local");
    process.exit(1);
  }
  const raw = readFileSync(ENV_PATH, "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const match = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (match) env[match[1]] = match[2];
  }
  return env;
}

function openBrowser(url) {
  const platform = process.platform;
  const cmd =
    platform === "darwin" ? `open "${url}"`
    : platform === "win32" ? `start "" "${url}"`
    : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

function captureCode() {
  return new Promise((resolveCode, rejectCode) => {
    const server = http.createServer((req, res) => {
      if (!req.url) return;
      const u = new URL(req.url, "http://localhost:9876");
      if (u.pathname !== "/callback") {
        res.writeHead(404).end();
        return;
      }
      const code = u.searchParams.get("code");
      const err = u.searchParams.get("error");
      if (err) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<h1>Error</h1><p>${err}</p>`);
        server.close();
        rejectCode(new Error(err));
        return;
      }
      if (code) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`
          <html><body style="font-family:system-ui;background:#fff5f9;color:#5c3a52;
                             display:flex;align-items:center;justify-content:center;height:100vh;
                             margin:0;text-align:center;">
            <div>
              <h1 style="font-size:2em;">♡ listo ♡</h1>
              <p>volvé a la terminal, ya tenemos lo que necesitamos.</p>
            </div>
          </body></html>
        `);
        server.close();
        resolveCode(code);
      }
    });
    server.listen(9876);
  });
}

async function exchangeCode(code, clientId, clientSecret) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error(`token exchange falló: ${res.status} ${await res.text()}`);
  return res.json();
}

async function listFolders(accessToken) {
  const folders = [];
  let pageToken;
  do {
    const url = new URL("https://www.googleapis.com/drive/v3/files");
    url.searchParams.set("q", "mimeType='application/vnd.google-apps.folder' and trashed=false");
    url.searchParams.set("fields", "files(id,name,modifiedTime),nextPageToken");
    url.searchParams.set("orderBy", "modifiedTime desc");
    url.searchParams.set("pageSize", "100");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) throw new Error(`listar carpetas falló: ${res.status} ${await res.text()}`);
    const data = await res.json();
    if (data.files) folders.push(...data.files);
    pageToken = data.nextPageToken;
  } while (pageToken);
  return folders;
}

async function main() {
  const env = readEnv();
  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("✗ Falta GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET en .env.local");
    console.error("  Consultá el README para crear las credenciales en Google Cloud.");
    process.exit(1);
  }

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", SCOPE);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  console.log("\n♡ paso 1/2 — autorización en el browser");
  console.log("  abriendo:", authUrl.toString(), "\n");
  openBrowser(authUrl.toString());
  console.log("  si no se abrió solo, copiá la URL de arriba.\n");

  const code = await captureCode();
  console.log("✓ código recibido, intercambiando por tokens...\n");

  const tokens = await exchangeCode(code, clientId, clientSecret);
  if (!tokens.refresh_token) {
    console.error("✗ Google no devolvió refresh_token. Probá revocar el acceso de la app en");
    console.error("  https://myaccount.google.com/permissions y correr el script de nuevo.");
    process.exit(1);
  }

  console.log("✓ refresh_token obtenido.\n");
  console.log("─".repeat(60));
  console.log("\n♡ guardá esto YA en .env.local (por si lo siguiente falla):\n");
  console.log(`GOOGLE_REFRESH_TOKEN="${tokens.refresh_token}"\n`);
  console.log("─".repeat(60));
  console.log("\n♡ paso 2/2 — listando tus carpetas de Drive\n");

  const folders = await listFolders(tokens.access_token);
  if (folders.length === 0) {
    console.log("  no encontré carpetas. Creá una en Drive primero y subí las fotos ahí.");
  } else {
    console.log("  carpetas (orden por más reciente):\n");
    for (const f of folders.slice(0, 30)) {
      console.log(`    • ${f.name}`);
      console.log(`      id: ${f.id}\n`);
    }
    if (folders.length > 30) {
      console.log(`  ...y ${folders.length - 30} más (si no aparece la tuya, búscala por nombre)\n`);
    }
  }

  console.log("─".repeat(60));
  console.log("\n♡ pegá esto en tu .env.local:\n");
  console.log(`GOOGLE_REFRESH_TOKEN="${tokens.refresh_token}"`);
  console.log(`GOOGLE_DRIVE_FOLDER_ID="<copiá el id de la carpeta de arriba>"\n`);
  console.log("─".repeat(60));
}

main().catch((err) => {
  console.error("\n✗ algo falló:", err.message);
  process.exit(1);
});
