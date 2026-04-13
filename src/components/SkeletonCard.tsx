export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
      <div className="aspect-[4/3] bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-shimmer" />
      <div className="p-4 md:p-5 space-y-2 md:space-y-3">
        <div className="h-4 md:h-5 w-3/4 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-shimmer rounded" />
        <div className="space-y-1.5 md:space-y-2">
          <div className="h-3 md:h-3 w-full bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-shimmer rounded" />
          <div className="h-3 md:h-3 w-2/3 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-shimmer rounded" />
        </div>
        <div className="h-10 md:h-11 w-full bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-shimmer rounded-lg mt-3 md:mt-4" />
      </div>
    </div>
  )
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 px-4 md:px-6 pb-12">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
