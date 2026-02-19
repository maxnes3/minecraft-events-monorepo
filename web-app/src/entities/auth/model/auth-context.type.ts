import { type BaseState } from '@app/shared/model';
import { type AuthMeState } from './auth-me-state.type';
import { type AuthRedirectUrlDTO } from './auth-redirect-url.dto';

export interface AuthContextType {
  meState: BaseState<AuthMeState>;
  onGetAuthRedirectUrl: (
    platform: string
  ) => Promise<AuthRedirectUrlDTO | undefined>;
  onLogout: () => Promise<void>;
}
