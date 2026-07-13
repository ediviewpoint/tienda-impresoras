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
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, ...(body.description !== undefined ? { description: body.description } : {}) },
    })
    revalidatePath('/admin/categorias')
    return NextResponse.json({ category })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe una categoría con ese nombre' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error al actualizar la categoría' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { adminError } = await requireAdmin()
  if (adminError) return adminError

  const { id } = await params

  try {
    await prisma.category.delete({ where: { id } })
    revalidatePath('/admin/categorias')
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2003') {
      return NextResponse.json(
        { error: 'No se puede eliminar: la categoría tiene productos asociados. Reasigna o elimina los productos primero.' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Error al eliminar la categoría' }, { status: 500 })
  }
}
