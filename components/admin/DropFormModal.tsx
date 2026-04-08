'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Modal from './Modal'
import { createDropAction, updateDropAction } from '@/app/actions/drops'

interface DropData {
  id: string
  name: string
  tagline: string
  description: string
  startDate: Date | string
  endDate: Date | string
  stockLimit: number
  stockRemaining: number
  isActive: boolean
}

interface Props {
  drop?: DropData
  children: React.ReactNode
}

function toDateInput(d: Date | string) {
  return new Date(d).toISOString().split('T')[0]
}

const inp = 'w-full bg-black border border-[#333] text-white text-xs px-3 py-2 outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600'

export default function DropFormModal({ drop, children }: Props) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setError('')
    startTransition(async () => {
      const result = drop
        ? await updateDropAction(null, fd)
        : await createDropAction(null, fd)
      if (result?.error) {
        setError(result.error)
      } else {
        setOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={drop ? 'EDITAR DROP' : 'NOVO DROP'}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {drop && <input type="hidden" name="id" value={drop.id} />}

          <div className="space-y-1">
            <label className="text-[10px] font-display tracking-widest text-gray-400 block">NOME *</label>
            <input name="name" defaultValue={drop?.name} required className={inp} placeholder="DROP 02" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-display tracking-widest text-gray-400 block">TAGLINE *</label>
            <input name="tagline" defaultValue={drop?.tagline} required className={inp} placeholder="A coleção que define a estação" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-display tracking-widest text-gray-400 block">DESCRIÇÃO *</label>
            <textarea name="description" defaultValue={drop?.description} required rows={3} className={`${inp} resize-none`} placeholder="Descrição do drop..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-display tracking-widest text-gray-400 block">INÍCIO *</label>
              <input type="date" name="startDate" defaultValue={drop ? toDateInput(drop.startDate) : ''} required className={inp} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-display tracking-widest text-gray-400 block">FIM *</label>
              <input type="date" name="endDate" defaultValue={drop ? toDateInput(drop.endDate) : ''} required className={inp} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-display tracking-widest text-gray-400 block">ESTOQUE LIMITE *</label>
              <input type="number" name="stockLimit" defaultValue={drop?.stockLimit ?? 100} required min={1} className={inp} />
            </div>
            {drop && (
              <div className="space-y-1">
                <label className="text-[10px] font-display tracking-widest text-gray-400 block">ESTOQUE RESTANTE</label>
                <input type="number" name="stockRemaining" defaultValue={drop.stockRemaining} min={0} className={inp} />
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="isActive" defaultChecked={drop?.isActive} className="w-4 h-4 accent-orange-500" />
            <span className="text-xs text-gray-400">Ativar drop (desativa o atual)</span>
          </label>

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
              {isPending ? 'SALVANDO...' : 'SALVAR'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
