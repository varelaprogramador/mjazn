import { prisma } from '@/lib/prisma'

// ─── Drop ativo ───────────────────────────────────────────────────────────────
export async function getActiveDrop() {
  return prisma.drop.findFirst({
    where: { isActive: true },
    include: { products: { include: { variants: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

// ─── Todos os drops ───────────────────────────────────────────────────────────
export async function getAllDrops() {
  return prisma.drop.findMany({
    include: { products: { include: { variants: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

// ─── Drop por ID ──────────────────────────────────────────────────────────────
export async function getDropById(id: string) {
  return prisma.drop.findUnique({
    where: { id },
    include: { products: { include: { variants: true } } },
  })
}

// ─── Criar drop ───────────────────────────────────────────────────────────────
export async function createDrop(data: {
  name: string
  tagline: string
  description: string
  startDate: Date
  endDate: Date
  stockLimit: number
  stockRemaining: number
  isActive?: boolean
}) {
  return prisma.drop.create({ data })
}

// ─── Atualizar drop ───────────────────────────────────────────────────────────
export async function updateDrop(
  id: string,
  data: Partial<{
    name: string
    tagline: string
    description: string
    stockRemaining: number
    isActive: boolean
  }>
) {
  return prisma.drop.update({ where: { id }, data })
}

// ─── Decrementar estoque do drop ──────────────────────────────────────────────
export async function decrementDropStock(dropId: string, qty: number) {
  return prisma.drop.update({
    where: { id: dropId },
    data: { stockRemaining: { decrement: qty } },
  })
}
