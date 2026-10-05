import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CaptchaService } from './captcha.service';
import { CreatePqrsfDto } from './create-pqrsf.dto';
import { PqrsfService } from './pqrsf.service';

@Controller('pqrsf')
export class PqrsfController {
  constructor(
    private readonly pqrsfService: PqrsfService,
    private readonly captchaService: CaptchaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async create(@Body() body: CreatePqrsfDto) {
    const captchaAccepted = await this.captchaService.verify(body.captcha_token);
    if (!captchaAccepted) {
      throw new ForbiddenException('No fue posible validar la solicitud.');
    }

    return this.pqrsfService.create(body);
  }
}
