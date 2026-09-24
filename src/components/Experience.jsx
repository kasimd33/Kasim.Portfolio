import { portfolio } from '../data/portfolio';
import { SectionLabel } from './Shared';
export default function Experience() {
  const entries = portfolio.experience.filter(entry => entry.verified);
  return <section id="experience" className="section split-section" aria-labelledby="experience-heading"><div><SectionLabel number="04">EXPERIENCE</SectionLabel><h2 id="experience-heading" className="reveal">Always building.<br /><span className="muted">Always learning.</span></h2></div><div className="timeline reveal">{entries.length ? entries.map(entry => <article className="timeline-item" key={`${entry.organization}-${entry.role}`}><p className="eyebrow">{entry.period || 'TRAINING & DEVELOPMENT'}</p><h3>{entry.role}</h3><p className="timeline-company">{entry.organization}</p><p>{entry.summary}</p></article>) : <article className="timeline-item"><p className="eyebrow">THE NEXT CHAPTER</p><h3>Early-career software developer</h3><p>Building a foundation in Java, full-stack development, databases, and practical problem solving through application development.</p><p className="availability-note">Training and experience details will be added soon.</p></article>}</div></section>;
}
