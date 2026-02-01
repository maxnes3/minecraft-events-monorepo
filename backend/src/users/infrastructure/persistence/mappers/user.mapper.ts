import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserDocument } from '../mongo/schemas/user.schema';

@Injectable()
export class UserMapper {
  public toDomain(document: UserDocument | null): UserEntity | null {
    if (!document) return null;

    return UserEntity.restore(
      document._id.toString(),
      document.platforms,
      document.lang,
      document.createdAt,
      document.updatedAt
    );
  }

  public toPersistence(user: UserEntity): Record<string, any> {
    return {
      _id: user.getId(),
      platforms: user.getPlatforms(),
      lang: user.getLang(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt()
    };
  }
}
