import { getAllProducts, createProduct } from '@/lib/db/products'
type Category = 'camisetas' | 'polos' | 'kits' | 'acessorios'

const VALID_CATEGORIES: Category[] = ['camisetas', 'polos', 'kits', 'acessorios']

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')
  const drop = searchParams.get('drop')

  const validCategory = VALID_CATEGORIES.includes(categoria as Category)
    ? (categoria as Category)
    : undefined

  const products = await getAllProducts({
    category: validCategory,
    dropId: drop ?? undefined,
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
