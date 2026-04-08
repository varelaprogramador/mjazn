'use client'

import { useState, useRef } from 'react'
import { uploadImageAction, deleteImageAction } from '@/app/actions/uploadImage'

interface ImageUploadProps {
  productId: string
  productSlug: string
  images: string[]
  onImagesChange?: (images: string[]) => void
}

export default function ImageUpload({
  productId,
  productSlug,
  images: initialImages,
  onImagesChange,
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('productId', productId)
      formData.append('productSlug', productSlug)

      const result = await uploadImageAction(formData)

      if ('error' in result) {
        setError(result.error)
        break
      }

      const newImages = [...images, result.url]
      setImages(newImages)
      onImagesChange?.(newImages)
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleDelete(url: string) {
    const result = await deleteImageAction(productId, url)
    if ('error' in result) {
      setError(result.error)
      return
    }
    const newImages = images.filter((img) => img !== url)
    setImages(newImages)
    onImagesChange?.(newImages)
  }

  return (
    <div className="space-y-3">
      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative group aspect-square bg-dark overflow-hidden border border-gray-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Imagem ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => handleDelete(url)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-red-400 font-display tracking-wider"
              >
                Remover
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[8px] font-display text-black bg-fire px-1">
                  CAPA
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id={`img-upload-${productId}`}
        />
        <label
          htmlFor={`img-upload-${productId}`}
          className={[
            'flex items-center justify-center gap-2 h-10 border border-dashed text-xs font-display tracking-wider cursor-pointer transition-colors',
            uploading
              ? 'border-fire/30 text-gray-dim cursor-not-allowed'
              : 'border-gray-border text-gray-muted hover:border-fire hover:text-fire',
          ].join(' ')}
        >
          {uploading ? (
            <>
              <span className="animate-spin w-3 h-3 border border-fire border-t-transparent rounded-full" />
              ENVIANDO...
            </>
          ) : (
            '+ ADICIONAR FOTOS'
          )}
        </label>
      </div>

      {error && (
        <p className="text-xs text-red-400 font-display">{error}</p>
      )}

      <p className="text-[10px] text-gray-dim">
        JPG, PNG, WEBP · Máx. 5MB por imagem · A primeira imagem será a capa
      </p>
    </div>
  )
}
