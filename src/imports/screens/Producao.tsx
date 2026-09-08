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
}

export default function Producao({
  records: propRecords,
  onAddRecord,
  onRemoveRecord,
  onAddCow,
  pricePerLiter,
  setPricePerLiter,
  cows = [],
}: {
  records?: RecordItem[]
  onAddRecord?: (r: {
    date: string
    liters: number
    animal?: string
  }) => void
  onAddCow?: (c: {
    id?: string
    nome: string
    litros?: number
    raca?: string
    lactacao?: number
  }) => string | void
  onRemoveRecord?: (id: number) => void
  pricePerLiter?: number
  setPricePerLiter?: (v: number) => void
  cows?: Cow[]
}) {
  const [localRecords, setLocalRecords] =
    useState<RecordItem[]>([])

  const [date, setDate] =
    useState('')

  const [liters, setLiters] =
    useState('')

  const [selectedCowId, setSelectedCowId] =
    useState('')

  const [search, setSearch] =
    useState('')

  const [editingId, setEditingId] =
    useState<number | null>(null)

  const [editDate, setEditDate] =
    useState('')

  const [editLiters, setEditLiters] =
    useState('')

  const records =
    propRecords ?? localRecords

  // =====================================
  // VACAS EM ORDEM ALFABÉTICA
  // =====================================

  const sortedCows = useMemo(() => {
    return [...cows]
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
  }, [cows, search])

  // =====================================
  // REGISTROS ORGANIZADOS POR DATA
  // =====================================

  const sortedRecords = useMemo(() => {
    return [...records].sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
  }, [records])

  // =====================================
  // BUSCAR NOME DO ANIMAL
  // =====================================

  function getAnimalName(
    animalId?: string
  ) {
    if (!animalId)
      return 'Não informado'

    const cow =
      cows.find(
        c => c.id === animalId
      )

    return cow
      ? cow.nome
      : animalId
  }

  // =====================================
  // FORMATAR DATA
  // =====================================

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

  // =====================================
  // ADICIONAR PRODUÇÃO
  // =====================================

  function addRecord() {
    const value =
      Number(liters)

    if (!date) {
      alert(
        'Informe a data.'
      )
      return
    }

    if (
      Number.isNaN(value) ||
      value <= 0
    ) {
      alert(
        'Informe uma quantidade válida de litros.'
      )
      return
    }

    const newRecord = {
      date,
      liters: value,
      animal:
        selectedCowId || undefined,
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

  // =====================================
  // REMOVER PRODUÇÃO
  // =====================================

  function removeRecord(
    id: number
  ) {
    const confirmDelete =
      window.confirm(
        'Deseja remover este registro?'
      )

    if (!confirmDelete)
      return

    if (propRecords) {
      onRemoveRecord?.(id)
      return
    }

    setLocalRecords(prev =>
      prev.filter(
        record =>
          record.id !== id
      )
    )
  }

  // =====================================
  // INICIAR EDIÇÃO
  // =====================================

  function startEdit(
    record: RecordItem
  ) {
    setEditingId(record.id)

    setEditDate(
      record.date
    )

    setEditLiters(
      String(record.liters)
    )
  }

  // =====================================
  // SALVAR EDIÇÃO
  // =====================================

  function saveEdit(
    record: RecordItem
  ) {
    const value =
      Number(editLiters)

    if (
      !editDate ||
      value <= 0
    ) {
      alert(
        'Informe valores válidos.'
      )
      return
    }

    if (propRecords) {
      alert(
        'A edição precisa ser conectada à função de atualização do banco.'
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

  // =====================================
  // MÉTRICAS
  // =====================================

  const total =
    records.reduce(
      (sum, record) =>
        sum + record.liters,
      0
    )

  const average =
    records.length
      ? total / records.length
      : 0

  const receita =
    total *
    (pricePerLiter ?? 0)

  // =====================================
  // CSS
  // =====================================

  const styles = `
  
    .production-table-container {
      width: 100%;
      overflow-x: auto;
      border-radius: 16px;
      border: 1px solid #e8e4dc;
      background: #ffffff;
      box-shadow: 0 8px 24px rgba(0,0,0,0.04);
    }

    .production-table {
      width: 100%;
      min-width: 850px;
      border-collapse: collapse;
    }

    .production-table thead {
      background: linear-gradient(
        90deg,
        #f8f6f1,
        #f3f0e9
      );
    }

    .production-table th {
      padding: 16px;
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #726c62;
      border-bottom: 1px solid #e8e4dc;
    }

    .production-table td {
      padding: 16px;
      border-bottom: 1px solid #f0ede7;
      vertical-align: middle;
    }

    .production-table tbody tr {
      transition: 0.2s;
    }

    .production-table tbody tr:hover {
      background: #faf9f6;
    }

    .production-table tbody tr:last-child td {
      border-bottom: none;
    }

    .table-input {
      width: 100%;
      min-width: 120px;
      padding: 10px 12px;
      border: 1px solid #ded9d0;
      border-radius: 8px;
      background: #ffffff;
      font-size: 13px;
      outline: none;
      box-sizing: border-box;
    }

    .table-input:focus {
      border-color: #3d7a49;
      box-shadow: 0 0 0 3px rgba(61,122,73,0.12);
    }

    .animal-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .animal-avatar-table {
      width: 42px;
      height: 42px;
      min-width: 42px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(
        135deg,
        #4f8a5b,
        #2f6b3b
      );
      color: white;
      font-weight: 700;
    }

    .animal-name {
      font-weight: 700;
      color: #2b2925;
    }

    .animal-id {
      display: block;
      margin-top: 3px;
      color: #8a847a;
      font-size: 11px;
    }

    .id-badge {
      padding: 6px 10px;
      border-radius: 8px;
      background: #f2f1ed;
      font-size: 12px;
      font-weight: 600;
      color: #625d55;
    }

    .production-value {
      font-size: 16px;
      font-weight: 700;
      color: #2f6b3b;
    }

    .revenue-value {
      font-weight: 700;
      color: #397344;
    }

    .table-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    .edit-btn {
      border: none;
      background: #eef4ff;
      color: #4169a1;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 12px;
    }

    .delete-btn {
      border: 1px solid #f1caca;
      background: #fff7f7;
      color: #b94b4b;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 12px;
    }

    .save-btn {
      border: none;
      background: #397344;
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    .cancel-btn {
      border: 1px solid #ded9d0;
      background: white;
      color: #726c62;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    .search-production {
      max-width: 300px;
    }

    .table-header-production {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
    }

    .empty-table {
      text-align: center;
      padding: 40px !important;
      color: #8a847a;
    }

    @media (max-width: 768px) {

      .table-header-production {
        flex-direction: column;
        align-items: stretch;
      }

      .search-production {
        max-width: 100%;
      }

    }

  `

  return (
    <Card>

      <style>
        {styles}
      </style>

      {/* ================================= */}
      {/* CABEÇALHO */}
      {/* ================================= */}

      <div className="section-header">

        <div>

          <div className="eyebrow">
            Produção
          </div>

          <h2>
            Controle de produção
          </h2>

        </div>

        <span className="status-pill success">
          Sistema ativo
        </span>

      </div>

      <p className="muted">
        Controle individual da produção leiteira.
      </p>


      {/* ================================= */}
      {/* MÉTRICAS */}
      {/* ================================= */}

      <div className="metric-grid">

        <div className="metric-card">

          <span className="label">
            Produção total
          </span>

          <strong>
            {total.toFixed(0)} L
          </strong>

          <small>
            total registrado
          </small>

        </div>

        <div className="metric-card">

          <span className="label">
            Média
          </span>

          <strong>
            {average.toFixed(1)} L
          </strong>

          <small>
            por registro
          </small>

        </div>

        <div className="metric-card">

          <span className="label">
            Receita estimada
          </span>

          <strong>
            R$ {receita.toFixed(2)}
          </strong>

          <small>
            valor calculado
          </small>

        </div>

      </div>


      {/* ================================= */}
      {/* PREÇO POR LITRO */}
      {/* ================================= */}

      <div
        className="sub-panel"
        style={{
          marginTop: 20,
        }}
      >

        <div className="controls">

          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Preço do leite (R$/L)
          </label>

          <input
            className="input"
            type="number"
            step="0.01"
            value={
              String(
                pricePerLiter ?? ''
              )
            }
            onChange={e =>
              setPricePerLiter?.(
                Number(
                  e.target.value || 0
                )
              )
            }
            style={{
              width: 140,
            }}
          />

        </div>

      </div>


      {/* ================================= */}
      {/* REGISTRAR PRODUÇÃO */}
      {/* ================================= */}

      <div
        className="sub-panel"
        style={{
          marginTop: 20,
        }}
      >

        <div
          className="table-header-production"
        >

          <div>

            <h3>
              Registrar produção
            </h3>

            <span
              style={{
                fontSize: 12,
                color: '#8a847a',
              }}
            >
              Adicione um novo registro.
            </span>

          </div>

        </div>


        <div className="production-table-container">

          <table className="production-table">

            <thead>

              <tr>

                <th>
                  Data
                </th>

                <th>
                  Litros
                </th>

                <th>
                  Animal
                </th>

                <th>
                  Receita estimada
                </th>

                <th>
                  Ação
                </th>

              </tr>

            </thead>


            <tbody>

              <tr>

                <td>

                  <input
                    type="date"
                    className="table-input"
                    value={date}
                    onChange={e =>
                      setDate(
                        e.target.value
                      )
                    }
                  />

                </td>


                <td>

                  <input
                    type="number"
                    className="table-input"
                    value={liters}
                    onChange={e =>
                      setLiters(
                        e.target.value
                      )
                    }
                    placeholder="0"
                  />

                </td>


                <td>

                  <select
                    className="table-input"
                    value={selectedCowId}
                    onChange={e =>
                      setSelectedCowId(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Não informado
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

                </td>


                <td>

                  <strong
                    className="revenue-value"
                  >

                    R${' '}

                    {(
                      Number(liters || 0) *
                      (pricePerLiter ?? 0)
                    ).toFixed(2)}

                  </strong>

                </td>


                <td>

                  <button
                    className="btn btn-primary"
                    onClick={addRecord}
                  >

                    Adicionar

                  </button>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>


      {/* ================================= */}
      {/* ÚLTIMOS REGISTROS */}
      {/* ================================= */}

      <div
        className="sub-panel"
        style={{
          marginTop: 20,
        }}
      >

        <div className="table-header-production">

          <div>

            <h3>
              Histórico de produção
            </h3>

            <span
              style={{
                fontSize: 12,
                color: '#8a847a',
              }}
            >

              Todos os registros cadastrados.

            </span>

          </div>

        </div>


        <div className="production-table-container">

          <table className="production-table">

            <thead>

              <tr>

                <th>
                  Data
                </th>

                <th>
                  Animal
                </th>

                <th>
                  Produção
                </th>

                <th>
                  Receita
                </th>

                <th>
                  Ações
                </th>

              </tr>

            </thead>


            <tbody>

              {sortedRecords.length === 0 && (

                <tr>

                  <td
                    colSpan={5}
                    className="empty-table"
                  >

                    🥛 Nenhuma produção registrada.

                  </td>

                </tr>

              )}


              {sortedRecords.map(
                record => (

                  <tr
                    key={record.id}
                  >

                    {/* DATA */}

                    <td>

                      {editingId ===
                      record.id ? (

                        <input
                          type="date"
                          className="table-input"
                          value={editDate}
                          onChange={e =>
                            setEditDate(
                              e.target.value
                            )
                          }
                        />

                      ) : (

                        formatDate(
                          record.date
                        )

                      )}

                    </td>


                    {/* ANIMAL */}

                    <td>

                      {getAnimalName(
                        record.animal
                      )}

                    </td>


                    {/* PRODUÇÃO */}

                    <td>

                      {editingId ===
                      record.id ? (

                        <input
                          type="number"
                          className="table-input"
                          value={editLiters}
                          onChange={e =>
                            setEditLiters(
                              e.target.value
                            )
                          }
                        />

                      ) : (

                        <span
                          className="production-value"
                        >

                          {record.liters.toFixed(2)} L

                        </span>

                      )}

                    </td>


                    {/* RECEITA */}

                    <td>

                      <span
                        className="revenue-value"
                      >

                        R${' '}

                        {(
                          (
                            editingId === record.id
                              ? Number(editLiters || 0)
                              : record.liters
                          ) *
                          (pricePerLiter ?? 0)
                        ).toFixed(2)}

                      </span>

                    </td>


                    {/* AÇÕES */}

                    <td>

                      <div className="table-actions">

                        {editingId ===
                        record.id ? (

                          <>

                            <button
                              className="save-btn"
                              onClick={() =>
                                saveEdit(
                                  record
                                )
                              }
                            >

                              Salvar

                            </button>


                            <button
                              className="cancel-btn"
                              onClick={() =>
                                setEditingId(
                                  null
                                )
                              }
                            >

                              Cancelar

                            </button>

                          </>

                        ) : (

                          <>

                            <button
                              className="edit-btn"
                              onClick={() =>
                                startEdit(
                                  record
                                )
                              }
                            >

                              Editar

                            </button>


                            <button
                              className="delete-btn"
                              onClick={() =>
                                removeRecord(
                                  record.id
                                )
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
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ================================= */}
      {/* ANIMAIS */}
      {/* ================================= */}

      <div
        className="sub-panel"
        style={{
          marginTop: 20,
        }}
      >

        <div className="table-header-production">

          <div>

            <h3>
              Animais cadastrados
            </h3>

            <span
              style={{
                fontSize: 12,
                color: '#8a847a',
              }}
            >

              {sortedCows.length}
              {' '}
              animal(is) encontrado(s).

            </span>

          </div>


          <input
            className="
              table-input
              search-production
            "
            value={search}
            onChange={e =>
              setSearch(
                e.target.value
              )
            }
            placeholder="🔎 Buscar nome ou ID"
          />

        </div>


        <div className="production-table-container">

          <table className="production-table">

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

              </tr>

            </thead>


            <tbody>

              {sortedCows.length === 0 && (

                <tr>

                  <td
                    colSpan={5}
                    className="empty-table"
                  >

                    🐄 Nenhum animal encontrado.

                  </td>

                </tr>

              )}


              {sortedCows.map(
                cow => (

                  <tr key={cow.id}>

                    {/* ANIMAL */}

                    <td>

                      <div className="animal-info">

                        <div
                          className="
                            animal-avatar-table
                          "
                        >

                          {cow.nome
                            .split(' ')
                            .map(
                              part =>
                                part[0]
                            )
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}

                        </div>


                        <div>

                          <span
                            className="animal-name"
                          >

                            {cow.nome}

                          </span>

                        </div>

                      </div>

                    </td>


                    {/* ID */}

                    <td>

                      <span
                        className="id-badge"
                      >

                        #{cow.id}

                      </span>

                    </td>


                    {/* RAÇA */}

                    <td>

                      {cow.raca ||
                        'Não informado'}

                    </td>


                    {/* LACTAÇÃO */}

                    <td>

                      {cow.lactacao
                        ? `${cow.lactacao}ª lactação`
                        : '-'}

                    </td>


                    {/* PRODUÇÃO */}

                    <td>

                      <span
                        className="
                          production-value
                        "
                      >

                        {cow.litros} L

                      </span>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </Card>
  )
}