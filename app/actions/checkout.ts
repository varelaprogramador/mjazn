'use server'

import { prisma } from '@/lib/prisma'
import {
  findOrCreateCustomer,
  createPixPayment,
  getPixQrCode,
  createCreditCardPayment,
  centsToReais,
  todayPlusDays,
  type AsaasPixQrCode,
} from '@/lib/asaas'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export interface CheckoutItem {
  productId: string
  slug?: string   // usado para resolver o ID real no banco
  name: string
  size: string
  color: string
  quantity: number
  price: number // centavos
}

interface BaseCheckoutInput {
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCpf: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  items: CheckoutItem[]
  totalPrice: number // centavos
}

export interface PixCheckoutInput extends BaseCheckoutInput {
  paymentMethod: 'PIX'
}

export interface CreditCardCheckoutInput extends BaseCheckoutInput {
  paymentMethod: 'CREDIT_CARD'
  installments: number
  card: {
    holderName: string
    number: string
    expiryMonth: string
    expiryYear: string
    ccv: string
  }
}

export type CheckoutInput = PixCheckoutInput | CreditCardCheckoutInput

export type CheckoutResult =
  | { success: true; orderId: string; paymentMethod: 'PIX'; pix: AsaasPixQrCode }
  | { success: true; orderId: string; paymentMethod: 'CREDIT_CARD'; status: 'CONFIRMED' | 'PENDING' | 'REFUSED'; cardBrand: string }
  | { success: false; error: string }

export async function checkoutAction(input: CheckoutInput): Promise<CheckoutResult> {
  try {
    // Verifica se há usuário logado para linkar o pedido
    const hdrs = await headers()
    const session = await auth.api.getSession({ headers: hdrs })
    const userId = session?.user?.id ?? null

    // 1. Cria/encontra cliente no Asaas
    const customer = await findOrCreateCustomer({
      name: input.customerName,
      email: input.customerEmail,
      phone: input.customerPhone,
      cpfCnpj: input.customerCpf,
      postalCode: input.zipCode,
      address: input.street,
      addressNumber: input.number,
      complement: input.complement,
      province: input.neighborhood,
      city: input.city,
      state: input.state,
    })

    const valueInReais = centsToReais(input.totalPrice)
    const dueDate = todayPlusDays(1)
    const description = `Pedido MJAZN — ${input.items.map((i) => `${i.name} (${i.size})`).join(', ')}`

    // 2. Resolve os IDs reais dos produtos no banco (evita FK violation com IDs do localStorage)
    const resolvedItems = await Promise.all(
      input.items.map(async (item) => {
        // Tenta pelo ID direto
        const byId = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true },
        })
        if (byId) return { ...item, productId: byId.id }

        // Fallback: busca pelo slug
        if (item.slug) {
          const bySlug = await prisma.product.findUnique({
            where: { slug: item.slug },
            select: { id: true },
          })
          if (bySlug) return { ...item, productId: bySlug.id }
        }

        throw new Error(`Produto não encontrado: ${item.name}`)
      })
    )

    // 3. Cria pedido no banco com status pending
    const order = await prisma.order.create({
      data: {
        userId,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        customerCpf: input.customerCpf,
        totalPrice: input.totalPrice,
        street: input.street,
        number: input.number,
        complement: input.complement,
        neighborhood: input.neighborhood,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode,
        paymentMethod: input.paymentMethod === 'PIX' ? 'PIX' : 'CREDIT_CARD',
        paymentStatus: 'PENDING',
        asaasCustomerId: customer.id,
        items: {
          create: resolvedItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    // 3. Cria pagamento no Asaas conforme método escolhido
    if (input.paymentMethod === 'PIX') {
      const payment = await createPixPayment({
        customer: customer.id,
        value: valueInReais,
        dueDate,
        description,
        externalReference: order.id,
      })

      await prisma.order.update({
        where: { id: order.id },
        data: { asaasPaymentId: payment.id },
      })

      const pix = await getPixQrCode(payment.id)

      return {
        success: true,
        orderId: order.id,
        paymentMethod: 'PIX',
        pix,
      }
    }

    // Cartão de crédito
    const ip =
      hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      hdrs.get('x-real-ip') ??
      '127.0.0.1'


    const cardPayment = await createCreditCardPayment({
      customer: customer.id,
      value: valueInReais,
      dueDate,
      description,
      externalReference: order.id,
      installmentCount: input.installments,
      creditCard: {
        holderName: input.card.holderName,
        number: input.card.number.replace(/\s/g, ''),
        expiryMonth: input.card.expiryMonth,
        expiryYear: input.card.expiryYear,
        ccv: input.card.ccv,
      },
      creditCardHolderInfo: {
        name: input.customerName,
        email: input.customerEmail,
        cpfCnpj: input.customerCpf,
        postalCode: input.zipCode,
        addressNumber: input.number,
        phone: input.customerPhone,
      },
      remoteIp: ip,
    })

    // Atualiza pedido com id do pagamento e status
    const paymentStatus =
      cardPayment.status === 'CONFIRMED' ? 'CONFIRMED' :
      cardPayment.status === 'REFUSED' ? 'FAILED' : 'PENDING'

    await prisma.order.update({
      where: { id: order.id },
      data: {
        asaasPaymentId: cardPayment.id,
        paymentStatus,
        status: cardPayment.status === 'CONFIRMED' ? 'confirmed' : 'pending',
      },
    })

    // Se aprovado, decrementa estoque das variantes
    if (cardPayment.status === 'CONFIRMED') {
      await decrementStock(input.items)
    }

    return {
      success: true,
      orderId: order.id,
      paymentMethod: 'CREDIT_CARD',
      status: cardPayment.status as 'CONFIRMED' | 'PENDING' | 'REFUSED',
      cardBrand: cardPayment.creditCard?.creditCardBrand ?? '',
    }
  } catch (err) {
    console.error('[checkoutAction]', err)
    const message = err instanceof Error ? err.message : 'Erro ao processar pagamento.'
    return { success: false, error: message }
  }
}

// =============================================
// Helper — decrementa estoque
// =============================================
async function decrementStock(items: CheckoutItem[]) {
  await Promise.all(
    items.map((item) =>
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
}
