import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('turnomatic_user')
    return saved ? JSON.parse(saved) : null
  })

  function login(credentials) {
    // Stub: replace with real API call
    const mockUser = {
      id: 1,
      name: 'Administrador',
      email: credentials.email,
      role: 'admin',
      sucursal: 'Sede Central',
    }
    setUser(mockUser)
    localStorage.setItem('turnomatic_user', JSON.stringify(mockUser))
    return mockUser
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('turnomatic_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
