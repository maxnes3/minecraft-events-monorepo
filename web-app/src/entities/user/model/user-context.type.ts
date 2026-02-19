import { type UserGameConnectDTO } from './user-game-connect.dto';

export interface UserContextType {
  onGetGameConnectToken: () => Promise<UserGameConnectDTO | undefined>;
}
