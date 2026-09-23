#!/usr/bin/env bash
# ==============================================================================
#  Brimkern CLI installer
#    curl -fsSL https://brimkern.com/install.sh | bash
#
#  Installs the CLI FROM THE REPOSITORY (the npm package `brimkern` is the SDK and
#  carries no command): clone or update into ~/.brimkern, install dependencies,
#  build the engine, and put a `brimkern` command in ~/.local/bin.
#
#  Overrides (tests, forks):
#    BRIMKERN_REPO     git URL or local path   (default: GitHub repository)
#    BRIMKERN_REF      branch or tag           (default: main)
#    BRIMKERN_HOME     install directory       (default: ~/.brimkern)
#    BRIMKERN_BIN_DIR  where the command goes  (default: ~/.local/bin)
# ==============================================================================

# Everything lives in main(), called on the last line: a download cut halfway through runs
# nothing, instead of half an installer.
main() {
  set -euo pipefail

  local REPO="${BRIMKERN_REPO:-https://github.com/RomainKH/Brimkern.git}"
  local REF="${BRIMKERN_REF:-main}"
  local HOME_DIR="${BRIMKERN_HOME:-$HOME/.brimkern}"
  local BIN_DIR="${BRIMKERN_BIN_DIR:-$HOME/.local/bin}"

  local RED=$'\033[38;2;239;68;68m' GREEN=$'\033[38;2;74;222;128m' GRAY=$'\033[38;2;161;161;170m'
  local BOLD=$'\033[1m' RESET=$'\033[0m'
  step() { printf '%s▸%s %s\n' "$RED" "$RESET" "$1"; }
  ok()   { printf '%s✓%s %s\n' "$GREEN" "$RESET" "$1"; }
  fail() { printf '\n%s✗ %s%s\n' "$RED" "$1" "$RESET" >&2; [ -n "${2:-}" ] && printf '%s%s%s\n' "$GRAY" "$2" "$RESET" >&2; exit 1; }

  printf '\n%s%sBrimkern CLI%s %s· a coding assistant on your own GPU%s\n\n' "$BOLD" "$RED" "$RESET" "$GRAY" "$RESET"

  # 1. Prerequisites
  local OS; OS="$(uname -s)"
  case "$OS" in
    Darwin|Linux) ok "System: $OS ($(uname -m))" ;;
    *) fail "Unsupported system: $OS" "macOS and Linux only for now (on Windows, use WSL)." ;;
  esac
  command -v git >/dev/null 2>&1 || fail "git is not installed." "macOS: xcode-select --install · Debian/Ubuntu: sudo apt-get install -y git"
  command -v node >/dev/null 2>&1 || fail "Node.js is not installed." "Install Node.js 20 or newer: https://nodejs.org (macOS: brew install node)"
  command -v npm >/dev/null 2>&1 || fail "npm is not installed." "It ships with Node.js: https://nodejs.org"
  local NODE_MAJOR; NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
  [ "$NODE_MAJOR" -ge 20 ] || fail "Node.js $(node -v) is too old." "Brimkern needs Node.js 20 or newer."
  ok "Node.js $(node -v), npm $(npm -v)"

  # 2. Source: fresh clone, or update of an existing install
  if [ -d "$HOME_DIR/.git" ]; then
    step "Updating $HOME_DIR"
    git -C "$HOME_DIR" fetch --quiet --depth 1 origin "$REF"
    git -C "$HOME_DIR" checkout --quiet --force FETCH_HEAD
  else
    [ -e "$HOME_DIR" ] && fail "$HOME_DIR exists and is not a Brimkern install." "Move it away or set BRIMKERN_HOME."
    step "Downloading Brimkern into $HOME_DIR"
    git clone --quiet --depth 1 --branch "$REF" "$REPO" "$HOME_DIR"
  fi
  ok "Source ready ($(git -C "$HOME_DIR" rev-parse --short HEAD))"

  # 3. Dependencies and engine build (the SDK bundle the CLI runs)
  step "Installing dependencies (a few minutes the first time)"
  (cd "$HOME_DIR" && npm install --no-audit --no-fund --loglevel=error >/dev/null)
  step "Building the engine"
  (cd "$HOME_DIR" && npm run --silent build:sdk >/dev/null)
  ok "Engine built"

  # 4. Headless Chromium: needed for GGUF models (the default .brik model runs without it)
  if [ -d "$HOME/Library/Caches/ms-playwright" ] || [ -d "$HOME/.cache/ms-playwright" ] \
     || [ -d "/Applications/Google Chrome.app" ] || command -v google-chrome >/dev/null 2>&1 || command -v chromium >/dev/null 2>&1; then
    ok "Chromium found (for GGUF models)"
  else
    step "Installing headless Chromium (for GGUF models)"
    (cd "$HOME_DIR" && npx --yes playwright install chromium >/dev/null 2>&1) \
      && ok "Chromium installed" \
      || printf '%s  Chromium could not be installed; .brik models still work. Retry: cd %s && npx playwright install chromium%s\n' "$GRAY" "$HOME_DIR" "$RESET"
  fi

  # 5. The `brimkern` command
  mkdir -p "$BIN_DIR"
  cat > "$BIN_DIR/brimkern" <<EOF
#!/bin/sh
exec node "$HOME_DIR/bin/brimkern.mjs" "\$@"
EOF
  chmod +x "$BIN_DIR/brimkern"
  ok "Command installed: $BIN_DIR/brimkern"

  printf '\n%sDone.%s Start it in any project folder:\n\n  %sbrimkern chat%s\n\n' "$BOLD" "$RESET" "$BOLD" "$RESET"
  printf '%sThe first launch downloads the default model once (2.53 GB), then it is read from ~/.cache/brimkern.%s\n' "$GRAY" "$RESET"
  case ":$PATH:" in
    *":$BIN_DIR:"*) ;;
    *) printf '\n%s%s is not in your PATH.%s Add this line to your shell profile (~/.zshrc or ~/.bashrc):\n  export PATH="%s:$PATH"\n' "$RED" "$BIN_DIR" "$RESET" "$BIN_DIR" ;;
  esac
  printf '\n%sUpdate: run the same command again · Uninstall: rm -rf %s %s/brimkern%s\n\n' "$GRAY" "$HOME_DIR" "$BIN_DIR" "$RESET"
}

main "$@"
