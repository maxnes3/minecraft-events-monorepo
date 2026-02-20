'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type AuthContextType,
  type AuthMeState,
  AuthContext,
  PostRefreshTokensRequest,
  PostAuthLogoutRequest,
  GetExchangeCodeToTokensRequest,
  GetAuthRedirectUrlRequest
} from '@app/entities/auth';
import { GetUserMeRequest } from '@app/entities/user';
import { UnauthorizedPageUrl, UserPageWithDomainUrl } from '@app/shared/routes';
import {
  PlatformAuthRedirectEndpointUrl,
  PlatformExchangeCodeToTokensUrl
} from '@app/shared/api';
import { fromUserDTOtoAuthMeState } from '../lib';

const PLATFORM_SEARCH_PARAM_NAME = 'platform';
const CODE_SEARCH_PARAM_NAME = 'code';

const AuthContextProvider = AuthContext.Provider;

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [meState, setMeState] = useState<AuthContextType['meState']>({
    value: undefined,
    isFetched: false
  });

  const handleOnGetAuthUser = useCallback(async () => {
    return await GetUserMeRequest({});
  }, []);

  const handleOnExchangeCodeToTokens = useCallback(
    async (platform: string, code: string) => {
      const url = PlatformExchangeCodeToTokensUrl(platform);
      return await GetExchangeCodeToTokensRequest({
        url,
        options: { params: { code } }
      });
    },
    []
  );

  const handleOnRefreshTokens = useCallback(async () => {
    return await PostRefreshTokensRequest({});
  }, []);

  const handleOnGetAuthRedirectUrl = useCallback<
    AuthContextType['onGetAuthRedirectUrl']
  >(async (platform) => {
    const redirectUrl = new URL(UserPageWithDomainUrl);
    redirectUrl.searchParams.append('platform', platform);
    const url = PlatformAuthRedirectEndpointUrl(platform);

    const response = await GetAuthRedirectUrlRequest({
      url,
      options: {
        params: {
          redirect_url: redirectUrl.toString()
        }
      }
    });
    if (response?.success && response.data) {
      return response.data;
    }
  }, []);

  const handleOnLogout = useCallback<AuthContextType['onLogout']>(async () => {
    const response = await PostAuthLogoutRequest({});
    if (!response?.success) {
      return;
    }
    router.push(UnauthorizedPageUrl);
  }, [router]);

  useEffect(() => {
    const fetchUserMe = async (): Promise<AuthMeState | null> => {
      const response = await handleOnGetAuthUser();
      if (response?.success && response.data) {
        return fromUserDTOtoAuthMeState(response.data);
      }
      return null;
    };

    const authorizeUser = async () => {
      if (meState.isFetched) {
        return;
      }

      /* Get Auth User by Access Token */
      const user = await fetchUserMe();
      if (user) {
        setMeState({ isFetched: true, value: user });
        return;
      }

      /* Refresh Tokens and Get Auth User */
      const tokens = await handleOnRefreshTokens();
      if (tokens?.success) {
        const user = await fetchUserMe();
        if (user) {
          setMeState({ isFetched: true, value: user });
          return;
        }
      }

      /* Exchange Platform Code To Auth Tokens */
      const platform = searchParams.get(PLATFORM_SEARCH_PARAM_NAME);
      const code = searchParams.get(CODE_SEARCH_PARAM_NAME);
      if (platform && code) {
        const tokens = await handleOnExchangeCodeToTokens(platform, code);
        if (tokens?.success) {
          const user = await fetchUserMe();
          if (user) {
            setMeState({ isFetched: true, value: user });
            router.replace(pathname);
            return;
          }
        }
      }

      /* Set User is Fetched but not Authorized */
      setMeState({ isFetched: true, value: undefined });
    };

    authorizeUser();
  }, [meState.isFetched]);

  useEffect(() => {
    const checkUnauthorized = () => {
      if (meState.isFetched && !meState.value) {
        router.push(UnauthorizedPageUrl);
        return;
      }
    };

    checkUnauthorized();
  }, [meState.isFetched, meState.value]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      meState,
      onGetAuthRedirectUrl: handleOnGetAuthRedirectUrl,
      onLogout: handleOnLogout
    }),
    [meState, handleOnGetAuthRedirectUrl, handleOnLogout]
  );

  return (
    <AuthContextProvider value={contextValue}>{children}</AuthContextProvider>
  );
};
