import { EventStatus } from '@/events/domain/entities/events.enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({
  timestamps: true,
  collection: 'events'
})
export class Event {
  @Prop({ required: true, trim: true })
  owner: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  duration: number;

  @Prop({
    type: String,
    enum: Object.values(EventStatus),
    default: EventStatus.READY
  })
  status: EventStatus;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.index({ owner: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ owner: 1, status: 1 });
EventSchema.index({ createdAt: -1 });
