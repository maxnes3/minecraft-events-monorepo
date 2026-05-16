import { Controller, Delete, Get, HttpCode, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { formatedHttpResponse } from '@app/shared/http';
import { publicRuntimeConfig } from '@app/shared/config';
import { AuthUser } from '@app/auth';
import { UsersService } from '../application/users.service';
import { UserUpdatePreferencesDTO } from '../application/dto/user-update-preferences.dto';
import { UserPresentationMapper } from './mappers/users-presentation.mapper';

@ApiBearerAuth(publicRuntimeConfig.jwt.authorizationHeader)
@ApiTags('Users Manage')
@Controller('users/me')
export class UsersManageController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userPresentationMapper: UserPresentationMapper
  ) {}

  @ApiOperation({ summary: 'Get User' })
  @Get()
  @HttpCode(200)
  public async getUserById(@AuthUser('sub') userId: string) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({
      success: true,
      data: this.userPresentationMapper.toPresentationDTO(user)
    });
  }

  @ApiOperation({ summary: 'Delete exists User' })
  @Delete()
  @HttpCode(200)
  public async deleteUserById(@AuthUser('sub') userId: string) {
    const success = await this.usersService.deleteUserById(userId);
    return formatedHttpResponse({ success });
  }

  @ApiOperation({ summary: 'Get User GameConnectToken' })
  @Get('/game-connect-token')
  @HttpCode(200)
  public async getGameConnectToken(@AuthUser('sub') userId: string) {
    const gameConnectToken =
      await this.usersService.getUserGameConnectToken(userId);
    if (!gameConnectToken) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({
      success: true,
      data: gameConnectToken
    });
  }

  @ApiOperation({ summary: 'Update User preferences' })
  @ApiBody({ type: UserUpdatePreferencesDTO, required: true })
  @Put('/preferences')
  @HttpCode(200)
  public async updateUserPreferences(
    @AuthUser('sub') userId: string,
    data: UserUpdatePreferencesDTO
  ) {
    const user = await this.usersService.updateUserPreferences(userId, data);
    if (!user) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({
      success: true,
      data: this.userPresentationMapper.toPresentationDTO(user)
    });
  }
}
