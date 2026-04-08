interface StarRatingProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
}

export default function StarRating({ rating, reviewCount, size = 'sm' }: StarRatingProps) {
  const starSize = size === 'sm' ? 'text-xs' : 'text-sm'
  const textSize = size === 'sm' ? 'text-[11px]' : 'text-xs'

  return (
    <div className="flex items-center gap-1">
      <div className={`flex ${starSize}`} aria-label={`${rating} de 5 estrelas`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star
          const half = !filled && rating >= star - 0.5
          return (
            <span
              key={star}
              className={filled || half ? 'text-fire' : 'text-gray-dim'}
            >
              {half ? '★' : filled ? '★' : '☆'}
            </span>
          )
        })}
      </div>
      {reviewCount !== undefined && (
        <span className={`text-gray-muted ${textSize}`}>({reviewCount})</span>
      )}
    </div>
  )
}
