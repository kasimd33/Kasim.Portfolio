import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function animatePortfolio(root) {
  const context = gsap.context(() => {
    gsap.from('.hero-reveal', { y: 22, opacity: 0, stagger: 0.1, duration: 0.85, ease: 'power3.out', clearProps: 'all' });
    gsap.utils.toArray('.reveal, .section-label').forEach(element => gsap.from(element, { y: 22, opacity: 0, duration: 0.7, ease: 'power2.out', clearProps: 'all', scrollTrigger: { trigger: element, start: 'top 94%', once: true } }));
  }, root);
  return () => context.revert();
}
