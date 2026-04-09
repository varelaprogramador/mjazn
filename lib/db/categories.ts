import { prisma } from '@/lib/prisma'

export async function getAllCategories() {
  return prisma.productCategory.findMany({
    orderBy: { createdAt: 'asc' },
    include: { products: { select: { id: true } } },
  })
}

export async function getCategoryById(id: string) {
  return prisma.productCategory.findUnique({ where: { id } })
}

export async function getCategoryBySlug(slug: string) {
  return prisma.productCategory.findUnique({ where: { slug } })
}
