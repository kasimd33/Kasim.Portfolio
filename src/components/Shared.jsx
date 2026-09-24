import { ArrowUpRight, Code2, BriefcaseBusiness, Mail } from 'lucide-react';
import { portfolio } from '../data/portfolio';

export function ExternalLink({ href, children, className = '', ...props }) {
  if (!href) return null;
  return <a href={href} className={className} target={/^https?:/.test(href) ? '_blank' : undefined} rel="noopener noreferrer" {...props}>{children}</a>;
}

export function SocialLinks({ icons = false }) {
  const items = [['github', 'GitHub', Code2], ['linkedin', 'LinkedIn', BriefcaseBusiness], ['email', 'Email', Mail]];
  return <div className="social-links">{items.map(([key, label, Icon]) => {
    const value = portfolio.links[key];
    const content = <>{icons && <Icon size={15} />}<span>{label}</span>{!icons && <ArrowUpRight size={13} />}</>;
    return value ? <ExternalLink key={key} href={key === 'email' ? `mailto:${value}` : value}>{content}</ExternalLink> : <span key={key} className="unavailable" title={`${label} will be added soon`}>{content}<span className="sr-only"> — not yet available</span></span>;
  })}</div>;
}

export function SectionLabel({ number, children }) {
  return <div className="section-label"><span>{number}</span><span className="section-slash">/</span>{children}</div>;
}

