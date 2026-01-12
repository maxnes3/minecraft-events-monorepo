import { Types } from 'mongoose';
import { UserDTO } from '@/users/application/dto/user.dto';

export class UserEntity {
  constructor(
    private readonly _id: string,
    private login: string,
    private twitchId?: string,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  public static create(login: string, twitchId?: string): UserEntity {
    const id = new Types.ObjectId().toString();
    return new UserEntity(id, login, twitchId);
  }

  public static restore(
    id: string,
    login: string,
    twitchId?: string,
    createdAt?: Date,
    updatedAt?: Date
  ): UserEntity {
    return new UserEntity(
      id,
      login,
      twitchId,
      createdAt || new Date(),
      updatedAt || new Date()
    );
  }

  public toDTO(): UserDTO {
    return {
      _id: this._id,
      login: this.login,
      twitchId: this.twitchId,
      createdAt: this.createdAt.toDateString(),
      updatedAt: this.updatedAt.toDateString()
    };
  }

  public setLogin(login: string): void {
    this.login = login;
    this.updatedAt = new Date();
  }

  public connectTwitch(twitchId: string): void {
    this.twitchId = twitchId;
    this.updatedAt = new Date();
  }

  public getId(): string {
    return this._id;
  }

  public getLogin(): string {
    return this.login;
  }

  public getTwitchId(): string | undefined {
    return this.twitchId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
