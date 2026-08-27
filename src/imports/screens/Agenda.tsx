import { useMemo, useState } from 'react'
import Card from '../components/Card'

type EventItem = { id: number; title: string; date: string }

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export default function Agenda() {
  const [items, setItems] = useState<EventItem[]>([
    { id: 1, title: 'Ordenha programada', date: '2026-08-27' },
    { id: 2, title: 'Vacina de rotina', date: '2026-08-28' },
  ])
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [today] = useState(new Date())
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  function addEvent() {
    if (!title || !date) return
    setItems(prev => [...prev, { id: Date.now(), title, date }])
    setTitle('')
    setDate('')
  }

  function removeEvent(id: number) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const monthCalendar = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay()
    const total = daysInMonth(viewYear, viewMonth)
    const weeks: Array<Array<number | null>> = []
    let day = 1
    for (let week = 0; week < 6; week++) {
      const days: Array<number | null> = []
      for (let d = 0; d < 7; d++) {
        if ((week === 0 && d < firstDay) || day > total) {
          days.push(null)
        } else {
          days.push(day)
          day++
        }
      }
      weeks.push(days)
      if (day > total) break
    }
    return weeks
  }, [viewYear, viewMonth])

  const eventsByDate = useMemo(() => {
    const map: Record<string, EventItem[]> = {}
    items.forEach(it => {
      map[it.date] = map[it.date] || []
      map[it.date].push(it)
    })
    return map
  }, [items])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1)
  }

  return (
    <Card>
      <div className="section-header">
        <div>
          <div className="eyebrow">Agenda</div>
          <h2>Calendário da fazenda</h2>
        </div>
        <span className="status-pill info">{items.length} eventos</span>
      </div>
      <p className="muted">Calendário de eventos e tarefas da fazenda.</p>

      <div className="sub-panel">
        <div className="controls">
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
          <input className="input" value={date} onChange={e => setDate(e.target.value)} type="date" />
          <button className="btn btn-primary" onClick={addEvent}>Adicionar</button>
        </div>
      </div>

      <div className="panel-grid" style={{ marginTop: 18 }}>
        <div className="sub-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" onClick={prevMonth}>←</button>
              <button className="btn btn-ghost" onClick={nextMonth}>→</button>
            </div>
            <div style={{ fontWeight: 700 }}>{new Date(viewYear, viewMonth).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</div>
            <div />
          </div>

          <div className="calendar-grid" style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d}>{d}</div>)}
          </div>

          <div className="calendar-grid" style={{ marginTop: 8 }}>
            {monthCalendar.flat().map((d, di) => {
              if (!d) return <div key={`empty-${di}`} style={{ minHeight: 78, borderRadius: 14 }} />
              const iso = new Date(viewYear, viewMonth, d).toISOString().slice(0,10)
              const has = Boolean(eventsByDate[iso] && eventsByDate[iso].length)
              const isToday = iso === today.toISOString().slice(0,10)
              return (
                <div key={d} className={`calendar-day ${has ? 'is-event' : ''} ${isToday ? 'is-today' : ''}`} onClick={() => setSelectedDate(iso)}>
                  <em>{d}</em>
                  {has && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1b5e35', marginTop: 8, marginLeft: 'auto', marginRight: 'auto' }} />}
                </div>
              )
            })}
          </div>
        </div>

        <div className="sub-panel">
          <h3>{selectedDate ? `Evento em ${selectedDate}` : 'Próximos eventos'}</h3>
          {selectedDate ? (
            <div className="data-list">
              {(eventsByDate[selectedDate] || []).map(ev => (
                <div key={ev.id} className="data-row">
                  <strong>{ev.title}</strong>
                  <button className="btn btn-ghost" onClick={() => removeEvent(ev.id)}>Remover</button>
                </div>
              ))}
              {(!eventsByDate[selectedDate] || eventsByDate[selectedDate].length === 0) && <div className="empty-state">Nenhum evento neste dia.</div>}
            </div>
          ) : (
            <div className="data-list">
              {items.map(it => (
                <div key={it.id} className="data-row">
                  <div>
                    <strong>{it.title}</strong>
                    <div style={{ color: '#726c62', fontSize: 12 }}>{it.date}</div>
                  </div>
                  <button className="btn btn-ghost" onClick={() => removeEvent(it.id)}>Remover</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
