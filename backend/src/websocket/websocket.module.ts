import { Module } from '@nestjs/common';
import { WebSocketService } from './application/websocket.service';
import { UsersModule } from '@/users';
import { EventsModule } from '@/events';
import { WebSocketGateway } from './infrastructure/websocket.gateway';
import { AuthModule } from '@/auth';

@Module({
  imports: [AuthModule, UsersModule, EventsModule],
  providers: [WebSocketGateway, WebSocketService]
})
export class WebSocketModule {}
