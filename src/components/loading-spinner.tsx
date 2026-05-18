export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className ?? ''}`}>
      <div className="border-muted size-8 animate-spin rounded-full border-4 border-t-purple-600" />
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="bg-card animate-pulse space-y-3 rounded-xl border p-4">
      <div className="bg-muted aspect-square rounded-lg" />
      <div className="bg-muted h-4 w-3/4 rounded" />
      <div className="bg-muted h-4 w-1/2 rounded" />
      <div className="bg-muted h-8 rounded" />
    </div>
  );
}
