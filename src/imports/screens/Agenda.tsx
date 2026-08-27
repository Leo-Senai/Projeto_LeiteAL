import { useState } from 'react'
import Card from '../components/Card'

type EventItem = { id: number; title: string; date: string }

export default function Agenda() {
  const [items, setItems] = useState<EventItem[]>([])
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')

  function addEvent() {
    if (!title || !date) return
    setItems(prev => [...prev, { id: Date.now(), title, date }])
    setTitle('')
    setDate('')
  }

  function removeEvent(id: number) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <Card>
      <h2>Agenda</h2>
      <p className="muted">Calendário de eventos e tarefas da fazenda.</p>

      <div className="controls">
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
        <input className="input" value={date} onChange={e => setDate(e.target.value)} type="date" />
        <button className="btn btn-primary" onClick={addEvent}>Adicionar</button>
      </div>

      <ul className="list">
        {items.map(it => (
          <li key={it.id}>
            <strong>{it.title}</strong> — {it.date}{' '}
            <button className="btn btn-ghost" onClick={() => removeEvent(it.id)} style={{ marginLeft: 8 }}>Remover</button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
