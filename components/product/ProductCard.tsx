import Link from 'next/link'
import { formatPrice, getTotalStock } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'

interface ProductCardProps {
  product: {
    id: string
    slug: string
    name: string
    price: number
    originalPrice?: number | null
    category: string
    images: string[]
    isNew: boolean
    isLimited: boolean
    rating: number
    reviewCount: number
    variants: { stock: number }[]
  }
}

const categoryGradient: Record<string, string> = {
  camisetas: 'from-gray-dim/60 to-dark',
  polos: 'from-gray-muted/20 to-dark',
  kits: 'from-fire/20 to-dark',
  acessorios: 'from-gray-dim/40 to-dark',
}

export default function ProductCard({ product }: ProductCardProps) {
  const totalStock = getTotalStock(product.variants)
  const gradient = categoryGradient[product.category] ?? 'from-gray-dim/40 to-dark'
  const hasImages = product.images.length > 0
  const hasSecondImage = product.images.length > 1
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-dark mb-3">

        {hasImages ? (
          <>
            {/* Imagem principal */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[0]}
              alt={product.name}
              className={[
                'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
                hasSecondImage ? 'group-hover:opacity-0' : '',
              ].join(' ')}
            />
            {/* Imagem de costas (hover) */}
            {hasSecondImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[1]}
                alt={`${product.name} — detalhe`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          /* Gradient placeholder */
          <div className={`absolute inset-0 bg-gradient-to-b ${gradient} flex items-center justify-center`}>
            <span className="font-display text-4xl text-off-white/10 select-none">RN</span>
          </div>
        )}

        {/* Badges — esquerda */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.isNew && <Badge label="Novo" variant="fire" />}
          {product.isLimited && <Badge label="Limitado" variant="white" />}
          {totalStock === 0 && <Badge label="Esgotado" variant="dark" />}
          {totalStock > 0 && totalStock <= 3 && (
            <Badge label={`${totalStock} restantes`} variant="outline" />
          )}
        </div>

        {/* Badge desconto — direita */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <Badge label={`-${discount}%`} variant="fire" />
          </div>
        )}

        {/* Hover overlay sutil */}
        {!hasSecondImage && (
          <div className="absolute inset-0 bg-fire/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}

        {/* "Ver Produto" desliza para cima no hover */}
        <div className="absolute bottom-0 left-0 right-0 py-2 px-3 bg-dark/90 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <p className="text-[10px] font-display tracking-widest text-center text-off-white">
            Ver Produto
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <p className="text-xs font-display tracking-widest text-gray-muted uppercase">
          {product.category}
        </p>
        <p className="text-sm text-off-white group-hover:text-fire transition-colors duration-200 leading-snug">
          {product.name}
        </p>
        <div className="flex items-center gap-2">
          {product.originalPrice && (
            <span className="text-xs text-gray-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="text-sm font-display text-off-white">
            {formatPrice(product.price)}
          </span>
        </div>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
      </div>
    </Link>
  )
}
