import { useState } from 'react'
import Card from '../components/Card'

const G = '#1b5e35'
const G2 = '#154d2b'
const GL = '#e6f0ea'
const AM = '#d48b2a'
const BORDER = '#e0ddd7'
const MUTED = '#7a7568'
const TEXT = '#1a1a14'
const WHITE = '#ffffff'
const RED = '#c0392b'

type Category =
  | 'Alimentação'
  | 'Mão de obra'
  | 'Sanidade e reprodução'
  | 'Energia e combustível'
  | 'Manutenção e depreciação'

type Expense = {
  id: number
  name: string
  value: number
  category: Category
}

const categories: {
  name: Category
  image: string
  description: string
}[] = [
  {
    name: 'Alimentação',
    image:
      '../src/images/262976-1.webp',
    description:
      'Rações, silagem, concentrados, suplementos e outros alimentos.',
  },
  {
    name: 'Mão de obra',
    image:
      '../src/images/mão de obra.webp',
    description:
      'Custos relacionados aos funcionários e serviços da propriedade.',
  },
  {
    name: 'Sanidade e reprodução',
    image:
      '../src/images/sanidade.jpg',
    description:
      'Vacinação, medicamentos, inseminação e cuidados reprodutivos.',
  },
  {
    name: 'Energia e combustível',
    image:
      '../src/images/energia.webp',
    description:
      'Energia elétrica, diesel, gasolina e demais combustíveis.',
  },
  {
    name: 'Manutenção e depreciação',
    image:
      '../src/images/manutenção.webp',
    description:
      'Manutenção de máquinas, equipamentos, instalações e depreciação.',
  },
]

