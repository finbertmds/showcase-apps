import { Processor } from '@nestjs/bullmq';
import axios from 'axios';
import { Job } from 'bullmq';

interface WebhookJob {
  url: string;
  payload: Record<string, any>;
  headers?: Record<string, string>;
}

@Processor('webhook')
export class WebhookProcessor {
  async handleWebhookSending(job: Job<WebhookJob>) {
    const { url, payload, headers = {} } = job.data;

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Showcase-Apps-Webhook/1.0',
          ...headers,
        },
        timeout: 10000, // 10 seconds timeout
      });

      console.log(`Webhook sent successfully to ${url}: ${response.status}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to send webhook to ${url}:`, error.message);
      throw error;
    }
  }
}
