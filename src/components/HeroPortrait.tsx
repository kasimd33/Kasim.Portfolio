import { useEffect, useId, useRef, type PointerEvent } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import '@/styles/hero-portrait.css';

export default function HeroPortrait() {
  const neonId = useId();
  const portrait = useRef<HTMLElement | null>(null);
  const frame = useRef<number | null>(null);
  const canTilt = useMediaQuery('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  useEffect(() => {
    if (!canTilt) {
      portrait.current?.style.removeProperty('--portrait-x');
      portrait.current?.style.removeProperty('--portrait-y');
    }
    return () => { if (frame.current !== null) cancelAnimationFrame(frame.current); };
  }, [canTilt]);
  const move = (event: PointerEvent<HTMLElement>) => {
    if (!canTilt || event.pointerType === 'touch') return;
    const { clientX, clientY } = event;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const element = portrait.current;
      if (!element) return;
      const bounds = element.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (clientX - bounds.left) / bounds.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (clientY - bounds.top) / bounds.height * 2 - 1));
      element.style.setProperty('--portrait-x', `${-y * 4}deg`);
      element.style.setProperty('--portrait-y', `${x * 6}deg`);
    });
  };
  const reset = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    portrait.current?.style.removeProperty('--portrait-x');
    portrait.current?.style.removeProperty('--portrait-y');
  };
  return <figure ref={portrait} className="hero-portrait" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
    <div className="portrait-depth">
      <svg className="portrait-neon" viewBox="0 0 960 1280" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
        <defs>
          <filter id={neonId} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
            <feMorphology in="SourceAlpha" operator="dilate" radius="8" result="innerOuter" />
            <feMorphology in="SourceAlpha" operator="dilate" radius="5" result="innerEdge" />
            <feComposite in="innerOuter" in2="innerEdge" operator="out" result="innerLine" />
            <feFlood floodColor="#e5b766" />
            <feComposite in2="innerLine" operator="in" result="goldLine" />
            <feMorphology in="SourceAlpha" operator="dilate" radius="23" result="outerEdge" />
            <feMorphology in="SourceAlpha" operator="dilate" radius="21" result="outerInner" />
            <feComposite in="outerEdge" in2="outerInner" operator="out" result="outerLine" />
            <feFlood floodColor="#e5b766" floodOpacity="0.3" />
            <feComposite in2="outerLine" operator="in" result="outerGoldLine" />
            <feMerge result="lines"><feMergeNode in="goldLine" /><feMergeNode in="outerGoldLine" /></feMerge>
            <feGaussianBlur in="lines" stdDeviation="5" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="lines" /></feMerge>
          </filter>
        </defs>
        <image href="/images/portrait/kasim-cutout.webp" width="960" height="1280" filter={'url(#' + neonId + ')'} />
      </svg>

      <img className="portrait-cutout" src="/images/portrait/kasim-cutout.webp" width="960" height="1280" alt="Kasim in a dark patterned kurta, adjusting his wristwatch" fetchPriority="high" decoding="async" draggable={false} />
    </div>
  </figure>;
}
