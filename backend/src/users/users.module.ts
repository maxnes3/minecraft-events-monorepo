import { Module } from '@nestjs/common';
import { UsersController } from './presentation/users.controller';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
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
  controllers: [UsersController],
  providers: [UsersService, UserMapper, UsersRepository],
  exports: [UsersService]
})
export class UsersModule {}
