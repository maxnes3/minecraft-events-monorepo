import { Types } from 'mongoose';
import { publicRuntimeConfig } from '@app/shared/config';
import { UserDTO } from '@app/users/application/dto/user.dto';
import { UserGameConnectToken } from './user-game-connect-token.vo';

export class UserPlatformAuthData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class UserPlatformData {
  name: string;
  id: string;
  auth: UserPlatformAuthData;
  login?: string;
  profileImgUrl?: string | undefined;
  properties?: Record<string, any>;
}

export class UserEntity {
  constructor(
    private readonly _id: string,
    private platforms: UserPlatformData[],
    private gameConnectToken: string,
    private lang: string,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  public static create(
    platformsData: UserPlatformData[],
    lang: string = publicRuntimeConfig.i18n.fallbackLanguage
  ): UserEntity {
    const id = new Types.ObjectId().toString();
    const gameConnectToken = UserGameConnectToken.generate();
    return new UserEntity(id, platformsData, gameConnectToken.getValue(), lang);
  }

  public static restore(
    id: string,
    platformsData: UserPlatformData[],
    gameConnectToken: string,
    lang: string = publicRuntimeConfig.i18n.fallbackLanguage,
    createdAt?: Date,
    updatedAt?: Date
  ): UserEntity {
    return new UserEntity(
      id,
      platformsData,
      gameConnectToken,
      lang,
      createdAt || new Date(),
      updatedAt || new Date()
    );
  }

  public toDTO(): UserDTO {
    return {
      _id: this._id,
      platforms: this.platforms,
      gameConnectToken: this.gameConnectToken,
      lang: this.lang,
      createdAt: this.createdAt.toDateString(),
      updatedAt: this.updatedAt.toDateString()
    };
  }

  public setGameConnectToken(token: string): void {
    this.gameConnectToken = token;
  }

  public setLang(lang: string): void {
    const existsInSupported = publicRuntimeConfig.i18n.supportedLanguages.find(
      (l) => l === lang
    );
    if (!existsInSupported) {
      return;
    }
    this.lang = lang;
    this.updatedAt = new Date();
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

  public getGameConnectToken(): string | undefined {
    return this.gameConnectToken;
  }

  public getLang(): string {
    return this.lang;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
