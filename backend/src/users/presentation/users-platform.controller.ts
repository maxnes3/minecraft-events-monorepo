import { Body, Controller, Get, HttpCode, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../application/users.service';
import { formatedHttpResponse } from '@/shared/http';
import { UserConnectPlatformDTO } from '../application/dto/user-connect-platform.dto';
import { UserRemovePlatformDTO } from '../application/dto/user-remove-platform.dto';
import { publicRuntimeConfig } from '@/shared/config';
import { User } from '@/auth';

@ApiBearerAuth(publicRuntimeConfig.jwt.authorizationHeader)
@ApiTags('Users Platform')
@Controller('users/platform')
export class UsersPlatformController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get User by Platform Name and Id' })
  @Get('/:name/:id')
  @HttpCode(200)
  public async getUserByPlatformNameAndId(
    @Param('name') platformName: string,
    @Param('id') platformId: string
  ) {
    const user = await this.usersService.getUserByPlatformNameAndId(
      platformName,
      platformId
    );
    if (!user) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: user });
  }

  @ApiOperation({ summary: 'Connect User to Platform' })
  @ApiBody({ type: UserConnectPlatformDTO, required: true })
  @Put('/connect')
  @HttpCode(200)
  public async connectPlatformToUser(
    @User('sub') userId: string,
    @Body() data: UserConnectPlatformDTO
  ) {
    const success = await this.usersService.connectPlatformToUser(userId, data);
    return formatedHttpResponse({ success });
  }

  @ApiOperation({ summary: 'Remove Platform from User' })
  @ApiBody({ type: UserRemovePlatformDTO, required: true })
  @Put('/remove')
  @HttpCode(200)
  public async removePlatformFromUser(
    @User('sub') userId: string,
    @Body() data: UserRemovePlatformDTO
  ) {
    const success = await this.usersService.removePlatformFromUser(
      userId,
      data
    );
    return formatedHttpResponse({ success });
  }
}
