/* Browser globals needed by the component tests; the API tests run in the
   `node` environment and skip this block. */
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: (): void => {},
      removeListener: (): void => {},
      addEventListener: (): void => {},
      removeEventListener: (): void => {},
      dispatchEvent: (): void => {},
    }),
  });

  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '0px';
    readonly scrollMargin: string = '0px';
    readonly thresholds: ReadonlyArray<number> = [0];

    disconnect(): void {}
    observe(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    unobserve(): void {}
  }

  global.IntersectionObserver = MockIntersectionObserver;
}
