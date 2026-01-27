import {
  WebSocketGateway as NestWebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketService } from '../application/websocket.service';

@NestWebSocketGateway()
export class WebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly webSocketService: WebSocketService) {}

  public async handleConnection(client: Socket) {
    return await this.webSocketService.initConnection(client);
  }

  public handleDisconnect(client: Socket) {
    this.webSocketService.disconnect(client);
  }
}
