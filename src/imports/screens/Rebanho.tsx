import Card from '../components/Card'

export default function Rebanho({ data, cows }: { data?: { name: string; value: number; color?: string }[]; cows?: { id: string; nome: string; litros: number; raca?: string; lactacao?: number }[] }) {
  return (
    <Card>
      <h2>Rebanho</h2>
      <p className="muted">Visão geral do rebanho e detalhes de animais.</p>

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '8px 0' }}>Resumo</h4>
          <ul className="list">
            {(data ?? []).map(d => (
              <li key={d.name}>
                {d.name}: <strong>{d.value}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 2 }}>
          <h4 style={{ margin: '8px 0' }}>Vacas</h4>
          <div className="cow-grid">
            {(cows ?? []).map(c => (
              <div key={c.id} className="cow-card">
                <div className="cow-avatar">{c.nome.split(' ').map(p => p[0]).join('').slice(0,2)}</div>
                <div className="cow-body">
                  <div className="cow-name">{c.nome} <span style={{ color: 'var(--color-muted-foreground)', fontWeight: 500 }}>· {c.id}</span></div>
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
