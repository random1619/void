import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { type ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  delayDuration?: number;
}

/**
 * Branded Tooltip — Radix-powered, collision-aware, accessible.
 *
 * Uses VOID design tokens: bone background, hairline border, mono typography.
 * Supports rich content (not just strings).
 */
export function Tooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  sideOffset = 6,
  delayDuration,
}: TooltipProps) {
  if (!content) return <>{children}</>;

  return (
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className="z-[60] select-none rounded-lg border border-hairline bg-[var(--ivory-deep)] px-3 py-1.5 shadow-lg backdrop-blur-xl
            font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink
            data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95
            data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
            data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1
            data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1"
        >
          {content}
          <TooltipPrimitive.Arrow
            className="fill-[var(--ivory-deep)] drop-shadow-sm"
            width={10}
            height={5}
          />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
