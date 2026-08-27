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

  const balance = txs.reduce((s, t) => s + (t.type === 'receita' ? t.amount : -t.amount), 0)

  return (
    <Card>
      <h2>Financeiro</h2>
      <p className="muted">Receitas, despesas e fluxo de caixa.</p>

      <div className="controls">
        <input className="input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descrição" />
        <input className="input" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Valor" style={{ width: 120 }} />
        <select className="input" value={type} onChange={e => setType(e.target.value as any)} style={{ width: 140 }}>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>
        <button className="btn btn-primary" onClick={addTx}>Adicionar</button>
      </div>

      <div style={{ marginTop: 12 }}>Saldo: <strong>{balance.toFixed(2)}</strong></div>

      <ul className="list">
        {txs.map(t => (
          <li key={t.id}>
            {t.desc} — {t.type} — {t.amount.toFixed(2)} {transactions ? null : <button className="btn btn-ghost" onClick={() => removeTx(t.id)} style={{ marginLeft: 8 }}>Remover</button>}
          </li>
        ))}
      </ul>
    </Card>
  )
}
