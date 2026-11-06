export interface TourStep {
  tab: string;
  title: string;
  what: string;
  where: string;
  tip: string;
  target?: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    tab: 'profile', title: 'Master Profile', target: 'profile-upload',
    what: 'Your single source of truth. Every resume, cover letter, answer and match uses it.',
    where: 'Upload your resume PDF in the Hero AI Fast-Track to auto-fill in seconds, or use the guided 4-step builder, then click "Save & Activate Master Profile".',
    tip: 'Start here. Everything else gets better once your profile is saved.',
  },
  {
    tab: 'evaluator', title: 'Job Evaluator', target: 'evaluator-tailor',
    what: 'Search live roles from supported job boards, filtered to the ones that fit your profile.',
    where: 'Search or browse roles, click "+ Save & Assess" on a role, then click "Tailor Application" to generate your Unified Role Dossier.',
    tip: 'Paste any job link or description if the role is not in the list.',
  },
  {
    tab: 'resume', title: 'Tailored Documents',
    what: 'Review the version tailored to the selected job, matching cover letter, and internal referral request.',
    where: 'Review and edit your tailored resume, matching cover letter, and referral outreach messages inline, then export as ATS PDF or DOCX.',
    tip: 'Only facts from your saved profile are used. Nothing is invented.',
  },
  {
    tab: 'screening', title: 'Interview Prep',
    what: 'Draft application-form answers, practise STAR stories, prepare salary negotiation and company practice packs.',
    where: 'Use Stage 1 for immediate screening question answers and company focus guidance. Expand "Round 2 & Offer Prep" for STAR behavioral coaching and salary battlecards.',
    tip: 'Practice questions are generated for your role; official company guidance is linked separately.',
  },
  {
    tab: 'applied', title: 'Applied Jobs',
    what: 'A kanban board of every application, with saved resume versions and a full history.',
    where: 'Drag cards between stages. Open a card to inspect the tailored resume snapshot you sent and update status notes.',
    tip: 'Click "Track Application" directly from the job evaluator or add manually here.',
  },
  {
    tab: 'roadmaps', title: 'Career Roadmaps',
    what: 'Step-by-step paths for 2026 careers, each stage with skills, milestones, and curated free learning resources.',
    where: 'Browse curated 2026 career tracks by domain or take the 2-minute career quiz to discover your top matches.',
    tip: 'Explore milestone curriculum guides and free learning resources to bridge skill gaps directly into your profile.',
  },
];
