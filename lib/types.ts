export interface ProductVariant {
  size: string
  color: string
  colorHex: string
  stock: number
}

export interface Product {
  id: string
  slug: string
  name: string
  price: number
  originalPrice?: number
  description: string
  shortDescription: string
  category: { id: string; name: string; slug: string; color: string }
  images: string[]
  variants: ProductVariant[]
  rating: number
  reviewCount: number
  isNew: boolean
  isLimited: boolean
  dropId?: string
  tags: string[]
}

export interface Drop {
  id: string
  name: string
  tagline: string
  description: string
  startDate: string
  endDate: string
  productIds: string[]
  stockLimit: number
  stockRemaining: number
  isActive: boolean
}

export interface CartItem {
  productId: string
  slug: string
  name: string
  price: number
  quantity: number
  size: string
  color: string
  colorHex: string
  image: string
  stock: number
}

export interface Order {
  id: string
  createdAt: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  items: Array<{
    productId: string
    name: string
    size: string
    color: string
    quantity: number
    price: number
  }>
  totalPrice: number
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: Address
}

export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  text: string
  productName: string
  avatarInitials: string
}

export interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, qty: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}
