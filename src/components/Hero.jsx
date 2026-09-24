import { useState } from 'react';
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import { portfolio } from '../data/portfolio';
import { SocialLinks } from './Shared';
import HeroPortrait from './HeroPortrait';

export default function Hero() {
  const [resumeNotice, setResumeNotice] = useState(false);
  return <section id="home" className="hero" aria-labelledby="hero-heading">
    <div className="hero-kicker hero-reveal"><span className="tiny-square" />FULL-STACK DEVELOPER <span className="kicker-divider">/</span> JAVA & AI</div>
    <div className="hero-layout">
      <div className="hero-copy">
        <p className="hero-name hero-reveal">{portfolio.name}<span>.</span></p>
        <h1 id="hero-heading" className="hero-title hero-reveal">SOFTWARE<br /><span>DEVELOPER</span></h1>
        <p className="hero-description hero-reveal">{portfolio.hero}</p>
        <div className="hero-actions hero-reveal">
          <a className="button button-primary" href="#projects">View projects <ArrowUpRight size={17} /></a>
          {portfolio.resumeAvailable ? <a className="button button-text" href={portfolio.links.resume} download>Download resume <Download size={16} /></a> : <button className="button button-text" onClick={() => setResumeNotice(!resumeNotice)} aria-expanded={resumeNotice} aria-controls="resume-notice">Download resume <Download size={16} /></button>}
        </div>
        {resumeNotice && <p id="resume-notice" role="status" className="resume-notice">The resume will be available here soon.</p>}
        <div className="hero-reveal"><SocialLinks icons /></div>
      </div>
      <HeroPortrait />
    </div>
    <div className="hero-bottom"><a href="#stack"><ArrowDown size={15} /> Scroll to explore</a><span>CODE WITH INTENTION. BUILD WITH PURPOSE.</span><span className="hero-index">PORTFOLIO — 01</span></div>
  </section>;
}

