import { useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App({ introComplete = true }) {
  const root = useRef(null);
  useEffect(() => {
    if (!introComplete) return;
    const media = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    let cleanup;
    let generation = 0;
    const update = async () => {
      const current = ++generation;
      cleanup?.();
      cleanup = undefined;
      if (!media.matches) return;
      try {
        const { animatePortfolio } = await import('./lib/animations');
        if (current === generation && media.matches) cleanup = animatePortfolio(root.current);
      } catch {
        // Content remains visible if the optional animation chunk cannot load.
      }
    };
    update();
    media.addEventListener('change', update);
    return () => { generation++; cleanup?.(); media.removeEventListener('change', update); };
  }, [introComplete]);
  return <div ref={root}><a href="#main" className="skip-link">Skip to content</a><Navbar /><main id="main"><Hero /><Skills /><About /><Projects /><Experience /><Certifications /><Contact /></main><Footer /><Analytics /></div>;
}

