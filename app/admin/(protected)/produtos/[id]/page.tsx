import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getAllDrops } from '@/lib/db/drops'
import { formatPrice, getTotalStock } from '@/lib/utils'
import { deleteProductAction } from '@/app/actions/products'
import ImageUpload from '@/components/admin/ImageUpload'
import Badge from '@/components/ui/Badge'
import ProductEditForm from '@/components/admin/ProductEditForm'
import VariantManager from '@/components/admin/VariantManager'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminProdutoDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [product, drops] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: { orderBy: { size: 'asc' } }, drop: true },
    }),
    getAllDrops(),
  ])

  if (!product) notFound()

  const totalStock = getTotalStock(product.variants as { stock: number }[])

  return (
    <div className="p-6 space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/produtos"
            className="text-[10px] font-display tracking-widest text-gray-muted hover:text-fire transition-colors"
          >
            ← Produtos
          </Link>
          <span className="text-gray-dim">/</span>
          <p className="text-sm text-off-white">{product.name}</p>
        </div>
        <DeleteButton
          action={deleteProductAction.bind(null, product.id)}
          label="Excluir Produto"
          confirmMessage="Excluir este produto permanentemente?"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagens */}
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-display tracking-widest text-gray-muted mb-3">
              FOTOS DO PRODUTO
            </p>
            <ImageUpload
              productId={product.id}
              productSlug={product.slug}
              images={product.images}
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          {/* Dados visuais */}
          <div>
            <p className="text-[10px] font-display tracking-widest text-gray-muted mb-1">
              PRODUTO
            </p>
            <h1 className="font-display text-xl text-off-white">{product.name}</h1>
            <p className="text-xs text-gray-dim mt-0.5">{product.slug}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-gray-muted">Preço</p>
              <p className="font-display text-fire">{formatPrice(product.price)}</p>
            </div>
            {product.originalPrice && (
              <div>
                <p className="text-[10px] text-gray-muted">Preço Original</p>
                <p className="font-display text-gray-muted line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              </div>
            )}
            <div>
              <p className="text-[10px] text-gray-muted">Estoque Total</p>
              <p
                className={`font-display ${totalStock === 0 ? 'text-red-400' : totalStock <= 5 ? 'text-fire' : 'text-off-white'}`}
              >
                {totalStock} unidades
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-muted">Categoria</p>
              <p className="text-xs text-off-white capitalize">{product.category}</p>
            </div>
          </div>

          <div className="flex gap-1.5">
            {product.isNew && <Badge label="Novo" variant="fire" />}
            {product.isLimited && <Badge label="Limitado" variant="outline" />}
            {product.drop && <Badge label={product.drop.name} variant="dark" />}
          </div>

          {/* Link loja */}
          <Link
            href={`/produto/${product.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-xs font-display tracking-wider text-fire hover:text-fire-light transition-colors"
          >
            Ver na Loja →
          </Link>

          {/* Formulário de edição */}
          <ProductEditForm product={product} drops={drops} />
        </div>
      </div>

      {/* Variantes — linha completa */}
      <div className="border-t border-gray-border pt-6">
        <VariantManager productId={product.id} variants={product.variants} />
      </div>
    </div>
  )
}
