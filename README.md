# cada día una foto de ti ♡

Web kawaii estilo Sanrio que muestra **una foto distinta cada día** de un álbum de Google Photos. Selección determinística por día (todos ven la misma foto ese día), password gate, gratis en Vercel.

---

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** con paleta soft-girl
- **Google Photos Library API** (refresh token server-side, nunca llega al cliente)
- **jose** para firmar la cookie de sesión
- **seedrandom** para selección determinística por día

Costo total: **$0/mes**.

---

## Setup paso a paso

### 1. Crear el álbum en Google Photos

Abrí Google Photos → crear álbum nuevo (ej: "Fotos de ella") → metele las fotos que quieras que rote.

### 2. Crear proyecto en Google Cloud Console

1. Andá a https://console.cloud.google.com y creá un proyecto nuevo (ej: `cada-dia-foto`).
2. **APIs & Services → Library** → buscá **"Photos Library API"** y habilitala.
3. **APIs & Services → OAuth consent screen**:
   - User Type: **External**
   - Llená los campos obligatorios (App name, support email, developer email).
   - En "Scopes": agregá `https://www.googleapis.com/auth/photoslibrary.readonly`.
   - En "Test users": agregá tu mismo email de Google.
   - Guardá. Podés dejarlo en modo **Testing** (no necesitás verificación).
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:9876/callback`
   - Crear → copiá el **Client ID** y el **Client Secret**.

### 3. Configurar variables locales

```bash
cp .env.example .env.local
```

Editá `.env.local` y pegá:
- `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` del paso anterior
- `APP_PASSWORD` (el password que querés usar para entrar)
- `SESSION_SECRET` — generalo con: `openssl rand -base64 32`

### 4. Obtener refresh token + album ID

```bash
npm run setup
```

Te abre el browser, te logueás con Google, autorizás el permiso. La terminal te imprime:
- El `GOOGLE_REFRESH_TOKEN`
- La lista de tus álbumes con sus IDs

Copiá ambos valores de vuelta a `.env.local`.

### 5. Levantar la app

```bash
npm run dev
```

Abrí http://localhost:3000 → te pide password → entrás → foto del día ♡

---

## Deploy a Vercel

```bash
npm i -g vercel
vercel
```

Seguí el flujo (acepta los defaults). Después configurá las env vars:

```bash
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GOOGLE_REFRESH_TOKEN
vercel env add GOOGLE_ALBUM_ID
vercel env add APP_PASSWORD
vercel env add SESSION_SECRET
vercel env add APP_TIMEZONE
```

(O pegalos en el dashboard de Vercel → Project → Settings → Environment Variables.)

Después: `vercel --prod`.

---

## Estructura

```
cada-dia/
├── app/
│   ├── layout.tsx          # Fuentes + metadata
│   ├── page.tsx            # Home (server component, foto del día)
│   ├── login/page.tsx      # Password gate
│   ├── actions.ts          # Server actions: login + logout
│   └── globals.css         # Paleta + animaciones kawaii
├── components/
│   ├── PhotoFrame.tsx
│   ├── Bow.tsx
│   ├── Sparkles.tsx
│   ├── DailyMessage.tsx
│   └── LogoutButton.tsx
├── lib/
│   ├── google-photos.ts    # OAuth refresh + listado de álbum (cache 1h)
│   ├── daily-pick.ts       # seedrandom por YYYY-MM-DD
│   ├── messages.ts         # Frases que rotan por día
│   └── session.ts          # JWT firmado con SESSION_SECRET
└── scripts/
    └── setup-google.mjs    # Helper interactivo de OAuth
```

---

## Cómo funciona la selección "del día"

`seedrandom(dateKey)` donde `dateKey = "YYYY-MM-DD"` en tu zona horaria configurada.
Misma seed → mismo número aleatorio → misma foto durante todo el día. Sin base de datos. Cambia automáticamente a medianoche.

## Cómo se mantiene seguro el refresh token

Vive solo en `process.env`. La página `/` es un Server Component → todo el código de Google Photos corre en el server → al cliente solo le llega la URL de la imagen (que de por sí expira en ~60 min).

---

## Troubleshooting

- **"redirect_uri_mismatch"** en el script de setup: asegurate que en Google Cloud Console agregaste exactamente `http://localhost:9876/callback`.
- **"refresh_token undefined"**: revocá el acceso de la app en https://myaccount.google.com/permissions y volvé a correr `npm run setup`.
- **"Photos Library API has not been used"**: habilitala en la Console (paso 2.2).
- **No carga la foto pero todo lo demás está bien**: probablemente el `GOOGLE_ALBUM_ID` está mal o el álbum está vacío.
