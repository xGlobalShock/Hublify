# Hublify

Hublify is a lightweight web app for browsing and scheduling streamers with visual background effects.

Key points
- Purpose: display streamer lists, schedules, and previews with a library of WebGL/CSS background effects.
- Framework: React (source in `src/`). Built app output is in `build/`.

Main features
- Streamers list and schedule pages (`src/pages/StreamersList.jsx`, `src/pages/StreamSchedule.jsx`).
- Streamers preview and display components (`src/lib`, `src/pages/StreamersDisplay.jsx`).
- A collection of realtime background effects in `src/effects/` (Aurora, Plasma, Prism, etc.).
- Authentication pages (`src/pages/Login.js`, `src/pages/OAuthCallback.js`).

Getting started (development)
1. Install dependencies:

   npm install

2. Run the dev server:

   npm start

3. Build for production:

   npm run build

Notes
- Edit UI and pages in `src/`. Background effects live in `src/effects/` and can be composed into previews in `src/lib`.
- The `build/` folder contains the production-ready static site.

Project structure (high level)
- `src/`: application source
  - `effects/`: visual background effects (JSX/CSS)
  - `pages/`: main app pages and routes
  - `lib/`: reusable components and previews
- `public/` and `build/`: static assets and built app

Contributing
- Open a PR with focused changes. Keep UI and effects modular.
# Hublify

Hublify is a React-based web app for discovering, previewing, and scheduling streamers with polished background visuals. It combines streamer-management UI (lists, previews, schedules) with a library of WebGL/CSS effects to present attractive live backgrounds for previews and embeds.

What it does
- Browse and preview streamers with configurable visual backgrounds.
- Manage or view streaming schedules and upcoming slots.
- Render realtime background effects used in previews and component backgrounds.

Tech stack
- Frontend: React (source in `src/`).
- Visuals: a collection of effect components in `src/effects/` (JSX + CSS, some using WebGL).
- Build output: static site files in `build/` and `public/`.

Key files and folders
- `src/` — app source
   - `src/pages/` — page routes and views (e.g., `StreamersList.jsx`, `StreamSchedule.jsx`).
   - `src/effects/` — visual effect components and their styles (Aurora, Prism, Plasma, etc.).
   - `src/lib/` — reusable components and preview helpers.
- `public/` — static assets used by the app.
- `build/` — production build output after running the build script.

Getting started (development)
1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Create a production build:

```bash
npm run build
```

Notes and tips
- Background effects live in `src/effects/` — edit or compose them into previews in `src/lib/`.
- Environment files like `.env` (if used) should not be committed; check `.env.example` for required variables.
- If you integrate with a backend or OAuth provider, check `src/pages/Login.js` and `src/pages/OAuthCallback.js`.

Contributing
- Fork the repo, create a feature branch, and open a pull request with a clear description.
- Keep changes small and focused; include screenshots or recordings for visual/effect updates.

License
- No license declared. Add a `LICENSE` file or ask the project owner which license to apply.

Contact / Next steps
- If you want, I can add deployment instructions (Netlify/Vercel) or example environment variables to this README.