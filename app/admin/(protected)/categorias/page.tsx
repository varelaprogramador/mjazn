import { getAllCategories } from '@/lib/db/categories'
import { deleteCategoryAction } from '@/app/actions/categories'
import DeleteButton from '@/components/admin/DeleteButton'
import CategoryFormModal from '@/components/admin/CategoryFormModal'
import CategoryImageUpload from '@/components/admin/CategoryImageUpload'

export default async function AdminCategorias() {
  const categories = await getAllCategories()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-off-white">Categorias</h1>
          <p className="text-xs text-gray-muted mt-1">{categories.length} categorias cadastradas</p>
        </div>
        <CategoryFormModal />
      </div>

      {categories.length === 0 ? (
        <div className="py-20 text-center border border-gray-border">
          <p className="font-display text-xl text-gray-muted">Nenhuma categoria cadastrada</p>
          <p className="text-xs text-gray-dim mt-2">Clique em &quot;+ Nova Categoria&quot; para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="border border-gray-border bg-dark p-4 space-y-4">
              {/* Imagem */}
              <CategoryImageUpload categoryId={cat.id} currentImage={cat.image ?? null} />

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-[#444] flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span
                    className="text-xs font-display tracking-wider"
                    style={{ color: cat.color }}
                  >
                    {cat.name}
                  </span>
                </div>
                <p className="text-[10px] text-gray-dim font-mono">{cat.slug}</p>
                {cat.description && (
                  <p className="text-[10px] text-gray-muted">{cat.description}</p>
                )}
                <p className="text-[10px] text-gray-dim">{cat.products.length} produto(s)</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1 border-t border-gray-border">
                <CategoryFormModal category={cat} />
                <DeleteButton
                  action={deleteCategoryAction.bind(null, cat.id)}
                  confirmMessage={`Excluir categoria "${cat.name}"?`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
