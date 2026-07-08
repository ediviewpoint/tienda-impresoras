import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary:   'bg-primary text-white hover:bg-primary-dark',
  secondary: 'border border-gray-200 text-gray-600 hover:bg-gray-50',
  ghost:     'text-primary hover:bg-primary-light',
  danger:    'text-error hover:bg-error-bg',
}

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-7 text-sm',
}

export function AppButton({ variant = 'primary', size = 'md', className, children, ...props }: AppButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
