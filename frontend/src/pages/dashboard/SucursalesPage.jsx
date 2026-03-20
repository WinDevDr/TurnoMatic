import { useState } from 'react'

const mockSucursales = [
  { id: 1, nombre: 'Sede Central',  direccion: 'Av. Principal 100, Ciudad',    telefono: '555-1000', usuarios: 5, activa: true },
  { id: 2, nombre: 'Sede Norte',    direccion: 'Calle Norte 45, Zona Norte',   telefono: '555-2000', usuarios: 2, activa: true },
  { id: 3, nombre: 'Sede Sur',      direccion: 'Blvd. Sur 320, Zona Sur',      telefono: '555-3000', usuarios: 3, activa: false },
]

export default function SucursalesPage() {
  const [sucursales] = useState(mockSucursales)
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sucursales</h1>
          <p className="text-sm text-gray-500 mt-0.5">Administra las sedes y puntos de atención.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva sucursal
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card border border-brand-200">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Agregar sucursal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la sucursal</label>
              <input className="input" placeholder="Ej. Sede Este" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input className="input" placeholder="555-0000" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input className="input" placeholder="Calle, número, zona" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button className="btn-primary">Guardar sucursal</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
          </div>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sucursales.map((s) => (
          <div
            key={s.id}
            className={`card border transition-all duration-200 ${s.activa ? 'border-gray-100 hover:border-brand-200 hover:shadow-md' : 'border-gray-100 opacity-60'}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${s.activa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.activa ? 'bg-green-500' : 'bg-gray-400'}`} />
                {s.activa ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            <h3 className="font-semibold text-gray-900 text-base">{s.nombre}</h3>
            <p className="text-sm text-gray-500 mt-1">{s.direccion}</p>

            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {s.telefono}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {s.usuarios} usuarios
              </span>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">Editar</button>
              <span className="text-gray-300">|</span>
              <button className={`text-xs font-medium ${s.activa ? 'text-red-500 hover:text-red-600' : 'text-green-600 hover:text-green-700'}`}>
                {s.activa ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
