package ru.streamevents.mod.command.impl

import com.mojang.brigadier.CommandDispatcher
import com.mojang.brigadier.arguments.StringArgumentType
import com.mojang.brigadier.context.CommandContext
import net.minecraft.commands.CommandSourceStack
import net.minecraft.commands.Commands.argument
import net.minecraft.network.chat.Component
import ru.streamevents.mod.command.ModCommand
import ru.streamevents.mod.ws.SocketManager

class ConnectCommand (
    private val socketManager : SocketManager
) : ModCommand {

    override fun register(dispatcher: CommandDispatcher<CommandSourceStack>) {
        dispatcher.register(
            literal("connect").then(
                argument<String>("token", StringArgumentType.string()).executes {
                    context: CommandContext<CommandSourceStack> ->
                        socketManager.connectSocketIO(StringArgumentType.getString(context, "token"))
                        context.getSource().sendSuccess(
                            { Component.literal("Called /connect.") },
                            false
                        )
                        1
                }
            )
        )
    }
}