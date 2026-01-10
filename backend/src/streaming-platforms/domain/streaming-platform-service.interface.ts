import { IAuthDTO } from './dto/auth.interface';
import { IChatAnnouncementDTO } from './dto/chat-announcement.interface';

export interface IStreamingPlatformService {
  getUser(authData: IAuthDTO);
  sendChatAnnouncement(
    data: IChatAnnouncementDTO,
    authData: IAuthDTO
  ): Promise<void>;
}
