import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="border-t border-gray-border bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Image
              src="/logo-simbol.png"
              alt="Região Norte"
              width={120}
              height={160}
              className="h-16 w-auto"
            />
            <p className="text-xs text-gray-muted leading-relaxed max-w-[200px]">
              Marcados pelo fogo. Sem meia profundidade. Uma geração em chamas.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <p className="text-[10px] font-display tracking-[0.3em] text-gray-dim">NAVEGAÇÃO</p>
            <nav className="flex flex-col gap-2">
              {[
                { href: '/loja', label: 'Loja' },
                { href: '/loja?categoria=camisetas', label: 'Camisetas' },
                { href: '/loja?categoria=polos', label: 'Polos' },
                { href: '/loja?categoria=kits', label: 'Kits' },
                { href: '/loja?categoria=acessorios', label: 'Acessórios' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-gray-muted hover:text-off-white transition-colors duration-200 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <p className="text-[10px] font-display tracking-[0.3em] text-gray-dim">CONTATO</p>
            <div className="flex flex-col gap-2">
              <a
                href="https://instagram.com/regiaonorte"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-muted hover:text-off-white transition-colors duration-200 w-fit"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                @regiaonorte
              </a>
              <a
                href="https://wa.me/5592000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-muted hover:text-off-white transition-colors duration-200 w-fit"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-gray-dim tracking-widest">
            © 2025 REGIÃO NORTE. TODOS OS DIREITOS RESERVADOS.
          </p>
          <p className="text-[10px] text-gray-dim">
            Marcados pelo fogo — desde o início
          </p>
        </div>
      </div>
    </footer>
  )
}
