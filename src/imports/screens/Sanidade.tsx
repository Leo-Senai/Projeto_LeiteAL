import { useState } from 'react'
import Card from '../components/Card'

type HealthRecord = { id: number; animal: string; date: string; note: string }

export default function Sanidade() {
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [animal, setAnimal] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  function addRecord() {
    if (!animal || !date) return
    setRecords(prev => [...prev, { id: Date.now(), animal, date, note }])
    setAnimal('')
    setDate('')
    setNote('')
  }

  function removeRecord(id: number) {
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  return (
    <Card>
      <h2>Sanidade</h2>
      <p className="muted">Histórico de vacinas, tratamentos e exames.</p>

      <div className="controls">
        <input className="input" value={animal} onChange={e => setAnimal(e.target.value)} placeholder="ID / Nome do animal" />
        <input className="input" value={date} onChange={e => setDate(e.target.value)} type="date" />
        <input className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="Observação" />
        <button className="btn btn-primary" onClick={addRecord}>Adicionar</button>
      </div>

      <ul className="list">
        {records.map(r => (
          <li key={r.id}>
            {r.animal} — {r.date} — {r.note} <button className="btn btn-ghost" onClick={() => removeRecord(r.id)} style={{ marginLeft: 8 }}>Remover</button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
