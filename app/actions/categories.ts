'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { uploadCategoryImage, deleteCategoryImageFile } from '@/lib/supabase'

export async function createCategoryAction(_: unknown, formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const color = (formData.get('color') as string)?.trim() || '#FF4500'
  const description = (formData.get('description') as string)?.trim() || null

  if (!name) return { error: 'Nome é obrigatório.' }

  const baseSlug = slugify(name)
  let slug = baseSlug
  let suffix = 1
  while (await prisma.productCategory.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`
  }

  try {
    await prisma.productCategory.create({ data: { name, slug, color, description } })
    revalidatePath('/admin/categorias')
    revalidatePath('/admin/produtos')
    revalidatePath('/')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Erro ao criar categoria.' }
  }
}

export async function updateCategoryAction(_: unknown, formData: FormData) {
  const id = formData.get('id') as string
  const name = (formData.get('name') as string)?.trim()
  const color = (formData.get('color') as string)?.trim() || '#FF4500'
  const description = (formData.get('description') as string)?.trim() || null

  if (!id || !name) return { error: 'Preencha todos os campos.' }

  try {
    await prisma.productCategory.update({ where: { id }, data: { name, color, description } })
    revalidatePath('/admin/categorias')
    revalidatePath('/admin/produtos')
    revalidatePath('/')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Erro ao atualizar categoria.' }
  }
}

export async function deleteCategoryAction(id: string) {
  const count = await prisma.product.count({ where: { categoryId: id } })
  if (count > 0) {
    return { error: `Categoria possui ${count} produto(s). Mova-os primeiro.` }
  }
  try {
    await prisma.productCategory.delete({ where: { id } })
    revalidatePath('/admin/categorias')
    revalidatePath('/')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Erro ao excluir categoria.' }
  }
}

export async function uploadCategoryImageAction(
  categoryId: string,
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const file = formData.get('file') as File | null
  if (!file) return { error: 'Arquivo obrigatório.' }
  if (!file.type.startsWith('image/')) return { error: 'Arquivo deve ser uma imagem.' }
  if (file.size > 10 * 1024 * 1024) return { error: 'Imagem deve ter no máximo 10MB.' }

  try {
    const category = await prisma.productCategory.findUnique({ where: { id: categoryId } })
    if (!category) return { error: 'Categoria não encontrada.' }

    // Remove imagem antiga se existir
    if (category.image) {
      await deleteCategoryImageFile(category.image).catch(() => null)
    }

    const url = await uploadCategoryImage(file, category.slug)
    await prisma.productCategory.update({ where: { id: categoryId }, data: { image: url } })

    revalidatePath('/admin/categorias')
    revalidatePath('/')
    return { url }
  } catch (e) {
    console.error(e)
    return { error: 'Falha no upload.' }
  }
}

export async function deleteCategoryImageAction(
  categoryId: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const category = await prisma.productCategory.findUnique({ where: { id: categoryId } })
    if (!category?.image) return { success: true }

    await deleteCategoryImageFile(category.image).catch(() => null)
    await prisma.productCategory.update({ where: { id: categoryId }, data: { image: null } })

    revalidatePath('/admin/categorias')
    revalidatePath('/')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Falha ao remover imagem.' }
  }
}
