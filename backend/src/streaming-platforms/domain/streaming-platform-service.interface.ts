import { IStreamingPlatformAuthDTO } from './dto/streaming-platform-auth.interface';
import { IChatAnnouncementDTO } from './dto/streaming-platform-chat-announcement.interface';

export interface IStreamingPlatformService {
  getUser(authData: IStreamingPlatformAuthDTO): Promise<any>;
  sendChatAnnouncement(
    data: IChatAnnouncementDTO,
    authData: IStreamingPlatformAuthDTO
  ): Promise<boolean>;
}
