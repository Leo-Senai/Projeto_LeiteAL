import { useState } from 'react'
import Card from '../components/Card'

export default function Reproducao({ cows }: { cows?: { id: string; nome: string; litros: number; raca?: string; lactacao?: number }[] }) {
  const [selected, setSelected] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  function schedule() {
    if (!selected || !date) return
    setSelected('')
    setDate('')
    setNote('')
    alert('Agendamento registrado')
  }

  return (
    <Card>
      <h2>Reprodução</h2>
      <p className="muted">Controle reprodutivo, inseminações e diagnósticos.</p>

      <div style={{ marginTop: 12 }}>
        <label className="muted">Vacas</label>
        <div className="cow-grid">
          {(cows ?? []).map(c => (
            <div key={c.id} className="cow-card">
              <div className="cow-avatar">{c.nome.split(' ').map(p => p[0]).join('').slice(0,2)}</div>
              <div className="cow-body">
                <div className="cow-name">{c.nome} <span style={{ color: 'var(--color-muted-foreground)', fontWeight: 500 }}>· {c.id}</span></div>
                <div className="cow-meta">{c.raca} · Lactação {c.lactacao} · {c.litros} L</div>
              </div>
              <div className="cow-actions">
                <button className="btn btn-ghost" onClick={() => { setSelected(c.id); setDate(''); setNote('') }}>Selecionar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="controls" style={{ marginTop: 12 }}>
        <select className="input" value={selected} onChange={e => setSelected(e.target.value)} style={{ width: 220 }}>
          <option value="">Selecionar vaca</option>
          {(cows ?? []).map(c => <option key={c.id} value={c.id}>{c.id} · {c.nome}</option>)}
        </select>
        <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="Observação" />
        <button className="btn btn-primary" onClick={schedule}>Agendar</button>
      </div>
    </Card>
  )
}
