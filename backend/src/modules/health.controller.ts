import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHello(): { message: string } {
    return { message: 'Hola, EVO. API PQRSF Fase 1 lista para radicación.' };
  }

  @Get('health')
  async getHealth(): Promise<{ status: string; database: string }> {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'connected' };
  }
}
