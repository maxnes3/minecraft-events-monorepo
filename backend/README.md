# Minecraft Events — Backend

Brief description
- Backend for the Minecraft Events project: API and integrations (Twitch, etc.).
- Built with Node.js + NestJS, package manager — pnpm.

Requirements
- macOS
- Docker & Docker Compose
- Node.js 22 (for local development)
- pnpm

Environment variables
- Files:
  - .env.common
  - .env.local
- Expected variables are described in the codebase (see /src and configs).

Local installation
```bash
cd backend
pnpm install --frozen-lockfile
cp .env.common .env.local   # configure values
pnpm run start:dev
```

Running in Docker (recommended for local environment)
- Quick start (script):
```bash
./scripts/start-docker.sh
```
Or
```powershell
./scripts/start-docker.bat
```
- Manual start:
```bash
cd backend/docker
docker compose -f docker-compose.local.yml up --build
```

Build the image manually
```bash
cd backend
docker build -f docker/Dockerfile -t minecraft-events-backend .
```

Notes
- .dockerignore affects only the build context (files sent to the image during build). When using a bind mount (volumes: ../:/app), local files are mounted over the container contents — changes become visible without rebuilding.
- For security, do not send secrets via URLs — use headers or secure environment variables.