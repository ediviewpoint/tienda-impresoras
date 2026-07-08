export const STATUS_CLASSES: Record<string, string> = {
  pendiente:  'bg-warning-bg text-warning',
  confirmado: 'bg-primary-light text-primary',
  enviado:    'bg-purple-100 text-purple-700',
  entregado:  'bg-success-bg text-success',
  cancelado:  'bg-error-bg text-error',
}

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_CLASSES[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}
