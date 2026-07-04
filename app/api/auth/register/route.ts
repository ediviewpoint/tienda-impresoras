import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getResend, FROM } from '@/lib/email'
import WelcomeEmail from '@/emails/WelcomeEmail'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Ya existe una cuenta con ese email' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name: name || null, email, password: hashed },
  })

  // Email de bienvenida — fire and forget
  if (process.env.RESEND_API_KEY) {
    getResend().emails.send({
      from: FROM,
      to: email,
      subject: '¡Bienvenido a PrintMax!',
      react: WelcomeEmail({ name: name || undefined, email }),
    })
  }

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
}
