'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createProductAction } from '@/app/actions/products'

interface Drop { id: string; name: string }
interface Variant { size: string; color: string; colorHex: string; stock: number }
interface Props { drops: Drop[]; children: React.ReactNode }

const CATEGORIES = [
  { value: 'camisetas', label: 'Camisetas' },
  { value: 'polos', label: 'Polos' },
  { value: 'kits', label: 'Kits' },
  { value: 'acessorios', label: 'Acessórios' },
]

const inp =
  'w-full bg-black border border-[#333] text-white text-xs px-3 py-2 outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600'

export default function ProductFormModal({ drops, children }: Props) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [variants, setVariants] = useState<Variant[]>([])
  const [nv, setNv] = useState<Variant>({ size: '', color: '', colorHex: '#000000', stock: 0 })
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  function handleOpenChange(v: boolean) {
    setOpen(v)
    if (!v) { setVariants([]); setError('') }
  }

  function addVariant() {
    if (!nv.size.trim() || !nv.color.trim()) return
    setVariants(v => [...v, { ...nv }])
    setNv({ size: '', color: '', colorHex: '#000000', stock: 0 })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (variants.length === 0) { setError('Adicione pelo menos uma variante.'); return }
    const fd = new FormData(e.currentTarget)
    fd.set('variants', JSON.stringify(variants))
    setError('')
    startTransition(async () => {
      const result = await createProductAction(null, fd)
      if (result?.error) {
        setError(result.error)
      } else {
        setOpen(false)
        formRef.current?.reset()
        router.refresh()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<span className="cursor-pointer" />}>
        {children}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="!bg-[#111] !border !border-[#333] !text-white !max-w-xl !rounded-none !p-0 !gap-0 !ring-0"
      >
        <DialogHeader className="px-6 py-4 border-b border-[#333]">
          <DialogTitle className="font-display text-sm tracking-widest text-white">
            NOVO PRODUTO
          </DialogTitle>
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 text-gray-500 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

          <div className="space-y-1">
            <label className="text-[10px] font-display tracking-widest text-gray-400 block">NOME *</label>
            <input name="name" required className={inp} placeholder="Camiseta Preta Logo" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-display tracking-widest text-gray-400 block">PREÇO (R$) *</label>
              <input type="number" name="price" required step="0.01" min="0.01" className={inp} placeholder="149.90" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-display tracking-widest text-gray-400 block">PREÇO ORIGINAL</label>
              <input type="number" name="originalPrice" step="0.01" min="0" className={inp} placeholder="199.90" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-display tracking-widest text-gray-400 block">DESCRIÇÃO CURTA *</label>
            <input name="shortDescription" required className={inp} placeholder="Camiseta com estampa exclusiva" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-display tracking-widest text-gray-400 block">DESCRIÇÃO COMPLETA *</label>
            <textarea name="description" required rows={3} className={`${inp} resize-none`} placeholder="Descrição detalhada..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-display tracking-widest text-gray-400 block">CATEGORIA *</label>
              <select name="category" required className={inp}>
                <option value="">Selecione</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-display tracking-widest text-gray-400 block">DROP</label>
              <select name="dropId" className={inp}>
                <option value="">Nenhum</option>
                {drops.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-display tracking-widest text-gray-400 block">TAGS (separadas por vírgula)</label>
            <input name="tags" className={inp} placeholder="streetwear, logo, preto" />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isNew" className="w-4 h-4 accent-orange-500" />
              <span className="text-xs text-gray-400">Novo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isLimited" className="w-4 h-4 accent-orange-500" />
              <span className="text-xs text-gray-400">Limitado</span>
            </label>
          </div>

          {/* Variantes */}
          <div className="space-y-2">
            <p className="text-[10px] font-display tracking-widest text-gray-400">VARIANTES *</p>
            <div className="flex gap-2 items-center">
              <input value={nv.size} onChange={e => setNv(v => ({ ...v, size: e.target.value }))}
                placeholder="TAM" className="w-16 bg-black border border-[#333] text-white text-xs px-2 py-2 outline-none focus:border-orange-500" />
              <input value={nv.color} onChange={e => setNv(v => ({ ...v, color: e.target.value }))}
                placeholder="Cor" className="flex-1 bg-black border border-[#333] text-white text-xs px-2 py-2 outline-none focus:border-orange-500" />
              <input type="color" value={nv.colorHex} onChange={e => setNv(v => ({ ...v, colorHex: e.target.value }))}
                className="w-9 h-9 border border-[#333] bg-black cursor-pointer p-0.5" />
              <input type="number" value={nv.stock} onChange={e => setNv(v => ({ ...v, stock: parseInt(e.target.value) || 0 }))}
                min={0} className="w-16 bg-black border border-[#333] text-white text-xs px-2 py-2 outline-none focus:border-orange-500" />
              <button type="button" onClick={addVariant}
                className="h-9 px-3 bg-orange-500/20 border border-orange-500/40 text-orange-500 text-[10px] font-display tracking-wider hover:bg-orange-500/30 transition-colors whitespace-nowrap">
                + ADD
              </button>
            </div>

            {variants.length > 0 ? (
              <div className="space-y-1">
                {variants.map((v, i) => (
                  <div key={i} className="flex items-center justify-between bg-black border border-[#333] px-3 py-1.5 text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-[#444]" style={{ backgroundColor: v.colorHex }} />
                      <span className="text-white">{v.size} — {v.color}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">{v.stock} un.</span>
                      <button type="button" onClick={() => setVariants(v => v.filter((_, idx) => idx !== i))}
                        className="text-red-500/60 hover:text-red-400 text-base leading-none">×</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-gray-600 border border-[#333] border-dashed px-3 py-4 text-center">
                Nenhuma variante adicionada
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-900/20 border border-red-800 px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)}
              className="flex-1 h-10 border border-[#333] text-gray-400 text-[10px] font-display tracking-widest hover:text-white transition-colors">
              CANCELAR
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 h-10 bg-orange-500 text-black text-[10px] font-display tracking-widest hover:bg-orange-400 transition-colors disabled:opacity-50">
              {isPending ? 'CRIANDO...' : 'CRIAR PRODUTO'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
