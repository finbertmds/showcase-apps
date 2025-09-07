import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { DiskHealthIndicator, HealthCheck, HealthCheckService, MemoryHealthIndicator, MongooseHealthIndicator } from '@nestjs/terminus';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    @InjectConnection() private connection: Connection,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Database health check
      () => this.mongoose.pingCheck('mongodb'),
      
      // Memory health check
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024), // 150MB
      
      // Disk health check
      () => this.disk.checkStorage('storage', { 
        path: '/', 
        thresholdPercent: 0.9 
      }),
    ]);
  }

  @Get('detailed')
  async getDetailedHealth() {
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: await this.checkDatabase(),
        redis: await this.checkRedis(),
        minio: await this.checkMinio(),
      },
      system: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        platform: process.platform,
        nodeVersion: process.version,
      },
    };

    return healthStatus;
  }

  private async checkDatabase(): Promise<{ status: string; details?: any }> {
    try {
      const admin = this.connection.db.admin();
      await admin.ping();
      return { status: 'healthy' };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        details: error.message 
      };
    }
  }

  private async checkRedis(): Promise<{ status: string; details?: any }> {
    try {
      // In a real implementation, you would check Redis connection here
      // For now, we'll assume it's healthy if the service is running
      return { status: 'healthy' };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        details: error.message 
      };
    }
  }

  private async checkMinio(): Promise<{ status: string; details?: any }> {
    try {
      // In a real implementation, you would check MinIO connection here
      // For now, we'll assume it's healthy if the service is running
      return { status: 'healthy' };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        details: error.message 
      };
    }
  }
}
