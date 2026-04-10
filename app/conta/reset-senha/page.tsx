'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { authClient } from '@/lib/auth-client'

type Step = 'email' | 'sent'

export default function ResetSenhaPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: err } = await authClient.forgetPassword({
      email,
      redirectTo: '/conta/reset-senha/nova',
    })

    setLoading(false)

    if (err) {
      setError('Não foi possível processar. Tente novamente.')
      return
    }

    setStep('sent')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">

        <div className="flex flex-col items-center gap-2">
          <Link href="/">
            <Image src="/logo-simbol.png" alt="MJAZN" width={80} height={107} className="h-14 w-auto opacity-90 hover:opacity-100 transition-opacity" />
          </Link>
          <p className="text-[10px] font-display tracking-[0.4em] text-fire">REDEFINIR SENHA</p>
        </div>

        {step === 'email' ? (
          <>
            <div>
              <h1 className="font-display text-2xl text-off-white text-center">Esqueci minha senha</h1>
              <p className="text-xs text-gray-muted text-center mt-1 leading-relaxed">
                Informe seu e-mail e enviaremos um link para você criar uma nova senha.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-display tracking-widest text-gray-muted">E-MAIL</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 bg-dark border border-gray-border px-4 text-sm text-off-white placeholder-gray-dim focus:outline-none focus:border-fire transition-colors"
                  placeholder="seu@email.com"
                />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-fire text-black font-display tracking-widest text-sm hover:bg-fire-light transition-colors disabled:opacity-60"
              >
                {loading ? 'Enviando...' : 'Enviar Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="border border-gray-border bg-dark p-8 text-center space-y-4">
            <div className="text-3xl">✉️</div>
            <h2 className="font-display text-lg text-off-white">E-mail enviado!</h2>
            <p className="text-xs text-gray-muted leading-relaxed">
              Enviamos um link de redefinição para <span className="text-off-white">{email}</span>.
              Verifique sua caixa de entrada e spam.
            </p>
            <p className="text-[10px] text-gray-dim">O link expira em 1 hora.</p>
          </div>
        )}

        <p className="text-center">
          <Link href="/conta/login" className="text-[10px] text-gray-dim hover:text-gray-muted transition-colors">
            ← Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  )
}
