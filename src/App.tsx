import { useState } from 'react'
import Login from './components/Login'
import { useAuth } from './contexts/AuthContext'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell,
} from 'recharts'
import Rebanho from './imports/screens/Rebanho'
import Producao from './imports/screens/Producao'
import Reproducao from './imports/screens/Reproducao'
import Sanidade from './imports/screens/Sanidade'
import Alimentacao from './imports/screens/Alimentacao'
import Financeiro from './imports/screens/Financeiro'
import Agenda from './imports/screens/Agenda'
import Relatorios from './imports/screens/Relatorios'

// ─── Tokens ──────────────────────────────────────────────────────────────────
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

// ─── Mock data ────────────────────────────────────────────────────────────────
const producaoDias = [
  { dia: '21/07', litros: 1190 }, { dia: '22/07', litros: 1210 },
  { dia: '23/07', litros: 1240 }, { dia: '24/07', litros: 1198 },
  { dia: '25/07', litros: 1265 }, { dia: '26/07', litros: 1278 },
  { dia: '27/07', litros: 1284 },
]

const producaoPorMes = [
  { periodo: 'Semana 1', atual: 8428, anterior: 8250 },
  { periodo: 'Semana 2', atual: 8634, anterior: 8420 },
  { periodo: 'Semana 3', atual: 8756, atual: 8621 },
  { periodo: 'Semana 4', atual: 8920, anterior: 8745 },
]

const producaoPorAno = [
  { periodo: '2023', litros: 425600 },
  { periodo: '2024', litros: 438200 },
  { periodo: '2025', litros: 442800 },
]

const producaoMensal = [
  { mes: 'Jan', atual: 36200, anterior: 33100 }, { mes: 'Fev', atual: 34800, anterior: 32400 },
  { mes: 'Mar', atual: 37500, anterior: 34200 }, { mes: 'Abr', atual: 38100, anterior: 35600 },
  { mes: 'Mai', atual: 39200, anterior: 36800 }, { mes: 'Jun', atual: 40100, anterior: 37500 },
  { mes: 'Jul', atual: 38400, anterior: 36100 },
]

const rebanhoData = [
  { name: 'Em lactação', value: 63, color: G },
  { name: 'Secas', value: 18, color: AM },
  { name: 'Novilhas', value: 12, color: '#4caf7d' },
  { name: 'Bezerras', value: 7, color: GL },
]

const initialVacas = [
  { id: '124', nome: 'Estrela', litros: 42, raca: 'Holandesa', lactacao: 3, tendencia: 'up', categoria: 'Em lactação' },
  { id: '078', nome: 'Mimosa', litros: 39, raca: 'Girolando', lactacao: 5, tendencia: 'up', categoria: 'Em lactação' },
  { id: '312', nome: 'Bonita', litros: 38, raca: 'Holandesa', lactacao: 2, tendencia: 'up', categoria: 'Em lactação' },
  { id: '201', nome: 'Flor', litros: 36, raca: 'Jersey', lactacao: 4, tendencia: 'down', categoria: 'Em lactação' },
  { id: '055', nome: 'Luna', litros: 34, raca: 'Girolando', lactacao: 3, tendencia: 'stable', categoria: 'Em lactação' },
  { id: '189', nome: 'Rosa', litros: 31, raca: 'Holandesa', lactacao: 6, tendencia: 'down', categoria: 'Em lactação' },
  { id: '090', nome: 'Marisa', litros: 0, raca: 'Holandesa', lactacao: 0, tendencia: 'stable', categoria: 'Secas' },
  { id: '156', nome: 'Bella', litros: 0, raca: 'Girolando', lactacao: 0, tendencia: 'stable', categoria: 'Secas' },
  { id: '223', nome: 'Princesa', litros: 15, raca: 'Jersey', lactacao: 1, tendencia: 'up', categoria: 'Novilhas' },
  { id: '334', nome: 'Doce', litros: 12, raca: 'Holandesa', lactacao: 1, tendencia: 'up', categoria: 'Novilhas' },
  { id: '445', nome: 'Branca', litros: 0, raca: 'Girolando', lactacao: 0, tendencia: 'stable', categoria: 'Bezerras' },
  { id: '556', nome: 'Preta', litros: 0, raca: 'Jersey', lactacao: 0, tendencia: 'stable', categoria: 'Bezerras' },
]

