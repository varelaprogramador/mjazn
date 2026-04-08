'use client'

import { useState } from 'react'
import type { Product, ProductVariant } from '@/lib/types'
import VariantSelector from './VariantSelector'
import AddToCartButton from './AddToCartButton'

interface ProductClientShellProps {
  product: Product
}

export default function ProductClientShell({ product }: ProductClientShellProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  return (
    <div className="space-y-4">
      <VariantSelector variants={product.variants} onSelect={setSelectedVariant} />
      <AddToCartButton product={product} selectedVariant={selectedVariant} />
    </div>
  )
}
