import { useMemo, useState } from 'react'
import Card from '../components/Card'

type EventItem = { id: number; title: string; date: string }

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export default function Agenda() {
  const [items, setItems] = useState<EventItem[]>([])
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
    const firstDay = new Date(viewYear, viewMonth, 1).getDay() // 0..6 (Sun..Sat)
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
      <h2>Agenda</h2>
      <p className="muted">Calendário de eventos e tarefas da fazenda.</p>

      <div className="controls">
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
        <input className="input" value={date} onChange={e => setDate(e.target.value)} type="date" />
        <button className="btn btn-primary" onClick={addEvent}>Adicionar</button>
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        <div style={{ width: 520 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" onClick={prevMonth}>←</button>
              <button className="btn btn-ghost" onClick={nextMonth}>→</button>
            </div>
            <div style={{ fontWeight: 700 }}>{new Date(viewYear, viewMonth).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</div>
            <div />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, textAlign: 'center', color: '#6b7280', fontSize: 12 }}>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d}>{d}</div>)}
          </div>

          <div style={{ marginTop: 8 }}>
            {monthCalendar.map((week, wi) => (
              <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
                {week.map((d, di) => {
                  const iso = d ? new Date(viewYear, viewMonth, d).toISOString().slice(0,10) : ''
                  const has = d ? Boolean(eventsByDate[iso] && eventsByDate[iso].length) : false
                  const isToday = d && iso === today.toISOString().slice(0,10)
                  return (
                    <div key={di} onClick={() => d && setSelectedDate(iso)} style={{ padding: 10, borderRadius: 8, background: isToday ? '#e6f0ea' : '#fff', border: `1px solid ${has ? '#1b5e35' : '#e6e1db'}`, cursor: d ? 'pointer' : 'default', minHeight: 68 }}>
                      <div style={{ textAlign: 'left', fontWeight: 700 }}>{d || ''}</div>
                      <div style={{ marginTop: 6 }}>
                        {has && <div style={{ width: 10, height: 10, borderRadius: 6, background: '#1b5e35', marginTop: 6 }} />}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Eventos</div>
          {selectedDate ? (
            <div>
              <div style={{ marginBottom: 8, color: '#6b7280' }}>Dia selecionado: {selectedDate}</div>
              <ul className="list">
                {(eventsByDate[selectedDate] || []).map(ev => (
                  <li key={ev.id}>
                    <strong>{ev.title}</strong> — {ev.date}
                    <button className="btn btn-ghost" onClick={() => removeEvent(ev.id)} style={{ marginLeft: 8 }}>Remover</button>
                  </li>
                ))}
                {(!eventsByDate[selectedDate] || eventsByDate[selectedDate].length === 0) && <div>Nenhum evento neste dia.</div>}
              </ul>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 8, color: '#6b7280' }}>Selecione um dia no calendário para ver os eventos.</div>
              <ul className="list">
                {items.map(it => (
                  <li key={it.id}>
                    <strong>{it.title}</strong> — {it.date}{' '}
                    <button className="btn btn-ghost" onClick={() => removeEvent(it.id)} style={{ marginLeft: 8 }}>Remover</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
