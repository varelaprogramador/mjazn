import { getProductStats } from '@/lib/db/products'
import { getActiveDrop } from '@/lib/db/drops'
import { getOrderStats } from '@/lib/db/orders'
import { formatPrice, getTotalStock } from '@/lib/utils'

export default async function AdminDashboard() {
  const [productStats, activeDrop, orderStats] = await Promise.all([
    getProductStats(),
    getActiveDrop(),
    getOrderStats(),
  ])

  const stats = [
    { label: 'Produtos', value: productStats.total, color: 'text-off-white' },
    { label: 'Peças em Estoque', value: productStats.totalStock, color: 'text-off-white' },
    { label: 'Edições Limitadas', value: productStats.limited, color: 'text-fire' },
    { label: 'Sem Estoque', value: productStats.outOfStock, color: productStats.outOfStock > 0 ? 'text-red-400' : 'text-gray-muted' },
    { label: 'Pedidos', value: orderStats.total, color: 'text-off-white' },
    { label: 'Aguardando', value: orderStats.pending, color: orderStats.pending > 0 ? 'text-fire' : 'text-gray-muted' },
    { label: 'Receita', value: formatPrice(orderStats.revenue), color: 'text-green-400' },
  ]

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="font-display text-2xl text-off-white">Dashboard</h1>
        <p className="text-xs text-gray-muted mt-1">Visão geral da Região Norte</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-dark border border-gray-border p-5 space-y-1">
            <p className="text-[10px] font-display tracking-widest text-gray-muted">{stat.label}</p>
            <p className={`font-display text-3xl leading-none ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Active Drop */}
      {activeDrop && (
        <div className="bg-dark border border-fire/30 p-5 space-y-3">
          <p className="text-[10px] font-display tracking-widest text-fire">DROP ATIVO</p>
          <h2 className="font-display text-xl text-off-white">
            {activeDrop.name} — {activeDrop.tagline}
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-[10px] text-gray-muted">Estoque Total</p>
              <p className="font-display text-off-white">{activeDrop.stockLimit}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-muted">Restantes</p>
              <p className="font-display text-fire animate-pulse-fire">{activeDrop.stockRemaining}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-muted">Vendido</p>
              <p className="font-display text-off-white">
                {activeDrop.stockLimit - activeDrop.stockRemaining}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Alert */}
      {productStats.lowStock.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-display tracking-widest text-fire">⚠ ESTOQUE BAIXO</p>
          <div className="space-y-2">
            {productStats.lowStock.map((p) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const stock = getTotalStock(p.variants as any[])
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between bg-dark border border-gray-border px-4 py-3"
                >
                  <p className="text-sm text-off-white">{p.name}</p>
                  <span className="text-xs font-display text-fire animate-pulse-fire">
                    {stock} restantes
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Products */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-display tracking-widest text-gray-muted">PRODUTOS RECENTES</p>
          <a
            href="/admin/produtos"
            className="text-[10px] font-display tracking-wider text-fire hover:text-fire-light transition-colors"
          >
            Ver Todos →
          </a>
        </div>
        <div className="space-y-2">
          {productStats.lowStock.slice(0, 5).map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-dark border border-gray-border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-dark-mid flex items-center justify-center">
                  <span className="text-[9px] font-display text-gray-dim">RN</span>
                </div>
                <div>
                  <p className="text-xs text-off-white">{p.name}</p>
                  <p className="text-[10px] text-gray-muted">{p.category.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-display text-off-white">{formatPrice(p.price)}</p>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <p className="text-[10px] text-gray-muted">{getTotalStock(p.variants as any[])} un.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
