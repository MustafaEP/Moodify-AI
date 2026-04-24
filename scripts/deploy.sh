#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/opt/moodifyai"

cd "$PROJECT_DIR"
git pull

docker build -t moodify-ai-backend:latest backend
docker build --build-arg VITE_API_URL="/api" -t moodify-ai-web:latest frontend

cd infra/compose/prod

docker compose -f mongo.compose.yml up -d

echo "MongoDB hazır olana kadar bekleniyor..."
until docker exec moodify-ai-mongo mongosh --eval "db.adminCommand('ping')" --quiet >/dev/null 2>&1; do
  sleep 3
  echo "  ...bekleniyor"
done
echo "MongoDB hazır."

docker compose -f backend.compose.yml up -d
docker compose -f web.compose.yml up -d

echo "Tüm servisler ayağa kalktı."
