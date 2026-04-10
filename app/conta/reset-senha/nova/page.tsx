'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { authClient } from '@/lib/auth-client'

export default function NovaSenhaPage() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) setError('Link inválido ou expirado. Solicite um novo.')
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }
    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.')
      return
    }

    setLoading(true)

    const { error: err } = await authClient.resetPassword({
      newPassword: password,
      token,
    })

    setLoading(false)

    if (err) {
      setError('Link inválido ou expirado. Solicite um novo.')
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/conta/login'), 3000)
  }

  const inputClass = 'w-full h-11 bg-dark border border-gray-border px-4 text-sm text-off-white placeholder-gray-dim focus:outline-none focus:border-fire transition-colors'

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">

        <div className="flex flex-col items-center gap-2">
          <Link href="/">
            <Image src="/logo-simbol.png" alt="MJAZN" width={80} height={107} className="h-14 w-auto opacity-90 hover:opacity-100 transition-opacity" />
          </Link>
          <p className="text-[10px] font-display tracking-[0.4em] text-fire">NOVA SENHA</p>
        </div>

        {success ? (
          <div className="border border-gray-border bg-dark p-8 text-center space-y-4">
            <div className="text-3xl">✅</div>
            <h2 className="font-display text-lg text-off-white">Senha alterada!</h2>
            <p className="text-xs text-gray-muted leading-relaxed">
              Sua senha foi atualizada com sucesso. Redirecionando para o login...
            </p>
          </div>
        ) : (
          <>
            <div>
              <h1 className="font-display text-2xl text-off-white text-center">Criar nova senha</h1>
              <p className="text-xs text-gray-muted text-center mt-1">
                Escolha uma senha forte com no mínimo 8 caracteres.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-display tracking-widest text-gray-muted">NOVA SENHA</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-display tracking-widest text-gray-muted">CONFIRMAR SENHA</label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={inputClass}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full h-12 bg-fire text-black font-display tracking-widest text-sm hover:bg-fire-light transition-colors disabled:opacity-60"
              >
                {loading ? 'Salvando...' : 'Salvar Nova Senha'}
              </button>
            </form>
          </>
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
