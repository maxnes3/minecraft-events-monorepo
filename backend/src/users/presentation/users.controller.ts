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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../application/users.service';
import { UserCreateDTO } from '../application/dto/user-create.dto';
import { formatedHttpResponse } from '@/shared/http';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user by id' })
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

  @ApiOperation({ summary: 'Connect user with Twitch by id' })
  @Put(':id/connect-twitch')
  @HttpCode(200)
  public async connectTwitch(
    @Param('id') id: string,
    @Body('twitchId') twitchId: string
  ) {
    const user = await this.usersService.connectTwitch(id, twitchId);
    if (!user) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: user });
  }

  @ApiOperation({ summary: 'Delete exists user by id' })
  @Delete('/:id')
  @HttpCode(200)
  public async deleteUser(@Param('id') id: string) {
    const success = await this.usersService.deleteUser(id);
    return formatedHttpResponse({ success });
  }
}
