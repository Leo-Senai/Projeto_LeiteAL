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
      <h2>Relatórios</h2>
      <p className="muted">Geração e exportação de relatórios.</p>

      <div className="controls">
        <button className="btn btn-primary" onClick={gerarResumo}>Gerar resumo</button>
        <button className="btn btn-ghost" onClick={downloadCSV}>Exportar CSV</button>
      </div>

      {summary && (
        <div style={{ marginTop: 12 }}>
          <h4>Resumo</h4>
          <ul className="list">
            {Object.entries(summary).map(([k, v]) => (
              <li key={k}>{k}: {v}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
