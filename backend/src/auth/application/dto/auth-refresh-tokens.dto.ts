import { ApiProperty } from '@nestjs/swagger';

export class AuthRefreshTokensDTO {
  @ApiProperty({
    description: 'Refresh token',
    type: String,
    required: true,
    example: 'jwt-refresh-token-example'
  })
  refreshToken: string;
}
