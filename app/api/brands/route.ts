import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-guards'

export async function GET() {
  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json({ brands })
}

export async function POST(req: NextRequest) {
  const { adminError } = await requireAdmin()
  if (adminError) return adminError

  const body = await req.json()
  const name = (body.name ?? '').trim()
  if (!name) return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })

  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  try {
    const brand = await prisma.brand.create({
      data: { name, slug, color: body.color ?? '#1852D9' },
    })
    revalidatePath('/admin/marcas')
    return NextResponse.json({ brand }, { status: 201 })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe una marca con ese nombre' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error al crear la marca' }, { status: 500 })
  }
}
