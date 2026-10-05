import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EstadoPqrsf } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreatePqrsfDto } from './create-pqrsf.dto';

@Injectable()
export class PqrsfService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreatePqrsfDto) {
    const [sequenceRow] = await this.prisma.$queryRaw<Array<{ sequence: bigint }>>`
      SELECT nextval('public.pqrsf_radicado_seq') AS sequence
    `;
    if (!sequenceRow) {
      throw new InternalServerErrorException('No fue posible generar el número de radicado.');
    }
    const year = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      timeZone: 'America/Bogota',
    }).format(new Date());
    const idRadicado = `PQRSF-${year}-${sequenceRow.sequence.toString().padStart(6, '0')}`;

    const record = await this.prisma.pqrsf.create({
      data: {
        idRadicado,
        nombreSolicitante: input.nombre_solicitante,
        idNitSolicitante: input.id_nit_solicitante,
        correoSolicitante: input.correo_solicitante,
        tipoUsuario: input.tipo_usuario,
        tipoPqrsf: input.tipo_pqrsf,
        procesoRelacionado: input.proceso_relacionado,
        descripcionSolicitud: input.descripcion_solicitud,
        estado: EstadoPqrsf.RADICADA,
      },
      select: {
        idRadicado: true,
        estado: true,
        fechaRadicacion: true,
      },
    });

    return {
      id_radicado: record.idRadicado,
      estado: record.estado,
      fecha_radicacion: record.fechaRadicacion,
    };
  }
}
