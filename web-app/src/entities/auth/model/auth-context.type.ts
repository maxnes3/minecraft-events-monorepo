import { type BaseState } from '@app/shared/model';
import { type AuthUserState } from './auth-user.state';

export interface AuthContextType {
  meState: BaseState<AuthUserState>;
  onGetTokenForGameConnection: () => string | undefined;
}
