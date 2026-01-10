import { Global, Module } from '@nestjs/common';
import { CookieResolver, I18nModule as NestI18nModule } from 'nestjs-i18n';
import { I18nClient } from './infrastructure/i18n.client';
import { publicRuntimeConfig } from '../config';
import * as path from 'path';

@Global()
@Module({
  imports: [
    NestI18nModule.forRoot({
      fallbackLanguage: publicRuntimeConfig.i18n.fallbackLanguage,
      loaderOptions: {
        path: path.join(__dirname, '../../i18n/'),
        watchAssets: true
      },
      resolvers: [new CookieResolver(['lang'])]
    })
  ],
  providers: [I18nClient],
  exports: [I18nClient]
})
export class I18nModule {}
