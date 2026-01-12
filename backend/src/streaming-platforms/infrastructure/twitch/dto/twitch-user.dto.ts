import { IStreamingPlaftormUserDTO } from '@/streaming-platforms/domain/dto/streaming-platform-user.dto';

export class TwitchUserDTO implements IStreamingPlaftormUserDTO {
  login: string;
  platformId?: string | undefined;
  platformProfileImgUrl?: string | undefined;
}
