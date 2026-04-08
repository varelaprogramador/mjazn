'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import type { Product, ProductVariant } from '@/lib/types'

interface AddToCartButtonProps {
  product: Product
  selectedVariant: ProductVariant | null
}

export default function AddToCartButton({ product, selectedVariant }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    if (!selectedVariant || selectedVariant.stock === 0) return

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: selectedVariant.size,
      color: selectedVariant.color,
      colorHex: selectedVariant.colorHex,
      image: product.images[0] ?? '',
      stock: selectedVariant.stock,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const disabled = !selectedVariant || selectedVariant.stock === 0

  return (
    <button
      onClick={handleAdd}
      disabled={disabled}
      className={[
        'w-full h-14 font-display tracking-widest text-sm transition-all duration-200',
        added
          ? 'bg-dark-mid border border-fire text-fire'
          : disabled
          ? 'bg-gray-border text-gray-muted cursor-not-allowed'
          : 'bg-fire text-black hover:bg-fire-light active:scale-[0.98]',
      ].join(' ')}
    >
      {added
        ? '✓ Adicionado ao Carrinho'
        : !selectedVariant
        ? 'Selecione um Tamanho'
        : selectedVariant.stock === 0
        ? 'Esgotado'
        : 'Adicionar ao Carrinho'}
    </button>
  )
}
