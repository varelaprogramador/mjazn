interface BadgeProps {
  label: string
  variant?: 'fire' | 'white' | 'outline' | 'dark'
  className?: string
}

const variants = {
  fire: 'bg-fire text-black',
  white: 'bg-off-white text-black',
  outline: 'border border-gray-dim text-gray-muted',
  dark: 'bg-dark-mid text-gray-muted',
}

export default function Badge({ label, variant = 'fire', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5',
        'text-[10px] font-display tracking-widest uppercase',
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </span>
  )
}
