'use server'

import { prisma } from '@/lib/prisma'
import { getPixQrCode, type AsaasPixQrCode } from '@/lib/asaas'

export type OrderPixResult =
  | { success: true; pix: AsaasPixQrCode }
  | { success: false; error: string }

export async function getOrderPixAction(orderId: string): Promise<OrderPixResult> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { asaasPaymentId: true, paymentMethod: true },
    })

    if (!order || order.paymentMethod !== 'PIX' || !order.asaasPaymentId) {
      return { success: false, error: 'Pedido PIX não encontrado.' }
    }

    const pix = await getPixQrCode(order.asaasPaymentId)
    return { success: true, pix }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao buscar QR Code PIX.'
    return { success: false, error: message }
  }
}
