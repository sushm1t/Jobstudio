// Scores fetched job listings against the user's Master Profile text using keyword overlap.
const STOP = new Set(
  'a an and the of to in for on with at by from or as is are be was were this that it its your our you we they their i my me us will can using use used via per into over across within role team work job jobs company experience years year new more all any other such also including based level strong ability skills skill etc'.split(' ')
);

const tokenize = (text: string): string[] =>
  (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s/-]/g, ' ')
    .split(/[\s/,-]+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ''))
    .filter((t) => t.length > 1 && !STOP.has(t) && !/^\d+$/.test(t));

export const buildProfileTerms = (profileText: string): Set<string> => new Set(tokenize(profileText));

export interface MatchableJob {
  title: string;
  department?: string;
  skills?: string[];
  descriptionSnippet?: string;
  rawDescription?: string;
}

// Engineering roles need evidence of engineering background, not shared business vocabulary.
const hasEngineeringBackground = (terms: Set<string>): boolean => {
  if (['engineer', 'engineering', 'developer', 'programmer'].some(term => terms.has(term))) return true;
  const technicalSkills = ['python', 'javascript', 'typescript', 'java', 'c++', 'pytorch', 'tensorflow', 'react', 'kubernetes', 'solidworks', 'autocad'];
  return technicalSkills.filter(term => terms.has(term)).length >= 2;
};

export const MIN_DESCRIPTION_FOR_CONFIDENT_FIT = 400;

/** Returns a quick 0-85 estimate; requirements weigh more than title overlap. */
export const scoreJobAgainstProfile = (job: MatchableJob, profileTerms: Set<string>): number => {
  if (profileTerms.size === 0) return 0;
  if (/\b(engineer|engineering|developer|programmer)\b/i.test(job.title) && !hasEngineeringBackground(profileTerms)) return 0;
  const titleTerms = [...new Set(tokenize(job.title))];
  if (titleTerms.length === 0) return 0;
  const titleHits = titleTerms.filter((t) => profileTerms.has(t)).length;
  const titleRatio = titleHits / titleTerms.length;

  // Use the posting's most repeated terms (plus listed skills) so long full descriptions
  // are judged on their key requirements instead of every word they contain.
  const counts = new Map<string, number>();
  for (const t of tokenize(`${job.department || ''} ${job.rawDescription || job.descriptionSnippet || ''}`)) {
    counts.set(t, (counts.get(t) || 0) + 1);
  }
  const keyTerms = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40).map(([t]) => t);
  const extra = [...new Set([...tokenize((job.skills || []).join(' ')), ...keyTerms])];
  const extraRatio = extra.length ? extra.filter((t) => profileTerms.has(t)).length / extra.length : titleRatio;

  // Requirements weigh more than the title, and a quick keyword estimate is capped at 85
  // so it never looks like a near-perfect match before the full AI check runs.
  const score = Math.round(Math.min(0.85, titleRatio * 0.35 + extraRatio * 0.65) * 100);
  // Without a real job description there is too little evidence for "Strong" or "Good" fit:
  // a matching title alone often hides requirements the full check later finds missing.
  const descLength = (job.rawDescription || job.descriptionSnippet || '').trim().length;
  return descLength < MIN_DESCRIPTION_FOR_CONFIDENT_FIT ? Math.min(score, 45) : score;
};

export const PROFILE_MATCH_THRESHOLD = 40;

export type QuickFitTier = { label: string; tone: 'strong' | 'good' | 'possible' | 'low' };

/** Word-only label for a quick estimate; numeric scores appear only after the full assessment. */
export const quickFitTier = (score: number): QuickFitTier => {
  if (score >= 65) return { label: 'Strong fit', tone: 'strong' };
  if (score >= 52) return { label: 'Good fit', tone: 'good' };
  if (score >= PROFILE_MATCH_THRESHOLD) return { label: 'Possible fit', tone: 'possible' };
  return { label: 'Low fit', tone: 'low' };
};
