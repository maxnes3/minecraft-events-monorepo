import { Types } from 'mongoose';
import { UserDTO } from '@/users/application/dto/user.dto';

export class UserEntity {
  constructor(
    private readonly _id: string,
    private name: string,
    private twitchId?: string,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  public static create(name: string, twitchId?: string): UserEntity {
    const id = new Types.ObjectId().toString();
    return new UserEntity(id, name, twitchId);
  }

  public static restore(
    id: string,
    name: string,
    twitchId?: string,
    createdAt?: Date,
    updatedAt?: Date
  ): UserEntity {
    return new UserEntity(
      id,
      name,
      twitchId,
      createdAt || new Date(),
      updatedAt || new Date()
    );
  }

  public toDTO(): UserDTO {
    return {
      _id: this._id,
      name: this.name,
      twitchId: this.twitchId,
      createdAt: this.createdAt.toDateString(),
      updatedAt: this.updatedAt.toDateString()
    };
  }

  public connectTwitch(twitchId: string): void {
    this.twitchId = twitchId;
    this.updatedAt = new Date();
  }

  public getId(): string {
    return this._id;
  }

  public getName(): string {
    return this.name;
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
