import type { Testimonial } from '@/lib/types'
import StarRating from '@/components/ui/StarRating'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="bg-dark py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-[10px] font-display tracking-[0.5em] text-fire mb-2">DEPOIMENTOS</p>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-none text-off-white">
            Quem representa
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-dark-mid border border-gray-border p-5 space-y-4 hover:border-gray-dim transition-colors duration-300"
            >
              {/* Rating */}
              <StarRating rating={t.rating} />

              {/* Text */}
              <p className="text-sm text-gray-muted leading-relaxed">"{t.text}"</p>

              {/* Footer */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-border">
                {/* Avatar */}
                <div className="w-8 h-8 bg-fire/20 flex-shrink-0 flex items-center justify-center">
                  <span className="text-[10px] font-display text-fire">{t.avatarInitials}</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-off-white">{t.name}</p>
                  <p className="text-[10px] text-gray-dim">{t.location}</p>
                </div>
                <div className="ml-auto">
                  <p className="text-[10px] text-gray-dim text-right">{t.productName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
