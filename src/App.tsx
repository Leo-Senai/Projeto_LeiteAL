import { useState } from 'react'
import Login from './components/Login'
import { useAuth } from './contexts/AuthContext'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

import Rebanho from './imports/screens/Rebanho'
import Producao from './imports/screens/Producao'
import Reproducao from './imports/screens/Reproducao'
import Sanidade from './imports/screens/Sanidade'
import Alimentacao from './imports/screens/Alimentacao'
import Financeiro from './imports/screens/Financeiro'
import Agenda from './imports/screens/Agenda'
import Relatorios from './imports/screens/Relatorios'

// ─────────────────────────────────────────────────────────────────────────────
// CORES
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// DADOS DO DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

const producaoDias = [
  { dia: '21/07', litros: 1190 },
  { dia: '22/07', litros: 1210 },
  { dia: '23/07', litros: 1240 },
  { dia: '24/07', litros: 1198 },
  { dia: '25/07', litros: 1265 },
  { dia: '26/07', litros: 1278 },
  { dia: '27/07', litros: 1284 },
]

const producaoPorMes = [
  { periodo: 'Semana 1', atual: 8428, anterior: 8250 },
  { periodo: 'Semana 2', atual: 8634, anterior: 8420 },
  { periodo: 'Semana 3', atual: 8756, anterior: 8621 },
  { periodo: 'Semana 4', atual: 8920, anterior: 8745 },
]

const producaoPorAno = [
  { periodo: '2023', litros: 425600 },
  { periodo: '2024', litros: 438200 },
  { periodo: '2025', litros: 442800 },
]

const rebanhoData = [
  { name: 'Em lactação', value: 63, color: G },
  { name: 'Secas', value: 18, color: AM },
  { name: 'Novilhas', value: 12, color: '#4caf7d' },
  { name: 'Bezerras', value: 7, color: GL },
]

// ─────────────────────────────────────────────────────────────────────────────
// REBANHO INICIAL
// ─────────────────────────────────────────────────────────────────────────────

