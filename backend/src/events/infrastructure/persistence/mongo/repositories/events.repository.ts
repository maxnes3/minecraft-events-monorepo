import { IEventsRepository } from '@/events/domain/repositories/events-repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { EventEntity } from '@/events/domain/entities/event.entity';
import { EventMapper } from '../../mappers/event.mapper';

export class EventsRepository implements IEventsRepository {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    private readonly mapper: EventMapper
  ) {}

  public async findById(id: string): Promise<EventEntity | null> {
    const document = await this.eventModel.findById(id).exec();
    return this.mapper.toDomain(document);
  }

  public async findByUserId(userId: string): Promise<EventEntity[]> {
    const documents = await this.eventModel.find({ owner: userId }).exec();
    return documents
      .map((doc) => this.mapper.toDomain(doc))
      .filter((doc) => doc !== null);
  }

  public async save(event: EventEntity): Promise<void> {
    const data = this.mapper.toPersistence(event);
    await this.eventModel.create(data);
  }

  public async update(event: EventEntity): Promise<void> {
    const data = this.mapper.toPersistence(event);
    await this.eventModel
      .findByIdAndUpdate(event.getId(), { $set: data }, { new: true })
      .exec();
  }

  public async delete(id: string): Promise<void> {
    await this.eventModel.findByIdAndDelete(id).exec();
  }
}
