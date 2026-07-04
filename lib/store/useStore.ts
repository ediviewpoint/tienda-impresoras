import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/lib/types'
import { IVA_RATE } from '@/lib/utils'

export interface CartItem {
  product: Product
  quantity: number
}

interface StoreState {
  // ── Cart ──────────────────────────────────
  items: CartItem[]
  add: (product: Product) => void
  remove: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clear: () => void

  // ── Facturación ───────────────────────────
  tieneFactura: boolean
  setTieneFactura: (v: boolean) => void

  // ── Computed (getters) ────────────────────
  // Precio final según factura: sin factura = precio / (1 + IVA)
  getPrecio: (basePrice: number) => number
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ── Cart ──────────────────────────────
      items: [],

      add(product) {
        set(s => {
          const exists = s.items.find(i => i.product.id === product.id)
          return {
            items: exists
              ? s.items.map(i =>
                  i.product.id === product.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                )
              : [...s.items, { product, quantity: 1 }],
          }
        })
      },

      remove(productId) {
        set(s => ({ items: s.items.filter(i => i.product.id !== productId) }))
      },

      updateQty(productId, qty) {
        set(s => ({
          items: s.items
            .map(i => (i.product.id === productId ? { ...i, quantity: qty } : i))
            .filter(i => i.quantity > 0),
        }))
      },

      clear() {
        set({ items: [] })
      },

      // ── Facturación ──────────────────────
      tieneFactura: true,

      setTieneFactura(v) {
        set({ tieneFactura: v })
      },

      // ── Precio dinámico ──────────────────
      getPrecio(basePrice) {
        return get().tieneFactura ? basePrice : basePrice / (1 + IVA_RATE)
      },
    }),
    {
      name: 'printmax-store',
      partialize: state => ({ items: state.items, tieneFactura: state.tieneFactura }),
      skipHydration: true,
    }
  )
)

// ── Selectors ─────────────────────────────────────────────────────────────────
export const useCartCount  = () => useStore(s => s.items.reduce((n, i) => n + i.quantity, 0))
export const useCartTotal  = () => useStore(s => {
  const { items, getPrecio } = s
  return items.reduce((t, i) => t + getPrecio(i.product.price) * i.quantity, 0)
})
export const useTieneFactura = () => useStore(s => ({ tieneFactura: s.tieneFactura, setTieneFactura: s.setTieneFactura }))
