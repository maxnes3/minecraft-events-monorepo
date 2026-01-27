import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersManageController } from './presentation/users-manage.controller';
import { UsersPlatformController } from './presentation/users-platform.controller';
import { UsersService } from './application/users.service';
import {
  User,
  UserSchema
} from './infrastructure/persistence/mongo/schemas/user.schema';
import { UserMapper } from './infrastructure/persistence/mappers/user.mapper';
import { UsersRepository } from './infrastructure/persistence/mongo/repositories/users.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [UsersManageController, UsersPlatformController],
  providers: [UsersService, UserMapper, UsersRepository],
  exports: [UsersService]
})
export class UsersModule {}
