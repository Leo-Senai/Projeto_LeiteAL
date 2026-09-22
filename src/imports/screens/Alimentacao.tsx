import { useMemo, useState } from 'react'
import Card from '../components/Card'

/* =========================================================
   TIPOS
========================================================= */

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

type FeedUnit =
  | 'kg'
  | 'sacas'
  | 'toneladas'
  | 'litros'

type FeedItem = {
  id: number
  name: string
  category: FeedCategory
  quantity: number
  unit: FeedUnit
  value: number
  date: string
  lote: string
  estoqueMinimo: number
}

type Transaction = {
  id?: number
  desc: string
  amount: number
  type: 'receita' | 'despesa'
  category?: string
  date?: string
}

interface AlimentacaoProps {
  onAddTransaction?: (
    transaction: Omit<Transaction, 'id'>
  ) => void
}

/* =========================================================
   CATEGORIAS
========================================================= */

const categories: {
  name: FeedCategory
  title: string
  description: string
  image: string
}[] = [
    {
      name: 'Ração / Concentrado',
      title: 'Ração',
      description:
        'Rações e concentrados utilizados na alimentação do rebanho.',
      image:
        'src/images/pro-leite-g.png.webp'
    },

    {
      name: 'Silagem',
      title: 'Silagem',
      description:
        'Controle da silagem utilizada na alimentação do rebanho.',
      image:
        'src/images/silagem-600x399.jpg'
    },

    {
      name: 'Feno',
      title: 'Feno',
      description:
        'Controle de feno armazenado e utilizado.',
      image:
      'src/images/262976-1.webp'},

    {
      name: 'Pasto',
      title: 'Pasto',
      description:
        'Controle da alimentação realizada em pastagem.',
      image:
        'src/images/marandu-1-scaled.jpg',
    },

    {
      name: 'Suplemento proteico',
      title: 'Suplementos',
      description:
        'Suplementos utilizados para complementar a alimentação.',
      image:
        'src/images/suplemento.webp',
    },

    {
      name: 'Sal mineral',
      title: 'Sal mineral',
      description:
        'Controle de sal mineral utilizado no rebanho.',
      image:
        'src/images/sal.jpg',
    },

    {
      name: 'Núcleo mineral/vitamínico',
      title: 'Núcleo',
      description:
        'Controle de minerais e vitaminas utilizados.',
      image:
        'src/images/nucleo.jpg',
    },

    {
      name: 'Aditivos',
      title: 'Aditivos',
      description:
        'Produtos e aditivos utilizados na alimentação.',
      image:
        'src/images/aditivo.jpg',
    },

    {
      name: 'Outros',
      title: 'Outros',
      description:
        'Outros produtos relacionados à alimentação.',
      image:
        'src/images/mais.jpg',
    },
  ]

/* =========================================================
   FORMATAÇÃO
========================================================= */

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function getToday() {
  return new Date()
    .toISOString()
    .split('T')[0]
}

