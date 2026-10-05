import { RadicacionForm } from '../organisms/RadicacionForm';

export function RadicarPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-800">EVO · Atención al usuario</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Radica tu PQRSF</h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Comparte tu petición, queja, reclamo, sugerencia o felicitación. Te entregaremos un número de radicado para consultar tu solicitud.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-8" aria-labelledby="form-title">
          <div className="mb-7 border-b border-slate-200 pb-5">
            <h2 id="form-title" className="text-xl font-semibold text-slate-900">Información de la solicitud</h2>
            <p className="mt-1 text-sm text-slate-500">Completa tus datos y describe claramente el motivo de contacto.</p>
          </div>
          <RadicacionForm />
        </section>

        <p className="mt-6 text-center text-xs text-slate-500">EVO · Sistema de Peticiones, Quejas, Reclamos, Sugerencias y Felicitaciones</p>
      </div>
    </main>
  );
}
