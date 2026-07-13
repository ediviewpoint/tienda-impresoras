import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-guards'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { adminError } = await requireAdmin()
  if (adminError) return adminError

  const { id } = await params
  const body = await req.json()
  const name = (body.name ?? '').trim()
  if (!name) return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })

  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  try {
    const brand = await prisma.brand.update({
      where: { id },
      data: { name, slug, ...(body.color ? { color: body.color } : {}) },
    })
    revalidatePath('/admin/marcas')
    return NextResponse.json({ brand })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe una marca con ese nombre' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error al actualizar la marca' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { adminError } = await requireAdmin()
  if (adminError) return adminError

  const { id } = await params

  try {
    await prisma.brand.delete({ where: { id } })
    revalidatePath('/admin/marcas')
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2003') {
      return NextResponse.json(
        { error: 'No se puede eliminar: la marca tiene productos asociados. Reasigna o elimina los productos primero.' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Error al eliminar la marca' }, { status: 500 })
  }
}
