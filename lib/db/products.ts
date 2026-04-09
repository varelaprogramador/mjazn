import { prisma } from '@/lib/prisma'

// ─── Buscar produto por slug ─────────────────────────────────────────────────
export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { variants: { orderBy: { size: 'asc' } }, drop: true, category: true },
  })
}

// ─── Produtos em destaque (novos ou limitados) ───────────────────────────────
export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { OR: [{ isNew: true }, { isLimited: true }] },
    include: { variants: true, category: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

// ─── Todos os produtos ────────────────────────────────────────────────────────
export async function getAllProducts(opts?: {
  categorySlug?: string
  dropId?: string
  take?: number
  skip?: number
}) {
  return prisma.product.findMany({
    where: {
      ...(opts?.categorySlug ? { category: { slug: opts.categorySlug } } : {}),
      ...(opts?.dropId ? { dropId: opts.dropId } : {}),
    },
    include: { variants: true, category: true },
    orderBy: { createdAt: 'desc' },
    take: opts?.take,
    skip: opts?.skip,
  })
}

// ─── Produtos de um drop ──────────────────────────────────────────────────────
export async function getProductsByDrop(dropId: string) {
  return prisma.product.findMany({
    where: { dropId },
    include: { variants: true, category: true },
    orderBy: { createdAt: 'desc' },
  })
}

// ─── Slugs para generateStaticParams ─────────────────────────────────────────
export async function getAllProductSlugs() {
  const products = await prisma.product.findMany({ select: { slug: true } })
  return products.map((p: { slug: string }) => ({ slug: p.slug }))
}

// ─── Criar produto ────────────────────────────────────────────────────────────
export async function createProduct(data: {
  slug: string
  name: string
  price: number
  originalPrice?: number
  description: string
  shortDescription: string
  categoryId: string
  images?: string[]
  isNew?: boolean
  isLimited?: boolean
  tags?: string[]
  dropId?: string
  variants: { size: string; color: string; colorHex: string; stock: number }[]
}) {
  const { variants, ...productData } = data
  return prisma.product.create({
    data: {
      ...productData,
      variants: { create: variants },
    },
    include: { variants: true, category: true },
  })
}

// ─── Atualizar produto ────────────────────────────────────────────────────────
export async function updateProduct(
  id: string,
  data: Partial<{
    name: string
    price: number
    originalPrice: number | null
    description: string
    shortDescription: string
    categoryId: string
    images: string[]
    isNew: boolean
    isLimited: boolean
    tags: string[]
    dropId: string | null
  }>
) {
  return prisma.product.update({
    where: { id },
    data,
    include: { variants: true, category: true },
  })
}

// ─── Atualizar estoque de variante ─────────────────────────────────────────
export async function updateVariantStock(variantId: string, stock: number) {
  return prisma.productVariant.update({
    where: { id: variantId },
    data: { stock },
  })
}

// ─── Deletar produto ──────────────────────────────────────────────────────────
export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } })
}

// ─── Estatísticas para admin ──────────────────────────────────────────────────
export async function getProductStats() {
  const [total, limited, outOfStock, stockSum] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isLimited: true } }),
    prisma.product.count({
      where: { variants: { every: { stock: 0 } } },
    }),
    prisma.productVariant.aggregate({ _sum: { stock: true } }),
  ])

  const lowStock = await prisma.product.findMany({
    where: {
      variants: {
        some: { stock: { gt: 0, lte: 5 } },
      },
    },
    include: { variants: true, category: true },
    take: 10,
  })

  return {
    total,
    limited,
    outOfStock,
    lowStock,
    totalStock: stockSum._sum.stock ?? 0,
  }
}
