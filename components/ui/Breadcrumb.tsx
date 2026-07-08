import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Migas de pan" className="max-w-7xl mx-auto px-6 pt-5 pb-1">
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5 text-sm">
            {i > 0 && <span className="text-gray-300 select-none">/</span>}
            {item.href ? (
              <Link href={item.href} className="text-gray-400 hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-semibold line-clamp-1">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
