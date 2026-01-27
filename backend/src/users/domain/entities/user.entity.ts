import { Types } from 'mongoose';
import { UserDTO } from '@/users/application/dto/user.dto';

export class UserPlatformAuthData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class UserPlatformData {
  name: string;
  id: string;
  login?: string;
  profileImgUrl?: string | undefined;
  auth: UserPlatformAuthData;
}

export class UserEntity {
  constructor(
    private readonly _id: string,
    private platforms: UserPlatformData[],
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  public static create(platformsData: UserPlatformData[]): UserEntity {
    const id = new Types.ObjectId().toString();
    return new UserEntity(id, platformsData);
  }

  public static restore(
    id: string,
    platformsData: UserPlatformData[],
    createdAt?: Date,
    updatedAt?: Date
  ): UserEntity {
    return new UserEntity(
      id,
      platformsData,
      createdAt || new Date(),
      updatedAt || new Date()
    );
  }

  public toDTO(): UserDTO {
    return {
      _id: this._id,
      platforms: this.platforms,
      createdAt: this.createdAt.toDateString(),
      updatedAt: this.updatedAt.toDateString()
    };
  }

  public addPlatform(data: UserPlatformData): void {
    const exists = this.platforms.find((p) => p.name === data.name);
    if (exists) {
      return;
    }
    this.platforms.push(data);
    this.updatedAt = new Date();
  }

  public getId(): string {
    return this._id;
  }

  public getPlatforms(): UserPlatformData[] {
    return [...this.platforms];
  }

  public getPlatformByName(platformName: string): UserPlatformData | undefined {
    return this.platforms.find((p) => p.name === platformName);
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
