'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { signIn, authClient } from '@/lib/auth-client'

type Tab = 'password' | 'otp'
type OtpStep = 'email' | 'code'

export default function ContaLogin() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('password')

  // ── Aba senha ──────────────────────────────
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // ── Aba OTP ────────────────────────────────
  const [otpEmail, setOtpEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpStep, setOtpStep] = useState<OtpStep>('email')
  const [otpError, setOtpError] = useState<string | null>(null)
  const [otpLoading, setOtpLoading] = useState(false)

  // ── Login com senha ────────────────────────
  async function handlePasswordLogin(e: React.FormEvent) {
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

  // ── Enviar OTP ─────────────────────────────
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setOtpError(null)
    setOtpLoading(true)

    const { error: err } = await authClient.emailOtp.sendVerificationOtp({
      email: otpEmail,
      type: 'sign-in',
    })

    setOtpLoading(false)

    if (err) {
      setOtpError('Não foi possível enviar o código. Verifique o e-mail.')
      return
    }

    setOtpStep('code')
  }

  // ── Verificar OTP ──────────────────────────
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setOtpError(null)
    setOtpLoading(true)

    const { error: err } = await authClient.signIn.emailOtp({
      email: otpEmail,
      otp: otpCode,
    })

    setOtpLoading(false)

    if (err) {
      setOtpError('Código inválido ou expirado.')
      return
    }

    router.push('/conta')
    router.refresh()
  }

  const tabClass = (t: Tab) =>
    `flex-1 h-10 text-xs font-display tracking-widest transition-colors ${
      tab === t
        ? 'bg-fire text-black'
        : 'bg-transparent text-gray-muted border border-gray-border hover:text-off-white hover:border-fire/50'
    }`

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">

        <div className="flex flex-col items-center gap-2">
          <Link href="/">
            <Image src="/logo-simbol.png" alt="MJAZN" width={80} height={107} className="h-14 w-auto opacity-90 hover:opacity-100 transition-opacity" />
          </Link>
          <p className="text-[10px] font-display tracking-[0.4em] text-fire">MINHA CONTA</p>
        </div>

        <div>
          <h1 className="font-display text-2xl text-off-white text-center">Entrar</h1>
          <p className="text-xs text-gray-muted text-center mt-1">Acompanhe seus pedidos e gerencie sua conta</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button className={tabClass('password')} onClick={() => setTab('password')}>
            SENHA
          </button>
          <button className={tabClass('otp')} onClick={() => setTab('otp')}>
            CÓDIGO OTP
          </button>
        </div>

        {/* ── Formulário senha ── */}
        {tab === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-display tracking-widest text-gray-muted">SENHA</label>
                <Link href="/conta/reset-senha" className="text-[10px] text-fire hover:text-fire-light transition-colors">
                  Esqueci minha senha
                </Link>
              </div>
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
        )}

        {/* ── Formulário OTP ── */}
        {tab === 'otp' && (
          <div className="space-y-4">
            {otpStep === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <p className="text-xs text-gray-muted leading-relaxed">
                  Informe seu e-mail e enviaremos um código de 6 dígitos para você entrar sem senha.
                </p>
                <div className="space-y-1">
                  <label className="text-[10px] font-display tracking-widest text-gray-muted">E-MAIL</label>
                  <input
                    type="email"
                    required
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    className="w-full h-11 bg-dark border border-gray-border px-4 text-sm text-off-white placeholder-gray-dim focus:outline-none focus:border-fire transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>

                {otpError && <p className="text-red-400 text-xs">{otpError}</p>}

                <button
                  type="submit"
                  disabled={otpLoading}
                  className="w-full h-12 bg-fire text-black font-display tracking-widest text-sm hover:bg-fire-light transition-colors disabled:opacity-60"
                >
                  {otpLoading ? 'Enviando...' : 'Enviar Código'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-xs text-gray-muted leading-relaxed">
                  Enviamos um código de 6 dígitos para <span className="text-off-white">{otpEmail}</span>. Insira-o abaixo.
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] font-display tracking-widest text-gray-muted">CÓDIGO DE 6 DÍGITOS</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full h-14 bg-dark border border-gray-border px-4 text-2xl text-center tracking-[0.5em] text-off-white placeholder-gray-dim focus:outline-none focus:border-fire transition-colors font-display"
                    placeholder="000000"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                  />
                </div>

                {otpError && <p className="text-red-400 text-xs">{otpError}</p>}

                <button
                  type="submit"
                  disabled={otpLoading || otpCode.length < 6}
                  className="w-full h-12 bg-fire text-black font-display tracking-widest text-sm hover:bg-fire-light transition-colors disabled:opacity-60"
                >
                  {otpLoading ? 'Verificando...' : 'Entrar'}
                </button>

                <button
                  type="button"
                  onClick={() => { setOtpStep('email'); setOtpCode(''); setOtpError(null) }}
                  className="w-full text-xs text-gray-muted hover:text-off-white transition-colors"
                >
                  ← Alterar e-mail
                </button>
              </form>
            )}
          </div>
        )}

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
