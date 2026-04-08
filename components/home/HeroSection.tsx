import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-fire/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black via-transparent to-transparent" />
        {/* Glow laranja atrás da logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-fire/6 rounded-full blur-[160px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <p
          className="animate-fade-in-up text-[10px] font-display tracking-[0.5em] text-fire mb-8"
          style={{ animationDelay: '0ms', animationFillMode: 'both' }}
        >
          MINISTÉRIO JOVEM · NORTE DO BRASIL
        </p>

        {/* Logo Completa — destaque principal */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: '150ms', animationFillMode: 'both' }}
        >
          <Image
            src="/logo-compl.png"
            alt="Região Norte — Ministério Jovem"
            width={560}
            height={336}
            className="w-[min(85vw,480px)] h-auto"
            priority
          />
        </div>

        {/* Tagline */}
        <p
          className="animate-fade-in-up mt-4 text-sm sm:text-base font-display tracking-[0.25em] text-gray-muted"
          style={{ animationDelay: '350ms', animationFillMode: 'both' }}
        >
          Uma geração marcada pelo fogo
        </p>

        {/* Divider */}
        <div
          className="animate-fade-in-up mt-8 w-8 h-px bg-fire"
          style={{ animationDelay: '450ms', animationFillMode: 'both' }}
        />

        {/* CTA */}
        <div
          className="animate-fade-in-up mt-8 flex flex-col sm:flex-row items-center gap-4"
          style={{ animationDelay: '550ms', animationFillMode: 'both' }}
        >
          <Link
            href="/loja"
            className="inline-flex items-center justify-center h-12 px-8 bg-fire text-black font-display tracking-widest text-sm hover:bg-fire-light transition-colors duration-200"
          >
            Explorar Coleção
          </Link>
          <Link
            href="#drop"
            className="inline-flex items-center gap-2 text-xs font-display tracking-widest text-gray-muted hover:text-off-white transition-colors duration-200"
          >
            Ver Drop Atual
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="animate-fade-in absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animationDelay: '1000ms', animationFillMode: 'both' }}
      >
        <p className="text-[9px] font-display tracking-[0.4em] text-gray-dim">SCROLL</p>
        <div className="w-px h-8 bg-gradient-to-b from-gray-dim to-transparent" />
      </div>
    </section>
  )
}
