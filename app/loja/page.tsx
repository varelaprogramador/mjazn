import Link from 'next/link'
import { getAllProducts } from '@/lib/db/products'
import { getActiveDrop } from '@/lib/db/drops'
import ProductCard from '@/components/product/ProductCard'
import type { Category } from '@prisma/client'

const VALID_CATEGORIES: Category[] = ['camisetas', 'polos', 'kits', 'acessorios']

const categories = [
  { value: '', label: 'Tudo' },
  { value: 'camisetas', label: 'Camisetas' },
  { value: 'polos', label: 'Polos' },
  { value: 'kits', label: 'Kits' },
  { value: 'acessorios', label: 'Acessórios' },
]

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; drop?: string }>
}) {
  const { categoria, drop: dropFilter } = await searchParams

  const validCategory = VALID_CATEGORIES.includes(categoria as Category)
    ? (categoria as Category)
    : undefined

  const [products, activeDrop] = await Promise.all([
    getAllProducts({
      category: validCategory,
      dropId: dropFilter,
    }),
    getActiveDrop(),
  ])

  const titleText = dropFilter
    ? 'Drop 01 — Marcados pelo Fogo'
    : validCategory
      ? validCategory.charAt(0).toUpperCase() + validCategory.slice(1)
      : 'Coleção Completa'

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Header */}
      <div className="border-b border-gray-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-[10px] font-display tracking-[0.5em] text-fire mb-2">REGIÃO NORTE</p>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] leading-none text-off-white">
            {titleText}
          </h1>
          <p className="text-sm text-gray-muted mt-2">
            {products.length} {products.length === 1 ? 'produto' : 'produtos'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Active Drop Banner */}
        {activeDrop && !dropFilter && (
          <Link
            href={`/loja?drop=${activeDrop.id}`}
            className="block mb-8 p-4 border border-fire/30 bg-fire/5 hover:bg-fire/10 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-display tracking-widest text-fire">DROP ATIVO</p>
                <p className="text-sm font-display text-off-white mt-0.5">
                  {activeDrop.name} — {activeDrop.tagline}
                </p>
              </div>
              <div className="text-right">
                <p className="animate-pulse-fire text-xs font-display text-fire">
                  {activeDrop.stockRemaining} restantes
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const isActive = (validCategory ?? '') === cat.value && !dropFilter
            return (
              <Link
                key={cat.value}
                href={cat.value ? `/loja?categoria=${cat.value}` : '/loja'}
                className={[
                  'px-4 h-8 text-xs font-display tracking-widest border transition-all duration-150',
                  isActive
                    ? 'bg-fire text-black border-fire'
                    : 'border-gray-border text-gray-muted hover:border-fire hover:text-fire',
                ].join(' ')}
              >
                {cat.label}
              </Link>
            )
          })}
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-xl text-gray-muted">Nenhum produto encontrado</p>
            <Link
              href="/loja"
              className="mt-4 inline-block text-xs font-display tracking-widest text-fire hover:text-fire-light transition-colors"
            >
              Ver Tudo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
