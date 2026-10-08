import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CreatePqrsfDto } from './create-pqrsf.dto';
import { PqrsfService } from './pqrsf.service';

@Controller('pqrsf')
export class PqrsfController {
  constructor(private readonly pqrsfService: PqrsfService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  create(@Body() body: CreatePqrsfDto) {
    return this.pqrsfService.create(body);
  }
}
