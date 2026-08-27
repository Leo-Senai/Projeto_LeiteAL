import { useState } from 'react'
import Card from '../components/Card'
import CowCard from '../../components/CowCard'

type RecordItem = { id: number; date: string; liters: number; animal?: string }

export default function Producao({
  records: propRecords,
  onAddRecord,
  onRemoveRecord,
  onAddCow,
  pricePerLiter,
  setPricePerLiter,
  cows,
}: {
  records?: RecordItem[]
  onAddRecord?: (r: { date: string; liters: number; animal?: string }) => void
  onAddCow?: (c: { id?: string; nome: string; litros?: number; raca?: string; lactacao?: number }) => string | void
  onRemoveRecord?: (id: number) => void
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
  const [showCowGallery, setShowCowGallery] = useState(false)
  const [highlightCowId, setHighlightCowId] = useState<string | null>(null)

  const records = propRecords ?? localRecords
  function addRecord() {
    const val = parseFloat(liters)
    if (!date || Number.isNaN(val)) return
    const animal = selectedCowId ? selectedCowId : (customAnimal || '')
    if (onAddRecord) {
      onAddRecord({ date, liters: val, animal: animal || undefined })
    } else {
      setLocalRecords(prev => [...prev, { id: Date.now(), date, liters: val, animal: animal || undefined }])
    }
    setDate('')
    setLiters('')
    setSelectedCowId('')
  }

  function removeRecord(id: number) {
    if (propRecords) {
      if (onRemoveRecord) onRemoveRecord(id)
      return
    }
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
            {showCustom && (
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input" value={customAnimal} onChange={e => setCustomAnimal(e.target.value)} placeholder="Nome do animal" style={{ width: 160 }} />
                <button className="btn btn-ghost" onClick={() => {
                  if (!customAnimal) return
                  if (onAddCow) {
                    const newId = onAddCow({ nome: customAnimal })
                    if (newId) setSelectedCowId(String(newId))
                  }
                  setShowCustom(false)
                }}>Criar vaca</button>
              </div>
            )}
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
            {r.date} — {r.liters.toFixed(2)} L {r.animal ? `· ${r.animal}` : ''}
            <button className="btn btn-ghost" onClick={() => {
              const txt = `Data: ${r.date}\nLitros: ${r.liters.toFixed(2)} L\nAnimal: ${r.animal || '-'}\nID: ${r.id}`
              alert(txt)
            }} style={{ marginLeft: 8 }}>Detalhes</button>
            <button className="btn btn-ghost" onClick={() => removeRecord(r.id)} style={{ marginLeft: 8 }}>Remover</button>
          </li>
        ))}
      </ul>
      {cows && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ margin: '8px 0' }}>Vacas</h4>
            <div>
              <button className="btn btn-ghost" onClick={() => { setShowCowGallery(true); setHighlightCowId(null) }} style={{ marginRight: 8 }}>Ver imagens</button>
            </div>
          </div>
          <div className="cow-grid">
            {cows.map(c => (
              <div key={c.id} className="cow-card">
                <div className="cow-avatar">{c.nome.split(' ').map(p => p[0]).join('').slice(0,2)}</div>
                <div className="cow-body">
                  <div className="cow-name">{c.nome} <span style={{ color: 'var(--color-muted-foreground)', fontWeight: 500 }}>· {c.id}</span></div>
                  <div className="cow-meta">{c.raca} · {c.lactacao}ª lactação · {c.litros} L</div>
                </div>
                <div className="cow-actions">
                  <button className="btn btn-ghost" onClick={() => { setShowCowGallery(true); setHighlightCowId(c.id) }}>Detalhes</button>
                </div>
              </div>
            ))}
          </div>

          {showCowGallery && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}
              onClick={() => { setShowCowGallery(false); setHighlightCowId(null) }}
            >
              <div
                className="w-full p-6"
                style={{ backgroundColor: '#fff', borderRadius: 12, maxHeight: '80vh', overflowY: 'auto', maxWidth: 920 }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h3 style={{ margin: 0 }}>Galeria de Vacas</h3>
                  <button onClick={() => { setShowCowGallery(false); setHighlightCowId(null) }} className="btn btn-ghost">Fechar</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: highlightCowId ? '2fr 320px' : '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {cows.map(c => (
                        <CowCard key={c.id} cow={c} selected={highlightCowId === c.id} onClick={() => { setHighlightCowId(c.id) }} />
                      ))}
                    </div>
                  </div>
                  {highlightCowId && (
                    <div style={{ padding: 12 }}>
                      {(() => {
                        const sc = cows.find(x => x.id === highlightCowId)
                        if (!sc) return <div>Vaca não encontrada</div>
                        return (
                          <div style={{ border: '1px solid #e6e1db', borderRadius: 8, padding: 12, background: '#fff' }}>
                            <div style={{ height: 160, borderRadius: 6, background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                              <div style={{ color: '#9ca3af' }}>Imagem da vaca (placeholder)</div>
                            </div>
                            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>{sc.nome} <span style={{ color: '#6b7280', fontWeight: 600 }}>· #{sc.id}</span></div>
                            <div style={{ marginBottom: 6 }}>Raça: {sc.raca || '-'}</div>
                            <div style={{ marginBottom: 6 }}>Lactação: {sc.lactacao || '-' }ª</div>
                            <div style={{ marginBottom: 6 }}>Produção média: <strong>{sc.litros} L</strong></div>
                            <div style={{ marginBottom: 12 }}>Tendência: {sc.tendencia || '-'}</div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button className="btn btn-primary" onClick={() => {
                                const input = prompt('Litros a registrar para ' + sc.nome)
                                if (!input) return
                                const v = Number(input)
                                if (Number.isNaN(v) || v <= 0) { alert('Valor inválido'); return }
                                const today = new Date().toISOString().slice(0,10)
                                if (onAddRecord) {
                                  onAddRecord({ date: today, liters: v, animal: sc.id })
                                } else {
                                  setLocalRecords(prev => [...prev, { id: Date.now(), date: today, liters: v, animal: sc.id }])
                                }
                                alert('Ordenha registrada: ' + v + ' L')
                              }}>Registrar ordenha</button>
                              <button className="btn btn-ghost" onClick={() => setHighlightCowId(null)}>Fechar detalhe</button>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
