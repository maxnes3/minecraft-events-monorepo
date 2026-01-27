import {
  UserEntity,
  UserPlatformAuthData,
  UserPlatformData
} from '../entities/user.entity';

export interface IUsersRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByPlatformNameAndId(
    platformName: string,
    platformId: string
  ): Promise<UserEntity | null>;

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
  updatePlatformAuthDataAtUser(
    userId: string,
    platformName: string,
    authData: UserPlatformAuthData
  ): Promise<UserEntity | null>;
}
