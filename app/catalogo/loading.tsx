export default function CatalogoLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
      {/* Breadcrumb placeholder */}
      <div className="h-4 w-40 bg-gray-100 rounded-full animate-pulse mb-6" />

      {/* Search bar */}
      <div className="h-11 w-full bg-gray-100 rounded-xl animate-pulse mb-5" />

      {/* Mobile filter button */}
      <div className="lg:hidden h-10 w-28 bg-gray-100 rounded-full animate-pulse mb-5" />

      <div className="flex gap-8">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="h-44 bg-gray-100 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-5 w-24 bg-gray-100 rounded animate-pulse mt-3" />
                  <div className="h-11 w-full bg-gray-100 rounded-full animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
