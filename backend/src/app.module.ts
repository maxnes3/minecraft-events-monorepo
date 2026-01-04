import { Module } from '@nestjs/common';
import { LoggerModule } from './logger';

@Module({
  imports: [LoggerModule],
  controllers: [],
  providers: []
})
export class AppModule {}
