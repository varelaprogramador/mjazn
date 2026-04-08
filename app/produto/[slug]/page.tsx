import { notFound } from 'next/navigation'
import { getProductBySlug, getAllProductSlugs } from '@/lib/db/products'
import { formatPrice, getTotalStock, getStockLabel } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'
import ProductClientShell from '@/components/product/ProductClientShell'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllProductSlugs()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.name} — Região Norte`,
    description: product.shortDescription,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants = product.variants as any[]
  const totalStock = getTotalStock(variants)
  const stockLabel = getStockLabel(totalStock)

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-3">
            {product.images.length > 0 ? (
              <div className="relative aspect-[3/4] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  {product.isNew && <Badge label="Novo" variant="fire" />}
                  {product.isLimited && <Badge label="Limitado" variant="white" />}
                </div>
              </div>
            ) : (
              <div className="relative aspect-[3/4] bg-dark flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-dim/40 to-dark" />
                <span className="relative font-display text-6xl text-off-white/10 select-none">RN</span>
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  {product.isNew && <Badge label="Novo" variant="fire" />}
                  {product.isLimited && <Badge label="Limitado" variant="white" />}
                </div>
              </div>
            )}

            {/* Thumbnail row */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className="w-16 h-20 bg-dark flex-shrink-0 overflow-hidden border border-gray-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category + Drop */}
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-display tracking-[0.4em] text-fire uppercase">
                {product.category}
              </p>
              {product.dropId && (
                <>
                  <span className="text-gray-dim">·</span>
                  <p className="text-[10px] font-display tracking-[0.4em] text-gray-muted uppercase">
                    {product.drop?.name ?? 'Drop 01'}
                  </p>
                </>
              )}
            </div>

            {/* Name */}
            <h1 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-none text-off-white">
              {product.name}
            </h1>

            {/* Rating */}
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {product.originalPrice && (
                <span className="text-sm text-gray-muted line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="font-display text-3xl text-fire">{formatPrice(product.price)}</span>
            </div>

            {/* Stock warning */}
            {stockLabel && (
              <p className="animate-pulse-fire text-sm font-display tracking-wider text-fire">
                {stockLabel}
              </p>
            )}

            {/* Short description */}
            <p className="text-sm text-gray-muted leading-relaxed border-l-2 border-fire pl-4">
              {product.shortDescription}
            </p>

            {/* Variant + Add to cart (client shell) */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <ProductClientShell product={product as any} />

            {/* Description */}
            <div className="pt-6 border-t border-gray-border space-y-3">
              <p className="text-[10px] font-display tracking-[0.4em] text-gray-dim">DESCRIÇÃO</p>
              <p className="text-sm text-gray-muted leading-relaxed">{product.description}</p>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <Badge key={tag} label={`#${tag}`} variant="outline" />
                ))}
              </div>
            )}

            {/* Shipping note */}
            <div className="border border-gray-border p-4 flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <div>
                <p className="text-xs font-display tracking-wider text-off-white">Frete para todo o Brasil</p>
                <p className="text-[11px] text-gray-muted mt-0.5">Cálculo no checkout · Prazo estimado 5-10 dias úteis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
