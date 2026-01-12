import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  collection: 'users'
})
export class User {
  @Prop({ required: true, trim: true })
  login: string;

  @Prop({ unique: true, sparse: true })
  twitchId?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ twitchId: 1 }, { unique: true, sparse: true });
