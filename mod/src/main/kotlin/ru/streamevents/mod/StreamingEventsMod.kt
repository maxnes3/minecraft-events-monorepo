package ru.streamevents.mod

import net.fabricmc.api.ModInitializer
import org.koin.core.context.startKoin
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import ru.streamevents.mod.command.CommandRegistrar

object StreamingEventsMod : ModInitializer {

	private const val MOD_NAME = "StreamingEventsMod"

    val log: Logger = LoggerFactory.getLogger(MOD_NAME)

	override fun onInitialize() {
        log.info("Initializing StreamingEventsMod")

		startKoin {
			modules(serverModule)
		}
		CommandRegistrar.registerAll()
	}
}

// TODO ошибки в чат
// TODO include транзитивных зависимостей
// TODO лог в чат помимо log файла