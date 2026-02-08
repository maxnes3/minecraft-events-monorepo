import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthService } from '@app/auth';
import { LoggerService } from '@app/shared/logger';
import { WebSocketUserDTO } from './dto/websocket-user.dto';
import { WebSocketHandshakeDTO } from './dto/websocket-handshake.dto';
import {
  WebSocketPublishEvents,
  WebSocketSubscribeEvents
} from '../domain/websocket-events.enums';
import { WebSocketSessionManager } from '../infrastructure/websocket-session.manager';
import { formatWsEmit } from '../utils/formated-ws-emit.util';
import { WebSocketEventsBusService } from './websocket-events-bus.service';
import {
  WebSocketEventPayload,
  WebSocketEventResult
} from '../domain/websocket-handler.types';

@Injectable()
export class WebSocketService {
  private server: Server;

  constructor(
    private readonly websocketEventsBusService: WebSocketEventsBusService,
    private readonly websocketSessionManager: WebSocketSessionManager,
    private readonly authService: AuthService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(WebSocketService.name);
  }

  public setServer(server: Server) {
    this.server = server;
    this.websocketEventsBusService.setServer(server);
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

      const platform = this.extractQueryParamFromSocket(client, 'platform');
      if (!platform) {
        this.logger.warn(
          `Connection rejected: No platform at query params for socket ${client.id}`
        );
        client.disconnect();
        return null;
      }

      const user: WebSocketUserDTO = {
        userId: payload.sub,
        socketId: client.id,
        platform,
        connectedAt: new Date()
      };
      this.websocketSessionManager.insertUser(user.socketId, user);
      this.logger.debug(
        `User ${user.userId} connected via socket ${client.id}`
      );

      const result = await this.forwardToModule(
        client,
        WebSocketSubscribeEvents.STREAMING_PLATFORM_INIT,
        { platform }
      );
      if (!result.success) {
        this.logger.warn(
          `Connection rejected: Platform ${platform} not connected`
        );
        client.disconnect();
        return null;
      }

      client.emit(
        WebSocketPublishEvents.CONNECTED,
        formatWsEmit({
          event: WebSocketPublishEvents.CONNECTED,
          data: user
        })
      );
      return user;
    } catch (error) {
      this.logger.error(`Connection failed for socket ${client.id}: ${error}`);
      client.emit(
        WebSocketPublishEvents.ERROR,
        formatWsEmit({
          event: WebSocketPublishEvents.ERROR,
          data: { message: 'Authentication failed' }
        })
      );
      client.disconnect();
      return null;
    }
  }

  public async disconnect(client: Socket): Promise<void> {
    const socketId = client.id;
    const user = this.websocketSessionManager.getUserBySocketId(socketId);
    if (!user) {
      return;
    }

    await this.forwardToModule(
      client,
      WebSocketSubscribeEvents.STREAMING_PLATFORM_CLOSE,
      { platform: user.platform }
    );

    this.websocketSessionManager.removeUserBySocketId(socketId);
    this.logger.debug(
      `User ${user.userId} disconnected from socket ${socketId}`
    );
  }

  public async forwardToModule<T = any>(
    client: Socket,
    event: string,
    data: T
  ): Promise<WebSocketEventResult> {
    const user = this.websocketSessionManager.getUserBySocketId(client.id);
    if (!user) {
      client.emit(
        WebSocketPublishEvents.ERROR,
        formatWsEmit({
          event: WebSocketPublishEvents.ERROR,
          data: {
            message: 'Not authenticated'
          }
        })
      );
      return { success: false };
    }

    try {
      const payload: WebSocketEventPayload<T> = {
        userId: user.userId,
        socketId: client.id,
        data
      };
      const result = await this.websocketEventsBusService.dispatchEvent(
        event,
        payload
      );
      return result;
    } catch (error) {
      this.logger.error(`Message handling error:`, error);
      client.emit(
        WebSocketPublishEvents.ERROR,
        formatWsEmit({
          event: WebSocketPublishEvents.ERROR,
          data: {
            message: 'Error while handling request'
          }
        })
      );
      return { success: false };
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

  private extractQueryParamFromSocket(
    client: Socket,
    paramName: string
  ): string | null {
    const handshake = client.handshake as unknown as WebSocketHandshakeDTO;
    return handshake.query[paramName];
  }
}
