import HeroSection from '@/components/home/HeroSection'
import DropSection from '@/components/home/DropSection'
import ProductsGrid from '@/components/home/ProductsGrid'
import CategoryCards from '@/components/home/CategoryCards'
import IdentityBlock from '@/components/home/IdentityBlock'
import Testimonials from '@/components/home/Testimonials'
import KitSection from '@/components/home/KitSection'
import { getFeaturedProducts, getProductBySlug } from '@/lib/db/products'
import { getActiveDrop } from '@/lib/db/drops'
import { getAllTestimonials } from '@/lib/db/testimonials'

export default async function Home() {
  const [drop, featured, testimonials, kit] = await Promise.allSettled([
    getActiveDrop(),
    getFeaturedProducts(8),
    getAllTestimonials(6),
    getProductBySlug('kit-fogo'),
  ]).then((results) =>
    results.map((r) => (r.status === 'fulfilled' ? r.value : null))
  )

  return (
    <>
      <HeroSection />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {drop && <DropSection drop={drop as any} />}
      {featured && Array.isArray(featured) && featured.length > 0 && (
        <ProductsGrid
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          products={featured as any}
          title="DROP 01"
          subtitle="Peças do primeiro drop — edição limitada, sem reposição."
        />
      )}
      <CategoryCards />
      <IdentityBlock />
      {testimonials && Array.isArray(testimonials) && testimonials.length > 0 && (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Testimonials testimonials={testimonials as any} />
      )}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {kit && <KitSection kit={kit as any} />}
    </>
  )
}