const alertas = [
  { tipo: 'danger', msg: 'Vaca 201 — queda de 18% na produção', detalhe: 'Verificar saúde' },
  { tipo: 'warning', msg: '3 vacas para secar nos próximos 7 dias', detalhe: 'Vacas 089, 134, 221' },
  { tipo: 'info', msg: 'Vaca 312 — diagnóstico de gestação amanhã', detalhe: '29/07 · 08:00' },
  { tipo: 'success', msg: 'Meta de julho atingida: 38.400 L', detalhe: '102% da meta' },
]

const agendaHoje = [
  { hora: '06:00', evento: '1ª Ordenha — Lote A', tipo: 'ordenha' },
  { hora: '08:30', evento: 'Vacina contra Febre Aftosa — 12 animais', tipo: 'vacina' },
  { hora: '10:00', evento: 'Diagnóstico de gestação — Vaca 099', tipo: 'reproducao' },
  { hora: '14:00', evento: '2ª Ordenha — Lote A e B', tipo: 'ordenha' },
  { hora: '16:30', evento: 'Entrega de ração — Silo 2', tipo: 'alimentacao' },
]

const tipoColor: Record<string, string> = {
  ordenha: G, vacina: '#8b5cf6', reproducao: '#ec4899', alimentacao: AM,
}

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

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = G }: { icon: string; label: string; value: string; sub: string; color?: string }) {
  return (
    <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '20px 22px' }}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium" style={{ color: MUTED }}>{label}</span>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
      </div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', color, lineHeight: 1 }}>{value}</div>
      <div className="text-xs mt-1" style={{ color: MUTED }}>{sub}</div>
    </div>
  )
}

function AlertBadge({ tipo }: { tipo: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    danger: { bg: '#fef2f2', color: RED },
    warning: { bg: '#fffbeb', color: '#b45309' },
    info: { bg: '#eff6ff', color: '#1d4ed8' },
    success: { bg: '#f0fdf4', color: '#166534' },
  }
  const s = map[tipo]
  return (
    <div style={{ backgroundColor: s.bg, borderLeft: `3px solid ${s.color}`, padding: '10px 14px', borderRadius: '0 6px 6px 0' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: s.color }}>
        {tipo === 'danger' ? '⚠️' : tipo === 'warning' ? '🔔' : tipo === 'info' ? 'ℹ️' : '✅'}
      </span>
    </div>
  )
}

