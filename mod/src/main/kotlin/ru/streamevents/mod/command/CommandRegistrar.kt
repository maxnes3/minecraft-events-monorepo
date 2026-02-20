package ru.streamevents.mod.command

import net.fabricmc.fabric.api.command.v2.CommandRegistrationCallback
import org.koin.core.component.KoinComponent

object CommandRegistrar : KoinComponent {

    fun registerAll() {

        CommandRegistrationCallback.EVENT.register { dispatcher, _, _ ->

            val commands: List<ModCommand> = getKoin().getAll()

            commands.forEach {
                it.register(dispatcher)
            }
        }
    }
}