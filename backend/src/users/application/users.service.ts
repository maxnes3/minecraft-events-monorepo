import { LoggerService } from '@/shared/logger';
import { Injectable } from '@nestjs/common';
import { UserCreateDTO } from './dto/user-create.dto';
import { UserDTO } from './dto/user.dto';
import { UsersRepository } from '../infrastructure/persistence/mongo/repositories/users.repository';
import { UserEntity } from '../domain/entities/user.entity';
import { UserUpdateDTO } from './dto/user-update.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(UsersService.name);
  }

  public async getUserById(userId: string): Promise<UserDTO | null> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      return null;
    }

    this.logger.debug(`User with ID ${userId} is found`);
    return user.toDTO();
  }

  public async createUser(data: UserCreateDTO): Promise<UserDTO | null> {
    this.logger.debug(`Creating user with login: ${data.login}`);
    if (data.twitchId) {
      const exists = await this.usersRepository.existsByTwitchId(data.twitchId);
      if (exists) {
        this.logger.error(
          `User with Twitch ID ${data.twitchId} already exists`
        );
        return null;
      }
    }

    const user = UserEntity.create(data.login, data.twitchId);
    await this.usersRepository.save(user);

    this.logger.debug(`User created with ID: ${user.getId()}`);
    return user.toDTO();
  }

  public async updateUser(
    userId: string,
    data: UserUpdateDTO
  ): Promise<UserDTO | null> {
    this.logger.debug(`Updating user by ID ${userId}`);

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      return null;
    }

    user.setLogin(data.login ?? user.getLogin());
    await this.usersRepository.save(user);

    this.logger.debug(`User updated with ID: ${user.getId()}`);
    return user.toDTO();
  }

  public async connectTwitch(
    userId: string,
    twitchId: string
  ): Promise<UserDTO | null> {
    this.logger.debug(`Connecting Twitch ${twitchId} to user ${userId}`);

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      return null;
    }

    const exists = await this.usersRepository.existsByTwitchId(twitchId);
    if (exists && user.getTwitchId() !== twitchId) {
      this.logger.error(
        `Twitch ID ${twitchId} is already connected to another user`
      );
      return null;
    }

    user.connectTwitch(twitchId);
    await this.usersRepository.update(user);

    this.logger.debug(`Twitch connected to user ${userId}`);
    return user.toDTO();
  }

  public async deleteUserById(userId: string): Promise<boolean> {
    this.logger.debug(`Deleting user with ID: ${userId}`);

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      return false;
    }

    await this.usersRepository.delete(userId);
    this.logger.debug(`User deleted with ID: ${userId}`);
    return true;
  }
}
