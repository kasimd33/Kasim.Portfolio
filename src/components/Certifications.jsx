import { ArrowUpRight } from 'lucide-react';
import { portfolio } from '../data/portfolio';
import { ExternalLink, SectionLabel } from './Shared';
export default function Certifications() {
  const entries = portfolio.certifications.filter(entry => entry.verified);
  return <section id="recognition" className="section recognition" aria-labelledby="recognition-heading"><SectionLabel number="05">RECOGNITION</SectionLabel><div className="recognition-layout"><h2 id="recognition-heading" className="reveal">Learning that<br /><span className="muted">moves me forward.</span></h2><div className="recognition-rows reveal">{entries.length ? entries.map(entry => <article className="recognition-row" key={entry.title}><div><h3>{entry.title}</h3><p>{[entry.issuer, entry.date].filter(Boolean).join(' · ')}</p></div><ExternalLink href={entry.url} aria-label={`View ${entry.title} credential`}><ArrowUpRight size={21} /></ExternalLink></article>) : <p className="recognition-empty">Verified certifications and achievements will appear here as details become available.</p>}</div></div></section>;
}
