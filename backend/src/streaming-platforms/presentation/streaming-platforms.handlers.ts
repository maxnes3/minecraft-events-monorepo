import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from '@app/users';
import {
  WebSocketEventsBusService,
  WebSocketHandler,
  WebSocketSubscribeEvents
} from '@app/websocket';
import { publicRuntimeConfig } from '@app/shared/config';
import { I18nClient } from '@app/shared/i18n';
import { LoggerService } from '@app/shared/logger';
import { StreamingPlatformsFactory } from '../infrastructure/streaming-platforms.factory';
import { StreamingPlatformInitConnectionDTO } from '../domain/dto/streaming-platform-init-connection.dto';
import { StreamingPlatforms } from '../infrastructure/streaming-platforms.enums';
import { StreamingPlatformDisconnectionDTO } from '../domain/dto/streaming-platform-disconnection.dto';

@Injectable()
export class StreamingPlatformsHandlers implements OnModuleInit {
  constructor(
    private readonly streamingPlatformsFactory: StreamingPlatformsFactory,
    private readonly webSocketEventsBusService: WebSocketEventsBusService,
    private readonly usersService: UsersService,
    private readonly i18nClient: I18nClient,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(StreamingPlatformsHandlers.name);
  }

  public onModuleInit() {
    this.webSocketEventsBusService.registerHandler<StreamingPlatformInitConnectionDTO>(
      WebSocketSubscribeEvents.STREAMING_PLATFORM_INIT,
      this.handleInitPlatformConnection.bind(this)
    );
    this.webSocketEventsBusService.registerHandler<StreamingPlatformDisconnectionDTO>(
      WebSocketSubscribeEvents.STREAMING_PLATFORM_CLOSE,
      this.handlePlatformDisconnection.bind(this)
    );
  }

  public handleInitPlatformConnection: WebSocketHandler<StreamingPlatformInitConnectionDTO> =
    async (payload) => {
      const message = this.getMessage('messages.websocket.connected', {
        appName: publicRuntimeConfig.application.name,
        platformName: payload.data.platform
      });

      const platformData =
        await this.usersService.getPlatformDataByUserIdAndPlatformName(
          payload.userId,
          payload.data.platform
        );
      if (!platformData) {
        this.logger.error(`Platform data for user ${payload.userId} not found`);
        return { success: false };
      }

      const success = await this.streamingPlatformsFactory
        .getService(payload.data.platform as StreamingPlatforms)
        .sendMessage(
          { message },
          {
            accessToken: platformData.auth.accessToken,
            platformId: platformData.id
          }
        );
      return {
        success
      };
    };

  public handlePlatformDisconnection: WebSocketHandler<StreamingPlatformDisconnectionDTO> =
    async (payload) => {
      const message = this.getMessage('messages.websocket.disconnected', {
        appName: publicRuntimeConfig.application.name,
        platformName: payload.data.platform
      });

      const platformData =
        await this.usersService.getPlatformDataByUserIdAndPlatformName(
          payload.userId,
          payload.data.platform
        );
      if (!platformData) {
        this.logger.error(`Platform data for user ${payload.userId} not found`);
        return { success: false };
      }

      const success = await this.streamingPlatformsFactory
        .getService(payload.data.platform as StreamingPlatforms)
        .sendMessage(
          { message },
          {
            accessToken: platformData.auth.accessToken,
            platformId: platformData.id
          }
        );
      return {
        success
      };
    };

  private getMessage(
    tKey: string,
    args: Record<string, any> = {},
    lang: string = publicRuntimeConfig.i18n.fallbackLanguage
  ): string {
    return this.i18nClient.translate(tKey, {
      lang,
      args
    });
  }
}
