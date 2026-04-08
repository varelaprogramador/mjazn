import Link from 'next/link'
import type { Product } from '@/lib/types'
import ProductCard from '@/components/product/ProductCard'

interface ProductsGridProps {
  products: Product[]
  title?: string
  subtitle?: string
  showViewAll?: boolean
}

export default function ProductsGrid({
  products,
  title = 'Destaques',
  subtitle,
  showViewAll = true,
}: ProductsGridProps) {
  return (
    <section className="bg-black py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] font-display tracking-[0.5em] text-fire mb-2">
              COLEÇÃO
            </p>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-none text-off-white">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-muted mt-2">{subtitle}</p>
            )}
          </div>
          {showViewAll && (
            <Link
              href="/loja"
              className="text-xs font-display tracking-widest text-gray-muted hover:text-fire transition-colors duration-200 hidden sm:flex items-center gap-1"
            >
              Ver Tudo
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {showViewAll && (
          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/loja"
              className="inline-flex items-center gap-2 text-xs font-display tracking-widest text-gray-muted hover:text-fire transition-colors"
            >
              Ver Toda a Coleção
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
