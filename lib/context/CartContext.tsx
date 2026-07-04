'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { CartItem, CartState, Product } from '@/lib/types'

type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; productId: string }
  | { type: 'UPDATE_QTY'; productId: string; quantity: number }
  | { type: 'CLEAR' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.product.id === action.product.id)
      const items = existing
        ? state.items.map(i =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...state.items, { product: action.product, quantity: 1 }]
      return derive(items)
    }
    case 'REMOVE': {
      const items = state.items.filter(i => i.product.id !== action.productId)
      return derive(items)
    }
    case 'UPDATE_QTY': {
      const items = state.items
        .map(i =>
          i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
        )
        .filter(i => i.quantity > 0)
      return derive(items)
    }
    case 'CLEAR':
      return derive([])
    default:
      return state
  }
}

function derive(items: CartItem[]): CartState {
  return {
    items,
    count: items.reduce((s, i) => s + i.quantity, 0),
    total: items.reduce((s, i) => s + i.product.price * i.quantity, 0),
  }
}

const initialState: CartState = { items: [], count: 0, total: 0 }

interface CartContextType {
  cart: CartState
  add: (product: Product) => void
  remove: (productId: string) => void
  updateQty: (productId: string, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState)

  return (
    <CartContext.Provider
      value={{
        cart,
        add: (product) => dispatch({ type: 'ADD', product }),
        remove: (productId) => dispatch({ type: 'REMOVE', productId }),
        updateQty: (productId, quantity) => dispatch({ type: 'UPDATE_QTY', productId, quantity }),
        clear: () => dispatch({ type: 'CLEAR' }),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
