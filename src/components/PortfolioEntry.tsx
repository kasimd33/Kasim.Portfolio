import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Loader from '@/components/ui/3d-box-loader-animation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { initializeMusic } from '@/lib/background-music';
import { portfolio } from '@/data/portfolio';

const Portfolio = lazy(() => import('@/App.jsx'));

class PortfolioBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="portfolio-intro intro-error"><h1 className="intro-brand">{portfolio.name}<span>.</span></h1><p role="alert">The portfolio could not load. Please try again.</p><button className="button button-primary" onClick={() => window.location.reload()}>Reload portfolio</button></div>;
    return this.props.children;
  }
}

// This commits only after the portfolio's Suspense boundary is ready.
function ReadySignal({ onReady }: { onReady: () => void }) {
  useEffect(() => { onReady(); }, [onReady]);
  return null;
}

function IntroGate({ onReady }: { onReady?: () => void }) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'ready'>('loading');
  const [elapsed, setElapsed] = useState(reducedMotion);
  const [appReady, setAppReady] = useState(false);
  const skipped = useRef(false);
  const markReady = useCallback(() => setAppReady(true), []);

  useEffect(() => {
    const timer = window.setTimeout(() => setElapsed(true), reducedMotion ? 0 : 3000);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);
  useEffect(() => {
    if (!appReady || !elapsed) return;
    if (reducedMotion) { setPhase('ready'); return; }
    setPhase('leaving');
    const timer = window.setTimeout(() => setPhase('ready'), 250);
    return () => window.clearTimeout(timer);
  }, [appReady, elapsed, reducedMotion]);
  useEffect(() => {
    if (phase === 'ready') return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; };
  }, [phase]);
  useEffect(() => {
    if (phase !== 'ready') return;
    const anchor = window.location.hash.slice(1);
    const destination = anchor ? document.getElementById(anchor) : null;
    if (anchor === 'home') window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    destination?.scrollIntoView({ behavior: 'instant', block: 'start' });
    if (skipped.current) {
      const main = document.getElementById('main');
      main?.setAttribute('tabindex', '-1');
      main?.focus({ preventScroll: true });
    }
    onReady?.();
  }, [phase, onReady]);

  return <>
    <div inert={phase !== 'ready'} aria-hidden={phase !== 'ready'} style={{ visibility: phase === 'loading' ? 'hidden' : 'visible' }}>
      <Suspense fallback={null}><Portfolio introComplete={phase !== 'loading'} /><ReadySignal onReady={markReady} /></Suspense>
    </div>
    {phase !== 'ready' && <div className={`portfolio-intro ${phase === 'leaving' ? 'portfolio-intro-leaving' : ''}`}>
      <p className="intro-brand">{portfolio.name}<span>.</span></p>
      <div className="intro-art"><Loader /></div>
      <p className="intro-caption" role="status">{elapsed && !appReady ? 'Opening portfolio…' : 'Loading portfolio…'}</p>
      <button type="button" className="intro-skip" onClick={() => { skipped.current = true; setElapsed(true); }}>Skip intro</button>
    </div>}
  </>;
}

export default function PortfolioEntry({ onReady }: { onReady?: () => void }) {
  useEffect(() => initializeMusic(), []);
  return <PortfolioBoundary><IntroGate onReady={onReady} /></PortfolioBoundary>;
}
