import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: string;
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 6,
  glowColor = 'rgba(59, 130, 246, 0.16)',
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const pendingCoordsRef = useRef<{ clientX: number; clientY: number } | null>(null);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const applyTilt = () => {
    rafIdRef.current = null;
    const el = cardRef.current;
    const coords = pendingCoordsRef.current;
    if (!el || !coords) return;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const px = (coords.clientX - rect.left) / rect.width;
    const py = (coords.clientY - rect.top) / rect.height;

    const rotateY = (px - 0.5) * (maxTilt * 2);
    const rotateX = (0.5 - py) * (maxTilt * 2);

    el.style.setProperty('--tilt-rx', `${rotateX.toFixed(2)}deg`);
    el.style.setProperty('--tilt-ry', `${rotateY.toFixed(2)}deg`);
    el.style.setProperty('--tilt-scale', '1.01');
    el.style.setProperty('--glow-x', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--glow-y', `${(py * 100).toFixed(1)}%`);
    el.style.setProperty('--glow-opacity', '1');
  };

  const handleMouseEnter = () => {
    const el = cardRef.current;
    if (!el) return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }
    el.style.willChange = 'transform';
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }
    pendingCoordsRef.current = { clientX: e.clientX, clientY: e.clientY };
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(applyTilt);
    }
  };

  const handleMouseLeave = () => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    pendingCoordsRef.current = null;
    const el = cardRef.current;
    if (!el) return;

    el.style.setProperty('--tilt-rx', '0deg');
    el.style.setProperty('--tilt-ry', '0deg');
    el.style.setProperty('--tilt-scale', '1');
    el.style.setProperty('--glow-opacity', '0');
    el.style.willChange = 'auto';
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform:
          'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg)) scale3d(var(--tilt-scale, 1), var(--tilt-scale, 1), var(--tilt-scale, 1))',
      }}
      className={`relative transition-transform duration-200 ease-out ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-10"
        style={{
          opacity: 'var(--glow-opacity, 0)',
          background: `radial-gradient(520px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor}, transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}
