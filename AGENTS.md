# Agent notes — TRAP FULL

Published static play build. Prefer small, scoped edits over whole-file rewrites.

## File map (read only what you need)

| Path | What it is |
|------|------------|
| `index.html` | Shell markup + inline CSS only (~17KB). Do not dump the whole file for episode/engine work. |
| `engine.js` | Game runtime, tips registry, UI, saves, verify harness. |
| `episodes/index.js` | Episode catalog + script tags to load. |
| `episodes/epNN.js` | One episode’s data (`registerEpisode({...})`). Edit here for story/choices. |
| `ui3.css` / `ui3.js` | Optional pixel UI skin. |

## Token hygiene

- Start a **new agent thread** for follow-ups; do not stack long rebase/fix loops on one chat.
- Prefer `rg` / targeted reads over re-reading `engine.js` or every `epNN.js`.
- Episode content is **not** in `index.html` or duplicated in the engine.
- Verify with `?verify=1&ep=ep00` (and other episode ids) after engine or episode changes.

## Play / verify

- Live: https://jimmdunc-hub.github.io/trap-full/
- Local: serve the repo root, then open `/?verify=1&ep=ep00` — expect `window.__TRAP_FULL_VERIFY__.ok === true`.
