import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { requireAdmin } from '@/lib/auth-guards'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
const MAX_BYTES = 4 * 1024 * 1024 // 4 MB

// Patterns that can execute code inside an SVG
const SVG_UNSAFE = [/<script/i, /\bon\w+\s*=/i, /javascript:/i]

export async function POST(req: NextRequest) {
  const { adminError } = await requireAdmin()
  if (adminError) return adminError

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Tipo no permitido. Usa JPEG, PNG, WebP o SVG.' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'El archivo supera el límite de 4 MB.' }, { status: 400 })
  }

  if (file.type === 'image/svg+xml') {
    const text = await file.text()
    if (SVG_UNSAFE.some(re => re.test(text))) {
      return NextResponse.json({ error: 'El SVG contiene código potencialmente inseguro (<script>, eventos o javascript:).' }, { status: 400 })
    }
  }

  const ext = file.type === 'image/svg+xml' ? 'svg' : file.type.split('/')[1].replace('jpeg', 'jpg')
  const filename = `productos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const blob = await put(filename, file, { access: 'public' })
  return NextResponse.json({ url: blob.url })
}
