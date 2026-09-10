import { useEffect, useMemo, useState } from 'react'

const G = '#1b5e35'
const G2 = '#154d2b'
const GL = '#e6f0ea'
const AM = '#d48b2a'
const CR = '#f5f0e8'
const BORDER = '#e0ddd7'
const MUTED = '#7a7568'
const TEXT = '#1a1a14'
const WHITE = '#ffffff'
const RED = '#c0392b'
const BLUE = '#2563eb'

type Cow = {
  id: string
  nome: string
  litros: number
  raca?: string
  lactacao?: number
  tendencia?: string
  categoria?: string
}

type Vaccine = {
  id: string
  animalId: string
  nome: string
  dataAplicacao: string
  proximaAplicacao: string
  observacao: string
}

type CareRecord = {
  id: string
  animalId: string
  tipo: string
  data: string
  descricao: string
  status: string
  custo?: number
}

type SanidadeProps = {
  cows?: Cow[]
}

const VACINAS_COMUNS = [
  'Febre Aftosa',
  'Brucelose',
  'Clostridioses',
  'Raiva',
  'IBR/BVD',
  'Leptospirose',
  'Carbúnculo',
  'Outra vacina',
]

const CUIDADOS = [
  'Consulta veterinária',
  'Vermifugação',
  'Tratamento',
  'Exame',
  'Mastite',
  'Casqueamento',
  'Aplicação de medicamento',
  'Outro cuidado',
]

