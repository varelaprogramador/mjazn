import { prisma } from '@/lib/prisma'

export async function getAllTestimonials(limit?: number) {
  return prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function createTestimonial(data: {
  name: string
  location: string
  rating: number
  text: string
  productName: string
  avatarInitials: string
}) {
  return prisma.testimonial.create({ data })
}
