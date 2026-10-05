import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createPqrsf } from '../api/pqrsf';

const radicacionSchema = z.object({
  nombre_solicitante: z.string().trim().min(2, 'Escriba su nombre completo.'),
  id_nit_solicitante: z.string().trim().min(3, 'Escriba su número de identificación.'),
  correo_solicitante: z.string().trim().email('Ingrese un correo electrónico válido.'),
  tipo_usuario: z.enum(['ADMINISTRATIVO', 'EN_MISION', 'CLIENTE', 'PROVEEDOR']),
  tipo_pqrsf: z.enum(['PETICION', 'QUEJA', 'RECLAMO', 'SUGERENCIA', 'FELICITACION']),
  proceso_relacionado: z.string().trim().min(2, 'Indique el proceso relacionado.'),
  descripcion_solicitud: z.string().trim().min(10, 'Describa la solicitud (mínimo 10 caracteres).'),
});

type RadicacionValues = z.infer<typeof radicacionSchema>;

const inputClassName =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100';
const labelClassName = 'mb-2 block text-sm font-semibold text-slate-700';

export function RadicacionForm() {
  const mutation = useMutation({ mutationFn: createPqrsf });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RadicacionValues>({
    resolver: zodResolver(radicacionSchema),
    mode: 'onBlur',
    defaultValues: {
      nombre_solicitante: '',
      id_nit_solicitante: '',
      correo_solicitante: '',
      tipo_usuario: 'ADMINISTRATIVO',
      tipo_pqrsf: 'PETICION',
      proceso_relacionado: '',
      descripcion_solicitud: '',
    },
  });

  const submit = handleSubmit((values) => {
    mutation.reset();
    mutation.mutate(values, { onSuccess: () => reset() });
  });

  return (
    <form className="grid gap-5 sm:grid-cols-2" onSubmit={submit} noValidate>
      <label>
        <span className={labelClassName}>Nombre completo</span>
        <input className={inputClassName} autoComplete="name" {...register('nombre_solicitante')} />
        {errors.nombre_solicitante && <span className="mt-1 block text-sm text-rose-700">{errors.nombre_solicitante.message}</span>}
      </label>

      <label>
        <span className={labelClassName}>Cédula o NIT</span>
        <input className={inputClassName} autoComplete="off" {...register('id_nit_solicitante')} />
        {errors.id_nit_solicitante && <span className="mt-1 block text-sm text-rose-700">{errors.id_nit_solicitante.message}</span>}
      </label>

      <label>
        <span className={labelClassName}>Correo electrónico</span>
        <input className={inputClassName} type="email" autoComplete="email" {...register('correo_solicitante')} />
        {errors.correo_solicitante && <span className="mt-1 block text-sm text-rose-700">{errors.correo_solicitante.message}</span>}
      </label>

      <label>
        <span className={labelClassName}>Relación con EVO</span>
        <select className={inputClassName} {...register('tipo_usuario')}>
          <option value="ADMINISTRATIVO">Personal administrativo</option>
          <option value="EN_MISION">Personal en misión</option>
          <option value="CLIENTE">Cliente</option>
          <option value="PROVEEDOR">Proveedor</option>
        </select>
      </label>

      <label>
        <span className={labelClassName}>Tipo de PQRSF</span>
        <select className={inputClassName} {...register('tipo_pqrsf')}>
          <option value="PETICION">Petición</option>
          <option value="QUEJA">Queja</option>
          <option value="RECLAMO">Reclamo</option>
          <option value="SUGERENCIA">Sugerencia</option>
          <option value="FELICITACION">Felicitación</option>
        </select>
      </label>

      <label className="sm:col-span-2">
        <span className={labelClassName}>Proceso relacionado</span>
        <input className={inputClassName} {...register('proceso_relacionado')} />
        {errors.proceso_relacionado && <span className="mt-1 block text-sm text-rose-700">{errors.proceso_relacionado.message}</span>}
      </label>

      <label className="sm:col-span-2">
        <span className={labelClassName}>Descripción de la solicitud</span>
        <textarea
          className={`${inputClassName} min-h-36 resize-y`}
          rows={5}
          {...register('descripcion_solicitud')}
        />
        {errors.descripcion_solicitud && <span className="mt-1 block text-sm text-rose-700">{errors.descripcion_solicitud.message}</span>}
      </label>

      {mutation.isError && (
        <p role="alert" className="sm:col-span-2 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">
          {mutation.error.message}
        </p>
      )}

      {mutation.isSuccess && (
        <p role="status" className="sm:col-span-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
          Solicitud radicada correctamente. Tu número es <strong>{mutation.data.id_radicado}</strong>.
        </p>
      )}

      <div className="sm:col-span-2 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-500">Los campos son obligatorios. Tus datos se usarán para gestionar esta solicitud.</p>
        <button
          className="rounded-xl bg-cyan-700 px-6 py-3 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting || mutation.isPending}
        >
          {isSubmitting || mutation.isPending ? 'Enviando…' : 'Radicar solicitud'}
        </button>
      </div>
    </form>
  );
}
