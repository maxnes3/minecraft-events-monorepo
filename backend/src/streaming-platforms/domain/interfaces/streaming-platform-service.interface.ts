import { IStreamingPlatformSendChatAnnouncementDTO } from './streaming-platform-chat-announcement.interface';
import { StreamingPlatformTokensDTO } from '../dto/streaming-platform-tokens.dto';
import { StreamingPlaftormUserDTO } from '../dto/streaming-platform-user.dto';
import { StreamingPlatformAuthRequestDTO } from '../dto/streaming-platform-auth-request.dto';
import { StreamingPlatformAuthDTO } from '../dto/streaming-platform-auth.dto';
import { StreamingPlaftormStreamDTO } from '../dto/streaming-platform-stream.dto';

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
  getStreamInLive(
    authData: StreamingPlatformAuthRequestDTO
  ): Promise<StreamingPlaftormStreamDTO | null>;
  sendChatAnnouncement(
    data: IStreamingPlatformSendChatAnnouncementDTO,
    authData: StreamingPlatformAuthRequestDTO
  ): Promise<boolean>;
}
