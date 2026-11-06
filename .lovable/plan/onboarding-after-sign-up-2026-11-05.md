# Onboarding after sign-up

## What users will see
1. **Welcome screen** (full page, right after a new account is created)
   - Greeting with their name, one-line explanation: "Job Studio saves you time on searching, tailoring and preparing — here's how it works."
   - A short 4-step visual path: Build profile -> Find & assess jobs -> Tailor materials -> Prepare & track.
   - Two buttons: "Take the 2-minute tour" and "Skip, start with my profile".

2. **Guided tour** (6 steps, inside the real workspace)
   - Each step opens the actual screen, highlights the right sidebar item and the main button, and shows a small card: what it does, where to click, a tip.
   - Steps:
     1. Master Profile — upload a PDF resume or use the builder, then "Save & Activate Master Profile". Everything else uses this.
     2. Job Evaluator — "Fetch live roles" filters jobs to your profile; "Add opportunity" saves one; "Tailor Application" runs the full assessment.
     3. Resume & Cover Letter — review the tailored version, edit, export PDF/DOCX.
     4. ATS & Interview — application answers, STAR practice, salary negotiation, company practice packs.
     5. Applied Jobs — kanban board, drag between stages, saved resume versions and history.
     6. Career Roadmaps — explore paths and free learning resources.
   - Controls: Back, Next, step counter (2 of 6), Skip tour. Works on phone (card docks to bottom).
   - Final card: "You're set" with a "Build my profile" button.

3. **Getting-started checklist** (small panel in the workspace until finished or dismissed)
   - Save your Master Profile, Fetch live roles, Tailor one application, Track an application.
   - Each item ticks automatically when done; clicking an item opens that screen.

4. **Replay anytime**: "Take the tour" link in the sidebar (and mobile menu).

## Behaviour
- Shown once per account, only for new sign-ups (email or Google). Existing users see only the "Take the tour" link.
- Progress (seen tour, checklist dismissed) is saved per account, so it carries across devices.
- Copy describes what tools do; no job-outcome promises. Matches the current workspace look; landing page untouched.

## Technical details
- New `src/jobstudio/components/onboarding/`: `WelcomeScreen.tsx`, `ProductTour.tsx` (highlight via `data-tour` attributes on existing nav items/buttons, positioned card, no new library), `GettingStartedChecklist.tsx`.
- New `onboarding` tab in `App.tsx`; after sign-up (AuthView sign-up path + Google first-sign-in where no `jobstudio_onboarding` key exists) route there instead of Job Evaluator.
- State stored in a `jobstudio_onboarding_<user>` key so `cloudSync.ts` mirrors it to the account automatically.
- Checklist reads existing signals: saved master profile, fetched roles, completed assessment, applied jobs count.
- Add `data-tour` attributes only (no logic changes) to WorkspaceNavigation, ProfileBuilderView, JobEvaluatorView, ResumeDocument, ScreeningAnswersView, AppliedJobsView, CareerRoadmapsView.
- Tests: new user is routed to onboarding once; skipping marks it complete; checklist ticks from saved profile.
