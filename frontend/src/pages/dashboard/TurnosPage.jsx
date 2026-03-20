import { useState, useEffect, useRef, useCallback } from 'react'
import CrearTurnoModal, { PREFIJOS } from '../../components/CrearTurnoModal.jsx'

const SUCURSALES = ['Analisa Piantini', 'Analisa Centro', 'Analisa Norte', 'Analisa Sur']

// Kanban stages (ordered pipeline)
const ETAPAS = [
  { id: 'pendiente',          label: 'Turnos pendientes',          badge: 'bg-amber-500'  },
  { id: 'facturacion',        label: 'Facturación',                badge: 'bg-orange-500' },
  { id: 'pendiente_muestra',  label: 'Pendiente Toma de Muestra',  badge: 'bg-indigo-500' },
  { id: 'toma_muestra',       label: 'Toma de Muestra',            badge: 'bg-purple-500' },
  { id: 'finalizado',         label: 'Finalizar',                  badge: 'bg-green-500'  },
]

const DEMO_AGO_MS = 22 * 60 * 1000 + 6 * 1000 // 22 min 6 sec

function makeInitialTurnos() {
  return [
    {
      id: 'demo-1',
      codigo: 'A1',
      servicio: 'Asegurado',
      nombre: null,
      etapa: 'pendiente',
      cancelado: false,
      sucursal: 'Analisa Piantini',
      creadoEn: new Date(Date.now() - DEMO_AGO_MS),
    },
  ]
}

// Per-session sequential code counters (prefix → number)
const codeCounters = {}
function nextCode(servicio) {
  const prefix = PREFIJOS[servicio] ?? 'X'
  codeCounters[prefix] = (codeCounters[prefix] ?? 0) + 1
  return `${prefix}${codeCounters[prefix]}`
}

