import { prisma } from '@/lib/prisma'
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

// ─── Todos os pedidos ─────────────────────────────────────────────────────────
export async function getAllOrders(opts?: { status?: OrderStatus; take?: number; skip?: number }) {
  return prisma.order.findMany({
    where: opts?.status ? { status: opts.status } : undefined,
    include: { items: { include: { product: { select: { name: true, slug: true } } } } },
    orderBy: { createdAt: 'desc' },
    take: opts?.take,
    skip: opts?.skip,
  })
}

// ─── Pedido por ID ────────────────────────────────────────────────────────────
export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  })
}

// ─── Criar pedido ─────────────────────────────────────────────────────────────
export async function createOrder(data: {
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCpf: string
  totalPrice: number
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  paymentMethod?: 'PIX' | 'CREDIT_CARD'
  paymentStatus?: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REFUNDED'
  asaasPaymentId?: string
  asaasCustomerId?: string
  items: {
    productId: string
    name: string
    size: string
    color: string
    quantity: number
    price: number
  }[]
}) {
  const { items, ...orderData } = data
  return prisma.order.create({
    data: {
      ...orderData,
      items: { create: items },
    },
    include: { items: true },
  })
}

// ─── Atualizar status do pedido ───────────────────────────────────────────────
export async function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.order.update({ where: { id }, data: { status } })
}

// ─── Estatísticas ─────────────────────────────────────────────────────────────
export async function getOrderStats() {
  const [total, pending, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: { status: { in: ['confirmed', 'shipped', 'delivered'] } },
    }),
  ])

  return {
    total,
    pending,
    revenue: revenue._sum.totalPrice ?? 0,
  }
}
