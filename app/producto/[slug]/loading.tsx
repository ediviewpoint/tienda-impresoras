export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pb-24 lg:pb-0">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        {/* Left — image skeleton */}
        <div>
          <div className="flex gap-2 mb-4">
            <div className="h-9 w-28 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-9 w-28 bg-gray-100 rounded-full animate-pulse" />
          </div>
          <div className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
          <div className="hidden md:flex gap-2 mt-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-16 h-16 bg-gray-100 rounded-lg animate-pulse flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Right — info skeleton */}
        <div className="flex flex-col gap-3">
          <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
          <div className="h-7 w-3/4 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />

          <div className="mt-2 space-y-2">
            <div className="h-8 w-36 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
          </div>

          <div className="mt-4 space-y-2">
            <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
          </div>

          <div className="space-y-2 mt-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3 mt-auto pt-4">
            <div className="h-11 w-32 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-11 flex-1 bg-gray-100 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Mobile sticky bar skeleton */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 border-t border-gray-100 px-4 py-3 flex items-center gap-3">
        <div className="flex-1 space-y-1">
          <div className="h-5 w-20 bg-gray-100 rounded animate-pulse" />
          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="h-12 w-32 bg-gray-100 rounded-full animate-pulse shrink-0" />
        <div className="h-12 w-12 bg-gray-100 rounded-full animate-pulse shrink-0" />
      </div>
    </div>
  )
}
