import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// Eventos que o Asaas envia via webhook
// Docs: https://docs.asaas.com/reference/webhooks
interface AsaasWebhookEvent {
  event: string
  payment: {
    id: string
    status: string
    externalReference?: string
    billingType: string
    value: number
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AsaasWebhookEvent

    const { event, payment } = body

    // Ignora eventos que não são de pagamento
    if (!payment?.id) {
      return new Response('ok', { status: 200 })
    }

    // Encontra o pedido pelo asaasPaymentId
    const order = await prisma.order.findFirst({
      where: { asaasPaymentId: payment.id },
      include: { items: true },
    })

    if (!order) {
      // Pode ter chegado antes de salvarmos o id — ignora silenciosamente
      return new Response('ok', { status: 200 })
    }

    if (event === 'PAYMENT_CONFIRMED' || event === 'PAYMENT_RECEIVED') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'CONFIRMED',
          status: 'confirmed',
        },
      })

      // Decrementa estoque das variantes
      await Promise.all(
        order.items.map((item) =>
          prisma.productVariant.updateMany({
            where: {
              productId: item.productId,
              size: item.size,
              color: item.color,
            },
            data: { stock: { decrement: item.quantity } },
          })
        )
      )
    } else if (event === 'PAYMENT_OVERDUE' || event === 'PAYMENT_DELETED') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'FAILED',
          status: 'cancelled',
        },
      })
    } else if (event === 'PAYMENT_REFUNDED' || event === 'PAYMENT_CHARGEBACK_REQUESTED') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'REFUNDED',
          status: 'cancelled',
        },
      })
    }

    return new Response('ok', { status: 200 })
  } catch (err) {
    console.error('[webhook/asaas]', err)
    // Retorna 200 mesmo em erro para o Asaas não re-tentar em loop
    return new Response('error', { status: 200 })
  }
}
