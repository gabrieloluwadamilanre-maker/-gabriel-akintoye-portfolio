import { useEffect, useRef } from 'react';

export interface FloatingWordItem {
  text: string;
  className: string;
  depth?: number;
  reverse?: boolean;
  hideOnMobile?: boolean;
}

interface FloatingTypographyProps {
  items: FloatingWordItem[];
}

// Single shared desktop scroll parallax manager to avoid multiple scroll observers
type Subscriber = (viewportCenterProgress: number, el: HTMLDivElement) => void;
const subscribers = new Set<{ el: HTMLDivElement; update: Subscriber }>();
let listenerAttached = false;
let scrollRafId: number | null = null;

function notifySubscribers() {
  scrollRafId = null;
  const vh = window.innerHeight || 800;
  subscribers.forEach(({ el, update }) => {
    const rect = el.getBoundingClientRect();
    if (rect.bottom < -120 || rect.top > vh + 120) return;
    const total = vh + rect.height;
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / Math.max(total, 1)));
    update(progress, el);
  });
}

function handleSharedScroll() {
  if (scrollRafId === null) {
    scrollRafId = requestAnimationFrame(notifySubscribers);
  }
}

function subscribeContainer(entry: { el: HTMLDivElement; update: Subscriber }) {
  subscribers.add(entry);
  if (!listenerAttached) {
    listenerAttached = true;
    window.addEventListener('scroll', handleSharedScroll, { passive: true });
    notifySubscribers();
  }
  return () => {
    subscribers.delete(entry);
    if (subscribers.size === 0 && listenerAttached) {
      window.removeEventListener('scroll', handleSharedScroll);
      listenerAttached = false;
      if (scrollRafId !== null) {
        cancelAnimationFrame(scrollRafId);
        scrollRafId = null;
      }
    }
  };
}

export function FloatingTypography({ items }: FloatingTypographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const isDesktopMotion =
      window.innerWidth >= 768 &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !window.matchMedia('(pointer: coarse)').matches;

    if (!isDesktopMotion) return;

    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-depth]'));
    if (spans.length === 0) return;

    const unsubscribe = subscribeContainer({
      el,
      update: (progress) => {
        const offsetFactor = progress * 2 - 1; // -1 to 1 across viewport pass
        spans.forEach((span) => {
          const depth = Number(span.dataset.depth || '28');
          const y = offsetFactor * depth;
          span.style.setProperty('--parallax-y', `${y.toFixed(1)}px`);
        });
      },
    });

    return unsubscribe;
  }, [items.length]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
    >
      {items.map((item, index) => (
        <span
          key={`${item.text}-${index}`}
          data-depth={item.depth ?? 28}
          aria-hidden="true"
          style={{ transform: 'translate3d(0, var(--parallax-y, 0px), 0)' }}
          className={`pointer-events-none absolute select-none font-display font-bold tracking-[0.14em] ${
            item.hideOnMobile ? 'hidden md:block' : 'block'
          } ${item.className}`}
        >
          <span
            className={`inline-block ${
              item.reverse ? 'animate-float-reverse' : 'animate-float-slow'
            }`}
          >
            {item.text}
          </span>
        </span>
      ))}
    </div>
  );
}
