'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

async function requireSession() {
  const session = await getSession()
  if (!session) throw new Error('Não autenticado')
  return session
}

// ─────────────────────────────────────────────
// Perfil
// ─────────────────────────────────────────────

export async function getCustomerProfile() {
  const session = await getSession()
  if (!session) return null

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  })
}

export async function updateCustomerProfile(data: { name: string; phone?: string }) {
  const session = await requireSession()

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: data.name, phone: data.phone ?? null },
  })

  revalidatePath('/conta/perfil')
}

// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────

export async function getCustomerDashboardData() {
  const session = await getSession()
  if (!session) return null

  const [user, recentOrders, totalOrders, pendingOrders, totalSpentAgg] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, createdAt: true },
    }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        totalPrice: true,
        createdAt: true,
        items: { select: { name: true, quantity: true }, take: 2 },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.order.count({ where: { userId: session.user.id } }),
    prisma.order.count({ where: { userId: session.user.id, paymentStatus: 'PENDING' } }),
    prisma.order.aggregate({
      where: { userId: session.user.id, paymentStatus: 'CONFIRMED' },
      _sum: { totalPrice: true },
    }),
  ])

  return {
    user,
    recentOrders,
    stats: {
      totalOrders,
      pendingOrders,
      totalSpent: totalSpentAgg._sum.totalPrice ?? 0,
    },
  }
}

// ─────────────────────────────────────────────
// Pedidos
// ─────────────────────────────────────────────

export async function getCustomerOrders() {
  const session = await getSession()
  if (!session) return []

  return prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getCustomerOrder(orderId: string) {
  const session = await getSession()
  if (!session) return null

  return prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: {
      items: {
        include: {
          product: { select: { images: true, slug: true } },
        },
      },
    },
  })
}

// ─────────────────────────────────────────────
// Endereços
// ─────────────────────────────────────────────

export async function getCustomerAddresses() {
  const session = await getSession()
  if (!session) return []

  return prisma.customerAddress.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  })
}

export interface AddressInput {
  label: string
  recipientName: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

export async function saveCustomerAddress(data: AddressInput) {
  const session = await requireSession()

  if (data.isDefault) {
    await prisma.customerAddress.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    })
  }

  await prisma.customerAddress.create({
    data: { ...data, userId: session.user.id },
  })

  revalidatePath('/conta/perfil')
}

export async function deleteCustomerAddress(id: string) {
  const session = await requireSession()

  await prisma.customerAddress.deleteMany({
    where: { id, userId: session.user.id },
  })

  revalidatePath('/conta/perfil')
}

export async function setDefaultAddress(id: string) {
  const session = await requireSession()

  await prisma.customerAddress.updateMany({
    where: { userId: session.user.id },
    data: { isDefault: false },
  })

  await prisma.customerAddress.update({
    where: { id },
    data: { isDefault: true },
  })

  revalidatePath('/conta/perfil')
}

// ─────────────────────────────────────────────
// Checkout — dados salvos do cliente
// ─────────────────────────────────────────────

export async function getCheckoutPrefill() {
  const session = await getSession()
  if (!session) return null

  const [user, addr] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, phone: true },
    }),
    prisma.customerAddress.findFirst({
      where: { userId: session.user.id, isDefault: true },
    }) ?? prisma.customerAddress.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return { user, addr }
}
