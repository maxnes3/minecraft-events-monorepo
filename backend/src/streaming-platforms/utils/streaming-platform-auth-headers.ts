import { publicRuntimeConfig } from '@/shared/config';
import { StreamingPlatforms } from '../domain/streaming-platforms.enums';

export function getStreamingPlatformAuthHeaders(
  platform: StreamingPlatforms
): string[] {
  if (platform === StreamingPlatforms.TWITCH) {
    return [
      publicRuntimeConfig.twitch.accessTokenName,
      publicRuntimeConfig.twitch.refreshTokenName,
      publicRuntimeConfig.twitch.broadcasterIdName
    ];
  }
  return [];
}
