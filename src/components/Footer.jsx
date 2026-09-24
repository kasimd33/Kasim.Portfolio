import { ArrowUp } from 'lucide-react';
import { portfolio } from '../data/portfolio';
import { SocialLinks } from './Shared';
export default function Footer() {
  return <footer className="footer"><div className="footer-top"><a href="#home" className="wordmark">{portfolio.name}<span>.</span></a><span>{portfolio.title}</span><SocialLinks /></div><div className="footer-bottom"><p>© {new Date().getFullYear()} {portfolio.name}. All rights reserved.</p><a href="#home">Back to top <ArrowUp size={14} /></a></div></footer>;
}
