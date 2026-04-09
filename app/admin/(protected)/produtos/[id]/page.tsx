import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getAllDrops } from '@/lib/db/drops'
import { getAllCategories } from '@/lib/db/categories'
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

  const [product, drops, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: { orderBy: { size: 'asc' } }, drop: true, category: true },
    }),
    getAllDrops(),
    getAllCategories(),
  ])

  if (!product) notFound()

  const totalStock = getTotalStock(product.variants as { stock: number }[])
  const stockStatus =
    totalStock === 0 ? 'Sem estoque' : totalStock <= 5 ? 'Estoque baixo' : 'Em estoque'
  const stockColor =
    totalStock === 0 ? 'text-red-400' : totalStock <= 5 ? 'text-fire' : 'text-green-400'

  return (
    <div className="min-h-full">
      {/* Barra de topo */}
      <div className="border-b border-gray-border bg-dark-mid px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin/produtos"
              className="text-[10px] font-display tracking-widest text-gray-muted hover:text-fire transition-colors shrink-0"
            >
              ← Produtos
            </Link>
            <span className="text-gray-dim">/</span>
            <h1 className="font-display text-sm text-off-white truncate">{product.name}</h1>
            <div className="flex items-center gap-1.5 shrink-0">
              {product.isNew && <Badge label="Novo" variant="fire" />}
              {product.isLimited && <Badge label="Limitado" variant="outline" />}
              {product.drop && <Badge label={product.drop.name} variant="dark" />}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/produto/${product.slug}`}
              target="_blank"
              className="h-8 px-4 flex items-center text-[10px] font-display tracking-widest border border-gray-border text-gray-muted hover:text-fire hover:border-fire transition-colors"
            >
              VER NA LOJA ↗
            </Link>
            <DeleteButton
              action={deleteProductAction.bind(null, product.id)}
              label="Excluir"
              confirmMessage="Excluir este produto permanentemente?"
            />
          </div>
        </div>
      </div>

      {/* Corpo principal */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">

          {/* Coluna esquerda — Imagens + Resumo */}
          <div className="space-y-6">
            {/* Imagens */}
            <div className="border border-gray-border bg-dark p-5">
              <p className="text-[10px] font-display tracking-[0.2em] text-gray-dim mb-4 border-b border-[#1f1f1f] pb-3">
                FOTOS DO PRODUTO
              </p>
              <ImageUpload
                productId={product.id}
                productSlug={product.slug}
                images={product.images}
              />
            </div>

            {/* Resumo */}
            <div className="border border-gray-border bg-dark p-5">
              <p className="text-[10px] font-display tracking-[0.2em] text-gray-dim mb-4 border-b border-[#1f1f1f] pb-3">
                RESUMO
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-gray-dim mb-1">PREÇO</p>
                  <p className="font-display text-fire text-sm">{formatPrice(product.price)}</p>
                </div>
                {product.originalPrice && (
                  <div>
                    <p className="text-[10px] text-gray-dim mb-1">ORIGINAL</p>
                    <p className="font-display text-gray-muted text-sm line-through">
                      {formatPrice(product.originalPrice)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-gray-dim mb-1">ESTOQUE</p>
                  <p className={`font-display text-sm ${stockColor}`}>{totalStock} un.</p>
                  <p className={`text-[9px] ${stockColor} opacity-70`}>{stockStatus}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-dim mb-1">CATEGORIA</p>
                  <p
                    className="text-xs font-display"
                    style={{ color: product.category.color }}
                  >
                    {product.category.name}
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-4">
                  <p className="text-[10px] text-gray-dim mb-1">SLUG</p>
                  <p className="text-[10px] font-mono text-gray-muted">{product.slug}</p>
                </div>
              </div>
            </div>

            {/* Variantes */}
            <div className="border border-gray-border bg-dark p-5">
              <VariantManager productId={product.id} variants={product.variants} />
            </div>
          </div>

          {/* Coluna direita — Formulário de edição */}
          <div className="xl:sticky xl:top-6 xl:self-start">
            <div className="border border-gray-border bg-dark p-5">
              <p className="text-[10px] font-display tracking-[0.2em] text-gray-dim mb-5 border-b border-[#1f1f1f] pb-3">
                EDITAR PRODUTO
              </p>
              <ProductEditForm
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  description: product.description,
                  shortDescription: product.shortDescription,
                  categoryId: product.categoryId,
                  isNew: product.isNew,
                  isLimited: product.isLimited,
                  tags: product.tags,
                  dropId: product.dropId,
                }}
                drops={drops}
                categories={categories}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
