import { type AuthMeState } from '@app/entities/auth';
import { type UserDTO } from '@app/entities/user';

export const fromUserDTOtoAuthMeState = (data: UserDTO): AuthMeState => ({
  profileLogin: data.platforms[0].login,
  profileImg: data.platforms[0].profileImgUrl,
  connectedPlatforms: data.platforms.map((p) => p.name)
});
