'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createCategoryAction, updateCategoryAction } from '@/app/actions/categories'

interface Category { id: string; name: string; color: string; description?: string | null }
interface Props { category?: Category }

const inp =
  'w-full bg-black border border-[#333] text-white text-xs px-3 py-2 outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600'

export default function CategoryFormModal({ category }: Props) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const isEdit = !!category

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (isEdit) fd.set('id', category.id)
    setError('')

    startTransition(async () => {
      const action = isEdit ? updateCategoryAction : createCategoryAction
      const result = await action(null, fd)
      if (result?.error) {
        setError(result.error)
      } else {
        setOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={
          isEdit
            ? 'text-[10px] font-display tracking-wider text-fire hover:text-fire-light transition-colors'
            : 'h-9 px-5 bg-fire text-black font-display tracking-wider text-xs hover:bg-fire-light transition-colors'
        }
      >
        {isEdit ? 'Editar' : '+ Nova Categoria'}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="!bg-[#111] !border !border-[#333] !text-white !max-w-sm !rounded-none !p-0 !gap-0 !ring-0"
      >
        <DialogHeader className="px-6 py-4 border-b border-[#333]">
          <DialogTitle className="font-display text-sm tracking-widest text-white">
            {isEdit ? 'EDITAR CATEGORIA' : 'NOVA CATEGORIA'}
          </DialogTitle>
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 text-gray-500 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-display tracking-widest text-gray-400 block">NOME *</label>
            <input
              name="name"
              required
              defaultValue={category?.name ?? ''}
              className={inp}
              placeholder="Camisetas"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-display tracking-widest text-gray-400 block">DESCRIÇÃO CURTA</label>
            <input
              name="description"
              defaultValue={category?.description ?? ''}
              className={inp}
              placeholder="Oversized & Regular Fit"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-display tracking-widest text-gray-400 block">COR DO BADGE</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="color"
                defaultValue={category?.color ?? '#FF4500'}
                className="w-10 h-10 border border-[#333] bg-black cursor-pointer p-0.5"
              />
              <span className="text-[10px] text-gray-500">Cor usada no badge e cards</span>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-900/20 border border-red-800 px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 h-10 border border-[#333] text-gray-400 text-[10px] font-display tracking-widest hover:text-white transition-colors"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 h-10 bg-orange-500 text-black text-[10px] font-display tracking-widest hover:bg-orange-400 transition-colors disabled:opacity-50"
            >
              {isPending ? 'SALVANDO...' : isEdit ? 'SALVAR' : 'CRIAR'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
