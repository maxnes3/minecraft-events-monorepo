package ru.streamevents.mod.command

import com.mojang.brigadier.CommandDispatcher
import com.mojang.brigadier.builder.LiteralArgumentBuilder
import net.minecraft.commands.CommandSourceStack

interface ModCommand {
    fun register(dispatcher: CommandDispatcher<CommandSourceStack>)

    fun literal(literal: String) : LiteralArgumentBuilder<CommandSourceStack?> {
        return LiteralArgumentBuilder.literal<CommandSourceStack?>(COMMAND_PREFIX + literal)
    }

    companion object {
        const val COMMAND_PREFIX = "str:"
    }
}