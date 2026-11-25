# JAY JAY AI

Android-first AI web app starter with a Hindi interface.

## Current features
- Responsive home screen with Chat, Photo Studio, Video Studio, Study, Coding and Profile sections.
- Photo/video local preview in the browser.
- Server-side AI chat endpoint at `POST /api/chat`.
- Health check at `GET /api/health`.
- Basic PWA manifest and service worker.

## Run locally
Requires Node.js 20 or newer.

```sh
npm install
cp .env.example .env
# Put the API key in the local .env file only; never commit it.
npm start
```

Open `http://localhost:3000`.

## Hosting
Deploy this repository to a Node.js hosting service. Set `OPENAI_API_KEY` in the host's Secret/Environment Variables settings. Optionally set `OPENAI_MODEL`. Do not put secrets in GitHub, frontend files, or an APK.

The API key and any paid API account must be managed by a parent/guardian where required. API usage may incur separate charges.

## Not yet connected
- Firebase login and cloud profile storage.
- AI image editing and AI video generation (these need separate provider choices and API credentials).
- Native Android APK packaging and device testing.

This repository is starter code, not a deployed or tested production service.
