import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from '../../schemas/app.schema';
import { TimelineEvent, TimelineEventSchema } from '../../schemas/timeline-event.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { TimelineResolver } from './timeline.resolver';
import { TimelineService } from './timeline.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TimelineEvent.name, schema: TimelineEventSchema },
      { name: App.name, schema: AppSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [TimelineResolver, TimelineService],
  exports: [TimelineService],
})
export class TimelineModule {}
