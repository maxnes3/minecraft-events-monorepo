import { Global, Module } from '@nestjs/common';
import { HttpClient } from './infrastructure/http.client';
import { HttpModule as NestAxiosModule } from '@nestjs/axios';
import { HTTP_MAX_REDIRECTS, HTTP_TIMEOUT } from './http.constants';

@Global()
@Module({
  imports: [
    NestAxiosModule.registerAsync({
      useFactory: () => ({
        timeout: HTTP_TIMEOUT,
        maxRedirects: HTTP_MAX_REDIRECTS
      })
    })
  ],
  providers: [HttpClient],
  exports: [HttpClient]
})
export class HttpModule {}
