import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './shared/logger';
import { HttpModule } from './shared/http';
import { I18nModule } from './shared/i18n';
import { StreamingPlatformsModule } from './streaming-platforms';
import { EventsModule } from './events';
import { UsersModule } from './users';
import { publicRuntimeConfig } from './shared/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: publicRuntimeConfig.mongodb.uri,
        retryAttempts: 3,
        retryDelay: 1000
      })
    }),
    HttpModule,
    LoggerModule,
    I18nModule,
    StreamingPlatformsModule,
    EventsModule,
    UsersModule
  ]
})
export class AppModule {}
