# 🍗 Streaming Events — Minecraft Fabric Mod

Brief description

- Minecraft mod built with Fabric + Kotlin.
- Provides player authentication via command.
- Connects to external backend server.
- Receives and processes real-time backend events.

---

## Commands

- `/str:connect <token>` — authenticate player against backend by token from web-app
- `/str:disconnect` — terminate session

---

## Requirements

- Minecraft 1.21.11
- Fabric Loader
- Fabric API
- Java 21+
- Backend server running

## How to build jar

- Build jar for MacOS | Linux:

```bash
cd mod
chmod +x ./gradlew # only first start
./gradlew clean build
```

- Or Windows:

```powershell
cd mod
./gradlew clean build
```

The compiled .jar file will be located in the /build/libs directory

## How to run the mod

- Run Mod in testing environment

1. By copying .jar into .minecraft/mods/
2. ./gradlew runClient

- Or Minecraft from Launcher

1. Download fabric-api.jar and fabric-language-kotlin.jar into .minecraft/mods/
2. By copying .jar into .minecraft/mods/
3. Run Minecraft from Launcher

## Useful info

1. Full dependency tree by include()

## Useful links

- [Download fabric-api](https://www.curseforge.com/minecraft/mc-mods/fabric-api)
- [Download fabric-language-kotlin](https://www.curseforge.com/minecraft/mc-mods/fabric-language-kotlin)
