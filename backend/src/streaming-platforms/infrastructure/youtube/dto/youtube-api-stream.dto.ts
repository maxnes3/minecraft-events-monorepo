export class YoutubeApiStreamResponse {
  kind: 'youtube#liveBroadcastListResponse';
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YoutubeApiStreamDTO[];
}

export class YoutubeApiStreamDTO {
  kind: 'youtube#liveBroadcast';
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<string, { url: string; width: number; height: number }>;
    scheduledStartTime: string;
    scheduledEndTime: string;
    actualStartTime: string;
    actualEndTime: string;
    isDefaultBroadcast: boolean;
    liveChatId: string;
  };
}
