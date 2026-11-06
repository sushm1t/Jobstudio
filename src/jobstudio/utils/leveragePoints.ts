// Derives negotiation leverage points from the user's own Master Profile text,
// so the negotiation form never starts with someone else's achievements.
const clean = (line: string) =>
  line.replace(/^[\s>*•\-–\d.)]+/, '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();

const shorten = (s: string, max = 110) => (s.length > max ? `${s.slice(0, max).replace(/[\s,;:]+\S*$/, '')}…` : s);

export function deriveLeveragePoints(profileText: string, max = 3): string {
  if (!profileText || /No resume uploaded yet/i.test(profileText)) return '';
  const isContactLine = (l: string) =>
    /^(#|email|phone|mobile|tel|linkedin|location|address|contact|candidate|portfolio|website|github)\b/i.test(l) ||
    /@|linkedin\.com|https?:\/\/|www\.|\+\d[\d\s-]{6,}/i.test(l);
  const lines = profileText.split('\n').map(clean).filter((l) => l.length > 25 && !isContactLine(l));
  const quantified = lines.filter((l) => /\d/.test(l) && /(%|\b\d+[+x]?\b)/.test(l) && !/^\d{4}\b/.test(l));
  const certs = lines.filter((l) => /(certif|licen[cs]e|award)/i.test(l));
  const picks: string[] = [];
  for (const l of [...quantified.slice(0, 2), ...certs.slice(0, 1), ...quantified.slice(2), ...lines]) {
    if (picks.length >= max) break;
    if (!picks.includes(l)) picks.push(l);
  }
  return picks.map((p) => shorten(p)).join('; ');
}
