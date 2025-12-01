export default function DashboardLoading() {
  return (
    <section>
      <div className="mb-6">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded border p-4">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-6 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div>
        <div className="h-6 w-48 animate-pulse rounded bg-gray-200 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 w-full animate-pulse rounded bg-gray-200"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
