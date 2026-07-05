import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `Bs. ${new Intl.NumberFormat('es-BO', { maximumFractionDigits: 0 }).format(price)}`
}

export function discountPercent(price: number, original: number): number {
  return Math.round((1 - price / original) * 100)
}

export const IVA_RATE = 0.13
export const FREE_SHIPPING_THRESHOLD = 500
export const SHIPPING_COST = 50
