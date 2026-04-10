'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { signIn } from '@/lib/auth-client'

export default function ContaLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: err } = await signIn.email({
      email,
      password,
      callbackURL: '/conta',
    })

    if (err) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    router.push('/conta')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">

        <div className="flex flex-col items-center gap-2">
          <Link href="/">
            <Image src="/logo-simbol.png" alt="Região Norte" width={80} height={107} className="h-14 w-auto opacity-90 hover:opacity-100 transition-opacity" />
          </Link>
          <p className="text-[10px] font-display tracking-[0.4em] text-fire">MINHA CONTA</p>
        </div>

        <div>
          <h1 className="font-display text-2xl text-off-white text-center">Entrar</h1>
          <p className="text-xs text-gray-muted text-center mt-1">Acompanhe seus pedidos e gerencie sua conta</p>
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

          <div className="space-y-1">
            <label className="text-[10px] font-display tracking-widest text-gray-muted">SENHA</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 bg-dark border border-gray-border px-4 text-sm text-off-white placeholder-gray-dim focus:outline-none focus:border-fire transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-fire text-black font-display tracking-widest text-sm hover:bg-fire-light transition-colors duration-200 disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-muted">
          Ainda não tem conta?{' '}
          <Link href="/conta/cadastro" className="text-fire hover:text-fire-light underline transition-colors">
            Criar conta grátis
          </Link>
        </p>

        <p className="text-center">
          <Link href="/" className="text-[10px] text-gray-dim hover:text-gray-muted transition-colors">
            ← Voltar à loja
          </Link>
        </p>
      </div>
    </div>
  )
}
