'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { useSession } from '@/lib/auth-client'
import { useEffect, useState } from 'react'

interface NavCategory { slug: string; name: string }

export default function Header({ categories = [] }: { categories?: NavCategory[] }) {
  const { totalItems, openDrawer } = useCart()
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-black/95 backdrop-blur-sm border-b border-gray-border' : 'bg-transparent',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
          <Image src="/logo-simbol.png" alt="Região Norte" width={120} height={160} className="h-11 w-auto" priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/loja" className="text-xs font-display tracking-widest text-gray-muted hover:text-off-white transition-colors duration-200">
            Loja
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/loja?categoria=${cat.slug}`}
              className="text-xs font-display tracking-widest text-gray-muted hover:text-off-white transition-colors duration-200"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Account button */}
          <Link
            href={session ? '/conta' : '/conta/login'}
            className="relative flex items-center text-off-white hover:text-fire transition-colors duration-200"
            aria-label={session ? 'Minha conta' : 'Entrar'}
          >
            {session ? (
              /* Avatar circle quando logado */
              <div className="w-7 h-7 bg-fire/20 border border-fire/50 flex items-center justify-center">
                <span className="text-fire font-display text-[10px]">
                  {session.user.name?.charAt(0).toUpperCase() ?? '?'}
                </span>
              </div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </Link>

          {/* Cart button */}
          <button
            onClick={openDrawer}
            className="relative flex items-center text-off-white hover:text-fire transition-colors duration-200"
            aria-label="Abrir carrinho"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-fire text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-off-white"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark-mid border-t border-gray-border">
          <nav className="flex flex-col px-4 py-4 gap-4">
            <Link href="/loja" onClick={() => setMenuOpen(false)} className="text-sm font-display tracking-widest text-gray-muted hover:text-off-white transition-colors">
              Loja
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/loja?categoria=${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-display tracking-widest text-gray-muted hover:text-off-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <div className="border-t border-gray-border pt-3">
              <Link
                href={session ? '/conta' : '/conta/login'}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-display tracking-widest text-fire hover:text-fire-light transition-colors"
              >
                {session ? `◉ ${session.user.name?.split(' ')[0]}` : '→ Entrar / Cadastrar'}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
