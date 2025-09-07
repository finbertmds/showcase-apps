import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueName, QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QueueName.IMAGE_PROCESSING },
      { name: QueueName.EMAIL },
      { name: QueueName.WEBHOOK },
    ),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
