import { useCallback, useState } from "react";

export function useWishlist() {
  const [ids, setIds] = useState<Set<string>>(new Set());

  const isWishlisted = useCallback((id: string) => ids.has(id), [ids]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return { isWishlisted, toggle };
}
