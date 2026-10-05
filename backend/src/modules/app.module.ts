import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma.module';
import { PqrsfModule } from './pqrsf/pqrsf.module';

@Module({
  imports: [
    PrismaModule,
    PqrsfModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 5 }]),
  ],
  controllers: [HealthController],
})
export class AppModule {}
