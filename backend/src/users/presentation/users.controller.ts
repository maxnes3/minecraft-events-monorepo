import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../application/users.service';
import { UserCreateDTO } from '../application/dto/user-create.dto';
import { formatedHttpResponse } from '@/shared/http';
import { UserUpdateDTO } from '../application/dto/user-update.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User Id', type: String })
  @Get('/:id')
  @HttpCode(200)
  public async getUserById(@Param('id') userId: string) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: user });
  }

  @ApiOperation({ summary: 'Create new user' })
  @Post()
  @HttpCode(200)
  public async createUser(@Body() data: UserCreateDTO) {
    const user = await this.usersService.createUser(data);
    if (!user) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: user });
  }

  @ApiOperation({ summary: 'Update user data by id' })
  @ApiParam({ name: 'id', description: 'User Id', type: String })
  @Put('/:id')
  @HttpCode(200)
  public async updateUser(
    @Param('id') userId: string,
    @Body() data: UserUpdateDTO
  ) {
    const user = await this.usersService.updateUser(userId, data);
    if (!user) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: user });
  }

  @ApiOperation({ summary: 'Connect user with Twitch by id' })
  @ApiParam({ name: 'id', description: 'User Id', type: String })
  @ApiParam({ name: 'twitch_id', description: 'Twitch Id', type: String })
  @Put('/:id/connect-twitch/:twitch_id')
  @HttpCode(200)
  public async connectTwitch(
    @Param('id') userId: string,
    @Param('twitch_id') twitchId: string
  ) {
    const user = await this.usersService.connectTwitch(userId, twitchId);
    if (!user) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: user });
  }

  @ApiOperation({ summary: 'Delete exists user by id' })
  @ApiParam({ name: 'id', description: 'User Id', type: String })
  @Delete('/:id')
  @HttpCode(200)
  public async deleteUserById(@Param('id') userId: string) {
    const success = await this.usersService.deleteUserById(userId);
    return formatedHttpResponse({ success });
  }
}
