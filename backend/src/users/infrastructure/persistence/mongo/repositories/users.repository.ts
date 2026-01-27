import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUsersRepository } from '@/users/domain/repositories/users-repository.interface';
import {
  UserEntity,
  UserPlatformAuthData,
  UserPlatformData
} from '@/users/domain/entities/user.entity';
import { User, UserDocument } from '../schemas/user.schema';
import { UserMapper } from '../../mappers/user.mapper';

export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mapper: UserMapper
  ) {}

  public async findById(id: string): Promise<UserEntity | null> {
    const document = await this.userModel.findById(id).exec();
    return this.mapper.toDomain(document);
  }

  public async findByPlatformNameAndId(
    platformName: string,
    platformId: string
  ): Promise<UserEntity | null> {
    const document = await this.userModel
      .findOne({
        platforms: {
          $elemMatch: {
            name: platformName,
            id: platformId
          }
        }
      })
      .exec();
    return this.mapper.toDomain(document);
  }

  public async save(user: UserEntity): Promise<void> {
    const data = this.mapper.toPersistence(user);
    await this.userModel.create(data);
  }

  public async update(user: UserEntity): Promise<void> {
    const data = this.mapper.toPersistence(user);
    await this.userModel
      .findByIdAndUpdate(user.getId(), { $set: data }, { new: true })
      .exec();
  }

  public async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  public async existsById(id: string): Promise<boolean> {
    const count = await this.userModel.countDocuments({ id }).exec();
    return count > 0;
  }

  public async existsByPlatformNameAndId(
    platformName: string,
    platformId: string
  ): Promise<boolean> {
    const count = await this.userModel
      .countDocuments({
        platforms: {
          $elemMatch: {
            name: platformName,
            id: platformId
          }
        }
      })
      .exec();
    return count > 0;
  }

  public async connectPlatformToUser(
    userId: string,
    platformData: UserPlatformData
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $push: { platforms: platformData },
          $set: { updatedAt: new Date() }
        },
        { new: true }
      )
      .exec();
  }

  public async removePlatformFromUser(
    userId: string,
    platformName: string
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $pull: { platforms: { name: platformName } },
          $set: { updatedAt: new Date() }
        },
        { new: true }
      )
      .exec();
  }

  public async updatePlatformAuthDataAtUser(
    userId: string,
    platformName: string,
    authData: UserPlatformAuthData
  ): Promise<UserEntity | null> {
    const document = await this.userModel
      .findOneAndUpdate(
        {
          _id: userId,
          'platforms.name': platformName
        },
        {
          $set: {
            'platforms.$.auth': authData,
            updatedAt: new Date()
          }
        },
        {
          new: true
        }
      )
      .exec();
    return this.mapper.toDomain(document);
  }
}
