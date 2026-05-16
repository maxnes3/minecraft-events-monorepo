import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslateOptions } from '../domain/i18n-translate-options.interface';

@Injectable()
export class I18nClient {
  constructor(private readonly i18n: I18nService) {}

  public translate(key: string, options?: I18nTranslateOptions): string {
    return this.i18n.translate(key, {
      lang: options?.lang,
      args: options?.args
    });
  }

  public getSupportedLanguages(): string[] {
    return this.i18n.getSupportedLanguages();
  }
}