// ─── IA Modal ────────────────────────────────────────────────────────────────
function IAModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Olá, Joao! Sou o assistente do Leite AL. Como posso ajudar hoje?' },
  ])
  const [input, setInput] = useState('')

  const respostas: Record<string, string> = {
    'qual vaca produziu mais': 'A Vaca 124 (Estrela) produziu mais este mês — média de 42 L/dia.',
    'quais vacas precisam secar': '3 vacas precisam secar nos próximos 7 dias: Vaca 089, 134 e 221.',
    'lucro': 'No último mês você teve lucro de R$ 14.340, crescimento de 8% em relação ao mês anterior.',
    'gasto com ração': 'Você gastou R$ 8.240 com ração e concentrado em julho.',
    'produção hoje': 'Produção do dia: 1.284 litros — acima da média dos últimos 7 dias.',
  }

  const send = () => {
    if (!input.trim()) return
    const q = input.trim()
    setMessages(m => [...m, { from: 'user', text: q }])
    setInput('')
    const key = Object.keys(respostas).find(k => q.toLowerCase().includes(k))
    setTimeout(() => {
      setMessages(m => [...m, { from: 'ai', text: key ? respostas[key] : 'Consultando os dados da fazenda... Por enquanto posso ajudar com produção, financeiro, reprodução e sanidade.' }])
    }, 600)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
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
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: G }}>
          <div className="flex items-center gap-2">
            <span>🤖</span>
            <span className="font-semibold text-sm" style={{ color: CR }}>Assistente IA · Leite360</span>
          </div>
          <button onClick={onClose} style={{ color: 'rgba(245,240,232,0.6)', fontSize: '1.2rem' }}>×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ minHeight: '200px' }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                style={{
                  backgroundColor: m.from === 'user' ? G : GL,
                  color: m.from === 'user' ? CR : TEXT,
                  padding: '10px 14px',
                  borderRadius: m.from === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  maxWidth: '80%',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 p-3" style={{ borderTop: `1px solid ${BORDER}` }}>
          <input
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
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
            style={{ backgroundColor: G, color: CR, borderRadius: '6px', padding: '10px 16px', fontSize: '0.85rem', fontWeight: 600 }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

type CategoriaVaca = 'Em lactação' | 'Secas' | 'Novilhas' | 'Bezerras'

const categoriaOptions: { label: string; value: CategoriaVaca }[] = [
  { label: 'Produz leite', value: 'Em lactação' },
  { label: 'Seca', value: 'Secas' },
  { label: 'Novilha', value: 'Novilhas' },
  { label: 'Bezerra', value: 'Bezerras' },
]

// ─── Main app ─────────────────────────────────────────────────────────────────
export default function App() {
  const { user, logout } = useAuth()
  const [activeNav, setActiveNav] = useState('dashboard')
  const [chartPeriod, setChartPeriod] = useState<'7dias' | 'mes' | 'ano'>('7dias')
  const [selectedRebanhoCategory, setSelectedRebanhoCategory] = useState<string | null>(null)
  const [pricePerLiter, setPricePerLiter] = useState(2.84)
  const [showRfidReader, setShowRfidReader] = useState(false)
  const [rfidInput, setRfidInput] = useState('')
  const [rfidScanned, setRfidScanned] = useState<string | null>(null)
  const [registrandoVaca, setRegistrandoVaca] = useState(false)
  const [novaVacaForm, setNovaVacaForm] = useState<{ nome: string; raca: string; lactacao: number; categoria: CategoriaVaca }>({
    nome: '',
    raca: '',
    lactacao: 1,
    categoria: 'Em lactação',
  })
  const [rfidHistory, setRfidHistory] = useState<{ rfid: string; timestamp: string; vaca?: string }[]>([])
  const [showRfidHistory, setShowRfidHistory] = useState(false)
  const [cows, setCows] = useState(() => initialVacas)
  const [productionRecords, setProductionRecords] = useState<{ id: number; date: string; liters: number; animal?: string }[]>([])
  const [transactions, setTransactions] = useState<{ id: number; desc: string; amount: number; type: 'receita' | 'despesa' }[]>([])
  const [showIA, setShowIA] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showOrdenha, setShowOrdenha] = useState(false)
  const [ordenhaLitros, setOrdenhaLitros] = useState('')
  const [ordenhaVaca, setOrdenhaVaca] = useState('')
  const [ordenhaCategoria, setOrdenhaCategoria] = useState<CategoriaVaca>('Em lactação')
  const [ordenhaRegistrada, setOrdenhaRegistrada] = useState(false)

  const registrarOrdenha = () => {
    const litros = Number(ordenhaLitros)
    if (!ordenhaLitros || Number.isNaN(litros) || litros <= 0) return
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    addProductionRecord({ date: today, liters: litros, animal: ordenhaVaca || undefined })

    if (ordenhaVaca.trim()) {
      const animalKey = ordenhaVaca.trim()
      setCows(prev => prev.map(c => {
        if (c.id === animalKey || c.nome.toLowerCase() === animalKey.toLowerCase()) {
          return { ...c, categoria: ordenhaCategoria }
        }
        return c
      }))
    }

    setOrdenhaRegistrada(true)
    setOrdenhaLitros('')
    setOrdenhaVaca('')
    setOrdenhaCategoria('Em lactação')
  }

  function addProductionRecord(r: { date: string; liters: number; animal?: string }) {
    const rec = { ...r, id: Date.now() }
    setProductionRecords(prev => [...prev, rec])
    // se vier com animal (id ou nome), atualizar litros da vaca
    if (r.animal) {
      setCows(prev => prev.map(c => {
        if (c.id === r.animal || c.nome === r.animal) {
          return { ...c, litros: Number((c.litros + r.liters).toFixed(2)) }
        }
        return c
      }))
    }
    // criar transação de receita automática
    const revenue = Number((r.liters * pricePerLiter).toFixed(2))
    const animalLabel = r.animal ? (cows.find(c => c.id === r.animal)?.nome || r.animal) : ''
    const tx = { id: Date.now() + 1, desc: `Venda leite${animalLabel ? ' · ' + animalLabel : ''} ${r.date}`, amount: revenue, type: 'receita' as const }
    setTransactions(prev => [...prev, tx])
  }

  function addCow(c: { id?: string; nome: string; litros?: number; raca?: string; lactacao?: number; tendencia?: string; categoria?: CategoriaVaca }) {
    const id = c.id || String(Date.now()).slice(-4)
    setCows(prev => [...prev, {
      id,
      nome: c.nome,
      litros: c.litros ?? 0,
      raca: c.raca,
      lactacao: c.lactacao,
      tendencia: c.tendencia,
      categoria: c.categoria ?? 'Em lactação',
    }])
    return id
  }

  function removeProductionRecord(id: number) {
    const rec = productionRecords.find(r => r.id === id)
    setProductionRecords(prev => prev.filter(r => r.id !== id))
    if (rec) {
      // remover transação relacionada pela data (simples heurística)
      setTransactions(prev => prev.filter(tx => !tx.desc.includes(rec.date)))
    }
  }

  function addTransaction(tx: { desc: string; amount: number; type: 'receita' | 'despesa' }) {
    setTransactions(prev => [...prev, { ...tx, id: Date.now() }])
  }

  function handleRfidScan(rfidCode: string) {
    const timestamp = new Date().toLocaleString('pt-BR')
    const vacaExistente = cows.find(v => v.id === rfidCode)
    
    setRfidHistory(prev => [...prev, { rfid: rfidCode, timestamp, vaca: vacaExistente?.nome }])
    setRfidScanned(rfidCode)
    
    if (vacaExistente) {
      // Vaca já existe - registrar ordenha automática
      const litros = Math.random() * 15 + 20 // Simula 20-35L
      addProductionRecord({ date: new Date().toISOString().split('T')[0], liters: litros, animal: rfidCode })
      setShowRfidReader(false)
      alert(`✅ ${vacaExistente.nome} identificada! Ordenha registrada: ${litros.toFixed(1)}L`)
    } else {
      // Vaca nova - preparar para registro
      setRegistrandoVaca(true)
      setNovaVacaForm({ nome: '', raca: '', lactacao: 1, categoria: 'Em lactação' })
    }
  }

  function registrarNovaVacaRfid() {
    if (!rfidScanned || !novaVacaForm.nome) {
      alert('Preencha todos os campos!')
      return
    }
    
    const novaVaca = {
      id: rfidScanned,
      nome: novaVacaForm.nome,
      raca: novaVacaForm.raca,
      lactacao: novaVacaForm.lactacao,
      litros: 0,
      tendencia: 'up',
      categoria: novaVacaForm.categoria,
    }
    
    setCows(prev => [...prev, novaVaca])
    setRfidHistory(prev => 
      prev.map(h => h.rfid === rfidScanned ? { ...h, vaca: novaVacaForm.nome } : h)
    )
    
    alert(`✅ Vaca "${novaVacaForm.nome}" registrada com RFID ${rfidScanned}!`)
    setShowRfidReader(false)
    setRegistrandoVaca(false)
    setRfidScanned(null)
  }

  const sectionComponent = (() => {
    switch (activeNav) {
      case 'rebanho': return <Rebanho data={rebanhoData} cows={cows} />
      case 'producao': return <Producao records={productionRecords} onAddRecord={addProductionRecord} onRemoveRecord={removeProductionRecord} onAddCow={addCow} pricePerLiter={pricePerLiter} setPricePerLiter={setPricePerLiter} rebanho={rebanhoData} cows={cows} />
      case 'reproducao': return <Reproducao cows={cows} />
      case 'sanidade': return <Sanidade />
      case 'alimentacao': return <Alimentacao />
      case 'financeiro': return <Financeiro transactions={transactions} onAddTransaction={addTransaction} />
      case 'agenda': return <Agenda />
      case 'relatorios': return <Relatorios />
      default: return null
    }
  })()

  if (!user) return <Login onSuccess={() => { /* re-render via context */ }} />

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#f0ede6', fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      {/* mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 flex flex-col
          transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ width: '220px', backgroundColor: G2, flexShrink: 0 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '1.4rem' }}>🐄</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: CR, letterSpacing: '-0.01em' }}>
            Leite AL<span style={{ color: AM }}></span>
          </span>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: AM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: WHITE, fontWeight: 700, flexShrink: 0 }}>
            {String((user?.name || 'U').split(' ').map(p => p[0]).join('')).slice(0,2).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold" style={{ color: CR }}>{user?.name}</div>
            <div className="text-xs" style={{ color: 'rgba(245,240,232,0.45)' }}>Produtor</div>
          </div>
          <button onClick={logout} className="text-xs" style={{ color: 'rgba(245,240,232,0.85)' }}>Sair</button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false) }}
              className="w-full flex items-center gap-3 text-left transition-colors duration-100"
              style={{
                padding: '10px 20px',
                backgroundColor: activeNav === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: activeNav === item.id ? `3px solid ${AM}` : '3px solid transparent',
                color: activeNav === item.id ? CR : 'rgba(245,240,232,0.55)',
                fontSize: '0.85rem',
                fontWeight: activeNav === item.id ? 600 : 400,
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* IA button */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => setShowIA(true)}
            className="w-full flex items-center gap-2 text-sm font-semibold transition-all duration-150"
            style={{ backgroundColor: AM, color: WHITE, padding: '10px 16px', borderRadius: '6px' }}
          >
            <span>🤖</span>
            <span>Assistente IA</span>
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header
          className="flex items-center justify-between shrink-0"
          style={{
            padding: '0 24px',
            height: '60px',
            backgroundColor: WHITE,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              style={{ color: MUTED, fontSize: '1.3rem' }}
            >
              ☰
            </button>
            <div>
              <span className="font-semibold text-sm" style={{ color: TEXT }}>Bom dia, Leonardo! 🐄</span>
              <span className="text-xs ml-2" style={{ color: MUTED }}>Segunda-feira, 28 de julho de 2025</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: MUTED }}>
              <span>🌤️</span>
              <span>32°C · Patos de Minas</span>
            </div>
            <button
              onClick={() => setShowRfidReader(true)}
              className="text-sm font-semibold transition-all duration-150"
              style={{ backgroundColor: '#8b5cf6', color: WHITE, padding: '8px 18px', borderRadius: '6px' }}
              title="Ler brinco RFID"
            >
              📡 RFID
            </button>
            <button
              onClick={() => setShowOrdenha(true)}
              className="text-sm font-semibold transition-all duration-150"
              style={{ backgroundColor: G, color: WHITE, padding: '8px 18px', borderRadius: '6px' }}
            >
              + Registrar ordenha
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeNav === 'dashboard' ? (
            <>
              {/* ── Stat cards ─────────────────────────────────────────────── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {
                  (() => {
                    const today = new Date().toISOString().slice(0,10)
                    const productionToday = productionRecords.filter(r => r.date === today).reduce((s, r) => s + r.liters, 0)
                    const revenueToday = productionToday * pricePerLiter
                    const lactacaoCount = cows.length
                    return (
                      <>
                        <StatCard icon="🥛" label="Produção Hoje" value={`${productionToday.toFixed(2)} L`} sub={productionToday ? `+ vs. ontem` : '—'} color={G} />
                        <StatCard icon="💵" label="Receita Hoje" value={`R$ ${revenueToday.toFixed(2)}`} sub={`R$ ${pricePerLiter.toFixed(2)}/L`} color={G} />
                        <StatCard icon="💰" label="Faturamento Hoje" value={`R$ ${(productionToday * pricePerLiter).toFixed(2)}`} sub="Margem 33,5%" color={AM} />
                        <StatCard icon="🐄" label="Vacas em Lactação" value={`${lactacaoCount}`} sub="em rebanho" color={TEXT} />
                      </>
                    )
                  })()
                }
              </div>

              {/* ── Charts row ─────────────────────────────────────────────── */}
              <div className="grid lg:grid-cols-3 gap-4 mb-6">

                {/* Area chart */}
                <div
                  style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '20px', gridColumn: 'span 2' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm font-semibold" style={{ color: TEXT }}>Produção</span>
                      <span className="text-xs" style={{ color: MUTED, marginLeft: '8px' }}>
                        {chartPeriod === '7dias' ? 'Últimos 7 dias' : chartPeriod === 'mes' ? 'Por semana do mês' : 'Por ano'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setChartPeriod('7dias')}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          backgroundColor: chartPeriod === '7dias' ? G : 'transparent',
                          color: chartPeriod === '7dias' ? WHITE : TEXT,
                          border: `1px solid ${chartPeriod === '7dias' ? G : BORDER}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        7 Dias
                      </button>
                      <button
                        onClick={() => setChartPeriod('mes')}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          backgroundColor: chartPeriod === 'mes' ? G : 'transparent',
                          color: chartPeriod === 'mes' ? WHITE : TEXT,
                          border: `1px solid ${chartPeriod === 'mes' ? G : BORDER}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Mês
                      </button>
                      <button
                        onClick={() => setChartPeriod('ano')}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          backgroundColor: chartPeriod === 'ano' ? G : 'transparent',
                          color: chartPeriod === 'ano' ? WHITE : TEXT,
                          border: `1px solid ${chartPeriod === 'ano' ? G : BORDER}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Ano
                      </button>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    {chartPeriod === '7dias' ? (
                      <AreaChart data={producaoDias} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={G} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={G} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                        <XAxis dataKey="dia" tick={{ fontSize: 11, fill: MUTED }} />
                        <YAxis tick={{ fontSize: 11, fill: MUTED }} domain={[1100, 1350]} />
                        <Tooltip
                          contentStyle={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '12px' }}
                          formatter={(v: number) => [`${v} L`, 'Produção']}
                        />
                        <Area type="monotone" dataKey="litros" stroke={G} strokeWidth={2} fill="url(#gradGreen)" dot={{ r: 3, fill: G }} />
                      </AreaChart>
                    ) : chartPeriod === 'mes' ? (
                      <BarChart data={producaoPorMes} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                        <XAxis dataKey="periodo" tick={{ fontSize: 11, fill: MUTED }} />
                        <YAxis tick={{ fontSize: 11, fill: MUTED }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '12px' }}
                          formatter={(v: number) => [`${v.toLocaleString('pt-BR')} L`]}
                        />
                        <Bar dataKey="atual" fill={G} radius={[3, 3, 0, 0]} name="Atual" />
                        <Bar dataKey="anterior" fill={BORDER} radius={[3, 3, 0, 0]} name="Anterior" />
                        <Legend />
                      </BarChart>
                    ) : (
                      <BarChart data={producaoPorAno} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                        <XAxis dataKey="periodo" tick={{ fontSize: 11, fill: MUTED }} />
                        <YAxis tick={{ fontSize: 11, fill: MUTED }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '12px' }}
                          formatter={(v: number) => [`${v.toLocaleString('pt-BR')} L`]}
                        />
                        <Bar dataKey="litros" fill={G} radius={[3, 3, 0, 0]} name="Produção Total" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* Pie chart rebanho */}
                <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '20px', gridColumn: 'span 1' }}>
                  <span className="text-sm font-semibold block mb-4" style={{ color: TEXT }}>Visão geral do rebanho</span>
                  {!selectedRebanhoCategory ? (
                    <>
                      <div className="flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={130}>
                          <PieChart>
                            <Pie data={rebanhoData} cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={3} dataKey="value">
                              {rebanhoData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ fontSize: '12px', borderRadius: '6px', border: `1px solid ${BORDER}` }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="w-full flex flex-col gap-2 mt-3">
                          {rebanhoData.map((d, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedRebanhoCategory(d.name)}
                              className="flex items-center justify-between text-xs p-2 rounded hover:bg-gray-50 transition-colors"
                              style={{ color: MUTED, cursor: 'pointer' }}
                            >
                              <div className="flex items-center gap-2">
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.color, display: 'inline-block' }} />
                                {d.name}
                              </div>
                              <span className="font-semibold" style={{ color: TEXT }}>{d.value}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setSelectedRebanhoCategory(null)}
                        style={{
                          marginBottom: '12px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          backgroundColor: 'transparent',
                          color: G,
                          border: `1px solid ${G}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        ← Voltar
                      </button>
                      <h3 style={{ color: TEXT, fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
                        {selectedRebanhoCategory}
                      </h3>
                      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                        {cows
                          .filter(v => v.categoria === selectedRebanhoCategory)
                          .map((v) => (
                            <div
                              key={v.id}
                              className="flex items-center justify-between p-3 rounded"
                              style={{ backgroundColor: '#fafaf8', borderLeft: `3px solid ${v.tendencia === 'up' ? '#16a34a' : v.tendencia === 'down' ? RED : MUTED}` }}
                            >
                              <div>
                                <div className="text-xs font-semibold" style={{ color: TEXT }}>
                                  {v.nome} · #{v.id}
                                </div>
                                <div className="text-xs" style={{ color: MUTED }}>
                                  {v.raca} · {v.lactacao > 0 ? `${v.lactacao}ª lactação` : 'não lactante'}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-bold" style={{ color: TEXT }}>{v.litros}L</span>
                                <span className="block text-xs" style={{ color: v.tendencia === 'up' ? '#16a34a' : v.tendencia === 'down' ? RED : MUTED }}>
                                  {v.tendencia === 'up' ? '↑' : v.tendencia === 'down' ? '↓' : '→'}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ── Bottom section ─────────────────────────────────────────── */}
              <div className="grid lg:grid-cols-1 gap-4 mb-6">

                {/* Alertas */}
                <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: '8px', overflow: 'hidden' }}>
                  <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <span className="text-sm font-semibold" style={{ color: TEXT }}>Alertas importantes</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fef2f2', color: RED }}>4</span>
                  </div>
                  <div className="flex flex-col gap-3 p-4">
                    {alertas.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          borderLeft: `3px solid ${a.tipo === 'danger' ? RED : a.tipo === 'warning' ? '#d97706' : a.tipo === 'info' ? '#3b82f6' : '#16a34a'}`,
                          paddingLeft: '12px',
                        }}
                      >
                        <div className="text-xs font-semibold" style={{ color: TEXT }}>{a.msg}</div>
                        <div className="text-xs" style={{ color: MUTED }}>{a.detalhe}</div>
                      </div>
                    ))}
                  </div>
                </div>


              </div>


            </>
          ) : (
            sectionComponent
          )}

        </main>
      </div>

      {/* ── Modal Registrar Ordenha ───────────────────────────────────────── */}
      {showOrdenha && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => { setShowOrdenha(false); setOrdenhaRegistrada(false); setOrdenhaLitros(''); setOrdenhaVaca(''); setOrdenhaCategoria('Em lactação') }}
        >
          <div
            style={{ backgroundColor: WHITE, borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '400px' }}
            onClick={e => e.stopPropagation()}
          >
            {ordenhaRegistrada ? (
              <div className="text-center">
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
                <h3 className="font-semibold mb-1" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: G }}>
                  Ordenha registrada!
                </h3>
                <p className="text-sm mb-1" style={{ color: MUTED }}>Vaca {ordenhaVaca} · {ordenhaLitros} litros</p>
                <p className="text-xs mb-6" style={{ color: MUTED }}>Dashboard atualizado · Estoque atualizado</p>
                <button
                  onClick={() => { setShowOrdenha(false); setOrdenhaRegistrada(false); setOrdenhaLitros(''); setOrdenhaVaca(''); setOrdenhaCategoria('Em lactação') }}
                  style={{ backgroundColor: G, color: WHITE, padding: '10px 28px', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600 }}
                >
                  Fechar
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-semibold mb-6" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: TEXT }}>
                  Registrar Ordenha
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: MUTED }}>NÚMERO/NOME DA VACA</label>
                    <input
                      type="text"
                      placeholder="Ex: 124 ou Estrela"
                      value={ordenhaVaca}
                      onChange={e => setOrdenhaVaca(e.target.value)}
                      className="w-full text-sm outline-none"
                      style={{ border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '10px 14px', color: TEXT }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: MUTED }}>PRODUÇÃO (LITROS)</label>
                    <input
                      type="number"
                      placeholder="Ex: 28"
                      value={ordenhaLitros}
                      onChange={e => setOrdenhaLitros(e.target.value)}
                      className="w-full text-sm outline-none"
                      style={{ border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '10px 14px', color: TEXT }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: MUTED }}>CATEGORIA</label>
                    <select
                      value={ordenhaCategoria}
                      onChange={e => setOrdenhaCategoria(e.target.value as CategoriaVaca)}
                      className="w-full text-sm outline-none"
                      style={{ border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '10px 14px', color: TEXT, backgroundColor: WHITE }}
                    >
                      {categoriaOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: MUTED }}>ORDENHA</label>
                    <select className="w-full text-sm outline-none" style={{ border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '10px 14px', color: TEXT, backgroundColor: WHITE }}>
                      <option>1ª Ordenha — 06:00</option>
                      <option>2ª Ordenha — 14:00</option>
                      <option>3ª Ordenha — 20:00</option>
                    </select>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => { setShowOrdenha(false); setOrdenhaCategoria('Em lactação') }}
                      style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '11px', fontSize: '0.875rem', color: MUTED }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={registrarOrdenha}
                      style={{ flex: 2, backgroundColor: G, color: WHITE, borderRadius: '6px', padding: '11px', fontSize: '0.875rem', fontWeight: 600 }}
                    >
                      Registrar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Modal RFID Reader ───────────────────────────────────────────────── */}
      {showRfidReader && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => { setShowRfidReader(false); setRegistrandoVaca(false); setRfidScanned(null); setRfidInput('') }}
        >
          <div
            style={{ backgroundColor: WHITE, borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '500px' }}
            onClick={e => e.stopPropagation()}
          >
            {!registrandoVaca ? (
              <>
                <h3 className="font-semibold mb-6" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: TEXT }}>
                  📡 Leitor RFID
                </h3>
                <p className="text-sm mb-4" style={{ color: MUTED }}>
                  {rfidScanned 
                    ? `Brinco lido: ${rfidScanned}` 
                    : 'Cole ou digite o código do brinco RFID'}
                </p>
                <div className="flex flex-col gap-4">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Cole o código RFID ou digite manualmente"
                    value={rfidInput}
                    onChange={e => setRfidInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && rfidInput.trim()) {
                        handleRfidScan(rfidInput.trim())
                        setRfidInput('')
                      }
                    }}
                    className="w-full text-sm outline-none"
                    style={{ border: `2px solid ${G}`, borderRadius: '6px', padding: '12px 14px', color: TEXT, fontSize: '1.1rem', fontFamily: 'monospace' }}
                  />
                  <button
                    onClick={() => {
                      if (rfidInput.trim()) {
                        handleRfidScan(rfidInput.trim())
                        setRfidInput('')
                      }
                    }}
                    style={{ backgroundColor: G, color: WHITE, borderRadius: '6px', padding: '11px', fontSize: '0.875rem', fontWeight: 600 }}
                  >
                    Escanear
                  </button>
                  
                  {rfidScanned && (
                    <div style={{ padding: '12px', backgroundColor: '#f0fdf4', border: `1px solid ${G}`, borderRadius: '6px' }}>
                      <p className="text-xs font-semibold mb-2" style={{ color: G }}>✅ Brinco lido com sucesso</p>
                      <p className="text-xs mb-3" style={{ color: MUTED }}>O sistema vai buscar a vaca...</p>
                    </div>
                  )}

                  <button
                    onClick={() => setShowRfidHistory(!showRfidHistory)}
                    style={{ backgroundColor: 'transparent', color: '#8b5cf6', border: `1px solid #8b5cf6`, borderRadius: '6px', padding: '8px', fontSize: '0.875rem' }}
                  >
                    📋 Histórico de leituras ({rfidHistory.length})
                  </button>

                  {showRfidHistory && (
                    <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '12px', backgroundColor: '#f8f8f8', borderRadius: '6px' }}>
                      {rfidHistory.length === 0 ? (
                        <p className="text-xs" style={{ color: MUTED }}>Nenhuma leitura ainda</p>
                      ) : (
                        rfidHistory.slice().reverse().map((h, i) => (
                          <div key={i} className="text-xs mb-2 pb-2" style={{ borderBottom: `1px solid ${BORDER}`, color: MUTED }}>
                            <div className="font-semibold">{h.rfid}</div>
                            <div>{h.timestamp}</div>
                            {h.vaca && <div style={{ color: G }}>✓ {h.vaca}</div>}
                            {!h.vaca && <div style={{ color: '#d64545' }}>⚠ Não reconhecido</div>}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold mb-6" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: TEXT }}>
                  Registrar nova vaca
                </h3>
                <p className="text-sm mb-4" style={{ color: MUTED }}>Brinco RFID: <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{rfidScanned}</span></p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: MUTED }}>NOME DA VACA</label>
                    <input
                      type="text"
                      placeholder="Ex: Estrela"
                      value={novaVacaForm.nome}
                      onChange={e => setNovaVacaForm({ ...novaVacaForm, nome: e.target.value })}
                      className="w-full text-sm outline-none"
                      style={{ border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '10px 14px', color: TEXT }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: MUTED }}>RAÇA</label>
                    <input
                      type="text"
                      placeholder="Ex: Holandesa"
                      value={novaVacaForm.raca}
                      onChange={e => setNovaVacaForm({ ...novaVacaForm, raca: e.target.value })}
                      className="w-full text-sm outline-none"
                      style={{ border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '10px 14px', color: TEXT }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: MUTED }}>LACTAÇÃO</label>
                    <input
                      type="number"
                      min="1"
                      value={novaVacaForm.lactacao}
                      onChange={e => setNovaVacaForm({ ...novaVacaForm, lactacao: parseInt(e.target.value) })}
                      className="w-full text-sm outline-none"
                      style={{ border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '10px 14px', color: TEXT }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: MUTED }}>CATEGORIA</label>
                    <select
                      value={novaVacaForm.categoria}
                      onChange={e => setNovaVacaForm({ ...novaVacaForm, categoria: e.target.value as CategoriaVaca })}
                      className="w-full text-sm outline-none"
                      style={{ border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '10px 14px', color: TEXT, backgroundColor: WHITE }}
                    >
                      {categoriaOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setRegistrandoVaca(false)}
                      style={{ flex: 1, backgroundColor: '#e0e0e0', color: TEXT, borderRadius: '6px', padding: '11px', fontSize: '0.875rem', fontWeight: 600 }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={registrarNovaVacaRfid}
                      style={{ flex: 2, backgroundColor: G, color: WHITE, borderRadius: '6px', padding: '11px', fontSize: '0.875rem', fontWeight: 600 }}
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

      {/* ── IA Modal ─────────────────────────────────────────────────────── */}
      {showIA && <IAModal onClose={() => setShowIA(false)} />}
    </div>
  )
}
