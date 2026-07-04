import { Hero } from '@/components/home/Hero'
import { BenefitsBar } from '@/components/home/BenefitsBar'
import { Categories } from '@/components/home/Categories'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { PromoBanners } from '@/components/home/PromoBanners'
import { Brands } from '@/components/home/Brands'
import { Newsletter } from '@/components/home/Newsletter'

export default function HomePage() {
  return (
    <>
      <Hero />
      <BenefitsBar />
      <Categories />
      <FeaturedProducts />
      <PromoBanners />
      <Brands />
      <Newsletter />
    </>
  )
}
