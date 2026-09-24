import { useEffect, useRef, useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { portfolio } from '../data/portfolio';
import { SectionLabel, ExternalLink } from './Shared';
import { playSound } from '../lib/sounds';
import { getProjectSource } from '../lib/project-links';
import ProjectCard from './ProjectCard';
import '../styles/project-details.css';

export default function Projects() {
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  useEffect(() => {
    if (!selected) return;
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.scrollTop = 0;
    dialog.current.showModal();
    return () => { document.body.style.overflow = previousOverflow; previous?.focus(); };
  }, [selected]);
  const close = () => { playSound('close'); dialog.current?.close(); setSelected(null); };
  const source = selected ? getProjectSource(selected, portfolio.links.github) : null;
  return <section id="projects" className="section" aria-labelledby="projects-heading">
    <SectionLabel number="03">SELECTED WORK</SectionLabel>
    <div className="section-heading reveal"><h2 id="projects-heading">Ideas into<br /><span className="muted">working software.</span></h2><p>A selection of projects across<br />full-stack development and applied AI.</p></div>
    <div className="projects-grid">{portfolio.projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onSelect={setSelected} />)}</div>
    <dialog ref={dialog} className="project-dialog project-details" aria-labelledby="project-dialog-title" onCancel={close} onClick={event => {
      if (event.target === dialog.current) {
        const bounds = dialog.current.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
      }
    }}>
      {selected && <>
        <button type="button" data-sound="silent" className="dialog-close" aria-label="Close project details" onClick={close} autoFocus><X /></button>
        <p className="eyebrow">{selected.category}</p>
        <h2 id="project-dialog-title">{selected.name}</h2>
        <p className="dialog-subtitle">{selected.title}</p>
        <div className="project-links project-detail-actions">
          <ExternalLink className="button button-primary" href={source.href}>{source.label} <ArrowUpRight size={16} /></ExternalLink>
          <ExternalLink className="button button-outline" href={selected.demo}>Live demo <ArrowUpRight size={16} /></ExternalLink>
        </div>
        {source.kind === 'profile' && <p className="availability-note">A direct repository link is not available for this project. Explore my GitHub profile instead.</p>}
        {source.kind === 'github' && <p className="availability-note">Project repository and profile links have not been added yet. This link opens GitHub.</p>}
        <figure className="project-detail-visual">
          <img src={selected.image} alt={selected.imageAlt} width="900" height="600" decoding="async" />
          <figcaption>Project concept diagram</figcaption>
        </figure>
        <h3>Project overview</h3>
        <p>{selected.overview || selected.description}</p>
        <div className="project-detail-columns">
          <section aria-labelledby="project-features-heading"><h3 id="project-features-heading">Key features</h3><ul className="feature-list">{selected.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>
          <section aria-labelledby="project-stack-heading"><h3 id="project-stack-heading">Technology stack</h3><ul className="tech-list">{selected.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul></section>
        </div>
      </>}
    </dialog>
  </section>;
}
