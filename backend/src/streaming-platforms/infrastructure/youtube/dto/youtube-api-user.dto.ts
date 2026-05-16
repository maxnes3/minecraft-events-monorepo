export class YoutubeApiUserResponse {
  kind: 'youtube#channelListResponse';
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YoutubeApiUserDTO[];
}

export class YoutubeApiUserDTO {
  kind: 'youtube#channel';
  etag: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl: string;
    publishedAt: string;
    thumbnails: Record<string, { url: string; width: number; height: number }>;
  };
}
