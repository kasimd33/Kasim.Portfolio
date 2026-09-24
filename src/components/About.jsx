import { ArrowUpRight } from 'lucide-react';
import { portfolio } from '../data/portfolio';
import { SectionLabel } from './Shared';

export default function About() {
  const { about } = portfolio;
  return <section id="about" className="section section-about" aria-labelledby="about-heading">
    <SectionLabel number="02">ABOUT</SectionLabel>
    <div className="about-grid"><h2 id="about-heading" className="statement reveal">{about.statement.split('\n').map(line => <span key={line}>{line}</span>)}</h2>
      <div className="about-copy reveal"><p className="intro">{about.introduction}</p><p>{about.description}</p><div className="education"><span className="eyebrow">EDUCATION <ArrowUpRight size={14} /></span><h3>{about.education}</h3><p>{[about.institution, about.graduationYear].filter(Boolean).join(' · ') || about.level}</p></div></div>
    </div>
  </section>;
}

