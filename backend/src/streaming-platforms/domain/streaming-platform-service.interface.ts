import { IStreamingPlatformAuthDTO } from './dto/streaming-platform-auth.interface';
import { IChatAnnouncementDTO } from './dto/streaming-platform-chat-announcement.interface';
import { IStreamingPlatformTokensDTO } from './dto/streaming-platform-tokens.interface';

export interface IStreamingPlatformService {
  refreshUserToken(refreshToken: string): Promise<IStreamingPlatformTokensDTO>;
  getUser(authData: IStreamingPlatformAuthDTO): Promise<any>;
  sendChatAnnouncement(
    data: IChatAnnouncementDTO,
    authData: IStreamingPlatformAuthDTO
  ): Promise<boolean>;
}
