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
  const [selectedCategory, setSelectedCategory] =
    useState('Em lactação')

  const [selectedCow, setSelectedCow] =
    useState<Cow | null>(null)

  const [search, setSearch] = useState('')

  /*
   * HISTÓRICO DE EXEMPLO
   *
   * Depois podemos substituir isso
   * pelos dados vindos do Supabase.
   */
  const history: Record<string, HistoryItem[]> = {
    '1': [
      {
        id: 1,
        tipo: 'Vacina',
        data: '10/08/2026',
        periodo: 'Anual',
        descricao: 'Vacina preventiva aplicada.',
        status: 'Concluído',
      },
      {
        id: 2,
        tipo: 'Reprodução',
        data: '15/08/2026',
        periodo: 'IATF',
        descricao: 'Inseminação artificial realizada.',
        status: 'Concluído',
      },
      {
        id: 3,
        tipo: 'Lactação',
        data: '01/07/2026',
        periodo: 'Atual',
        descricao: 'Início do período de lactação.',
        status: 'Concluído',
      },
      {
        id: 4,
        tipo: 'Tratamento',
        data: '20/08/2026',
        periodo: '5 dias',
        descricao: 'Tratamento preventivo registrado.',
        status: 'Concluído',
      },
      {
        id: 5,
        tipo: 'Vacina',
        data: '10/02/2027',
        periodo: 'Próxima dose',
        descricao: 'Próxima vacinação programada.',
        status: 'Programado',
      },
    ],

    '2': [
      {
        id: 1,
        tipo: 'Vacina',
        data: '12/08/2026',
        periodo: 'Anual',
        descricao: 'Vacinação preventiva.',
        status: 'Concluído',
      },
      {
        id: 2,
        tipo: 'Lactação',
        data: '05/06/2026',
        periodo: 'Atual',
        descricao: 'Período de lactação registrado.',
        status: 'Concluído',
      },
      {
        id: 3,
        tipo: 'Reprodução',
        data: '25/08/2026',
        periodo: 'Diagnóstico',
        descricao: 'Diagnóstico de gestação programado.',
        status: 'Programado',
      },
    ],
  }

  const summary = [
    {
      label: 'Em lactação',
      value:
        data?.find(
          d => d.name === 'Em lactação'
        )?.value ?? 0,
      detail: 'produção ativa',
    },
    {
      label: 'Secas',
      value:
        data?.find(
          d => d.name === 'Secas'
        )?.value ?? 0,
      detail: 'em recuperação',
    },
    {
      label: 'Novilhas',
      value:
        data?.find(
          d => d.name === 'Novilhas'
        )?.value ?? 0,
      detail: 'pendentes',
    },
    {
      label: 'Bezerras',
      value:
        data?.find(
          d => d.name === 'Bezerras'
        )?.value ?? 0,
      detail: 'crescimento',
    },
  ]

  /*
   * FILTRO + ORDEM ALFABÉTICA
   */
  const selectedCows = useMemo(() => {
    return (cows ?? [])
      .filter(
        cow =>
          cow.categoria ===
          selectedCategory
      )
      .filter(cow => {
        const text =
          search.toLowerCase()

        return (
          cow.nome
            .toLowerCase()
            .includes(text) ||
          cow.id
            .toLowerCase()
            .includes(text)
        )
      })
      .sort((a, b) =>
        a.nome.localeCompare(
          b.nome,
          'pt-BR'
        )
      )
  }, [
    cows,
    selectedCategory,
    search,
  ])

  function getDescription(
    cow: Cow
  ) {
    if (
      selectedCategory ===
      'Em lactação'
    ) {
      return `Produção ativa de ${cow.litros} L/dia e na ${cow.lactacao ?? 0}ª lactação.`
    }

    if (
      selectedCategory ===
      'Secas'
    ) {
      return 'Em período de recuperação, sem produção registrada no momento.'
    }

    if (
      selectedCategory ===
      'Novilhas'
    ) {
      return 'Animal em desenvolvimento e acompanhamento.'
    }

    return 'Animal jovem em fase de crescimento.'
  }

  function getHistory(
    cow: Cow
  ) {
    return (
      history[cow.id] ?? [
        {
          id: 999,
          tipo: 'Vacina',
          data: '-',
          periodo: '-',
          descricao:
            'Nenhum histórico registrado.',
          status: 'Atenção',
        },
      ]
    )
  }

  return (
    <Card>

      {/* CSS DA PÁGINA */}

      <style>{`

        .herd-search {
          width: 100%;
          max-width: 300px;
          padding: 11px 14px;
          border: 1px solid #ded9d0;
          border-radius: 10px;
          background: #fff;
          outline: none;
          font-size: 13px;
        }

        .herd-search:focus {
          border-color: #397344;
          box-shadow:
            0 0 0 3px
            rgba(57,115,68,.12);
        }

        .herd-table-container {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #e8e4dc;
          border-radius: 14px;
          background: white;
        }

        .herd-table {
          width: 100%;
          min-width: 850px;
          border-collapse: collapse;
        }

        .herd-table th {
          padding: 15px;
          text-align: left;
          background: #f7f5f0;
          color: #726c62;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .5px;
          border-bottom: 1px solid #e5e0d8;
        }

        .herd-table td {
          padding: 14px 15px;
          border-bottom: 1px solid #eeeae3;
          font-size: 13px;
        }

        .herd-table tbody tr:hover {
          background: #faf9f6;
        }

        .herd-table tbody tr:last-child td {
          border-bottom: none;
        }

        .animal-table-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .animal-table-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eaf2eb;
          color: #397344;
          font-weight: 700;
        }

        .animal-table-name {
          font-weight: 700;
          color: #2b2925;
        }

        .animal-table-id {
          display: block;
          color: #8b857b;
          font-size: 11px;
          margin-top: 2px;
        }

        .production-number {
          color: #397344;
          font-weight: 700;
        }

        .history-button {
          border: 1px solid #d9e5db;
          background: #f3f8f4;
          color: #397344;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          transition: .2s;
        }

        .history-button:hover {
          background: #e5f0e7;
          transform: translateY(-1px);
        }

        .history-modal-background {
          position: fixed;
          inset: 0;
          background: rgba(30, 28, 24, .55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
        }

        .history-modal {
          width: 100%;
          max-width: 950px;
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 18px;
          box-shadow:
            0 25px 70px
            rgba(0,0,0,.2);
          padding: 24px;
        }

        .history-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 20px;
        }

        .history-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .history-avatar {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eaf2eb;
          color: #397344;
          font-weight: 800;
          font-size: 17px;
        }

        .close-history {
          border: none;
          background: #f3f1ed;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 17px;
        }

        .history-summary {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .history-summary-card {
          padding: 14px;
          background: #f8f7f3;
          border-radius: 11px;
        }

        .history-summary-card span {
          display: block;
          color: #817a70;
          font-size: 11px;
          margin-bottom: 5px;
        }

        .history-summary-card strong {
          color: #2d2a25;
          font-size: 15px;
        }

        .history-table-container {
          overflow-x: auto;
          border: 1px solid #e8e4dc;
          border-radius: 12px;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }

        .history-table th {
          background: #f7f5f0;
          color: #726c62;
          font-size: 11px;
          text-transform: uppercase;
          text-align: left;
          padding: 13px;
        }

        .history-table td {
          padding: 14px 13px;
          border-top: 1px solid #eeeae3;
          font-size: 13px;
        }

        .history-type {
          font-weight: 700;
        }

        .status-history {
          display: inline-flex;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
        }

        .status-concluido {
          background: #e8f4ea;
          color: #32713d;
        }

        .status-atencao {
          background: #fff2d8;
          color: #9a6a12;
        }

        .status-programado {
          background: #e8f0fb;
          color: #416b9f;
        }

        @media(max-width: 700px) {

          .history-summary {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

      `}</style>

      {/* CABEÇALHO */}

      <div className="section-header">

        <div>
          <div className="eyebrow">
            Rebanho
          </div>

          <h2>
            Gestão do rebanho
          </h2>
        </div>

        <span className="status-pill success">
          +8% no mês
        </span>

      </div>

      <p className="muted">
        Visão geral do rebanho e histórico individual dos animais.
      </p>


      {/* INDICADORES */}

      <div className="metric-grid">

        {summary.map(item => (

          <button
            key={item.label}
            type="button"
            className={`metric-card ${
              selectedCategory ===
              item.label
                ? 'metric-card-selected'
                : ''
            }`}
            onClick={() =>
              setSelectedCategory(
                item.label
              )
            }
          >

            <span className="label">
              {item.label}
            </span>

            <strong>
              {item.value}
            </strong>

            <small>
              {item.detail}
            </small>

          </button>

        ))}

      </div>


      {/* RESUMO */}

      <div
        className="sub-panel"
        style={{
          marginTop: 20,
        }}
      >

        <h3>
          Resumo por categoria
        </h3>

        <ul className="list-stack">

          {(data ?? []).map(d => (

            <li key={d.name}>

              <span>
                {d.name}
              </span>

              <strong>
                {d.value}
              </strong>

            </li>

          ))}

        </ul>

      </div>


      {/* TABELA DE ANIMAIS */}

      <div
        className="sub-panel"
        style={{
          marginTop: 20,
        }}
      >

        <div
          className="section-header"
          style={{
            marginBottom: 15,
          }}
        >

          <div>

            <h3>
              Animais: {selectedCategory}
            </h3>

            <span
              className="status-pill info"
            >
              {selectedCows.length}{' '}
              animal(is)
            </span>

          </div>

          <input
            className="herd-search"
            value={search}
            onChange={e =>
              setSearch(
                e.target.value
              )
            }
            placeholder="🔎 Buscar animal ou ID..."
          />

        </div>


        <div className="herd-table-container">

          <table className="herd-table">

            <thead>

              <tr>

                <th>
                  Animal
                </th>

                <th>
                  ID
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

                <th>
                  Histórico
                </th>

              </tr>

            </thead>

            <tbody>

              {selectedCows.map(cow => (

                <tr key={cow.id}>

                  <td>

                    <div className="animal-table-info">

                      <div
                        className="animal-table-avatar"
                      >

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

                        <div className="animal-table-name">
                          {cow.nome}
                        </div>

                        <span className="animal-table-id">
                          Animal cadastrado
                        </span>

                      </div>

                    </div>

                  </td>


                  <td>

                    <strong>
                      #{cow.id}
                    </strong>

                  </td>


                  <td>

                    {cow.raca ??
                      'Não informado'}

                  </td>


                  <td>

                    {cow.lactacao
                      ? `${cow.lactacao}ª`
                      : '-'}

                  </td>


                  <td>

                    <span className="production-number">

                      {cow.litros} L/dia

                    </span>

                  </td>


                  <td>

                    <button
                      className="history-button"
                      onClick={() =>
                        setSelectedCow(
                          cow
                        )
                      }
                    >
                      Ver histórico
                    </button>

                  </td>

                </tr>

              ))}


              {!selectedCows.length && (

                <tr>

                  <td
                    colSpan={6}
                    style={{
                      textAlign:
                        'center',
                      padding: 40,
                    }}
                  >

                    <span className="muted">
                      Nenhum animal encontrado nesta categoria.
                    </span>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* DESCRIÇÃO */}

      {selectedCows.length > 0 && (

        <div
          className="sub-panel"
          style={{
            marginTop: 20,
          }}
        >

          <h3>
            Informações da categoria
          </h3>

          <p className="muted">
            Os animais estão organizados
            alfabeticamente. Utilize o botão
            <strong> Ver histórico </strong>
            para consultar os registros
            individuais de cada animal.
          </p>

        </div>

      )}


      {/* MODAL DO HISTÓRICO */}

      {selectedCow && (

        <div
          className="history-modal-background"
          onClick={() =>
            setSelectedCow(null)
          }
        >

          <div
            className="history-modal"
            onClick={e =>
              e.stopPropagation()
            }
          >

            <div
              className="history-modal-header"
            >

              <div className="history-title">

                <div className="history-avatar">

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

                  <h2
                    style={{
                      margin: 0,
                    }}
                  >
                    {selectedCow.nome}
                  </h2>

                  <span className="muted">

                    ID #{selectedCow.id}
                    {' · '}
                    {selectedCow.raca ??
                      'Raça não informada'}

                  </span>

                </div>

              </div>


              <button
                className="close-history"
                onClick={() =>
                  setSelectedCow(null)
                }
              >
                ×
              </button>

            </div>


            {/* RESUMO DO ANIMAL */}

            <div className="history-summary">

              <div className="history-summary-card">

                <span>
                  Categoria
                </span>

                <strong>
                  {selectedCow.categoria ??
                    '-'}
                </strong>

              </div>


              <div className="history-summary-card">

                <span>
                  Lactação
                </span>

                <strong>
                  {selectedCow.lactacao
                    ? `${selectedCow.lactacao}ª`
                    : '-'}
                </strong>

              </div>


              <div className="history-summary-card">

                <span>
                  Produção
                </span>

                <strong>
                  {selectedCow.litros} L/dia
                </strong>

              </div>


              <div className="history-summary-card">

                <span>
                  Registros
                </span>

                <strong>
                  {
                    getHistory(
                      selectedCow
                    ).length
                  }
                </strong>

              </div>

            </div>


            {/* HISTÓRICO */}

            <h3>
              Histórico do animal
            </h3>

            <div className="history-table-container">

              <table className="history-table">

                <thead>

                  <tr>

                    <th>
                      Tipo
                    </th>

                    <th>
                      Data
                    </th>

                    <th>
                      Período
                    </th>

                    <th>
                      Descrição
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {getHistory(
                    selectedCow
                  ).map(item => (

                    <tr
                      key={item.id}
                    >

                      <td>

                        <span className="history-type">

                          {item.tipo}

                        </span>

                      </td>

                      <td>
                        {item.data}
                      </td>

                      <td>
                        {item.periodo ??
                          '-'}
                      </td>

                      <td>
                        {item.descricao}
                      </td>

                      <td>

                        <span
                          className={`status-history ${
                            item.status ===
                            'Concluído'
                              ? 'status-concluido'
                              : item.status ===
                                'Atenção'
                              ? 'status-atencao'
                              : 'status-programado'
                          }`}
                        >

                          {item.status}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}

    </Card>
  )
}