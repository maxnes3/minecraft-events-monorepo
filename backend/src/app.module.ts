import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './shared/logger';
import { HttpModule } from './shared/http';
import { I18nModule } from './shared/i18n';
import { StreamingPlatformsModule } from './streaming-platforms';
import { EventsModule } from './events';
import { UsersModule } from './users';
import { WebSocketModule } from './websocket';
import { initMongooseAsyncConfig } from './shared/config';
import { AuthGuard, AuthModule } from './auth';

@Module({
  imports: [
    MongooseModule.forRootAsync(initMongooseAsyncConfig),
    HttpModule,
    LoggerModule,
    I18nModule,
    StreamingPlatformsModule,
    EventsModule,
    AuthModule,
    UsersModule,
    WebSocketModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}
