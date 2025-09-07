import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

export enum QueueName {
  IMAGE_PROCESSING = 'image-processing',
  EMAIL = 'email',
  WEBHOOK = 'webhook',
}

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QueueName.IMAGE_PROCESSING) private imageProcessingQueue: Queue,
    @InjectQueue(QueueName.EMAIL) private emailQueue: Queue,
    @InjectQueue(QueueName.WEBHOOK) private webhookQueue: Queue,
  ) {}

  async addImageProcessingJob(data: {
    mediaId: string;
    appId: string;
    filePath: string;
    operations: string[];
  }) {
    return this.imageProcessingQueue.add('process-image', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  async addEmailJob(data: {
    to: string;
    subject: string;
    template: string;
    context: Record<string, any>;
  }) {
    return this.emailQueue.add('send-email', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  async addWebhookJob(data: {
    url: string;
    payload: Record<string, any>;
    headers?: Record<string, string>;
  }) {
    return this.webhookQueue.add('send-webhook', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }
}
