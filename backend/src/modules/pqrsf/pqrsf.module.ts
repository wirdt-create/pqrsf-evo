import { Module } from '@nestjs/common';
import { PqrsfController } from './pqrsf.controller';
import { PqrsfService } from './pqrsf.service';
import { CaptchaService } from './captcha.service';

@Module({
  controllers: [PqrsfController],
  providers: [PqrsfService, CaptchaService],
})
export class PqrsfModule {}
