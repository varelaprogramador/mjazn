import Link from 'next/link'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/produtos', label: 'Produtos', icon: '👕' },
  { href: '/admin/pedidos', label: 'Pedidos', icon: '📦' },
  { href: '/admin/drops', label: 'Drops', icon: '🔥' },
  { href: '/admin/categorias', label: 'Categorias', icon: '🏷️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-mid flex">
      {/* Sidebar */}
      <aside className="w-56 bg-black border-r border-gray-border flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-border flex items-center gap-2">
          <Image
            src="/logo-simbol.png"
            alt="Região Norte"
            width={120}
            height={160}
            className="h-10 w-auto"
          />
          <p className="text-[9px] font-display tracking-widest text-fire">ADMIN</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-display tracking-wider text-gray-muted hover:text-off-white hover:bg-dark transition-all duration-150 rounded-sm"
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-border space-y-2">
          {/* Clerk UserButton — avatar + menu de sair */}
          <div className="flex items-center gap-2.5 px-3 py-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-7 h-7',
                },
              }}
            />
            <span className="text-xs font-display tracking-wider text-gray-dim">Conta</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-display tracking-wider text-gray-dim hover:text-off-white transition-colors"
          >
            <span>🌐</span>
            Ver Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
