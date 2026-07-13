import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-guards'

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json({ categories })
}

export async function POST(req: NextRequest) {
  const { adminError } = await requireAdmin()
  if (adminError) return adminError

  const body = await req.json()
  const name = (body.name ?? '').trim()
  if (!name) return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })

  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  try {
    const category = await prisma.category.create({
      data: { name, slug, description: body.description ?? null },
    })
    revalidatePath('/admin/categorias')
    return NextResponse.json({ category }, { status: 201 })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe una categoría con ese nombre' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error al crear la categoría' }, { status: 500 })
  }
}
