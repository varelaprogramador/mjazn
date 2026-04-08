'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import type { Category } from '@prisma/client'

const VALID_CATEGORIES: Category[] = ['camisetas', 'polos', 'kits', 'acessorios']

export async function createProductAction(_: unknown, formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const priceRaw = formData.get('price') as string
  const originalPriceRaw = formData.get('originalPrice') as string
  const description = (formData.get('description') as string)?.trim()
  const shortDescription = (formData.get('shortDescription') as string)?.trim()
  const category = formData.get('category') as Category
  const isNew = formData.get('isNew') === 'on'
  const isLimited = formData.get('isLimited') === 'on'
  const dropId = (formData.get('dropId') as string)?.trim() || null
  const tagsRaw = (formData.get('tags') as string)?.trim()
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : []
  const variantsJson = formData.get('variants') as string

  if (!name || !description || !shortDescription || !category) {
    return { error: 'Preencha todos os campos obrigatórios.' }
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return { error: 'Categoria inválida.' }
  }

  const price = Math.round(parseFloat(priceRaw) * 100)
  if (isNaN(price) || price <= 0) return { error: 'Preço inválido.' }

  const originalPrice = originalPriceRaw
    ? Math.round(parseFloat(originalPriceRaw) * 100)
    : undefined

  let variants: { size: string; color: string; colorHex: string; stock: number }[] = []
  try {
    variants = variantsJson ? JSON.parse(variantsJson) : []
  } catch {
    return { error: 'Variantes inválidas.' }
  }

  const baseSlug = slugify(name)
  let slug = baseSlug
  let suffix = 1
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`
  }

  try {
    await prisma.product.create({
      data: {
        slug,
        name,
        price,
        originalPrice,
        description,
        shortDescription,
        category,
        isNew,
        isLimited,
        tags,
        dropId,
        images: [],
        variants: { create: variants },
      },
    })

    revalidatePath('/admin/produtos')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Erro ao criar produto.' }
  }
}

export async function updateProductAction(_: unknown, formData: FormData) {
  const id = formData.get('id') as string
  const name = (formData.get('name') as string)?.trim()
  const priceRaw = formData.get('price') as string
  const originalPriceRaw = formData.get('originalPrice') as string
  const description = (formData.get('description') as string)?.trim()
  const shortDescription = (formData.get('shortDescription') as string)?.trim()
  const isNew = formData.get('isNew') === 'on'
  const isLimited = formData.get('isLimited') === 'on'
  const dropId = (formData.get('dropId') as string)?.trim() || null
  const tagsRaw = (formData.get('tags') as string)?.trim()
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : []

  if (!id || !name || !description || !shortDescription) {
    return { error: 'Preencha todos os campos obrigatórios.' }
  }

  const price = Math.round(parseFloat(priceRaw) * 100)
  if (isNaN(price) || price <= 0) return { error: 'Preço inválido.' }

  const originalPrice = originalPriceRaw ? Math.round(parseFloat(originalPriceRaw) * 100) : null

  try {
    await prisma.product.update({
      where: { id },
      data: { name, price, originalPrice, description, shortDescription, isNew, isLimited, tags, dropId },
    })

    revalidatePath(`/admin/produtos/${id}`)
    revalidatePath('/admin/produtos')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Erro ao atualizar produto.' }
  }
}

export async function deleteProductAction(id: string) {
  try {
    await prisma.product.delete({ where: { id } })
    revalidatePath('/admin/produtos')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Erro ao excluir produto. Verifique se não há pedidos vinculados.' }
  }
}

export async function updateVariantStockAction(variantId: string, stock: number, productId: string) {
  try {
    await prisma.productVariant.update({ where: { id: variantId }, data: { stock } })
    revalidatePath(`/admin/produtos/${productId}`)
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Erro ao atualizar estoque.' }
  }
}

export async function addVariantAction(_: unknown, formData: FormData) {
  const productId = formData.get('productId') as string
  const size = (formData.get('size') as string)?.trim().toUpperCase()
  const color = (formData.get('color') as string)?.trim()
  const colorHex = (formData.get('colorHex') as string)?.trim() || '#000000'
  const stock = parseInt(formData.get('stock') as string) || 0

  if (!productId || !size || !color) {
    return { error: 'Preencha tamanho e cor.' }
  }

  try {
    await prisma.productVariant.create({ data: { productId, size, color, colorHex, stock } })
    revalidatePath(`/admin/produtos/${productId}`)
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Variante já existe ou erro ao criar.' }
  }
}

export async function deleteVariantAction(variantId: string, productId: string) {
  try {
    await prisma.productVariant.delete({ where: { id: variantId } })
    revalidatePath(`/admin/produtos/${productId}`)
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Erro ao excluir variante.' }
  }
}
