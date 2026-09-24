import { useMemo, useState } from 'react'
import Card from '../components/Card'

type Cow = {
  id: string
  nome: string
  litros: number
  raca?: string
  lactacao?: number
  categoria?: string
}

type HistoryItem = {
  id: number
  tipo: 'Vacina' | 'Tratamento' | 'Reprodução' | 'Lactação' | 'Secagem'
  data: string
  periodo?: string
  descricao: string
  status: 'Concluído' | 'Atenção' | 'Programado'
}

export default function Rebanho({
  data,
  cows,
}: {
  data?: {
    name: string
    value: number
    color?: string
  }[]
  cows?: Cow[]
}) {
  const [selectedCategory, setSelectedCategory] = useState('Em lactação')
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null)
  const [search, setSearch] = useState('')

  const history: Record<string, HistoryItem[]> = {
    '1': [
      { id: 1, tipo: 'Vacina', data: '10/08/2026', periodo: 'Anual', descricao: 'Vacina preventiva aplicada.', status: 'Concluído' },
      { id: 2, tipo: 'Reprodução', data: '15/08/2026', periodo: 'IATF', descricao: 'Inseminação artificial realizada.', status: 'Concluído' },
      { id: 3, tipo: 'Lactação', data: '01/07/2026', periodo: 'Atual', descricao: 'Início do período de lactação.', status: 'Concluído' },
      { id: 4, tipo: 'Tratamento', data: '20/08/2026', periodo: '5 dias', descricao: 'Tratamento preventivo registrado.', status: 'Concluído' },
      { id: 5, tipo: 'Vacina', data: '10/02/2027', periodo: 'Próxima dose', descricao: 'Próxima vacinação programada.', status: 'Programado' },
    ],
    '2': [
      { id: 1, tipo: 'Vacina', data: '12/08/2026', periodo: 'Anual', descricao: 'Vacinação preventiva.', status: 'Concluído' },
      { id: 2, tipo: 'Lactação', data: '05/06/2026', periodo: 'Atual', descricao: 'Período de lactação registrado.', status: 'Concluído' },
      { id: 3, tipo: 'Reprodução', data: '25/08/2026', periodo: 'Diagnóstico', descricao: 'Diagnóstico de gestação programado.', status: 'Programado' },
    ],
  }

  const summary = [
    {
      label: 'Em lactação',
      value: data?.find(d => d.name === 'Em lactação')?.value ?? 0,
      detail: 'produção ativa',
      icon: '🥛',
      tone: 'green',
    },
    {
      label: 'Secas',
      value: data?.find(d => d.name === 'Secas')?.value ?? 0,
      detail: 'em recuperação',
      icon: '🌿',
      tone: 'beige',
    },
    {
      label: 'Novilhas',
      value: data?.find(d => d.name === 'Novilhas')?.value ?? 0,
      detail: 'em desenvolvimento',
      icon: '🐄',
      tone: 'blue',
    },
    {
      label: 'Bezerras',
      value: data?.find(d => d.name === 'Bezerras')?.value ?? 0,
      detail: 'em crescimento',
      icon: '🐮',
      tone: 'orange',
    },
  ]

  const selectedCows = useMemo(() => {
    const text = search.trim().toLowerCase()

    return (cows ?? [])
      .filter(cow => cow.categoria === selectedCategory)
      .filter(cow => {
        if (!text) return true
        return (
          cow.nome.toLowerCase().includes(text) ||
          cow.id.toLowerCase().includes(text)
        )
      })
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  }, [cows, selectedCategory, search])

  const totalAnimals = (cows ?? []).length
  const totalProduction = (cows ?? []).reduce((sum, cow) => sum + (cow.litros || 0), 0)
  const averageProduction = totalAnimals ? totalProduction / totalAnimals : 0

  function getHistory(cow: Cow) {
    return history[cow.id] ?? [
      {
        id: 999,
        tipo: 'Vacina',
        data: '-',
        periodo: '-',
        descricao: 'Nenhum histórico registrado.',
        status: 'Atenção',
      },
    ]
  }

  function initials(name: string) {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  function statusFor(cow: Cow) {
    if (cow.categoria === 'Em lactação') return 'Em produção'
    if (cow.categoria === 'Secas') return 'Período seco'
    if (cow.categoria === 'Novilhas') return 'Desenvolvimento'
    return 'Crescimento'
  }

  return (
    <Card>
      <style>{`
        .herd-page {
          color: #1a1a14;
        }

        .herd-hero {
          position: relative;
          overflow: hidden;
          border-radius: 22px;
          padding: 28px 30px;
          background:
            radial-gradient(circle at 90% 15%, rgba(212,139,42,.16), transparent 28%),
            linear-gradient(135deg, #173f2a 0%, #1b5e35 58%, #286f43 100%);
          color: white;
          box-shadow: 0 14px 35px rgba(27,94,53,.16);
        }

        .herd-hero::after {
          content: '🐄';
          position: absolute;
          right: 30px;
          bottom: -12px;
          font-size: 112px;
          opacity: .12;
          transform: rotate(-8deg);
        }

        .herd-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 10px;
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 999px;
          background: rgba(255,255,255,.08);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .8px;
          text-transform: uppercase;
        }

        .herd-title {
          margin: 13px 0 6px;
          font-size: clamp(26px, 3vw, 34px);
          line-height: 1.05;
          letter-spacing: -.8px;
          font-weight: 800;
        }

        .herd-subtitle {
          max-width: 610px;
          margin: 0;
          color: rgba(255,255,255,.76);
          font-size: 14px;
          line-height: 1.55;
        }

        .herd-hero-stats {
          position: relative;
          z-index: 2;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .hero-stat {
          min-width: 125px;
          padding: 11px 13px;
          border-radius: 13px;
          background: rgba(255,255,255,.09);
          border: 1px solid rgba(255,255,255,.1);
          backdrop-filter: blur(8px);
        }

        .hero-stat span {
          display: block;
          color: rgba(255,255,255,.64);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .5px;
        }

        .hero-stat strong {
          display: block;
          margin-top: 3px;
          font-size: 18px;
        }

        .herd-section {
          margin-top: 22px;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 12px;
        }

        .section-heading h3 {
          margin: 0;
          color: #24221e;
          font-size: 17px;
          letter-spacing: -.2px;
        }

        .section-heading p {
          margin: 4px 0 0;
          color: #827b70;
          font-size: 12px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .summary-card {
          position: relative;
          overflow: hidden;
          min-height: 122px;
          padding: 17px;
          border: 1px solid #e8e3da;
          border-radius: 17px;
          background: #fff;
          text-align: left;
          cursor: pointer;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }

        .summary-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(44,39,31,.08);
        }

        .summary-card.active {
          border-color: #6b9b77;
          box-shadow: 0 0 0 3px rgba(27,94,53,.08), 0 12px 25px rgba(44,39,31,.07);
        }

        .summary-card::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 42%;
          height: 3px;
          background: #1b5e35;
          opacity: .8;
        }

        .summary-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .summary-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #eef5ef;
          font-size: 18px;
        }

        .summary-card:nth-child(2) .summary-icon { background: #f5f0e8; }
        .summary-card:nth-child(3) .summary-icon { background: #edf3f9; }
        .summary-card:nth-child(4) .summary-icon { background: #fff1df; }

        .summary-arrow {
          color: #a39c91;
          font-size: 16px;
        }

        .summary-label {
          display: block;
          margin-top: 13px;
          color: #746e65;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .45px;
        }

        .summary-value {
          display: block;
          margin-top: 2px;
          color: #1b5e35;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -.5px;
        }

        .summary-detail {
          color: #928b80;
          font-size: 11px;
        }

        .herd-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          padding: 14px;
          border: 1px solid #e8e3da;
          border-radius: 17px;
          background: #fbfaf7;
        }

        .category-tabs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .category-tab {
          border: 1px solid transparent;
          border-radius: 10px;
          padding: 9px 12px;
          background: transparent;
          color: #746e65;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          transition: .2s;
        }

        .category-tab:hover {
          background: #f0eee9;
          color: #2d2a25;
        }

        .category-tab.active {
          background: #1b5e35;
          color: white;
          box-shadow: 0 5px 12px rgba(27,94,53,.16);
        }

        .herd-search-wrap {
          position: relative;
          width: min(300px, 100%);
        }

        .herd-search {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 13px 11px 37px;
          border: 1px solid #ded9d0;
          border-radius: 11px;
          background: white;
          outline: none;
          color: #2b2925;
          font-size: 12px;
          transition: .2s;
        }

        .herd-search:focus {
          border-color: #397344;
          box-shadow: 0 0 0 3px rgba(57,115,68,.1);
        }

        .search-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #918a80;
          pointer-events: none;
        }

        .animal-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 14px;
        }

        .animal-card {
          position: relative;
          overflow: hidden;
          padding: 17px;
          border: 1px solid #e8e3da;
          border-radius: 18px;
          background: white;
          cursor: pointer;
          text-align: left;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }

        .animal-card:hover {
          transform: translateY(-3px);
          border-color: #cbdccc;
          box-shadow: 0 13px 28px rgba(44,39,31,.08);
        }

        .animal-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .animal-avatar {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: linear-gradient(145deg, #edf5ee, #dcebdd);
          color: #1b5e35;
          font-size: 18px;
          font-weight: 900;
          border: 1px solid #d4e4d6;
        }

        .animal-status {
          padding: 5px 8px;
          border-radius: 999px;
          background: #edf6ee;
          color: #32713d;
          font-size: 10px;
          font-weight: 800;
        }

        .animal-name {
          margin-top: 13px;
          color: #26231f;
          font-size: 16px;
          font-weight: 800;
        }

        .animal-id {
          margin-top: 2px;
          color: #938c82;
          font-size: 11px;
        }

        .animal-meta {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-top: 15px;
        }

        .meta-box {
          padding: 9px;
          border-radius: 11px;
          background: #f8f7f3;
        }

        .meta-box span {
          display: block;
          color: #928b80;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .meta-box strong {
          display: block;
          margin-top: 2px;
          color: #37332d;
          font-size: 12px;
        }

        .animal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 15px;
          padding-top: 12px;
          border-top: 1px solid #eeeae3;
        }

        .production {
          color: #1b5e35;
          font-size: 14px;
          font-weight: 900;
        }

        .history-button {
          border: none;
          background: #edf5ef;
          color: #1b5e35;
          padding: 8px 10px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
          transition: .2s;
        }

        .history-button:hover {
          background: #dfeee2;
        }

        .empty-state {
          grid-column: 1 / -1;
          padding: 45px 20px;
          border: 1px dashed #dcd7ce;
          border-radius: 17px;
          background: #fbfaf7;
          text-align: center;
        }

        .empty-icon {
          width: 52px;
          height: 52px;
          margin: 0 auto 10px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #eef3ee;
          font-size: 23px;
        }

        .empty-state strong {
          display: block;
          color: #403c35;
          font-size: 14px;
        }

        .empty-state span {
          display: block;
          margin-top: 5px;
          color: #928b80;
          font-size: 12px;
        }

        .insight-panel {
          margin-top: 18px;
          padding: 16px;
          border: 1px solid #e8e3da;
          border-radius: 17px;
          background: linear-gradient(135deg, #fbfaf7, #f6f4ee);
        }

        .insight-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .insight-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 13px;
          background: #e8f1e9;
          font-size: 19px;
        }

        .insight-content strong {
          display: block;
          color: #37332d;
          font-size: 12px;
        }

        .insight-content span {
          display: block;
          margin-top: 3px;
          color: #847d73;
          font-size: 11px;
          line-height: 1.45;
        }

        .modal-bg {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(20, 24, 20, .62);
          backdrop-filter: blur(5px);
        }

        .modal {
          width: min(920px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 23px;
          background: #fff;
          box-shadow: 0 30px 90px rgba(0,0,0,.25);
        }

        .modal-header {
          position: sticky;
          top: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 21px 23px;
          border-bottom: 1px solid #eeeae3;
          background: rgba(255,255,255,.96);
          backdrop-filter: blur(10px);
        }

        .modal-animal {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-avatar {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: linear-gradient(145deg, #edf5ee, #dcebdd);
          color: #1b5e35;
          font-weight: 900;
          font-size: 18px;
        }

        .modal-title {
          margin: 0;
          color: #26231f;
          font-size: 20px;
          font-weight: 850;
        }

        .modal-subtitle {
          margin-top: 3px;
          color: #898278;
          font-size: 11px;
        }

        .close-button {
          width: 37px;
          height: 37px;
          border: 1px solid #e6e1d8;
          border-radius: 11px;
          background: #f7f5f1;
          color: #5f594f;
          cursor: pointer;
          font-size: 19px;
          transition: .2s;
        }

        .close-button:hover {
          background: #eeeae3;
        }

        .modal-body {
          padding: 22px 23px 25px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 22px;
        }

        .detail-card {
          padding: 13px;
          border: 1px solid #e8e3da;
          border-radius: 13px;
          background: #faf9f6;
        }

        .detail-card span {
          display: block;
          color: #8d867b;
          font-size: 10px;
          font-weight: 700;
        }

        .detail-card strong {
          display: block;
          margin-top: 4px;
          color: #302d28;
          font-size: 13px;
        }

        .history-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }

        .history-title-row h3 {
          margin: 0;
          color: #292621;
          font-size: 15px;
        }

        .history-count {
          padding: 5px 8px;
          border-radius: 999px;
          background: #eef4ef;
          color: #32713d;
          font-size: 10px;
          font-weight: 800;
        }

        .history-list {
          display: grid;
          gap: 8px;
        }

        .history-item {
          display: grid;
          grid-template-columns: 42px 1fr auto;
          align-items: center;
          gap: 11px;
          padding: 12px;
          border: 1px solid #eeeae3;
          border-radius: 13px;
          background: #fff;
        }

        .history-dot {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #f0f5f0;
          font-size: 17px;
        }

        .history-item strong {
          color: #35312b;
          font-size: 12px;
        }

        .history-item p {
          margin: 3px 0 0;
          color: #8b847a;
          font-size: 11px;
          line-height: 1.4;
        }

        .history-date {
          color: #6f685e;
          font-size: 10px;
          font-weight: 700;
          text-align: right;
        }

        .status {
          display: inline-flex;
          margin-top: 5px;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 800;
        }

        .status-ok { background: #e8f4ea; color: #32713d; }
        .status-alert { background: #fff2d8; color: #9a6a12; }
        .status-planned { background: #e8f0fb; color: #416b9f; }

        @media (max-width: 1050px) {
          .summary-grid { grid-template-columns: repeat(2, 1fr); }
          .animal-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 700px) {
          .herd-hero { padding: 22px; }
          .summary-grid { grid-template-columns: 1fr 1fr; }
          .animal-grid { grid-template-columns: 1fr; }
          .detail-grid { grid-template-columns: 1fr 1fr; }
          .history-item { grid-template-columns: 40px 1fr; }
          .history-date { grid-column: 2; text-align: left; }
        }

        @media (max-width: 480px) {
          .summary-grid { grid-template-columns: 1fr; }
          .herd-hero-stats { display: grid; grid-template-columns: 1fr 1fr; }
          .hero-stat { min-width: 0; }
          .detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="herd-page">
        <section className="herd-hero">
          <span className="herd-eyebrow">🐄 Gestão do rebanho</span>
          <h2 className="herd-title">Seu rebanho em um só lugar</h2>
          <p className="herd-subtitle">
            Acompanhe a composição do rebanho, produção e histórico individual
            dos animais com uma visão rápida e organizada.
          </p>

          <div className="herd-hero-stats">
            <div className="hero-stat">
              <span>Total de animais</span>
              <strong>{totalAnimals}</strong>
            </div>
            <div className="hero-stat">
              <span>Produção cadastrada</span>
              <strong>{totalProduction.toFixed(1)} L/dia</strong>
            </div>
            <div className="hero-stat">
              <span>Média geral</span>
              <strong>{averageProduction.toFixed(1)} L</strong>
            </div>
          </div>
        </section>

        <section className="herd-section">
          <div className="section-heading">
            <div>
              <h3>Resumo do rebanho</h3>
              <p>Selecione uma categoria para visualizar os animais.</p>
            </div>
          </div>

          <div className="summary-grid">
            {summary.map(item => (
              <button
                key={item.label}
                type="button"
                className={`summary-card ${
                  selectedCategory === item.label ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory(item.label)}
              >
                <div className="summary-top">
                  <span className="summary-icon">{item.icon}</span>
                  <span className="summary-arrow">→</span>
                </div>
                <span className="summary-label">{item.label}</span>
                <strong className="summary-value">{item.value}</strong>
                <span className="summary-detail">{item.detail}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="herd-section">
          <div className="herd-toolbar">
            <div className="category-tabs">
              {summary.map(item => (
                <button
                  key={item.label}
                  type="button"
                  className={`category-tab ${
                    selectedCategory === item.label ? 'active' : ''
                  }`}
                  onClick={() => setSelectedCategory(item.label)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="herd-search-wrap">
              <span className="search-icon">⌕</span>
              <input
                className="herd-search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nome ou brinco..."
              />
            </div>
          </div>

          <div className="section-heading" style={{ marginTop: 20 }}>
            <div>
              <h3>{selectedCategory}</h3>
              <p>
                {selectedCows.length} animal(is) encontrado(s) • ordem alfabética
              </p>
            </div>
          </div>

          <div className="animal-grid">
            {selectedCows.map(cow => (
              <article
                key={cow.id}
                className="animal-card"
                onClick={() => setSelectedCow(cow)}
              >
                <div className="animal-top">
                  <div className="animal-avatar">{initials(cow.nome)}</div>
                  <span className="animal-status">{statusFor(cow)}</span>
                </div>

                <div className="animal-name">{cow.nome}</div>
                <div className="animal-id">Brinco #{cow.id}</div>

                <div className="animal-meta">
                  <div className="meta-box">
                    <span>Raça</span>
                    <strong>{cow.raca ?? 'Não informada'}</strong>
                  </div>
                  <div className="meta-box">
                    <span>Lactação</span>
                    <strong>{cow.lactacao ? `${cow.lactacao}ª` : '-'}</strong>
                  </div>
                </div>

                <div className="animal-footer">
                  <span className="production">
                    {cow.litros > 0 ? `${cow.litros} L/dia` : 'Sem produção'}
                  </span>

                  <button
                    type="button"
                    className="history-button"
                    onClick={e => {
                      e.stopPropagation()
                      setSelectedCow(cow)
                    }}
                  >
                    Ver detalhes →
                  </button>
                </div>
              </article>
            ))}

            {!selectedCows.length && (
              <div className="empty-state">
                <div className="empty-icon">🐄</div>
                <strong>Nenhum animal encontrado</strong>
                <span>
                  Tente mudar a categoria ou alterar o termo da busca.
                </span>
              </div>
            )}
          </div>

          {selectedCows.length > 0 && (
            <div className="insight-panel">
              <div className="insight-content">
                <div className="insight-icon">💡</div>
                <div>
                  <strong>Visão rápida</strong>
                  <span>
                    Os animais são apresentados em ordem alfabética. Clique em
                    qualquer card para consultar o histórico individual.
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {selectedCow && (
        <div
          className="modal-bg"
          onClick={() => setSelectedCow(null)}
        >
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-animal">
                <div className="modal-avatar">
                  {initials(selectedCow.nome)}
                </div>
                <div>
                  <h2 className="modal-title">{selectedCow.nome}</h2>
                  <div className="modal-subtitle">
                    Brinco #{selectedCow.id} ·{' '}
                    {selectedCow.raca ?? 'Raça não informada'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() => setSelectedCow(null)}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-card">
                  <span>Categoria</span>
                  <strong>{selectedCow.categoria ?? '-'}</strong>
                </div>

                <div className="detail-card">
                  <span>Lactação</span>
                  <strong>
                    {selectedCow.lactacao
                      ? `${selectedCow.lactacao}ª lactação`
                      : '-'}
                  </strong>
                </div>

                <div className="detail-card">
                  <span>Produção</span>
                  <strong>{selectedCow.litros} L/dia</strong>
                </div>

                <div className="detail-card">
                  <span>Registros</span>
                  <strong>{getHistory(selectedCow).length}</strong>
                </div>
              </div>

              <div className="history-title-row">
                <h3>Histórico do animal</h3>
                <span className="history-count">
                  {getHistory(selectedCow).length} registros
                </span>
              </div>

              <div className="history-list">
                {getHistory(selectedCow).map(item => {
                  const icon =
                    item.tipo === 'Vacina'
                      ? '💉'
                      : item.tipo === 'Tratamento'
                        ? '🩺'
                        : item.tipo === 'Reprodução'
                          ? '🧬'
                          : item.tipo === 'Lactação'
                            ? '🥛'
                            : '📋'

                  const statusClass =
                    item.status === 'Concluído'
                      ? 'status-ok'
                      : item.status === 'Atenção'
                        ? 'status-alert'
                        : 'status-planned'

                  return (
                    <div className="history-item" key={item.id}>
                      <div className="history-dot">{icon}</div>

                      <div>
                        <strong>{item.tipo}</strong>
                        <p>
                          {item.descricao}
                          {item.periodo ? ` • ${item.periodo}` : ''}
                        </p>
                        <span className={`status ${statusClass}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="history-date">{item.data}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
