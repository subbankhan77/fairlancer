export default function DashboardSkeleton() {
    return (
      <div className="dashboard__content pt20">
        <div className="animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="flex gap-2 mb-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-24 bg-gray-200 rounded"></div>
            ))}
          </div>
  
          {/* Header skeleton */}
          <div className="mb-4">
            <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
  
          {/* Content skeleton */}
          <div className="cta-service-v1 mb30 p-6 bdrs16">
            <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
            <div className="flex gap-4 mb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 w-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
  
          {/* Info boxes skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded">
                <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
  
          {/* Description skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-full bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }