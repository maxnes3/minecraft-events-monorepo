'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ClientPageUrl, UnauthorizedPageUrl } from '@app/shared/routes';
import { PlatformAuthCallbackEndpointUrl } from '@app/shared/api';
import { publicRuntimeConfig } from '@app/shared/config';
import { getCookie, setCookie } from '@app/shared/lib/cookie';
import {
  ExchangeAuthCodeRequest,
  RefreshTokensRequest
} from '@app/entities/auth';
import { GetUserMeRequest } from '@app/entities/user';
import { AuthContext, type AuthContextType } from '@app/entities/auth';
import { type AuthUserState } from '../model/auth-user.state';

const AuthContextProvider = AuthContext.Provider;

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [meState, setMeState] = useState<AuthContextType['meState']>({
    value: undefined,
    isFetched: false
  });

  const accessToken = useRef<string | undefined>(
    getCookie(publicRuntimeConfig.jwt.accessTokenCookieName).value
  );
  const refreshToken = useRef<string | undefined>(
    getCookie(publicRuntimeConfig.jwt.accessTokenCookieName).value
  );

  const setAccessToken = (token: string, expiresIn: number) => {
    setCookie(publicRuntimeConfig.jwt.accessTokenCookieName, token, expiresIn);
    accessToken.current = token;
  };
  const setRefreshToken = (token: string, expiresIn?: number) => {
    setCookie(publicRuntimeConfig.jwt.accessTokenCookieName, token, expiresIn);
    refreshToken.current = token;
  };

  const handleOnExchangeAuthCode = useCallback(
    async (platform: string, code: string) => {
      const url = PlatformAuthCallbackEndpointUrl(platform);
      return await ExchangeAuthCodeRequest({
        url,
        options: {
          params: {
            code,
            redirect_url: `${publicRuntimeConfig.application.domain}${ClientPageUrl}`
          }
        }
      });
    },
    []
  );

  const handleOnRefreshTokens = useCallback(async (refreshToken: string) => {
    return await RefreshTokensRequest({
      options: {
        body: {
          refreshToken
        }
      }
    });
  }, []);

  const handleOnGetAuthUser = useCallback(async (accessToken: string) => {
    return await GetUserMeRequest({
      options: {
        headers: {
          Authorization: accessToken
        }
      }
    });
  }, []);

  useEffect(() => {
    const authorizeUser = async () => {
      if (meState.isFetched) {
        return;
      }

      const platformParam = searchParams.get('platform');
      const codeToExchangeParam = searchParams.get('code');
      if (platformParam && codeToExchangeParam) {
        const response = await handleOnExchangeAuthCode(
          platformParam,
          codeToExchangeParam
        );
        if (response?.success && response.data) {
          const authUser: AuthUserState = {
            profileLogin: response.data.login,
            profileImg: response.data.profileImgUrl,
            connectedPlatforms: [response.data.platformName]
          };
          setMeState({ isFetched: true, value: authUser });
          return;
        }
      }

      if (accessToken.current) {
        const response = await handleOnGetAuthUser(accessToken.current);
        if (response?.success && response.data) {
          const authUser: AuthUserState = {
            profileLogin: response.data.platforms[0].login,
            profileImg: response.data.platforms[0].profileImgUrl,
            connectedPlatforms: response.data.platforms.map((p) => p.name)
          };
          setMeState({ isFetched: true, value: authUser });
          return;
        }
      }

      if (refreshToken.current) {
        const tokens = await handleOnRefreshTokens(refreshToken.current);
        if (tokens?.success && tokens.data) {
          setAccessToken(tokens.data.accessToken, tokens.data.expiresIn);
          setRefreshToken(tokens.data.refreshToken);
          if (accessToken.current) {
            const response = await handleOnGetAuthUser(accessToken.current);
            if (response?.success && response.data) {
              const authUser: AuthUserState = {
                profileLogin: response.data.platforms[0].login,
                profileImg: response.data.platforms[0].profileImgUrl,
                connectedPlatforms: response.data.platforms.map((p) => p.name)
              };
              setMeState({ isFetched: true, value: authUser });
            }
            return;
          }
        }
      }

      setMeState({ isFetched: true, value: undefined });
    };

    authorizeUser();
  }, [meState.isFetched]);

  useEffect(() => {
    const checkUserAuthorized = () => {
      if (meState.isFetched && !meState.value) {
        router.push(UnauthorizedPageUrl);
        return;
      }
    };

    checkUserAuthorized();
  }, [meState.isFetched, meState.value]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      meState
    }),
    [meState]
  );

  return (
    <AuthContextProvider value={contextValue}>{children}</AuthContextProvider>
  );
};
