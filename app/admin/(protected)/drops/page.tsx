import { getAllDrops } from '@/lib/db/drops'
import { deleteDropAction } from '@/app/actions/drops'
import DropFormModal from '@/components/admin/DropFormModal'
import DeleteButton from '@/components/admin/DeleteButton'

type DropItem = Awaited<ReturnType<typeof getAllDrops>>[number]

export default async function AdminDrops() {
  const drops = await getAllDrops()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-off-white">Drops</h1>
          <p className="text-xs text-gray-muted mt-1">Gerenciar coleções e drops</p>
        </div>
        <DropFormModal />
      </div>

      {drops.length === 0 ? (
        <div className="py-20 text-center border border-gray-border">
          <p className="font-display text-xl text-gray-muted">Nenhum drop cadastrado</p>
          <p className="text-xs text-gray-dim mt-2">Clique em &quot;+ Novo Drop&quot; para começar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drops.map((drop: DropItem) => {
            const percent =
              drop.stockLimit > 0
                ? Math.round(
                    ((drop.stockLimit - drop.stockRemaining) / drop.stockLimit) * 100,
                  )
                : 0

            return (
              <div key={drop.id} className="bg-dark border border-gray-border p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-display text-xl text-off-white">{drop.name}</p>
                      {drop.isActive && (
                        <span className="px-2 py-0.5 bg-fire/20 text-fire text-[10px] font-display tracking-widest">
                          ATIVO
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-fire font-display">{drop.tagline}</p>
                    <p className="text-xs text-gray-muted mt-1">{drop.description}</p>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <DropFormModal drop={drop} />
                    <DeleteButton
                      action={deleteDropAction.bind(null, drop.id)}
                      confirmMessage="Excluir este drop? Produtos vinculados serão desvinculados."
                    />
                  </div>
                </div>

                {/* Stock bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-muted font-display tracking-wider">Estoque</span>
                    <span className="text-fire font-display animate-pulse-fire">
                      {drop.stockRemaining} / {drop.stockLimit} restantes
                    </span>
                  </div>
                  <div className="h-1 bg-gray-border">
                    <div
                      className="h-full bg-fire transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-dim">{percent}% vendido</p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] text-gray-dim font-display tracking-wider">INÍCIO</p>
                    <p className="text-off-white mt-0.5">
                      {new Date(drop.startDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-dim font-display tracking-wider">FIM</p>
                    <p className="text-off-white mt-0.5">
                      {new Date(drop.endDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Products in drop */}
                <div>
                  <p className="text-[10px] text-gray-dim font-display tracking-wider mb-2">
                    PRODUTOS ({drop.products.length})
                  </p>
                  {drop.products.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {drop.products.map((p) => (
                        <span
                          key={p.id}
                          className="px-2 py-1 bg-dark-mid border border-gray-border text-[10px] font-display text-gray-muted"
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-dim">Nenhum produto neste drop</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
