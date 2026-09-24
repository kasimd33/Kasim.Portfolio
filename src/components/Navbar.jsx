import { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import MusicControl from './MusicControl';
import SoundControl from './SoundControl';
import { portfolio } from '../data/portfolio';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const nav = useRef(null);
  const toggle = useRef(null);
  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 24); if (window.scrollY < 80) setActive(''); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-20% 0px -55% 0px' });
    portfolio.navigation.forEach(({ id }) => { const section = document.getElementById(id); if (section) observer.observe(section); });
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect(); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = event => { if (!nav.current?.contains(event.target)) setOpen(false); };
    const escape = event => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    const wide = window.matchMedia('(min-width: 769px)');
    const resize = () => { if (wide.matches) setOpen(false); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    wide.addEventListener('change', resize);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); wide.removeEventListener('change', resize); };
  }, [open]);
  return <header ref={nav} className={`navbar ${scrolled || open ? 'navbar-solid' : ''}`}>
    <a className="wordmark" href="#home" aria-label="Kasim — home" onClick={() => setOpen(false)}>{portfolio.name}<span>.</span></a>
    <button ref={toggle} className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <nav id="primary-navigation" aria-label="Main navigation" className={open ? 'nav-links nav-open' : 'nav-links'}>
      {portfolio.navigation.map(({ id, label }) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setOpen(false)}>{label}{id === 'contact' && <ArrowUpRight size={14} />}</a>)}
    </nav>
    <div className="audio-controls"><MusicControl /><SoundControl /></div>
  </header>;
}

