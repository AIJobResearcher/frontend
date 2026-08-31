import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  onIntersect: () => void;
  enabled?: boolean;
  threshold?: number | number[];
}

export const useInfiniteScroll = ({
                                    onIntersect,
                                    enabled = true,
                                    threshold = 0.1,
                                  }: UseInfiniteScrollOptions): React.RefObject<HTMLDivElement | null> => {
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
        { threshold }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, enabled, threshold]);

  return ref;
};