import { getAllOrders } from '@/lib/db/orders'
import { formatPrice } from '@/lib/utils'

const statusLabel: Record<string, { label: string; class: string }> = {
  pending:   { label: 'Aguardando', class: 'text-gray-muted border-gray-muted' },
  confirmed: { label: 'Confirmado', class: 'text-fire-light border-fire-light' },
  shipped:   { label: 'Enviado', class: 'text-fire border-fire' },
  delivered: { label: 'Entregue', class: 'text-green-400 border-green-400' },
  cancelled: { label: 'Cancelado', class: 'text-red-400 border-red-400' },
}

function formatDate(date: Date) {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default async function AdminPedidos() {
  const orders = await getAllOrders({ take: 50 })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl text-off-white">Pedidos</h1>
        <p className="text-xs text-gray-muted mt-1">{orders.length} pedidos</p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center border border-gray-border">
          <p className="font-display text-xl text-gray-muted">Nenhum pedido ainda</p>
        </div>
      ) : (
        <div className="border border-gray-border overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-border bg-dark">
                {['Pedido', 'Cliente', 'Produto', 'Total', 'Data', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-display tracking-widest text-gray-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => {
                const s = statusLabel[order.status] ?? statusLabel.pending
                return (
                  <tr
                    key={order.id}
                    className={[
                      'border-b border-gray-border hover:bg-dark transition-colors',
                      i % 2 === 0 ? 'bg-dark-mid' : 'bg-black',
                    ].join(' ')}
                  >
                    <td className="px-4 py-3 font-mono text-gray-muted text-[10px]">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-off-white">{order.customerName}</p>
                      <p className="text-gray-dim text-[10px]">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      {order.items.map((item, j) => (
                        <p key={j} className="text-gray-muted">
                          {item.name} ({item.size}) ×{item.quantity}
                        </p>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-display text-off-white">{formatPrice(order.totalPrice)}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-muted">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`border px-2 py-0.5 text-[10px] font-display tracking-wider ${s.class}`}>
                        {s.label}
                      </span>
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
