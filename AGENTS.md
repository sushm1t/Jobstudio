<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The imported Job Studio app lives in `src/jobstudio/` and renders client-only from `/`; its original Express endpoints run from `src/server/jobstudio-api.ts` via the catch-all `src/routes/api/$.ts` — keeps the source's `/api/*` contract unchanged.
- The cinematic landing story lives in `src/jobstudio/components/CinematicHome.tsx` (GSAP ScrollTrigger + Lenis, pinned scenes at every width, static only for reduced motion); pin tall scenes when their bottom reaches the viewport bottom so the product demonstration stays visible on small screens. It renders above HomeView and uses illustrative sample data only.
- Operational tabs use WorkspaceNavigation and a `.job-workspace`-scoped design system in styles.css; keep landing theme and document export rules outside workspace overrides so presentation changes cannot leak into either.
- The `auth` tab renders the existing AuthView separately from the landing story and remains accessible when signed out; landing search actions reset scroll on entry so visitors immediately see the form. This changes navigation only, not the imported browser-only demo login mechanism.
- Accounts use Lovable Cloud auth; per-user browser keys prefixed `jobstudio_` are mirrored to the `user_data` table by `src/jobstudio/utils/cloudSync.ts` — keeps the original localStorage-based app logic unchanged while persisting it per user.
- Job Evaluator ranks fetched roles against the Master Profile with keyword overlap in `src/jobstudio/utils/profileMatch.ts` — instant and free for hundreds of roles, unlike per-role AI calls.
