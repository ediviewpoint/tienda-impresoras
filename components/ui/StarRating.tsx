export function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} className={i <= rating ? 'text-amber-400' : 'text-gray-200'}>★</span>
        ))}
      </div>
      <span className="text-xs text-gray-400">({count})</span>
    </div>
  )
}
