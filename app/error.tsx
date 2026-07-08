'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl mb-4">⚠️</p>
      <h2 className="text-xl font-extrabold text-gray-900 mb-2">Algo salió mal</h2>
      <p className="text-gray-500 mb-6 max-w-sm text-sm">{error.message || 'Ocurrió un error inesperado. Intenta de nuevo.'}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="h-10 px-6 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors"
        >
          Reintentar
        </button>
        <a
          href="/"
          className="h-10 px-6 rounded-full border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center"
        >
          Ir al inicio
        </a>
      </div>
    </div>
  )
}
