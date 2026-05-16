import { LoggerService } from '@app/shared/logger';
import { Injectable } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UsersRepository } from '../infrastructure/persistence/mongo/repositories/users.repository';
import { UserEntity } from '../domain/entities/user.entity';
import { UserConnectPlatformDTO } from './dto/user-connect-platform.dto';
import { UserRemovePlatformDTO } from './dto/user-remove-platform.dto';
import { UserPlatformDTO } from './dto/user-platform.dto';
import { UserUpdatePreferencesDTO } from './dto/user-update-preferences.dto';
import { UserGameConnectDTO } from './dto/user-game-connect.dto';
import { CryptoService } from '../infrastructure/security/crypto.service';
import { UserGameConnectToken } from '../domain/entities/user-game-connect-token.vo';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptoService: CryptoService,
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

  public async getUserByGameConnectToken(
    token: string
  ): Promise<UserDTO | null> {
    const gameConnectToken = new UserGameConnectToken(token);
    const user = await this.usersRepository.findByGameConnectToken(
      gameConnectToken.getHash()
    );
    if (!user) {
      this.logger.error(`User with GameConnectToken ${token} not found`);
      return null;
    }

    this.logger.debug(`User with GameConnectToken ${token} is found`);
    return user.toDTO();
  }

  public async getUserGameConnectToken(
    userId: string
  ): Promise<UserGameConnectDTO | null> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      return null;
    }

    const gameConnectToken = UserGameConnectToken.generate();
    await this.usersRepository.updateGameConnectTokenAtUser(
      user.getId(),
      gameConnectToken.getHash()
    );

    return {
      token: gameConnectToken.getValue()
    };
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

    const decodedPlatformData: UserPlatformDTO = {
      name: platform.name,
      id: platform.id,
      login: platform.login,
      profileImgUrl: platform.profileImgUrl,
      auth: {
        expiresIn: platform.auth.expiresIn,
        accessToken: this.cryptoService.decrypt(platform.auth.accessToken),
        refreshToken: this.cryptoService.decrypt(platform.auth.refreshToken)
      }
    };
    return decodedPlatformData;
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
    const securityPlatformData: UserPlatformDTO = {
      name: data.name,
      id: data.id,
      login: data.login,
      profileImgUrl: data.profileImgUrl,
      auth: {
        expiresIn: data.auth.expiresIn,
        accessToken: this.cryptoService.encrypt(data.auth.accessToken),
        refreshToken: this.cryptoService.encrypt(data.auth.refreshToken)
      }
    };

    const existsUser = await this.usersRepository.findByPlatformNameAndId(
      securityPlatformData.name,
      securityPlatformData.id
    );
    if (!existsUser) {
      const user = UserEntity.create([{ ...securityPlatformData }]);
      await this.usersRepository.save(user);
      return user.toDTO();
    }

    const user = await this.usersRepository.updatePlatformAuthDataAtUser(
      existsUser.getId(),
      securityPlatformData.name,
      securityPlatformData
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
