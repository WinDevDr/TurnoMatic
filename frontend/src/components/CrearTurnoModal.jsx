import { useState, useEffect } from 'react'

const SERVICIOS = [
  'Asegurado',
  'No Asegurado',
  'Toma de Muestra',
  'Entrega de Resultados',
  'Pre-Registro',
  'Turno Preferencial',
  'Cotización',
]

const SUCURSALES = ['Analisa Piantini', 'Analisa Centro', 'Analisa Norte', 'Analisa Sur']

const PREFIJOS = {
  'Asegurado':           'A',
  'No Asegurado':        'B',
  'Toma de Muestra':     'T',
  'Entrega de Resultados': 'E',
  'Pre-Registro':        'P',
  'Turno Preferencial':  'R',
  'Cotización':          'C',
}

// Generates a preview code (not incremented) for display purposes only.
// The actual sequential code is generated on submit by the caller.
function previewCode(servicio) {
  const prefix = PREFIJOS[servicio] ?? 'X'
  return `${prefix}#`
}

export { PREFIJOS, SUCURSALES }

export default function CrearTurnoModal({ open, onClose, onCrear, sucursalActiva }) {
  const [form, setForm] = useState({
    nombre: '',
    servicio: SERVICIOS[0],
    sucursal: sucursalActiva ?? SUCURSALES[0],
    nota: '',
  })

  // Reset form each time the modal opens
  useEffect(() => {
    if (open) {
      setForm({
        nombre: '',
        servicio: SERVICIOS[0],
        sucursal: sucursalActiva ?? SUCURSALES[0],
        nota: '',
      })
    }
  }, [open, sucursalActiva])

  if (!open) return null

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const now = new Date()
    onCrear({
      nombre:   form.nombre.trim() || null,
      servicio: form.servicio,
      sucursal: form.sucursal,
      nota:     form.nota.trim() || null,
      creadoEn: now,
    })
    onClose()
  }

  const preview = previewCode(form.servicio)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Crear turno</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {/* Turn code preview */}
            <div className="flex items-center gap-4 p-4 bg-brand-50 rounded-xl border border-brand-100">
              <div className="w-14 h-14 rounded-xl bg-brand-500 flex items-center justify-center flex-shrink-0 shadow">
                <span className="text-white font-bold text-xl tracking-wide">{preview}</span>
              </div>
              <div>
                <p className="text-xs text-brand-600 font-semibold uppercase tracking-wide">Número de turno</p>
                <p className="text-2xl font-bold text-brand-700">{preview}</p>
                <p className="text-xs text-gray-500 mt-0.5">{form.servicio}</p>
              </div>
            </div>

            {/* Patient name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre del paciente <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                className="input"
                placeholder="Ej. Juan Martínez"
                value={form.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
              />
            </div>

            {/* Service type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tipo de servicio <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SERVICIOS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleChange('servicio', s)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium border text-left transition-all duration-150 ${
                      form.servicio === s
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300 hover:bg-brand-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Sucursal <span className="text-red-500">*</span>
              </label>
              <select
                className="input"
                value={form.sucursal}
                onChange={(e) => handleChange('sucursal', e.target.value)}
              >
                {SUCURSALES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nota <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <textarea
                className="input resize-none"
                rows={2}
                placeholder="Ej. Paciente con movilidad reducida"
                value={form.nota}
                onChange={(e) => handleChange('nota', e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button type="submit" className="btn-primary flex-1">
                Crear turno
              </button>
              <button type="button" onClick={onClose} className="btn-secondary px-6">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
