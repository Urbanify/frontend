import { Skeleton } from '@/components/ui/skeleton/skeleton';

// Shape of the home while the session or the list is loading. Used by loading.tsx too.
export function InicioSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 md:px-6" aria-busy="true">
      <div className="space-y-3">
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-32 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}
