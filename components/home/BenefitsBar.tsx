const benefits = [
  {
    icon: '🚚',
    title: 'Envío Gratis',
    sub: 'Pedidos +Bs. 500',
    bg: 'bg-primary/10',
    color: 'text-primary',
  },
  {
    icon: '🛡️',
    title: 'Garantía Oficial',
    sub: '1 a 3 años según marca',
    bg: 'bg-orange-50',
    color: 'text-accent',
  },
  {
    icon: '↩️',
    title: 'Devolución Fácil',
    sub: '30 días sin preguntas',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
  },
  {
    icon: '📞',
    title: 'Soporte 24/7',
    sub: 'Chat, llamada y email',
    bg: 'bg-violet-50',
    color: 'text-violet-600',
  },
]

export function BenefitsBar() {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-7">
      <div className="bg-white rounded-xl border border-gray-100 grid grid-cols-4 overflow-hidden">
        {benefits.map(({ icon, title, sub, bg, color }, i) => (
          <div
            key={title}
            className={`flex items-center gap-3.5 px-6 py-5 ${i < 3 ? 'border-r border-gray-100' : ''}`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${bg} ${color}`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
