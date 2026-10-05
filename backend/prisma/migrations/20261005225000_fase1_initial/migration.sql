-- Initial migration generated from schema.prisma (Prisma 6.16.2).
-- The sequence provides concurrency-safe, yearly public radicado numbers.
CREATE SCHEMA IF NOT EXISTS "public";
CREATE SEQUENCE "public"."pqrsf_radicado_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

CREATE TYPE "public"."rol_usuario" AS ENUM ('ADMIN', 'ATENCION_CLIENTE', 'LIDER_AREA');
CREATE TYPE "public"."estado_pqrsf" AS ENUM ('RADICADA', 'ESCALADA', 'EN_VALIDACION', 'RESUELTA', 'EN_GESTION_REPLICA', 'CERRADA');
CREATE TYPE "public"."motivo_rechazo_respuesta" AS ENUM ('ERROR_ORTOGRAFICO', 'INCOHERENTE', 'TONO_INADECUADO', 'INFORMACION_INCOMPLETA', 'NO_RESUELVE_EL_FONDO', 'OTRO');

CREATE TABLE "public"."usuarios" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" "public"."rol_usuario" NOT NULL,
    "area" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."config_sla" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tipo_pqrsf" TEXT NOT NULL,
    "dias_habiles_limite" INTEGER NOT NULL,
    "dias_alerta_amarilla" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "config_sla_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."matriz_asignacion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "proceso" TEXT NOT NULL,
    "tipo_pqrsf" TEXT NOT NULL,
    "agente_responsable" UUID,
    "area" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "matriz_asignacion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."pqrsf" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_radicado" TEXT NOT NULL,
    "nombre_solicitante" TEXT NOT NULL,
    "id_nit_solicitante" TEXT NOT NULL,
    "correo_solicitante" TEXT NOT NULL,
    "tipo_usuario" TEXT NOT NULL,
    "tipo_pqrsf" TEXT NOT NULL,
    "proceso_relacionado" TEXT NOT NULL,
    "descripcion_solicitud" TEXT NOT NULL,
    "fecha_radicacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "public"."estado_pqrsf" NOT NULL DEFAULT 'RADICADA',
    "responsable_id" UUID,
    "fecha_inicio_gestion" TIMESTAMPTZ(6),
    "fecha_limite_sla" DATE,
    "descripcion_causa" TEXT,
    "es_error_humano" BOOLEAN,
    "descripcion_solucion" TEXT,
    "tipo_solucion" TEXT,
    "metodo_cierre" TEXT,
    "amerita_accion_correctiva" BOOLEAN DEFAULT false,
    "cliente_satisfecho" BOOLEAN,
    "explicacion_insatisfaccion" TEXT,
    "repetibilidad" TEXT,
    "encuesta_enviada" BOOLEAN NOT NULL DEFAULT false,
    "num_replicas" INTEGER NOT NULL DEFAULT 0,
    "replicas_agotadas" BOOLEAN NOT NULL DEFAULT false,
    "motivo_escalamiento" TEXT,
    "respuesta_propuesta" TEXT,
    "respuesta_propuesta_por" UUID,
    "respuesta_propuesta_en" TIMESTAMPTZ(6),
    "motivo_rechazo_respuesta" "public"."motivo_rechazo_respuesta",
    "comentario_rechazo_respuesta" TEXT,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pqrsf_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."bitacora_avances" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pqrsf_id" UUID NOT NULL,
    "usuario_id" UUID,
    "descripcion" TEXT NOT NULL,
    "adjunto_url" TEXT,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bitacora_avances_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."acciones_correctivas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pqrsf_id_origen" UUID NOT NULL,
    "causa_raiz" TEXT NOT NULL,
    "descripcion_accion" TEXT NOT NULL,
    "responsable_id" UUID,
    "fecha_compromiso" DATE,
    "estado" TEXT NOT NULL DEFAULT 'ABIERTA',
    "fecha_verificacion" DATE,
    "evidencias_url" TEXT,
    CONSTRAINT "acciones_correctivas_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."encuestas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pqrsf_id" UUID NOT NULL,
    "enviada_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondida" BOOLEAN NOT NULL DEFAULT false,
    "respondida_en" TIMESTAMPTZ(6),
    "satisfecho" BOOLEAN,
    "comentario" TEXT,
    CONSTRAINT "encuestas_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."log_auditoria" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fecha" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" UUID,
    "entidad_modificada" TEXT NOT NULL,
    "campo" TEXT NOT NULL,
    "valor_anterior" TEXT,
    "valor_nuevo" TEXT,
    CONSTRAINT "log_auditoria_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "usuarios_correo_key" ON "public"."usuarios"("correo");
CREATE UNIQUE INDEX "config_sla_tipo_pqrsf_key" ON "public"."config_sla"("tipo_pqrsf");
CREATE UNIQUE INDEX "pqrsf_id_radicado_key" ON "public"."pqrsf"("id_radicado");
CREATE INDEX "idx_pqrsf_fecha_radicacion" ON "public"."pqrsf"("fecha_radicacion");
CREATE INDEX "idx_pqrsf_estado" ON "public"."pqrsf"("estado");
CREATE INDEX "idx_pqrsf_responsable" ON "public"."pqrsf"("responsable_id");

ALTER TABLE "public"."matriz_asignacion" ADD CONSTRAINT "matriz_asignacion_agente_responsable_fkey" FOREIGN KEY ("agente_responsable") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."pqrsf" ADD CONSTRAINT "pqrsf_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."pqrsf" ADD CONSTRAINT "pqrsf_respuesta_propuesta_por_fkey" FOREIGN KEY ("respuesta_propuesta_por") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."bitacora_avances" ADD CONSTRAINT "bitacora_avances_pqrsf_id_fkey" FOREIGN KEY ("pqrsf_id") REFERENCES "public"."pqrsf"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."bitacora_avances" ADD CONSTRAINT "bitacora_avances_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."acciones_correctivas" ADD CONSTRAINT "acciones_correctivas_pqrsf_id_origen_fkey" FOREIGN KEY ("pqrsf_id_origen") REFERENCES "public"."pqrsf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."acciones_correctivas" ADD CONSTRAINT "acciones_correctivas_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."encuestas" ADD CONSTRAINT "encuestas_pqrsf_id_fkey" FOREIGN KEY ("pqrsf_id") REFERENCES "public"."pqrsf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."log_auditoria" ADD CONSTRAINT "log_auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
