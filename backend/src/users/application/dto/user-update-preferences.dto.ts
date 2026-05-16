import { publicRuntimeConfig } from '@app/shared/config';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdatePreferencesDTO {
  @ApiProperty({
    description: 'Language of the user',
    type: String,
    required: false,
    example: publicRuntimeConfig.i18n.fallbackLanguage
  })
  lang?: string;
}