const initialVacas = [
  {
    id: '124',
    nome: 'Estrela',
    litros: 42,
    raca: 'Holandesa',
    lactacao: 3,
    tendencia: 'up',
    categoria: 'Em lactação',
  },
  {
    id: '078',
    nome: 'Mimosa',
    litros: 39,
    raca: 'Girolando',
    lactacao: 5,
    tendencia: 'up',
    categoria: 'Em lactação',
  },
  {
    id: '312',
    nome: 'Bonita',
    litros: 38,
    raca: 'Holandesa',
    lactacao: 2,
    tendencia: 'up',
    categoria: 'Em lactação',
  },
  {
    id: '201',
    nome: 'Flor',
    litros: 36,
    raca: 'Jersey',
    lactacao: 4,
    tendencia: 'down',
    categoria: 'Em lactação',
  },
  {
    id: '055',
    nome: 'Luna',
    litros: 34,
    raca: 'Girolando',
    lactacao: 3,
    tendencia: 'stable',
    categoria: 'Em lactação',
  },
  {
    id: '189',
    nome: 'Rosa',
    litros: 31,
    raca: 'Holandesa',
    lactacao: 6,
    tendencia: 'down',
    categoria: 'Em lactação',
  },
  {
    id: '090',
    nome: 'Marisa',
    litros: 0,
    raca: 'Holandesa',
    lactacao: 0,
    tendencia: 'stable',
    categoria: 'Secas',
  },
  {
    id: '156',
    nome: 'Bella',
    litros: 0,
    raca: 'Girolando',
    lactacao: 0,
    tendencia: 'stable',
    categoria: 'Secas',
  },
  {
    id: '223',
    nome: 'Princesa',
    litros: 15,
    raca: 'Jersey',
    lactacao: 1,
    tendencia: 'up',
    categoria: 'Novilhas',
  },
  {
    id: '334',
    nome: 'Doce',
    litros: 12,
    raca: 'Holandesa',
    lactacao: 1,
    tendencia: 'up',
    categoria: 'Novilhas',
  },
  {
    id: '445',
    nome: 'Branca',
    litros: 0,
    raca: 'Girolando',
    lactacao: 0,
    tendencia: 'stable',
    categoria: 'Bezerras',
  },
  {
    id: '556',
    nome: 'Preta',
    litros: 0,
    raca: 'Jersey',
    lactacao: 0,
    tendencia: 'stable',
    categoria: 'Bezerras',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// ALERTAS
// ─────────────────────────────────────────────────────────────────────────────

const alertas = [
  {
    tipo: 'danger',
    msg: 'Vaca 201 — queda de 18% na produção',
    detalhe: 'Verificar saúde',
  },
  {
    tipo: 'warning',
    msg: '3 vacas para secar nos próximos 7 dias',
    detalhe: 'Vacas 089, 134, 221',
  },
  {
    tipo: 'info',
    msg: 'Vaca 312 — diagnóstico de gestação amanhã',
    detalhe: '29/07 · 08:00',
  },
  {
    tipo: 'success',
    msg: 'Meta de julho atingida: 38.400 L',
    detalhe: '102% da meta',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// NAVEGAÇÃO
// ─────────────────────────────────────────────────────────────────────────────

const navItems = [
  { icon: '📊', label: 'Dashboard', id: 'dashboard' },
  { icon: '🐄', label: 'Rebanho', id: 'rebanho' },
  { icon: '🥛', label: 'Produção', id: 'producao' },
  { icon: '🤰', label: 'Reprodução', id: 'reproducao' },
  { icon: '💉', label: 'Sanidade', id: 'sanidade' },
  { icon: '🌽', label: 'Alimentação', id: 'alimentacao' },
  { icon: '💰', label: 'Financeiro', id: 'financeiro' },
  { icon: '📅', label: 'Agenda', id: 'agenda' },
  { icon: '📈', label: 'Relatórios', id: 'relatorios' },
]

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

type CategoriaVaca =
  | 'Em lactação'
  | 'Secas'
  | 'Novilhas'
  | 'Bezerras'

type Cow = {
  id: string
  nome: string
  litros: number
  raca?: string
  lactacao?: number
  tendencia?: string
  categoria?: CategoriaVaca
}

type ProductionRecord = {
  id: number
  date: string
  liters: number
  animal?: string
}

type Transaction = {
  id: number
  desc: string
  amount: number
  type: 'receita' | 'despesa'
}

const categoriaOptions: {
  label: string
  value: CategoriaVaca
}[] = [
  {
    label: 'Produz leite',
    value: 'Em lactação',
  },
  {
    label: 'Seca',
    value: 'Secas',
  },
  {
    label: 'Novilha',
    value: 'Novilhas',
  },
  {
    label: 'Bezerra',
    value: 'Bezerras',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// CARD DE ESTATÍSTICA
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  color = G,
}: {
  icon: string
  label: string
  value: string
  sub: string
  color?: string
}) {
  return (
    <div
      style={{
        backgroundColor: WHITE,
        border: `1px solid ${BORDER}`,
        borderRadius: '8px',
        padding: '20px 22px',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-xs font-medium"
          style={{ color: MUTED }}
        >
          {label}
        </span>

        <span style={{ fontSize: '1.2rem' }}>
          {icon}
        </span>
      </div>

      <div
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: '1.8rem',
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </div>

      <div
        className="text-xs mt-1"
        style={{ color: MUTED }}
      >
        {sub}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL IA
// ─────────────────────────────────────────────────────────────────────────────

function IAModal({
  onClose,
}: {
  onClose: () => void
}) {
  const [messages, setMessages] = useState<
    {
      from: 'ai' | 'user'
      text: string
    }[]
  >([
    {
      from: 'ai',
      text: 'Olá! Sou o assistente do Leite AL. Como posso ajudar hoje?',
    },
  ])

  const [input, setInput] = useState('')

  const respostas: Record<string, string> = {
    'qual vaca produziu mais':
      'A Vaca 124 (Estrela) possui a maior produção registrada: média de 42 L/dia.',

    'quais vacas precisam secar':
      'Existem vacas com necessidade de secagem registrada na agenda. Consulte a área de Reprodução.',

    lucro:
      'Consulte o módulo Financeiro para visualizar receitas, despesas e saldo.',

    'gasto com ração':
      'Consulte o módulo Alimentação para visualizar os gastos registrados.',

    'produção hoje':
      'A produção registrada hoje aparece no Dashboard e no módulo Produção.',
  }

  const send = () => {
    if (!input.trim()) return

    const question = input.trim()

    setMessages((prev) => [
      ...prev,
      {
        from: 'user',
        text: question,
      },
    ])

    setInput('')

    const key = Object.keys(respostas).find((item) =>
      question.toLowerCase().includes(item)
    )

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: 'ai',
          text:
            key
              ? respostas[key]
              : 'Posso ajudar com produção, rebanho, financeiro, reprodução, alimentação e sanidade.',
        },
      ])
    }, 500)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="w-full sm:w-[420px] flex flex-col"
        style={{
          backgroundColor: WHITE,
          borderRadius: '12px 12px 0 0',
          maxHeight: '70vh',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between p-4"
          style={{
            borderBottom: `1px solid ${BORDER}`,
            backgroundColor: G,
          }}
        >
          <div className="flex items-center gap-2">
            <span>🤖</span>

            <span
              className="font-semibold text-sm"
              style={{ color: CR }}
            >
              Assistente IA · Leite AL
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              color: 'rgba(245,240,232,0.7)',
              fontSize: '1.2rem',
            }}
          >
            ×
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
          style={{ minHeight: '200px' }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.from === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                style={{
                  backgroundColor:
                    message.from === 'user'
                      ? G
                      : GL,

                  color:
                    message.from === 'user'
                      ? CR
                      : TEXT,

                  padding: '10px 14px',

                  borderRadius:
                    message.from === 'user'
                      ? '12px 12px 2px 12px'
                      : '12px 12px 12px 2px',

                  maxWidth: '80%',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                }}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex gap-2 p-3"
          style={{
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send()
            }}
            placeholder="Pergunte sobre sua fazenda..."
            className="flex-1 text-sm outline-none"
            style={{
              backgroundColor: GL,
              border: `1px solid ${BORDER}`,
              borderRadius: '6px',
              padding: '10px 14px',
              color: TEXT,
            }}
          />

          <button
            onClick={send}
            style={{
              backgroundColor: G,
              color: CR,
              borderRadius: '6px',
              padding: '10px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const { user, logout } = useAuth()

  // Navegação
  const [activeNav, setActiveNav] =
    useState('dashboard')

  // Dashboard
  const [chartPeriod, setChartPeriod] =
    useState<'7dias' | 'mes' | 'ano'>('7dias')

  const [selectedRebanhoCategory, setSelectedRebanhoCategory] =
    useState<string | null>(null)

  // Dados compartilhados
  const [cows, setCows] =
    useState<Cow[]>(initialVacas)

  const [productionRecords, setProductionRecords] =
    useState<ProductionRecord[]>([])

  const [transactions, setTransactions] =
    useState<Transaction[]>([])

  // Configurações
  const [pricePerLiter, setPricePerLiter] =
    useState(2.84)

  // RFID
  const [showRfidReader, setShowRfidReader] =
    useState(false)

  const [rfidInput, setRfidInput] =
    useState('')

  const [rfidScanned, setRfidScanned] =
    useState<string | null>(null)

  const [registrandoVaca, setRegistrandoVaca] =
    useState(false)

  const [novaVacaForm, setNovaVacaForm] =
    useState<{
      nome: string
      raca: string
      lactacao: number
      categoria: CategoriaVaca
    }>({
      nome: '',
      raca: '',
      lactacao: 1,
      categoria: 'Em lactação',
    })

  const [rfidHistory, setRfidHistory] =
    useState<
      {
        rfid: string
        timestamp: string
        vaca?: string
      }[]
    >([])

  const [showRfidHistory, setShowRfidHistory] =
    useState(false)

  // IA
  const [showIA, setShowIA] =
    useState(false)

  // Menu
  const [sidebarOpen, setSidebarOpen] =
    useState(false)

  // Ordenha
  const [showOrdenha, setShowOrdenha] =
    useState(false)

  const [ordenhaLitros, setOrdenhaLitros] =
    useState('')

  const [ordenhaVaca, setOrdenhaVaca] =
    useState('')

  const [ordenhaCategoria, setOrdenhaCategoria] =
    useState<CategoriaVaca>('Em lactação')

  const [ordenhaRegistrada, setOrdenhaRegistrada] =
    useState(false)

  // ─────────────────────────────────────────────────────────────────────────
  // PRODUÇÃO
  // ─────────────────────────────────────────────────────────────────────────

  function addProductionRecord(
    record: {
      date: string
      liters: number
      animal?: string
    }
  ) {
    const newRecord: ProductionRecord = {
      ...record,
      id: Date.now(),
    }

    setProductionRecords((prev) => [
      ...prev,
      newRecord,
    ])

    // Atualiza produção da vaca
    if (record.animal) {
      setCows((prev) =>
        prev.map((cow) => {
          if (
            cow.id === record.animal ||
            cow.nome.toLowerCase() ===
              record.animal?.toLowerCase()
          ) {
            return {
              ...cow,
              litros: Number(
                (
                  cow.litros +
                  record.liters
                ).toFixed(2)
              ),
            }
          }

          return cow
        })
      )
    }

    // Cria receita automaticamente
    const revenue = Number(
      (
        record.liters *
        pricePerLiter
      ).toFixed(2)
    )

    const animal =
      cows.find(
        (cow) =>
          cow.id === record.animal
      )

    const animalName =
      animal?.nome ||
      record.animal ||
      ''

    const transaction: Transaction = {
      id: Date.now() + 1,

      desc:
        `Venda de leite${
          animalName
            ? ` · ${animalName}`
            : ''
        } · ${record.date}`,

      amount: revenue,

      type: 'receita',
    }

    setTransactions((prev) => [
      ...prev,
      transaction,
    ])
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REMOVER PRODUÇÃO
  // ─────────────────────────────────────────────────────────────────────────

  function removeProductionRecord(
    id: number
  ) {
    const record =
      productionRecords.find(
        (item) => item.id === id
      )

    setProductionRecords((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    )

    if (record) {
      setTransactions((prev) =>
        prev.filter(
          (transaction) =>
            !transaction.desc.includes(
              record.date
            )
        )
      )
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ADICIONAR VACA
  // ─────────────────────────────────────────────────────────────────────────

  function addCow(
    cow: {
      id?: string
      nome: string
      litros?: number
      raca?: string
      lactacao?: number
      tendencia?: string
      categoria?: CategoriaVaca
    }
  ) {
    const id =
      cow.id ||
      String(Date.now()).slice(-4)

    const newCow: Cow = {
      id,

      nome: cow.nome,

      litros:
        cow.litros ?? 0,

      raca:
        cow.raca,

      lactacao:
        cow.lactacao,

      tendencia:
        cow.tendencia,

      categoria:
        cow.categoria ??
        'Em lactação',
    }

    setCows((prev) => [
      ...prev,
      newCow,
    ])

    return id
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FINANCEIRO
  // ─────────────────────────────────────────────────────────────────────────

  function addTransaction(
    transaction: {
      desc: string
      amount: number
      type: 'receita' | 'despesa'
    }
  ) {
    setTransactions((prev) => [
      ...prev,
      {
        ...transaction,
        id: Date.now(),
      },
    ])
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REGISTRAR ORDENHA
  // ─────────────────────────────────────────────────────────────────────────

  function registrarOrdenha() {
    const litros =
      Number(ordenhaLitros)

    if (
      !ordenhaLitros ||
      Number.isNaN(litros) ||
      litros <= 0
    ) {
      alert(
        'Informe uma quantidade válida de litros.'
      )

      return
    }

    const today =
      new Date()
        .toISOString()
        .slice(0, 10)

    addProductionRecord({
      date: today,
      liters: litros,
      animal:
        ordenhaVaca ||
        undefined,
    })

    // Atualiza categoria da vaca
    if (ordenhaVaca.trim()) {
      const animalKey =
        ordenhaVaca.trim()

      setCows((prev) =>
        prev.map((cow) => {
          if (
            cow.id === animalKey ||
            cow.nome.toLowerCase() ===
              animalKey.toLowerCase()
          ) {
            return {
              ...cow,
              categoria:
                ordenhaCategoria,
            }
          }

          return cow
        })
      )
    }

    setOrdenhaRegistrada(true)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RFID
  // ─────────────────────────────────────────────────────────────────────────

  function handleRfidScan(
    rfidCode: string
  ) {
    const timestamp =
      new Date().toLocaleString(
        'pt-BR'
      )

    const existingCow =
      cows.find(
        (cow) =>
          cow.id === rfidCode
      )

    setRfidHistory((prev) => [
      ...prev,
      {
        rfid: rfidCode,
        timestamp,
        vaca: existingCow?.nome,
      },
    ])

    setRfidScanned(rfidCode)

    if (existingCow) {
      const litros =
        Number(
          (
            Math.random() * 15 +
            20
          ).toFixed(1)
        )

      addProductionRecord({
        date:
          new Date()
            .toISOString()
            .split('T')[0],

        liters: litros,

        animal: rfidCode,
      })

      alert(
        `✅ ${existingCow.nome} identificada! Ordenha registrada: ${litros} L`
      )

      setShowRfidReader(false)
    } else {
      setRegistrandoVaca(true)

      setNovaVacaForm({
        nome: '',
        raca: '',
        lactacao: 1,
        categoria:
          'Em lactação',
      })
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REGISTRAR NOVA VACA PELO RFID
  // ─────────────────────────────────────────────────────────────────────────

  function registrarNovaVacaRfid() {
    if (
      !rfidScanned ||
      !novaVacaForm.nome.trim()
    ) {
      alert(
        'Preencha o nome da vaca.'
      )

      return
    }

    const newCow: Cow = {
      id: rfidScanned,

      nome:
        novaVacaForm.nome,

      raca:
        novaVacaForm.raca,

      lactacao:
        novaVacaForm.lactacao,

      litros: 0,

      tendencia: 'stable',

      categoria:
        novaVacaForm.categoria,
    }

    setCows((prev) => [
      ...prev,
      newCow,
    ])

    setRfidHistory((prev) =>
      prev.map((item) =>
        item.rfid === rfidScanned
          ? {
              ...item,
              vaca:
                newCow.nome,
            }
          : item
      )
    )

    alert(
      `✅ Vaca "${newCow.nome}" registrada com sucesso!`
    )

    setShowRfidReader(false)
    setRegistrandoVaca(false)
    setRfidScanned(null)
    setRfidInput('')
  }

  // ─────────────────────────────────────────────────────────────────────────
  // COMPONENTE DA SEÇÃO
  // ─────────────────────────────────────────────────────────────────────────

  const sectionComponent = (() => {
    switch (activeNav) {
      // REBANHO
      case 'rebanho':
        return (
          <Rebanho
            data={rebanhoData}
            cows={cows}
          />
        )

      // PRODUÇÃO
      case 'producao':
        return (
          <Producao
            records={productionRecords}
            onAddRecord={
              addProductionRecord
            }
            onRemoveRecord={
              removeProductionRecord
            }
            onAddCow={addCow}
            pricePerLiter={
              pricePerLiter
            }
            setPricePerLiter={
              setPricePerLiter
            }
            rebanho={rebanhoData}
            cows={cows}
          />
        )

      // REPRODUÇÃO
      case 'reproducao':
        return (
          <Reproducao
            cows={cows}
          />
        )

      // SANIDADE
      // AGORA RECEBE AS MESMAS VACAS DO REBANHO
      case 'sanidade':
        return (
          <Sanidade
            cows={cows}
          />
        )

      // ALIMENTAÇÃO
      case 'alimentacao':
        return (
          <Alimentacao />
        )

      // FINANCEIRO
      // RECEBE AS MESMAS TRANSAÇÕES
      case 'financeiro':
        return (
          <Financeiro
            transactions={
              transactions
            }
            onAddTransaction={
              addTransaction
            }
          />
        )

      // AGENDA
      case 'agenda':
        return (
          <Agenda />
        )

      // RELATÓRIOS
      case 'relatorios':
        return (
          <Relatorios />
        )

      default:
        return null
    }
  })()

  // ─────────────────────────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────────────────────────

  if (!user) {
    return (
      <Login
        onSuccess={() => {
          // O AuthContext atualiza o usuário
        }}
      />
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INTERFACE
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: '#f0ede6',
        fontFamily:
          "'Outfit', sans-serif",
      }}
    >
      {/* OVERLAY MOBILE */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{
            backgroundColor:
              'rgba(0,0,0,0.4)',
          }}
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 flex flex-col
          transition-transform duration-200
          ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full md:translate-x-0'
          }
        `}
        style={{
          width: '220px',
          backgroundColor: G2,
          flexShrink: 0,
        }}
      >
        {/* LOGO */}

        <div
          className="flex items-center gap-2 px-5 py-5"
          style={{
            borderBottom:
              '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span
            style={{
              fontSize: '1.4rem',
            }}
          >
            🐄
          </span>

          <span
            style={{
              fontFamily:
                "'DM Serif Display', serif",
              fontSize: '1.2rem',
              color: CR,
            }}
          >
            Leite AL
          </span>
        </div>

        {/* USUÁRIO */}

        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{
            borderBottom:
              '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: AM,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              color: WHITE,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {String(
              (
                user?.name ||
                'U'
              )
                .split(' ')
                .map(
                  (p) => p[0]
                )
                .join('')
            )
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div className="flex-1">
            <div
              className="text-xs font-semibold"
              style={{
                color: CR,
              }}
            >
              {user?.name}
            </div>

            <div
              className="text-xs"
              style={{
                color:
                  'rgba(245,240,232,0.45)',
              }}
            >
              Produtor
            </div>
          </div>

          <button
            onClick={logout}
            className="text-xs"
            style={{
              color:
                'rgba(245,240,232,0.85)',
            }}
          >
            Sair
          </button>
        </div>

        {/* MENU */}

        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map(
            (item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(
                    item.id
                  )

                  setSidebarOpen(
                    false
                  )
                }}
                className="w-full flex items-center gap-3 text-left transition-colors duration-100"
                style={{
                  padding:
                    '10px 20px',

                  backgroundColor:
                    activeNav ===
                    item.id
                      ? 'rgba(255,255,255,0.1)'
                      : 'transparent',

                  borderLeft:
                    activeNav ===
                    item.id
                      ? `3px solid ${AM}`
                      : '3px solid transparent',

                  color:
                    activeNav ===
                    item.id
                      ? CR
                      : 'rgba(245,240,232,0.55)',

                  fontSize:
                    '0.85rem',

                  fontWeight:
                    activeNav ===
                    item.id
                      ? 600
                      : 400,
                }}
              >
                <span>
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>
              </button>
            )
          )}
        </nav>

        {/* IA */}

        <div
          className="p-4"
          style={{
            borderTop:
              '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <button
            onClick={() =>
              setShowIA(true)
            }
            className="w-full flex items-center gap-2 text-sm font-semibold"
            style={{
              backgroundColor: AM,
              color: WHITE,
              padding:
                '10px 16px',
              borderRadius: '6px',
            }}
          >
            <span>🤖</span>

            <span>
              Assistente IA
            </span>
          </button>
        </div>
      </aside>

      {/* CONTEÚDO */}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* HEADER */}

        <header
          className="flex items-center justify-between shrink-0"
          style={{
            padding:
              '0 24px',
            height: '60px',
            backgroundColor:
              WHITE,
            borderBottom:
              `1px solid ${BORDER}`,
          }}
        >
          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              onClick={() =>
                setSidebarOpen(
                  true
                )
              }
              style={{
                color: MUTED,
                fontSize:
                  '1.3rem',
              }}
            >
              ☰
            </button>

            <div>
              <span
                className="font-semibold text-sm"
                style={{
                  color: TEXT,
                }}
              >
                Bom dia, Leonardo! 🐄
              </span>

              <span
                className="text-xs ml-2"
                style={{
                  color: MUTED,
                }}
              >
                Segunda-feira,
                28 de julho
                de 2025
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="hidden sm:flex items-center gap-2 text-xs"
              style={{
                color: MUTED,
              }}
            >
              <span>
                🌤️
              </span>

              <span>
                32°C · Patos de Minas
              </span>
            </div>

            <button
              onClick={() =>
                setShowRfidReader(
                  true
                )
              }
              className="text-sm font-semibold"
              style={{
                backgroundColor:
                  '#8b5cf6',
                color: WHITE,
                padding:
                  '8px 18px',
                borderRadius:
                  '6px',
              }}
            >
              📡 RFID
            </button>

            <button
              onClick={() =>
                setShowOrdenha(
                  true
                )
              }
              className="text-sm font-semibold"
              style={{
                backgroundColor:
                  G,
                color: WHITE,
                padding:
                  '8px 18px',
                borderRadius:
                  '6px',
              }}
            >
              + Registrar ordenha
            </button>
          </div>
        </header>

        {/* CONTEÚDO SCROLL */}

        <main className="flex-1 overflow-y-auto p-6">
          {activeNav ===
          'dashboard' ? (
            <>
              {/* CARDS */}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {(() => {
                  const today =
                    new Date()
                      .toISOString()
                      .slice(
                        0,
                        10
                      )

                  const productionToday =
                    productionRecords
                      .filter(
                        (record) =>
                          record.date ===
                          today
                      )
                      .reduce(
                        (
                          total,
                          record
                        ) =>
                          total +
                          record.liters,
                        0
                      )

                  const revenueToday =
                    productionToday *
                    pricePerLiter

                  const lactacaoCount =
                    cows.filter(
                      (cow) =>
                        cow.categoria ===
                        'Em lactação'
                    ).length

                  return (
                    <>
                      <StatCard
                        icon="🥛"
                        label="Produção Hoje"
                        value={`${productionToday.toFixed(
                          2
                        )} L`}
                        sub={
                          productionToday
                            ? 'Produção registrada hoje'
                            : 'Nenhuma produção registrada'
                        }
                        color={G}
                      />

                      <StatCard
                        icon="💵"
                        label="Receita Hoje"
                        value={`R$ ${revenueToday.toFixed(
                          2
                        )}`}
                        sub={`R$ ${pricePerLiter.toFixed(
                          2
                        )}/L`}
                        color={G}
                      />

                      <StatCard
                        icon="💰"
                        label="Faturamento Hoje"
                        value={`R$ ${revenueToday.toFixed(
                          2
                        )}`}
                        sub="Calculado pela produção"
                        color={AM}
                      />

                      <StatCard
                        icon="🐄"
                        label="Vacas em Lactação"
                        value={`${lactacaoCount}`}
                        sub={`de ${cows.length} animais`}
                        color={TEXT}
                      />
                    </>
                  )
                })()}
              </div>

              {/* GRÁFICOS */}

              <div className="grid lg:grid-cols-3 gap-4 mb-6">
                {/* PRODUÇÃO */}

                <div
                  style={{
                    backgroundColor:
                      WHITE,
                    border:
                      `1px solid ${BORDER}`,
                    borderRadius:
                      '8px',
                    padding:
                      '20px',
                    gridColumn:
                      'span 2',
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color:
                            TEXT,
                        }}
                      >
                        Produção
                      </span>

                      <span
                        className="text-xs"
                        style={{
                          color:
                            MUTED,
                          marginLeft:
                            '8px',
                        }}
                      >
                        {chartPeriod ===
                        '7dias'
                          ? 'Últimos 7 dias'
                          : chartPeriod ===
                            'mes'
                          ? 'Por semana do mês'
                          : 'Por ano'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setChartPeriod(
                            '7dias'
                          )
                        }
                        style={{
                          padding:
                            '6px 12px',
                          fontSize:
                            '12px',
                          backgroundColor:
                            chartPeriod ===
                            '7dias'
                              ? G
                              : 'transparent',
                          color:
                            chartPeriod ===
                            '7dias'
                              ? WHITE
                              : TEXT,
                          border:
                            `1px solid ${
                              chartPeriod ===
                              '7dias'
                                ? G
                                : BORDER
                            }`,
                          borderRadius:
                            '4px',
                        }}
                      >
                        7 Dias
                      </button>

                      <button
                        onClick={() =>
                          setChartPeriod(
                            'mes'
                          )
                        }
                        style={{
                          padding:
                            '6px 12px',
                          fontSize:
                            '12px',
                          backgroundColor:
                            chartPeriod ===
                            'mes'
                              ? G
                              : 'transparent',
                          color:
                            chartPeriod ===
                            'mes'
                              ? WHITE
                              : TEXT,
                          border:
                            `1px solid ${
                              chartPeriod ===
                              'mes'
                                ? G
                                : BORDER
                            }`,
                          borderRadius:
                            '4px',
                        }}
                      >
                        Mês
                      </button>

                      <button
                        onClick={() =>
                          setChartPeriod(
                            'ano'
                          )
                        }
                        style={{
                          padding:
                            '6px 12px',
                          fontSize:
                            '12px',
                          backgroundColor:
                            chartPeriod ===
                            'ano'
                              ? G
                              : 'transparent',
                          color:
                            chartPeriod ===
                            'ano'
                              ? WHITE
                              : TEXT,
                          border:
                            `1px solid ${
                              chartPeriod ===
                              'ano'
                                ? G
                                : BORDER
                            }`,
                          borderRadius:
                            '4px',
                        }}
                      >
                        Ano
                      </button>
                    </div>
                  </div>

                  <ResponsiveContainer
                    width="100%"
                    height={180}
                  >
                    {chartPeriod ===
                    '7dias' ? (
                      <AreaChart
                        data={
                          producaoDias
                        }
                        margin={{
                          top: 4,
                          right: 4,
                          left: -20,
                          bottom: 0,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="gradGreen"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={
                                G
                              }
                              stopOpacity={
                                0.15
                              }
                            />

                            <stop
                              offset="95%"
                              stopColor={
                                G
                              }
                              stopOpacity={
                                0
                              }
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={
                            BORDER
                          }
                        />

                        <XAxis
                          dataKey="dia"
                          tick={{
                            fontSize:
                              11,
                            fill:
                              MUTED,
                          }}
                        />

                        <YAxis
                          tick={{
                            fontSize:
                              11,
                            fill:
                              MUTED,
                          }}
                        />

                        <Tooltip />

                        <Area
                          type="monotone"
                          dataKey="litros"
                          stroke={
                            G
                          }
                          strokeWidth={
                            2
                          }
                          fill="url(#gradGreen)"
                        />
                      </AreaChart>
                    ) : chartPeriod ===
                      'mes' ? (
                      <BarChart
                        data={
                          producaoPorMes
                        }
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={
                            BORDER
                          }
                          vertical={
                            false
                          }
                        />

                        <XAxis
                          dataKey="periodo"
                          tick={{
                            fontSize:
                              11,
                            fill:
                              MUTED,
                          }}
                        />

                        <YAxis
                          tick={{
                            fontSize:
                              11,
                            fill:
                              MUTED,
                          }}
                        />

                        <Tooltip />

                        <Legend />

                        <Bar
                          dataKey="atual"
                          fill={G}
                          name="Atual"
                        />

                        <Bar
                          dataKey="anterior"
                          fill={
                            BORDER
                          }
                          name="Anterior"
                        />
                      </BarChart>
                    ) : (
                      <BarChart
                        data={
                          producaoPorAno
                        }
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={
                            BORDER
                          }
                          vertical={
                            false
                          }
                        />

                        <XAxis
                          dataKey="periodo"
                          tick={{
                            fontSize:
                              11,
                            fill:
                              MUTED,
                          }}
                        />

                        <YAxis
                          tick={{
                            fontSize:
                              11,
                            fill:
                              MUTED,
                          }}
                        />

                        <Tooltip />

                        <Bar
                          dataKey="litros"
                          fill={G}
                          name="Produção"
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* REBANHO */}

                <div
                  style={{
                    backgroundColor:
                      WHITE,
                    border:
                      `1px solid ${BORDER}`,
                    borderRadius:
                      '8px',
                    padding:
                      '20px',
                  }}
                >
                  <span
                    className="text-sm font-semibold block mb-4"
                    style={{
                      color:
                        TEXT,
                    }}
                  >
                    Visão geral do rebanho
                  </span>

                  {!selectedRebanhoCategory ? (
                    <>
                      <ResponsiveContainer
                        width="100%"
                        height={130}
                      >
                        <PieChart>
                          <Pie
                            data={
                              rebanhoData
                            }
                            cx="50%"
                            cy="50%"
                            innerRadius={
                              38
                            }
                            outerRadius={
                              60
                            }
                            paddingAngle={
                              3
                            }
                            dataKey="value"
                          >
                            {rebanhoData.map(
                              (
                                entry,
                                index
                              ) => (
                                <Cell
                                  key={
                                    index
                                  }
                                  fill={
                                    entry.color
                                  }
                                />
                              )
                            )}
                          </Pie>

                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>

                      <div className="flex flex-col gap-2">
                        {rebanhoData.map(
                          (
                            item
                          ) => (
                            <button
                              key={
                                item.name
                              }
                              onClick={() =>
                                setSelectedRebanhoCategory(
                                  item.name
                                )
                              }
                              className="flex items-center justify-between text-xs p-2 rounded"
                            >
                              <span>
                                {item.name}
                              </span>

                              <strong>
                                {item.value}
                              </strong>
                            </button>
                          )
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          setSelectedRebanhoCategory(
                            null
                          )
                        }
                        style={{
                          color:
                            G,
                          marginBottom:
                            '12px',
                        }}
                      >
                        ← Voltar
                      </button>

                      <h3
                        className="text-sm font-semibold mb-3"
                        style={{
                          color:
                            TEXT,
                        }}
                      >
                        {
                          selectedRebanhoCategory
                        }
                      </h3>

                      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                        {cows
                          .filter(
                            (
                              cow
                            ) =>
                              cow.categoria ===
                              selectedRebanhoCategory
                          )
                          .map(
                            (
                              cow
                            ) => (
                              <div
                                key={
                                  cow.id
                                }
                                className="flex items-center justify-between p-3 rounded"
                                style={{
                                  backgroundColor:
                                    '#fafaf8',
                                  borderLeft:
                                    `3px solid ${G}`,
                                }}
                              >
                                <div>
                                  <div
                                    className="text-xs font-semibold"
                                    style={{
                                      color:
                                        TEXT,
                                    }}
                                  >
                                    {
                                      cow.nome
                                    }{' '}
                                    · #
                                    {
                                      cow.id
                                    }
                                  </div>

                                  <div
                                    className="text-xs"
                                    style={{
                                      color:
                                        MUTED,
                                    }}
                                  >
                                    {
                                      cow.raca
                                    }
                                  </div>
                                </div>

                                <strong
                                  className="text-xs"
                                  style={{
                                    color:
                                      TEXT,
                                  }}
                                >
                                  {
                                    cow.litros
                                  }{' '}
                                  L
                                </strong>
                              </div>
                            )
                          )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ALERTAS */}

              <div className="mb-6">
                <div
                  style={{
                    backgroundColor:
                      WHITE,
                    border:
                      `1px solid ${BORDER}`,
                    borderRadius:
                      '8px',
                    overflow:
                      'hidden',
                  }}
                >
                  <div
                    className="flex items-center justify-between px-5 py-3"
                    style={{
                      borderBottom:
                        `1px solid ${BORDER}`,
                    }}
                  >
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color:
                          TEXT,
                      }}
                    >
                      Alertas importantes
                    </span>

                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor:
                          '#fef2f2',
                        color:
                          RED,
                      }}
                    >
                      {alertas.length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 p-4">
                    {alertas.map(
                      (
                        alert,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          style={{
                            borderLeft:
                              `3px solid ${
                                alert.tipo ===
                                'danger'
                                  ? RED
                                  : alert.tipo ===
                                    'warning'
                                  ? '#d97706'
                                  : alert.tipo ===
                                    'info'
                                  ? '#3b82f6'
                                  : '#16a34a'
                              }`,
                            paddingLeft:
                              '12px',
                          }}
                        >
                          <div
                            className="text-xs font-semibold"
                            style={{
                              color:
                                TEXT,
                            }}
                          >
                            {
                              alert.msg
                            }
                          </div>

                          <div
                            className="text-xs"
                            style={{
                              color:
                                MUTED,
                            }}
                          >
                            {
                              alert.detalhe
                            }
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            sectionComponent
          )}
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL ORDENHA */}
      {/* ─────────────────────────────────────────────────────────────────── */}

      {showOrdenha && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor:
              'rgba(0,0,0,0.4)',
            backdropFilter:
              'blur(4px)',
          }}
          onClick={() => {
            setShowOrdenha(
              false
            )
            setOrdenhaRegistrada(
              false
            )
            setOrdenhaLitros('')
            setOrdenhaVaca('')
          }}
        >
          <div
            style={{
              backgroundColor:
                WHITE,
              borderRadius:
                '12px',
              padding:
                '32px',
              width: '100%',
              maxWidth:
                '400px',
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {!ordenhaRegistrada ? (
              <>
                <h3
                  className="font-semibold mb-6"
                  style={{
                    fontFamily:
                      "'DM Serif Display', serif",
                    fontSize:
                      '1.3rem',
                    color:
                      TEXT,
                  }}
                >
                  Registrar Ordenha
                </h3>

                <div className="flex flex-col gap-4">
                  <div>
                    <label
                      className="text-xs font-semibold block mb-1.5"
                      style={{
                        color:
                          MUTED,
                      }}
                    >
                      NÚMERO/NOME DA VACA
                    </label>

                    <input
                      type="text"
                      placeholder="Ex: 124 ou Estrela"
                      value={
                        ordenhaVaca
                      }
                      onChange={(e) =>
                        setOrdenhaVaca(
                          e.target.value
                        )
                      }
                      className="w-full text-sm outline-none"
                      style={{
                        border:
                          `1px solid ${BORDER}`,
                        borderRadius:
                          '6px',
                        padding:
                          '10px 14px',
                        color:
                          TEXT,
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="text-xs font-semibold block mb-1.5"
                      style={{
                        color:
                          MUTED,
                      }}
                    >
                      PRODUÇÃO
                      (LITROS)
                    </label>

                    <input
                      type="number"
                      min="0"
                      placeholder="Ex: 28"
                      value={
                        ordenhaLitros
                      }
                      onChange={(e) =>
                        setOrdenhaLitros(
                          e.target.value
                        )
                      }
                      className="w-full text-sm outline-none"
                      style={{
                        border:
                          `1px solid ${BORDER}`,
                        borderRadius:
                          '6px',
                        padding:
                          '10px 14px',
                        color:
                          TEXT,
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="text-xs font-semibold block mb-1.5"
                      style={{
                        color:
                          MUTED,
                      }}
                    >
                      CATEGORIA
                    </label>

                    <select
                      value={
                        ordenhaCategoria
                      }
                      onChange={(e) =>
                        setOrdenhaCategoria(
                          e.target
                            .value as CategoriaVaca
                        )
                      }
                      className="w-full text-sm outline-none"
                      style={{
                        border:
                          `1px solid ${BORDER}`,
                        borderRadius:
                          '6px',
                        padding:
                          '10px 14px',
                        color:
                          TEXT,
                        backgroundColor:
                          WHITE,
                      }}
                    >
                      {categoriaOptions.map(
                        (
                          option
                        ) => (
                          <option
                            key={
                              option.value
                            }
                            value={
                              option.value
                            }
                          >
                            {
                              option.label
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => {
                        setShowOrdenha(
                          false
                        )
                        setOrdenhaLitros(
                          ''
                        )
                        setOrdenhaVaca(
                          ''
                        )
                      }}
                      style={{
                        flex: 1,
                        border:
                          `1px solid ${BORDER}`,
                        borderRadius:
                          '6px',
                        padding:
                          '11px',
                        color:
                          MUTED,
                      }}
                    >
                      Cancelar
                    </button>

                    <button
                      onClick={
                        registrarOrdenha
                      }
                      style={{
                        flex: 2,
                        backgroundColor:
                          G,
                        color:
                          WHITE,
                        borderRadius:
                          '6px',
                        padding:
                          '11px',
                        fontWeight:
                          600,
                      }}
                    >
                      Registrar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div
                  style={{
                    fontSize:
                      '3rem',
                    marginBottom:
                      '12px',
                  }}
                >
                  ✅
                </div>

                <h3
                  style={{
                    fontFamily:
                      "'DM Serif Display', serif",
                    fontSize:
                      '1.3rem',
                    color:
                      G,
                    marginBottom:
                      '8px',
                  }}
                >
                  Ordenha registrada!
                </h3>

                <p
                  className="text-sm mb-6"
                  style={{
                    color:
                      MUTED,
                  }}
                >
                  {ordenhaVaca
                    ? `Vaca ${ordenhaVaca} · `
                    : ''}
                  {ordenhaLitros}{' '}
                  litros
                </p>

                <button
                  onClick={() => {
                    setShowOrdenha(
                      false
                    )
                    setOrdenhaRegistrada(
                      false
                    )
                    setOrdenhaLitros(
                      ''
                    )
                    setOrdenhaVaca(
                      ''
                    )
                    setOrdenhaCategoria(
                      'Em lactação'
                    )
                  }}
                  style={{
                    backgroundColor:
                      G,
                    color:
                      WHITE,
                    padding:
                      '10px 28px',
                    borderRadius:
                      '6px',
                    fontWeight:
                      600,
                  }}
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL RFID */}
      {/* ─────────────────────────────────────────────────────────────────── */}

      {showRfidReader && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor:
              'rgba(0,0,0,0.4)',
            backdropFilter:
              'blur(4px)',
          }}
          onClick={() => {
            setShowRfidReader(
              false
            )
            setRegistrandoVaca(
              false
            )
            setRfidScanned(
              null
            )
            setRfidInput('')
          }}
        >
          <div
            style={{
              backgroundColor:
                WHITE,
              borderRadius:
                '12px',
              padding:
                '32px',
              width: '100%',
              maxWidth:
                '500px',
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {!registrandoVaca ? (
              <>
                <h3
                  className="font-semibold mb-6"
                  style={{
                    fontFamily:
                      "'DM Serif Display', serif",
                    fontSize:
                      '1.3rem',
                    color:
                      TEXT,
                  }}
                >
                  📡 Leitor RFID
                </h3>

                <p
                  className="text-sm mb-4"
                  style={{
                    color:
                      MUTED,
                  }}
                >
                  Digite o código
                  do brinco RFID.
                </p>

                <input
                  autoFocus
                  type="text"
                  placeholder="Ex: 124"
                  value={
                    rfidInput
                  }
                  onChange={(e) =>
                    setRfidInput(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key ===
                        'Enter' &&
                      rfidInput.trim()
                    ) {
                      handleRfidScan(
                        rfidInput.trim()
                      )

                      setRfidInput(
                        ''
                      )
                    }
                  }}
                  className="w-full text-sm outline-none mb-4"
                  style={{
                    border:
                      `2px solid ${G}`,
                    borderRadius:
                      '6px',
                    padding:
                      '12px 14px',
                    color:
                      TEXT,
                  }}
                />

                <button
                  onClick={() => {
                    if (
                      rfidInput.trim()
                    ) {
                      handleRfidScan(
                        rfidInput.trim()
                      )

                      setRfidInput(
                        ''
                      )
                    }
                  }}
                  className="w-full"
                  style={{
                    backgroundColor:
                      G,
                    color:
                      WHITE,
                    borderRadius:
                      '6px',
                    padding:
                      '11px',
                    fontWeight:
                      600,
                  }}
                >
                  Escanear
                </button>

                <button
                  onClick={() =>
                    setShowRfidHistory(
                      !showRfidHistory
                    )
                  }
                  className="w-full mt-3"
                  style={{
                    backgroundColor:
                      'transparent',
                    color:
                      '#8b5cf6',
                    border:
                      '1px solid #8b5cf6',
                    borderRadius:
                      '6px',
                    padding:
                      '9px',
                  }}
                >
                  📋 Histórico de
                  leituras (
                  {
                    rfidHistory.length
                  }
                  )
                </button>

                {showRfidHistory && (
                  <div
                    className="mt-3"
                    style={{
                      maxHeight:
                        '200px',
                      overflowY:
                        'auto',
                      padding:
                        '12px',
                      backgroundColor:
                        '#f8f8f8',
                      borderRadius:
                        '6px',
                    }}
                  >
                    {rfidHistory.length ===
                    0 ? (
                      <p
                        className="text-xs"
                        style={{
                          color:
                            MUTED,
                        }}
                      >
                        Nenhuma
                        leitura
                        ainda.
                      </p>
                    ) : (
                      rfidHistory
                        .slice()
                        .reverse()
                        .map(
                          (
                            item,
                            index
                          ) => (
                            <div
                              key={
                                index
                              }
                              className="text-xs mb-2 pb-2"
                              style={{
                                borderBottom:
                                  `1px solid ${BORDER}`,
                              }}
                            >
                              <strong>
                                {
                                  item.rfid
                                }
                              </strong>

                              <div
                                style={{
                                  color:
                                    MUTED,
                                }}
                              >
                                {
                                  item.timestamp
                                }
                              </div>

                              {item.vaca && (
                                <div
                                  style={{
                                    color:
                                      G,
                                  }}
                                >
                                  ✓{' '}
                                  {
                                    item.vaca
                                  }
                                </div>
                              )}
                            </div>
                          )
                        )
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <h3
                  className="font-semibold mb-6"
                  style={{
                    fontFamily:
                      "'DM Serif Display', serif",
                    fontSize:
                      '1.3rem',
                    color:
                      TEXT,
                  }}
                >
                  Registrar nova vaca
                </h3>

                <p
                  className="text-sm mb-4"
                  style={{
                    color:
                      MUTED,
                  }}
                >
                  RFID:{' '}
                  <strong>
                    {
                      rfidScanned
                    }
                  </strong>
                </p>

                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Nome da vaca"
                    value={
                      novaVacaForm.nome
                    }
                    onChange={(e) =>
                      setNovaVacaForm({
                        ...novaVacaForm,
                        nome:
                          e.target
                            .value,
                      })
                    }
                    className="w-full outline-none"
                    style={{
                      border:
                        `1px solid ${BORDER}`,
                      borderRadius:
                        '6px',
                      padding:
                        '10px',
                    }}
                  />

                  <input
                    type="text"
                    placeholder="Raça"
                    value={
                      novaVacaForm.raca
                    }
                    onChange={(e) =>
                      setNovaVacaForm({
                        ...novaVacaForm,
                        raca:
                          e.target
                            .value,
                      })
                    }
                    className="w-full outline-none"
                    style={{
                      border:
                        `1px solid ${BORDER}`,
                      borderRadius:
                        '6px',
                      padding:
                        '10px',
                    }}
                  />

                  <input
                    type="number"
                    min="1"
                    placeholder="Lactação"
                    value={
                      novaVacaForm.lactacao
                    }
                    onChange={(e) =>
                      setNovaVacaForm({
                        ...novaVacaForm,
                        lactacao:
                          Number(
                            e.target
                              .value
                          ),
                      })
                    }
                    className="w-full outline-none"
                    style={{
                      border:
                        `1px solid ${BORDER}`,
                      borderRadius:
                        '6px',
                      padding:
                        '10px',
                    }}
                  />

                  <select
                    value={
                      novaVacaForm.categoria
                    }
                    onChange={(e) =>
                      setNovaVacaForm({
                        ...novaVacaForm,
                        categoria:
                          e.target
                            .value as CategoriaVaca,
                      })
                    }
                    className="w-full outline-none"
                    style={{
                      border:
                        `1px solid ${BORDER}`,
                      borderRadius:
                        '6px',
                      padding:
                        '10px',
                      backgroundColor:
                        WHITE,
                    }}
                  >
                    {categoriaOptions.map(
                      (
                        option
                      ) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {
                            option.label
                          }
                        </option>
                      )
                    )}
                  </select>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setRegistrandoVaca(
                          false
                        )
                      }
                      style={{
                        flex: 1,
                        border:
                          `1px solid ${BORDER}`,
                        borderRadius:
                          '6px',
                        padding:
                          '11px',
                      }}
                    >
                      Cancelar
                    </button>

                    <button
                      onClick={
                        registrarNovaVacaRfid
                      }
                      style={{
                        flex: 2,
                        backgroundColor:
                          G,
                        color:
                          WHITE,
                        borderRadius:
                          '6px',
                        padding:
                          '11px',
                        fontWeight:
                          600,
                      }}
                    >
                      Registrar vaca
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* IA */}

      {showIA && (
        <IAModal
          onClose={() =>
            setShowIA(false)
          }
        />
      )}
    </div>
  )
}