import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EstadoPqrsf } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CaptchaService } from './captcha.service';
import { CreatePqrsfDto } from './create-pqrsf.dto';

@Injectable()
export class PqrsfService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly captchaService: CaptchaService,
  ) {}

  async create(data: CreatePqrsfDto) {
    await this.captchaService.verify(data.captcha_token);

    const [sequenceRow] = await this.prisma.$queryRaw<Array<{ value: bigint }>>`
      SELECT nextval('public.pqrsf_radicado_seq') AS value
    `;
    if (!sequenceRow) {
      throw new InternalServerErrorException('No fue posible generar el número de radicado.');
    }

    const year = new Date().getFullYear();
    const idRadicado = `PQRSF-${year}-${sequenceRow.value.toString().padStart(6, '0')}`;

    const pqrsf = await this.prisma.pqrsf.create({
      data: {
        id_radicado: idRadicado,
        nombre_solicitante: data.nombre_solicitante,
        id_nit_solicitante: data.id_nit_solicitante,
        correo_solicitante: data.correo_solicitante,
        tipo_usuario: data.tipo_usuario,
        tipo_pqrsf: data.tipo_pqrsf,
        proceso_relacionado: data.proceso_relacionado,
        descripcion_solicitud: data.descripcion_solicitud,
        estado: EstadoPqrsf.RADICADA,
      },
      select: {
        id_radicado: true,
        estado: true,
        fecha_radicacion: true,
      },
    });

    return pqrsf;
  }
}
