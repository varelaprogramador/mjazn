'use server'

import { uploadProductImage, deleteProductImage } from '@/lib/supabase'
import { updateProduct } from '@/lib/db/products'

export async function uploadImageAction(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const file = formData.get('file') as File | null
  const productId = formData.get('productId') as string | null
  const productSlug = formData.get('productSlug') as string | null

  if (!file || !productSlug) {
    return { error: 'Arquivo e slug do produto são obrigatórios' }
  }

  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')
  if (!isImage && !isVideo) {
    return { error: 'Arquivo deve ser imagem ou vídeo' }
  }

  if (file.size > 10 * 1024 * 1024) {
    return { error: 'Arquivo deve ter no máximo 10MB' }
  }

  try {
    const url = await uploadProductImage(file, productSlug)

    // Se productId fornecido, atualiza o array de imagens no banco
    if (productId) {
      const { prisma } = await import('@/lib/prisma')
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { images: true },
      })
      if (product) {
        await updateProduct(productId, { images: [...product.images, url] })
      }
    }

    return { url }
  } catch (err) {
    console.error('Upload error:', err)
    return { error: 'Falha no upload. Tente novamente.' }
  }
}

export async function deleteImageAction(
  productId: string,
  imageUrl: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    await deleteProductImage(imageUrl)

    const { prisma } = await import('@/lib/prisma')
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { images: true },
    })

    if (product) {
      await updateProduct(productId, {
        images: product.images.filter((img: string) => img !== imageUrl),
      })
    }

    return { success: true }
  } catch (err) {
    console.error('Delete error:', err)
    return { error: 'Falha ao remover imagem.' }
  }
}
