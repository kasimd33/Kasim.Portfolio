import { ArrowUpRight } from 'lucide-react';
import { portfolio } from '../data/portfolio';
import { getProjectSource } from '../lib/project-links';
import { ExternalLink } from './Shared';
import { GlowCard } from './ui/spotlight-card';

export default function ProjectCard({ project, index, onSelect }) {
  const source = getProjectSource(project, portfolio.links.github);
  return <GlowCard as="article" customSize glowColor="orange" className={`project-card reveal ${index === 4 ? 'project-wide' : ''}`}>
    <button className="project-image" data-sound="open" onClick={() => onSelect(project)} aria-label={`View details for ${project.name}`}><img src={project.image} alt={project.imageAlt} width="900" height="600" loading="lazy" decoding="async" /><span className="project-open"><ArrowUpRight size={22} /></span><span className="visual-label">CONCEPT DIAGRAM</span></button>
    <div className="project-meta"><span>0{index + 1} / {project.category}</span><span>SELECTED WORK</span></div>
    <div className="project-title-row"><h3><button data-sound="open" onClick={() => onSelect(project)}>{project.name}</button></h3><ArrowUpRight size={24} aria-hidden="true" /></div>
    <p className="project-description">{project.description}</p>
    <ul className="tech-list" aria-label="Technologies">{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>
    <div className="project-links"><button className="text-link" data-sound="open" onClick={() => onSelect(project)}>View details <ArrowUpRight size={14} /></button><ExternalLink href={source.href}>{source.label} <ArrowUpRight size={14} /></ExternalLink><ExternalLink href={project.demo}>Live demo <ArrowUpRight size={14} /></ExternalLink></div>
  </GlowCard>;
}
