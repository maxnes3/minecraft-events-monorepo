import { publicRuntimeConfig } from '../config';

export const HomeUrl = '/';
export const LandingPageUrl = HomeUrl;
export const UserPageUrl = `${HomeUrl}user`;
export const UserPageWithDomainUrl = `${publicRuntimeConfig.application.domain}${UserPageUrl}`;
export const UnauthorizedPageUrl = HomeUrl;
