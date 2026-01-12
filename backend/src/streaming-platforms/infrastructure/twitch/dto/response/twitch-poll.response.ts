export class TwitchPollResponse {
  data: TwitchPollDTO[];
}

export class TwitchPollDTO {
  id: string;
  broadcaster_id: string;
  broadcaster_name: string;
  broadcaster_login: string;
  title: string;
  choices: {
    id: string;
    title: string;
    votes: number;
    channel_points_votes: number;
    bits_votes: number;
  }[];
  bits_voting_enabled: boolean;
  bits_per_vote: number;
  channel_points_voting_enabled: boolean;
  channel_points_per_vote: number;
  status: string;
  duration: number;
  started_at: string;
}
