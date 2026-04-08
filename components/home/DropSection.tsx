import Link from 'next/link'
import type { Drop } from '@/lib/types'

interface DropSectionProps {
  drop: Drop
}

export default function DropSection({ drop }: DropSectionProps) {
  const percent = Math.round(((drop.stockLimit - drop.stockRemaining) / drop.stockLimit) * 100)

  return (
    <section id="drop" className="bg-dark py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Label */}
        <p className="text-[10px] font-display tracking-[0.5em] text-fire mb-4">{drop.name}</p>

        {/* Title */}
        <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-none text-off-white mb-2">
          {drop.tagline}
        </h2>
        <p className="text-sm text-gray-muted mb-10 max-w-lg leading-relaxed">
          {drop.description}
        </p>

        {/* Stock Counter */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display tracking-wider text-gray-muted">Disponibilidade</span>
            <span className="animate-pulse-fire text-sm font-display text-fire">
              Restam {drop.stockRemaining} peças
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-px bg-gray-border relative">
            <div
              className="absolute top-0 left-0 h-full bg-fire transition-all duration-1000"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-dim">
              {percent}% vendido
            </span>
            <span className="text-[10px] font-display tracking-wider text-fire">
              EDIÇÃO LIMITADA
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link
            href="/loja?drop=drop_001"
            className="inline-flex items-center justify-center h-12 px-8 bg-fire text-black font-display tracking-widest text-sm hover:bg-fire-light transition-colors duration-200"
          >
            Ver Drop Completo
          </Link>
          <p className="text-[10px] font-display tracking-widest text-gray-dim">
            Sem reposição após esgotar
          </p>
        </div>
      </div>
    </section>
  )
}
