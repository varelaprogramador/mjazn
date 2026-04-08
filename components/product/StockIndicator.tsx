import { getStockLabel, isLowStock } from '@/lib/utils'

interface StockIndicatorProps {
  stock: number
}

export default function StockIndicator({ stock }: StockIndicatorProps) {
  if (stock === 0) {
    return (
      <span className="text-xs text-gray-muted font-display tracking-wider">
        Esgotado
      </span>
    )
  }

  if (isLowStock(stock)) {
    return (
      <span className="animate-pulse-fire text-xs font-display tracking-wider text-fire">
        {getStockLabel(stock)}
      </span>
    )
  }

  return (
    <span className="text-xs text-gray-muted font-display tracking-wider">
      Em estoque
    </span>
  )
}
