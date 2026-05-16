import { TwitchBroadcasterType } from './twitch.enums';

export class TwitchApiUserResponse {
  data: TwitchApiUserDTO[];
}

export class TwitchApiUserDTO {
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
