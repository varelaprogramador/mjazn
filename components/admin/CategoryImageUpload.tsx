'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { uploadCategoryImageAction, deleteCategoryImageAction } from '@/app/actions/categories'

interface Props {
  categoryId: string
  currentImage: string | null
}

export default function CategoryImageUpload({ categoryId, currentImage }: Props) {
  const [image, setImage] = useState<string | null>(currentImage)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    startTransition(async () => {
      const result = await uploadCategoryImageAction(categoryId, formData)
      if ('error' in result) {
        setError(result.error)
      } else {
        setImage(result.url)
        router.refresh()
      }
    })

    if (inputRef.current) inputRef.current.value = ''
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCategoryImageAction(categoryId)
      if ('error' in result) {
        setError(result.error)
      } else {
        setImage(null)
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-2">
      {image ? (
        <div className="relative group w-full aspect-[3/2] overflow-hidden border border-gray-border bg-dark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Capa da categoria" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <label
              htmlFor={`cat-img-${categoryId}`}
              className="text-[10px] font-display tracking-wider text-fire cursor-pointer hover:text-fire-light transition-colors"
            >
              Trocar
            </label>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="text-[10px] font-display tracking-wider text-red-400 hover:text-red-300 transition-colors"
            >
              Remover
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={`cat-img-${categoryId}`}
          className={[
            'flex items-center justify-center gap-2 h-24 border border-dashed text-[10px] font-display tracking-widest cursor-pointer transition-colors',
            isPending
              ? 'border-fire/30 text-gray-dim cursor-not-allowed'
              : 'border-gray-border text-gray-muted hover:border-fire hover:text-fire',
          ].join(' ')}
        >
          {isPending ? (
            <>
              <span className="animate-spin w-3 h-3 border border-fire border-t-transparent rounded-full" />
              ENVIANDO...
            </>
          ) : (
            '+ ADICIONAR IMAGEM'
          )}
        </label>
      )}

      <input
        ref={inputRef}
        id={`cat-img-${categoryId}`}
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={isPending}
        className="hidden"
      />

      {error && <p className="text-[10px] text-red-400 font-display">{error}</p>}
    </div>
  )
}
