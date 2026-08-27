import Card from '../components/Card'

export default function Rebanho({ data, cows }: { data?: { name: string; value: number; color?: string }[]; cows?: { id: string; nome: string; litros: number; raca?: string; lactacao?: number }[] }) {
  const summary = [
    { label: 'Em lactação', value: data?.find(d => d.name === 'Em lactação')?.value ?? 0, detail: 'produção ativa' },
    { label: 'Secas', value: data?.find(d => d.name === 'Secas')?.value ?? 0, detail: 'em recuperação' },
    { label: 'Novilhas', value: data?.find(d => d.name === 'Novilhas')?.value ?? 0, detail: 'pendentes' },
    { label: 'Bezerras', value: data?.find(d => d.name === 'Bezerras')?.value ?? 0, detail: 'crescimento' },
  ]

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
          <div key={item.label} className="metric-card">
            <span className="label">{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.detail}</small>
          </div>
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
          <h3>Vacas em destaque</h3>
          <div className="cow-grid">
            {(cows ?? []).slice(0, 4).map(c => (
              <div key={c.id} className="cow-card">
                <div className="cow-avatar">{c.nome.split(' ').map(p => p[0]).join('').slice(0, 2)}</div>
                <div className="cow-body">
                  <div className="cow-name">{c.nome} <span style={{ color: '#6b6455', fontWeight: 500 }}>· {c.id}</span></div>
                  <div className="cow-meta">{c.raca} · Lactação {c.lactacao} · {c.litros} L</div>
                </div>
                <div className="cow-actions">
                  <button className="btn btn-ghost">Detalhes</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
