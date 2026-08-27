import { useState } from 'react'
import Card from '../components/Card'

type FeedPlan = { id: number; name: string; qty: string }

export default function Alimentacao() {
  const [plans, setPlans] = useState<FeedPlan[]>([])
  const [name, setName] = useState('')
  const [qty, setQty] = useState('')

  function addPlan() {
    if (!name || !qty) return
    setPlans(prev => [...prev, { id: Date.now(), name, qty }])
    setName('')
    setQty('')
  }

  function removePlan(id: number) {
    setPlans(prev => prev.filter(p => p.id !== id))
  }

  return (
    <Card>
      <h2>Alimentação</h2>
      <p className="muted">Planejamento de ração, estoque e consumo.</p>

      <div className="controls">
        <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Ração / Insumo" />
        <input className="input" value={qty} onChange={e => setQty(e.target.value)} placeholder="Quantidade" />
        <button className="btn btn-primary" onClick={addPlan}>Adicionar</button>
      </div>

      <ul className="list">
        {plans.map(p => (
          <li key={p.id}>
            {p.name} — {p.qty} <button className="btn btn-ghost" onClick={() => removePlan(p.id)} style={{ marginLeft: 8 }}>Remover</button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
