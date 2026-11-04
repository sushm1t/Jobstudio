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

/** Returns 0-100. Title words weigh most, then skills, department and description. */
export const scoreJobAgainstProfile = (job: MatchableJob, profileTerms: Set<string>): number => {
  if (profileTerms.size === 0) return 0;
  const titleTerms = [...new Set(tokenize(job.title))];
  if (titleTerms.length === 0) return 0;
  const titleHits = titleTerms.filter((t) => profileTerms.has(t)).length;
  const titleRatio = titleHits / titleTerms.length;

  const extra = [...new Set(tokenize(`${(job.skills || []).join(' ')} ${job.department || ''} ${job.rawDescription || job.descriptionSnippet || ''}`))];
  const extraRatio = extra.length ? extra.filter((t) => profileTerms.has(t)).length / extra.length : titleRatio;

  // Requirements weigh more than the title, and a quick keyword estimate is capped at 85
  // so it never looks like a near-perfect match before the full AI check runs.
  return Math.round(Math.min(0.85, titleRatio * 0.35 + extraRatio * 0.65) * 100);
};

export const PROFILE_MATCH_THRESHOLD = 40;
