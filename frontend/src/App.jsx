import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import DashboardHome from './pages/dashboard/DashboardHome.jsx'
import UsuariosPage from './pages/dashboard/UsuariosPage.jsx'
import SucursalesPage from './pages/dashboard/SucursalesPage.jsx'
import TurnosPage from './pages/dashboard/TurnosPage.jsx'
import PublicidadPage from './pages/dashboard/PublicidadPage.jsx'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="sucursales" element={<SucursalesPage />} />
        <Route path="turnos" element={<TurnosPage />} />
        <Route path="publicidad" element={<PublicidadPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
