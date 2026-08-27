export default function CowCard({
  cow,
  onClick,
  selected,
}: {
  cow: { id: string; nome: string; litros: number; raca?: string; lactacao?: number }
  onClick?: () => void
  selected?: boolean
}) {
  const initials = cow.nome.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', border: selected ? '2px solid #1b5e35' : '1px solid #e6e1db', borderRadius: 8, padding: 12, background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: 8, background: '#f3f7f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>{cow.nome} <span style={{ color: '#6b7280', fontWeight: 600 }}>· #{cow.id}</span></div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{cow.raca || '-'} · {cow.lactacao || '-'}ª lactação</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700 }}>{cow.litros} L</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>média</div>
        </div>
      </div>
    </div>
  )
}