function useElapsedTimer(creadoEn) {
  const [elapsed, setElapsed] = useState(
    () => Math.floor((Date.now() - new Date(creadoEn).getTime()) / 1000),
  )
  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(creadoEn).getTime()) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [creadoEn])

  const h = String(Math.floor(elapsed / 3600)).padStart(2, '0')
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')
  const s = String(elapsed % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function TurnoCard({ turno, onMover, onCancelar }) {
  const timer = useElapsedTimer(turno.creadoEn)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleOutsideClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [menuOpen])

  const etapaIdx = ETAPAS.findIndex((e) => e.id === turno.etapa)
  const nextEtapa = ETAPAS[etapaIdx + 1] ?? null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header row */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-lg font-bold text-gray-900 tracking-wide">{turno.codigo}</span>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Opciones del turno"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 bg-white rounded-xl border border-gray-100 shadow-lg py-1 min-w-[185px]">
              {nextEtapa && (
                <button
                  onClick={() => { onMover(turno.id, nextEtapa.id); setMenuOpen(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="truncate">Mover: {nextEtapa.label}</span>
                </button>
              )}
              <button
                onClick={() => { onCancelar(turno.id); setMenuOpen(false) }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar turno
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Patient name */}
      {turno.nombre && (
        <p className="text-xs text-gray-500 mb-1.5 truncate">{turno.nombre}</p>
      )}

      {/* Elapsed timer */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
        <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-mono">{timer}</span>
      </div>

      {/* Pendiente badge */}
      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        Pendiente
      </span>
    </div>
  )
}

function KanbanColumn({ etapa, turnos, onMover, onCancelar }) {
  return (
    <div className="flex-shrink-0 w-60">
      {/* Column header */}
      <button
        className={`
          w-full flex items-center justify-between gap-2 px-3 py-2 mb-3
          bg-white rounded-lg border border-gray-200 text-left
          hover:border-gray-300 transition-colors
        `}
      >
        <span className="text-sm font-medium text-gray-700 truncate">{etapa.label}</span>
        <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-white text-xs font-bold flex-shrink-0 ${etapa.badge}`}>
          {turnos.length}
        </span>
      </button>

      {/* Turn cards */}
      <div className="space-y-3 min-h-[80px]">
        {turnos.map((t) => (
          <TurnoCard key={t.id} turno={t} onMover={onMover} onCancelar={onCancelar} />
        ))}
        {turnos.length === 0 && (
          <div className="h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-400">Sin turnos</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TurnosPage() {
  const [turnos, setTurnos] = useState(makeInitialTurnos)
  const [sucursal, setSucursal] = useState(SUCURSALES[0])
  const [tab, setTab] = useState('actuales')
  const [modalOpen, setModalOpen] = useState(false)

  // Active (non-cancelled) turns for selected branch
  const activosDeSucursal = turnos.filter((t) => t.sucursal === sucursal && !t.cancelado)
  const canceladosDeSucursal = turnos.filter((t) => t.sucursal === sucursal && t.cancelado)

  const stats = {
    pendientes: activosDeSucursal.filter((t) => t.etapa === 'pendiente').length,
    atendiendo: activosDeSucursal.filter(
      (t) => t.etapa === 'facturacion' || t.etapa === 'pendiente_muestra' || t.etapa === 'toma_muestra',
    ).length,
    atendidos:  activosDeSucursal.filter((t) => t.etapa === 'finalizado').length,
    cancelados: canceladosDeSucursal.length,
  }

  const handleCrear = useCallback((data) => {
    const codigo = nextCode(data.servicio)
    setTurnos((prev) => [
      ...prev,
      { id: `t-${Date.now()}`, codigo, ...data, etapa: 'pendiente', cancelado: false },
    ])
  }, [])

  const handleMover = useCallback((id, nuevaEtapa) => {
    setTurnos((prev) => prev.map((t) => (t.id === id ? { ...t, etapa: nuevaEtapa } : t)))
  }, [])

  const handleCancelar = useCallback((id) => {
    setTurnos((prev) => prev.map((t) => (t.id === id ? { ...t, cancelado: true } : t)))
  }, [])

  // Group active turns by stage for the kanban board
  const byEtapa = Object.fromEntries(
    ETAPAS.map((e) => [e.id, activosDeSucursal.filter((t) => t.etapa === e.id)]),
  )

  return (
    <div className="space-y-5">
      {/* Page title + action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Turnos</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear turno
        </button>
      </div>

      {/* Branch filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-gray-500 font-medium">Filtrar por sucursal:</span>
        <div className="relative">
          <select
            className="appearance-none pl-3 pr-8 py-1.5 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent cursor-pointer"
            value={sucursal}
            onChange={(e) => setSucursal(e.target.value)}
          >
            {SUCURSALES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Turnos Pendientes',
            value: stats.pendientes,
            iconColor: 'text-amber-500',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
          {
            label: 'Atendiendo Actualmente',
            value: stats.atendiendo,
            iconColor: 'text-blue-500',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ),
          },
          {
            label: 'Turnos Atendidos',
            value: stats.atendidos,
            iconColor: 'text-green-500',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
          {
            label: 'Turnos Cancelados',
            value: stats.cancelados,
            iconColor: 'text-red-500',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`flex-shrink-0 ${s.iconColor}`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500 leading-tight">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 leading-tight">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'actuales',  label: 'Turnos Actuales'     },
          { id: 'historico', label: 'Histórico de Turnos' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'actuales' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {ETAPAS.map((etapa) => (
              <KanbanColumn
                key={etapa.id}
                etapa={etapa}
                turnos={byEtapa[etapa.id] ?? []}
                onMover={handleMover}
                onCancelar={handleCancelar}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {canceladosDeSucursal.length === 0 && stats.atendidos === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">No hay historial de turnos para esta sucursal.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Turno', 'Servicio', 'Sucursal', 'Estado'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  ...activosDeSucursal.filter((t) => t.etapa === 'finalizado'),
                  ...canceladosDeSucursal,
                ].map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-bold text-gray-800">{t.codigo}</td>
                    <td className="px-6 py-4 text-gray-600">{t.servicio}</td>
                    <td className="px-6 py-4 text-gray-500">{t.sucursal}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        t.cancelado ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {t.cancelado ? 'Cancelado' : 'Atendido'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal */}
      <CrearTurnoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCrear={handleCrear}
        sucursalActiva={sucursal}
      />
    </div>
  )
}
