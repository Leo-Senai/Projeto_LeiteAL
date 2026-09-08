import { useEffect, useState } from 'react'
import Card from '../components/Card'

type Animal = {
  id: number
  nome: string
  brinco?: string
}

type Status = 'ok' | 'alerta' | 'atencao'

type ProcedureType =
  | 'Vacinação'
  | 'Tratamento'
  | 'Exame'
  | 'Medicamento'
  | 'Consulta'
  | 'Outro'

type HealthRecord = {
  id: number
  animalId: number
  animalNome: string
  date: string
  type: ProcedureType
  note: string
  status: Status
}

const procedureTypes: ProcedureType[] = [
  'Vacinação',
  'Tratamento',
  'Exame',
  'Medicamento',
  'Consulta',
  'Outro',
]

export default function Sanidade() {
  // ==============================
  // DADOS
  // ==============================

  const [animals, setAnimals] = useState<Animal[]>([])
  const [records, setRecords] = useState<HealthRecord[]>([])

  // ==============================
  // FORMULÁRIO
  // ==============================

  const [search, setSearch] = useState('')
  const [animalId, setAnimalId] = useState('')

  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  const [procedureType, setProcedureType] =
    useState<ProcedureType>('Vacinação')

  const [note, setNote] = useState('')

  const [status, setStatus] =
    useState<Status>('ok')

  // ==============================
  // CARREGAR ANIMAIS DO SITE
  // ==============================

  useEffect(() => {
    loadAnimals()
    loadRecords()
  }, [])

  function loadAnimals() {
    const savedAnimals =
      localStorage.getItem('animais')

    if (savedAnimals) {
      try {
        const parsedAnimals =
          JSON.parse(savedAnimals)

        setAnimals(parsedAnimals)
      } catch (error) {
        console.error(
          'Erro ao carregar animais:',
          error
        )
      }
    }
  }

  // ==============================
  // CARREGAR HISTÓRICO
  // ==============================

  function loadRecords() {
    const savedRecords =
      localStorage.getItem(
        'registrosSanidade'
      )

    if (savedRecords) {
      try {
        setRecords(
          JSON.parse(savedRecords)
        )
      } catch (error) {
        console.error(
          'Erro ao carregar registros:',
          error
        )
      }
    }
  }

  // ==============================
  // SALVAR REGISTROS
  // ==============================

  function saveRecords(
    newRecords: HealthRecord[]
  ) {
    setRecords(newRecords)

    localStorage.setItem(
      'registrosSanidade',
      JSON.stringify(newRecords)
    )
  }

  // ==============================
  // FILTRAR ANIMAIS
  // ==============================

  const filteredAnimals =
    animals.filter(animal => {
      const searchText =
        search.toLowerCase()

      return (
        animal.nome
          .toLowerCase()
          .includes(searchText) ||
        animal.brinco
          ?.toLowerCase()
          .includes(searchText)
      )
    })

  // ==============================
  // ADICIONAR REGISTRO
  // ==============================

  function addRecord() {
    if (!animalId) {
      alert('Selecione um animal.')
      return
    }

    if (!date) {
      alert('Informe a data.')
      return
    }

    const selectedAnimal =
      animals.find(
        animal =>
          animal.id === Number(animalId)
      )

    if (!selectedAnimal) {
      alert('Animal não encontrado.')
      return
    }

    const newRecord: HealthRecord = {
      id: Date.now(),

      animalId:
        selectedAnimal.id,

      animalNome:
        selectedAnimal.nome,

      date,

      type:
        procedureType,

      note:
        note || 'Sem observação',

      status,
    }

    const newRecords = [
      newRecord,
      ...records,
    ]

    saveRecords(newRecords)

    // LIMPAR FORMULÁRIO

    setAnimalId('')
    setSearch('')

    setDate(
      new Date()
        .toISOString()
        .split('T')[0]
    )

    setProcedureType(
      'Vacinação'
    )

    setNote('')

    setStatus('ok')
  }

  // ==============================
  // REMOVER REGISTRO
  // ==============================

  function removeRecord(id: number) {
    const confirmar =
      window.confirm(
        'Deseja remover este registro?'
      )

    if (!confirmar) return

    const newRecords =
      records.filter(
        record =>
          record.id !== id
      )

    saveRecords(newRecords)
  }

  // ==============================
  // FORMATAR DATA
  // ==============================

  function formatDate(
    dateString: string
  ) {
    return new Date(
      `${dateString}T12:00:00`
    ).toLocaleDateString(
      'pt-BR'
    )
  }

  // ==============================
  // MÉTRICAS
  // ==============================

  const vaccinesCount =
    records.filter(
      record =>
        record.type ===
        'Vacinação'
    ).length

  const alertCount =
    records.filter(
      record =>
        record.status ===
        'alerta'
    ).length

  const attentionCount =
    records.filter(
      record =>
        record.status ===
        'atencao'
    ).length

  // ==============================
  // INTERFACE
  // ==============================

  return (
    <Card>

      {/* CABEÇALHO */}

      <div className="section-header">

        <div>

          <div className="eyebrow">
            Sanidade
          </div>

          <h2>
            Saúde do rebanho
          </h2>

        </div>

        <span
          className={`status-pill ${
            alertCount > 0
              ? 'danger'
              : 'success'
          }`}
        >

          {alertCount > 0
            ? `${alertCount} alertas`
            : 'Em dia'}

        </span>

      </div>

      <p className="muted">

        Histórico de vacinas,
        tratamentos, exames e
        procedimentos realizados
        no rebanho.

      </p>


      {/* MÉTRICAS */}

      <div className="metric-grid">

        <div className="metric-card">

          <span className="label">
            Vacinas
          </span>

          <strong>
            {vaccinesCount}
          </strong>

          <small>
            registros cadastrados
          </small>

        </div>


        <div className="metric-card">

          <span className="label">
            Animais
          </span>

          <strong>
            {animals.length}
          </strong>

          <small>
            cadastrados no sistema
          </small>

        </div>


        <div className="metric-card">

          <span className="label">
            Atenção
          </span>

          <strong>
            {alertCount + attentionCount}
          </strong>

          <small>
            registros em acompanhamento
          </small>

        </div>

      </div>


      {/* FORMULÁRIO */}

      <div
        className="sub-panel"
        style={{
          marginTop: 18,
        }}
      >

        <h3>
          Registrar procedimento
        </h3>


        {/* BUSCAR */}

        <div
          style={{
            marginBottom: 12,
          }}
        >

          <label>
            Buscar animal
          </label>

          <input
            className="input"
            value={search}
            onChange={e =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Nome ou número do brinco"
          />

        </div>


        {/* SELECT */}

        <select
          className="input"
          value={animalId}
          onChange={e =>
            setAnimalId(
              e.target.value
            )
          }
          style={{
            marginBottom: 12,
          }}
        >

          <option value="">
            Selecione um animal
          </option>

          {filteredAnimals.map(
            animal => (

              <option
                key={animal.id}
                value={animal.id}
              >

                {animal.nome}

                {animal.brinco
                  ? ` - Brinco: ${animal.brinco}`
                  : ''}

              </option>

            )
          )}

        </select>


        <div className="controls">

          {/* DATA */}

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


          {/* TIPO */}

          <select
            className="input"
            value={procedureType}
            onChange={e =>
              setProcedureType(
                e.target
                  .value as ProcedureType
              )
            }
          >

            {procedureTypes.map(
              type => (

                <option
                  key={type}
                  value={type}
                >

                  {type}

                </option>

              )
            )}

          </select>


          {/* STATUS */}

          <select
            className="input"
            value={status}
            onChange={e =>
              setStatus(
                e.target
                  .value as Status
              )
            }
          >

            <option value="ok">
              OK
            </option>

            <option value="atencao">
              Atenção
            </option>

            <option value="alerta">
              Alerta
            </option>

          </select>


          {/* OBSERVAÇÃO */}

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
            onClick={addRecord}
          >

            Adicionar

          </button>

        </div>

      </div>


      {/* HISTÓRICO */}

      <div
        className="sub-panel"
        style={{
          marginTop: 18,
        }}
      >

        <h3>
          Histórico sanitário
        </h3>


        {records.length === 0 && (

          <p className="muted">

            Nenhum procedimento registrado.

          </p>

        )}


        {records.length > 0 && (

          <ul className="timeline">

            {records.map(
              record => (

                <li
                  key={record.id}
                >

                  <div
                    style={{
                      display:
                        'flex',

                      justifyContent:
                        'space-between',

                      gap: 14,

                      alignItems:
                        'flex-start',
                    }}
                  >

                    <div>

                      <strong>

                        {record.animalNome}

                      </strong>


                      <div
                        style={{
                          color:
                            '#726c62',

                          fontSize: 12,
                        }}
                      >

                        {formatDate(
                          record.date
                        )}

                        {' • '}

                        {record.type}

                      </div>


                      <div
                        style={{
                          marginTop: 4,
                        }}
                      >

                        {record.note}

                      </div>

                    </div>


                    <div
                      style={{
                        display:
                          'flex',

                        alignItems:
                          'center',

                        gap: 8,
                      }}
                    >

                      <span
                        className={`status-pill ${
                          record.status ===
                          'ok'

                            ? 'success'

                            : record.status ===
                              'alerta'

                            ? 'danger'

                            : 'warning'
                        }`}
                      >

                        {record.status ===
                        'ok'

                          ? 'OK'

                          : record.status ===
                            'alerta'

                          ? 'Alerta'

                          : 'Atenção'}

                      </span>


                      <button
                        className="
                          btn btn-ghost
                        "
                        onClick={() =>
                          removeRecord(
                            record.id
                          )
                        }
                      >

                        Remover

                      </button>

                    </div>

                  </div>

                </li>

              )
            )}

          </ul>

        )}

      </div>

    </Card>
  )
}