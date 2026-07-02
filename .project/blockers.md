# Current Blockers

- **Active Blockers:** None.
- **Resolved Blockers:**
  - [2026-07-02] Stale Remix server build (`build/server/index.js`) causing runtime execution of pre-June code -> Fixed via `npm run build`.
  - [2026-07-02] Strict schema validator throwing errors on custom AI design tokens -> Fixed in `validators.server.ts` by relaxing check to warning.
