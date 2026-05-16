export class TwitchApiStreamResponse {
  data: TwitchApiStreamDTO[];
  pagination: {
    cursor?: string;
  };
}

export class TwitchApiStreamDTO {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  tags: string[];
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: [];
  is_mature: boolean;
}
