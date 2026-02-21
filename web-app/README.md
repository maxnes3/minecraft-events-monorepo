# 🐦‍🔥 Streaming Events — WebApp

Brief description

- Web Application for the Streaming Events project
- Built with Node.js + NextJS, package manager — pnpm.

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
cd web-app
pnpm install --frozen-lockfile
cp .env.common .env.local   # configure values
pnpm run dev
```

Running in Docker (recommended for local environment)

- Quick start (script) for MacOS | Linux:

```bash
chmod +x ./scripts/start-docker.sh # only first start
./scripts/start-docker.sh
```

- Or Windows:

```powershell
./scripts/start-docker.bat
```

- Manual start:

```bash
cd web-app/docker
docker compose -f docker-compose.local.yml up --build
```

Build the image manually

```bash
cd web-app
docker build -f docker/Dockerfile -t streaming-events-web-app .
```
