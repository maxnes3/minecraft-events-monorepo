import {
  GetUserMeGameConnectTokenRequest,
  UserContext,
  type UserContextType
} from '@app/entities/user';
import { useCallback, useMemo } from 'react';

const UserContextProvider = UserContext.Provider;

interface Props {
  children: React.ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
  const handleOnGetGameConnectToken = useCallback<
    UserContextType['onGetGameConnectToken']
  >(async () => {
    const response = await GetUserMeGameConnectTokenRequest({});
    if (response?.success && response.data) {
      return response.data;
    }
  }, []);

  const contextValue = useMemo<UserContextType>(
    () => ({ onGetGameConnectToken: handleOnGetGameConnectToken }),
    [handleOnGetGameConnectToken]
  );

  return (
    <UserContextProvider value={contextValue}>{children}</UserContextProvider>
  );
};
