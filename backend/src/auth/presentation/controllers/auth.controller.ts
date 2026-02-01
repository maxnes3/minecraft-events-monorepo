import { AuthService } from '@/auth/application/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { AuthRefreshTokensDTO } from '@/auth/application/dto/auth-refresh-tokens.dto';
import { formatedHttpResponse } from '@/shared/http';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Refresh authentication tokens' })
  @ApiBody({ type: AuthRefreshTokensDTO, required: true })
  @Post('refresh-tokens')
  public async refreshToken(@Body() data: AuthRefreshTokensDTO) {
    const tokens = await this.authService.refreshTokens(data.refreshToken);
    return formatedHttpResponse({ success: true, data: tokens });
  }
}
