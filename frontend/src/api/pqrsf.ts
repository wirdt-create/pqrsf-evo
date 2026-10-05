export type CreatePqrsfInput = {
  nombre_solicitante: string;
  id_nit_solicitante: string;
  correo_solicitante: string;
  tipo_usuario: 'ADMINISTRATIVO' | 'EN_MISION' | 'CLIENTE' | 'PROVEEDOR';
  tipo_pqrsf: 'PETICION' | 'QUEJA' | 'RECLAMO' | 'SUGERENCIA' | 'FELICITACION';
  proceso_relacionado: string;
  descripcion_solicitud: string;
};

export type CreatePqrsfResult = {
  id_radicado: string;
  estado: 'RADICADA';
  fecha_radicacion: string;
};

export async function createPqrsf(input: CreatePqrsfInput): Promise<CreatePqrsfResult> {
  const response = await fetch('/pqrsf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const apiMessage =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? (payload as { message?: string | string[] }).message
        : undefined;
    const message = Array.isArray(apiMessage) ? apiMessage.join(' ') : apiMessage;
    throw new Error(message || 'No fue posible radicar la solicitud. Intente de nuevo.');
  }

  return payload as CreatePqrsfResult;
}
