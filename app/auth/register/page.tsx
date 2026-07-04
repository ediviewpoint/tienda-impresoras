'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function field(key: keyof typeof form) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(f => ({ ...f, [key]: e.target.value })),
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Auto sign-in after register
      await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      router.push('/cuenta')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cuenta')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    await signIn('google', { callbackUrl: '/cuenta' })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">Crear cuenta</h1>
          <p className="text-sm text-gray-400 mt-1">Empieza a comprar en PrintMax</p>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full h-11 flex items-center justify-center gap-3 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors mb-5 disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </button>

        <div className="relative flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-semibold">o con tu email</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Nombre</label>
            <input
              type="text"
              {...field('name')}
              placeholder="Tu nombre"
              className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-[#1852D9] transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Email *</label>
            <input
              type="email"
              required
              {...field('email')}
              placeholder="tu@email.com"
              className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-[#1852D9] transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Contraseña *</label>
            <input
              type="password"
              required
              {...field('password')}
              placeholder="Mínimo 6 caracteres"
              className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-[#1852D9] transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Confirmar contraseña *</label>
            <input
              type="password"
              required
              {...field('confirm')}
              placeholder="Repite tu contraseña"
              className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-[#1852D9] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-full bg-[#1852D9] text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-[#1852D9] font-semibold hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
