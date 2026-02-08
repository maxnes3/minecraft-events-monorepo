import { Injectable } from '@nestjs/common';
import { UserDTO } from '@app/users/application/dto/user.dto';
import { UserPresentationDTO } from '../dto/user-presentation.dto';

@Injectable()
export class UserPresentationMapper {
  public toPresentationDTO(dto: UserDTO): UserPresentationDTO {
    return {
      platforms: dto.platforms.map((p) => ({
        name: p.name,
        login: p.login,
        profileImgUrl: p.profileImgUrl
      })),
      lang: dto.lang,
      createdAt: dto.createdAt
    };
  }
}
