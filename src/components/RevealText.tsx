import { m } from 'motion/react';

interface RevealTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  id?: string;
  className?: string;
  delay?: number;
  immediate?: boolean;
}

export function RevealText({
  text,
  as = 'h2',
  id,
  className = '',
  delay = 0,
  immediate = false,
}: RevealTextProps) {
  const words = text.split(' ');
  const Tag = as;

  return (
    <Tag id={id} className={className}>
      {words.map((word, idx) => (
        <span key={`${word}-${idx}`} className="inline-block overflow-hidden align-top">
          <m.span
            className="inline-block"
            initial={{ opacity: 0, y: 18 }}
            animate={immediate ? { opacity: 1, y: 0 } : undefined}
            whileInView={immediate ? undefined : { opacity: 1, y: 0 }}
            viewport={immediate ? undefined : { once: true, margin: '-40px' }}
            transition={{
              duration: 0.45,
              delay: delay + idx * 0.045,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {idx < words.length - 1 ? '\u00A0' : ''}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}
