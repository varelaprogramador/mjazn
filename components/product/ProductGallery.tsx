'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'

interface Props {
  images: string[]
  name: string
  isNew?: boolean
  isLimited?: boolean
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url)
}

export default function ProductGallery({ images, name, isNew, isLimited }: Props) {
  const [selected, setSelected] = useState(0)

  const current = images[selected] ?? null

  return (
    <div className="space-y-3">
      {/* Main media */}
      <div className="relative aspect-[3/4] overflow-hidden bg-dark">
        {current ? (
          isVideo(current) ? (
            <video
              key={current}
              src={current}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={current}
              src={current}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            />
          )
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-dim/40 to-dark" />
            <span className="absolute inset-0 flex items-center justify-center font-display text-6xl text-off-white/10 select-none">
              RN
            </span>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {isNew && <Badge label="Novo" variant="fire" />}
          {isLimited && <Badge label="Limitado" variant="white" />}
        </div>

        {/* Video indicator */}
        {current && isVideo(current) && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-black/60 px-2 py-1">
            <span className="w-2 h-2 rounded-full bg-fire animate-pulse" />
            <span className="text-[9px] font-display tracking-widest text-fire">3D</span>
          </div>
        )}

        {/* Arrow navigation (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelected((s) => (s - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/60 hover:bg-black/90 flex items-center justify-center text-white transition-colors"
              aria-label="Imagem anterior"
            >
              ‹
            </button>
            <button
              onClick={() => setSelected((s) => (s + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/60 hover:bg-black/90 flex items-center justify-center text-white transition-colors"
              aria-label="Próxima imagem"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={[
                'relative w-16 h-20 flex-shrink-0 overflow-hidden border transition-all duration-150',
                selected === i
                  ? 'border-fire'
                  : 'border-gray-border hover:border-gray-muted',
              ].join(' ')}
              aria-label={`Ver ${isVideo(url) ? 'vídeo' : 'imagem'} ${i + 1}`}
            >
              {isVideo(url) ? (
                <div className="w-full h-full bg-dark flex items-center justify-center">
                  <span className="text-fire text-lg">▶</span>
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={url}
                  alt={`${name} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              {/* Active dot */}
              {selected === i && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-fire" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Dot indicators (mobile) */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={[
                'w-1.5 h-1.5 rounded-full transition-all duration-150',
                selected === i ? 'bg-fire w-4' : 'bg-gray-border',
              ].join(' ')}
            />
          ))}
        </div>
      )}
    </div>
  )
}
