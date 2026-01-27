import { AuthService } from '@/auth';
import { LoggerService } from '@/shared/logger';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketUserDTO } from '../domain/dto/websocket-user.dto';
import { WebSocketHandshakeDTO } from '../domain/dto/websocket-handshake.dto';
import { WebSocketEvents } from '../domain/websocket-events.enums';
import { formatWsEmit } from '../utils/formated-ws-emit.util';

@Injectable()
export class WebSocketService {
  private server: Server;
  private connectedUsers: Map<string, WebSocketUserDTO>;

  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService
  ) {
    this.connectedUsers = new Map();
    this.logger.setContext(WebSocketService.name);
  }

  public setServer(server: Server) {
    this.server = server;
    this.logger.debug('WebSocket server initialized');
  }

  public async initConnection(
    client: Socket
  ): Promise<WebSocketUserDTO | null> {
    try {
      const token = this.extractTokenFromSocket(client);

      if (!token) {
        this.logger.warn(
          `Connection rejected: No token provided for socket ${client.id}`
        );
        client.disconnect();
        return null;
      }

      const payload = await this.authService.validateToken(token);

      if (!payload || !payload.sub) {
        this.logger.warn(
          `Connection rejected: Invalid token for socket ${client.id}`
        );
        client.disconnect();
        return null;
      }

      const user: WebSocketUserDTO = {
        userId: payload.sub,
        socketId: client.id,
        connectedAt: new Date()
      };

      this.connectedUsers.set(client.id, user);

      this.logger.debug(
        `User ${user.userId} connected via socket ${client.id}`
      );

      client.emit(
        WebSocketEvents.CONNECTED,
        formatWsEmit({
          event: WebSocketEvents.CONNECTED,
          data: user
        })
      );
      return user;
    } catch (error) {
      this.logger.error(`Connection failed for socket ${client.id}: ${error}`);
      client.emit(
        WebSocketEvents.ERROR,
        formatWsEmit({
          event: WebSocketEvents.ERROR,
          data: { message: 'Authentication failed' }
        })
      );
      client.disconnect();
      return null;
    }
  }

  public disconnect(client: Socket): void {
    const socketId = client.id;
    const user = this.connectedUsers.get(socketId);

    if (user) {
      this.connectedUsers.delete(socketId);
      this.logger.debug(
        `User ${user.userId} disconnected from socket ${socketId}`
      );
    }
  }

  private extractTokenFromSocket(client: Socket): string | null {
    const handshake = client.handshake as unknown as WebSocketHandshakeDTO;

    const authToken =
      typeof handshake.auth?.token === 'string' ? handshake.auth.token : null;

    const headerAuth = handshake.headers?.authorization;
    const headerToken =
      typeof headerAuth === 'string' ? headerAuth.replace('Bearer ', '') : null;

    return authToken || headerToken || null;
  }
}
