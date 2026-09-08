import { useState } from 'react'
import Card from '../components/Card'

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

const categories: Category[] = [
  'Alimentação',
  'Mão de obra',
  'Sanidade e reprodução',
  'Energia e combustível',
  'Manutenção e depreciação',
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

  // Categoria que está sendo editada
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null)

  // Calcula o total de uma categoria
  function getCategoryTotal(categoryName: Category) {
    return plans
      .filter(plan => plan.category === categoryName)
      .reduce((total, plan) => total + plan.value, 0)
  }

  // Calcula o custo total
  const totalCost = plans.reduce(
    (total, plan) => total + plan.value,
    0
  )

  // Formatação em Real
  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  // Adicionar lançamento
  function addPlan() {
    if (!name || !value) return

    const numericValue = Number(
      value.replace(',', '.')
    )

    if (isNaN(numericValue) || numericValue <= 0) {
      return
    }

    setPlans(prev => [
      {
        id: Date.now(),
        name,
        value: numericValue,
        category,
      },
      ...prev,
    ])

    setName('')
    setValue('')
  }

  // Remover lançamento
  function removePlan(id: number) {
    setPlans(prev =>
      prev.filter(plan => plan.id !== id)
    )
  }

  // Editar lançamento
  function editPlan(id: number) {
    const plan = plans.find(
      plan => plan.id === id
    )

    if (!plan) return

    const newName = window.prompt(
      'Nome da despesa:',
      plan.name
    )

    const newValue = window.prompt(
      'Valor da despesa:',
      String(plan.value)
    )

    if (!newName || !newValue) return

    const numericValue = Number(
      newValue.replace(',', '.')
    )

    if (isNaN(numericValue) || numericValue <= 0) {
      return
    }

    setPlans(prev =>
      prev.map(plan =>
        plan.id === id
          ? {
              ...plan,
              name: newName,
              value: numericValue,
            }
          : plan
      )
    )
  }

  return (
    <Card>

      {/* CABEÇALHO */}
      <div className="section-header">
        <div>
          <div className="eyebrow">
            Custos da propriedade
          </div>

          <h2>Controle de custos</h2>
        </div>

        <span className="status-pill warning">
          {plans.length} lançamentos
        </span>
      </div>

      <p className="muted">
        Acompanhe os custos da propriedade por categoria.
      </p>

      {/* MÉTRICAS DINÂMICAS */}
      <div className="metric-grid">

        <div className="metric-card">
          <span className="label">
            Alimentação
          </span>

          <strong>
            {formatCurrency(
              getCategoryTotal('Alimentação')
            )}
          </strong>

          <small>
            custos registrados
          </small>
        </div>

        <div className="metric-card">
          <span className="label">
            Mão de obra
          </span>

          <strong>
            {formatCurrency(
              getCategoryTotal('Mão de obra')
            )}
          </strong>

          <small>
            custos registrados
          </small>
        </div>

        <div className="metric-card">
          <span className="label">
            Total
          </span>

          <strong>
            {formatCurrency(totalCost)}
          </strong>

          <small>
            custo total registrado
          </small>
        </div>

      </div>


      {/* ADICIONAR LANÇAMENTO */}
      <div
        className="sub-panel"
        style={{ marginTop: 18 }}
      >

        <h3>Adicionar custo</h3>

        <div className="controls">

          {/* CATEGORIA */}
          <select
            className="input"
            value={category}
            onChange={e =>
              setCategory(
                e.target.value as Category
              )
            }
          >

            {categories.map(categoryItem => (
              <option
                key={categoryItem}
                value={categoryItem}
              >
                {categoryItem}
              </option>
            ))}

          </select>


          {/* DESCRIÇÃO */}
          <input
            className="input"
            value={name}
            onChange={e =>
              setName(e.target.value)
            }
            placeholder="Descrição"
          />


          {/* VALOR */}
          <input
            className="input"
            value={value}
            onChange={e =>
              setValue(e.target.value)
            }
            placeholder="Valor (R$)"
          />


          {/* BOTÃO */}
          <button
            className="btn btn-primary"
            onClick={addPlan}
          >
            Adicionar
          </button>

        </div>

      </div>


      {/* CATEGORIAS */}
      <div style={{ marginTop: 24 }}>

        {categories.map(categoryItem => {

          const items = plans.filter(
            plan =>
              plan.category === categoryItem
          )

          const categoryTotal =
            getCategoryTotal(categoryItem)

          const isEditing =
            editingCategory === categoryItem

          return (

            <div
              className="sub-panel"
              style={{ marginTop: 18 }}
              key={categoryItem}
            >

              {/* CABEÇALHO DA CATEGORIA */}
              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >

                <div>

                  <h3>
                    {categoryItem}
                  </h3>

                  <small
                    style={{
                      color: '#726c62',
                    }}
                  >
                    Total:{' '}
                    {formatCurrency(
                      categoryTotal
                    )}
                  </small>

                </div>


                {/* BOTÃO EDITAR CATEGORIA */}
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


              {/* SEM LANÇAMENTOS */}
              {items.length === 0 && (

                <p className="muted">
                  Nenhum custo registrado nesta categoria.
                </p>

              )}


              {/* LISTA DE LANÇAMENTOS */}
              {items.length > 0 && (

                <ul className="list">

                  {items.map(item => (

                    <li key={item.id}>

                      <div>

                        <strong>
                          {item.name}
                        </strong>

                        <div
                          style={{
                            color: '#726c62',
                            fontSize: 12,
                          }}
                        >
                          {formatCurrency(
                            item.value
                          )}
                        </div>

                      </div>


                      {/* BOTÕES APARECEM APENAS AO EDITAR */}
                      {isEditing && (

                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                          }}
                        >

                          <button
                            className="btn btn-ghost"
                            onClick={() =>
                              editPlan(
                                item.id
                              )
                            }
                          >
                            Alterar
                          </button>


                          <button
                            className="btn btn-ghost"
                            onClick={() =>
                              removePlan(
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
        })}

      </div>

    </Card>
  )
}