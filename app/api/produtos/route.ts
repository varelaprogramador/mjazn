import { getAllProducts, createProduct } from '@/lib/db/products'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria') ?? undefined
  const drop = searchParams.get('drop') ?? undefined

  const products = await getAllProducts({
    categorySlug: categoria,
    dropId: drop,
  })

  return Response.json(products)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await createProduct(body)
    return Response.json(product, { status: 201 })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Dados inválidos' }, { status: 400 })
  }
}
