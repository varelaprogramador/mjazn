import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCustomerOrders } from '@/app/actions/customer'
import { formatPrice } from '@/lib/utils'

const STATUS_LABEL: Record<string, string> = {
  pending: 'Aguardando',
  confirmed: 'Confirmado',
  shipped: 'Em trânsito',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'text-yellow-400 border-yellow-400/40',
  confirmed: 'text-green-400 border-green-400/40',
  shipped: 'text-blue-400 border-blue-400/40',
  delivered: 'text-green-400 border-green-400/40',
  cancelled: 'text-red-400 border-red-400/40',
}

const PAYMENT_BADGE: Record<string, string> = {
  PENDING: 'text-yellow-400',
  CONFIRMED: 'text-green-400',
  FAILED: 'text-red-400',
  REFUNDED: 'text-blue-400',
}

const PAYMENT_LABEL: Record<string, string> = {
  PENDING: 'Aguardando',
  CONFIRMED: 'Pago',
  FAILED: 'Falhou',
  REFUNDED: 'Reembolsado',
}

export default async function MeusPedidos() {
  const orders = await getCustomerOrders()

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-4xl">
      <div className="mb-8">
        <p className="text-[10px] font-display tracking-[0.5em] text-fire mb-1">CONTA</p>
        <h1 className="font-display text-3xl text-off-white">Meus Pedidos</h1>
        <p className="text-sm text-gray-muted mt-1">{orders.length} {orders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}</p>
      </div>

      {orders.length === 0 ? (
        <div className="border border-gray-border bg-dark p-16 text-center">
          <p className="font-display text-off-white text-sm tracking-widest mb-2">NENHUM PEDIDO</p>
          <p className="text-gray-muted text-xs mb-6">Você ainda não fez nenhuma compra.</p>
          <Link
            href="/loja"
            className="inline-block h-11 px-10 bg-fire text-black font-display tracking-widest text-xs hover:bg-fire-light transition-colors leading-11"
          >
            EXPLORAR LOJA
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/conta/pedidos/${order.id}`}
              className="block border border-gray-border bg-dark hover:border-fire/40 transition-colors group"
            >
              {/* Order header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-border">
                <div className="flex items-center gap-4">
                  <p className="text-xs font-display tracking-widest text-off-white group-hover:text-fire transition-colors">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <span className={`text-[9px] font-display tracking-widest px-2 py-0.5 border ${STATUS_COLOR[order.status] ?? 'text-gray-muted border-gray-border'}`}>
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[9px] font-display ${PAYMENT_BADGE[order.paymentStatus]}`}>
                    {PAYMENT_LABEL[order.paymentStatus]}
                  </span>
                  <p className="text-sm font-display text-off-white">{formatPrice(order.totalPrice)}</p>
                </div>
              </div>

              {/* Items */}
              <div className="px-5 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-muted leading-relaxed">
                      {order.items.slice(0, 3).map((item) => (
                        `${item.name} (${item.size}, ${item.color}) ×${item.quantity}`
                      )).join(' • ')}
                      {order.items.length > 3 && ` +${order.items.length - 3} itens`}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-gray-muted">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </p>
                    <p className="text-[9px] text-fire mt-1 font-display tracking-widest group-hover:underline">
                      VER DETALHE →
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
