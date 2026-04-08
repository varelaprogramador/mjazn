'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addVariantAction, deleteVariantAction, updateVariantStockAction } from '@/app/actions/products'

interface Variant {
  id: string
  size: string
  color: string
  colorHex: string
  stock: number
}

interface Props {
  productId: string
  variants: Variant[]
}

function StockInput({
  variant,
  productId,
}: {
  variant: Variant
  productId: string
}) {
  const [stock, setStock] = useState(variant.stock)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  function save(val: number) {
    startTransition(async () => {
      await updateVariantStockAction(variant.id, val, productId)
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={stock}
        min={0}
        onChange={(e) => setStock(parseInt(e.target.value) || 0)}
        onBlur={() => save(stock)}
        className="w-16 bg-black border border-gray-border text-off-white text-xs px-2 py-1 outline-none focus:border-fire transition-colors text-center"
        disabled={isPending}
      />
      <span className="text-[10px] text-gray-dim">un.</span>
      {isPending && <span className="text-[10px] text-gray-dim">...</span>}
      {saved && <span className="text-[10px] text-green-400">✓</span>}
    </div>
  )
}

export default function VariantManager({ productId, variants }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [newVariant, setNewVariant] = useState({
    size: '',
    color: '',
    colorHex: '#000000',
    stock: 0,
  })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const router = useRouter()

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.set('productId', productId)
    fd.set('size', newVariant.size.toUpperCase())
    fd.set('color', newVariant.color)
    fd.set('colorHex', newVariant.colorHex)
    fd.set('stock', String(newVariant.stock))

    setError('')
    startTransition(async () => {
      const result = await addVariantAction(null, fd)
      if (result?.error) {
        setError(result.error)
      } else {
        setNewVariant({ size: '', color: '', colorHex: '#000000', stock: 0 })
        setShowAdd(false)
        router.refresh()
      }
    })
  }

  const inputCls =
    'bg-black border border-gray-border text-off-white text-xs px-2 py-1.5 outline-none focus:border-fire transition-colors'

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-display tracking-widest text-gray-muted">
          VARIANTES ({variants.length})
        </p>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="text-[10px] font-display tracking-wider text-fire hover:text-fire-light transition-colors"
        >
          {showAdd ? '− CANCELAR' : '+ NOVA VARIANTE'}
        </button>
      </div>

      {/* Form nova variante */}
      {showAdd && (
        <form onSubmit={handleAdd} className="bg-black border border-gray-border p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-dim block mb-1">TAMANHO</label>
              <input
                value={newVariant.size}
                onChange={(e) => setNewVariant((v) => ({ ...v, size: e.target.value }))}
                placeholder="P / M / G / GG"
                className={`${inputCls} w-full`}
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-dim block mb-1">COR</label>
              <input
                value={newVariant.color}
                onChange={(e) => setNewVariant((v) => ({ ...v, color: e.target.value }))}
                placeholder="Preto"
                className={`${inputCls} w-full`}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-dim block mb-1">COR HEX</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={newVariant.colorHex}
                  onChange={(e) => setNewVariant((v) => ({ ...v, colorHex: e.target.value }))}
                  className="w-8 h-8 border border-gray-border bg-black cursor-pointer"
                />
                <input
                  value={newVariant.colorHex}
                  onChange={(e) => setNewVariant((v) => ({ ...v, colorHex: e.target.value }))}
                  className={`${inputCls} flex-1`}
                  placeholder="#000000"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-dim block mb-1">ESTOQUE</label>
              <input
                type="number"
                value={newVariant.stock}
                onChange={(e) =>
                  setNewVariant((v) => ({ ...v, stock: parseInt(e.target.value) || 0 }))
                }
                min={0}
                className={`${inputCls} w-full`}
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-[10px]">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-8 bg-fire/20 border border-fire/40 text-fire text-[10px] font-display tracking-wider hover:bg-fire/30 transition-colors disabled:opacity-50"
          >
            {isPending ? 'ADICIONANDO...' : '+ ADICIONAR VARIANTE'}
          </button>
        </form>
      )}

      {/* Lista */}
      <div className="space-y-1.5">
        {variants.map((v) => (
          <VariantRow key={v.id} variant={v} productId={productId} router={router} />
        ))}

        {variants.length === 0 && (
          <p className="text-[10px] text-gray-dim text-center py-4 border border-gray-border border-dashed">
            Nenhuma variante cadastrada
          </p>
        )}
      </div>
    </div>
  )
}

function VariantRow({
  variant,
  productId,
  router,
}: {
  variant: Variant
  productId: string
  router: ReturnType<typeof useRouter>
}) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteVariantAction(variant.id, productId)
      router.refresh()
    })
  }

  return (
    <div className="flex items-center justify-between bg-dark border border-gray-border px-3 py-2 text-xs">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 border border-gray-border flex-shrink-0"
          style={{ backgroundColor: variant.colorHex }}
        />
        <span className="font-display text-off-white">
          {variant.size} — {variant.color}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <StockInput variant={variant} productId={productId} />
        {confirming ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConfirming(false)}
              className="text-[10px] text-gray-muted hover:text-off-white"
            >
              Não
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="text-[10px] text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              {isPending ? '...' : 'Sim'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="text-[10px] text-red-400/40 hover:text-red-400 transition-colors"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
