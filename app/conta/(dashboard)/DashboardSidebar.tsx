'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { useState } from 'react'

const navLinks = [
  { href: '/conta', label: 'Início', icon: '◈' },
  { href: '/conta/pedidos', label: 'Meus Pedidos', icon: '◫' },
  { href: '/conta/perfil', label: 'Perfil & Endereços', icon: '◉' },
]

interface Props {
  user: { name: string; email: string }
}

export default function DashboardSidebar({ user }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    router.push('/conta/login')
  }

  const initial = user.name?.charAt(0).toUpperCase() ?? '?'

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-gray-border">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/logo-simbol.png" alt="RN" width={60} height={80} className="h-8 w-auto" />
          <span className="text-[9px] font-display tracking-[0.3em] text-fire">MINHA CONTA</span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-5 border-b border-gray-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-fire/20 border border-fire/40 flex items-center justify-center flex-shrink-0">
            <span className="text-fire font-display text-sm">{initial}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-display tracking-wide text-off-white truncate">{user.name}</p>
            <p className="text-[10px] text-gray-muted truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navLinks.map((link) => {
          const active = link.href === '/conta'
            ? pathname === '/conta'
            : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={[
                'flex items-center gap-3 px-3 py-2.5 text-xs font-display tracking-wider transition-all duration-150',
                active
                  ? 'text-fire bg-fire/8 border-l-2 border-fire'
                  : 'text-gray-muted hover:text-off-white hover:bg-dark border-l-2 border-transparent',
              ].join(' ')}
            >
              <span className="text-base leading-none">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer actions */}
      <div className="p-3 border-t border-gray-border space-y-0.5">
        <Link
          href="/loja"
          className="flex items-center gap-3 px-3 py-2.5 text-xs font-display tracking-wider text-gray-dim hover:text-off-white transition-colors"
        >
          <span>↗</span>
          Ver Loja
        </Link>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-display tracking-wider text-gray-muted hover:text-red-400 transition-colors text-left disabled:opacity-50"
        >
          <span>→</span>
          {signingOut ? 'Saindo...' : 'Sair da Conta'}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-dark-mid border-r border-gray-border flex-col flex-shrink-0">
        <NavContent />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-border h-14 flex items-center justify-between px-4">
        <Link href="/">
          <Image src="/logo-simbol.png" alt="RN" width={40} height={54} className="h-8 w-auto" />
        </Link>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="text-off-white p-1"
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/80" onClick={() => setMobileOpen(false)}>
          <aside className="w-72 h-full bg-dark-mid border-r border-gray-border flex flex-col" onClick={(e) => e.stopPropagation()}>
            <NavContent />
          </aside>
        </div>
      )}
    </>
  )
}
