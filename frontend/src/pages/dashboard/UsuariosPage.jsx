import { useState } from 'react'

const mockUsers = [
  { id: 1, name: 'María González',  email: 'maria@analisa.com',  role: 'Operador',      sucursal: 'Sede Central', activo: true },
  { id: 2, name: 'Carlos Ramírez',  email: 'carlos@analisa.com', role: 'Administrador', sucursal: 'Sede Norte',   activo: true },
  { id: 3, name: 'Lucia Pérez',     email: 'lucia@analisa.com',  role: 'Operador',      sucursal: 'Sede Sur',     activo: false },
  { id: 4, name: 'Andrés Morales',  email: 'andres@analisa.com', role: 'Recepcionista', sucursal: 'Sede Central', activo: true },
]

const roleBadge = {
  'Administrador': 'bg-brand-100 text-brand-700',
  'Operador':      'bg-blue-100 text-blue-700',
  'Recepcionista': 'bg-violet-100 text-violet-700',
}

export default function UsuariosPage() {
  const [users] = useState(mockUsers)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestiona los usuarios del sistema y sus roles.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo usuario
        </button>
      </div>

      {/* New user form (collapsible) */}
      {showForm && (
        <div className="card border border-brand-200">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Agregar nuevo usuario</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input className="input" placeholder="Ej. Juan Martínez" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input type="email" className="input" placeholder="juan@analisa.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña inicial</label>
              <input type="password" className="input" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal</label>
              <select className="input">
                <option>Sede Central</option>
                <option>Sede Norte</option>
                <option>Sede Sur</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select className="input">
                <option>Operador</option>
                <option>Recepcionista</option>
                <option>Administrador</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button className="btn-primary">Guardar usuario</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          className="input pl-10"
          placeholder="Buscar usuario por nombre o correo…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Usuario','Correo','Sucursal','Rol','Estado','Acciones'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 text-gray-600">{u.sucursal}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${roleBadge[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.activo ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.activo ? 'bg-green-500' : 'bg-gray-300'}`} />
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">Editar</button>
                      <span className="text-gray-300">|</span>
                      <button className={`text-xs font-medium ${u.activo ? 'text-red-500 hover:text-red-600' : 'text-green-600 hover:text-green-700'}`}>
                        {u.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">
                    No se encontraron usuarios con ese criterio.
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
