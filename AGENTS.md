<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

`pleiades` is a single Next.js 16 (App Router, TypeScript, Tailwind CSS v4) web app. There is one service: the Next.js dev server.

- Dependencies are refreshed automatically by the startup update script (`npm install`), so you normally do not need to install anything yourself.
- Standard commands live in `package.json` (`dev`, `build`, `start`, `lint`). Run the dev server with `npm run dev` (serves on http://localhost:3000). `next dev` uses Turbopack by default even though the app is not configured with a Turbopack flag.
- Node 22 is expected. The app pins `next@16.2.10` / `react@19`; do not assume older Next.js conventions.
