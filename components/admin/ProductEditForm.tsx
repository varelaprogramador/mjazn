'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateProductAction } from '@/app/actions/products'
import { useState } from 'react'

interface Drop { id: string; name: string }
interface Category { id: string; name: string; color: string }

interface Props {
  product: {
    id: string
    name: string
    price: number
    originalPrice: number | null
    description: string
    shortDescription: string
    categoryId: string
    isNew: boolean
    isLimited: boolean
    tags: string[]
    dropId: string | null
  }
  drops: Drop[]
  categories: Category[]
}

const inp =
  'w-full bg-[#0a0a0a] border border-[#2a2a2a] text-off-white text-xs px-3 py-2.5 outline-none focus:border-fire transition-colors placeholder:text-gray-dim'

const label = 'text-[10px] font-display tracking-widest text-gray-muted block mb-1.5'

export default function ProductEditForm({ product, drops, categories }: Props) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={product.id} />

      {/* Identificação */}
      <div className="space-y-3">
        <p className="text-[10px] font-display tracking-[0.2em] text-gray-dim border-b border-[#1f1f1f] pb-2">
          IDENTIFICAÇÃO
        </p>
        <div>
          <label className={label}>NOME DO PRODUTO *</label>
          <input name="name" defaultValue={product.name} required className={inp} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>CATEGORIA</label>
            <select name="categoryId" defaultValue={product.categoryId} className={inp}>
              <option value="">Selecione</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>DROP (opcional)</label>
            <select name="dropId" defaultValue={product.dropId ?? ''} className={inp}>
              <option value="">Nenhum</option>
              {drops.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Preços */}
      <div className="space-y-3">
        <p className="text-[10px] font-display tracking-[0.2em] text-gray-dim border-b border-[#1f1f1f] pb-2">
          PREÇOS
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>PREÇO (R$) *</label>
            <input
              type="number" name="price"
              defaultValue={(product.price / 100).toFixed(2)}
              required step="0.01" min="0.01" className={inp}
            />
          </div>
          <div>
            <label className={label}>PREÇO ORIGINAL</label>
            <input
              type="number" name="originalPrice"
              defaultValue={product.originalPrice ? (product.originalPrice / 100).toFixed(2) : ''}
              step="0.01" min="0" className={inp} placeholder="—"
            />
          </div>
        </div>
      </div>

      {/* Descrições */}
      <div className="space-y-3">
        <p className="text-[10px] font-display tracking-[0.2em] text-gray-dim border-b border-[#1f1f1f] pb-2">
          DESCRIÇÕES
        </p>
        <div>
          <label className={label}>DESCRIÇÃO CURTA *</label>
          <input name="shortDescription" defaultValue={product.shortDescription} required className={inp} placeholder="Exibe na listagem e cards" />
        </div>
        <div>
          <label className={label}>DESCRIÇÃO COMPLETA *</label>
          <textarea
            name="description" defaultValue={product.description} required rows={5}
            className={`${inp} resize-none`}
            placeholder="Detalhes completos do produto"
          />
        </div>
      </div>

      {/* Metadados */}
      <div className="space-y-3">
        <p className="text-[10px] font-display tracking-[0.2em] text-gray-dim border-b border-[#1f1f1f] pb-2">
          METADADOS
        </p>
        <div>
          <label className={label}>TAGS (separadas por vírgula)</label>
          <input
            name="tags" defaultValue={product.tags.join(', ')} className={inp}
            placeholder="streetwear, logo, preto"
          />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" name="isNew" defaultChecked={product.isNew} className="w-4 h-4 accent-fire" />
            <span className="text-xs font-display tracking-wider text-gray-muted group-hover:text-off-white transition-colors">Marcar como Novo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" name="isLimited" defaultChecked={product.isLimited} className="w-4 h-4 accent-fire" />
            <span className="text-xs font-display tracking-wider text-gray-muted group-hover:text-off-white transition-colors">Edição Limitada</span>
          </label>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-3 py-2">{error}</p>
      )}
      {success && (
        <p className="text-green-400 text-xs bg-green-400/10 border border-green-400/20 px-3 py-2">
          ✓ Produto atualizado com sucesso.
        </p>
      )}

      <button
        type="submit" disabled={isPending}
        className="w-full h-10 bg-fire text-black text-[10px] font-display tracking-widest hover:bg-fire-light transition-colors disabled:opacity-50"
      >
        {isPending ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
      </button>
    </form>
  )
}
