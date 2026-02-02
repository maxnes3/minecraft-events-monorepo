import { Body, Controller, HttpCode, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../application/users.service';
import { formatedHttpResponse } from '@/shared/http';
import { UserRemovePlatformDTO } from '../application/dto/user-remove-platform.dto';
import { publicRuntimeConfig } from '@/shared/config';
import { AuthUser } from '@/auth';

@ApiBearerAuth(publicRuntimeConfig.jwt.authorizationHeader)
@ApiTags('Users Platform')
@Controller('users/platform')
export class UsersPlatformController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Remove Platform from User' })
  @ApiBody({ type: UserRemovePlatformDTO, required: true })
  @Put('/remove')
  @HttpCode(200)
  public async removePlatformFromUser(
    @AuthUser('sub') userId: string,
    @Body() data: UserRemovePlatformDTO
  ) {
    const success = await this.usersService.removePlatformFromUser(
      userId,
      data
    );
    return formatedHttpResponse({ success });
  }
}
