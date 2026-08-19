import { cn } from '../../lib/utils';
import { ShimmerSkeleton } from './ShimmerSkeleton';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export function ProductSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)} aria-hidden="true" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <ShimmerSkeleton className="aspect-[3/4] border border-hairline" />
          <div className="mt-4 space-y-2">
            <ShimmerSkeleton className="h-4 w-3/4" />
            <ShimmerSkeleton className="h-3 w-1/2" />
            <ShimmerSkeleton className="h-5 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div
      className="fixed inset-0 atelier-bg flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4" aria-hidden="true">
        <div className="atelier-eyebrow text-ink-mute tracking-[0.32em]">VOID</div>
        {/* The shimmer keyframe animates backgroundPosition, so the gradient
            must be tiled (200% width) for the sweep to be visible. */}
        <div
          className="w-16 h-px bg-[length:200%_100%] animate-shimmer"
          style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(24,20,16,0.08), transparent)' }}
        />
      </div>
    </div>
  );
}

export function ButtonLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <span className="flex items-center justify-center gap-2" role="status" aria-live="polite">
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export function CategorySkeleton({ count = 1 }: LoadingSkeletonProps) {
  return (
    <div aria-hidden="true" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse atelier-bg border border-hairline p-6 h-full">
          <div className="aspect-[16/9] bg-[var(--bone)] mb-6" />
          <div className="space-y-2">
            <div className="h-3 bg-[var(--bone)] rounded w-1/4" />
            <div className="h-5 bg-[var(--bone)] rounded w-2/3" />
            <div className="h-3 bg-[var(--bone)] rounded w-full" />
          </div>
          <div className="mt-6 pt-4 border-t border-hairline flex justify-between">
            <div className="h-3 bg-[var(--bone)] rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrderSkeleton({ count = 1 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-3" aria-hidden="true" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-20 bg-[var(--bone)] animate-pulse border border-hairline" />
      ))}
    </div>
  );
}

export function AddressSkeleton({ count = 1 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-3" aria-hidden="true" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-24 bg-[var(--bone)] animate-pulse border border-hairline" />
      ))}
    </div>
  );
}