function formatDate(date: string) {
  if (!date) return '-'

  const parts = date.split('-')

  if (parts.length !== 3) {
    return date
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function Alimentacao({
  onAddTransaction,
}: AlimentacaoProps) {

  /* =======================================================
     DADOS
  ======================================================= */

  const [feeds, setFeeds] =
    useState<FeedItem[]>([
      {
        id: 1,
        name: 'Ração 18%',
        category: 'Ração / Concentrado',
        quantity: 320,
        unit: 'kg',
        value: 2400,
        date: '2026-09-10',
        lote: 'Lote Lactação',
        estoqueMinimo: 100,
      },

      {
        id: 2,
        name: 'Silagem de milho',
        category: 'Silagem',
        quantity: 180,
        unit: 'sacas',
        value: 1800,
        date: '2026-09-08',
        lote: 'Lote Lactação',
        estoqueMinimo: 50,
      },

      {
        id: 3,
        name: 'Sal mineral',
        category: 'Sal mineral',
        quantity: 50,
        unit: 'kg',
        value: 350,
        date: '2026-09-05',
        lote: 'Todos os animais',
        estoqueMinimo: 20,
      },
    ])

  /* =======================================================
     CONTROLE DAS TELAS
  ======================================================= */

  const [selectedCategory, setSelectedCategory] =
    useState<FeedCategory | null>(null)

  const [showSecondScreen, setShowSecondScreen] =
    useState(false)

  /* =======================================================
     FORMULÁRIO
  ======================================================= */

  const [showForm, setShowForm] =
    useState(false)

  const [editingId, setEditingId] =
    useState<number | null>(null)

  const [name, setName] =
    useState('')

  const [quantity, setQuantity] =
    useState('')

  const [unit, setUnit] =
    useState<FeedUnit>('kg')

  const [value, setValue] =
    useState('')

  const [date, setDate] =
    useState(getToday())

  const [lote, setLote] =
    useState('')

  const [estoqueMinimo, setEstoqueMinimo] =
    useState('')

  /* =======================================================
     MÉTRICAS
  ======================================================= */

  const totalCost = useMemo(() => {
    return feeds.reduce(
      (total, item) =>
        total + item.value,
      0
    )
  }, [feeds])

  const totalItems = feeds.length

  const lowStock = useMemo(() => {
    return feeds.filter(
      item =>
        item.quantity <=
        item.estoqueMinimo
    ).length
  }, [feeds])

  /* =======================================================
     ITENS DA CATEGORIA
  ======================================================= */

  const selectedItems = useMemo(() => {

    if (!selectedCategory) {
      return []
    }

    return feeds.filter(
      item =>
        item.category ===
        selectedCategory
    )

  }, [
    feeds,
    selectedCategory,
  ])

  /* =======================================================
     TOTAL DA CATEGORIA
  ======================================================= */

  const selectedCategoryTotal =
    useMemo(() => {

      return selectedItems.reduce(
        (total, item) =>
          total + item.value,
        0
      )

    }, [selectedItems])

  /* =======================================================
     SELECIONAR CATEGORIA
  ======================================================= */

  function selectCategory(
    categoryName: FeedCategory
  ) {

    setSelectedCategory(
      categoryName
    )

    setShowSecondScreen(
      true
    )

    setShowForm(
      false
    )

    setEditingId(
      null
    )

  }

  /* =======================================================
     VOLTAR
  ======================================================= */

  function backToCategories() {

    setShowSecondScreen(
      false
    )

    setShowForm(
      false
    )

    setEditingId(
      null
    )

  }

  /* =======================================================
     LIMPAR FORMULÁRIO
  ======================================================= */

  function clearForm() {

    setName('')
    setQuantity('')
    setUnit('kg')
    setValue('')
    setDate(getToday())
    setLote('')
    setEstoqueMinimo('')

  }

  /* =======================================================
     ABRIR ADICIONAR
  ======================================================= */

  function openAddForm() {

    clearForm()

    setEditingId(
      null
    )

    if (selectedCategory) {
      // A categoria já vem selecionada
    }

    setShowForm(
      true
    )

  }

  /* =======================================================
     ADICIONAR ALIMENTO
  ======================================================= */

  function addFeed() {

    if (!selectedCategory) {
      return
    }

    if (
      !name.trim() ||
      !quantity ||
      !value ||
      !lote.trim()
    ) {

      alert(
        'Preencha os campos obrigatórios.'
      )

      return
    }

    const numericQuantity =
      Number(
        quantity.replace(',', '.')
      )

    const numericValue =
      Number(
        value.replace(',', '.')
      )

    const numericMin =
      Number(
        estoqueMinimo.replace(',', '.')
      ) || 0

    if (
      isNaN(numericQuantity) ||
      isNaN(numericValue) ||
      numericQuantity <= 0 ||
      numericValue <= 0
    ) {

      alert(
        'Informe valores válidos.'
      )

      return
    }

    const newFeed: FeedItem = {
      id: Date.now(),

      name:
        name.trim(),

      category:
        selectedCategory,

      quantity:
        numericQuantity,

      unit,

      value:
        numericValue,

      date,

      lote:
        lote.trim(),

      estoqueMinimo:
        numericMin,
    }

    setFeeds(
      previous => [
        newFeed,
        ...previous,
      ]
    )

    /* Envia para o Financeiro */

    if (onAddTransaction) {

      onAddTransaction({
        desc:
          `Alimentação: ${newFeed.name}`,

        amount:
          newFeed.value,

        type:
          'despesa',

        category:
          'Alimentação',

        date:
          newFeed.date,
      })

    }

    clearForm()

    setShowForm(
      false
    )

    alert(
      'Alimento cadastrado com sucesso!'
    )
  }

  /* =======================================================
     INICIAR EDIÇÃO
  ======================================================= */

  function startEdit(
    feed: FeedItem
  ) {

    setEditingId(
      feed.id
    )

    setName(
      feed.name
    )

    setQuantity(
      String(feed.quantity)
    )

    setUnit(
      feed.unit
    )

    setValue(
      String(feed.value)
    )

    setDate(
      feed.date
    )

    setLote(
      feed.lote
    )

    setEstoqueMinimo(
      String(
        feed.estoqueMinimo
      )
    )

    setShowForm(
      true
    )

  }

  /* =======================================================
     SALVAR EDIÇÃO
  ======================================================= */

  function saveEdit() {

    if (
      editingId === null
    ) {
      return
    }

    if (
      !name.trim() ||
      !quantity ||
      !value ||
      !lote.trim()
    ) {

      alert(
        'Preencha os campos obrigatórios.'
      )

      return
    }

    const numericQuantity =
      Number(
        quantity.replace(',', '.')
      )

    const numericValue =
      Number(
        value.replace(',', '.')
      )

    const numericMin =
      Number(
        estoqueMinimo.replace(',', '.')
      ) || 0

    if (
      isNaN(numericQuantity) ||
      isNaN(numericValue)
    ) {

      alert(
        'Informe valores válidos.'
      )

      return
    }

    setFeeds(
      previous =>
        previous.map(
          item => {

            if (
              item.id !==
              editingId
            ) {
              return item
            }

            return {
              ...item,

              name:
                name.trim(),

              category:
                selectedCategory ??
                item.category,

              quantity:
                numericQuantity,

              unit,

              value:
                numericValue,

              date,

              lote:
                lote.trim(),

              estoqueMinimo:
                numericMin,
            }

          }
        )
    )

    clearForm()

    setEditingId(
      null
    )

    setShowForm(
      false
    )

    alert(
      'Alimento atualizado com sucesso!'
    )
  }

  /* =======================================================
     REMOVER
  ======================================================= */

  function removeFeed(
    id: number
  ) {

    const feed =
      feeds.find(
        item =>
          item.id === id
      )

    if (!feed) {
      return
    }

    const confirmed =
      window.confirm(
        `Deseja realmente remover "${feed.name}"?`
      )

    if (!confirmed) {
      return
    }

    setFeeds(
      previous =>
        previous.filter(
          item =>
            item.id !== id
        )
    )

  }

  /* =======================================================
     CATEGORIA SELECIONADA
  ======================================================= */

  const selectedCategoryInfo =
    categories.find(
      item =>
        item.name ===
        selectedCategory
    )

  /* =======================================================
     TELA
  ======================================================= */

  return (
    <Card>

      {/* =====================================================
          TELA 1 — CATEGORIAS
      ===================================================== */}

      {!showSecondScreen && (

        <>

          {/* CABEÇALHO */}

          <div
            className="section-header"
          >

            <div>

              <div className="eyebrow">
                ALIMENTAÇÃO
              </div>

              <h2>
                Controle alimentar
              </h2>

              <p
                className="muted"
                style={{
                  marginTop: 5,
                }}
              >
                Selecione uma categoria
                para gerenciar os alimentos
                do rebanho.
              </p>

            </div>

          </div>


          {/* MÉTRICAS */}

          <div
            className="metric-grid"
            style={{
              marginTop: 24,
            }}
          >

            <div className="metric-card">

              <span className="label">
                Custo total
              </span>

              <strong>
                {formatCurrency(
                  totalCost
                )}
              </strong>

              <small>
                alimentação
              </small>

            </div>


            <div className="metric-card">

              <span className="label">
                Alimentos
              </span>

              <strong>
                {totalItems}
              </strong>

              <small>
                itens cadastrados
              </small>

            </div>


            <div className="metric-card">

              <span className="label">
                Estoque baixo
              </span>

              <strong>
                {lowStock}
              </strong>

              <small>
                itens em atenção
              </small>

            </div>

          </div>


          {/* =================================================
              CARDS
          ================================================= */}

          <div
            style={{
              display:
                'grid',

              gridTemplateColumns:
                'repeat(3, minmax(0, 1fr))',

              gap: 28,

              marginTop: 32,
            }}
          >

            {categories.map(
              (
                categoryItem,
                index
              ) => {

                const count =
                  feeds.filter(
                    feed =>
                      feed.category ===
                      categoryItem.name
                  ).length

                const total =
                  feeds
                    .filter(
                      feed =>
                        feed.category ===
                        categoryItem.name
                    )
                    .reduce(
                      (
                        sum,
                        feed
                      ) =>
                        sum +
                        feed.value,
                      0
                    )

                return (

                  <div
                    key={
                      categoryItem.name
                    }
                    style={{
                      background:
                        '#ffffff',

                      border:
                        '1px solid #ddd8cf',

                      borderRadius:
                        12,

                      overflow:
                        'hidden',

                      boxShadow:
                        '0 5px 20px rgba(0,0,0,0.07)',

                      minHeight:
                        370,

                      display:
                        'flex',

                      flexDirection:
                        'column',
                    }}
                  >

                    {/* IMAGEM */}

                    <div
                      style={{
                        height:
                          205,

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
                          categoryItem.title
                        }
                        style={{
                          width:
                            '100%',

                          height:
                            '100%',

                          objectFit:
                            'cover',

                          display:
                            'block',
                        }}
                      />

                      {/* ESCURECIMENTO DA IMAGEM */}

                      <div
                        style={{
                          position:
                            'absolute',

                          inset:
                            0,

                          background:
                            'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.60))',
                        }}
                      />

                      {/* NÚMERO */}

                      <span
                        style={{
                          position:
                            'absolute',

                          left:
                            18,

                          top:
                            14,

                          fontSize:
                            42,

                          fontWeight:
                            800,

                          color:
                            'rgba(255,255,255,0.75)',

                          lineHeight:
                            1,
                        }}
                      >
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          '0'
                        )}
                      </span>


                      {/* NOME SOBRE IMAGEM */}

                      <div
                        style={{
                          position:
                            'absolute',

                          left:
                            20,

                          bottom:
                            18,

                          right:
                            20,
                        }}
                      >

                        <h3
                          style={{
                            margin:
                              0,

                            color:
                              '#ffffff',

                            fontSize:
                              24,

                            fontWeight:
                              800,
                          }}
                        >
                          {
                            categoryItem.title
                          }
                        </h3>

                      </div>

                    </div>


                    {/* CONTEÚDO */}

                    <div
                      style={{
                        padding:
                          '18px 20px',

                        display:
                          'flex',

                        flexDirection:
                          'column',

                        flex:
                          1,
                      }}
                    >

                      <p
                        style={{
                          margin:
                            0,

                          color:
                            '#7a7568',

                          fontSize:
                            13,

                          lineHeight:
                            1.5,

                          minHeight:
                            40,
                        }}
                      >
                        {
                          categoryItem.description
                        }
                      </p>


                      {/* RESUMO */}

                      <div
                        style={{
                          display:
                            'flex',

                          justifyContent:
                            'space-between',

                          alignItems:
                            'center',

                          marginTop:
                            12,
                        }}
                      >

                        <div>

                          <strong
                            style={{
                              display:
                                'block',

                              color:
                                '#1b5e35',

                              fontSize:
                                17,
                            }}
                          >
                            {formatCurrency(
                              total
                            )}
                          </strong>

                          <span
                            style={{
                              color:
                                '#8a857a',

                              fontSize:
                                11,
                            }}
                          >
                            {count}{' '}
                            item(ns)
                          </span>

                        </div>

                      </div>


                      {/* BOTÃO */}

                      <button
                        type="button"
                        onClick={() =>
                          selectCategory(
                            categoryItem.name
                          )
                        }
                        style={{
                          marginTop:
                            'auto',

                          padding:
                            '12px 20px',

                          width:
                            '100%',

                          border:
                            'none',

                          borderRadius:
                            5,

                          background:
                            '#1b5e35',

                          color:
                            '#ffffff',

                          fontSize:
                            13,

                          fontWeight:
                            700,

                          cursor:
                            'pointer',

                          letterSpacing:
                            '.3px',
                        }}
                      >
                        SELECIONAR
                      </button>

                    </div>

                  </div>

                )
              }
            )}

          </div>

        </>

      )}


      {/* =====================================================
          TELA 2 — GERENCIAMENTO
      ===================================================== */}

      {showSecondScreen && (

        <>

          {/* CABEÇALHO */}

          <div
            style={{
              display:
                'flex',

              justifyContent:
                'space-between',

              alignItems:
                'flex-start',

              gap:
                20,

              flexWrap:
                'wrap',
            }}
          >

            <div>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={
                  backToCategories
                }
                style={{
                  marginBottom:
                    12,
                }}
              >
                ← Voltar
              </button>

              <div className="eyebrow">
                ALIMENTAÇÃO
              </div>

              <h2
                style={{
                  marginTop:
                    4,
                }}
              >
                {
                  selectedCategoryInfo?.title
                }
              </h2>

              <p className="muted">
                {
                  selectedCategoryInfo?.description
                }
              </p>

              {selectedCategoryInfo && (
                <img
                  src={selectedCategoryInfo.image}
                  alt={`Imagem de ${selectedCategoryInfo.title}`}
                  style={{
                    width: 260,
                    height: 112,
                    marginTop: 16,
                    borderRadius: 10,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              )}

            </div>


            <button
              type="button"
              className="btn btn-primary"
              onClick={
                openAddForm
              }
            >
              + Adicionar alimento
            </button>

          </div>


          {/* =================================================
              RESUMO DA CATEGORIA
          ================================================= */}

          <div
            className="metric-grid"
            style={{
              marginTop:
                24,
            }}
          >

            <div className="metric-card">

              <span className="label">
                Alimentos
              </span>

              <strong>
                {
                  selectedItems.length
                }
              </strong>

              <small>
                cadastrados
              </small>

            </div>


            <div className="metric-card">

              <span className="label">
                Custo
              </span>

              <strong>
                {formatCurrency(
                  selectedCategoryTotal
                )}
              </strong>

              <small>
                categoria
              </small>

            </div>


            <div className="metric-card">

              <span className="label">
                Estoque baixo
              </span>

              <strong>
                {
                  selectedItems.filter(
                    item =>
                      item.quantity <=
                      item.estoqueMinimo
                  ).length
                }
              </strong>

              <small>
                itens em atenção
              </small>

            </div>

          </div>


          {/* =================================================
              FORMULÁRIO
          ================================================= */}

          {showForm && (

            <div
              className="sub-panel"
              style={{
                marginTop:
                  25,

                border:
                  '2px solid #1b5e35',
              }}
            >

              <div className="eyebrow">
                {editingId !== null
                  ? 'EDIÇÃO'
                  : 'NOVO REGISTRO'}
              </div>

              <h3>
                {editingId !== null
                  ? 'Editar alimento'
                  : 'Adicionar alimento'}
              </h3>


              <div
                className="controls"
                style={{
                  marginTop:
                    18,
                }}
              >

                {/* NOME */}

                <input
                  className="input"
                  placeholder="Nome do alimento"
                  value={
                    name
                  }
                  onChange={e =>
                    setName(
                      e.target.value
                    )
                  }
                />


                {/* QUANTIDADE */}

                <input
                  className="input"
                  placeholder="Quantidade"
                  value={
                    quantity
                  }
                  onChange={e =>
                    setQuantity(
                      e.target.value
                    )
                  }
                />


                {/* UNIDADE */}

                <select
                  className="input"
                  value={
                    unit
                  }
                  onChange={e =>
                    setUnit(
                      e.target.value as FeedUnit
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
                  placeholder="Valor total (R$)"
                  value={
                    value
                  }
                  onChange={e =>
                    setValue(
                      e.target.value
                    )
                  }
                />


                {/* DATA */}

                <input
                  className="input"
                  type="date"
                  value={
                    date
                  }
                  onChange={e =>
                    setDate(
                      e.target.value
                    )
                  }
                />


                {/* LOTE */}

                <input
                  className="input"
                  placeholder="Lote / Rebanho"
                  value={
                    lote
                  }
                  onChange={e =>
                    setLote(
                      e.target.value
                    )
                  }
                />


                {/* ESTOQUE MÍNIMO */}

                <input
                  className="input"
                  placeholder="Estoque mínimo"
                  value={
                    estoqueMinimo
                  }
                  onChange={e =>
                    setEstoqueMinimo(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* BOTÕES FORMULÁRIO */}

              <div
                style={{
                  display:
                    'flex',

                  gap:
                    10,

                  marginTop:
                    18,

                  flexWrap:
                    'wrap',
                }}
              >

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={
                    editingId !== null
                      ? saveEdit
                      : addFeed
                  }
                >
                  {editingId !== null
                    ? 'Salvar alterações'
                    : 'Cadastrar alimento'}
                </button>


                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {

                    clearForm()

                    setEditingId(
                      null
                    )

                    setShowForm(
                      false
                    )

                  }}
                >
                  Cancelar
                </button>

              </div>

            </div>

          )}


          {/* =================================================
              LISTA
          ================================================= */}

          <div
            style={{
              marginTop:
                30,
            }}
          >

            <div
              style={{
                display:
                  'flex',

                justifyContent:
                  'space-between',

                alignItems:
                  'center',

                marginBottom:
                  15,
              }}
            >

              <div>

                <div className="eyebrow">
                  REGISTROS
                </div>

                <h3>
                  Alimentos cadastrados
                </h3>

              </div>

              <span className="muted">
                {
                  selectedItems.length
                }{' '}
                registro(s)
              </span>

            </div>


            {/* SEM ITENS */}

            {selectedItems.length ===
              0 && (

                <div
                  className="sub-panel"
                  style={{
                    textAlign:
                      'center',

                    padding:
                      50,
                  }}
                >

                  {selectedCategoryInfo && (
                    <img
                      src={selectedCategoryInfo.image}
                      alt={`Imagem de ${selectedCategoryInfo.title}`}
                      style={{
                        width: 120,
                        height: 80,
                        borderRadius: 10,
                        objectFit: 'cover',
                        display: 'block',
                        margin: '0 auto 18px',
                      }}
                    />
                  )}

                  <h3>
                    Nenhum alimento
                    cadastrado
                  </h3>

                  <p className="muted">
                    Cadastre o primeiro
                    alimento desta
                    categoria.
                  </p>

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      marginTop:
                        12,
                    }}
                    onClick={
                      openAddForm
                    }
                  >
                    + Adicionar alimento
                  </button>

                </div>

              )}


            {/* =================================================
                CARDS DOS ALIMENTOS
            ================================================= */}

            <div
              style={{
                display:
                  'grid',

                gridTemplateColumns:
                  'repeat(auto-fit, minmax(300px, 1fr))',

                gap:
                  20,
              }}
            >

              {selectedItems.map(
                feed => {

                  const isLow =
                    feed.quantity <=
                    feed.estoqueMinimo

                  const feedImage =
                    categories.find(
                      category =>
                        category.name === feed.category
                    )?.image

                  return (

                    <div
                      key={
                        feed.id
                      }
                      style={{
                        background:
                          '#ffffff',

                        border:
                          isLow
                            ? '2px solid #d48b2a'
                            : '1px solid #e0ddd7',

                        borderRadius:
                          10,

                        padding:
                          22,

                        boxShadow:
                          '0 4px 14px rgba(0,0,0,0.06)',
                      }}
                    >

                      {/* CABEÇALHO DO CARD */}

                      {feedImage && (
                        <img
                          src={feedImage}
                          alt={`Imagem de ${feed.category}`}
                          style={{
                            width: '100%',
                            height: 120,
                            marginBottom: 18,
                            borderRadius: 8,
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      )}

                      <div
                        style={{
                          display:
                            'flex',

                          justifyContent:
                            'space-between',

                          alignItems:
                            'flex-start',

                          gap:
                            12,
                        }}
                      >

                        <div>

                          <div
                            style={{
                              fontSize:
                                11,

                              color:
                                '#7a7568',

                              textTransform:
                                'uppercase',

                              fontWeight:
                                700,

                              letterSpacing:
                                '.5px',
                            }}
                          >
                            {
                              feed.category
                            }
                          </div>

                          <h3
                            style={{
                              marginTop:
                                5,
                            }}
                          >
                            {
                              feed.name
                            }
                          </h3>

                        </div>


                        {isLow && (

                          <span
                            style={{
                              padding:
                                '6px 9px',

                              borderRadius:
                                5,

                              background:
                                '#fff1dc',

                              color:
                                '#a96412',

                              fontSize:
                                10,

                              fontWeight:
                                700,

                              whiteSpace:
                                'nowrap',
                            }}
                          >
                            ESTOQUE BAIXO
                          </span>

                        )}

                      </div>


                      {/* LOTE */}

                      <p
                        className="muted"
                        style={{
                          marginTop:
                            5,
                        }}
                      >
                        Lote: {
                          feed.lote
                        }
                      </p>


                      {/* DADOS */}

                      <div
                        style={{
                          display:
                            'grid',

                          gridTemplateColumns:
                            '1fr 1fr',

                          gap:
                            16,

                          marginTop:
                            20,

                          padding:
                            '15px 0',

                          borderTop:
                            '1px solid #eeeae3',

                          borderBottom:
                            '1px solid #eeeae3',
                        }}
                      >

                        <div>

                          <small className="muted">
                            Quantidade
                          </small>

                          <strong
                            style={{
                              display:
                                'block',

                              marginTop:
                                4,

                              fontSize:
                                18,
                            }}
                          >
                            {
                              feed.quantity
                            }{' '}
                            {
                              feed.unit
                            }
                          </strong>

                        </div>


                        <div>

                          <small className="muted">
                            Custo
                          </small>

                          <strong
                            style={{
                              display:
                                'block',

                              marginTop:
                                4,

                              fontSize:
                                18,

                              color:
                                '#1b5e35',
                            }}
                          >
                            {formatCurrency(
                              feed.value
                            )}
                          </strong>

                        </div>


                        <div>

                          <small className="muted">
                            Data
                          </small>

                          <strong
                            style={{
                              display:
                                'block',

                              marginTop:
                                4,
                            }}
                          >
                            {formatDate(
                              feed.date
                            )}
                          </strong>

                        </div>


                        <div>

                          <small className="muted">
                            Estoque mínimo
                          </small>

                          <strong
                            style={{
                              display:
                                'block',

                              marginTop:
                                4,
                            }}
                          >
                            {
                              feed.estoqueMinimo
                            }{' '}
                            {
                              feed.unit
                            }
                          </strong>

                        </div>

                      </div>


                      {/* BOTÕES */}

                      <div
                        style={{
                          display:
                            'grid',

                          gridTemplateColumns:
                            '1fr 1fr',

                          gap:
                            10,

                          marginTop:
                            18,
                        }}
                      >

                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            startEdit(
                              feed
                            )
                          }
                        >
                          ✏️ Editar
                        </button>


                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() =>
                            removeFeed(
                              feed.id
                            )
                          }
                        >
                          🗑 Remover
                        </button>

                      </div>

                    </div>

                  )
                }
              )}

            </div>

          </div>

        </>

      )}

    </Card>
  )
}
