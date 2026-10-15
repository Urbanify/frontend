'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

const WORDS = ['Reportar', 'Verificar', 'Resolver', 'Confirmar'];

// Decorative band. The same flow is said again in plain text in HowItWorks.
export function Marquee() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Pause the loop while the band is off screen.
  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || !('IntersectionObserver' in window)) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      track.style.animationPlayState = entry?.isIntersecting ? 'running' : 'paused';
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const group = (dup: boolean) => (
    <div className={cn('flex shrink-0 items-center', dup && 'marquee-dup')}>
      {[...WORDS, ...WORDS].map((word, i) => (
        <span key={`${dup ? 'b' : 'a'}-${i}`} className="flex items-center gap-10 px-5">
          <span className={cn('font-display text-2xl font-bold md:text-3xl', i % 2 === 0 ? 'text-navy' : 'text-primary')}>
            {word}
          </span>
          <span className="size-2 rotate-45 bg-primary" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="mask-fade-x flex h-16 items-center overflow-hidden border-y border-border bg-gradient-to-r from-transparent via-primary/5 to-transparent md:h-20"
    >
      <div ref={trackRef} className="marquee-track flex w-max animate-marquee hover:[animation-play-state:paused]">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
