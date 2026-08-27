import { useState } from 'react'
import Card from '../components/Card'

type HealthRecord = { id: number; animal: string; date: string; note: string; status: 'ok' | 'alerta' | 'atencao' }

export default function Sanidade() {
  const [records, setRecords] = useState<HealthRecord[]>([
    { id: 1, animal: 'Estrela', date: '2026-08-20', note: 'Vacina contra aftosa aplicada', status: 'ok' },
    { id: 2, animal: 'Flor', date: '2026-08-22', note: 'Exame clínico de rotina', status: 'atencao' },
  ])
  const [animal, setAnimal] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  function addRecord() {
    if (!animal || !date) return
    setRecords(prev => [{ id: Date.now(), animal, date, note, status: 'ok' }, ...prev])
    setAnimal('')
    setDate('')
    setNote('')
  }

  function removeRecord(id: number) {
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  return (
    <Card>
      <div className="section-header">
        <div>
          <div className="eyebrow">Sanidade</div>
          <h2>Saúde do rebanho</h2>
        </div>
        <span className="status-pill warning">2 alertas</span>
      </div>
      <p className="muted">Histórico de vacinas, tratamentos e exames.</p>

      <div className="metric-grid">
        <div className="metric-card">
          <span className="label">Vacinas</span>
          <strong>14</strong>
          <small>aplicadas no mês</small>
        </div>
        <div className="metric-card">
          <span className="label">Monitoramento</span>
          <strong>96%</strong>
          <small>do lote em dia</small>
        </div>
        <div className="metric-card">
          <span className="label">Atenção</span>
          <strong>3</strong>
          <small>animais em revisão</small>
        </div>
      </div>

      <div className="sub-panel" style={{ marginTop: 18 }}>
        <h3>Registrar procedimento</h3>
        <div className="controls">
          <input className="input" value={animal} onChange={e => setAnimal(e.target.value)} placeholder="ID / Nome do animal" />
          <input className="input" value={date} onChange={e => setDate(e.target.value)} type="date" />
          <input className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="Observação" />
          <button className="btn btn-primary" onClick={addRecord}>Adicionar</button>
        </div>
      </div>

      <div className="sub-panel" style={{ marginTop: 18 }}>
        <h3>Histórico</h3>
        <ul className="timeline">
          {records.map(r => (
            <li key={r.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start' }}>
                <div>
                  <strong>{r.animal}</strong>
                  <div style={{ color: '#726c62', fontSize: 12 }}>{r.date}</div>
                  <div style={{ marginTop: 4 }}>{r.note || 'Sem observação'}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`status-pill ${r.status === 'ok' ? 'success' : r.status === 'alerta' ? 'danger' : 'warning'}`}>
                    {r.status === 'ok' ? 'OK' : r.status === 'alerta' ? 'Alerta' : 'Atenção'}
                  </span>
                  <button className="btn btn-ghost" onClick={() => removeRecord(r.id)}>Remover</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
