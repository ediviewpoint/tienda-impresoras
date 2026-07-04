import { cn } from '@/lib/utils'

type BadgeVariant = 'new' | 'sale' | 'hot' | 'best'

const styles: Record<BadgeVariant, string> = {
  new:  'bg-primary text-white',
  sale: 'bg-accent text-white',
  hot:  'bg-red-500 text-white',
  best: 'bg-amber-500 text-white',
}

const labels: Record<BadgeVariant, string> = {
  new:  'NUEVO',
  sale: 'OFERTA',
  hot:  '🔥 HOT',
  best: 'MÁS VENDIDO',
}

export function Badge({ variant }: { variant: BadgeVariant }) {
  return (
    <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full', styles[variant])}>
      {labels[variant]}
    </span>
  )
}
