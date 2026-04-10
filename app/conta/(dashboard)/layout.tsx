import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import DashboardSidebar from './DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/conta/login')
  }

  return (
    <div className="min-h-screen bg-black flex">
      <DashboardSidebar user={{ name: session.user.name, email: session.user.email }} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
