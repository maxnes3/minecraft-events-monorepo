import { PlatformAuthRedirectEndpointUrl } from '@app/shared/api';
import { publicRuntimeConfig } from '@app/shared/config';
import { ClientPageUrl } from '@app/shared/routes';

const REDIRECT_URL = `${publicRuntimeConfig.application.domain}${ClientPageUrl}`;

export const RedirectToTwitchAuthUrl = `${publicRuntimeConfig.server.apiUrl}${PlatformAuthRedirectEndpointUrl('twitch')}?redirect_url=${REDIRECT_URL}`;

export const RedirectToYoutubeAuthUrl = `${publicRuntimeConfig.server.apiUrl}${PlatformAuthRedirectEndpointUrl('yotube')}?redirect_url=${REDIRECT_URL}`;
