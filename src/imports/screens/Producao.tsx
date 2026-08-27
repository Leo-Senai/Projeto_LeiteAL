import { useState } from 'react'
import Card from '../components/Card'

type RecordItem = { id: number; date: string; liters: number; animal?: string }

export default function Producao({
  records: propRecords,
  onAddRecord,
  pricePerLiter,
  setPricePerLiter,
  cows,
}: {
  records?: RecordItem[]
  onAddRecord?: (r: { date: string; liters: number; animal?: string }) => void
  pricePerLiter?: number
  setPricePerLiter?: (v: number) => void
  cows?: { id: string; nome: string; litros: number; raca?: string; lactacao?: number; tendencia?: string }[]
}) {
  const [localRecords, setLocalRecords] = useState<RecordItem[]>([])
  const [date, setDate] = useState('')
  const [liters, setLiters] = useState('')
  const [selectedCowId, setSelectedCowId] = useState('')
  const [customAnimal, setCustomAnimal] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const records = propRecords ?? localRecords

  function addRecord() {
    const val = parseFloat(liters)
    if (!date || Number.isNaN(val)) return
    if (onAddRecord) {
      onAddRecord({ date, liters: val, animal: animal || undefined })
    } else {
      setLocalRecords(prev => [...prev, { id: Date.now(), date, liters: val, animal: animal || undefined }])
    }
    setDate('')
    setLiters('')
    setAnimal('')
  }

  function removeRecord(id: number) {
    if (propRecords) return
    setLocalRecords(prev => prev.filter(r => r.id !== id))
  }

  const total = records.reduce((s, r) => s + r.liters, 0)
  const avg = records.length ? total / records.length : 0

  return (
    <Card>
      <h2>Produção</h2>
      <p className="muted">Gráficos e registros de produção leiteira.</p>

      <div className="controls">
        <input className="input" value={date} onChange={e => setDate(e.target.value)} type="date" />
        <input className="input" value={liters} onChange={e => setLiters(e.target.value)} placeholder="Litros" style={{ width: 120 }} />
        {cows && cows.length > 0 ? (
          <>
            <select className="input" value={selectedCowId} onChange={e => { const v = e.target.value; if (v === '__custom') { setShowCustom(true); setSelectedCowId('') } else { setShowCustom(false); setSelectedCowId(v) } }} style={{ width: 220 }}>
              <option value="">Selecionar vaca (opcional)</option>
              {cows.map(c => (
                <option key={c.id} value={c.id}>{c.id} · {c.nome} · {c.litros}L</option>
              ))}
              <option value="__custom">Outro...</option>
            </select>
            {showCustom && <input className="input" value={customAnimal} onChange={e => setCustomAnimal(e.target.value)} placeholder="Nome do animal" style={{ width: 160 }} />}
          </>
        ) : (
          <input className="input" value={customAnimal} onChange={e => setCustomAnimal(e.target.value)} placeholder="Animal (opcional)" style={{ width: 160 }} />
        )}
        <button className="btn btn-primary" onClick={() => { addRecord(); setSelectedCowId(''); setCustomAnimal(''); setShowCustom(false) }}>
          Adicionar
        </button>
      </div>

      <div className="controls" style={{ marginTop: 12 }}>
        <label style={{ fontSize: 12, color: 'var(--color-muted-foreground)' }}>Preço R$/L</label>
        <input className="input" value={String(pricePerLiter ?? '')} onChange={e => setPricePerLiter && setPricePerLiter(Number(e.target.value || 0))} style={{ width: 120 }} />
      </div>

      <div style={{ marginTop: 12 }}>Total: <strong>{total.toFixed(2)}</strong> L — Média: <strong>{avg.toFixed(2)}</strong> L/dia</div>

      <ul className="list">
        {records.map(r => (
          <li key={r.id}>
            {r.date} — {r.liters.toFixed(2)} L {r.animal ? `· ${r.animal}` : ''} <button className="btn btn-ghost" onClick={() => removeRecord(r.id)} style={{ marginLeft: 8 }}>Remover</button>
          </li>
        ))}
      </ul>
      {cows && (
        <div style={{ marginTop: 12 }}>
          <h4 style={{ margin: '8px 0' }}>Vacas</h4>
          <div className="cow-grid">
            {cows.map(c => (
              <div key={c.id} className="cow-card">
                <div className="cow-avatar">{c.nome.split(' ').map(p => p[0]).join('').slice(0,2)}</div>
                <div className="cow-body">
                  <div className="cow-name">{c.nome} <span style={{ color: 'var(--color-muted-foreground)', fontWeight: 500 }}>· {c.id}</span></div>
                  <div className="cow-meta">{c.raca} · {c.lactacao}ª lactação · {c.litros} L</div>
                </div>
                <div className="cow-actions">
                  <button className="btn btn-ghost">Detalhes</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
