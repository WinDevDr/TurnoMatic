import { useState } from 'react'

const tiposTurno = ['Asegurado','No Asegurado','Toma de Muestra','Entrega de Resultados','Pre-Registro','Turno Preferencial','Cotización']

function generarId() {
  const letra = ['A','B','C','D'][Math.floor(Math.random() * 4)]
  const num   = String(Math.floor(Math.random() * 900) + 100)
  return `${letra}-${num}`
}

const initialTurnos = [
  { id: 'A-001', tipo: 'Asegurado',          estado: 'Atendido',  hora: '08:12', puesto: 'Ventanilla 1', sucursal: 'Sede Central' },
  { id: 'B-002', tipo: 'No Asegurado',        estado: 'En espera', hora: '08:25', puesto: '—',            sucursal: 'Sede Norte'   },
  { id: 'A-003', tipo: 'Toma de Muestra',     estado: 'Atendido',  hora: '08:40', puesto: 'Sala 3',       sucursal: 'Sede Central' },
  { id: 'C-004', tipo: 'Entrega Resultados',  estado: 'Cancelado', hora: '08:55', puesto: '—',            sucursal: 'Sede Sur'     },
  { id: 'B-005', tipo: 'Pre-Registro',        estado: 'En espera', hora: '09:10', puesto: 'Ventanilla 1', sucursal: 'Sede Central' },
]

const estadoBadge = {
  'Atendido':  'bg-green-100 text-green-700',
  'En espera': 'bg-amber-100 text-amber-700',
  'Cancelado': 'bg-red-100 text-red-600',
}

const ESTADOS = ['Todos','En espera','Atendido','Cancelado']

export default function TurnosPage() {
  const [turnos, setTurnos]   = useState(initialTurnos)
  const [filtro, setFiltro]   = useState('Todos')
  const [search, setSearch]   = useState('')
  const [showNew, setShowNew] = useState(false)
  const [newTipo, setNewTipo] = useState(tiposTurno[0])

  function handleNuevoTurno() {
    const now  = new Date()
    const hora = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    setTurnos((prev) => [
      { id: generarId(), tipo: newTipo, estado: 'En espera', hora, puesto: '—', sucursal: 'Sede Central' },
      ...prev,
    ])
    setShowNew(false)
  }

  const filtered = turnos.filter((t) => {
    const matchEstado = filtro === 'Todos' || t.estado === filtro
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) ||
                        t.tipo.toLowerCase().includes(search.toLowerCase())
    return matchEstado && matchSearch
  })

  const counts = {
    'En espera': turnos.filter((t) => t.estado === 'En espera').length,
    'Atendido':  turnos.filter((t) => t.estado === 'Atendido').length,
    'Cancelado': turnos.filter((t) => t.estado === 'Cancelado').length,
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Turnos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestiona y supervisa la cola de turnos activos.</p>
        </div>
        <button
          onClick={() => setShowNew((v) => !v)}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo turno
        </button>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'En espera', count: counts['En espera'], color: 'amber' },
          { label: 'Atendidos', count: counts['Atendido'],  color: 'green' },
          { label: 'Cancelados', count: counts['Cancelado'], color: 'red'  },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <p className={`text-2xl font-bold ${s.color === 'amber' ? 'text-amber-600' : s.color === 'green' ? 'text-green-600' : 'text-red-500'}`}>
              {s.count}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* New turno form */}
      {showNew && (
        <div className="card border border-brand-200">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Generar nuevo turno</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de turno</label>
              <select className="input" value={newTipo} onChange={(e) => setNewTipo(e.target.value)}>
                {tiposTurno.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-end gap-3">
              <button onClick={handleNuevoTurno} className="btn-primary">Generar turno</button>
              <button onClick={() => setShowNew(false)} className="btn-secondary">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="input pl-10"
            placeholder="Buscar por ID o tipo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ESTADOS.map((e) => (
            <button
              key={e}
              onClick={() => setFiltro(e)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtro === e
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Turno','Tipo','Hora','Puesto','Sucursal','Estado','Acciones'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-gray-800">{t.id}</td>
                  <td className="px-6 py-4 text-gray-600">{t.tipo}</td>
                  <td className="px-6 py-4 text-gray-500">{t.hora}</td>
                  <td className="px-6 py-4 text-gray-500">{t.puesto}</td>
                  <td className="px-6 py-4 text-gray-500">{t.sucursal}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${estadoBadge[t.estado]}`}>
                      {t.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {t.estado === 'En espera' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTurnos((prev) => prev.map((x) => x.id === t.id ? { ...x, estado: 'Atendido', puesto: 'Ventanilla 1' } : x))}
                          className="text-xs text-green-600 hover:text-green-700 font-medium"
                        >
                          Llamar
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => setTurnos((prev) => prev.map((x) => x.id === t.id ? { ...x, estado: 'Cancelado' } : x))}
                          className="text-xs text-red-500 hover:text-red-600 font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400 text-sm">
                    No hay turnos que coincidan con el filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
