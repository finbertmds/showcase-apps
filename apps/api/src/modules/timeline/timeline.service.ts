import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTimelineEventInput, UpdateTimelineEventInput } from '../../dto/timeline-event.dto';
import { TimelineEvent, TimelineEventDocument } from '../../schemas/timeline-event.schema';

@Injectable()
export class TimelineService {
  constructor(
    @InjectModel(TimelineEvent.name) private timelineEventModel: Model<TimelineEventDocument>,
  ) {}

  async create(createTimelineEventInput: CreateTimelineEventInput, userId: string): Promise<TimelineEvent> {
    const event = new this.timelineEventModel({
      ...createTimelineEventInput,
      createdBy: userId,
    });
    return event.save();
  }

  async findByAppId(appId: string, isPublic = true): Promise<TimelineEvent[]> {
    const query: any = { appId };
    if (isPublic) {
      query.isPublic = true;
    }

    return this.timelineEventModel
      .find(query)
      .sort({ date: -1 })
      .populate('createdBy', 'name email')
      .exec();
  }

  async findAll(limit = 20, offset = 0): Promise<{ events: TimelineEvent[]; total: number }> {
    const query = { isPublic: true };

    const [events, total] = await Promise.all([
      this.timelineEventModel
        .find(query)
        .populate('appId', 'title slug')
        .populate('createdBy', 'name email')
        .sort({ date: -1 })
        .limit(limit)
        .skip(offset)
        .exec(),
      this.timelineEventModel.countDocuments(query).exec(),
    ]);

    return { events, total };
  }

  async update(id: string, updateTimelineEventInput: UpdateTimelineEventInput): Promise<TimelineEvent> {
    const event = await this.timelineEventModel
      .findByIdAndUpdate(id, updateTimelineEventInput, { new: true })
      .populate('createdBy', 'name email')
      .exec();

    if (!event) {
      throw new NotFoundException('Timeline event not found');
    }

    return event;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.timelineEventModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
