export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className ?? ''}`}>
      <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-purple-600" />
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border bg-card p-4 space-y-3">
      <div className="aspect-square rounded-lg bg-muted" />
      <div className="h-4 w-3/4 rounded bg-muted" />
      <div className="h-4 w-1/2 rounded bg-muted" />
      <div className="h-8 rounded bg-muted" />
    </div>
  );
}
