'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITEMS = [
  { href: '/dashboard', label: 'Início', icon: '⊡' },
  { href: '/clients', label: 'Clientes', icon: '◻' },
  { href: '/agency', label: 'Agência', icon: '◈' },
  { href: '/settings', label: 'Config.', icon: '⚙' },
]

export function MobileNav({ onSkillsOpen }: { onSkillsOpen?: () => void }) {
  const path = usePathname()

  return (
    <nav className="mobile-bottom-nav">
      {ITEMS.map(item => (
        <Link
          key={item.href}
          href={item.href}
          style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 12px', flex: 1 }}
        >
          <span style={{ fontSize: 18, lineHeight: 1, color: path === item.href ? '#C1FF72' : 'rgba(255,255,255,0.28)' }}>
            {item.icon}
          </span>
          <span style={{
            fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px',
            color: path === item.href ? '#C1FF72' : 'rgba(255,255,255,0.28)',
          }}>
            {item.label}
          </span>
        </Link>
      ))}
      <button
        onClick={onSkillsOpen}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          padding: '8px 12px', flex: 1, background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        <span style={{
          width: 24, height: 24, borderRadius: 7, background: '#C1FF72',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, color: '#000', fontWeight: 900, lineHeight: 1,
        }}>✦</span>
        <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'rgba(255,255,255,0.5)' }}>
          Skills
        </span>
      </button>
    </nav>
  )
}
