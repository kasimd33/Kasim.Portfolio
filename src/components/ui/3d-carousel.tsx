"use client";

import { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { playSound } from '@/lib/sounds';
import { cn } from '@/lib/utils';
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import type { AnimationPlaybackControls, PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play, X } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export type TechCard = {
  name: string;
  category: string;
  description: string;
  column: number;
  row: number;
};
type CarouselProps = { cards: TechCard[]; image: string };
const wrap = (value: number, length: number) => ((value % length) + length) % length;

const Artwork = memo(function Artwork({ card, image }: { card: TechCard; image: string }) {
  return <div className="tech-art" aria-hidden="true" style={{ backgroundImage: `url("${image}")`, backgroundPosition: `${card.column * 100 / 3}% ${card.row * 100}%` }} />;
});

// Adapted from the supplied cylinder carousel: one rotation motion value,
// incremental pan deltas, snapped navigation, and an accessible native dialog.
export function ThreeDPhotoCarousel({ cards, image }: CarouselProps) {
  const compact = useMediaQuery('(max-width: 767px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const rotation = useMotionValue(0);
  const step = useRef(0);
  const playback = useRef<AnimationPlaybackControls | null>(null);
  const suppressClickUntil = useRef(0);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<TechCard | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const carousel = useRef<HTMLDivElement>(null);
  const visible = useInView(carousel, { amount: 0.25 });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const count = cards.length;
  const autoPlaying = count > 1 && visible && pageVisible && !reducedMotion && !hovered && !focused && !dragging && !paused && !selected;
  const angle = 360 / Math.max(count, 1);
  const width = compact ? 218 : 286;
  const radius = width / (2 * Math.tan(Math.PI / Math.max(count, 3))) + 22;
  const transform = useTransform(rotation, value => `translateZ(-${radius}px) rotateY(${value}deg)`);

  useEffect(() => () => playback.current?.stop(), []);
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    if (!autoPlaying) return;
    playback.current?.stop();
    const spin = animate(rotation, rotation.get() - 360, {
      duration: 60,
      ease: 'linear',
      repeat: Infinity,
      onUpdate: value => {
        const next = Math.round(-value / angle);
        if (next !== step.current) {
          step.current = next;
          setIndex(wrap(next, count));
        }
      },
    });
    return () => spin.stop();
  }, [autoPlaying, rotation, angle, count]);
  useEffect(() => {
    if (!selected) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, [selected]);

  if (!count) return null;
  const move = (next: number) => {
    playSound('step');
    playback.current?.stop();
    step.current = next;
    setIndex(wrap(next, count));
    if (reducedMotion) rotation.set(-next * angle);
    else playback.current = animate(rotation, -next * angle, { type: 'spring', stiffness: 110, damping: 24, mass: 0.8 });
  };
  const pan = (_event: PointerEvent, info: PanInfo) => {
    if (selected || reducedMotion) return;
    playback.current?.stop();
    suppressClickUntil.current = _event.timeStamp + 350;
    rotation.set(rotation.get() + info.delta.x * 0.24);
  };
  const endPan = (_event: PointerEvent, info: PanInfo) => {
    if (selected || reducedMotion) return;
    setDragging(false);
    const momentum = Math.abs(info.velocity.x) > 350 ? -Math.sign(info.velocity.x) : 0;
    move(Math.round(-rotation.get() / angle) + momentum);
  };
  const choose = (cardIndex: number, eventTime: number) => {
    if (eventTime < suppressClickUntil.current) return;
    if (cardIndex === index) { playSound('open'); setSelected(cards[cardIndex]); return; }
    const delta = wrap(cardIndex - index + count / 2, count) - count / 2;
    move(step.current + delta);
  };
  const close = () => { playSound('close'); dialog.current?.close(); setSelected(null); };
  const renderCard = (card: TechCard, cardIndex: number, flat = false) => {
    const distance = Math.min(wrap(cardIndex - index, count), wrap(index - cardIndex, count));
    return <div key={card.name} className={cn('tech-face', cardIndex === index && 'tech-face-active')} style={flat ? undefined : { width, transform: `rotateY(${cardIndex * angle}deg) translateZ(${radius}px)` }} aria-hidden={!flat && distance > 1}>
      <button data-sound="silent" className="tech-card" tabIndex={cardIndex === index ? 0 : -1} disabled={!flat && distance > 1} onClick={event => choose(cardIndex, event.timeStamp)} aria-label={`Explore ${card.name}`}>
        <Artwork card={card} image={image} />
        <span className="tech-card-meta"><span><span className="tech-card-category">{card.category}</span><span className="tech-card-name">{card.name}</span></span><ArrowUpRight size={18} aria-hidden="true" /></span>
      </button>
    </div>;
  };

  return <>
    <div ref={carousel} className="tech-carousel" onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }} onPointerLeave={() => setHovered(false)} onPointerCancel={() => setDragging(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }} role="region" aria-roledescription="carousel" aria-label="Featured technologies" tabIndex={0} onKeyDown={event => {
      if (selected) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); move(step.current + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(step.current - 1); }
      if (event.key === 'Home') { event.preventDefault(); move(0); }
      if (event.key === 'End') { event.preventDefault(); move(count - 1); }
    }}>
      <div className={`tech-stage ${reducedMotion ? 'tech-stage-flat' : ''}`}>
        {reducedMotion ? renderCard(cards[index], index, true) : <motion.div className="tech-cylinder" style={{ width, transform }} onPanStart={() => setDragging(true)} onPan={pan} onPanEnd={endPan}>{cards.map((card, cardIndex) => renderCard(card, cardIndex))}</motion.div>}
      </div>
      <div className="tech-controls">
        <p className="tech-drag-hint">{reducedMotion ? 'EXPLORE THE STACK' : 'DRAG TO EXPLORE'}<span>Click a card for details</span></p>
        <div className="tech-paging">{!reducedMotion && <button type="button" className="tech-autoplay-toggle" aria-label={paused ? 'Resume automatic rotation' : 'Pause automatic rotation'} onClick={() => { setPaused(!paused); if (paused) setFocused(false); }}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>}<button type="button" data-sound="silent" aria-label="Previous technology" onClick={() => move(step.current - 1)}><ArrowLeft size={18} /></button><p role="status" aria-live={autoPlaying ? "off" : "polite"} aria-atomic="true"><span className="sr-only">{cards[index].name}, technology </span>{String(index + 1).padStart(2, '0')}<span className="muted"> / {String(count).padStart(2, '0')}</span></p><button type="button" data-sound="silent" aria-label="Next technology" onClick={() => move(step.current + 1)}><ArrowRight size={18} /></button></div>
      </div>
    </div>
    {selected && createPortal(<dialog ref={dialog} className="project-dialog tech-dialog" aria-labelledby="tech-dialog-title" onCancel={close} onClick={event => { if (event.target === dialog.current) { const bounds = dialog.current.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close(); } }}>
      <button type="button" data-sound="silent" className="dialog-close" aria-label="Close technology details" onClick={close} autoFocus><X /></button>
      <Artwork card={selected} image={image} /><p className="eyebrow">{selected.category}</p><h2 id="tech-dialog-title">{selected.name}</h2><p>{selected.description}</p><p className="tech-art-credit">AI-generated technology artwork</p>
    </dialog>, document.body)}
  </>;
}



