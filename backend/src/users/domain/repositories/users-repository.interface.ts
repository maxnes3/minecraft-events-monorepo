import { UserEntity, UserPlatformData } from '../entities/user.entity';

export interface IUsersRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByPlatformNameAndId(
    platformName: string,
    platformId: string
  ): Promise<UserEntity | null>;
  findByGameConnectToken(token: string): Promise<UserEntity | null>;

  save(user: UserEntity): Promise<void>;
  update(user: UserEntity): Promise<void>;
  delete(id: string): Promise<void>;

  existsById(id: string): Promise<boolean>;
  existsByPlatformNameAndId(
    platformName: string,
    platformId: string
  ): Promise<boolean>;

  connectPlatformToUser(
    userId: string,
    platformData: UserPlatformData
  ): Promise<void>;
  removePlatformFromUser(userId: string, platformName: string): Promise<void>;

  updateGameConnectTokenAtUser(userId: string, token: string): Promise<void>;
  updatePlatformAuthDataAtUser(
    userId: string,
    platformName: string,
    authData: UserPlatformData
  ): Promise<UserEntity | null>;
  updatePlatformPropertiesAtUser(
    userId: string,
    platformName: string,
    properties: Record<string, any>
  ): Promise<UserEntity | null>;
}
