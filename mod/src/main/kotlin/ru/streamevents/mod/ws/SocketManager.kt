package ru.streamevents.mod.ws

import io.socket.client.IO
import io.socket.client.Socket
import org.json.JSONObject
import ru.streamevents.mod.StreamingEventsMod.log

class SocketManager {
    lateinit var socket: Socket

    fun connectSocketIO(token: String) {

        val opts = IO.Options().apply {
            extraHeaders =
                mapOf("Authorization" to listOf(token))
        }

        // TODO посмотреть как работают переменные среды с модами,
        // чтобы такого не было
        socket = IO.socket("ws://localhost:3000/?platform=twitch&EIO=4&transport=websocket", opts)

        socket.on(Socket.EVENT_CONNECT) {
            log.info("Socket.IO подключение установлено")
            socket.emit("message", JSONObject().put("text", "Hello server"))
        }

        socket.on(Socket.EVENT_CONNECT_ERROR) {
            log.info("Socket.IO соединение ")
        }

        socket.on(Socket.EVENT_DISCONNECT) {
            log.info("Socket.IO соединение прервано")
        }

        socket.connect()
    }

    fun disconnectSocketIO() {
        try {
            socket.disconnect()
        } catch(e:Exception) {
            log.error(e.message)
        }
    }
}
