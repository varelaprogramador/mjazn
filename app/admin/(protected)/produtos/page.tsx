import Link from 'next/link'
import { getAllProducts } from '@/lib/db/products'
import { getAllDrops } from '@/lib/db/drops'
import { getAllCategories } from '@/lib/db/categories'
import { formatPrice, getTotalStock } from '@/lib/utils'
import { deleteProductAction } from '@/app/actions/products'
import Badge from '@/components/ui/Badge'
import ProductFormModal from '@/components/admin/ProductFormModal'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminProdutos() {
  const [products, drops, categories] = await Promise.all([
    getAllProducts(),
    getAllDrops(),
    getAllCategories(),
  ])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-off-white">Produtos</h1>
          <p className="text-xs text-gray-muted mt-1">{products.length} produtos cadastrados</p>
        </div>
        <ProductFormModal drops={drops} categories={categories} />
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center border border-gray-border">
          <p className="font-display text-xl text-gray-muted">Nenhum produto cadastrado</p>
          <p className="text-xs text-gray-dim mt-2">Clique em &quot;+ Novo Produto&quot; para começar</p>
        </div>
      ) : (
        <div className="border border-gray-border overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-border bg-dark">
                <th className="text-left px-4 py-3 text-[10px] font-display tracking-widest text-gray-muted">Produto</th>
                <th className="text-left px-4 py-3 text-[10px] font-display tracking-widest text-gray-muted hidden sm:table-cell">Categoria</th>
                <th className="text-left px-4 py-3 text-[10px] font-display tracking-widest text-gray-muted">Preço</th>
                <th className="text-left px-4 py-3 text-[10px] font-display tracking-widest text-gray-muted hidden md:table-cell">Estoque</th>
                <th className="text-left px-4 py-3 text-[10px] font-display tracking-widest text-gray-muted hidden lg:table-cell">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: (typeof products)[0], i: number) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const stock = getTotalStock(product.variants as any[])
                return (
                  <tr
                    key={product.id}
                    className={[
                      'border-b border-gray-border hover:bg-dark transition-colors',
                      i % 2 === 0 ? 'bg-dark-mid' : 'bg-black',
                    ].join(' ')}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.images[0] ? (
                          <div className="w-8 h-8 bg-dark flex-shrink-0 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-dark flex-shrink-0 flex items-center justify-center">
                            <span className="text-[8px] font-display text-gray-dim">RN</span>
                          </div>
                        )}
                        <div>
                          <p className="text-off-white font-medium">{product.name}</p>
                          <p className="text-gray-dim text-[10px]">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className="text-[10px] font-display tracking-wider px-2 py-0.5 border"
                        style={{ borderColor: product.category.color, color: product.category.color }}
                      >
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-off-white">{formatPrice(product.price)}</p>
                      {product.originalPrice && (
                        <p className="text-gray-dim text-[10px] line-through">{formatPrice(product.originalPrice)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className={['font-display', stock === 0 ? 'text-red-400' : stock <= 5 ? 'text-fire animate-pulse-fire' : 'text-off-white'].join(' ')}>
                        {stock}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex gap-1">
                        {product.isNew && <Badge label="Novo" variant="fire" />}
                        {product.isLimited && <Badge label="Limitado" variant="outline" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/produtos/${product.id}`} className="text-[10px] font-display tracking-wider text-fire hover:text-fire-light transition-colors">
                          Editar
                        </Link>
                        <Link href={`/produto/${product.slug}`} className="text-[10px] font-display tracking-wider text-gray-muted hover:text-off-white transition-colors" target="_blank">
                          Ver →
                        </Link>
                        <DeleteButton action={deleteProductAction.bind(null, product.id)} confirmMessage="Excluir produto?" />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
