'use client'

import { useState } from 'react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit() {
    if (email.includes('@')) {
      setSent(true)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 mt-12">
      <div className="bg-gradient-to-r from-primary to-primary-lighter rounded-2xl px-12 py-12 flex items-center gap-12">
        <div className="text-white flex-1">
          <h3 className="text-2xl font-extrabold mb-2">Recibe las mejores ofertas</h3>
          <p className="text-white/75 text-sm">Suscríbete y obtén <strong>10% de descuento</strong> en tu primera compra más acceso a ofertas exclusivas.</p>
        </div>
        <div className="flex gap-3 flex-1 max-w-md">
          {sent ? (
            <div className="flex-1 text-center text-white font-bold text-sm py-3">
              ✓ ¡Gracias! Revisa tu correo.
            </div>
          ) : (
            <>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="flex-1 h-12 rounded-full border border-white/25 bg-white/15 backdrop-blur-md text-white placeholder:text-white/60 px-5 text-sm outline-none focus:border-white/60 focus:bg-white/20 transition-all"
              />
              <button
                onClick={handleSubmit}
                className="h-12 px-6 rounded-full bg-accent text-white text-sm font-bold flex-shrink-0 hover:bg-accent-dark transition-colors"
              >
                Suscribirme
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
