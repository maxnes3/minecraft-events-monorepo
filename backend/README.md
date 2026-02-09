# 🍰 Streaming Events — Backend

![Twitch](https://img.shields.io/badge/Twitch-9146FF?style=for-the-badge&logo=twitch&logoColor=white)
![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

Brief description
- Backend for the Streaming Events project: API and integrations (Twitch, etc.).
- Built with Node.js + NestJS, package manager — pnpm.

Requirements
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
- Quick start (script) for MacOS | Linux:
```bash
./scripts/start-docker.sh
```
Or Windows:
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
docker build -f docker/Dockerfile -t streaming-events-backend .
```

Notes
- .dockerignore affects only the build context (files sent to the image during build). When using a bind mount (volumes: ../:/app), local files are mounted over the container contents — changes become visible without rebuilding.
- For security, do not send secrets via URLs — use headers or secure environment variables.