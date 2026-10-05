import { Module } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { PqrsfController } from './pqrsf.controller';
import { PqrsfService } from './pqrsf.service';

@Module({
  controllers: [PqrsfController],
  providers: [CaptchaService, PqrsfService],
})
export class PqrsfModule {}
