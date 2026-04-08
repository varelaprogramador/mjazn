'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function createDropAction(_: unknown, formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const tagline = (formData.get('tagline') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string
  const stockLimit = parseInt(formData.get('stockLimit') as string)
  const isActive = formData.get('isActive') === 'on'

  if (!name || !tagline || !description || !startDate || !endDate || isNaN(stockLimit)) {
    return { error: 'Preencha todos os campos obrigatórios.' }
  }

  try {
    if (isActive) {
      await prisma.drop.updateMany({ data: { isActive: false } })
    }

    await prisma.drop.create({
      data: {
        name,
        tagline,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        stockLimit,
        stockRemaining: stockLimit,
        isActive,
      },
    })

    revalidatePath('/admin/drops')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Erro ao criar drop.' }
  }
}

export async function updateDropAction(_: unknown, formData: FormData) {
  const id = formData.get('id') as string
  const name = (formData.get('name') as string)?.trim()
  const tagline = (formData.get('tagline') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string
  const stockLimit = parseInt(formData.get('stockLimit') as string)
  const stockRemaining = parseInt(formData.get('stockRemaining') as string)
  const isActive = formData.get('isActive') === 'on'

  if (!id || !name || !tagline || !description || !startDate || !endDate) {
    return { error: 'Preencha todos os campos obrigatórios.' }
  }

  try {
    if (isActive) {
      await prisma.drop.updateMany({ where: { NOT: { id } }, data: { isActive: false } })
    }

    await prisma.drop.update({
      where: { id },
      data: {
        name,
        tagline,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        stockLimit,
        stockRemaining: isNaN(stockRemaining) ? stockLimit : stockRemaining,
        isActive,
      },
    })

    revalidatePath('/admin/drops')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Erro ao atualizar drop.' }
  }
}

export async function deleteDropAction(id: string) {
  try {
    // desvincular produtos antes de deletar
    await prisma.product.updateMany({ where: { dropId: id }, data: { dropId: null } })
    await prisma.drop.delete({ where: { id } })
    revalidatePath('/admin/drops')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Erro ao excluir drop.' }
  }
}
