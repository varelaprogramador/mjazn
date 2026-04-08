import type { Metadata } from 'next'
import { Geist, Geist_Mono, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const barlowCondensed = Barlow_Condensed({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Região Norte — Uma Geração Marcada pelo Fogo',
  description:
    'Streetwear cristão jovem. Drops limitados. Uma geração em chamas. Sem meia profundidade.',
  keywords: ['região norte', 'streetwear cristão', 'moda gospel', 'drop limitado', 'fé ativa'],
  openGraph: {
    title: 'Região Norte',
    description: 'Uma geração marcada pelo fogo.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-off-white">
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
