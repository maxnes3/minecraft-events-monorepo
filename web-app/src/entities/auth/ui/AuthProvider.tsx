'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshTokensRequest,
  AuthContext,
  type AuthContextType
} from '@app/entities/auth';
import { GetUserMeRequest } from '@app/entities/user';
import { getCookie } from '@app/shared/lib/cookie';
import { publicRuntimeConfig } from '@app/shared/config';
import { UnauthorizedPageUrl } from '@app/shared/routes';
import { type AuthUserState } from '../model/auth-user.state';

const AuthContextProvider = AuthContext.Provider;

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();

  const [meState, setMeState] = useState<AuthContextType['meState']>({
    value: undefined,
    isFetched: false
  });

  const handleOnGetTokenForGameConnection = useCallback<
    AuthContextType['onGetTokenForGameConnection']
  >(() => {
    const token = getCookie(publicRuntimeConfig.jwt.accessTokenCookieName);
    return token.value;
  }, []);

  const handleOnGetAuthUser = useCallback(async () => {
    return await GetUserMeRequest({});
  }, []);

  const handleOnRefreshTokens = useCallback(async () => {
    return await RefreshTokensRequest({});
  }, []);

  useEffect(() => {
    const authorizeUser = async () => {
      if (meState.isFetched) {
        return;
      }

      const response = await handleOnGetAuthUser();
      if (response?.success && response.data) {
        const authUser: AuthUserState = {
          profileLogin: response.data.platforms[0].login,
          profileImg: response.data.platforms[0].profileImgUrl,
          connectedPlatforms: response.data.platforms.map((p) => p.name)
        };
        setMeState({ isFetched: true, value: authUser });
        return;
      }

      const tokens = await handleOnRefreshTokens();
      if (tokens?.success) {
        const response = await handleOnGetAuthUser();
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
      meState,
      onGetTokenForGameConnection: handleOnGetTokenForGameConnection
    }),
    [meState, handleOnGetTokenForGameConnection]
  );

  return (
    <AuthContextProvider value={contextValue}>{children}</AuthContextProvider>
  );
};
