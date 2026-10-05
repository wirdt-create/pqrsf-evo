import { Injectable } from '@nestjs/common';

@Injectable()
export class CaptchaService {
  async verify(_token?: string): Promise<boolean> {
    // Punto de extensión: conectar aquí reCAPTCHA/hCaptcha cuando se habilite.
    // La verificación permanece desactivada en esta fase.
    return true;
  }
}
