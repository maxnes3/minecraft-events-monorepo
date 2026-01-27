import { Types } from 'mongoose';
import { EventDTO } from '@/events/application/dto/event.dto';
import { EventStatus } from './events.enums';

export class EventEntity {
  constructor(
    private readonly _id: string,
    private readonly owner: string,
    private name: string,
    private duration: number,
    private status: EventStatus,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  public static create(
    owner: string,
    name: string,
    duration: number,
    status: EventStatus = EventStatus.READY
  ): EventEntity {
    const id = new Types.ObjectId().toString();
    return new EventEntity(id, owner, name, duration, status);
  }

  public static restore(
    id: string,
    owner: string,
    name: string,
    duration: number,
    status: EventStatus,
    createdAt?: Date,
    updatedAt?: Date
  ): EventEntity {
    return new EventEntity(
      id,
      owner,
      name,
      duration,
      status,
      createdAt || new Date(),
      updatedAt || new Date()
    );
  }

  public toDTO(): EventDTO {
    return {
      _id: this._id,
      owner: this.owner,
      name: this.name,
      duration: this.duration,
      status: this.status,
      createdAt: this.createdAt.toDateString(),
      updatedAt: this.updatedAt.toDateString()
    };
  }

  public setName(name: string) {
    this.name = name;
    this.updatedAt = new Date();
  }

  public setDuration(duration: number) {
    this.duration = duration;
    this.updatedAt = new Date();
  }

  public setStatus(status: EventStatus) {
    this.status = status;
    this.updatedAt = new Date();
  }

  public getId() {
    return this._id;
  }

  public getOwner() {
    return this.owner;
  }

  public getName() {
    return this.name;
  }

  public getDuration() {
    return this.duration;
  }

  public getStatus() {
    return this.status;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
