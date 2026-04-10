import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCustomerOrder } from '@/app/actions/customer'
import { getOrderPixAction } from '@/app/actions/order'
import { formatPrice } from '@/lib/utils'
import PixDisplay from './PixDisplay'

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

export default async function PedidoDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getCustomerOrder(id)

  if (!order) notFound()

  const pixResult = order.paymentMethod === 'PIX' && order.paymentStatus === 'PENDING'
    ? await getOrderPixAction(order.id)
    : null

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-3xl">
      {/* Back */}
      <Link href="/conta/pedidos" className="inline-flex items-center gap-1 text-[10px] font-display tracking-widest text-gray-muted hover:text-off-white transition-colors mb-6">
        ← VOLTAR AOS PEDIDOS
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-display tracking-[0.5em] text-fire mb-1">PEDIDO</p>
          <h1 className="font-display text-2xl text-off-white">#{order.id.slice(-8).toUpperCase()}</h1>
          <p className="text-xs text-gray-muted mt-1">
            {new Date(order.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <span className={`text-[10px] font-display tracking-widest px-3 py-1.5 border ${STATUS_COLOR[order.status] ?? 'text-gray-muted border-gray-border'}`}>
          {STATUS_LABEL[order.status] ?? order.status}
        </span>
      </div>

      <div className="space-y-6">
        {/* PIX QR Code — só se pagamento pendente */}
        {pixResult?.success && (
          <Section title="Pagamento PIX">
            <PixDisplay pix={pixResult.pix} />
          </Section>
        )}

        {/* Items */}
        <Section title={`Itens (${order.items.length})`}>
          <div className="divide-y divide-gray-border">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3">
                {/* Product image */}
                {item.product?.images?.[0] ? (
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-dark-mid">
                    <Image
                      src={item.product.images[0]}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 flex-shrink-0 bg-dark-mid border border-gray-border flex items-center justify-center">
                    <span className="text-gray-dim text-xs">RN</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-off-white font-display">{item.name}</p>
                  <p className="text-[10px] text-gray-muted mt-0.5">
                    Tamanho: {item.size} · Cor: {item.color} · Qtd: {item.quantity}
                  </p>
                  {item.product?.slug && (
                    <Link href={`/produto/${item.product.slug}`} className="text-[9px] text-fire hover:underline">
                      ver produto →
                    </Link>
                  )}
                </div>
                <p className="text-sm font-display text-off-white flex-shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-gray-border pt-4 flex justify-between">
            <p className="text-xs font-display tracking-widest text-gray-muted">TOTAL</p>
            <p className="font-display text-fire text-lg">{formatPrice(order.totalPrice)}</p>
          </div>
        </Section>

        {/* Payment info */}
        <Section title="Pagamento">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <Info label="Método" value={order.paymentMethod === 'PIX' ? 'PIX' : 'Cartão de Crédito'} />
            <Info
              label="Status"
              value={order.paymentStatus === 'CONFIRMED' ? 'Pago' : order.paymentStatus === 'PENDING' ? 'Aguardando' : order.paymentStatus === 'FAILED' ? 'Falhou' : 'Reembolsado'}
            />
          </div>
        </Section>

        {/* Delivery address */}
        <Section title="Endereço de Entrega">
          <div className="text-xs text-off-white space-y-1 leading-relaxed">
            <p className="font-display">{order.customerName}</p>
            <p>{order.street}, {order.number}{order.complement ? `, ${order.complement}` : ''}</p>
            <p>{order.neighborhood} — {order.city}, {order.state}</p>
            <p>CEP {order.zipCode}</p>
          </div>
        </Section>

        {/* Customer info */}
        <Section title="Dados do Cliente">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <Info label="Nome" value={order.customerName} />
            <Info label="E-mail" value={order.customerEmail} />
            <Info label="Telefone" value={order.customerPhone} />
            <Info label="CPF" value={order.customerCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')} />
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-border bg-dark p-5">
      <p className="text-[9px] font-display tracking-[0.4em] text-gray-muted mb-4">{title.toUpperCase()}</p>
      {children}
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-display tracking-widest text-gray-dim mb-0.5">{label.toUpperCase()}</p>
      <p className="text-xs text-off-white">{value}</p>
    </div>
  )
}
