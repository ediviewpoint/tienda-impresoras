'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SocialLoginButton } from '@/components/ui/SocialLoginButton'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const raw = searchParams.get('callbackUrl') ?? '/cuenta'
  // Rechaza cualquier URL absoluta para evitar open redirect
  const callbackUrl = raw.startsWith('/') ? raw : '/cuenta'
  const errorParam = searchParams.get('error')

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(errorParam === 'CredentialsSignin' ? 'Email o contraseña incorrectos.' : '')

  function field(key: 'email' | 'password') {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(f => ({ ...f, [key]: e.target.value })),
    }
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Email o contraseña incorrectos.')
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  async function handleGoogle() {
    setLoading(true)
    await signIn('google', { callbackUrl })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">Iniciar sesión</h1>
          <p className="text-sm text-gray-400 mt-1">Accede a tu cuenta PrintMax</p>
        </div>

        {/* Google */}
        <div className="mb-5">
          <SocialLoginButton onClick={handleGoogle} loading={loading} />
        </div>

        <div className="relative flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-semibold">o con tu email</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <form onSubmit={handleCredentials} className="space-y-4">
          {error && (
            <div className="text-sm text-error bg-error-bg border border-error-bg rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Email</label>
            <input
              type="email"
              required
              {...field('email')}
              placeholder="tu@email.com"
              className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Contraseña</label>
            <input
              type="password"
              required
              {...field('password')}
              placeholder="••••••••"
              className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-primary transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {loading ? 'Entrando…' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-5">
          ¿No tienes cuenta?{' '}
          <Link href="/auth/register" className="text-primary font-semibold hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
