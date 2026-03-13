import { useRef, useSyncExternalStore, useCallback, useEffect } from "react";

export function useAnimatedCounter(
  target: number,
  duration = 1200,
  enabled = true,
): number {
  const storeRef = useRef({
    value: 0,
    listeners: new Set<() => void>(),
  });
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  const subscribe = useCallback((callback: () => void) => {
    storeRef.current.listeners.add(callback);
    return () => {
      storeRef.current.listeners.delete(callback);
    };
  }, []);

  const getSnapshot = useCallback(() => storeRef.current.value, []);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);

    if (!enabled || target === 0) {
      storeRef.current.value = target;
      storeRef.current.listeners.forEach((cb) => cb());
      return;
    }

    startRef.current = null;

    function step(timestamp: number) {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      storeRef.current.value = Math.round(eased * target * 100) / 100;
      storeRef.current.listeners.forEach((cb) => cb());

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, enabled]);

  return useSyncExternalStore(subscribe, getSnapshot);
}
