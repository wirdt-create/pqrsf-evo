import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const TIPOS_USUARIO = ['ADMINISTRATIVO', 'EN_MISION', 'CLIENTE', 'PROVEEDOR'] as const;
const TIPOS_PQRSF = ['PETICION', 'QUEJA', 'RECLAMO', 'SUGERENCIA', 'FELICITACION'] as const;

const trimText = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreatePqrsfDto {
  @Transform(trimText)
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  nombre_solicitante!: string;

  @Transform(trimText)
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  id_nit_solicitante!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  correo_solicitante!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsIn(TIPOS_USUARIO)
  tipo_usuario!: (typeof TIPOS_USUARIO)[number];

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsIn(TIPOS_PQRSF)
  tipo_pqrsf!: (typeof TIPOS_PQRSF)[number];

  @Transform(trimText)
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  proceso_relacionado!: string;

  @Transform(trimText)
  @IsString()
  @IsNotEmpty()
  @MaxLength(10_000)
  descripcion_solicitud!: string;

  @IsOptional()
  @IsString()
  captcha_token?: string;
}
