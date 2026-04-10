import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCustomerDashboardData } from '@/app/actions/customer'
import { formatPrice } from '@/lib/utils'

const STATUS_LABEL: Record<string, string> = {
  pending: 'Aguardando',
  confirmed: 'Confirmado',
  shipped: 'Em trânsito',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  confirmed: 'text-green-400 bg-green-400/10 border-green-400/30',
  shipped: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/30',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/30',
}

const PAYMENT_LABEL: Record<string, string> = {
  PENDING: 'Aguardando pagamento',
  CONFIRMED: 'Pago',
  FAILED: 'Falhou',
  REFUNDED: 'Reembolsado',
}

export default async function ContaDashboard() {
  const data = await getCustomerDashboardData()
  if (!data) redirect('/conta/login')

  const { user, recentOrders, stats } = data

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-display tracking-[0.5em] text-fire mb-1">INÍCIO</p>
        <h1 className="font-display text-3xl text-off-white">
          Olá, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-sm text-gray-muted mt-1">
          Membro desde {new Date(user?.createdAt ?? '').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard
          label="Total de Pedidos"
          value={String(stats.totalOrders)}
          sub={stats.totalOrders === 0 ? 'Nenhum pedido ainda' : stats.totalOrders === 1 ? '1 pedido feito' : `${stats.totalOrders} pedidos feitos`}
        />
        <StatCard
          label="Pagamentos Pendentes"
          value={String(stats.pendingOrders)}
          sub={stats.pendingOrders === 0 ? 'Tudo em dia ✓' : `${stats.pendingOrders} aguardando`}
          highlight={stats.pendingOrders > 0}
        />
        <StatCard
          label="Total Gasto"
          value={formatPrice(stats.totalSpent)}
          sub="Em pedidos confirmados"
        />
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-display tracking-[0.4em] text-gray-muted">PEDIDOS RECENTES</p>
          {stats.totalOrders > 0 && (
            <Link href="/conta/pedidos" className="text-[10px] font-display tracking-widest text-fire hover:text-fire-light transition-colors">
              VER TODOS →
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="border border-gray-border bg-dark p-10 text-center">
            <p className="text-gray-muted text-sm">Você ainda não fez nenhum pedido.</p>
            <Link
              href="/loja"
              className="inline-block mt-4 h-10 px-8 bg-fire text-black font-display tracking-widest text-xs hover:bg-fire-light transition-colors leading-10"
            >
              IR PARA A LOJA
            </Link>
          </div>
        ) : (
          <div className="border border-gray-border divide-y divide-gray-border">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/conta/pedidos/${order.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-dark transition-colors group"
              >
                <div className="space-y-1">
                  <p className="text-xs font-display tracking-widest text-off-white group-hover:text-fire transition-colors">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-[10px] text-gray-muted">
                    {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                    {order.items.length === 0 && '—'}
                  </p>
                  <p className="text-[10px] text-gray-dim">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[9px] font-display tracking-widest px-2 py-1 border ${STATUS_COLOR[order.status] ?? 'text-gray-muted border-gray-border bg-transparent'}`}>
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                  <p className="text-xs font-display text-off-white">{formatPrice(order.totalPrice)}</p>
                  <p className="text-[9px] text-gray-dim">{PAYMENT_LABEL[order.paymentStatus]}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        <Link
          href="/conta/perfil"
          className="border border-gray-border bg-dark p-5 hover:border-fire/50 transition-colors group"
        >
          <p className="text-[10px] font-display tracking-widest text-gray-muted group-hover:text-fire transition-colors mb-1">◉ PERFIL</p>
          <p className="text-xs text-off-white">Edite seus dados e endereços de entrega</p>
        </Link>
        <Link
          href="/loja"
          className="border border-gray-border bg-dark p-5 hover:border-fire/50 transition-colors group"
        >
          <p className="text-[10px] font-display tracking-widest text-gray-muted group-hover:text-fire transition-colors mb-1">↗ LOJA</p>
          <p className="text-xs text-off-white">Confira os novos drops e produtos</p>
        </Link>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, highlight = false }: {
  label: string
  value: string
  sub: string
  highlight?: boolean
}) {
  return (
    <div className={`border p-5 space-y-1 ${highlight ? 'border-fire/40 bg-fire/5' : 'border-gray-border bg-dark'}`}>
      <p className="text-[9px] font-display tracking-widest text-gray-muted">{label.toUpperCase()}</p>
      <p className={`font-display text-2xl ${highlight ? 'text-fire' : 'text-off-white'}`}>{value}</p>
      <p className="text-[10px] text-gray-dim">{sub}</p>
    </div>
  )
}
