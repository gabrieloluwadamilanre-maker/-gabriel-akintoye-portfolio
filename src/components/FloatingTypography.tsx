import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

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

function FloatingWord({
  item,
  scrollYProgress,
}: {
  item: FloatingWordItem;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const depth = item.depth ?? 28;
  const y = useTransform(scrollYProgress, [0, 1], [-depth, depth]);

  return (
    <motion.span
      style={{ y }}
      aria-hidden="true"
      className={`pointer-events-none select-none font-display font-bold tracking-[0.14em] ${
        item.hideOnMobile ? 'hidden md:block' : 'block'
      } ${item.reverse ? 'animate-float-reverse' : 'animate-float-slow'} ${item.className}`}
    >
      {item.text}
    </motion.span>
  );
}

export function FloatingTypography({ items }: FloatingTypographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
    >
      {items.map((item, index) => (
        <FloatingWord
          key={`${item.text}-${index}`}
          item={item}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}
