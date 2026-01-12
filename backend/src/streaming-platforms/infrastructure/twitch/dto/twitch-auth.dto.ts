import { IStreamingPlatformAuthDTO } from '@/streaming-platforms/domain/dto/streaming-platform-auth.interface';

export class TwitchAuthDTO implements IStreamingPlatformAuthDTO {
  accessToken: string;
  broadcasterId?: string;
}