function formatarData(data: string) {
  if (!data) return '-'

  const partes = data.split('-')

  if (partes.length !== 3) return data

  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

function hoje() {
  return new Date().toISOString().split('T')[0]
}

function diferencaDias(data: string) {
  if (!data) return 9999

  const hojeDate = new Date()
  hojeDate.setHours(0, 0, 0, 0)

  const dataDate = new Date(`${data}T00:00:00`)

  return Math.ceil(
    (dataDate.getTime() - hojeDate.getTime()) / (1000 * 60 * 60 * 24)
  )
}

export default function Sanidade({ cows = [] }: SanidadeProps) {
  const [selectedCowId, setSelectedCowId] = useState('')
  const [search, setSearch] = useState('')

  const [vacinas, setVacinas] = useState<Vaccine[]>(() => {
    try {
      const saved = localStorage.getItem('leiteal_vacinas')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [cuidados, setCuidados] = useState<CareRecord[]>(() => {
    try {
      const saved = localStorage.getItem('leiteal_cuidados')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [showVacinaModal, setShowVacinaModal] = useState(false)
  const [showCuidadoModal, setShowCuidadoModal] = useState(false)

  const [vacinaForm, setVacinaForm] = useState({
    nome: 'Febre Aftosa',
    dataAplicacao: hoje(),
    proximaAplicacao: '',
    observacao: '',
  })

  const [cuidadoForm, setCuidadoForm] = useState({
    tipo: 'Consulta veterinária',
    data: hoje(),
    descricao: '',
    status: 'Pendente',
    custo: '',
  })

  useEffect(() => {
    localStorage.setItem('leiteal_vacinas', JSON.stringify(vacinas))
  }, [vacinas])

  useEffect(() => {
    localStorage.setItem('leiteal_cuidados', JSON.stringify(cuidados))
  }, [cuidados])

  const vacasOrdenadas = useMemo(() => {
    return [...cows]
      .filter(vaca => {
        const texto = `${vaca.nome} ${vaca.id} ${vaca.raca || ''}`.toLowerCase()

        return texto.includes(search.toLowerCase())
      })
      .sort((a, b) => a.nome.localeCompare(b.nome))
  }, [cows, search])

  const vacaSelecionada = cows.find(
    vaca => vaca.id === selectedCowId
  )

  const vacinasDaVaca = vacinas
    .filter(v => v.animalId === selectedCowId)
    .sort((a, b) =>
      b.dataAplicacao.localeCompare(a.dataAplicacao)
    )

  const cuidadosDaVaca = cuidados
    .filter(c => c.animalId === selectedCowId)
    .sort((a, b) =>
      b.data.localeCompare(a.data)
    )

  const vacinasVencidas = vacinas.filter(v => {
    return diferencaDias(v.proximaAplicacao) < 0
  })

  const vacinasProximas = vacinas.filter(v => {
    const dias = diferencaDias(v.proximaAplicacao)

    return dias >= 0 && dias <= 30
  })

  function selecionarVaca(id: string) {
    setSelectedCowId(id)
  }

  function adicionarVacina() {
    if (!selectedCowId) {
      alert('Selecione uma vaca primeiro.')
      return
    }

    if (!vacinaForm.nome || !vacinaForm.dataAplicacao) {
      alert('Preencha os dados da vacina.')
      return
    }

    const novaVacina: Vaccine = {
      id: crypto.randomUUID(),
      animalId: selectedCowId,
      nome: vacinaForm.nome,
      dataAplicacao: vacinaForm.dataAplicacao,
      proximaAplicacao: vacinaForm.proximaAplicacao,
      observacao: vacinaForm.observacao,
    }

    setVacinas(prev => [...prev, novaVacina])

    setVacinaForm({
      nome: 'Febre Aftosa',
      dataAplicacao: hoje(),
      proximaAplicacao: '',
      observacao: '',
    })

    setShowVacinaModal(false)
  }

  function adicionarCuidado() {
    if (!selectedCowId) {
      alert('Selecione uma vaca primeiro.')
      return
    }

    if (!cuidadoForm.descricao) {
      alert('Informe a descrição do cuidado.')
      return
    }

    const novoCuidado: CareRecord = {
      id: crypto.randomUUID(),
      animalId: selectedCowId,
      tipo: cuidadoForm.tipo,
      data: cuidadoForm.data,
      descricao: cuidadoForm.descricao,
      status: cuidadoForm.status,
      custo: cuidadoForm.custo
        ? Number(cuidadoForm.custo)
        : undefined,
    }

    setCuidados(prev => [...prev, novoCuidado])

    setCuidadoForm({
      tipo: 'Consulta veterinária',
      data: hoje(),
      descricao: '',
      status: 'Pendente',
      custo: '',
    })

    setShowCuidadoModal(false)
  }

  function excluirVacina(id: string) {
    if (!confirm('Deseja excluir este registro de vacina?')) return

    setVacinas(prev =>
      prev.filter(v => v.id !== id)
    )
  }

  function excluirCuidado(id: string) {
    if (!confirm('Deseja excluir este cuidado?')) return

    setCuidados(prev =>
      prev.filter(c => c.id !== id)
    )
  }

  function statusVacina(data: string) {
    if (!data) {
      return {
        texto: 'Sem agendamento',
        bg: '#f5f5f4',
        color: MUTED,
      }
    }

    const dias = diferencaDias(data)

    if (dias < 0) {
      return {
        texto: 'Vencida',
        bg: '#fef2f2',
        color: RED,
      }
    }

    if (dias === 0) {
      return {
        texto: 'Hoje',
        bg: '#fff7ed',
        color: '#c2410c',
      }
    }

    if (dias <= 30) {
      return {
        texto: `Em ${dias} dias`,
        bg: '#fffbeb',
        color: '#b45309',
      }
    }

    return {
      texto: 'Agendada',
      bg: '#f0fdf4',
      color: '#166534',
    }
  }

  return (
    <div
      style={{
        maxWidth: '1400px',
        margin: '0 auto',
        color: TEXT,
      }}
    >

      {/* CABEÇALHO */}
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
      >
        <div>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '2rem',
              color: TEXT,
              marginBottom: '4px',
            }}
          >
            Sanidade
          </h1>

          <p
            style={{
              fontSize: '0.85rem',
              color: MUTED,
            }}
          >
            Controle de vacinas, tratamentos e cuidados do rebanho.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              if (!selectedCowId) {
                alert('Selecione uma vaca primeiro.')
                return
              }

              setShowCuidadoModal(true)
            }}
            style={{
              backgroundColor: WHITE,
              color: G,
              border: `1px solid ${G}`,
              borderRadius: '7px',
              padding: '10px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            🩺 Registrar cuidado
          </button>

          <button
            onClick={() => {
              if (!selectedCowId) {
                alert('Selecione uma vaca primeiro.')
                return
              }

              setShowVacinaModal(true)
            }}
            style={{
              backgroundColor: G,
              color: WHITE,
              border: 'none',
              borderRadius: '7px',
              padding: '10px 18px',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            + Agendar vacina
          </button>
        </div>
      </div>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <div
          style={{
            backgroundColor: WHITE,
            border: `1px solid ${BORDER}`,
            borderRadius: '8px',
            padding: '18px',
          }}
        >
          <div className="flex justify-between mb-3">
            <span
              style={{
                fontSize: '0.75rem',
                color: MUTED,
                fontWeight: 600,
              }}
            >
              ANIMAIS
            </span>

            <span>🐄</span>
          </div>

          <strong
            style={{
              fontSize: '1.7rem',
              color: G,
            }}
          >
            {cows.length}
          </strong>

          <div
            style={{
              fontSize: '0.75rem',
              color: MUTED,
              marginTop: '4px',
            }}
          >
            cadastrados no rebanho
          </div>
        </div>

        <div
          style={{
            backgroundColor: WHITE,
            border: `1px solid ${BORDER}`,
            borderRadius: '8px',
            padding: '18px',
          }}
        >
          <div className="flex justify-between mb-3">
            <span
              style={{
                fontSize: '0.75rem',
                color: MUTED,
                fontWeight: 600,
              }}
            >
              VACINAS
            </span>

            <span>💉</span>
          </div>

          <strong
            style={{
              fontSize: '1.7rem',
              color: BLUE,
            }}
          >
            {vacinas.length}
          </strong>

          <div
            style={{
              fontSize: '0.75rem',
              color: MUTED,
              marginTop: '4px',
            }}
          >
            registros realizados
          </div>
        </div>

        <div
          style={{
            backgroundColor: WHITE,
            border: `1px solid ${BORDER}`,
            borderRadius: '8px',
            padding: '18px',
          }}
        >
          <div className="flex justify-between mb-3">
            <span
              style={{
                fontSize: '0.75rem',
                color: MUTED,
                fontWeight: 600,
              }}
            >
              PRÓXIMAS
            </span>

            <span>📅</span>
          </div>

          <strong
            style={{
              fontSize: '1.7rem',
              color: AM,
            }}
          >
            {vacinasProximas.length}
          </strong>

          <div
            style={{
              fontSize: '0.75rem',
              color: MUTED,
              marginTop: '4px',
            }}
          >
            nos próximos 30 dias
          </div>
        </div>

        <div
          style={{
            backgroundColor: WHITE,
            border: `1px solid ${BORDER}`,
            borderRadius: '8px',
            padding: '18px',
          }}
        >
          <div className="flex justify-between mb-3">
            <span
              style={{
                fontSize: '0.75rem',
                color: MUTED,
                fontWeight: 600,
              }}
            >
              ATENÇÃO
            </span>

            <span>⚠️</span>
          </div>

          <strong
            style={{
              fontSize: '1.7rem',
              color: RED,
            }}
          >
            {vacinasVencidas.length}
          </strong>

          <div
            style={{
              fontSize: '0.75rem',
              color: MUTED,
              marginTop: '4px',
            }}
          >
            vacinas vencidas
          </div>
        </div>

      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* LISTA DE VACAS */}
        <div
          style={{
            backgroundColor: WHITE,
            border: `1px solid ${BORDER}`,
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '18px',
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <div
              className="flex items-center justify-between mb-3"
            >
              <div>
                <h2
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: TEXT,
                  }}
                >
                  Selecionar animal
                </h2>

                <span
                  style={{
                    fontSize: '0.72rem',
                    color: MUTED,
                  }}
                >
                  Escolha uma vaca para consultar a saúde
                </span>
              </div>

              <span style={{ fontSize: '1.3rem' }}>🐄</span>
            </div>

            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome ou brinco..."
              style={{
                width: '100%',
                border: `1px solid ${BORDER}`,
                borderRadius: '6px',
                padding: '9px 12px',
                fontSize: '0.8rem',
                outline: 'none',
                color: TEXT,
              }}
            />
          </div>

          <div
            style={{
              maxHeight: '500px',
              overflowY: 'auto',
            }}
          >
            {vacasOrdenadas.length === 0 ? (
              <div
                style={{
                  padding: '30px 20px',
                  textAlign: 'center',
                  color: MUTED,
                  fontSize: '0.8rem',
                }}
              >
                Nenhuma vaca encontrada.
              </div>
            ) : (
              vacasOrdenadas.map(vaca => {
                const selecionada =
                  vaca.id === selectedCowId

                const vacinasAnimal =
                  vacinas.filter(
                    v => v.animalId === vaca.id
                  )

                const ultimaVacina =
                  vacinasAnimal.length > 0
                    ? vacinasAnimal.sort((a, b) =>
                        b.dataAplicacao.localeCompare(
                          a.dataAplicacao
                        )
                      )[0]
                    : undefined

                return (
                  <button
                    key={vaca.id}
                    onClick={() =>
                      selecionarVaca(vaca.id)
                    }
                    className="w-full text-left"
                    style={{
                      padding: '14px 16px',
                      border: 'none',
                      borderBottom: `1px solid ${BORDER}`,
                      backgroundColor: selecionada
                        ? GL
                        : WHITE,
                      borderLeft: selecionada
                        ? `3px solid ${G}`
                        : '3px solid transparent',
                    }}
                  >
                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: selecionada
                              ? G
                              : '#f2f0eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                          }}
                        >
                          🐄
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: TEXT,
                            }}
                          >
                            {vaca.nome}
                          </div>

                          <div
                            style={{
                              fontSize: '0.7rem',
                              color: MUTED,
                              marginTop: '2px',
                            }}
                          >
                            Brinco #{vaca.id}
                            {vaca.raca
                              ? ` · ${vaca.raca}`
                              : ''}
                          </div>
                        </div>

                      </div>

                      <div
                        style={{
                          textAlign: 'right',
                        }}
                      >
                        {ultimaVacina ? (
                          <span
                            style={{
                              fontSize: '0.65rem',
                              color:
                                diferencaDias(
                                  ultimaVacina.proximaAplicacao
                                ) < 0
                                  ? RED
                                  : G,
                            }}
                          >
                            💉
                            {ultimaVacina.proximaAplicacao
                              ? formatarData(
                                  ultimaVacina.proximaAplicacao
                                )
                              : '—'}
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.65rem',
                              color: MUTED,
                            }}
                          >
                            Sem registros
                          </span>
                        )}
                      </div>

                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* DETALHES DA VACA */}
        <div
          className="lg:col-span-2"
        >

          {!vacaSelecionada ? (
            <div
              style={{
                backgroundColor: WHITE,
                border: `1px solid ${BORDER}`,
                borderRadius: '8px',
                minHeight: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '40px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '4rem',
                    marginBottom: '15px',
                  }}
                >
                  🩺
                </div>

                <h2
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: '1.5rem',
                    color: TEXT,
                    marginBottom: '8px',
                  }}
                >
                  Selecione uma vaca
                </h2>

                <p
                  style={{
                    color: MUTED,
                    fontSize: '0.85rem',
                    maxWidth: '400px',
                  }}
                >
                  Selecione um animal ao lado para visualizar
                  vacinas, próximos cuidados, tratamentos e
                  histórico sanitário.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* CABEÇALHO DA VACA */}
              <div
                style={{
                  backgroundColor: WHITE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '16px',
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div
                      style={{
                        width: '55px',
                        height: '55px',
                        borderRadius: '50%',
                        backgroundColor: GL,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.7rem',
                      }}
                    >
                      🐄
                    </div>

                    <div>
                      <h2
                        style={{
                          fontFamily:
                            "'DM Serif Display', serif",
                          fontSize: '1.5rem',
                          color: TEXT,
                        }}
                      >
                        {vacaSelecionada.nome}
                      </h2>

                      <div
                        style={{
                          color: MUTED,
                          fontSize: '0.75rem',
                          marginTop: '3px',
                        }}
                      >
                        Brinco #{vacaSelecionada.id}
                        {vacaSelecionada.raca
                          ? ` · ${vacaSelecionada.raca}`
                          : ''}
                        {vacaSelecionada.lactacao
                          ? ` · ${vacaSelecionada.lactacao}ª lactação`
                          : ''}
                      </div>
                    </div>

                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        setShowCuidadoModal(true)
                      }
                      style={{
                        backgroundColor: WHITE,
                        color: G,
                        border: `1px solid ${G}`,
                        borderRadius: '6px',
                        padding: '9px 13px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      🩺 Cuidado
                    </button>

                    <button
                      onClick={() =>
                        setShowVacinaModal(true)
                      }
                      style={{
                        backgroundColor: G,
                        color: WHITE,
                        border: 'none',
                        borderRadius: '6px',
                        padding: '9px 13px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      💉 Agendar vacina
                    </button>

                  </div>

                </div>
              </div>

              {/* PRÓXIMOS CUIDADOS */}
              <div
                style={{
                  backgroundColor: WHITE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: '8px',
                  marginBottom: '16px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  <h3
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: TEXT,
                    }}
                  >
                    📅 Próximos cuidados
                  </h3>

                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: MUTED,
                    }}
                  >
                    Vacinas e procedimentos programados
                  </span>
                </div>

                <div
                  style={{
                    padding: '10px 20px 20px',
                  }}
                >
                  {vacinasDaVaca.filter(
                    v => v.proximaAplicacao
                  ).length === 0 ? (
                    <div
                      style={{
                        padding: '20px',
                        backgroundColor: '#fafaf8',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        color: MUTED,
                      }}
                    >
                      Nenhuma vacina agendada para esta vaca.
                    </div>
                  ) : (
                    vacinasDaVaca
                      .filter(v => v.proximaAplicacao)
                      .map(vacina => {
                        const status = statusVacina(
                          vacina.proximaAplicacao
                        )

                        return (
                          <div
                            key={vacina.id}
                            className="flex items-center justify-between gap-4"
                            style={{
                              padding: '13px 0',
                              borderBottom: `1px solid ${BORDER}`,
                            }}
                          >
                            <div className="flex items-center gap-3">

                              <div
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '6px',
                                  backgroundColor: '#f0fdf4',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                💉
                              </div>

                              <div>
                                <div
                                  style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                  }}
                                >
                                  {vacina.nome}
                                </div>

                                <div
                                  style={{
                                    fontSize: '0.7rem',
                                    color: MUTED,
                                  }}
                                >
                                  Próxima aplicação:{' '}
                                  {formatarData(
                                    vacina.proximaAplicacao
                                  )}
                                </div>
                              </div>

                            </div>

                            <div className="flex items-center gap-3">

                              <span
                                style={{
                                  backgroundColor:
                                    status.bg,
                                  color: status.color,
                                  padding: '5px 9px',
                                  borderRadius: '20px',
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                }}
                              >
                                {status.texto}
                              </span>

                              <button
                                onClick={() =>
                                  excluirVacina(vacina.id)
                                }
                                style={{
                                  color: RED,
                                  fontSize: '0.75rem',
                                }}
                              >
                                Excluir
                              </button>

                            </div>
                          </div>
                        )
                      })
                  )}
                </div>
              </div>

              {/* HISTÓRICO DE VACINAS */}
              <div
                style={{
                  backgroundColor: WHITE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: '8px',
                  marginBottom: '16px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  <h3
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                    }}
                  >
                    💉 Histórico de vacinação
                  </h3>
                </div>

                {vacinasDaVaca.length === 0 ? (
                  <div
                    style={{
                      padding: '25px',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      color: MUTED,
                    }}
                  >
                    Nenhuma vacinação registrada.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: '#fafaf8',
                          }}
                        >
                          <th style={thStyle}>
                            Vacina
                          </th>

                          <th style={thStyle}>
                            Aplicação
                          </th>

                          <th style={thStyle}>
                            Próxima
                          </th>

                          <th style={thStyle}>
                            Status
                          </th>

                          <th style={thStyle}>
                            Ação
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {vacinasDaVaca.map(vacina => {
                          const status = statusVacina(
                            vacina.proximaAplicacao
                          )

                          return (
                            <tr key={vacina.id}>
                              <td style={tdStyle}>
                                <strong>
                                  {vacina.nome}
                                </strong>

                                {vacina.observacao && (
                                  <div
                                    style={{
                                      color: MUTED,
                                      fontSize: '0.65rem',
                                      marginTop: '2px',
                                    }}
                                  >
                                    {vacina.observacao}
                                  </div>
                                )}
                              </td>

                              <td style={tdStyle}>
                                {formatarData(
                                  vacina.dataAplicacao
                                )}
                              </td>

                              <td style={tdStyle}>
                                {vacina.proximaAplicacao
                                  ? formatarData(
                                      vacina.proximaAplicacao
                                    )
                                  : '-'}
                              </td>

                              <td style={tdStyle}>
                                <span
                                  style={{
                                    backgroundColor:
                                      status.bg,
                                    color: status.color,
                                    padding:
                                      '4px 8px',
                                    borderRadius:
                                      '15px',
                                    fontSize:
                                      '0.65rem',
                                    fontWeight: 700,
                                  }}
                                >
                                  {status.texto}
                                </span>
                              </td>

                              <td style={tdStyle}>
                                <button
                                  onClick={() =>
                                    excluirVacina(
                                      vacina.id
                                    )
                                  }
                                  style={{
                                    color: RED,
                                    fontSize:
                                      '0.7rem',
                                  }}
                                >
                                  Excluir
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* HISTÓRICO DE CUIDADOS */}
              <div
                style={{
                  backgroundColor: WHITE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  <h3
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                    }}
                  >
                    🩺 Histórico de cuidados
                  </h3>
                </div>

                {cuidadosDaVaca.length === 0 ? (
                  <div
                    style={{
                      padding: '25px',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      color: MUTED,
                    }}
                  >
                    Nenhum cuidado ou tratamento registrado.
                  </div>
                ) : (
                  cuidadosDaVaca.map(cuidado => (
                    <div
                      key={cuidado.id}
                      className="flex items-center justify-between gap-4"
                      style={{
                        padding: '15px 20px',
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      <div className="flex items-center gap-3">

                        <div
                          style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '6px',
                            backgroundColor:
                              '#f5f0e8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          🩺
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: '0.8rem',
                              fontWeight: 700,
                            }}
                          >
                            {cuidado.tipo}
                          </div>

                          <div
                            style={{
                              fontSize: '0.7rem',
                              color: MUTED,
                            }}
                          >
                            {formatarData(cuidado.data)}
                            {' · '}
                            {cuidado.descricao}
                          </div>

                          {cuidado.custo !== undefined && (
                            <div
                              style={{
                                fontSize: '0.68rem',
                                color: G,
                                marginTop: '3px',
                              }}
                            >
                              Custo: R${' '}
                              {cuidado.custo.toFixed(
                                2
                              )}
                            </div>
                          )}
                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <span
                          style={{
                            backgroundColor:
                              cuidado.status ===
                              'Concluído'
                                ? '#f0fdf4'
                                : '#fffbeb',
                            color:
                              cuidado.status ===
                              'Concluído'
                                ? '#166534'
                                : '#b45309',
                            padding: '5px 9px',
                            borderRadius: '15px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                          }}
                        >
                          {cuidado.status}
                        </span>

                        <button
                          onClick={() =>
                            excluirCuidado(cuidado.id)
                          }
                          style={{
                            color: RED,
                            fontSize: '0.7rem',
                          }}
                        >
                          Excluir
                        </button>

                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL VACINA */}
      {showVacinaModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            padding: '20px',
          }}
          onClick={() =>
            setShowVacinaModal(false)
          }
        >
          <div
            style={{
              backgroundColor: WHITE,
              borderRadius: '10px',
              padding: '28px',
              width: '100%',
              maxWidth: '450px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2
              style={{
                fontFamily:
                  "'DM Serif Display', serif",
                fontSize: '1.4rem',
                color: TEXT,
                marginBottom: '5px',
              }}
            >
              💉 Agendar vacina
            </h2>

            <p
              style={{
                fontSize: '0.75rem',
                color: MUTED,
                marginBottom: '20px',
              }}
            >
              Animal:{' '}
              <strong>
                {vacaSelecionada?.nome}
              </strong>{' '}
              · #{vacaSelecionada?.id}
            </p>

            <div className="flex flex-col gap-4">

              <div>
                <label style={labelStyle}>
                  VACINA
                </label>

                <select
                  value={vacinaForm.nome}
                  onChange={e =>
                    setVacinaForm({
                      ...vacinaForm,
                      nome: e.target.value,
                    })
                  }
                  style={inputStyle}
                >
                  {VACINAS_COMUNS.map(vacina => (
                    <option
                      key={vacina}
                      value={vacina}
                    >
                      {vacina}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  DATA DA APLICAÇÃO
                </label>

                <input
                  type="date"
                  value={
                    vacinaForm.dataAplicacao
                  }
                  onChange={e =>
                    setVacinaForm({
                      ...vacinaForm,
                      dataAplicacao:
                        e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  PRÓXIMA APLICAÇÃO / VENCIMENTO
                </label>

                <input
                  type="date"
                  value={
                    vacinaForm.proximaAplicacao
                  }
                  onChange={e =>
                    setVacinaForm({
                      ...vacinaForm,
                      proximaAplicacao:
                        e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  OBSERVAÇÃO
                </label>

                <textarea
                  placeholder="Ex: Aplicada conforme protocolo..."
                  value={
                    vacinaForm.observacao
                  }
                  onChange={e =>
                    setVacinaForm({
                      ...vacinaForm,
                      observacao:
                        e.target.value,
                    })
                  }
                  style={{
                    ...inputStyle,
                    minHeight: '70px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div className="flex gap-3 mt-2">

                <button
                  onClick={() =>
                    setShowVacinaModal(false)
                  }
                  style={{
                    flex: 1,
                    border: `1px solid ${BORDER}`,
                    borderRadius: '6px',
                    padding: '11px',
                    color: MUTED,
                  }}
                >
                  Cancelar
                </button>

                <button
                  onClick={adicionarVacina}
                  style={{
                    flex: 2,
                    backgroundColor: G,
                    color: WHITE,
                    borderRadius: '6px',
                    padding: '11px',
                    fontWeight: 600,
                  }}
                >
                  Salvar vacina
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CUIDADO */}
      {showCuidadoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            padding: '20px',
          }}
          onClick={() =>
            setShowCuidadoModal(false)
          }
        >
          <div
            style={{
              backgroundColor: WHITE,
              borderRadius: '10px',
              padding: '28px',
              width: '100%',
              maxWidth: '450px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2
              style={{
                fontFamily:
                  "'DM Serif Display', serif",
                fontSize: '1.4rem',
                color: TEXT,
                marginBottom: '5px',
              }}
            >
              🩺 Registrar cuidado
            </h2>

            <p
              style={{
                fontSize: '0.75rem',
                color: MUTED,
                marginBottom: '20px',
              }}
            >
              Animal:{' '}
              <strong>
                {vacaSelecionada?.nome}
              </strong>{' '}
              · #{vacaSelecionada?.id}
            </p>

            <div className="flex flex-col gap-4">

              <div>
                <label style={labelStyle}>
                  TIPO DE CUIDADO
                </label>

                <select
                  value={cuidadoForm.tipo}
                  onChange={e =>
                    setCuidadoForm({
                      ...cuidadoForm,
                      tipo: e.target.value,
                    })
                  }
                  style={inputStyle}
                >
                  {CUIDADOS.map(cuidado => (
                    <option
                      key={cuidado}
                      value={cuidado}
                    >
                      {cuidado}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  DATA
                </label>

                <input
                  type="date"
                  value={cuidadoForm.data}
                  onChange={e =>
                    setCuidadoForm({
                      ...cuidadoForm,
                      data: e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  DESCRIÇÃO
                </label>

                <textarea
                  placeholder="Ex: Tratamento para mastite..."
                  value={
                    cuidadoForm.descricao
                  }
                  onChange={e =>
                    setCuidadoForm({
                      ...cuidadoForm,
                      descricao:
                        e.target.value,
                    })
                  }
                  style={{
                    ...inputStyle,
                    minHeight: '80px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label style={labelStyle}>
                    STATUS
                  </label>

                  <select
                    value={
                      cuidadoForm.status
                    }
                    onChange={e =>
                      setCuidadoForm({
                        ...cuidadoForm,
                        status: e.target.value,
                      })
                    }
                    style={inputStyle}
                  >
                    <option>Pendente</option>
                    <option>Concluído</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>
                    CUSTO (R$)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    value={
                      cuidadoForm.custo
                    }
                    onChange={e =>
                      setCuidadoForm({
                        ...cuidadoForm,
                        custo: e.target.value,
                      })
                    }
                    style={inputStyle}
                  />
                </div>

              </div>

              <div className="flex gap-3 mt-2">

                <button
                  onClick={() =>
                    setShowCuidadoModal(false)
                  }
                  style={{
                    flex: 1,
                    border: `1px solid ${BORDER}`,
                    borderRadius: '6px',
                    padding: '11px',
                    color: MUTED,
                  }}
                >
                  Cancelar
                </button>

                <button
                  onClick={adicionarCuidado}
                  style={{
                    flex: 2,
                    backgroundColor: G,
                    color: WHITE,
                    borderRadius: '6px',
                    padding: '11px',
                    fontWeight: 600,
                  }}
                >
                  Salvar cuidado
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.68rem',
  fontWeight: 700,
  color: MUTED,
  marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: `1px solid ${BORDER}`,
  borderRadius: '6px',
  padding: '10px 12px',
  fontSize: '0.8rem',
  color: TEXT,
  backgroundColor: WHITE,
  outline: 'none',
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 14px',
  fontSize: '0.65rem',
  color: MUTED,
  fontWeight: 700,
  textTransform: 'uppercase',
  borderBottom: `1px solid ${BORDER}`,
}

const tdStyle: React.CSSProperties = {
  padding: '12px 14px',
  fontSize: '0.72rem',
  borderBottom: `1px solid ${BORDER}`,
  color: TEXT,
}