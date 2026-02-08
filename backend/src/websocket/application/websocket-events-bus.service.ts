import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import {
  WebSocketEventPayload,
  WebSocketHandler,
  WebSocketHandlers
} from '../domain/websocket-handler.types';
import { LoggerService } from '@app/shared/logger';

@Injectable()
export class WebSocketEventsBusService {
  private server: Server;
  private handlers = new Map<string, WebSocketHandler<any>>();

  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(WebSocketEventsBusService.name);
  }

  public setServer(server: Server): void {
    this.server = server;
  }

  public registerHandler<T = any>(event: string, handler: WebSocketHandler<T>) {
    if (this.handlers.has(event)) {
      this.logger.warn(
        `Handler for event "${event}" already registered, overwriting`
      );
    }

    this.handlers.set(event, handler);
    this.logger.debug(`Registered handler for event: ${event}`);
  }

  public registerHandlers(handlers: WebSocketHandlers): void {
    Object.entries(handlers).forEach(([event, handler]) => {
      this.registerHandler(event, handler);
    });
  }

  public async dispatchEvent<T = any>(
    event: string,
    payload: WebSocketEventPayload<T>
  ) {
    const handler = this.handlers.get(event);
    if (!handler) {
      const error = `No handler registered for event: ${event}`;
      this.logger.error(error);
      throw new Error(error);
    }

    try {
      const result = await handler(payload);
      return result;
    } catch (error) {
      this.logger.error(`Error handling event "${event}":`, error);
      throw error;
    }
  }

  public hasHandler(event: string): boolean {
    return this.handlers.has(event);
  }

  public getRegisteredEvents(): string[] {
    return Array.from(this.handlers.keys());
  }
}
