import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Code2, PanelsTopLeft, Server, Database, Wrench } from 'lucide-react';
import { portfolio } from '../data/portfolio';
import { SectionLabel } from './Shared';
const ThreeDPhotoCarousel = lazy(() => import('./ui/3d-carousel').then(module => ({ default: module.ThreeDPhotoCarousel })));
const icons = [Code2, PanelsTopLeft, Server, Database, Wrench];

export default function Skills() {
  const section = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect(); }
    }, { rootMargin: '250px' });
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  const fallback = <div className="tech-carousel-placeholder" role="status">Loading the stack...</div>;
  return <section ref={section} id="stack" className="section section-stack" aria-labelledby="stack-heading">
    <SectionLabel number="01">THE TECH STACK</SectionLabel>
    <div className="section-heading reveal"><h2 id="stack-heading">The tools behind<br /><span className="muted">the work.</span></h2><p>Full-stack foundations. AI-powered possibilities.<br />Explore the technologies I build with.</p></div>
    {ready ? <Suspense fallback={fallback}><ThreeDPhotoCarousel cards={portfolio.featuredStack} image={portfolio.stackArtwork} /></Suspense> : fallback}
    <div className="stack-grid">{portfolio.stack.map((group, index) => { const Icon = icons[index]; return <div className="stack-group reveal" key={group.category}><Icon size={23} strokeWidth={1.3} /><h3>{group.category}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></div>; })}</div>
  </section>;
}
