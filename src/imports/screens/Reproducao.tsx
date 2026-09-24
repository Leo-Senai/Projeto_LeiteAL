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

type Appointment = {
  id: number
  animalId: string
  animal: string
  tipo: string
  data: string
  observacao: string
  status?: 'Agendado' | 'Realizado'
}

export default function Reproducao({
  cows = [],
}: {
  cows?: Cow[]
}) {
  const [selected, setSelected] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [tipo, setTipo] = useState('Inseminação')
  const [search, setSearch] = useState('')
  const [appointmentFilter, setAppointmentFilter] = useState('todos')

  const [appointments, setAppointments] =
    useState<Appointment[]>([
      {
        id: 1,
        animalId: '124',
        animal: 'Estrela',
        tipo: 'Inseminação',
        data: '2026-08-10',
        observacao: 'Inseminação realizada com acompanhamento.',
        status: 'Realizado',
      },
      {
        id: 2,
        animalId: '124',
        animal: 'Estrela',
        tipo: 'Diagnóstico',
        data: '2026-08-25',
        observacao: 'Avaliação de gestação.',
        status: 'Realizado',
      },
      {
        id: 3,
        animalId: '201',
        animal: 'Flor',
        tipo: 'Cio',
        data: '2026-08-20',
        observacao: 'Identificação de cio.',
        status: 'Realizado',
      },
      {
        id: 4,
        animalId: '201',
        animal: 'Flor',
        tipo: 'Inseminação',
        data: '2026-08-21',
        observacao: 'Inseminação programada.',
        status: 'Realizado',
      },
      {
        id: 5,
        animalId: '055',
        animal: 'Luna',
        tipo: 'Diagnóstico',
        data: '2026-08-29',
        observacao: 'Acompanhamento reprodutivo.',
        status: 'Realizado',
      },
      {
        id: 6,
        animalId: '124',
        animal: 'Estrela',
        tipo: 'Diagnóstico',
        data: '2026-09-25',
        observacao: 'Próximo diagnóstico de gestação.',
        status: 'Agendado',
      },
    ])

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
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  }, [cows, search])

  const sortedAppointments = useMemo(() => {
    return [...appointments]
      .filter(item => {
        if (appointmentFilter === 'todos') return true
        return item.status === appointmentFilter
      })
      .sort(
        (a, b) =>
          new Date(a.data).getTime() -
          new Date(b.data).getTime()
      )
  }, [appointments, appointmentFilter])

  const selectedCow = useMemo(
    () => cows.find(cow => cow.id === selected),
    [cows, selected]
  )

  const selectedCowHistory = useMemo(() => {
    if (!selected) return []

    return [...appointments]
      .filter(item => item.animalId === selected)
      .sort(
        (a, b) =>
          new Date(b.data).getTime() -
          new Date(a.data).getTime()
      )
  }, [appointments, selected])

  const pendingAppointments = appointments.filter(
    item => item.status !== 'Realizado'
  ).length

  const completedAppointments = appointments.filter(
    item => item.status === 'Realizado'
  ).length

  const inseminations = appointments.filter(
    item => item.tipo === 'Inseminação'
  ).length

  const diagnostics = appointments.filter(
    item => item.tipo === 'Diagnóstico'
  ).length

  const pregnancies = appointments.filter(
    item => item.tipo === 'Gestação'
  ).length

  const nextAppointment = useMemo(
    () =>
      [...appointments]
        .filter(item => item.status !== 'Realizado')
        .sort(
          (a, b) =>
            new Date(a.data).getTime() -
            new Date(b.data).getTime()
        )[0],
    [appointments]
  )

  const historyInseminations = selectedCowHistory.filter(
    item => item.tipo === 'Inseminação'
  ).length

  const historyDiagnostics = selectedCowHistory.filter(
    item => item.tipo === 'Diagnóstico'
  ).length

  const historyPregnancies = selectedCowHistory.filter(
    item => item.tipo === 'Gestação'
  ).length

  const historyBirths = selectedCowHistory.filter(
    item => item.tipo === 'Parto'
  ).length

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

  function selectCow(cowId: string) {
    if (selected === cowId) {
      setSelected('')
      return
    }

    setSelected(cowId)

    setTimeout(() => {
      document
        .getElementById('historico-reprodutivo')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
    }, 100)
  }

  function schedule() {
    if (!selected) {
      alert('Selecione uma vaca.')
      return
    }

    if (!date) {
      alert('Informe a data.')
      return
    }

    const cow = cows.find(item => item.id === selected)

    if (!cow) {
      alert('Animal não encontrado.')
      return
    }

    const newAppointment: Appointment = {
      id: Date.now(),
      animalId: cow.id,
      animal: cow.nome,
      tipo,
      data: date,
      observacao: note.trim() || 'Sem observação',
      status: 'Agendado',
    }

    setAppointments(prev => [...prev, newAppointment])
    setDate('')
    setNote('')
    setTipo('Inseminação')

    alert('Procedimento agendado com sucesso!')
  }

  function removeAppointment(id: number) {
    if (!window.confirm('Deseja remover este procedimento?')) return

    setAppointments(prev =>
      prev.filter(item => item.id !== id)
    )
  }

  function completeAppointment(id: number) {
    setAppointments(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: 'Realizado' }
          : item
      )
    )
  }

  return (
    <Card>
      <style>{`
        .repro-page {
          --repro-green: #1b5e35;
          --repro-green-dark: #154d2b;
          --repro-green-soft: #e8f2eb;
          --repro-beige: #f5f0e8;
          --repro-border: #e3ded4;
          --repro-muted: #7a7568;
          --repro-text: #1a1a14;
          --repro-orange: #d48b2a;
          --repro-red: #c0392b;
        }

        .repro-hero {
          position: relative;
          overflow: hidden;
          padding: 26px;
          border-radius: 20px;
          color: white;
          background:
            radial-gradient(circle at 90% 15%, rgba(255,255,255,.16), transparent 28%),
            linear-gradient(135deg, var(--repro-green-dark), var(--repro-green));
          box-shadow: 0 14px 34px rgba(27,94,53,.14);
        }

        .repro-hero::after {
          content: '';
          position: absolute;
          right: -70px;
          bottom: -100px;
          width: 220px;
          height: 220px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 50%;
          box-shadow:
            0 0 0 28px rgba(255,255,255,.035),
            0 0 0 56px rgba(255,255,255,.025);
        }

        .repro-hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .repro-eyebrow {
          margin-bottom: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
          opacity: .72;
        }

        .repro-title {
          margin: 0;
          font-size: 27px;
          line-height: 1.15;
          letter-spacing: -.03em;
        }

        .repro-subtitle {
          max-width: 680px;
          margin: 8px 0 0;
          color: rgba(255,255,255,.78);
          font-size: 13px;
          line-height: 1.55;
        }

        .repro-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 999px;
          background: rgba(255,255,255,.10);
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .repro-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #b9e3c3;
          box-shadow: 0 0 0 4px rgba(185,227,195,.12);
        }

        .repro-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .repro-metric {
          position: relative;
          overflow: hidden;
          min-height: 108px;
          padding: 18px;
          border: 1px solid var(--repro-border);
          border-radius: 16px;
          background: white;
          box-shadow: 0 7px 22px rgba(26,26,20,.045);
        }

        .repro-metric::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 52px;
          height: 3px;
          background: var(--repro-green);
          border-radius: 0 5px 0 0;
        }

        .repro-metric-label {
          display: block;
          color: var(--repro-muted);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .repro-metric-value {
          display: block;
          margin-top: 8px;
          color: var(--repro-green-dark);
          font-size: 25px;
          font-weight: 900;
          letter-spacing: -.03em;
        }

        .repro-metric-note {
          display: block;
          margin-top: 4px;
          color: #969084;
          font-size: 11px;
        }

        .repro-section {
          margin-top: 18px;
          padding: 20px;
          border: 1px solid var(--repro-border);
          border-radius: 18px;
          background: white;
          box-shadow: 0 7px 22px rgba(26,26,20,.04);
        }

        .repro-section-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 16px;
        }

        .repro-section-title {
          margin: 0;
          color: #292720;
          font-size: 16px;
          font-weight: 900;
        }

        .repro-section-description {
          display: block;
          margin-top: 4px;
          color: var(--repro-muted);
          font-size: 12px;
          line-height: 1.5;
        }

        .repro-form {
          display: grid;
          grid-template-columns: 1.25fr .9fr .9fr 1.6fr auto;
          gap: 11px;
          align-items: end;
        }

        .repro-label {
          display: block;
          margin-bottom: 7px;
          color: #625d55;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .05em;
          text-transform: uppercase;
        }

        .repro-field {
          width: 100%;
          min-width: 0;
          min-height: 42px;
          box-sizing: border-box;
          padding: 10px 12px;
          border: 1px solid #dcd7ce;
          border-radius: 10px;
          outline: none;
          background: white;
          color: var(--repro-text);
          font: inherit;
          font-size: 13px;
          transition: .16s ease;
        }

        .repro-field:focus {
          border-color: var(--repro-green);
          box-shadow: 0 0 0 3px rgba(27,94,53,.10);
        }

        .repro-primary-btn {
          min-height: 42px;
          padding: 0 17px;
          border: 0;
          border-radius: 10px;
          background: var(--repro-green);
          color: white;
          cursor: pointer;
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          box-shadow: 0 7px 15px rgba(27,94,53,.15);
          white-space: nowrap;
          transition: .16s ease;
        }

        .repro-primary-btn:hover {
          transform: translateY(-1px);
          background: var(--repro-green-dark);
        }

        .repro-search {
          width: 290px;
          max-width: 100%;
        }

        .repro-table-wrap {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #e8e4dc;
          border-radius: 14px;
        }

        .repro-table {
          width: 100%;
          min-width: 850px;
          border-collapse: collapse;
        }

        .repro-table th {
          padding: 12px 14px;
          background: #f8f6f1;
          border-bottom: 1px solid #e8e4dc;
          color: #777166;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .07em;
          text-align: left;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .repro-table td {
          padding: 13px 14px;
          border-bottom: 1px solid #f0ede7;
          vertical-align: middle;
          font-size: 13px;
        }

        .repro-table tbody tr {
          transition: background .15s ease;
        }

        .repro-table tbody tr:hover {
          background: #fbfcfa;
        }

        .repro-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .repro-selected-row {
          background: #f0f7f1 !important;
        }

        .repro-animal {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .repro-avatar {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: linear-gradient(135deg, #e8f2eb, #cfe3d4);
          color: var(--repro-green-dark);
          font-size: 12px;
          font-weight: 900;
        }

        .repro-avatar.large {
          width: 58px;
          height: 58px;
          flex-basis: 58px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--repro-green), #285d34);
          color: white;
          font-size: 16px;
          box-shadow: 0 7px 16px rgba(27,94,53,.16);
        }

        .repro-animal-name {
          display: block;
          color: #28261f;
          font-weight: 900;
        }

        .repro-animal-meta {
          display: block;
          margin-top: 3px;
          color: #928b80;
          font-size: 10px;
        }

        .repro-id {
          display: inline-flex;
          padding: 5px 8px;
          border-radius: 7px;
          background: #f2f1ed;
          color: #625d55;
          font-size: 11px;
          font-weight: 800;
        }

        .repro-production {
          color: var(--repro-green-dark);
          font-weight: 900;
        }

        .repro-lactation {
          display: inline-flex;
          padding: 6px 9px;
          border-radius: 8px;
          background: #eef6ef;
          color: #397344;
          font-size: 11px;
          font-weight: 800;
        }

        .repro-select-btn,
        .repro-complete-btn,
        .repro-remove-btn,
        .repro-close-btn {
          border-radius: 9px;
          padding: 8px 11px;
          cursor: pointer;
          font: inherit;
          font-size: 11px;
          font-weight: 800;
          transition: .16s ease;
        }

        .repro-select-btn {
          border: 0;
          background: var(--repro-green);
          color: white;
        }

        .repro-select-btn:hover {
          transform: translateY(-1px);
          background: var(--repro-green-dark);
        }

        .repro-select-btn.selected {
          background: var(--repro-orange);
        }

        .repro-complete-btn {
          border: 1px solid #cce3d0;
          background: #f1faf3;
          color: #397344;
        }

        .repro-remove-btn {
          border: 1px solid #f1caca;
          background: #fff7f7;
          color: #b94b4b;
        }

        .repro-remove-btn:hover {
          background: #ffeaea;
        }

        .repro-action-group {
          display: flex;
          justify-content: flex-end;
          gap: 6px;
          flex-wrap: wrap;
        }

        .repro-status {
          display: inline-flex;
          padding: 6px 9px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 900;
        }

        .repro-status.realizado {
          background: #eaf6ed;
          color: #397344;
        }

        .repro-status.agendado {
          background: #fff5e6;
          color: #a66a18;
        }

        .repro-type {
          display: inline-flex;
          padding: 6px 9px;
          border-radius: 8px;
          background: #eef4ff;
          color: #4169a1;
          font-size: 10px;
          font-weight: 900;
        }

        .repro-empty {
          padding: 42px 20px !important;
          color: #918a7f;
          text-align: center;
        }

        .repro-empty-icon {
          display: block;
          margin-bottom: 7px;
          font-size: 26px;
        }

        .repro-history {
          scroll-margin-top: 20px;
          border-color: #d7e7da;
          background:
            linear-gradient(135deg, #f7fbf7, #fff);
        }

        .repro-history-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .repro-history-title {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .repro-history-title h3 {
          margin: 0;
          color: #263126;
          font-size: 17px;
        }

        .repro-history-title p {
          margin: 5px 0 0;
          color: #77736b;
          font-size: 12px;
        }

        .repro-close-btn {
          border: 1px solid #ddd8ce;
          background: white;
          color: #625d55;
        }

        .repro-cow-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }

        .repro-summary-chip {
          padding: 8px 10px;
          border: 1px solid #d9e8dc;
          border-radius: 9px;
          background: white;
          color: #397344;
          font-size: 11px;
          font-weight: 800;
        }

        .repro-history-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-top: 16px;
        }

        .repro-history-metric {
          padding: 14px;
          border: 1px solid #e7e3dc;
          border-radius: 12px;
          background: white;
        }

        .repro-history-metric span {
          display: block;
          color: #858078;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .05em;
          text-transform: uppercase;
        }

        .repro-history-metric strong {
          display: block;
          margin-top: 6px;
          color: var(--repro-green-dark);
          font-size: 22px;
        }

        .repro-history-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
          margin-top: 14px;
        }

        .repro-history-item {
          display: grid;
          grid-template-columns: 105px 145px 1fr auto;
          align-items: center;
          gap: 14px;
          padding: 13px 14px;
          border: 1px solid #ebe8e2;
          border-radius: 11px;
          background: white;
        }

        .repro-history-date {
          color: #49453e;
          font-size: 12px;
          font-weight: 900;
        }

        .repro-history-note {
          color: #6f6a61;
          font-size: 11px;
          line-height: 1.45;
        }

        .repro-next {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 13px;
          padding: 11px 13px;
          border: 1px solid #e7dfcd;
          border-radius: 10px;
          background: #fffaf1;
          color: #7a5a27;
          font-size: 11px;
          line-height: 1.45;
        }

        .repro-cow-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .repro-cow-card {
          position: relative;
          padding: 15px;
          border: 1px solid #e6e1d8;
          border-radius: 16px;
          background: white;
          cursor: pointer;
          transition: .16s ease;
        }

        .repro-cow-card:hover {
          transform: translateY(-2px);
          border-color: #cdded1;
          box-shadow: 0 10px 24px rgba(26,26,20,.055);
        }

        .repro-cow-card.selected {
          border-color: #9fc2a7;
          background: #f5faf6;
          box-shadow: 0 0 0 3px rgba(27,94,53,.07);
        }

        .repro-card-top {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .repro-card-name {
          color: #28261f;
          font-weight: 900;
        }

        .repro-card-id {
          margin-top: 3px;
          color: #928b80;
          font-size: 10px;
        }

        .repro-card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 13px;
        }

        .repro-card-stat {
          padding: 9px;
          border-radius: 10px;
          background: #f8f6f1;
        }

        .repro-card-stat span {
          display: block;
          color: #918a7f;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .repro-card-stat strong {
          display: block;
          margin-top: 3px;
          color: #353129;
          font-size: 12px;
        }

        .repro-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-top: 11px;
          padding-top: 11px;
          border-top: 1px solid #eeeae3;
        }

        .repro-card-footer span {
          color: #8b8479;
          font-size: 10px;
        }

        .repro-card-footer strong {
          color: var(--repro-green-dark);
          font-size: 13px;
        }

        @media (max-width: 1050px) {
          .repro-metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .repro-form {
            grid-template-columns: 1fr 1fr;
          }

          .repro-cow-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 800px) {
          .repro-hero-content {
            align-items: flex-start;
            flex-direction: column;
          }

          .repro-section {
            padding: 15px;
          }

          .repro-section-head {
            flex-direction: column;
          }

          .repro-search {
            width: 100%;
          }

          .repro-history-header {
            flex-direction: column;
          }

          .repro-history-metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .repro-history-item {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .repro-cow-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .repro-metrics {
            grid-template-columns: 1fr;
          }

          .repro-form {
            grid-template-columns: 1fr;
          }

          .repro-history-metrics {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="repro-page">
        <section className="repro-hero">
          <div className="repro-hero-content">
            <div>
              <div className="repro-eyebrow">
                Reprodução bovina
              </div>

              <h2 className="repro-title">
                Programa reprodutivo
              </h2>

              <p className="repro-subtitle">
                Acompanhe cio, inseminações, diagnósticos,
                gestações, partos e secagens de cada animal.
              </p>
            </div>

            <div className="repro-status">
              <span className="repro-status-dot" />
              {pendingAppointments} pendente(s)
            </div>
          </div>
        </section>

        <section className="repro-metrics">
          <div className="repro-metric">
            <span className="repro-metric-label">
              Vacas cadastradas
            </span>

            <strong className="repro-metric-value">
              {cows.length}
            </strong>

            <span className="repro-metric-note">
              disponíveis para acompanhamento
            </span>
          </div>

          <div className="repro-metric">
            <span className="repro-metric-label">
              Inseminações
            </span>

            <strong className="repro-metric-value">
              {inseminations}
            </strong>

            <span className="repro-metric-note">
              procedimentos registrados
            </span>
          </div>

          <div className="repro-metric">
            <span className="repro-metric-label">
              Diagnósticos
            </span>

            <strong className="repro-metric-value">
              {diagnostics}
            </strong>

            <span className="repro-metric-note">
              acompanhamentos registrados
            </span>
          </div>

          <div className="repro-metric">
            <span className="repro-metric-label">
              Próximo procedimento
            </span>

            <strong className="repro-metric-value">
              {nextAppointment
                ? formatDate(nextAppointment.data)
                : '-'}
            </strong>

            <span className="repro-metric-note">
              {nextAppointment
                ? `${nextAppointment.animal} · ${nextAppointment.tipo}`
                : 'Nenhum agendamento'}
            </span>
          </div>
        </section>

        <section className="repro-section">
          <div className="repro-section-head">
            <div>
              <h3 className="repro-section-title">
                Agendar procedimento
              </h3>

              <span className="repro-section-description">
                Selecione uma vaca e registre o próximo evento reprodutivo.
              </span>
            </div>
          </div>

          <div className="repro-form">
            <div>
              <label className="repro-label">Animal</label>

              <select
                className="repro-field"
                value={selected}
                onChange={e => setSelected(e.target.value)}
              >
                <option value="">
                  Selecione uma vaca
                </option>

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
              <label className="repro-label">
                Procedimento
              </label>

              <select
                className="repro-field"
                value={tipo}
                onChange={e => setTipo(e.target.value)}
              >
                <option>Inseminação</option>
                <option>Diagnóstico</option>
                <option>Cio</option>
                <option>Gestação</option>
                <option>Parto</option>
                <option>Secagem</option>
                <option>Outro</option>
              </select>
            </div>

            <div>
              <label className="repro-label">Data</label>

              <input
                className="repro-field"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="repro-label">
                Observação
              </label>

              <input
                className="repro-field"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Ex.: acompanhar retorno de cio"
              />
            </div>

            <button
              type="button"
              className="repro-primary-btn"
              onClick={schedule}
            >
              + Agendar
            </button>
          </div>
        </section>

        {selectedCow && (
          <section
            id="historico-reprodutivo"
            className="repro-section repro-history"
          >
            <div className="repro-history-header">
              <div className="repro-history-title">
                <div className="repro-avatar large">
                  {getInitials(selectedCow.nome)}
                </div>

                <div>
                  <h3>
                    Histórico reprodutivo
                  </h3>

                  <p>
                    {selectedCow.nome} · ID {selectedCow.id} ·{' '}
                    {selectedCow.raca || 'Raça não informada'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="repro-close-btn"
                onClick={() => setSelected('')}
              >
                Fechar
              </button>
            </div>

            <div className="repro-cow-summary">
              <span className="repro-summary-chip">
                🐄 {selectedCow.litros} L/dia
              </span>

              <span className="repro-summary-chip">
                🔄 {selectedCow.lactacao
                  ? `${selectedCow.lactacao}ª lactação`
                  : 'Lactação não informada'}
              </span>

              {selectedCow.categoria && (
                <span className="repro-summary-chip">
                  {selectedCow.categoria}
                </span>
              )}
            </div>

            <div className="repro-history-metrics">
              <div className="repro-history-metric">
                <span>Inseminações</span>
                <strong>{historyInseminations}</strong>
              </div>

              <div className="repro-history-metric">
                <span>Diagnósticos</span>
                <strong>{historyDiagnostics}</strong>
              </div>

              <div className="repro-history-metric">
                <span>Gestações</span>
                <strong>{historyPregnancies}</strong>
              </div>

              <div className="repro-history-metric">
                <span>Partos</span>
                <strong>{historyBirths}</strong>
              </div>
            </div>

            {selectedCowHistory.length === 0 ? (
              <div className="repro-empty">
                <span className="repro-empty-icon">
                  📋
                </span>
                Nenhum procedimento reprodutivo registrado
                para esta vaca.
              </div>
            ) : (
              <div className="repro-history-list">
                {selectedCowHistory.map(item => (
                  <div
                    key={item.id}
                    className="repro-history-item"
                  >
                    <div className="repro-history-date">
                      {formatDate(item.data)}
                    </div>

                    <div>
                      <span className="repro-type">
                        {item.tipo}
                      </span>
                    </div>

                    <div className="repro-history-note">
                      {item.observacao}
                    </div>

                    <div>
                      <span
                        className={`repro-status ${
                          item.status === 'Realizado'
                            ? 'realizado'
                            : 'agendado'
                        }`}
                      >
                        {item.status || 'Agendado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedCowHistory.some(
              item => item.status === 'Agendado'
            ) && (
              <div className="repro-next">
                📅 <strong>Próximo acompanhamento:</strong>{' '}
                existe pelo menos um procedimento agendado para
                esta vaca.
              </div>
            )}
          </section>
        )}

        <section className="repro-section">
          <div className="repro-section-head">
            <div>
              <h3 className="repro-section-title">
                Vacas em acompanhamento
              </h3>

              <span className="repro-section-description">
                {sortedCows.length} animal(is) encontrado(s).
                Clique no card para abrir o histórico.
              </span>
            </div>

            <input
              className="repro-field repro-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔎 Buscar nome, ID ou raça"
            />
          </div>

          {sortedCows.length === 0 ? (
            <div className="repro-empty">
              <span className="repro-empty-icon">🐄</span>
              Nenhum animal encontrado.
            </div>
          ) : (
            <div className="repro-cow-grid">
              {sortedCows.map(cow => (
                <div
                  key={cow.id}
                  className={`repro-cow-card ${
                    selected === cow.id ? 'selected' : ''
                  }`}
                  onClick={() => selectCow(cow.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      selectCow(cow.id)
                    }
                  }}
                >
                  <div className="repro-card-top">
                    <div className="repro-avatar">
                      {getInitials(cow.nome)}
                    </div>

                    <div>
                      <div className="repro-card-name">
                        {cow.nome}
                      </div>

                      <div className="repro-card-id">
                        Brinco/ID #{cow.id}
                      </div>
                    </div>
                  </div>

                  <div className="repro-card-grid">
                    <div className="repro-card-stat">
                      <span>Raça</span>
                      <strong>
                        {cow.raca || 'Não informada'}
                      </strong>
                    </div>

                    <div className="repro-card-stat">
                      <span>Lactação</span>
                      <strong>
                        {cow.lactacao
                          ? `${cow.lactacao}ª`
                          : '-'}
                      </strong>
                    </div>
                  </div>

                  <div className="repro-card-footer">
                    <span>Produção diária</span>
                    <strong>{cow.litros} L</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="repro-section">
          <div className="repro-section-head">
            <div>
              <h3 className="repro-section-title">
                Próximos procedimentos
              </h3>

              <span className="repro-section-description">
                {pendingAppointments} pendente(s) ·{' '}
                {completedAppointments} realizado(s)
              </span>
            </div>

            <select
              className="repro-field"
              style={{ width: 170 }}
              value={appointmentFilter}
              onChange={e =>
                setAppointmentFilter(e.target.value)
              }
            >
              <option value="todos">Todos</option>
              <option value="Agendado">Agendados</option>
              <option value="Realizado">Realizados</option>
            </select>
          </div>

          <div className="repro-table-wrap">
            <table className="repro-table">
              <thead>
                <tr>
                  <th>Animal</th>
                  <th>Procedimento</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Observação</th>
                  <th style={{ textAlign: 'right' }}>
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedAppointments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="repro-empty">
                      <span className="repro-empty-icon">
                        📅
                      </span>
                      Nenhum procedimento encontrado.
                    </td>
                  </tr>
                )}

                {sortedAppointments.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="repro-animal">
                        <div className="repro-avatar">
                          {getInitials(item.animal)}
                        </div>

                        <div>
                          <span className="repro-animal-name">
                            {item.animal}
                          </span>

                          <span className="repro-animal-meta">
                            ID {item.animalId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="repro-type">
                        {item.tipo}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {formatDate(item.data)}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`repro-status ${
                          item.status === 'Realizado'
                            ? 'realizado'
                            : 'agendado'
                        }`}
                      >
                        {item.status || 'Agendado'}
                      </span>
                    </td>

                    <td>
                      <span
                        style={{
                          color: '#6f6a61',
                          fontSize: 11,
                        }}
                      >
                        {item.observacao}
                      </span>
                    </td>

                    <td>
                      <div className="repro-action-group">
                        {item.status !== 'Realizado' && (
                          <button
                            type="button"
                            className="repro-complete-btn"
                            onClick={() =>
                              completeAppointment(item.id)
                            }
                          >
                            Concluir
                          </button>
                        )}

                        <button
                          type="button"
                          className="repro-remove-btn"
                          onClick={() =>
                            removeAppointment(item.id)
                          }
                        >
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Card>
  )
}
