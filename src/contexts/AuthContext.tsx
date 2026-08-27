import React, { createContext, useContext, useEffect, useState } from 'react'

type User = { name: string; token: string }

type AuthContextType = {
  user: User | null
  login: (name: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('leite_user')
      if (raw) setUser(JSON.parse(raw))
    } catch (e) {
      // ignore
    }
  }, [])

  const login = async (name: string, password: string) => {
    // Mock authentication: accept any non-empty name/password
    if (!name || !password) throw new Error('Credenciais inválidas')
    const token = String(Date.now())
    const u: User = { name, token }
    setUser(u)
    localStorage.setItem('leite_user', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('leite_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
