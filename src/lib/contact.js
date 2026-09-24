export function validateContact(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (values.message.trim().length < 10) errors.message = 'Please write a message of at least 10 characters.';
  return errors;
}
export function buildMailto(recipient, values) {
  return `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(`Portfolio enquiry from ${values.name.trim()}`)}&body=${encodeURIComponent(`Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`)}`;
}

export function buildGmailCompose(recipient, values) {
  const draft = new URL(buildMailto(recipient, values));
  const query = new URLSearchParams({ view: 'cm', fs: '1', to: recipient, su: draft.searchParams.get('subject'), body: draft.searchParams.get('body') });
  return `https://mail.google.com/mail/?${query}`;
}
