import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface KitSectionProps {
  kit: Product
}

const kitItems = [
  { icon: '👕', label: 'Camiseta Oversized', description: 'Algodão premium, estampa exclusiva' },
  { icon: '📖', label: 'Bíblia NVI Letra Grande', description: 'Capa dura, papel bíblia' },
  { icon: '📔', label: 'Devocional 30 dias', description: '"Marcados pelo Fogo"' },
]

export default function KitSection({ kit }: KitSectionProps) {
  const savings = kit.originalPrice ? kit.originalPrice - kit.price : 0

  return (
    <section className="bg-dark-mid py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-[10px] font-display tracking-[0.5em] text-fire mb-3">COMBO ESPECIAL</p>
          <h2 className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-none text-off-white">
            KIT FOGO
          </h2>
          <p className="text-sm text-gray-muted mt-4 max-w-sm mx-auto leading-relaxed">
            Mais do que um presente. Um ponto de partida para quem quer viver com profundidade.
          </p>
        </div>

        {/* Kit Contents */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {kitItems.map((item, i) => (
            <div
              key={i}
              className="bg-dark border border-gray-border p-5 text-center space-y-2 hover:border-fire/30 transition-colors duration-300"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <p className="font-display text-sm text-off-white">{item.label}</p>
              <p className="text-[11px] text-gray-muted">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex flex-col items-center gap-5">
          {/* Price */}
          <div className="text-center space-y-1">
            {kit.originalPrice && (
              <p className="text-sm text-gray-muted line-through">{formatPrice(kit.originalPrice)}</p>
            )}
            <p className="font-display text-[clamp(2rem,6vw,4rem)] text-fire leading-none">
              {formatPrice(kit.price)}
            </p>
            {savings > 0 && (
              <p className="text-xs font-display tracking-widest text-fire-light">
                Economia de {formatPrice(savings)}
              </p>
            )}
          </div>

          {/* CTA */}
          <Link
            href={`/produto/${kit.slug}`}
            className="inline-flex items-center justify-center h-14 px-10 bg-fire text-black font-display tracking-widest text-sm hover:bg-fire-light transition-colors duration-200"
          >
            Quero o Kit Fogo
          </Link>

          <p className="text-[10px] font-display tracking-widest text-gray-dim">
            Estoque limitado · Entrega em todo Brasil
          </p>
        </div>
      </div>
    </section>
  )
}
