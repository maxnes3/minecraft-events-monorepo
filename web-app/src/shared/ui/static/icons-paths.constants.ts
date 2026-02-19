import { publicRuntimeConfig } from '@app/shared/config';

export const FaviconStaticPath = `${publicRuntimeConfig.static.icons}/favicon.svg`;

export const TwitchIconStaticPath = `${publicRuntimeConfig.static.icons}/twitch.svg`;
export const YoutubeIconStaticPath = `${publicRuntimeConfig.static.icons}/youtube.svg`;
export const IconStaticPathByPlatform: Record<string, string> = {
  twitch: TwitchIconStaticPath,
  youtube: YoutubeIconStaticPath
};

export const GithubIconStaticPath = `${publicRuntimeConfig.static.icons}/github.svg`;
