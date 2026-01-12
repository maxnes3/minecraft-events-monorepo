import { TwitchBroadcasterType } from '../twitch.enums';

export class TwitchUserResponse {
  data: TwitchUserDTO[];
}

export class TwitchUserDTO {
  broadcaster_type: TwitchBroadcasterType;
  created_at: string;
  description: string;
  display_name: string;
  id: string;
  login: string;
  offline_image_url: string;
  profile_image_url: string;
  type: string;
  view_count: number;
}
