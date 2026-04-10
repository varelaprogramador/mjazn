import { betterFetch } from '@better-fetch/fetch'
import { NextResponse, type NextRequest } from 'next/server'
import type { Session } from '@/lib/auth'

const adminProtected = (p: string) =>
  p.startsWith('/admin') && p !== '/admin/login'

const customerProtected = (p: string) =>
  p.startsWith('/conta') &&
  p !== '/conta/login' &&
  p !== '/conta/cadastro'

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!adminProtected(pathname) && !customerProtected(pathname)) {
    return NextResponse.next()
  }

  const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
    baseURL: request.nextUrl.origin,
    headers: { cookie: request.headers.get('cookie') ?? '' },
  })

  if (!session) {
    const loginUrl = adminProtected(pathname) ? '/admin/login' : '/conta/login'
    return NextResponse.redirect(new URL(loginUrl, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
