import { useState } from 'react'
import Card from '../components/Card'

type Sample = { area: string; value: number }

export default function Relatorios() {
  const [summary, setSummary] = useState<Record<string, number> | null>(null)

  const sampleData: Sample[] = [
    { area: 'produção', value: 1200 },
    { area: 'vacas', value: 45 },
    { area: 'despesas', value: 3200 },
  ]

  function gerarResumo() {
    const res: Record<string, number> = {}
    for (const s of sampleData) res[s.area] = s.value
    setSummary(res)
  }

  function downloadCSV() {
    const headers = ['area', 'value']
    const rows = sampleData.map(s => `${s.area},${s.value}`).join('\n')
    const csv = `${headers.join(',')}\n${rows}`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'relatorio.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <div className="section-header">
        <div>
          <div className="eyebrow">Relatórios</div>
          <h2>Indicadores e exportação</h2>
        </div>
        <span className="status-pill success">Atualizado</span>
      </div>
      <p className="muted">Geração e exportação de relatórios.</p>

      <div className="metric-grid">
        <div className="metric-card">
          <span className="label">Produção</span>
          <strong>1.200 L</strong>
          <small>últimos 7 dias</small>
        </div>
        <div className="metric-card">
          <span className="label">Vacas</span>
          <strong>45</strong>
          <small>em acompanhamento</small>
        </div>
        <div className="metric-card">
          <span className="label">Despesas</span>
          <strong>R$ 3.200</strong>
          <small>mês atual</small>
        </div>
      </div>

      <div className="controls" style={{ marginTop: 18 }}>
        <button className="btn btn-primary" onClick={gerarResumo}>Gerar resumo</button>
        <button className="btn btn-ghost" onClick={downloadCSV}>Exportar CSV</button>
      </div>

      {summary && (
        <div className="sub-panel" style={{ marginTop: 18 }}>
          <h3>Resumo</h3>
          <ul className="list">
            {Object.entries(summary).map(([k, v]) => (
              <li key={k}>
                <span>{k}</span>
                <strong>{v}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
