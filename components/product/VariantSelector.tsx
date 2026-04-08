'use client'

import { useState } from 'react'
import type { ProductVariant } from '@/lib/types'
import StockIndicator from './StockIndicator'

interface VariantSelectorProps {
  variants: ProductVariant[]
  onSelect: (variant: ProductVariant | null) => void
}

// Group variants by size, showing colors per size
export default function VariantSelector({ variants, onSelect }: VariantSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  // Unique sizes in order
  const sizeOrder = ['P', 'M', 'G', 'GG', 'XGG', 'Único']
  const sizes = sizeOrder.filter((s) => variants.some((v) => v.size === s))

  function handleSizeClick(size: string) {
    if (selectedSize === size) {
      setSelectedSize(null)
      onSelect(null)
      return
    }
    setSelectedSize(size)
    const variant = variants.find((v) => v.size === size) ?? null
    onSelect(variant)
  }

  const selectedVariant = selectedSize
    ? (variants.find((v) => v.size === selectedSize) ?? null)
    : null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-display tracking-wider text-gray-muted">
          {selectedSize ? `Tamanho: ${selectedSize}` : 'Selecione o Tamanho'}
        </p>
        {selectedVariant && (
          <StockIndicator stock={selectedVariant.stock} />
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const variant = variants.find((v) => v.size === size)
          const outOfStock = !variant || variant.stock === 0
          const isSelected = selectedSize === size

          return (
            <button
              key={size}
              onClick={() => !outOfStock && handleSizeClick(size)}
              disabled={outOfStock}
              className={[
                'min-w-[44px] h-10 px-3 text-xs font-display tracking-wider border transition-all duration-150',
                isSelected
                  ? 'bg-fire text-black border-fire'
                  : outOfStock
                  ? 'border-gray-border text-gray-dim cursor-not-allowed opacity-40'
                  : 'border-gray-border text-off-white hover:border-fire hover:text-fire',
              ].join(' ')}
              title={outOfStock ? 'Esgotado' : undefined}
            >
              {size}
            </button>
          )
        })}
      </div>

      {!selectedSize && (
        <p className="text-[10px] text-gray-dim">Escolha um tamanho para adicionar ao carrinho</p>
      )}
    </div>
  )
}
