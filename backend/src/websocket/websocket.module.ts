import { Module } from '@nestjs/common';
import { UsersModule } from '@app/users';
import { AuthModule } from '@app/auth';
import { WebSocketService } from './application/websocket.service';
import { WebSocketGateway } from './presentation/websocket.gateway';
import { WebSocketSessionManager } from './infrastructure/websocket-session.manager';
import { WebSocketEventsBusService } from './application/websocket-events-bus.service';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [
    WebSocketEventsBusService,
    WebSocketService,
    WebSocketSessionManager,
    WebSocketGateway
  ],
  exports: [WebSocketEventsBusService]
})
export class WebSocketModule {}
