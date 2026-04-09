import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'
import { getAllCategories } from '@/lib/db/categories'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await getAllCategories()
  const navCategories = categories.map((c) => ({ slug: c.slug, name: c.name }))

  return (
    <>
      <Header categories={navCategories} />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
