#!/bin/sh
# Run the title-screen browser regression. Playwright is installed outside the repo.
set -eu
cd "$(dirname "$0")/.."
CACHE="${TRAP_PW_CACHE:-/tmp/trap-full-playwright}"
if [ ! -d "$CACHE/node_modules/playwright" ]; then
  mkdir -p "$CACHE"
  npm install --prefix "$CACHE" --silent playwright@1.65.0
  npx --prefix "$CACHE" playwright install chromium
fi
NODE_PATH="$CACHE/node_modules${NODE_PATH:+:$NODE_PATH}" node tests/title-controls.js
