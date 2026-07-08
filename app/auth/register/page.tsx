'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SocialLoginButton } from '@/components/ui/SocialLoginButton'

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

        <div className="mb-5">
          <SocialLoginButton onClick={handleGoogle} loading={loading} />
        </div>

        <div className="relative flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-semibold">o con tu email</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-error bg-error-bg border border-error-bg rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Nombre</label>
            <input
              type="text"
              {...field('name')}
              placeholder="Tu nombre"
              className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Email *</label>
            <input
              type="email"
              required
              {...field('email')}
              placeholder="tu@email.com"
              className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Contraseña *</label>
            <input
              type="password"
              required
              {...field('password')}
              placeholder="Mínimo 6 caracteres"
              className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Confirmar contraseña *</label>
            <input
              type="password"
              required
              {...field('confirm')}
              placeholder="Repite tu contraseña"
              className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-primary transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {loading ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
