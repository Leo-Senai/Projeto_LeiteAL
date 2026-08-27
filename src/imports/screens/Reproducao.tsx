import { useState } from 'react'
import Card from '../components/Card'

export default function Reproducao({ cows }: { cows?: { id: string; nome: string; litros: number; raca?: string; lactacao?: number }[] }) {
  const [selected, setSelected] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  const proximos = [
    { animal: 'Estrela', tipo: 'Diagnóstico', quando: '25/08 · 08:00' },
    { animal: 'Flor', tipo: 'Inseminação', quando: '27/08 · 15:30' },
    { animal: 'Luna', tipo: 'Vacina', quando: '29/08 · 10:00' },
  ]

  function schedule() {
    if (!selected || !date) return
    setSelected('')
    setDate('')
    setNote('')
    alert('Agendamento registrado')
  }

  return (
    <Card>
      <div className="section-header">
        <div>
          <div className="eyebrow">Reprodução</div>
          <h2>Programa reprodutivo</h2>
        </div>
        <span className="status-pill info">3 pendentes</span>
      </div>
      <p className="muted">Controle reprodutivo, inseminações e diagnósticos.</p>

      <div className="metric-grid">
        <div className="metric-card">
          <span className="label">Cobertura</span>
          <strong>76%</strong>
          <small>do lote atual</small>
        </div>
        <div className="metric-card">
          <span className="label">Gestantes</span>
          <strong>18</strong>
          <small>em acompanhamento</small>
        </div>
        <div className="metric-card">
          <span className="label">Próximo exame</span>
          <strong>25/08</strong>
          <small>Estrela</small>
        </div>
      </div>

      <div className="panel-grid">
        <div className="sub-panel">
          <h3>Vacas</h3>
          <div className="cow-grid">
            {(cows ?? []).map(c => (
              <div key={c.id} className="cow-card">
                <div className="cow-avatar">{c.nome.split(' ').map(p => p[0]).join('').slice(0, 2)}</div>
                <div className="cow-body">
                  <div className="cow-name">{c.nome} <span style={{ color: '#6b6455', fontWeight: 500 }}>· {c.id}</span></div>
                  <div className="cow-meta">{c.raca} · Lactação {c.lactacao} · {c.litros} L</div>
                </div>
                <div className="cow-actions">
                  <button className="btn btn-ghost" onClick={() => { setSelected(c.id); setDate(''); setNote('') }}>Selecionar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sub-panel">
          <h3>Próximos atendimentos</h3>
          <ul className="timeline">
            {proximos.map(item => (
              <li key={item.animal}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                  <div>
                    <strong>{item.animal}</strong>
                    <div style={{ color: '#726c62', fontSize: 12 }}>{item.tipo}</div>
                  </div>
                  <span className="status-pill info">{item.quando}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="sub-panel" style={{ marginTop: 18 }}>
        <h3>Agendar procedimento</h3>
        <div className="controls">
          <select className="select" value={selected} onChange={e => setSelected(e.target.value)} style={{ width: 220 }}>
            <option value="">Selecionar vaca</option>
            {(cows ?? []).map(c => <option key={c.id} value={c.id}>{c.id} · {c.nome}</option>)}
          </select>
          <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="Observação" />
          <button className="btn btn-primary" onClick={schedule}>Agendar</button>
        </div>
      </div>
    </Card>
  )
}
