import { useState } from 'react'
import Card from '../components/Card'

type Transaction = { id: number; desc: string; amount: number; type: 'receita' | 'despesa' }

export default function Financeiro({ transactions, onAddTransaction }: { transactions?: Transaction[]; onAddTransaction?: (tx: { desc: string; amount: number; type: 'receita' | 'despesa' }) => void }) {
  const [localTxs, setLocalTxs] = useState<Transaction[]>([])
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'receita' | 'despesa'>('receita')

  const txs = transactions ?? localTxs

  function addTx() {
    const val = parseFloat(amount)
    if (!desc || Number.isNaN(val)) return
    if (onAddTransaction) {
      onAddTransaction({ desc, amount: val, type })
    } else {
      setLocalTxs(prev => [...prev, { id: Date.now(), desc, amount: val, type }])
    }
    setDesc('')
    setAmount('')
  }

  function removeTx(id: number) {
    if (transactions) return
    setLocalTxs(prev => prev.filter(t => t.id !== id))
  }

  const receitas = txs.filter(t => t.type === 'receita').reduce((s, t) => s + t.amount, 0)
  const despesas = txs.filter(t => t.type === 'despesa').reduce((s, t) => s + t.amount, 0)
  const balance = receitas - despesas

  return (
    <Card>
      <div className="section-header">
        <div>
          <div className="eyebrow">Financeiro</div>
          <h2>Fluxo financeiro</h2>
        </div>
        <span className="status-pill success">Saldo positivo</span>
      </div>
      <p className="muted">Receitas, despesas e fluxo de caixa.</p>

      <div className="metric-grid">
        <div className="metric-card">
          <span className="label">Receitas</span>
          <strong>R$ {receitas.toFixed(2)}</strong>
          <small>movimentações</small>
        </div>
        <div className="metric-card">
          <span className="label">Despesas</span>
          <strong>R$ {despesas.toFixed(2)}</strong>
          <small>gastos</small>
        </div>
        <div className="metric-card">
          <span className="label">Saldo</span>
          <strong>R$ {balance.toFixed(2)}</strong>
          <small>atual</small>
        </div>
      </div>

      <div className="sub-panel" style={{ marginTop: 18 }}>
        <h3>Adicionar movimento</h3>
        <div className="controls">
          <input className="input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descrição" />
          <input className="input" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Valor" style={{ width: 120 }} />
          <select className="select" value={type} onChange={e => setType(e.target.value as any)} style={{ width: 140 }}>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
          <button className="btn btn-primary" onClick={addTx}>Adicionar</button>
        </div>
      </div>

      <div className="sub-panel" style={{ marginTop: 18 }}>
        <h3>Movimentações</h3>
        <ul className="list">
          {txs.length === 0 && <div className="empty-state">Nenhuma movimentação registrada.</div>}
          {txs.map(t => (
            <li key={t.id}>
              <div>
                <strong>{t.desc}</strong>
                <div style={{ color: '#726c62', fontSize: 12 }}>{t.type === 'receita' ? 'Receita' : 'Despesa'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`status-pill ${t.type === 'receita' ? 'success' : 'danger'}`}>
                  {t.type === 'receita' ? 'R$ +' : 'R$ -'}{t.amount.toFixed(2)}
                </span>
                {!transactions && <button className="btn btn-ghost" onClick={() => removeTx(t.id)}>Remover</button>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
