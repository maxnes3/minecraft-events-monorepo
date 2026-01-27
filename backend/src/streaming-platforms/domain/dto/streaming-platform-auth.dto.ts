import { StreamingPlatformTokensDTO } from './streaming-platform-tokens.dto';

export class StreamingPlatformAuthDTO {
  platformName: string;
  login: string;
  profileImgUrl?: string | undefined;
  auth: StreamingPlatformTokensDTO;
}
