import { useMemo, useState } from 'react'
import Card from '../components/Card'

type RecordItem = {
  id: number
  date: string
  liters: number
  animal?: string
}

type Cow = {
  id: string
  nome: string
  litros: number
  raca?: string
  lactacao?: number
  tendencia?: string
  categoria?: string
}

type Props = {
  records?: RecordItem[]
  onAddRecord?: (r: {
    date: string
    liters: number
    animal?: string
  }) => void
  onRemoveRecord?: (id: number) => void
  onAddCow?: (c: {
    id?: string
    nome: string
    litros?: number
    raca?: string
    lactacao?: number
  }) => string | void
  pricePerLiter?: number
  setPricePerLiter?: (v: number) => void
  cows?: Cow[]
}

export default function Producao({
  records: propRecords,
  onAddRecord,
  onRemoveRecord,
  pricePerLiter,
  setPricePerLiter,
  cows = [],
}: Props) {
  const [localRecords, setLocalRecords] = useState<RecordItem[]>([])

  const [date, setDate] = useState('')
  const [liters, setLiters] = useState('')
  const [selectedCowId, setSelectedCowId] = useState('')
  const [search, setSearch] = useState('')
  const [historySearch, setHistorySearch] = useState('')
  const [historyAnimal, setHistoryAnimal] = useState('todos')

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editLiters, setEditLiters] = useState('')

  const records = propRecords ?? localRecords
  const price = pricePerLiter ?? 0

  const sortedCows = useMemo(() => {
    const text = search.trim().toLowerCase()

    return [...cows]
      .filter(cow => {
        if (!text) return true

        return (
          cow.nome.toLowerCase().includes(text) ||
          cow.id.toLowerCase().includes(text) ||
          (cow.raca || '').toLowerCase().includes(text)
        )
      })
      .sort((a, b) =>
        a.nome.localeCompare(b.nome, 'pt-BR')
      )
  }, [cows, search])

  const sortedRecords = useMemo(() => {
    const text = historySearch.trim().toLowerCase()

    return [...records]
      .filter(record => {
        const animalName = getAnimalName(record.animal).toLowerCase()

        const matchesText =
          !text ||
          animalName.includes(text) ||
          (record.animal || '').toLowerCase().includes(text)

        const matchesAnimal =
          historyAnimal === 'todos' ||
          record.animal === historyAnimal

        return matchesText && matchesAnimal
      })
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
  }, [records, historySearch, historyAnimal, cows])

  const total = useMemo(
    () => records.reduce((sum, record) => sum + record.liters, 0),
    [records]
  )

  const average = records.length ? total / records.length : 0
  const receita = total * price

  const highestRecord = useMemo(
    () =>
      records.reduce<RecordItem | null>(
        (highest, record) =>
          !highest || record.liters > highest.liters
            ? record
            : highest,
        null
      ),
    [records]
  )

  const animalsWithProduction = useMemo(
    () =>
      new Set(
        records
          .map(record => record.animal)
          .filter(Boolean)
      ).size,
    [records]
  )

  const productionByCow = useMemo(() => {
    const map = new Map<string, number>()

    records.forEach(record => {
      if (!record.animal) return
      map.set(
        record.animal,
        (map.get(record.animal) || 0) + record.liters
      )
    })

    return map
  }, [records])

  function getAnimalName(animalId?: string) {
    if (!animalId) return 'Não informado'

    const cow = cows.find(c => c.id === animalId)

    return cow ? cow.nome : animalId
  }

  function getCow(animalId?: string) {
    if (!animalId) return undefined
    return cows.find(c => c.id === animalId)
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  function formatDate(dateString: string) {
    if (!dateString) return '-'

    return new Date(
      `${dateString}T12:00:00`
    ).toLocaleDateString('pt-BR')
  }

  function addRecord() {
    const value = Number(liters)

    if (!date) {
      alert('Informe a data da produção.')
      return
    }

    if (!Number.isFinite(value) || value <= 0) {
      alert('Informe uma quantidade válida de litros.')
      return
    }

    const newRecord = {
      date,
      liters: value,
      animal: selectedCowId || undefined,
    }

    if (onAddRecord) {
      onAddRecord(newRecord)
    } else {
      setLocalRecords(prev => [
        {
          id: Date.now(),
          ...newRecord,
        },
        ...prev,
      ])
    }

    setDate('')
    setLiters('')
    setSelectedCowId('')
  }

  function removeRecord(id: number) {
    const confirmDelete = window.confirm(
      'Deseja remover este registro de produção?'
    )

    if (!confirmDelete) return

    if (propRecords) {
      onRemoveRecord?.(id)
      return
    }

    setLocalRecords(prev =>
      prev.filter(record => record.id !== id)
    )
  }

  function startEdit(record: RecordItem) {
    setEditingId(record.id)
    setEditDate(record.date)
    setEditLiters(String(record.liters))
  }

  function saveEdit(record: RecordItem) {
    const value = Number(editLiters)

    if (
      !editDate ||
      !Number.isFinite(value) ||
      value <= 0
    ) {
      alert('Informe uma data e uma quantidade de litros válidas.')
      return
    }

    if (propRecords) {
      alert(
        'A edição de registros compartilhados precisa ser conectada a uma função de atualização no App.tsx.'
      )
      return
    }

    setLocalRecords(prev =>
      prev.map(item =>
        item.id === record.id
          ? {
              ...item,
              date: editDate,
              liters: value,
            }
          : item
      )
    )

    setEditingId(null)
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

  return (
    <Card>
      <style>{`
        .prod-page {
          --prod-green: #1b5e35;
          --prod-green-2: #154d2b;
          --prod-green-light: #e8f2eb;
          --prod-beige: #f5f0e8;
          --prod-border: #e3ded4;
          --prod-muted: #7a7568;
          --prod-text: #1a1a14;
          --prod-red: #c0392b;
          color: var(--prod-text);
        }

        .prod-hero {
          position: relative;
          overflow: hidden;
          padding: 26px;
          border-radius: 20px;
          background:
            radial-gradient(circle at 90% 10%, rgba(255,255,255,.16), transparent 30%),
            linear-gradient(135deg, var(--prod-green-2), var(--prod-green));
          color: white;
          box-shadow: 0 14px 34px rgba(27,94,53,.15);
        }

        .prod-hero::after {
          content: '';
          position: absolute;
          width: 180px;
          height: 180px;
          right: -60px;
          bottom: -100px;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 50%;
          box-shadow:
            0 0 0 28px rgba(255,255,255,.04),
            0 0 0 56px rgba(255,255,255,.025);
        }

        .prod-hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .prod-eyebrow {
          margin-bottom: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
          opacity: .72;
        }

        .prod-title {
          margin: 0;
          font-size: 27px;
          line-height: 1.15;
          letter-spacing: -.03em;
        }

        .prod-subtitle {
          margin: 8px 0 0;
          max-width: 620px;
          color: rgba(255,255,255,.78);
          font-size: 13px;
          line-height: 1.55;
        }

        .prod-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 999px;
          background: rgba(255,255,255,.10);
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .prod-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #b9e3c3;
          box-shadow: 0 0 0 4px rgba(185,227,195,.12);
        }

        .prod-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .prod-metric {
          position: relative;
          overflow: hidden;
          min-height: 112px;
          padding: 18px;
          border: 1px solid var(--prod-border);
          border-radius: 16px;
          background: white;
          box-shadow: 0 7px 22px rgba(26,26,20,.045);
        }

        .prod-metric::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 52px;
          height: 3px;
          background: var(--prod-green);
          border-radius: 0 5px 0 0;
        }

        .prod-metric-label {
          display: block;
          color: var(--prod-muted);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .prod-metric-value {
          display: block;
          margin-top: 8px;
          color: var(--prod-green-2);
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -.03em;
        }

        .prod-metric-note {
          display: block;
          margin-top: 4px;
          color: #969084;
          font-size: 11px;
        }

        .prod-section {
          margin-top: 18px;
          padding: 20px;
          border: 1px solid var(--prod-border);
          border-radius: 18px;
          background: white;
          box-shadow: 0 7px 22px rgba(26,26,20,.04);
        }

        .prod-section-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 16px;
        }

        .prod-section-title {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -.01em;
        }

        .prod-section-description {
          display: block;
          margin-top: 4px;
          color: var(--prod-muted);
          font-size: 12px;
          line-height: 1.5;
        }

        .prod-price-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 15px 17px;
          border: 1px solid #dce9df;
          border-radius: 14px;
          background: #f5faf6;
        }

        .prod-price-label {
          font-size: 12px;
          font-weight: 800;
          color: var(--prod-green-2);
        }

        .prod-price-help {
          display: block;
          margin-top: 3px;
          color: var(--prod-muted);
          font-size: 11px;
        }

        .prod-field {
          width: 100%;
          min-width: 0;
          padding: 11px 12px;
          border: 1px solid #dcd7ce;
          border-radius: 10px;
          background: white;
          color: var(--prod-text);
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
          transition: .16s ease;
        }

        .prod-field:focus {
          border-color: var(--prod-green);
          box-shadow: 0 0 0 3px rgba(27,94,53,.10);
        }

        .prod-price-input {
          width: 150px;
          font-weight: 800;
          color: var(--prod-green-2);
          text-align: right;
        }

        .prod-register-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1.7fr auto;
          gap: 12px;
          align-items: end;
        }

        .prod-field-label {
          display: block;
          margin: 0 0 7px;
          color: #615d55;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        .prod-preview {
          min-height: 42px;
          display: flex;
          align-items: center;
          padding: 0 13px;
          border: 1px solid #dce9df;
          border-radius: 10px;
          background: #f5faf6;
          color: var(--prod-green-2);
          font-size: 13px;
          font-weight: 800;
        }

        .prod-primary-btn,
        .prod-action-btn {
          border: 0;
          cursor: pointer;
          font-family: inherit;
          transition: .16s ease;
        }

        .prod-primary-btn {
          min-height: 42px;
          padding: 0 17px;
          border-radius: 10px;
          background: var(--prod-green);
          color: white;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 7px 15px rgba(27,94,53,.16);
          white-space: nowrap;
        }

        .prod-primary-btn:hover {
          transform: translateY(-1px);
          background: var(--prod-green-2);
        }

        .prod-table-wrap {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #e8e4dc;
          border-radius: 14px;
        }

        .prod-table {
          width: 100%;
          min-width: 820px;
          border-collapse: collapse;
        }

        .prod-table th {
          padding: 12px 14px;
          background: #f8f6f1;
          color: #777166;
          border-bottom: 1px solid #e8e4dc;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .07em;
          text-align: left;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .prod-table td {
          padding: 13px 14px;
          border-bottom: 1px solid #f0ede7;
          vertical-align: middle;
          font-size: 13px;
        }

        .prod-table tbody tr {
          transition: background .15s ease;
        }

        .prod-table tbody tr:hover {
          background: #fbfcfa;
        }

        .prod-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .prod-animal {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .prod-avatar {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: linear-gradient(135deg, #e8f2eb, #cfe3d4);
          color: var(--prod-green-2);
          font-size: 11px;
          font-weight: 900;
        }

        .prod-animal-name {
          display: block;
          color: #28261f;
          font-weight: 800;
        }

        .prod-animal-meta {
          display: block;
          margin-top: 3px;
          color: #928b80;
          font-size: 10px;
        }

        .prod-id {
          display: inline-flex;
          padding: 5px 8px;
          border-radius: 7px;
          background: #f2f1ed;
          color: #625d55;
          font-size: 11px;
          font-weight: 800;
        }

        .prod-liters {
          color: var(--prod-green-2);
          font-weight: 900;
          white-space: nowrap;
        }

        .prod-revenue {
          color: #397344;
          font-weight: 800;
          white-space: nowrap;
        }

        .prod-action-group {
          display: flex;
          justify-content: flex-end;
          gap: 7px;
        }

        .prod-action-btn {
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
        }

        .prod-edit {
          background: #eef4ff;
          color: #4169a1;
        }

        .prod-delete {
          border: 1px solid #f1caca;
          background: #fff7f7;
          color: #b94b4b;
        }

        .prod-save {
          background: var(--prod-green);
          color: white;
        }

        .prod-cancel {
          border: 1px solid #ded9d0;
          background: white;
          color: #726c62;
        }

        .prod-filter-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .prod-search {
          min-width: 230px;
          max-width: 310px;
        }

        .prod-select {
          min-width: 165px;
          width: auto;
        }

        .prod-empty {
          padding: 42px 20px !important;
          color: #918a7f;
          text-align: center;
        }

        .prod-empty-icon {
          display: block;
          margin-bottom: 7px;
          font-size: 25px;
        }

        .prod-animal-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .prod-animal-card {
          padding: 15px;
          border: 1px solid #e7e2d9;
          border-radius: 15px;
          background: #fff;
          transition: .16s ease;
        }

        .prod-animal-card:hover {
          transform: translateY(-2px);
          border-color: #cdded1;
          box-shadow: 0 10px 24px rgba(26,26,20,.055);
        }

        .prod-animal-card-top {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .prod-card-avatar {
          width: 46px;
          height: 46px;
          flex: 0 0 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: linear-gradient(135deg, var(--prod-green), #3f7d50);
          color: white;
          font-size: 12px;
          font-weight: 900;
          box-shadow: 0 5px 12px rgba(27,94,53,.16);
        }

        .prod-card-name {
          font-weight: 900;
          color: #28261f;
        }

        .prod-card-id {
          margin-top: 3px;
          color: #928b80;
          font-size: 10px;
        }

        .prod-card-data {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 14px;
        }

        .prod-card-stat {
          padding: 9px;
          border-radius: 10px;
          background: #f8f6f1;
        }

        .prod-card-stat span {
          display: block;
          color: #918a7f;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .prod-card-stat strong {
          display: block;
          margin-top: 3px;
          color: #353129;
          font-size: 12px;
        }

        .prod-card-production {
          margin-top: 11px;
          padding-top: 11px;
          border-top: 1px solid #eeeae3;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
        }

        .prod-card-production span {
          color: #8b8479;
          font-size: 10px;
        }

        .prod-card-production strong {
          color: var(--prod-green-2);
          font-size: 14px;
        }

        .prod-tip {
          margin-top: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          background: #f8f6f1;
          color: #7b756b;
          font-size: 11px;
          line-height: 1.5;
        }

        @media (max-width: 1000px) {
          .prod-metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .prod-register-grid {
            grid-template-columns: 1fr 1fr;
          }

          .prod-animal-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .prod-hero {
            padding: 20px;
          }

          .prod-hero-content {
            align-items: flex-start;
            flex-direction: column;
          }

          .prod-metrics {
            grid-template-columns: 1fr;
          }

          .prod-register-grid {
            grid-template-columns: 1fr;
          }

          .prod-animal-grid {
            grid-template-columns: 1fr;
          }

          .prod-section {
            padding: 15px;
          }

          .prod-section-head {
            flex-direction: column;
          }

          .prod-filter-row {
            width: 100%;
          }

          .prod-search,
          .prod-select {
            width: 100%;
            max-width: none;
          }

          .prod-price-box {
            align-items: stretch;
            flex-direction: column;
          }

          .prod-price-input {
            width: 100%;
            text-align: left;
          }
        }
      `}</style>

      <div className="prod-page">
        <section className="prod-hero">
          <div className="prod-hero-content">
            <div>
              <div className="prod-eyebrow">Produção leiteira</div>
              <h2 className="prod-title">Controle de produção</h2>
              <p className="prod-subtitle">
                Registre a produção, acompanhe o histórico e consulte
                rapidamente os animais do rebanho.
              </p>
            </div>

            <div className="prod-status">
              <span className="prod-status-dot" />
              Sistema ativo
            </div>
          </div>
        </section>

        <section className="prod-metrics">
          <div className="prod-metric">
            <span className="prod-metric-label">Produção total</span>
            <strong className="prod-metric-value">
              {total.toFixed(1)} L
            </strong>
            <span className="prod-metric-note">
              {records.length} registro(s)
            </span>
          </div>

          <div className="prod-metric">
            <span className="prod-metric-label">Média por registro</span>
            <strong className="prod-metric-value">
              {average.toFixed(1)} L
            </strong>
            <span className="prod-metric-note">
              considerando todo o histórico
            </span>
          </div>

          <div className="prod-metric">
            <span className="prod-metric-label">Receita estimada</span>
            <strong className="prod-metric-value">
              {formatCurrency(receita)}
            </strong>
            <span className="prod-metric-note">
              produção × preço por litro
            </span>
          </div>

          <div className="prod-metric">
            <span className="prod-metric-label">Animais registrados</span>
            <strong className="prod-metric-value">
              {animalsWithProduction}
            </strong>
            <span className="prod-metric-note">
              com produção vinculada
            </span>
          </div>
        </section>

        <section className="prod-section">
          <div className="prod-price-box">
            <div>
              <div className="prod-price-label">Preço do leite</div>
              <span className="prod-price-help">
                Usado para calcular a receita estimada.
              </span>
            </div>

            <input
              className="prod-field prod-price-input"
              type="number"
              min="0"
              step="0.01"
              value={String(pricePerLiter ?? '')}
              onChange={e =>
                setPricePerLiter?.(
                  Number(e.target.value || 0)
                )
              }
              placeholder="0,00"
            />
          </div>
        </section>

        <section className="prod-section">
          <div className="prod-section-head">
            <div>
              <h3 className="prod-section-title">
                Registrar nova produção
              </h3>
              <span className="prod-section-description">
                Informe a data, quantidade e, se desejar, vincule o registro
                a uma vaca.
              </span>
            </div>
          </div>

          <div className="prod-register-grid">
            <div>
              <label className="prod-field-label">Data</label>
              <input
                className="prod-field"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="prod-field-label">Litros</label>
              <input
                className="prod-field"
                type="number"
                min="0"
                step="0.01"
                value={liters}
                onChange={e => setLiters(e.target.value)}
                placeholder="Ex.: 42"
              />
            </div>

            <div>
              <label className="prod-field-label">Animal</label>
              <select
                className="prod-field"
                value={selectedCowId}
                onChange={e => setSelectedCowId(e.target.value)}
              >
                <option value="">Não informado</option>

                {[...cows]
                  .sort((a, b) =>
                    a.nome.localeCompare(b.nome, 'pt-BR')
                  )
                  .map(cow => (
                    <option key={cow.id} value={cow.id}>
                      {cow.nome} · ID {cow.id}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="prod-field-label">Receita</label>
              <div className="prod-preview">
                {formatCurrency(
                  Number(liters || 0) * price
                )}
              </div>
            </div>

            <button
              className="prod-primary-btn"
              onClick={addRecord}
              type="button"
            >
              + Adicionar
            </button>
          </div>

          <div className="prod-tip">
            💡 Dica: vincule a produção ao animal sempre que possível. Isso
            facilita o acompanhamento individual do rebanho.
          </div>
        </section>

        <section className="prod-section">
          <div className="prod-section-head">
            <div>
              <h3 className="prod-section-title">
                Histórico de produção
              </h3>
              <span className="prod-section-description">
                Consulte, edite ou remova os registros cadastrados.
              </span>
            </div>

            <div className="prod-filter-row">
              <input
                className="prod-field prod-search"
                value={historySearch}
                onChange={e => setHistorySearch(e.target.value)}
                placeholder="🔎 Buscar animal ou ID"
              />

              <select
                className="prod-field prod-select"
                value={historyAnimal}
                onChange={e => setHistoryAnimal(e.target.value)}
              >
                <option value="todos">Todos os animais</option>

                {[...cows]
                  .sort((a, b) =>
                    a.nome.localeCompare(b.nome, 'pt-BR')
                  )
                  .map(cow => (
                    <option key={cow.id} value={cow.id}>
                      {cow.nome}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="prod-table-wrap">
            <table className="prod-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Animal</th>
                  <th>Produção</th>
                  <th>Receita</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {sortedRecords.length === 0 && (
                  <tr>
                    <td colSpan={5} className="prod-empty">
                      <span className="prod-empty-icon">🥛</span>
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                )}

                {sortedRecords.map(record => {
                  const cow = getCow(record.animal)
                  const isEditing = editingId === record.id

                  return (
                    <tr key={record.id}>
                      <td>
                        {isEditing ? (
                          <input
                            className="prod-field"
                            type="date"
                            value={editDate}
                            onChange={e =>
                              setEditDate(e.target.value)
                            }
                          />
                        ) : (
                          <strong>{formatDate(record.date)}</strong>
                        )}
                      </td>

                      <td>
                        <div className="prod-animal">
                          <div className="prod-avatar">
                            {getInitials(
                              cow?.nome || 'NI'
                            )}
                          </div>

                          <div>
                            <span className="prod-animal-name">
                              {getAnimalName(record.animal)}
                            </span>

                            <span className="prod-animal-meta">
                              {cow?.raca ||
                                (record.animal
                                  ? `ID ${record.animal}`
                                  : 'Produção geral')}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        {isEditing ? (
                          <input
                            className="prod-field"
                            type="number"
                            min="0"
                            step="0.01"
                            value={editLiters}
                            onChange={e =>
                              setEditLiters(e.target.value)
                            }
                          />
                        ) : (
                          <span className="prod-liters">
                            {record.liters.toFixed(2)} L
                          </span>
                        )}
                      </td>

                      <td>
                        <span className="prod-revenue">
                          {formatCurrency(
                            (isEditing
                              ? Number(editLiters || 0)
                              : record.liters) * price
                          )}
                        </span>
                      </td>

                      <td>
                        <div className="prod-action-group">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                className="prod-action-btn prod-save"
                                onClick={() =>
                                  saveEdit(record)
                                }
                              >
                                Salvar
                              </button>

                              <button
                                type="button"
                                className="prod-action-btn prod-cancel"
                                onClick={() =>
                                  setEditingId(null)
                                }
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="prod-action-btn prod-edit"
                                onClick={() =>
                                  startEdit(record)
                                }
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                className="prod-action-btn prod-delete"
                                onClick={() =>
                                  removeRecord(record.id)
                                }
                              >
                                Remover
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {highestRecord && (
            <div className="prod-tip">
              📈 Maior registro: <strong>{highestRecord.liters.toFixed(2)} L</strong>
              {' '}em {formatDate(highestRecord.date)}
              {highestRecord.animal
                ? ` — ${getAnimalName(highestRecord.animal)}`
                : ' — produção geral'}
            </div>
          )}
        </section>

        <section className="prod-section">
          <div className="prod-section-head">
            <div>
              <h3 className="prod-section-title">
                Animais cadastrados
              </h3>
              <span className="prod-section-description">
                {sortedCows.length} animal(is) encontrado(s), organizados
                por ordem alfabética.
              </span>
            </div>

            <input
              className="prod-field prod-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔎 Buscar nome, ID ou raça"
            />
          </div>

          {sortedCows.length === 0 ? (
            <div className="prod-empty">
              <span className="prod-empty-icon">🐄</span>
              Nenhum animal encontrado.
            </div>
          ) : (
            <div className="prod-animal-grid">
              {sortedCows.map(cow => {
                const totalCowProduction =
                  productionByCow.get(cow.id) || 0

                return (
                  <div
                    className="prod-animal-card"
                    key={cow.id}
                  >
                    <div className="prod-animal-card-top">
                      <div className="prod-card-avatar">
                        {getInitials(cow.nome)}
                      </div>

                      <div>
                        <div className="prod-card-name">
                          {cow.nome}
                        </div>

                        <div className="prod-card-id">
                          Brinco/ID #{cow.id}
                        </div>
                      </div>
                    </div>

                    <div className="prod-card-data">
                      <div className="prod-card-stat">
                        <span>Raça</span>
                        <strong>
                          {cow.raca || 'Não informada'}
                        </strong>
                      </div>

                      <div className="prod-card-stat">
                        <span>Lactação</span>
                        <strong>
                          {cow.lactacao
                            ? `${cow.lactacao}ª`
                            : '-'}
                        </strong>
                      </div>
                    </div>

                    <div className="prod-card-production">
                      <span>Produção cadastrada</span>
                      <strong>
                        {totalCowProduction.toFixed(1)} L
                      </strong>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </Card>
  )
}
