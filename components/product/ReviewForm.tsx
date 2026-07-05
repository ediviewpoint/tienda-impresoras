'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Review {
  id: string
  rating: number
  body: string | null
  createdAt: string
  user: { name: string | null }
}

interface Props {
  productId: string
  initialReviews: Review[]
}

function Stars({ value, onClick }: { value: number; onClick?: (n: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onClick?.(n)}
          className={`text-xl transition-colors ${onClick ? 'cursor-pointer hover:scale-110' : 'cursor-default'} ${
            n <= value ? 'text-amber-400' : 'text-gray-200'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export function ReviewForm({ productId, initialReviews }: Props) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [rating, setRating] = useState(0)
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) { setError('Selecciona una calificación'); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, body }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setReviews(r => [{ ...data.review, createdAt: new Date().toISOString() }, ...r])
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar reseña')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 mt-8">
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="text-lg font-extrabold text-gray-900 mb-6">
          Reseñas <span className="text-gray-400 font-normal">({reviews.length})</span>
        </h2>

        <div className="grid grid-cols-[1fr_320px] gap-10">
          {/* Lista */}
          <div className="space-y-5">
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">Sin reseñas aún. ¡Sé el primero!</p>
            ) : (
              reviews.map(r => (
                <div key={r.id} className="border-b border-gray-50 pb-5 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-[#1852D9]">
                      {(r.user.name ?? 'A')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{r.user.name ?? 'Anónimo'}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <Stars value={r.rating} />
                    </div>
                  </div>
                  {r.body && <p className="text-sm text-gray-600 leading-relaxed pl-11">{r.body}</p>}
                </div>
              ))
            )}
          </div>

          {/* Form */}
          <div className="border-l border-gray-100 pl-10">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Escribe tu reseña</h3>

            {!session ? (
              <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
                <Link href="/auth/login" className="text-[#1852D9] font-semibold hover:underline">
                  Inicia sesión
                </Link>{' '}
                para dejar una reseña.
              </div>
            ) : submitted ? (
              <div className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-4 font-semibold">
                ¡Gracias por tu reseña!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">Calificación *</p>
                  <Stars value={rating} onClick={setRating} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Comentario (opcional)</label>
                  <textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    rows={4}
                    placeholder="¿Qué te pareció el producto?"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1852D9] resize-none"
                  />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-10 rounded-full bg-[#1852D9] text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Enviando…' : 'Publicar reseña'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
