import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Login({ onSuccess }: { onSuccess?: () => void }) {
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(name.trim(), password)
      onSuccess?.()
    } catch (err: any) {
      setError(err?.message || 'Erro ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0ede6' }}>
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-6 rounded-lg" style={{ border: '1px solid #e6e1db' }}>
        <h2 className="text-xl font-semibold mb-4">Login do Produtor</h2>
        <div className="mb-3">
          <label className="text-xs font-semibold block mb-1">Nome</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold block mb-1">Senha</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full p-2 border rounded" />
        </div>
        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="flex-1 p-2 bg-green-700 text-white rounded">{loading ? 'Entrando...' : 'Entrar'}</button>
        </div>
      </form>
    </div>
  )
}
