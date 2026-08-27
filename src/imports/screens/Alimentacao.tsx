import { useState } from 'react'
import Card from '../components/Card'

type FeedPlan = { id: number; name: string; qty: string; status: 'normal' | 'baixo' }

export default function Alimentacao() {
  const [plans, setPlans] = useState<FeedPlan[]>([
    { id: 1, name: 'Ração 18%', qty: '320 kg', status: 'normal' },
    { id: 2, name: 'Silagem', qty: '180 sacas', status: 'baixo' },
    { id: 3, name: 'Concentrado', qty: '240 kg', status: 'normal' },
  ])
  const [name, setName] = useState('')
  const [qty, setQty] = useState('')

  function addPlan() {
    if (!name || !qty) return
    setPlans(prev => [{ id: Date.now(), name, qty, status: 'normal' }, ...prev])
    setName('')
    setQty('')
  }

  function removePlan(id: number) {
    setPlans(prev => prev.filter(p => p.id !== id))
  }

  return (
    <Card>
      <div className="section-header">
        <div>
          <div className="eyebrow">Alimentação</div>
          <h2>Plano nutricional</h2>
        </div>
        <span className="status-pill warning">1 item em baixa</span>
      </div>
      <p className="muted">Planejamento de ração, estoque e consumo.</p>

      <div className="metric-grid">
        <div className="metric-card">
          <span className="label">Estoque</span>
          <strong>1.280 kg</strong>
          <small>saldo total</small>
        </div>
        <div className="metric-card">
          <span className="label">Consumo</span>
          <strong>420 kg</strong>
          <small>na semana</small>
        </div>
        <div className="metric-card">
          <span className="label">Reposição</span>
          <strong>2 dias</strong>
          <small>para silagem</small>
        </div>
      </div>

      <div className="sub-panel" style={{ marginTop: 18 }}>
        <h3>Adicionar insumo</h3>
        <div className="controls">
          <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Ração / Insumo" />
          <input className="input" value={qty} onChange={e => setQty(e.target.value)} placeholder="Quantidade" />
          <button className="btn btn-primary" onClick={addPlan}>Adicionar</button>
        </div>
      </div>

      <div className="sub-panel" style={{ marginTop: 18 }}>
        <h3>Estoque e consumo</h3>
        <ul className="list">
          {plans.map(p => (
            <li key={p.id}>
              <div>
                <strong>{p.name}</strong>
                <div style={{ color: '#726c62', fontSize: 12 }}>{p.qty}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`status-pill ${p.status === 'normal' ? 'success' : 'warning'}`}>
                  {p.status === 'normal' ? 'Normal' : 'Baixo'}
                </span>
                <button className="btn btn-ghost" onClick={() => removePlan(p.id)}>Remover</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