export default function Alimentacao() {
  const [plans, setPlans] = useState<Expense[]>([
    {
      id: 1,
      name: 'Ração 18%',
      value: 2400,
      category: 'Alimentação',
    },
    {
      id: 2,
      name: 'Silagem',
      value: 1800,
      category: 'Alimentação',
    },
    {
      id: 3,
      name: 'Funcionário',
      value: 2500,
      category: 'Mão de obra',
    },
    {
      id: 4,
      name: 'Vacinação',
      value: 850,
      category: 'Sanidade e reprodução',
    },
    {
      id: 5,
      name: 'Inseminação artificial',
      value: 600,
      category: 'Sanidade e reprodução',
    },
    {
      id: 6,
      name: 'Energia elétrica',
      value: 700,
      category: 'Energia e combustível',
    },
    {
      id: 7,
      name: 'Diesel',
      value: 1200,
      category: 'Energia e combustível',
    },
    {
      id: 8,
      name: 'Manutenção do trator',
      value: 900,
      category: 'Manutenção e depreciação',
    },
  ])

  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [category, setCategory] =
    useState<Category>('Alimentação')

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null)

  const [editingId, setEditingId] =
    useState<number | null>(null)

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function getCategoryTotal(
    categoryName: Category
  ) {
    return plans
      .filter(
        plan =>
          plan.category === categoryName
      )
      .reduce(
        (total, plan) =>
          total + plan.value,
        0
      )
  }

  const totalCost = plans.reduce(
    (total, plan) =>
      total + plan.value,
    0
  )

  function addPlan() {
    if (!name.trim() || !value) {
      alert('Preencha a descrição e o valor.')
      return
    }

    const numericValue = Number(
      value.replace(',', '.')
    )

    if (
      isNaN(numericValue) ||
      numericValue <= 0
    ) {
      alert('Informe um valor válido.')
      return
    }

    setPlans(prev => [
      {
        id: Date.now(),
        name: name.trim(),
        value: numericValue,
        category,
      },
      ...prev,
    ])

    setName('')
    setValue('')
  }

  function editPlan(id: number) {
    const plan = plans.find(
      item => item.id === id
    )

    if (!plan) return

    const newName = window.prompt(
      'Nome da despesa:',
      plan.name
    )

    if (!newName) return

    const newValue = window.prompt(
      'Valor da despesa:',
      String(plan.value)
    )

    if (!newValue) return

    const numericValue = Number(
      newValue.replace(',', '.')
    )

    if (
      isNaN(numericValue) ||
      numericValue <= 0
    ) {
      alert('Valor inválido.')
      return
    }

    setPlans(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              name: newName,
              value: numericValue,
            }
          : item
      )
    )
  }

  function removePlan(id: number) {
    const plan = plans.find(
      item => item.id === id
    )

    if (!plan) return

    const confirmacao = window.confirm(
      `Deseja remover "${plan.name}"?`
    )

    if (!confirmacao) return

    setPlans(prev =>
      prev.filter(
        item => item.id !== id
      )
    )
  }

  const selectedInfo =
    categories.find(
      item =>
        item.name === selectedCategory
    )

  const selectedPlans =
    plans.filter(
      plan =>
        plan.category ===
        selectedCategory
    )

  /*
   * =====================================================
   * SEGUNDA TELA
   * =====================================================
   */

  if (selectedCategory) {
    return (
      <Card>
        {/* VOLTAR */}

        <button
          onClick={() =>
            setSelectedCategory(null)
          }
          style={{
            border: `1px solid ${BORDER}`,
            background: WHITE,
            color: G,
            borderRadius: 7,
            padding: '9px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          ← Voltar
        </button>

        {/* CABEÇALHO */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: G,
                letterSpacing: 1,
              }}
            >
              CONTROLE DE CUSTOS
            </div>

            <h2
              style={{
                margin: '5px 0',
              }}
            >
              {selectedCategory}
            </h2>

            <p
              style={{
                margin: 0,
                color: MUTED,
              }}
            >
              {selectedInfo?.description}
            </p>
          </div>

          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: G,
            }}
          >
            {formatCurrency(
              getCategoryTotal(
                selectedCategory
              )
            )}
          </div>
        </div>

        {/* IMAGEM */}

        {selectedInfo && (
          <div
            style={{
              marginTop: 24,
              height: 220,
              borderRadius: 12,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src={selectedInfo.image}
              alt={selectedCategory}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,.65), transparent)',
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: 20,
                left: 22,
                color: WHITE,
              }}
            >
              <strong
                style={{
                  fontSize: 25,
                }}
              >
                {selectedCategory}
              </strong>

              <div
                style={{
                  marginTop: 4,
                  opacity: 0.9,
                }}
              >
                {selectedPlans.length}{' '}
                lançamento(s)
              </div>
            </div>
          </div>
        )}

        {/* ADICIONAR */}

        <div
          style={{
            marginTop: 24,
            padding: 20,
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            background: '#fafaf8',
          }}
        >
          <h3
            style={{
              marginTop: 0,
            }}
          >
            Adicionar custo
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 180px auto',
              gap: 12,
            }}
          >
            <input
              className="input"
              placeholder="Descrição do custo"
              value={name}
              onChange={e =>
                setName(e.target.value)
              }
            />

            <input
              className="input"
              placeholder="Valor (R$)"
              value={value}
              onChange={e =>
                setValue(e.target.value)
              }
            />

            <button
              className="btn btn-primary"
              onClick={() => {
                setCategory(
                  selectedCategory
                )
                addPlan()
              }}
            >
              + Adicionar
            </button>
          </div>
        </div>

        {/* LANÇAMENTOS */}

        <div
          style={{
            marginTop: 25,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <h3>
              Lançamentos
            </h3>

            <span
              style={{
                color: MUTED,
                fontSize: 13,
              }}
            >
              {selectedPlans.length}{' '}
              registro(s)
            </span>
          </div>

          {selectedPlans.length === 0 ? (
            <div
              style={{
                padding: 40,
                textAlign: 'center',
                border: `1px dashed ${BORDER}`,
                borderRadius: 10,
                color: MUTED,
              }}
            >
              Nenhum custo registrado
              nesta categoria.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gap: 12,
              }}
            >
              {selectedPlans.map(
                plan => (
                  <div
                    key={plan.id}
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems:
                        'center',
                      gap: 15,
                      padding:
                        '18px 20px',
                      border:
                        `1px solid ${BORDER}`,
                      borderRadius: 10,
                      background:
                        WHITE,
                    }}
                  >
                    <div>
                      <strong>
                        {plan.name}
                      </strong>

                      <div
                        style={{
                          marginTop: 5,
                          color: MUTED,
                          fontSize: 12,
                        }}
                      >
                        {selectedCategory}
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems:
                          'center',
                        gap: 15,
                      }}
                    >
                      <strong
                        style={{
                          color: G,
                        }}
                      >
                        {formatCurrency(
                          plan.value
                        )}
                      </strong>

                      <button
                        className="btn btn-ghost"
                        onClick={() =>
                          editPlan(
                            plan.id
                          )
                        }
                      >
                        ✏️ Editar
                      </button>

                      <button
                        className="btn btn-ghost"
                        style={{
                          color: RED,
                        }}
                        onClick={() =>
                          removePlan(
                            plan.id
                          )
                        }
                      >
                        🗑 Remover
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </Card>
    )
  }

  /*
   * =====================================================
   * PRIMEIRA TELA — CARDS
   * =====================================================
   */

  return (
    <Card>
      <div className="section-header">
        <div>
          <div className="eyebrow">
            CUSTOS DA PROPRIEDADE
          </div>

          <h2>
            Controle de custos
          </h2>

          <p className="muted">
            Selecione uma categoria
            para visualizar seus
            custos.
          </p>
        </div>

        <span className="status-pill warning">
          {plans.length} lançamentos
        </span>
      </div>

      {/* TOTAL */}

      <div
        style={{
          marginTop: 20,
          padding: '18px 22px',
          borderRadius: 10,
          background: GL,
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span
            style={{
              color: MUTED,
              fontSize: 12,
            }}
          >
            CUSTO TOTAL
          </span>

          <div
            style={{
              marginTop: 4,
              fontSize: 27,
              fontWeight: 700,
              color: G,
            }}
          >
            {formatCurrency(
              totalCost
            )}
          </div>
        </div>

        <div
          style={{
            fontSize: 35,
          }}
        >
          💰
        </div>
      </div>

      {/* CARDS DAS CATEGORIAS */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
          marginTop: 28,
        }}
      >
        {categories.map(
          categoryItem => {
            const total =
              getCategoryTotal(
                categoryItem.name
              )

            const count =
              plans.filter(
                plan =>
                  plan.category ===
                  categoryItem.name
              ).length

            return (
              <div
                key={
                  categoryItem.name
                }
                onClick={() =>
                  setSelectedCategory(
                    categoryItem.name
                  )
                }
                style={{
                  background: WHITE,
                  border:
                    `1px solid ${BORDER}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow:
                    '0 5px 18px rgba(0,0,0,.07)',
                  transition:
                    'transform .2s, box-shadow .2s',
                }}
              >
                {/* IMAGEM DO CARD */}

                <div
                  style={{
                    height: 210,
                    position:
                      'relative',
                    overflow:
                      'hidden',
                  }}
                >
                  <img
                    src={
                      categoryItem.image
                    }
                    alt={
                      categoryItem.name
                    }
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit:
                        'cover',
                    }}
                  />

                  <div
                    style={{
                      position:
                        'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top, rgba(0,0,0,.7), rgba(0,0,0,.05))',
                    }}
                  />

                  <div
                    style={{
                      position:
                        'absolute',
                      bottom: 18,
                      left: 20,
                      right: 20,
                      color: WHITE,
                    }}
                  >
                    <strong
                      style={{
                        fontSize: 22,
                      }}
                    >
                      {
                        categoryItem.name
                      }
                    </strong>

                    <div
                      style={{
                        marginTop: 5,
                        fontSize: 12,
                        opacity: 0.9,
                      }}
                    >
                      {count}{' '}
                      lançamento(s)
                    </div>
                  </div>
                </div>

                {/* INFORMAÇÕES */}

                <div
                  style={{
                    padding: 20,
                  }}
                >
                  <p
                    style={{
                      margin:
                        '0 0 18px',
                      color: MUTED,
                      fontSize: 13,
                      lineHeight: 1.5,
                      minHeight: 40,
                    }}
                  >
                    {
                      categoryItem.description
                    }
                  </p>

                  <div
                    style={{
                      display:
                        'flex',
                      justifyContent:
                        'space-between',
                      alignItems:
                        'center',
                    }}
                  >
                    <div>
                      <small
                        style={{
                          color:
                            MUTED,
                        }}
                      >
                        Total
                      </small>

                      <strong
                        style={{
                          display:
                            'block',
                          marginTop: 3,
                          color: G,
                          fontSize: 18,
                        }}
                      >
                        {formatCurrency(
                          total
                        )}
                      </strong>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation()

                        setSelectedCategory(
                          categoryItem.name
                        )
                      }}
                      style={{
                        background: G,
                        color: WHITE,
                        border: 'none',
                        borderRadius: 6,
                        padding:
                          '10px 16px',
                        fontWeight: 700,
                        cursor:
                          'pointer',
                      }}
                    >
                      Selecionar
                    </button>
                  </div>
                </div>
              </div>
            )
          }
        )}
      </div>
    </Card>
  )
}