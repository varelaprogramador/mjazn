import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

async function logout() {
  'use server'
  const cookieStore = await cookies()
  cookieStore.delete('rn-admin')
  redirect('/admin/login')
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('rn-admin')?.value === 'true'

  if (!isAdmin) redirect('/admin/login')

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/produtos', label: 'Produtos', icon: '👕' },
    { href: '/admin/pedidos', label: 'Pedidos', icon: '📦' },
    { href: '/admin/drops', label: 'Drops', icon: '🔥' },
  ]

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

        <div className="p-3 border-t border-gray-border">
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-display tracking-wider text-gray-dim hover:text-fire transition-colors"
            >
              <span>↩</span>
              Sair
            </button>
          </form>
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-display tracking-wider text-gray-dim hover:text-off-white transition-colors mt-1"
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
