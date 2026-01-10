import { Module } from '@nestjs/common';
import { LoggerModule } from './shared/logger';
import { HttpModule } from './shared/http';
import { I18nModule } from './shared/i18n';
import { StreamingPlatformsModule } from './streaming-platforms';
import { EventsModule } from './events';

@Module({
  imports: [
    HttpModule,
    LoggerModule,
    I18nModule,
    StreamingPlatformsModule,
    EventsModule
  ]
})
export class AppModule {}
