#!/usr/bin/env bash
# ==============================================================================
#  BRIMKERN UNIVERSAL INSTALLER
#  Inférence WebGPU on-device en WGSL dans votre terminal.
#  Usage:
#    curl -fsSL https://brimkern.com/install.sh | bash
# ==============================================================================

set -e

# Couleurs ANSI "Le Kern"
RED='\033[38;2;239;68;68m'
BOLD='\033[1m'
GRAY='\033[38;2;161;161;170m'
DIM='\033[2m'
GREEN='\033[38;2;74;222;128m'
YELLOW='\033[38;2;234;179;8m'
CYAN='\033[38;2;56;189;248m'
RESET='\033[0m'

print_banner() {
  echo -e "${RED}${BOLD}"
  cat << "EOF"
██████╗ ██████╗ ██╗███╗   ███╗██╗  ██╗███████╗██████╗ ███╗   ██╗
██╔══██╗██╔══██╗██║████╗ ████║██║ ██╔╝██╔════╝██╔══██╗████╗  ██║
██████╔╝██████╔╝██║██╔████╔██║█████═╝ █████╗  ██████╔╝██╔██╗ ██║
██╔══██╗██╔══██╗██║██║╚██╔╝██║██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╗██║
██████╔╝██║  ██║██║██║ ╚═╝ ██║██║ ╚██╗███████╗██║  ██║██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
EOF
  echo -e "${RESET}"
  echo -e "${GRAY}Moteur d'inférence WebGPU & WGSL on-device pour le terminal${RESET}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n"
}

main() {
  print_banner

  # 1. Détection de l'OS et de l'architecture
  OS="$(uname -s)"
  ARCH="$(uname -m)"
  echo -e "${CYAN}▸${RESET} Détection système : ${BOLD}${OS} (${ARCH})${RESET}"

  # 2. Vérification de Node.js
  if ! command -v node >/dev/null 2>&1; then
    echo -e "\n${RED}✗ Node.js est introuvable.${RESET}"
    echo -e "${GRAY}Brimkern requiert Node.js 18 ou supérieur.${RESET}"
    if [ "$OS" = "Darwin" ]; then
      echo -e "${YELLOW}Installez-le avec Homebrew :${RESET} brew install node"
    elif command -v apt-get >/dev/null 2>&1; then
      echo -e "${YELLOW}Installez-le avec APT :${RESET} sudo apt-get update && sudo apt-get install -y nodejs npm"
    else
      echo -e "${YELLOW}Installez-le via nvm ou depuis :${RESET} https://nodejs.org"
    fi
    exit 1
  fi

  NODE_VERSION=$(node -v | sed 's/v//')
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'.' -f1)
  if [ "$NODE_MAJOR" -lt 18 ]; then
    echo -e "${YELLOW}⚠ Attention : Node.js version $NODE_VERSION détectée. Version 18+ recommandée.${RESET}"
  else
    echo -e "${GREEN}✓${RESET} Node.js version ${NODE_VERSION} détectée."
  fi

  # 3. Vérification de npm
  if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}✗ npm est introuvable.${RESET}"
    exit 1
  fi

  # 4. Installation globale de brimkern
  echo -e "\n${CYAN}▸${RESET} Installation du paquet ${BOLD}brimkern${RESET}..."

  INSTALL_CMD="npm install -g brimkern"
  if ! $INSTALL_CMD 2>/dev/null; then
    echo -e "${YELLOW}Droits d'écriture requis, tentative avec sudo ou préfixe utilisateur...${RESET}"
    if command -v sudo >/dev/null 2>&1; then
      sudo npm install -g brimkern
    else
      npm install -g --prefix "$HOME/.local" brimkern
      export PATH="$HOME/.local/bin:$PATH"
    fi
  fi

  echo -e "${GREEN}✓${RESET} Paquet ${BOLD}brimkern${RESET} installé avec succès."

  # 5. Vérification de l'accélération matérielle WebGPU
  echo -e "\n${CYAN}▸${RESET} Configuration de l'accélération matérielle WebGPU..."
  if node -e "import('webgpu').then(() => process.exit(0)).catch(() => process.exit(1))" 2>/dev/null; then
    echo -e "${GREEN}✓${RESET} Moteur natif Google Dawn actif (exécution in-process, démarrage instantané <1s)."
  else
    echo -e "${GRAY}Bindings natifs Dawn optionnels, vérification du repli Chromium headless...${RESET}"
    CHROME_FOUND=false

    if [ "$OS" = "Darwin" ]; then
      if [ -d "/Applications/Google Chrome.app" ] || [ -d "$HOME/Library/Caches/ms-playwright" ]; then
        CHROME_FOUND=true
      fi
    elif [ "$OS" = "Linux" ]; then
      if command -v google-chrome >/dev/null 2>&1 || command -v chromium >/dev/null 2>&1 || [ -d "$HOME/.cache/ms-playwright" ]; then
        CHROME_FOUND=true
      fi
    fi

    if [ "$CHROME_FOUND" = false ]; then
      echo -e "${GRAY}Chromium avec WebGPU n'est pas encore installé dans votre profil.${RESET}"
      echo -e "${CYAN}▸${RESET} Téléchargement du runtime Chromium (Playwright)..."
      npx -y playwright install chromium || true
    else
      echo -e "${GREEN}✓${RESET} Environnement Chromium WebGPU détecté."
    fi
  fi

  # 6. Message de succès & instructions
  echo -e "\n${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${GREEN}${BOLD}Installation terminée avec succès !${RESET}\n"
  echo -e "${BOLD}Essayez dès maintenant dans votre terminal :${RESET}"
  echo -e "  ${CYAN}brimkern${RESET} \"Écris une fonction de tri rapide en TypeScript\""
  echo -e "  ${CYAN}git diff | brimkern${RESET} \"Rédige un message de commit concis\""
  echo -e "  ${CYAN}brimkern chat${RESET}                        ${GRAY}# REPL interactif avec mémoire${RESET}"
  echo -e "  ${CYAN}brimkern models${RESET}                      ${GRAY}# Liste des modèles légers .brik${RESET}\n"
  echo -e "${GRAY}Documentation complète & astuces : ${BOLD}https://brimkern.com/cli${RESET}\n"
}

main "$@"
