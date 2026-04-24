#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/opt/moodify-ai"

sudo mkdir -p "$PROJECT_DIR"
sudo chown -R "$USER:$USER" "$PROJECT_DIR"

if ! docker network inspect edge >/dev/null 2>&1; then
  docker network create edge
fi

echo "Setup complete. Copy project files into $PROJECT_DIR and create .env."
