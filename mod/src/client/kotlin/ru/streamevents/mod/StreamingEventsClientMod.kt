package ru.streamevents.mod

import net.fabricmc.api.ClientModInitializer
import org.slf4j.LoggerFactory


object StreamingEventsClientMod : ClientModInitializer {

	private const val MOD_NAME = "StreamingEventsClientMod"

	private val logger = LoggerFactory.getLogger(MOD_NAME)

	override fun onInitializeClient() {
		logger.info("Initializing StreamingEventsClientMod")
	}
}