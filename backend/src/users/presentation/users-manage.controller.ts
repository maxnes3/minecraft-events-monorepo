import { Controller, Delete, Get, HttpCode, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../application/users.service';
import { UserUpdatePreferencesDTO } from '../application/dto/user-update-preferences.dto';
import { formatedHttpResponse } from '@/shared/http';
import { publicRuntimeConfig } from '@/shared/config';
import { User } from '@/auth';
import { UserPresentationMapper } from './mappers/users-presentation.mapper';

@ApiBearerAuth(publicRuntimeConfig.jwt.authorizationHeader)
@ApiTags('Users Manage')
@Controller('users')
export class UsersManageController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userPresentationMapper: UserPresentationMapper
  ) {}

  @ApiOperation({ summary: 'Get User' })
  @Get('/me')
  @HttpCode(200)
  public async getUserById(@User('sub') userId: string) {
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
  @Delete('/me')
  @HttpCode(200)
  public async deleteUserById(@User('sub') userId: string) {
    const success = await this.usersService.deleteUserById(userId);
    return formatedHttpResponse({ success });
  }

  @ApiOperation({ summary: 'Update User preferences' })
  @ApiBody({ type: UserUpdatePreferencesDTO, required: true })
  @Put('/me/preferences')
  @HttpCode(200)
  public async updateUserPreferences(
    @User('sub') userId: string,
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
