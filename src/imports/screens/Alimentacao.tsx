import { useState } from 'react'
import Card from '../components/Card'

type FeedCategory =
  | 'Ração / Concentrado'
  | 'Silagem'
  | 'Feno'
  | 'Pasto'
  | 'Suplemento proteico'
  | 'Sal mineral'
  | 'Núcleo mineral/vitamínico'
  | 'Aditivos'
  | 'Outros'

type FeedItem = {
  id: number
  name: string
  category: FeedCategory
  quantity: number
  unit: 'kg' | 'sacas' | 'toneladas' | 'litros'
  value: number
}

const feedCategories: FeedCategory[] = [
  'Ração / Concentrado',
  'Silagem',
  'Feno',
  'Pasto',
  'Suplemento proteico',
  'Sal mineral',
  'Núcleo mineral/vitamínico',
  'Aditivos',
  'Outros',
]

export default function Alimentacao() {
  const [feeds, setFeeds] = useState<FeedItem[]>([
    {
      id: 1,
      name: 'Ração 18%',
      category: 'Ração / Concentrado',
      quantity: 320,
      unit: 'kg',
      value: 2400,
    },
    {
      id: 2,
      name: 'Silagem de milho',
      category: 'Silagem',
      quantity: 180,
      unit: 'sacas',
      value: 1800,
    },
    {
      id: 3,
      name: 'Sal mineral',
      category: 'Sal mineral',
      quantity: 50,
      unit: 'kg',
      value: 350,
    },
  ])

  const [name, setName] = useState('')
  const [category, setCategory] =
    useState<FeedCategory>('Ração / Concentrado')

  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] =
    useState<FeedItem['unit']>('kg')

  const [value, setValue] = useState('')

  const [editingCategory, setEditingCategory] =
    useState<FeedCategory | null>(null)

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  // ==============================
  // ADICIONAR ALIMENTAÇÃO
  // ==============================

  function addFeed() {
    if (!name || !quantity || !value) {
      alert('Preencha todos os campos.')
      return
    }

    const numericQuantity = Number(
      quantity.replace(',', '.')
    )

    const numericValue = Number(
      value.replace(',', '.')
    )

    if (
      isNaN(numericQuantity) ||
      isNaN(numericValue) ||
      numericQuantity <= 0 ||
      numericValue <= 0
    ) {
      alert('Informe valores válidos.')
      return
    }

    const newFeed: FeedItem = {
      id: Date.now(),
      name,
      category,
      quantity: numericQuantity,
      unit,
      value: numericValue,
    }

    setFeeds(prev => [
      newFeed,
      ...prev,
    ])

    setName('')
    setQuantity('')
    setValue('')
  }

  // ==============================
  // REMOVER
  // ==============================

  function removeFeed(id: number) {
    setFeeds(prev =>
      prev.filter(feed => feed.id !== id)
    )
  }

  // ==============================
  // EDITAR ITEM
  // ==============================

  function editFeed(id: number) {
    const feed = feeds.find(
      item => item.id === id
    )

    if (!feed) return

    const newName = window.prompt(
      'Nome do alimento:',
      feed.name
    )

    const newQuantity = window.prompt(
      'Quantidade:',
      String(feed.quantity)
    )

    const newValue = window.prompt(
      'Valor total:',
      String(feed.value)
    )

    if (
      !newName ||
      !newQuantity ||
      !newValue
    ) {
      return
    }

    const numericQuantity = Number(
      newQuantity.replace(',', '.')
    )

    const numericValue = Number(
      newValue.replace(',', '.')
    )

    if (
      isNaN(numericQuantity) ||
      isNaN(numericValue)
    ) {
      return
    }

    setFeeds(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              name: newName,
              quantity: numericQuantity,
              value: numericValue,
            }
          : item
      )
    )
  }

  // ==============================
  // TOTAL POR CATEGORIA
  // ==============================

  function getCategoryTotal(
    categoryName: FeedCategory
  ) {
    return feeds
      .filter(
        feed =>
          feed.category === categoryName
      )
      .reduce(
        (total, feed) =>
          total + feed.value,
        0
      )
  }

  // ==============================
  // TOTAL DA ALIMENTAÇÃO
  // ==============================

  const totalFeedCost = feeds.reduce(
    (total, feed) =>
      total + feed.value,
    0
  )

  return (
    <Card>

      {/* CABEÇALHO */}

      <div className="section-header">
        <div>
          <div className="eyebrow">
            Alimentação
          </div>

          <h2>
            Controle alimentar
          </h2>
        </div>

        <span className="status-pill warning">
          {feeds.length} registros
        </span>
      </div>

      <p className="muted">
        Controle dos alimentos consumidos pelo rebanho.
      </p>


      {/* MÉTRICAS */}

      <div className="metric-grid">

        <div className="metric-card">
          <span className="label">
            Custo total
          </span>

          <strong>
            {formatCurrency(totalFeedCost)}
          </strong>

          <small>
            alimentação registrada
          </small>
        </div>


        <div className="metric-card">
          <span className="label">
            Ração
          </span>

          <strong>
            {formatCurrency(
              getCategoryTotal(
                'Ração / Concentrado'
              )
            )}
          </strong>

          <small>
            custo registrado
          </small>
        </div>


        <div className="metric-card">
          <span className="label">
            Silagem
          </span>

          <strong>
            {formatCurrency(
              getCategoryTotal(
                'Silagem'
              )
            )}
          </strong>

          <small>
            custo registrado
          </small>
        </div>

      </div>


      {/* ADICIONAR */}

      <div
        className="sub-panel"
        style={{ marginTop: 18 }}
      >

        <h3>
          Adicionar alimentação
        </h3>

        <div className="controls">

          {/* CATEGORIA */}

          <select
            className="input"
            value={category}
            onChange={e =>
              setCategory(
                e.target.value as FeedCategory
              )
            }
          >

            {feedCategories.map(item => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}

          </select>


          {/* NOME */}

          <input
            className="input"
            value={name}
            onChange={e =>
              setName(e.target.value)
            }
            placeholder="Nome do alimento"
          />


          {/* QUANTIDADE */}

          <input
            className="input"
            value={quantity}
            onChange={e =>
              setQuantity(e.target.value)
            }
            placeholder="Quantidade"
          />


          {/* UNIDADE */}

          <select
            className="input"
            value={unit}
            onChange={e =>
              setUnit(
                e.target.value as FeedItem['unit']
              )
            }
          >

            <option value="kg">
              Quilogramas (kg)
            </option>

            <option value="sacas">
              Sacas
            </option>

            <option value="toneladas">
              Toneladas
            </option>

            <option value="litros">
              Litros
            </option>

          </select>


          {/* VALOR */}

          <input
            className="input"
            value={value}
            onChange={e =>
              setValue(e.target.value)
            }
            placeholder="Valor total (R$)"
          />


          <button
            className="btn btn-primary"
            onClick={addFeed}
          >
            Adicionar
          </button>

        </div>

      </div>


      {/* CATEGORIAS */}

      <div
        style={{
          marginTop: 24,
        }}
      >

        {feedCategories.map(
          categoryItem => {

            const items =
              feeds.filter(
                feed =>
                  feed.category ===
                  categoryItem
              )

            const total =
              getCategoryTotal(
                categoryItem
              )

            const isEditing =
              editingCategory ===
              categoryItem

            return (

              <div
                className="sub-panel"
                style={{
                  marginTop: 18,
                }}
                key={categoryItem}
              >

                {/* CABEÇALHO */}

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center',
                    marginBottom: 12,
                  }}
                >

                  <div>

                    <h3>
                      {categoryItem}
                    </h3>

                    <small
                      style={{
                        color:
                          '#726c62',
                      }}
                    >
                      Total:{' '}
                      {formatCurrency(
                        total
                      )}
                    </small>

                  </div>


                  <button
                    className="btn btn-ghost"
                    onClick={() =>
                      setEditingCategory(
                        isEditing
                          ? null
                          : categoryItem
                      )
                    }
                  >

                    {isEditing
                      ? 'Concluir'
                      : 'Editar'}

                  </button>

                </div>


                {/* SEM ITENS */}

                {items.length === 0 && (

                  <p className="muted">
                    Nenhum alimento registrado.
                  </p>

                )}


                {/* ITENS */}

                {items.length > 0 && (

                  <ul className="list">

                    {items.map(item => (

                      <li
                        key={item.id}
                      >

                        <div>

                          <strong>
                            {item.name}
                          </strong>

                          <div
                            style={{
                              color:
                                '#726c62',
                              fontSize: 12,
                            }}
                          >

                            {item.quantity}{' '}
                            {item.unit}

                            {' • '}

                            {formatCurrency(
                              item.value
                            )}

                          </div>

                        </div>


                        {/* BOTÕES DE EDIÇÃO */}

                        {isEditing && (

                          <div
                            style={{
                              display:
                                'flex',
                              gap: 8,
                            }}
                          >

                            <button
                              className="
                                btn btn-ghost
                              "
                              onClick={() =>
                                editFeed(
                                  item.id
                                )
                              }
                            >
                              Alterar
                            </button>


                            <button
                              className="
                                btn btn-ghost
                              "
                              onClick={() =>
                                removeFeed(
                                  item.id
                                )
                              }
                            >
                              Remover
                            </button>

                          </div>

                        )}

                      </li>

                    ))}

                  </ul>

                )}

              </div>

            )
          }
        )}

      </div>

    </Card>
  )
}