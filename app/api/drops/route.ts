import { getAllDrops, createDrop } from '@/lib/db/drops'

export async function GET() {
  const drops = await getAllDrops()
  return Response.json(drops)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const drop = await createDrop(body)
    return Response.json(drop, { status: 201 })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Dados inválidos' }, { status: 400 })
  }
}
