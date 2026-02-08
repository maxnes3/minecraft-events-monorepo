import {
  WebSocketGateway as NestWebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketService } from '../application/websocket.service';
import { publicRuntimeConfig } from '@app/shared/config';

@NestWebSocketGateway({
  namespace: publicRuntimeConfig.application.apiPrefix,
  cors: {
    origin: '*',
    credentials: true
  },
  transports: ['websocket', 'polling']
})
export class WebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly webSocketService: WebSocketService) {}

  public afterInit() {
    this.webSocketService.setServer(this.server);
  }

  public async handleConnection(client: Socket) {
    return await this.webSocketService.initConnection(client);
  }

  public async handleDisconnect(client: Socket) {
    await this.webSocketService.disconnect(client);
  }
}
