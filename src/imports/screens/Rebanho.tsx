import { useState } from 'react'
import Card from '../components/Card'

type Cow = { id: string; nome: string; litros: number; raca?: string; lactacao?: number; categoria?: string }

export default function Rebanho({ data, cows }: { data?: { name: string; value: number; color?: string }[]; cows?: Cow[] }) {
  const [selectedCategory, setSelectedCategory] = useState('Em lactação')
  const summary = [
    { label: 'Em lactação', value: data?.find(d => d.name === 'Em lactação')?.value ?? 0, detail: 'produção ativa' },
    { label: 'Secas', value: data?.find(d => d.name === 'Secas')?.value ?? 0, detail: 'em recuperação' },
    { label: 'Novilhas', value: data?.find(d => d.name === 'Novilhas')?.value ?? 0, detail: 'pendentes' },
    { label: 'Bezerras', value: data?.find(d => d.name === 'Bezerras')?.value ?? 0, detail: 'crescimento' },
  ]
  const selectedCows = (cows ?? []).filter(cow => cow.categoria === selectedCategory)

  const getDescription = (cow: Cow) => {
    if (selectedCategory === 'Em lactação') return `Produção ativa de ${cow.litros} L/dia e na ${cow.lactacao}ª lactação.`
    if (selectedCategory === 'Secas') return 'Em período de recuperação, sem produção registrada no momento.'
    if (selectedCategory === 'Novilhas') return `Animal em desenvolvimento, com ${cow.lactacao}ª lactação prevista.`
    return 'Animal jovem em fase de crescimento e acompanhamento.'
  }

  return (
    <Card>
      <div className="section-header">
        <div>
          <div className="eyebrow">Rebanho</div>
          <h2>Gestão do rebanho</h2>
        </div>
        <span className="status-pill success">+8% no mês</span>
      </div>
      <p className="muted">Visão geral do rebanho e detalhes de animais.</p>

      <div className="metric-grid">
        {summary.map(item => (
          <button
            key={item.label}
            type="button"
            className={`metric-card ${selectedCategory === item.label ? 'metric-card-selected' : ''}`}
            onClick={() => setSelectedCategory(item.label)}
            aria-pressed={selectedCategory === item.label}
          >
            <span className="label">{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.detail}</small>
          </button>
        ))}
      </div>

      <div className="panel-grid">
        <div className="sub-panel">
          <h3>Resumo por categoria</h3>
          <ul className="list-stack">
            {(data ?? []).map(d => (
              <li key={d.name}>
                <span>{d.name}</span>
                <strong>{d.value}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="sub-panel">
          <div className="section-header" style={{ marginBottom: 0 }}>
            <h3>Animais: {selectedCategory}</h3>
            <span className="status-pill info">{selectedCows.length} animal(is)</span>
          </div>
          <div className="cow-grid">
            {selectedCows.map(c => (
              <div key={c.id} className="cow-card">
                <div className="cow-avatar">{c.nome.split(' ').map(p => p[0]).join('').slice(0, 2)}</div>
                <div className="cow-body">
                  <div className="cow-name">{c.nome} <span style={{ color: '#6b6455', fontWeight: 500 }}>· {c.id}</span></div>
                  <div className="cow-meta">{c.raca} · Lactação {c.lactacao} · {c.litros} L</div>
                  <div className="cow-description">{getDescription(c)}</div>
                </div>
              </div>
            ))}
            {!selectedCows.length && <p className="muted">Nenhum animal cadastrado nesta categoria.</p>}
          </div>
        </div>
      </div>
    </Card>
  )
}
