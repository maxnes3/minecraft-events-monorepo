import { IAuthDTO } from '@/streaming-platforms/domain/dto/auth.interface';

export class TwitchAuthDTO implements IAuthDTO {
  accessToken: string;
  broadcasterId?: string;
}
