package ru.streamevents.mod.command.impl

import com.mojang.brigadier.CommandDispatcher
import com.mojang.brigadier.context.CommandContext
import net.minecraft.commands.CommandSourceStack
import net.minecraft.network.chat.Component
import ru.streamevents.mod.command.ModCommand
import ru.streamevents.mod.ws.SocketManager

class DisconnectCommand (
    private val socketManager : SocketManager
) : ModCommand {

    override fun register(dispatcher: CommandDispatcher<CommandSourceStack>) {
        dispatcher.register(
            literal("disconnect").executes {
                context: CommandContext<CommandSourceStack?> ->
                    socketManager.disconnectSocketIO()
                    context.getSource()?.sendSuccess(
                        { Component.literal("Called /disconnect.") },
                        false
                    )
                    1
            }
        )
    }
}