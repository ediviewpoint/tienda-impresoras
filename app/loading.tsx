export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-100 rounded-lg w-64" />
        <div className="grid grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="h-44 bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="h-9 bg-gray-100 rounded-full mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
