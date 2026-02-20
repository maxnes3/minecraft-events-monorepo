# 🍗 Streaming Events — Minecraft Fabric Mod

Brief description
- Minecraft mod built with Fabric + Kotlin.
- Provides player authentication via command.
- Connects to external backend server.
- Receives and processes real-time backend events.

---

## Commands

- `/str:connect <token>` — authenticate player against backend
- `/str:disconnect` — terminate session

---

## Requirements

- Minecraft 1.21.11
- Fabric Loader
- Fabric API
- Java 21+
- Backend server running

## How to build jar

```bash
cd mod
./gradlew build
```

The compiled .jar file will be located in the /build/libs directory

## How to run the mod

1. By copying .jar into .minecraft/mods/
2. ./gradlew runClient