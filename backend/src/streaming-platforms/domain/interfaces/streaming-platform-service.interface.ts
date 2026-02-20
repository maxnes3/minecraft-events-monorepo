import { AuthTokensDTO } from '@app/auth';
import { IStreamingPlatformSendMessageDTO } from './streaming-platform-send-message.interface';
import { StreamingPlatformTokensDTO } from '../dto/streaming-platform-tokens.dto';
import { StreamingPlaftormUserDTO } from '../dto/streaming-platform-user.dto';
import { StreamingPlatformAuthRequestDTO } from '../dto/streaming-platform-auth-request.dto';
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
  ): Promise<AuthTokensDTO | null>;
  getStreamInLive(
    authData: StreamingPlatformAuthRequestDTO
  ): Promise<StreamingPlaftormStreamDTO | null>;
  sendMessage(
    data: IStreamingPlatformSendMessageDTO,
    authData: StreamingPlatformAuthRequestDTO
  ): Promise<boolean>;
}
