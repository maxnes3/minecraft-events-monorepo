import { LoggerService } from '@/shared/logger';
import { Injectable } from '@nestjs/common';
import { UserCreateDTO } from './dto/user-create.dto';
import { UserDTO } from './dto/user.dto';
import { UsersRepository } from '../infrastructure/persistence/mongo/repositories/users.repository';
import { UserEntity } from '../domain/entities/user.entity';
import { UserConnectPlatformDTO } from './dto/user-connect-platform.dto';
import { UserRemovePlatformDTO } from './dto/user-remove-platform.dto';
import { UserPlatformDTO } from './dto/user-platform.dto';
import { UserUpdatePreferencesDTO } from './dto/user-update-preferences.dto';

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

  public async getUserByPlatformNameAndId(
    platformName: string,
    platformId: string
  ): Promise<UserDTO | null> {
    const user = await this.usersRepository.findByPlatformNameAndId(
      platformName,
      platformId
    );
    if (!user) {
      this.logger.error(`User with ${platformName} ID ${platformId} not found`);
      return null;
    }

    this.logger.error(`User with ${platformName} ID ${platformId} is found`);
    return user.toDTO();
  }

  public async getPlatformDataByUserIdAndPlatformName(
    userId: string,
    platformName: string
  ): Promise<UserPlatformDTO | null> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      return null;
    }

    const userDto = user.toDTO();
    const platform = userDto.platforms.find((p) => p.name === platformName);
    if (!platform) {
      this.logger.error(
        `Platform ${platformName} not found for user ${userId}`
      );
      return null;
    }
    return platform;
  }

  public async createUser(data: UserCreateDTO): Promise<UserDTO | null> {
    this.logger.debug(
      `Creating user with connection: ${data.platformData.name}`
    );
    const exists = await this.usersRepository.existsByPlatformNameAndId(
      data.platformData.name,
      data.platformData.id
    );
    if (exists) {
      this.logger.error(`User with ID ${data.platformData.id} already exists`);
      return null;
    }

    const user = UserEntity.create([{ ...data.platformData }]);
    await this.usersRepository.save(user);

    this.logger.debug(`User created with ID: ${user.getId()}`);
    return user.toDTO();
  }

  public async updateUserPreferences(
    userId: string,
    data: UserUpdatePreferencesDTO
  ): Promise<UserDTO | null> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      return null;
    }

    user.setLang(data.lang || user.getLang());
    await this.usersRepository.update(user);

    this.logger.debug(`User updated preferences with ID: ${user.getId()}`);
    return user.toDTO();
  }

  public async connectPlatformToUser(
    userId: string,
    data: UserConnectPlatformDTO
  ): Promise<boolean> {
    this.logger.debug(`Connecting User to ${data.platformData.name}`);

    const existsByPlatform =
      await this.usersRepository.existsByPlatformNameAndId(
        data.platformData.name,
        data.platformData.id
      );
    if (existsByPlatform) {
      this.logger.error(
        `User with ${data.platformData.name} ID ${data.platformData.id} is already connected`
      );
      return false;
    }

    const existsById = await this.usersRepository.existsById(userId);
    if (!existsById) {
      this.logger.error(`User with ID ${userId} is not found`);
      return false;
    }

    await this.usersRepository.connectPlatformToUser(userId, data.platformData);
    this.logger.debug(`User connected with ${data.platformData.name}`);
    return true;
  }

  public async removePlatformFromUser(
    userId: string,
    data: UserRemovePlatformDTO
  ): Promise<boolean> {
    this.logger.debug(`Remove ${data.platformName} from User`);

    const exists = await this.usersRepository.existsById(userId);
    if (!exists) {
      this.logger.error(`User with ID ${userId} is not found`);
      return false;
    }

    await this.usersRepository.removePlatformFromUser(
      userId,
      data.platformName
    );
    this.logger.debug(`Removed ${data.platformName} from User`);
    return true;
  }

  public async upsertUserByPlatformAuth(
    data: UserPlatformDTO
  ): Promise<UserDTO | null> {
    const existsUser = await this.usersRepository.findByPlatformNameAndId(
      data.name,
      data.id
    );
    if (!existsUser) {
      const user = UserEntity.create([{ ...data }]);
      await this.usersRepository.save(user);
      return user.toDTO();
    }

    const user = await this.usersRepository.updatePlatformAuthDataAtUser(
      existsUser.getId(),
      data.name,
      data.auth
    );
    if (!user) {
      this.logger.error(`User with ID ${existsUser.getId()} is not found`);
      return null;
    }
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
