import { useAuth } from '../../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

const stats = [
  {
    label: 'Turnos atendidos hoy',
    value: '124',
    change: '+12%',
    color: 'brand',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Turnos en espera',
    value: '18',
    change: '-5%',
    color: 'amber',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Turnos cancelados',
    value: '7',
    change: '+2%',
    color: 'red',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Usuarios activos',
    value: '9',
    change: 'sin cambio',
    color: 'violet',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

const colorMap = {
  brand:  { bg: 'bg-brand-50',  icon: 'text-brand-600',  badge: 'bg-brand-100 text-brand-700' },
  amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  badge: 'bg-amber-100 text-amber-700' },
  red:    { bg: 'bg-red-50',    icon: 'text-red-500',    badge: 'bg-red-100 text-red-600' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600', badge: 'bg-violet-100 text-violet-700' },
}

const recentTurnos = [
  { id: 'A-001', tipo: 'Asegurado',          estado: 'Atendido',  hora: '08:12', puesto: 'Ventanilla 1' },
  { id: 'B-002', tipo: 'No Asegurado',        estado: 'En espera', hora: '08:25', puesto: 'Ventanilla 2' },
  { id: 'A-003', tipo: 'Toma de muestra',     estado: 'Atendido',  hora: '08:40', puesto: 'Sala 3' },
  { id: 'C-004', tipo: 'Entrega resultados',  estado: 'Cancelado', hora: '08:55', puesto: '—' },
  { id: 'B-005', tipo: 'Pre-Registro',        estado: 'En espera', hora: '09:10', puesto: 'Ventanilla 1' },
]

const estadoBadge = {
  'Atendido':  'bg-green-100 text-green-700',
  'En espera': 'bg-amber-100 text-amber-700',
  'Cancelado': 'bg-red-100 text-red-600',
}

export default function DashboardHome() {
  const { user } = useAuth()
  const dateStr = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenido, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 capitalize mt-0.5">{dateStr}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-200">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Sistema activo
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => {
          const c = colorMap[s.color]
          return (
            <div key={s.label} className="card flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${c.bg} ${c.icon} flex items-center justify-center`}>
                {s.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium truncate">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{s.value}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.badge}`}>
                  {s.change}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent turnos */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Turnos recientes</h2>
          <Link to="/dashboard/turnos" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            Ver todos →
          </Link>
        </div>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Turno','Tipo','Hora','Puesto','Estado'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-2 pr-4 last:pr-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentTurnos.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4 font-mono font-semibold text-gray-800">{t.id}</td>
                  <td className="py-3 pr-4 text-gray-600">{t.tipo}</td>
                  <td className="py-3 pr-4 text-gray-500">{t.hora}</td>
                  <td className="py-3 pr-4 text-gray-500">{t.puesto}</td>
                  <td className="py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${estadoBadge[t.estado]}`}>
                      {t.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Gestionar usuarios',   to: '/dashboard/usuarios',   desc: 'Añadir, editar o desactivar usuarios del sistema.' },
          { label: 'Gestionar sucursales', to: '/dashboard/sucursales', desc: 'Configurar sedes y puntos de atención.' },
          { label: 'Ver turnos',           to: '/dashboard/turnos',     desc: 'Administrar la cola de turnos activos.' },
        ].map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="card group hover:border-brand-300 hover:shadow-md transition-all duration-200 border border-transparent block"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{q.label}</h3>
            <p className="text-sm text-gray-500 mt-1">{q.desc}</p>
            <span className="inline-block mt-3 text-brand-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Ir →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
