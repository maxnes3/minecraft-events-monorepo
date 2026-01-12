import { UserEntity } from '../entities/user.entity';

export interface IUsersRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByTwitchId(twitchId: string): Promise<UserEntity | null>;

  save(user: UserEntity): Promise<void>;
  update(user: UserEntity): Promise<void>;
  delete(id: string): Promise<void>;

  existsByTwitchId(twitchId: string): Promise<boolean>;
}
