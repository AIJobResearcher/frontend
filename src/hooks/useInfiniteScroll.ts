import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  onIntersect: () => void;
  enabled?: boolean;
  threshold?: number | number[];
}

/**
 * Hook to handle infinite scroll using IntersectionObserver API
 * Returns a ref to attach to the trigger element (usually at the bottom of a list)
 */
export const useInfiniteScroll = ({
  onIntersect,
  enabled = true,
  threshold = 0.1,
}: UseInfiniteScrollOptions) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      {
        threshold,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, enabled, threshold]);

  return ref;
};
