import { NextResponse } from 'next/server'
import { auth } from '@/auth'

const ADMINS = (process.env.ADMIN_EMAIL ?? '').split(',').map(e => e.trim()).filter(Boolean)

export function isAdmin(email?: string | null): boolean {
  return !!email && ADMINS.includes(email)
}

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return {
      session: null,
      adminError: NextResponse.json({ error: 'No autorizado' }, { status: 401 }),
    }
  }
  return { session, adminError: null as null }
}

export async function requireSession() {
  const session = await auth()
  if (!session?.user?.email) {
    return {
      session: null,
      authError: NextResponse.json({ error: 'Sesión requerida' }, { status: 401 }),
    }
  }
  return { session, authError: null as null }
}
