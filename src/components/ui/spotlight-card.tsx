import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import '@/styles/spotlight-card.css';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
  as?: 'div' | 'article';
}

const sizes = { sm: 'w-48 h-64', md: 'w-64 h-80', lg: 'w-80 h-96' };

export function GlowCard({ children, className, glowColor = 'blue', size = 'md', width, height, customSize = false, as: Tag = 'div' }: GlowCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const frame = useRef<number | null>(null);
  const canTrack = useMediaQuery('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');

  useEffect(() => {
    if (!canTrack) cardRef.current?.removeAttribute('data-spotlight-active');
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [canTrack]);

  const trackPointer = (event: PointerEvent<HTMLElement>) => {
    if (!canTrack || event.pointerType === 'touch') return;
    const { clientX, clientY } = event;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const card = cardRef.current;
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${clientX - bounds.left}px`);
      card.style.setProperty('--spot-y', `${clientY - bounds.top}px`);
      card.setAttribute('data-spotlight-active', '');
    });
  };

  const clearPointer = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    cardRef.current?.removeAttribute('data-spotlight-active');
  };

  const style: CSSProperties = { width, height };

  return <Tag
    ref={(node: HTMLElement | null) => { cardRef.current = node; }}
    data-glow
    data-glow-color={glowColor}
    className={cn('spotlight-card', !customSize && sizes[size], className)}
    style={style}
    onPointerEnter={trackPointer}
    onPointerMove={trackPointer}
    onPointerLeave={clearPointer}
    onPointerCancel={clearPointer}
  >{children}</Tag>;
}
