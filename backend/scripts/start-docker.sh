#!/bin/bash
set -e

cd "$(dirname "$0")/../docker"

docker compose -f docker-compose.local.yml up --build