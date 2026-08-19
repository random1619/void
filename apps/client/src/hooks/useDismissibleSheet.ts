import { useEffect, useLayoutEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import {
  animate,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'framer-motion';

interface DismissibleSheetOptions {
  /** Whether the sheet is currently mounted/present (AnimatePresence). */
  present: boolean;
  /** Called after the exit spring completes — pass `safeToRemove` from usePresence. */
  onExitComplete: () => void;
  /** Called when the user flicks/commits a dismissal. */
  onDismiss: () => void;
  /** Reduced-motion flag — the sheet fades instead of traveling. */
  reducedMotion: boolean;
  /** Ref of the panel, used to measure its width. */
  panelRef: React.RefObject<HTMLElement | null>;
  /** Release offset (px) that commits a dismissal. Default: 120. */
  commitOffset?: number;
  /** Release velocity (px/s) that commits a dismissal. Default: 600. */
  commitVelocity?: number;
}

interface DismissibleSheet {
  /** The sheet's live x position — spread into `style={{ x }}`. */
  x: MotionValue<number>;
  /** Opacity used under reduced motion (entrance/exit fade). */
  panelOpacity: MotionValue<number>;
  /** Opacity that fades the sheet as it is dragged away. */
  dragOpacity: MotionValue<number>;
  /** Pointer handlers — spread onto the panel (`{...bind}`). */
  bind: {
    onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void;
    onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void;
    onPointerUp: (e: ReactPointerEvent<HTMLElement>) => void;
    onPointerCancel: (e: ReactPointerEvent<HTMLElement>) => void;
  };
}

/** Hysteresis (px) before a press becomes a drag — taps stay taps. */
const DRAG_THRESHOLD = 10;
/** Recent move samples kept for release-velocity estimation. */
const VELOCITY_SAMPLES = 4;

/**
 * useDismissibleSheet — drag-to-dismiss physics shared by every right-edge
 * overlay (CartDrawer, MobileMenu).
 *
 * Apple fluid-interface rules, in one hook:
 *  - 1:1 tracking: the panel is dragged directly under the pointer, and the
 *    release animation continues at its exact velocity (velocity handoff, §5).
 *  - Interruptibility: enter/exit springs animate from the live on-screen
 *    value (a MotionValue), so grabbing a panel mid-flight reverses it
 *    without a jump (§3). No CSS transitions involved.
 *  - Momentum projection: a release past `commitOffset` or faster than
 *    `commitVelocity` commits the dismissal; anything else springs back
 *    carrying the release velocity (§6).
 *  - Parallel gesture detection (§10): the press is not claimed up front.
 *    Vertical intent yields to the sheet's own scroll container; horizontal
 *    intent beyond the threshold captures the pointer — even when the press
 *    started on a link or button, so the sheet can be grabbed anywhere.
 *    A tap without movement still clicks the link underneath.
 *  - Reduced motion swaps travel for a short opacity cross-fade (§14).
 */
export function useDismissibleSheet({
  present,
  onExitComplete,
  onDismiss,
  reducedMotion,
  panelRef,
  commitOffset = 120,
  commitVelocity = 600,
}: DismissibleSheetOptions): DismissibleSheet {
  const x = useMotionValue(0);
  const panelOpacity = useMotionValue(1);
  const dragOpacity = useTransform(x, [0, 400], [1, 0.45]);

  // Velocity measured at release, handed to the exit spring.
  const dismissVelocity = useRef(0);

  // Gesture state — refs only, so the handlers never force re-renders.
  const gesture = useRef({
    tracking: false, // true once horizontal intent is confirmed
    pointerId: -1,
    startX: 0,
    startY: 0,
    history: [] as { x: number; t: number }[],
    cleanup: undefined as undefined | (() => void),
  });

  // Enter — spring from off-screen, from the presentation value.
  useLayoutEffect(() => {
    if (!present) return;
    const width = panelRef.current?.getBoundingClientRect().width ?? 480;
    if (reducedMotion) {
      panelOpacity.set(0);
      const controls = animate(panelOpacity, 1, { duration: 0.18, ease: 'easeOut' });
      return () => controls.stop();
    }
    x.set(width);
    const controls = animate(x, 0, {
      type: 'spring',
      stiffness: 420,
      damping: 38,
    });
    return () => controls.stop();
  }, [present, panelRef, reducedMotion, x, panelOpacity]);

  // Exit — carry the pointer's velocity into the dismissal spring.
  useEffect(() => {
    if (present) return;
    if (reducedMotion) {
      const controls = animate(panelOpacity, 0, { duration: 0.18, ease: 'easeOut' });
      controls.then(onExitComplete);
      return () => controls.stop();
    }
    const width = panelRef.current?.getBoundingClientRect().width ?? 480;
    const controls = animate(x, width, {
      type: 'spring',
      stiffness: 520,
      damping: 34,
      velocity: dismissVelocity.current,
    });
    controls.then(onExitComplete);
    return () => controls.stop();
  }, [present, onExitComplete, panelRef, reducedMotion, x, panelOpacity]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotion) return;
    // Mouse: primary button only. Touch/pen always report button 0.
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const g = gesture.current;
    g.tracking = false;
    g.pointerId = e.pointerId;
    g.startX = e.clientX;
    g.startY = e.clientY;
    g.history = [{ x: e.clientX, t: performance.now() }];
    dismissVelocity.current = 0;

    // Chromium starts a native HTML drag when a link is dragged ~4px, which
    // hijacks the pointer stream and kills the sheet gesture. React's
    // onDragStart can be dropped from the props merge (React 19 quirk), so
    // attach a native listener that lives exactly as long as the press.
    // Cancelling dragstart does not affect taps/clicks at all.
    const panel = e.currentTarget;
    const stopNativeDrag = (ev: Event) => ev.preventDefault();
    panel.addEventListener('dragstart', stopNativeDrag, { capture: true });
    gesture.current.cleanup = () => {
      panel.removeEventListener('dragstart', stopNativeDrag, { capture: true });
      gesture.current.cleanup = undefined;
    };
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const g = gesture.current;
    if (e.pointerId !== g.pointerId) return;

    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;

    if (!g.tracking) {
      // Hysteresis + direction lock: commit only on clear horizontal intent.
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        // Vertical intent — the scroll container wins; stop tracking this pointer.
        g.pointerId = -1;
        return;
      }
      g.tracking = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.style.touchAction = 'none';
    }

    const now = performance.now();
    g.history.push({ x: e.clientX, t: now });
    if (g.history.length > VELOCITY_SAMPLES) g.history.shift();

    // Right-edge sheet: only positive x moves it; negative is a no-op.
    x.set(Math.max(0, dx));
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLElement>) => {
    finishDrag(e, false);
  };

  const handlePointerCancel = (e: ReactPointerEvent<HTMLElement>) => {
    finishDrag(e, true);
  };

  const finishDrag = (e: ReactPointerEvent<HTMLElement>, cancelled: boolean) => {
    const g = gesture.current;
    if (e.pointerId !== g.pointerId || !g.tracking) return;
    g.tracking = false;
    g.pointerId = -1;
    e.currentTarget.style.touchAction = '';
    g.cleanup?.();

    // Release velocity from the recent history (px/s), clamped to the
    // commit direction — handed straight to the spring (§5).
    const h = g.history;
    let velocity = 0;
    if (h.length >= 2) {
      const dt = (h[h.length - 1].t - h[0].t) / 1000;
      if (dt > 0) velocity = (h[h.length - 1].x - h[0].x) / dt;
    }
    dismissVelocity.current = Math.max(0, velocity);

    if (cancelled) {
      // Browser took the gesture (e.g. scroll) — settle back from the
      // presentation value, no velocity.
      dismissVelocity.current = 0;
      animate(x, 0, { type: 'spring', stiffness: 600, damping: 42 });
      return;
    }

    if (x.get() > commitOffset || velocity > commitVelocity) {
      onDismiss();
      return;
    }

    // Snap back — the spring re-targets from the current value and carries
    // the release velocity, so the reversal never hits a "brick wall" (§3).
    animate(x, 0, {
      type: 'spring',
      stiffness: 600,
      damping: 42,
      velocity: dismissVelocity.current,
    });
  };

  return {
    x,
    panelOpacity,
    dragOpacity,
    bind: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    },
  };
}
