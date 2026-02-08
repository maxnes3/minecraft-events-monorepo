import { Injectable } from '@nestjs/common';
import { WebSocketUserDTO } from '../application/dto/websocket-user.dto';

@Injectable()
export class WebSocketSessionManager {
  private users: Map<string, WebSocketUserDTO>;
  // Add if users have more than one connection: private userSockets: Map<string, Set<string>> = new Map();

  constructor() {
    this.users = new Map();
  }

  public insertUser(socketId: string, user: WebSocketUserDTO): void {
    const exists = this.users.get(user.userId);
    if (exists) {
      this.removeUserBySocketId(exists.socketId);
    }

    this.users.set(socketId, user);
  }

  public removeUserBySocketId(socketId: string): void {
    this.users.delete(socketId);
  }

  public getUserBySocketId(socketId: string): WebSocketUserDTO | undefined {
    return this.users.get(socketId);
  }
}
