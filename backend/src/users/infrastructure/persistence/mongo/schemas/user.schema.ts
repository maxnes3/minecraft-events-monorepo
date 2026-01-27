import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  collection: 'users'
})
export class UserPlatformAuthData {
  @Prop({ required: true })
  accessToken: string;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true })
  expiresIn: number;
}

@Schema({
  timestamps: true,
  collection: 'users'
})
export class UserPlatformData {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  id: string;

  @Prop()
  login?: string;

  @Prop()
  profileImgUrl?: string;

  @Prop({ type: UserPlatformAuthData, default: {} })
  auth: UserPlatformAuthData;
}

@Schema({
  timestamps: true,
  collection: 'users'
})
export class User {
  @Prop({ type: [UserPlatformData], default: [] })
  platforms: UserPlatformData[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ 'platforms.name': 1 });
UserSchema.index({ 'platforms.id': 1 }, { sparse: true });
UserSchema.index(
  { 'platforms.name': 1, 'platforms.id': 1 },
  { unique: true, sparse: true }
);
