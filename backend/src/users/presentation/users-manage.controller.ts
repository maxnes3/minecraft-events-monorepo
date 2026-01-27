import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { UsersService } from '../application/users.service';
import { UserCreateDTO } from '../application/dto/user-create.dto';
import { formatedHttpResponse } from '@/shared/http';
import { publicRuntimeConfig } from '@/shared/config';
import { User } from '@/auth';

@ApiBearerAuth(publicRuntimeConfig.jwt.authorizationHeader)
@ApiTags('Users Manage')
@Controller('users')
export class UsersManageController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get User by id' })
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
  @ApiBody({ type: UserCreateDTO, required: true })
  @Post()
  @HttpCode(200)
  public async createUser(@Body() data: UserCreateDTO) {
    const user = await this.usersService.createUser(data);
    if (!user) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: user });
  }

  @ApiOperation({ summary: 'Delete exists User by id' })
  @Delete()
  @HttpCode(200)
  public async deleteUserById(@User('sub') userId: string) {
    const success = await this.usersService.deleteUserById(userId);
    return formatedHttpResponse({ success });
  }
}
