import { useMemo, useState } from 'react'
import Card from '../components/Card'

type Cow = {
  id: string
  nome: string
  litros: number
  raca?: string
  lactacao?: number
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

  // =========================================================
  // VACAS FILTRADAS E ORDENADAS
  // =========================================================

  const sortedCows = useMemo(() => {
    return [...cows]
      .filter(cow => {
        const searchText = search.toLowerCase()

        return (
          cow.nome
            .toLowerCase()
            .includes(searchText) ||
          cow.id
            .toLowerCase()
            .includes(searchText)
        )
      })
      .sort((a, b) =>
        a.nome.localeCompare(
          b.nome,
          'pt-BR'
        )
      )
  }, [cows, search])

  // =========================================================
  // AGENDAMENTOS ORDENADOS
  // =========================================================

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort(
      (a, b) =>
        new Date(a.data).getTime() -
        new Date(b.data).getTime()
    )
  }, [appointments])

  // =========================================================
  // VACA SELECIONADA
  // =========================================================

  const selectedCow = useMemo(() => {
    return cows.find(
      cow => cow.id === selected
    )
  }, [cows, selected])

  // =========================================================
  // HISTÓRICO DA VACA SELECIONADA
  // =========================================================

  const selectedCowHistory = useMemo(() => {
    if (!selected) return []

    return [...appointments]
      .filter(
        appointment =>
          appointment.animalId === selected
      )
      .sort(
        (a, b) =>
          new Date(b.data).getTime() -
          new Date(a.data).getTime()
      )
  }, [appointments, selected])

  // =========================================================
  // FORMATAR DATA
  // =========================================================

  function formatDate(dateString: string) {
    if (!dateString) return '-'

    return new Date(
      `${dateString}T12:00:00`
    ).toLocaleDateString('pt-BR')
  }

  // =========================================================
  // SELECIONAR / DESELECIONAR VACA
  // =========================================================

  function selectCow(cowId: string) {
    if (selected === cowId) {
      setSelected('')
      return
    }

    setSelected(cowId)

    setTimeout(() => {
      const element =
        document.getElementById(
          'historico-reprodutivo'
        )

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }, 100)
  }

  // =========================================================
  // AGENDAR PROCEDIMENTO
  // =========================================================

  function schedule() {
    if (!selected) {
      alert('Selecione uma vaca.')
      return
    }

    if (!date) {
      alert('Informe a data.')
      return
    }

    const cow = cows.find(
      item => item.id === selected
    )

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
      observacao:
        note || 'Sem observação',
      status: 'Agendado',
    }

    setAppointments(prev => [
      ...prev,
      newAppointment,
    ])

    setDate('')
    setNote('')
    setTipo('Inseminação')

    alert(
      'Procedimento agendado com sucesso!'
    )
  }

  // =========================================================
  // REMOVER PROCEDIMENTO
  // =========================================================

  function removeAppointment(id: number) {
    const confirmDelete =
      window.confirm(
        'Deseja remover este procedimento?'
      )

    if (!confirmDelete) return

    setAppointments(prev =>
      prev.filter(
        appointment =>
          appointment.id !== id
      )
    )
  }

  // =========================================================
  // CONCLUIR PROCEDIMENTO
  // =========================================================

  function completeAppointment(id: number) {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === id
          ? {
              ...appointment,
              status: 'Realizado',
            }
          : appointment
      )
    )
  }

  // =========================================================
  // MÉTRICAS
  // =========================================================

  const totalCows = cows.length

  const inseminations =
    appointments.filter(
      appointment =>
        appointment.tipo ===
        'Inseminação'
    ).length

  const diagnostics =
    appointments.filter(
      appointment =>
        appointment.tipo ===
        'Diagnóstico'
    ).length

  const pregnancies =
    appointments.filter(
      appointment =>
        appointment.tipo ===
        'Gestação'
    ).length

  const nextAppointment =
    sortedAppointments.find(
      appointment =>
        appointment.status !==
        'Realizado'
    )

  // =========================================================
  // CONTADORES DA VACA
  // =========================================================

  const historyInseminations =
    selectedCowHistory.filter(
      item =>
        item.tipo === 'Inseminação'
    ).length

  const historyDiagnostics =
    selectedCowHistory.filter(
      item =>
        item.tipo === 'Diagnóstico'
    ).length

  const historyPregnancies =
    selectedCowHistory.filter(
      item =>
        item.tipo === 'Gestação'
    ).length

  const historyBirths =
    selectedCowHistory.filter(
      item =>
        item.tipo === 'Parto'
    ).length

  return (
    <Card>
      <style>{`
        .reproducao-page {
          width: 100%;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 18px;
        }

        .table-header h3 {
          margin: 0;
        }

        .table-subtitle {
          display: block;
          margin-top: 5px;
          font-size: 12px;
          color: #8a847a;
        }

        .search-input {
          max-width: 280px;
        }

        .table-container {
          width: 100%;
          overflow-x: auto;
          border-radius: 16px;
          border: 1px solid #e8e4dc;
          background: #ffffff;
          box-shadow:
            0 8px 24px
            rgba(0, 0, 0, 0.04);
        }

        .modern-table {
          width: 100%;
          min-width: 850px;
          border-collapse: separate;
          border-spacing: 0;
        }

        .modern-table thead {
          background:
            linear-gradient(
              90deg,
              #f8f6f1,
              #f3f0e9
            );
        }

        .modern-table th {
          padding: 16px 18px;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #726c62;
          border-bottom:
            1px solid #e8e4dc;
        }

        .modern-table td {
          padding: 18px;
          border-bottom:
            1px solid #f0ede7;
          vertical-align: middle;
        }

        .modern-table tbody tr {
          transition:
            all 0.2s ease;
        }

        .modern-table tbody tr:hover {
          background: #faf9f6;
        }

        .modern-table tbody tr:last-child td {
          border-bottom: none;
        }

        .selected-row {
          background: #f0f7f1 !important;
        }

        .animal-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .animal-avatar {
          width: 42px;
          height: 42px;
          min-width: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              #4f8a5b,
              #2f6b3b
            );
          color: white;
          font-size: 13px;
          font-weight: 700;
          box-shadow:
            0 4px 10px
            rgba(47, 107, 59, 0.2);
        }

        .animal-cell strong {
          display: block;
          color: #2b2925;
          font-size: 14px;
        }

        .animal-cell span {
          display: block;
          margin-top: 3px;
          font-size: 11px;
          color: #8a847a;
        }

        .id-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 8px;
          background: #f2f1ed;
          color: #625d55;
          font-size: 12px;
          font-weight: 600;
        }

        .race-text {
          font-size: 13px;
          color: #4f4a43;
        }

        .lactation-badge {
          display: inline-flex;
          padding: 6px 10px;
          border-radius: 8px;
          background: #eef6ef;
          color: #397344;
          font-size: 12px;
          font-weight: 600;
        }

        .production-cell strong {
          display: block;
          color: #2f6b3b;
          font-size: 16px;
        }

        .production-cell span {
          font-size: 11px;
          color: #8a847a;
        }

        .procedure-badge {
          display: inline-flex;
          padding: 7px 11px;
          border-radius: 8px;
          background: #eef4ff;
          color: #4169a1;
          font-size: 12px;
          font-weight: 600;
        }

        .status-realizado {
          display: inline-flex;
          padding: 6px 10px;
          border-radius: 8px;
          background: #eaf6ed;
          color: #397344;
          font-size: 11px;
          font-weight: 700;
        }

        .status-agendado {
          display: inline-flex;
          padding: 6px 10px;
          border-radius: 8px;
          background: #fff5e6;
          color: #a66a18;
          font-size: 11px;
          font-weight: 700;
        }

        .action-column {
          text-align: right !important;
        }

        .select-cow-btn {
          border: none;
          padding: 9px 16px;
          border-radius: 9px;
          background:
            linear-gradient(
              135deg,
              #3d7a49,
              #2f653b
            );
          color: white;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition:
            all 0.2s ease;
          box-shadow:
            0 4px 10px
            rgba(47, 107, 59, 0.2);
        }

        .select-cow-btn:hover {
          transform:
            translateY(-2px);
        }

        .select-cow-btn.selected {
          background: #c98b32;
        }

        .remove-btn {
          border:
            1px solid #f1caca;
          background:
            #fff7f7;
          color:
            #b94b4b;
          padding:
            8px 14px;
          border-radius:
            8px;
          font-size:
            12px;
          font-weight:
            600;
          cursor:
            pointer;
        }

        .remove-btn:hover {
          background:
            #ffeaea;
        }

        .complete-btn {
          border: 1px solid #cce3d0;
          background: #f1faf3;
          color: #397344;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          margin-right: 6px;
        }

        .complete-btn:hover {
          background: #e4f4e7;
        }

        .empty-table {
          text-align: center;
          padding: 45px !important;
          color: #8a847a;
          font-size: 14px;
        }

        /* HISTÓRICO */

        .history-panel {
          margin-top: 20px;
          padding: 24px;
          border-radius: 18px;
          border: 1px solid #dce9df;
          background:
            linear-gradient(
              135deg,
              #f7fbf7,
              #ffffff
            );
          box-shadow:
            0 10px 30px
            rgba(42, 91, 52, 0.08);
          scroll-margin-top: 20px;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .history-title {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .history-big-avatar {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              #3f7b4b,
              #285d34
            );
          color: white;
          font-weight: 800;
          font-size: 17px;
        }

        .history-title h3 {
          margin: 0;
          color: #263126;
        }

        .history-title p {
          margin: 5px 0 0;
          color: #77736b;
          font-size: 13px;
        }

        .close-history {
          border: 1px solid #ddd8ce;
          background: white;
          color: #625d55;
          border-radius: 9px;
          padding: 8px 13px;
          cursor: pointer;
          font-weight: 600;
        }

        .history-metrics {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 22px;
        }

        .history-metric {
          padding: 15px;
          background: white;
          border: 1px solid #e8e5df;
          border-radius: 12px;
        }

        .history-metric span {
          display: block;
          font-size: 11px;
          color: #858078;
          text-transform: uppercase;
          font-weight: 700;
        }

        .history-metric strong {
          display: block;
          margin-top: 7px;
          font-size: 22px;
          color: #2f6b3b;
        }

        .history-section-title {
          margin: 0 0 12px;
          color: #302e29;
          font-size: 15px;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-item {
          display: grid;
          grid-template-columns:
            105px 150px 1fr auto;
          align-items: center;
          gap: 15px;
          padding: 14px 16px;
          background: white;
          border: 1px solid #ebe8e2;
          border-radius: 11px;
        }

        .history-date {
          font-weight: 700;
          color: #49453e;
          font-size: 13px;
        }

        .history-type {
          display: inline-flex;
          width: fit-content;
          padding: 6px 9px;
          border-radius: 7px;
          background: #eef5ef;
          color: #397344;
          font-size: 11px;
          font-weight: 700;
        }

        .history-note {
          color: #6f6a61;
          font-size: 12px;
        }

        .no-history {
          text-align: center;
          padding: 30px;
          background: white;
          border-radius: 12px;
          border: 1px dashed #d8d4cc;
          color: #888278;
          font-size: 13px;
        }

        .selected-info {
          margin-top: 16px;
          padding: 12px 15px;
          border-radius: 10px;
          background: #edf7ef;
          border: 1px solid #d5e9d9;
          color: #397344;
          font-size: 13px;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .history-metrics {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .history-item {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }

        @media (max-width: 768px) {
          .table-header {
            flex-direction: column;
            align-items: stretch;
          }

          .search-input {
            max-width: 100%;
          }

          .modern-table {
            min-width: 850px;
          }

          .table-container {
            border-radius: 12px;
          }

          .history-header {
            align-items: flex-start;
          }

          .history-metrics {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="reproducao-page">

        {/* ================================================= */}
        {/* CABEÇALHO */}
        {/* ================================================= */}

        <div className="section-header">
          <div>
            <div className="eyebrow">
              Reprodução
            </div>

            <h2>
              Programa reprodutivo
            </h2>
          </div>

          <span className="status-pill info">
            {appointments.filter(
              item =>
                item.status !==
                'Realizado'
            ).length}{' '}
            pendentes
          </span>
        </div>

        <p className="muted">
          Controle reprodutivo,
          inseminações, diagnósticos,
          gestações e acompanhamento
          individual das vacas.
        </p>

        {/* ================================================= */}
        {/* MÉTRICAS */}
        {/* ================================================= */}

        <div className="metric-grid">

          <div className="metric-card">
            <span className="label">
              Vacas cadastradas
            </span>

            <strong>
              {totalCows}
            </strong>

            <small>
              disponíveis para acompanhamento
            </small>
          </div>

          <div className="metric-card">
            <span className="label">
              Inseminações
            </span>

            <strong>
              {inseminations}
            </strong>

            <small>
              procedimentos cadastrados
            </small>
          </div>

          <div className="metric-card">
            <span className="label">
              Diagnósticos
            </span>

            <strong>
              {diagnostics}
            </strong>

            <small>
              exames cadastrados
            </small>
          </div>

          <div className="metric-card">
            <span className="label">
              Próximo procedimento
            </span>

            <strong>
              {nextAppointment
                ? formatDate(
                    nextAppointment.data
                  )
                : '-'}
            </strong>

            <small>
              {nextAppointment
                ? nextAppointment.animal
                : 'Nenhum agendamento'}
            </small>
          </div>

        </div>

        {/* ================================================= */}
        {/* HISTÓRICO DA VACA */}
        {/* ================================================= */}

        {selectedCow && (
          <div
            id="historico-reprodutivo"
            className="history-panel"
          >

            <div className="history-header">

              <div className="history-title">

                <div className="history-big-avatar">
                  {selectedCow.nome
                    .split(' ')
                    .map(
                      p => p[0]
                    )
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div>
                  <h3>
                    Histórico reprodutivo
                  </h3>

                  <p>
                    {selectedCow.nome}
                    {' · '}
                    ID {selectedCow.id}
                    {' · '}
                    {selectedCow.raca ||
                      'Raça não informada'}
                  </p>
                </div>

              </div>

              <button
                className="close-history"
                onClick={() =>
                  setSelected('')
                }
              >
                Fechar
              </button>

            </div>

            {/* INFORMAÇÕES DA VACA */}

            <div className="selected-info">
              🐄{' '}
              <strong>
                {selectedCow.nome}
              </strong>
              {' — '}
              {selectedCow.lactacao
                ? `${selectedCow.lactacao}ª lactação`
                : 'Lactação não informada'}
              {' · '}
              Produção:
              {' '}
              {selectedCow.litros} L/dia
            </div>

            {/* MÉTRICAS DO HISTÓRICO */}

            <div className="history-metrics">

              <div className="history-metric">
                <span>
                  Inseminações
                </span>

                <strong>
                  {historyInseminations}
                </strong>
              </div>

              <div className="history-metric">
                <span>
                  Diagnósticos
                </span>

                <strong>
                  {historyDiagnostics}
                </strong>
              </div>

              <div className="history-metric">
                <span>
                  Gestações
                </span>

                <strong>
                  {historyPregnancies}
                </strong>
              </div>

              <div className="history-metric">
                <span>
                  Partos
                </span>

                <strong>
                  {historyBirths}
                </strong>
              </div>

            </div>

            {/* LISTA DO HISTÓRICO */}

            <h4 className="history-section-title">
              Histórico de procedimentos
            </h4>

            {selectedCowHistory.length === 0 ? (

              <div className="no-history">
                📋 Nenhum procedimento
                reprodutivo registrado
                para esta vaca.
              </div>

            ) : (

              <div className="history-list">

                {selectedCowHistory.map(
                  appointment => (

                    <div
                      key={appointment.id}
                      className="history-item"
                    >

                      <div className="history-date">
                        {formatDate(
                          appointment.data
                        )}
                      </div>

                      <div>
                        <span className="history-type">
                          {appointment.tipo}
                        </span>
                      </div>

                      <div className="history-note">
                        {appointment.observacao}
                      </div>

                      <div>
                        {appointment.status ===
                        'Realizado' ? (
                          <span className="status-realizado">
                            Realizado
                          </span>
                        ) : (
                          <span className="status-agendado">
                            Agendado
                          </span>
                        )}
                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>
        )}

        {/* ================================================= */}
        {/* FORMULÁRIO */}
        {/* ================================================= */}

        <div
          className="sub-panel"
          style={{
            marginTop: 20,
          }}
        >

          <h3>
            Agendar procedimento
          </h3>

          <div
            className="controls"
            style={{
              marginTop: 16,
            }}
          >

            <select
              className="select"
              value={selected}
              onChange={e =>
                setSelected(
                  e.target.value
                )
              }
            >

              <option value="">
                Selecione uma vaca
              </option>

              {sortedCows.map(cow => (

                <option
                  key={cow.id}
                  value={cow.id}
                >
                  {cow.nome}
                  {' · '}
                  ID {cow.id}
                </option>

              ))}

            </select>

            <select
              className="select"
              value={tipo}
              onChange={e =>
                setTipo(
                  e.target.value
                )
              }
            >

              <option>
                Inseminação
              </option>

              <option>
                Diagnóstico
              </option>

              <option>
                Cio
              </option>

              <option>
                Gestação
              </option>

              <option>
                Parto
              </option>

              <option>
                Secagem
              </option>

              <option>
                Outro
              </option>

            </select>

            <input
              className="input"
              type="date"
              value={date}
              onChange={e =>
                setDate(
                  e.target.value
                )
              }
            />

            <input
              className="input"
              value={note}
              onChange={e =>
                setNote(
                  e.target.value
                )
              }
              placeholder="Observação"
            />

            <button
              className="btn btn-primary"
              onClick={schedule}
            >
              Agendar
            </button>

          </div>

        </div>

        {/* ================================================= */}
        {/* TABELA DE VACAS */}
        {/* ================================================= */}

        <div
          className="sub-panel"
          style={{
            marginTop: 20,
          }}
        >

          <div className="table-header">

            <div>

              <h3>
                Vacas em acompanhamento
              </h3>

              <span className="table-subtitle">
                {sortedCows.length}
                {' '}
                animal(is)
                encontrado(s)
              </span>

            </div>

            <input
              className="input search-input"
              value={search}
              onChange={e =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="🔎 Buscar por nome ou ID"
            />

          </div>

          <div className="table-container">

            <table className="modern-table">

              <thead>

                <tr>

                  <th>
                    Animal
                  </th>

                  <th>
                    Identificação
                  </th>

                  <th>
                    Raça
                  </th>

                  <th>
                    Lactação
                  </th>

                  <th>
                    Produção
                  </th>

                  <th className="action-column">
                    Ações
                  </th>

                </tr>

              </thead>

              <tbody>

                {sortedCows.length === 0 && (

                  <tr>

                    <td
                      colSpan={6}
                      className="empty-table"
                    >
                      🐄 Nenhum animal
                      encontrado.
                    </td>

                  </tr>

                )}

                {sortedCows.map(cow => (

                  <tr
                    key={cow.id}
                    className={
                      selected === cow.id
                        ? 'selected-row'
                        : ''
                    }
                  >

                    <td>

                      <div className="animal-cell">

                        <div className="animal-avatar">

                          {cow.nome
                            .split(' ')
                            .map(
                              p => p[0]
                            )
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}

                        </div>

                        <div>

                          <strong>
                            {cow.nome}
                          </strong>

                          <span>
                            Animal cadastrado
                          </span>

                        </div>

                      </div>

                    </td>

                    <td>

                      <span className="id-badge">
                        #{cow.id}
                      </span>

                    </td>

                    <td>

                      <span className="race-text">
                        {cow.raca ||
                          'Não informado'}
                      </span>

                    </td>

                    <td>

                      <span className="lactation-badge">

                        {cow.lactacao
                          ? `${cow.lactacao}ª lactação`
                          : 'Não informado'}

                      </span>

                    </td>

                    <td>

                      <div className="production-cell">

                        <strong>
                          {cow.litros} L
                        </strong>

                        <span>
                          produção diária
                        </span>

                      </div>

                    </td>

                    <td className="action-column">

                      <button
                        className={
                          selected === cow.id
                            ? 'select-cow-btn selected'
                            : 'select-cow-btn'
                        }
                        onClick={() =>
                          selectCow(
                            cow.id
                          )
                        }
                      >

                        {selected === cow.id
                          ? 'Selecionada'
                          : 'Selecionar'}

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* ================================================= */}
        {/* PRÓXIMOS PROCEDIMENTOS */}
        {/* ================================================= */}

        <div
          className="sub-panel"
          style={{
            marginTop: 20,
          }}
        >

          <div className="table-header">

            <div>

              <h3>
                Próximos procedimentos
              </h3>

              <span className="table-subtitle">
                Agendamentos organizados
                por data.
              </span>

            </div>

          </div>

          <div className="table-container">

            <table className="modern-table">

              <thead>

                <tr>

                  <th>
                    Animal
                  </th>

                  <th>
                    Procedimento
                  </th>

                  <th>
                    Data
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Observação
                  </th>

                  <th className="action-column">
                    Ações
                  </th>

                </tr>

              </thead>

              <tbody>

                {sortedAppointments.length === 0 && (

                  <tr>

                    <td
                      colSpan={6}
                      className="empty-table"
                    >
                      Nenhum procedimento
                      cadastrado.
                    </td>

                  </tr>

                )}

                {sortedAppointments.map(
                  appointment => (

                    <tr
                      key={
                        appointment.id
                      }
                    >

                      <td>

                        <div className="animal-cell">

                          <div className="animal-avatar">

                            {appointment.animal
                              .split(' ')
                              .map(
                                p => p[0]
                              )
                              .join('')
                              .slice(
                                0,
                                2
                              )
                              .toUpperCase()}

                          </div>

                          <strong>
                            {appointment.animal}
                          </strong>

                        </div>

                      </td>

                      <td>

                        <span className="procedure-badge">
                          {appointment.tipo}
                        </span>

                      </td>

                      <td>

                        <strong>
                          {formatDate(
                            appointment.data
                          )}
                        </strong>

                      </td>

                      <td>

                        {appointment.status ===
                        'Realizado' ? (

                          <span className="status-realizado">
                            Realizado
                          </span>

                        ) : (

                          <span className="status-agendado">
                            Agendado
                          </span>

                        )}

                      </td>

                      <td>

                        <span className="race-text">
                          {
                            appointment.observacao
                          }
                        </span>

                      </td>

                      <td className="action-column">

                        {appointment.status !==
                          'Realizado' && (

                          <button
                            className="complete-btn"
                            onClick={() =>
                              completeAppointment(
                                appointment.id
                              )
                            }
                          >
                            Concluir
                          </button>

                        )}

                        <button
                          className="remove-btn"
                          onClick={() =>
                            removeAppointment(
                              appointment.id
                            )
                          }
                        >
                          Remover
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </Card>
  )
}