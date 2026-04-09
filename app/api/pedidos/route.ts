import { getAllOrders, createOrder } from '@/lib/db/orders'
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

const VALID_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  const validStatus = VALID_STATUSES.includes(status as OrderStatus)
    ? (status as OrderStatus)
    : undefined

  const orders = await getAllOrders({ status: validStatus })
  return Response.json(orders)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const order = await createOrder(body)
    return Response.json(order, { status: 201 })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Dados inválidos' }, { status: 400 })
  }
}
