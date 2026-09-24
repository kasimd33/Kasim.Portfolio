import { useRef, useState } from 'react';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import { portfolio } from '../data/portfolio';
import { SectionLabel, SocialLinks, ExternalLink } from './Shared';
import WhatsAppIcon from './WhatsAppIcon';
import { playSound } from '../lib/sounds';
import { validateContact, buildMailto, buildGmailCompose } from '../lib/contact';
import '../styles/contact-options.css';

export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const form = useRef(null);
  const submit = event => {
    event.preventDefault();
    const next = validateContact(values);
    setErrors(next);
    setStatus('');
    if (Object.keys(next).length) { playSound('notice'); form.current.elements[Object.keys(next)[0]].focus(); return; }
    playSound('confirm');
    if (event.nativeEvent.submitter?.value === 'gmail') {
      window.open(buildGmailCompose(portfolio.links.email, values), '_blank', 'noopener,noreferrer');
      setStatus('Gmail was requested in a new tab. Review the draft and send it from your signed-in account.');
    } else {
      window.location.href = buildMailto(portfolio.links.email, values);
      setStatus('Your email app was requested. Review and send the draft there. If it did not open, use Open in Gmail below.');
    }
  };
  return <section id="contact" className="section section-contact" aria-labelledby="contact-heading">
    <SectionLabel number="06">CONTACT</SectionLabel>
    <div className="contact-grid">
      <div className="reveal">
        <h2 id="contact-heading">LET’S BUILD<br />SOMETHING<br /><span>TOGETHER.</span></h2>
        <p className="contact-intro">Have a project in mind or a role to discuss?<br />Email, call, or message me directly.</p>
        <div className="contact-options" aria-label="Contact Kasim">
          <a className="contact-option" href={`mailto:${portfolio.links.email}`}><Mail size={22} aria-hidden="true" /><span><span className="contact-option-label">EMAIL ME</span><span className="contact-option-value">{portfolio.links.email}</span></span><ArrowUpRight size={17} aria-hidden="true" /></a>
          <a className="contact-option" href={`tel:${portfolio.links.phone}`}><Phone size={22} aria-hidden="true" /><span><span className="contact-option-label">CALL ME</span><span className="contact-option-value">{portfolio.phoneDisplay}</span></span><ArrowUpRight size={17} aria-hidden="true" /></a>
          <ExternalLink className="contact-option contact-whatsapp" href={portfolio.links.whatsapp}><WhatsAppIcon /><span><span className="contact-option-label">WHATSAPP</span><span className="contact-option-value">Chat with me</span></span><ArrowUpRight size={17} aria-hidden="true" /></ExternalLink>
        </div>
        <SocialLinks />
      </div>
      <form ref={form} className="contact-form reveal" onSubmit={submit} noValidate>
        <p className="eyebrow">WRITE ME AN EMAIL <Mail size={16} aria-hidden="true" /></p>
        <p className="contact-recipient">To: <a href={`mailto:${portfolio.links.email}`}>{portfolio.links.email}</a></p>
        {[['name', 'Your name', 'text'], ['email', 'Your email address', 'email'], ['message', 'What do you have in mind?', 'textarea']].map(([key, label, type]) => <div className="field" key={key}>
          <label htmlFor={key}>{label}</label>
          {type === 'textarea' ? <textarea id={key} name={key} rows={4} maxLength={1800} required value={values[key]} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${key}-error` : undefined} onChange={event => setValues({ ...values, [key]: event.target.value })} /> : <input id={key} name={key} type={type} autoComplete={key} maxLength={key === 'name' ? 100 : 254} required value={values[key]} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${key}-error` : undefined} onChange={event => setValues({ ...values, [key]: event.target.value })} />}
          {errors[key] && <p className="field-error" id={`${key}-error`}>{errors[key]}</p>}
        </div>)}
        <button className="button button-primary" data-sound="silent" type="submit" value="email">Open email draft <ArrowUpRight size={17} /></button>
        <button className="button button-outline contact-gmail" data-sound="silent" type="submit" value="gmail">Open in Gmail <ArrowUpRight size={17} /></button>
        <p className="form-note">Your message opens as a draft addressed to me. Send it from your own email account after reviewing it.</p>
        <p className="form-status" role="status">{status}</p>
      </form>
    </div>
  </section>;
}
