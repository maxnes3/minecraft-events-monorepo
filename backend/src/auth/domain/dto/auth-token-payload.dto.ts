import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenPayloadDTO {
  @ApiProperty({
    description: 'Subject (user ID)',
    type: String,
    example: 'user-id-example'
  })
  sub: string;

  @ApiProperty({
    description: 'Token type',
    type: String,
    example: 'access'
  })
  type?: string;

  @ApiProperty({
    description: 'Issued at timestamp',
    type: Number,
    example: 1633024800
  })
  iat?: number;

  @ApiProperty({
    description: 'Expiration timestamp',
    type: Number,
    example: 1633028400
  })
  exp?: number;
}
