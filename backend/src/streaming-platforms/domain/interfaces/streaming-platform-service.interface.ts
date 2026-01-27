import { IChatAnnouncementDTO } from './streaming-platform-chat-announcement.interface';
import { StreamingPlatformTokensDTO } from '../dto/streaming-platform-tokens.dto';
import { StreamingPlaftormUserDTO } from '../dto/streaming-platform-user.dto';
import { StreamingPlatformAuthRequestDTO } from '../dto/streaming-platform-auth-request.dto';
import { StreamingPlatformAuthDTO } from '../dto/streaming-platform-auth.dto';

export interface IStreamingPlatformService {
  isTokenExpired(tokens: StreamingPlatformTokensDTO): boolean;
  refreshUserToken(refreshToken: string): Promise<StreamingPlatformTokensDTO>;
  getUser(
    authData: StreamingPlatformAuthRequestDTO
  ): Promise<StreamingPlaftormUserDTO | null>;
  authUserByPlatform(
    tokens: StreamingPlatformTokensDTO,
    data: StreamingPlaftormUserDTO
  ): Promise<StreamingPlatformAuthDTO | null>;
  sendChatAnnouncement(
    data: IChatAnnouncementDTO,
    authData: StreamingPlatformAuthRequestDTO
  ): Promise<boolean>;
}
