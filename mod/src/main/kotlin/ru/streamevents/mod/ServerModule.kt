package ru.streamevents.mod

import org.koin.dsl.bind
import org.koin.dsl.module
import ru.streamevents.mod.command.ModCommand
import ru.streamevents.mod.command.impl.ConnectCommand
import ru.streamevents.mod.command.impl.DisconnectCommand
import ru.streamevents.mod.ws.SocketManager

val serverModule = module {

    single { SocketManager() }

    single { ConnectCommand(get()) } bind ModCommand::class
    single { DisconnectCommand(get()) } bind ModCommand::class
}