/**
 * Formatea un número a moneda Boliviana (Bs.)
 * Ejemplo: 1500.50 -> "Bs. 1.500,50"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('BOB', 'Bs.');
}

/**
 * Formatea una fecha ISO a un string legible
 * Ejemplo: "2026-07-07T21:05:18Z" -> "07 Jul 2026, 21:05"
 */
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
