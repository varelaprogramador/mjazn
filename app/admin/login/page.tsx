import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Image from 'next/image'

async function login(formData: FormData) {
  'use server'
  const password = formData.get('password') as string
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'regiaonorte2025'

  if (password === adminPassword) {
    const cookieStore = await cookies()
    cookieStore.set('rn-admin', 'true', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    })
    redirect('/admin')
  }
}

export default async function AdminLogin() {
  // If already logged in, go to dashboard
  const cookieStore = await cookies()
  if (cookieStore.get('rn-admin')?.value === 'true') {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-1">
          <Image
            src="/logo-simbol.png"
            alt="Região Norte"
            width={120}
            height={160}
            className="h-20 w-auto"
          />
          <p className="text-[10px] font-display tracking-[0.4em] text-fire">ADMIN</p>
        </div>

        {/* Form */}
        <form action={login} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="password" className="text-[10px] font-display tracking-widest text-gray-muted">
              Senha de Acesso
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full h-11 bg-dark border border-gray-border px-4 text-sm text-off-white placeholder-gray-dim focus:outline-none focus:border-fire transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-fire text-black font-display tracking-widest text-sm hover:bg-fire-light transition-colors duration-200"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-dim">
          Acesso restrito — equipe Região Norte
        </p>
      </div>
    </div>
  )
}
