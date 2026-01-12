import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUsersRepository } from '@/users/domain/repositories/users-repository.interface';
import { UserEntity } from '@/users/domain/entities/user.entity';
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

  public async findByTwitchId(twitchId: string): Promise<UserEntity | null> {
    const document = await this.userModel.findOne({ twitchId }).exec();
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

  public async existsByTwitchId(twitchId: string): Promise<boolean> {
    const count = await this.userModel.countDocuments({ twitchId }).exec();
    return count > 0;
  }
}
