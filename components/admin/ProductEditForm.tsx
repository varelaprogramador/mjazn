'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateProductAction } from '@/app/actions/products'

interface Drop {
  id: string
  name: string
}

interface Props {
  product: {
    id: string
    name: string
    price: number
    originalPrice: number | null
    description: string
    shortDescription: string
    isNew: boolean
    isLimited: boolean
    tags: string[]
    dropId: string | null
  }
  drops: Drop[]
}

const CATEGORIES = [
  { value: 'camisetas', label: 'Camisetas' },
  { value: 'polos', label: 'Polos' },
  { value: 'kits', label: 'Kits' },
  { value: 'acessorios', label: 'Acessórios' },
]

export default function ProductEditForm({ product, drops }: Props) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('id', product.id)
    setError('')
    setSuccess(false)

    startTransition(async () => {
      const result = await updateProductAction(null, fd)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  const inputCls =
    'w-full bg-black border border-gray-border text-off-white text-xs px-3 py-2 outline-none focus:border-fire transition-colors placeholder:text-gray-dim'

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-[10px] font-display tracking-widest text-fire hover:text-fire-light transition-colors flex items-center gap-1"
      >
        {open ? '▲ FECHAR EDIÇÃO' : '▼ EDITAR PRODUTO'}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 border border-gray-border p-4 bg-black">
          <input type="hidden" name="id" value={product.id} />

          <div>
            <label className="text-[10px] font-display tracking-widest text-gray-muted block mb-1">
              NOME *
            </label>
            <input
              name="name"
              defaultValue={product.name}
              required
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-display tracking-widest text-gray-muted block mb-1">
                PREÇO (R$) *
              </label>
              <input
                type="number"
                name="price"
                defaultValue={(product.price / 100).toFixed(2)}
                required
                step="0.01"
                min="0.01"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[10px] font-display tracking-widest text-gray-muted block mb-1">
                PREÇO ORIGINAL (opcional)
              </label>
              <input
                type="number"
                name="originalPrice"
                defaultValue={product.originalPrice ? (product.originalPrice / 100).toFixed(2) : ''}
                step="0.01"
                min="0"
                className={inputCls}
                placeholder="—"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-display tracking-widest text-gray-muted block mb-1">
              DESCRIÇÃO CURTA *
            </label>
            <input
              name="shortDescription"
              defaultValue={product.shortDescription}
              required
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-[10px] font-display tracking-widest text-gray-muted block mb-1">
              DESCRIÇÃO COMPLETA *
            </label>
            <textarea
              name="description"
              defaultValue={product.description}
              required
              rows={4}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className="text-[10px] font-display tracking-widest text-gray-muted block mb-1">
              DROP (opcional)
            </label>
            <select name="dropId" defaultValue={product.dropId ?? ''} className={inputCls}>
              <option value="">Nenhum</option>
              {drops.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-display tracking-widest text-gray-muted block mb-1">
              TAGS (separadas por vírgula)
            </label>
            <input
              name="tags"
              defaultValue={product.tags.join(', ')}
              className={inputCls}
              placeholder="streetwear, logo, preto"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isNew"
                defaultChecked={product.isNew}
                className="w-4 h-4 accent-fire"
              />
              <span className="text-xs font-display tracking-wider text-gray-muted">Novo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isLimited"
                defaultChecked={product.isLimited}
                className="w-4 h-4 accent-fire"
              />
              <span className="text-xs font-display tracking-wider text-gray-muted">Limitado</span>
            </label>
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-3 py-2">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-400 text-xs bg-green-400/10 border border-green-400/20 px-3 py-2">
              ✓ Produto atualizado com sucesso.
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-10 bg-fire text-black text-[10px] font-display tracking-widest hover:bg-fire-light transition-colors disabled:opacity-50"
          >
            {isPending ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
          </button>
        </form>
      )}
    </div>
  )
}
