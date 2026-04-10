'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { authClient } from '@/lib/auth-client'

export default function ContaCadastro() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirm) {
      setError('As senhas não coincidem.')
      return
    }
    if (form.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    setLoading(true)

    const { error: err } = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      callbackURL: '/conta',
    })

    if (err) {
      setError(err.message ?? 'Erro ao criar conta. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/conta')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">

        <div className="flex flex-col items-center gap-2">
          <Link href="/">
            <Image src="/logo-simbol.png" alt="Região Norte" width={80} height={107} className="h-14 w-auto opacity-90 hover:opacity-100 transition-opacity" />
          </Link>
          <p className="text-[10px] font-display tracking-[0.4em] text-fire">MINHA CONTA</p>
        </div>

        <div>
          <h1 className="font-display text-2xl text-off-white text-center">Criar Conta</h1>
          <p className="text-xs text-gray-muted text-center mt-1">Cadastre-se e acompanhe seus pedidos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-display tracking-widest text-gray-muted">NOME COMPLETO</label>
            <input
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={set('name')}
              className="w-full h-11 bg-dark border border-gray-border px-4 text-sm text-off-white placeholder-gray-dim focus:outline-none focus:border-fire transition-colors"
              placeholder="Seu nome"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-display tracking-widest text-gray-muted">E-MAIL</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={set('email')}
              className="w-full h-11 bg-dark border border-gray-border px-4 text-sm text-off-white placeholder-gray-dim focus:outline-none focus:border-fire transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-display tracking-widest text-gray-muted">SENHA</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={set('password')}
              className="w-full h-11 bg-dark border border-gray-border px-4 text-sm text-off-white placeholder-gray-dim focus:outline-none focus:border-fire transition-colors"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-display tracking-widest text-gray-muted">CONFIRMAR SENHA</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={form.confirm}
              onChange={set('confirm')}
              className="w-full h-11 bg-dark border border-gray-border px-4 text-sm text-off-white placeholder-gray-dim focus:outline-none focus:border-fire transition-colors"
              placeholder="Repita a senha"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-fire text-black font-display tracking-widest text-sm hover:bg-fire-light transition-colors duration-200 disabled:opacity-60"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-muted">
          Já tem conta?{' '}
          <Link href="/conta/login" className="text-fire hover:text-fire-light underline transition-colors">
            Entrar
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
