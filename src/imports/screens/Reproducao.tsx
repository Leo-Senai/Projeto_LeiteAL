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
        animalId: '1',
        animal: 'Estrela',
        tipo: 'Diagnóstico',
        data: '2026-08-25',
        observacao: 'Avaliação de gestação',
      },
      {
        id: 2,
        animalId: '2',
        animal: 'Flor',
        tipo: 'Inseminação',
        data: '2026-08-27',
        observacao: 'Inseminação programada',
      },
      {
        id: 3,
        animalId: '3',
        animal: 'Luna',
        tipo: 'Diagnóstico',
        data: '2026-08-29',
        observacao: 'Acompanhamento reprodutivo',
      },
    ])

  // ==========================================
  // VACAS FILTRADAS E ORDENADAS
  // ==========================================

  const sortedCows = useMemo(() => {

    return [...cows]

      .filter(cow => {

        const searchText =
          search.toLowerCase()

        return (

          cow.nome
            .toLowerCase()
            .includes(searchText)

          ||

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


  // ==========================================
  // AGENDAMENTOS POR DATA
  // ==========================================

  const sortedAppointments =
    useMemo(() => {

      return [...appointments]

        .sort((a, b) =>

          new Date(
            a.data
          ).getTime()

          -

          new Date(
            b.data
          ).getTime()

        )

    }, [appointments])


  // ==========================================
  // FORMATAR DATA
  // ==========================================

  function formatDate(
    dateString: string
  ) {

    if (!dateString)
      return '-'

    return new Date(
      `${dateString}T12:00:00`
    ).toLocaleDateString(
      'pt-BR'
    )

  }


  // ==========================================
  // SELECIONAR VACA
  // ==========================================

  function selectCow(
    cowId: string
  ) {

    setSelected(cowId)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

  }


  // ==========================================
  // AGENDAR
  // ==========================================

  function schedule() {

    if (!selected) {

      alert(
        'Selecione uma vaca.'
      )

      return
    }


    if (!date) {

      alert(
        'Informe a data.'
      )

      return
    }


    const selectedCow =
      cows.find(
        cow =>
          cow.id === selected
      )


    if (!selectedCow) {

      alert(
        'Animal não encontrado.'
      )

      return
    }


    const newAppointment: Appointment = {

      id: Date.now(),

      animalId:
        selectedCow.id,

      animal:
        selectedCow.nome,

      tipo,

      data:
        date,

      observacao:
        note ||
        'Sem observação',

    }


    setAppointments(prev => [

      newAppointment,

      ...prev,

    ])


    setSelected('')
    setDate('')
    setNote('')
    setTipo('Inseminação')


    alert(
      'Procedimento agendado com sucesso!'
    )

  }


  // ==========================================
  // REMOVER
  // ==========================================

  function removeAppointment(
    id: number
  ) {

    const confirmDelete =
      window.confirm(
        'Deseja remover este procedimento?'
      )

    if (!confirmDelete)
      return


    setAppointments(prev =>

      prev.filter(
        appointment =>
          appointment.id !== id
      )

    )

  }


  // ==========================================
  // MÉTRICAS
  // ==========================================

  const totalCows =
    cows.length


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


  const nextAppointment =
    sortedAppointments[0]


  return (

    <Card>

      {/* ================================= */}
      {/* ESTILOS */}
      {/* ================================= */}

      <style>{`

        .reproducao-page {
          width: 100%;
        }


        /* CABEÇALHO */

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


        /* BUSCA */

        .search-input {
          max-width: 280px;
        }


        /* TABELA */

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


        /* CABEÇALHO DA TABELA */

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


        /* LINHAS */

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


        /* ANIMAL */

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


        /* ID */

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


        /* RAÇA */

        .race-text {

          font-size: 13px;

          color: #4f4a43;

        }


        /* LACTAÇÃO */

        .lactation-badge {

          display: inline-flex;

          padding: 6px 10px;

          border-radius: 8px;

          background: #eef6ef;

          color: #397344;

          font-size: 12px;

          font-weight: 600;

        }


        /* PRODUÇÃO */

        .production-cell strong {

          display: block;

          color: #2f6b3b;

          font-size: 16px;

        }


        .production-cell span {

          font-size: 11px;

          color: #8a847a;

        }


        /* PROCEDIMENTO */

        .procedure-badge {

          display: inline-flex;

          padding: 7px 11px;

          border-radius: 8px;

          background: #eef4ff;

          color: #4169a1;

          font-size: 12px;

          font-weight: 600;

        }


        /* AÇÕES */

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


        /* TABELA VAZIA */

        .empty-table {

          text-align:
            center;

          padding:
            45px !important;

          color:
            #8a847a;

          font-size:
            14px;

        }


        /* RESPONSIVO */

        @media (
          max-width: 768px
        ) {

          .table-header {

            flex-direction:
              column;

            align-items:
              stretch;

          }


          .search-input {

            max-width:
              100%;

          }


          .modern-table {

            min-width:
              850px;

          }


          .table-container {

            border-radius:
              12px;

          }

        }

      `}</style>


      <div className="reproducao-page">


        {/* CABEÇALHO */}

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

            {appointments.length}
            {' '}
            pendentes

          </span>

        </div>


        <p className="muted">

          Controle reprodutivo,
          inseminações,
          diagnósticos e
          acompanhamento das vacas.

        </p>


        {/* MÉTRICAS */}

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
              exames programados
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


        {/* FORMULÁRIO */}

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


              {sortedCows.map(
                cow => (

                  <option
                    key={cow.id}
                    value={cow.id}
                  >

                    {cow.nome}
                    {' · '}
                    ID {cow.id}

                  </option>

                )
              )}

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


        {/* TABELA DE VACAS */}

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
                animal(is) encontrado(s)

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

                      🐄 Nenhum animal encontrado.

                    </td>

                  </tr>

                )}


                {sortedCows.map(
                  cow => (

                    <tr key={cow.id}>


                      <td>

                        <div className="animal-cell">

                          <div className="animal-avatar">

                            {cow.nome
                              .split(' ')
                              .map(p => p[0])
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
                          className="select-cow-btn"
                          onClick={() =>
                            selectCow(
                              cow.id
                            )
                          }
                        >

                          Selecionar

                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* PROCEDIMENTOS */}

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
                      colSpan={5}
                      className="empty-table"
                    >

                      Nenhum procedimento agendado.

                    </td>

                  </tr>

                )}


                {sortedAppointments.map(
                  appointment => (

                    <tr
                      key={appointment.id}
                    >


                      <td>

                        <div className="animal-cell">

                          <div className="animal-avatar">

                            {appointment.animal
                              .split(' ')
                              .map(p => p[0])
                              .join('')
                              .slice(0, 2)
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

                        <span className="race-text">

                          {
                            appointment.observacao
                          }

                        </span>

                      </td>


                      <td className="action-column">

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