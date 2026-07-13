'use client'

import { useToastStore } from '@/lib/store/useToastStore'

export default function Toaster() {
  const { toasts, dismiss } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 max-w-xs w-full">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center justify-between gap-3 rounded-xl shadow-lg bg-white px-4 py-3 border-l-4 ${
            t.kind === 'error' ? 'border-red-500' : 'border-green-500'
          } animate-in slide-in-from-bottom-2 duration-200`}
        >
          <span className="text-sm text-gray-800 font-medium leading-snug">{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            aria-label="Cerrar"
            className="text-gray-400 hover:text-gray-600 shrink-0 text-base leading-none"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
