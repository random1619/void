'use client';

import { cn } from '../../lib/utils';

interface ShimmerSkeletonProps {
  className?: string;
}

export function ShimmerSkeleton({ className = '' }: ShimmerSkeletonProps) {
  return (
    <div className={cn('relative overflow-hidden bg-void-surface rounded', className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-sweep" />
    </div>
  );
}