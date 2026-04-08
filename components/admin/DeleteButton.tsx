'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  action: () => Promise<{ success?: boolean; error?: string }>
  label?: string
  confirmMessage?: string
}

export default function DeleteButton({
  action: onDelete,
  label = 'Excluir',
  confirmMessage = 'Tem certeza? Esta ação não pode ser desfeita.',
}: Props) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const router = useRouter()

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        {error && <span className="text-red-400 text-[10px]">{error}</span>}
        <span className="text-[10px] text-gray-muted">{confirmMessage}</span>
        <button
          onClick={() => setConfirming(false)}
          className="text-[10px] font-display tracking-wider text-gray-muted hover:text-off-white transition-colors"
        >
          Não
        </button>
        <button
          disabled={isPending}
          onClick={() => {
            setError('')
            startTransition(async () => {
              const result = await onDelete()
              if (result?.error) {
                setError(result.error)
                setConfirming(false)
              } else {
                router.refresh()
              }
            })
          }}
          className="text-[10px] font-display tracking-wider text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Excluindo...' : 'Sim, excluir'}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-[10px] font-display tracking-wider text-red-400/60 hover:text-red-400 transition-colors"
    >
      {label}
    </button>
  )
}
