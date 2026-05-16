export class StreamingPlatformAuthRequestDTO {
  accessToken: string;
  platformId?: string | undefined;
  platformProperties?: Record<string, string> | undefined;
}
