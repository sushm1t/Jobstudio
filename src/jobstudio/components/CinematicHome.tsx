// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ArrowRight, Search, MapPin, Sparkles, CheckCircle2, XCircle, FileText, MessageSquare,
  Briefcase, Zap, ShieldCheck, ChevronDown, Target, Globe, Clock,
} from 'lucide-react';

/**
 * Cinematic landing story shown above the existing home content.
 * Everything here is ILLUSTRATIVE sample data (clearly labelled) — it never
 * reads or writes user data. CTAs only call the existing onNavigateToTab.
 */

gsap.registerPlugin(ScrollTrigger);

const JOBS = [
  { t: 'Senior Operations Analyst', c: 'Stripe', l: 'Dublin · Hybrid', s: 92 },
  { t: 'Real-Time Ops Lead', c: 'Revolut', l: 'London · Remote', s: 88 },
  { t: 'Support Analytics Manager', c: 'Linear', l: 'Remote · EU', s: 74 },
  { t: 'Workforce Planning Analyst', c: 'Notion', l: 'Amsterdam', s: 61 },
  { t: 'Trust & Safety Specialist', c: 'Figma', l: 'Remote', s: 55 },
];
const MATCH = ['SQL', 'Queue Mgmt', 'Incident Response', 'Looker', 'SLA Ownership'];
const MISS = ['Python', 'dbt'];
const POSTED = ['2h ago', '5h ago', '1d ago', '2d ago'];
const QUESTIONS = [
  { k: 'Behavioural', q: 'Tell me about a time you handled an outage under pressure.' },
  { k: 'Technical', q: 'How would you design a real-time queue health dashboard?' },
  { k: 'Behavioural', q: 'Describe a conflict with engineering and how you resolved it.' },
  { k: 'Role-specific', q: 'Which SLA metrics would you prioritise in your first 30 days?' },
];

function SampleTag() {
  return <span className="cine-sample">Sample data · illustrative</span>;
}

function Window({ title, children, className = '' }) {
  return (
    <div className={`cine-window ${className}`}>
      <div className="cine-window-bar">
        <span className="cine-dot" /><span className="cine-dot" /><span className="cine-dot" />
        <span className="ml-3 text-[11px] font-mono text-subtle truncate">{title}</span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function SceneCopy({ idx, eyebrow, title, steps, cta, onCta }) {
  return (
    <div className="cine-copy">
      <div className="cine-eyebrow"><span className="font-mono">0{idx}</span> {eyebrow}</div>
      <h2 className="cine-h2">{title}</h2>
      <ol className="mt-8 space-y-4">
        {steps.map((s, i) => (
          <li key={i} className="cine-step" data-step={i}>
            <span className="cine-step-bar"><span className="cine-step-fill" /></span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <button onClick={onCta} className="cine-link mt-9">{cta} <ArrowRight className="w-4 h-4" /></button>
    </div>
  );
}

export const CinematicHome: React.FC<{ onNavigateToTab: (t: string) => void }> = ({ onNavigateToTab }) => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { el.classList.add('cine-static'); return; }

    const lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // ---------- Hero entrance ----------
      const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
      intro
        .from('.cine-hero-word', { yPercent: 110, opacity: 0, duration: 1.3, stagger: 0.06 })
        .from('.cine-hero-sub, .cine-hero-ctas', { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, '-=0.9')
        .from('.cine-hero-stage', { y: 80, opacity: 0, scale: 0.94, duration: 1.6 }, '-=0.9')
        .from('.cine-float', { y: 40, opacity: 0, duration: 1, stagger: 0.12 }, '-=1.1')
        .from('.cine-hero-row', { x: -16, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.8');

      // typing search
      const q = el.querySelector('.cine-typed');
      if (q) {
        const full = q.getAttribute('data-text');
        const o = { n: 0 };
        gsap.to(o, { n: full.length, duration: 1.6, delay: 1.1, ease: 'none', onUpdate: () => { q.textContent = full.slice(0, Math.round(o.n)); } });
      }

      // hero parallax out
      gsap.to('.cine-hero-stage', { yPercent: -12, scale: 1.04, ease: 'none', scrollTrigger: { trigger: '.cine-hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.cine-hero-copy', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.cine-hero', start: 'top top', end: '60% top', scrub: true } });
      gsap.to('.cine-planet', { yPercent: 25, ease: 'none', scrollTrigger: { trigger: '.cine-hero', start: 'top top', end: 'bottom top', scrub: true } });

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const pinStart = (trigger) => () => trigger.getBoundingClientRect().height > window.innerHeight ? 'bottom bottom' : 'top top';
        const scene = (sel, build, len = 2200) => {
          const trigger = el.querySelector(sel);
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, scrollTrigger: { trigger, start: pinStart(trigger), end: () => `+=${Math.min(len, Math.max(900, window.innerHeight * 2.5))}`, scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true } });
          const steps = gsap.utils.toArray(`${sel} .cine-step`);
          build(tl, steps);
          return tl;
        };
        const lightStep = (tl, steps, i, at) => {
          tl.to(steps[i], { opacity: 1, duration: 0.3 }, at).fromTo(steps[i].querySelector('.cine-step-fill'), { scaleX: 0 }, { scaleX: 1, duration: 1 }, at);
        };

        gsap.set(['.cine-s2 .cine-ring', '.cine-s4 .cine-prog-ring'], { strokeDashoffset: 100 });
        el.querySelector('.cine-s2 .cine-count').textContent = '0';
        el.querySelector('.cine-s4 .cine-prog').textContent = '0%';

        // Scene 1 — discover
        scene('.cine-s1', (tl, st) => {
          lightStep(tl, st, 0, 0);
          tl.from('.cine-s1 .cine-chip', { y: 20, opacity: 0, stagger: 0.15, duration: 0.6 }, 0);
          lightStep(tl, st, 1, 1);
          tl.from('.cine-s1 .cine-job', { y: 40, opacity: 0, stagger: 0.25, duration: 0.7 }, 1);
          lightStep(tl, st, 2, 2.4);
          tl.to('.cine-s1 .cine-job.is-top', { borderColor: 'var(--brand)', backgroundColor: 'oklch(0.8 0.11 240 / 10%)', duration: 0.6 }, 2.4)
            .to('.cine-s1 .cine-job:not(.is-top)', { opacity: 0.35, duration: 0.6 }, 2.4);
          lightStep(tl, st, 3, 3.2);
          tl.from('.cine-s1 .cine-bar-fill', { scaleX: 0, stagger: 0.1, duration: 0.8 }, 3.2)
            .from('.cine-s1 .cine-score', { opacity: 0, x: 10, stagger: 0.1, duration: 0.5 }, 3.4);
        });

        // Scene 2 — matching
        scene('.cine-s2', (tl, st) => {
          lightStep(tl, st, 0, 0);
          tl.from('.cine-s2 .cine-resume-line', { opacity: 0, x: -20, stagger: 0.1, duration: 0.5 }, 0);
          lightStep(tl, st, 1, 0.9);
          tl.from('.cine-s2 .cine-req', { opacity: 0, x: 20, stagger: 0.1, duration: 0.5 }, 0.9);
          lightStep(tl, st, 2, 1.8);
          tl.to('.cine-s2 .cine-req.is-match', { backgroundColor: 'oklch(0.78 0.16 155 / 14%)', borderColor: 'var(--success)', color: 'var(--success)', stagger: 0.12, duration: 0.4 }, 1.8)
            .from('.cine-s2 .cine-req.is-match .cine-ic', { scale: 0, stagger: 0.12, duration: 0.4 }, 1.8);
          lightStep(tl, st, 3, 2.6);
          tl.to('.cine-s2 .cine-req.is-miss', { backgroundColor: 'oklch(0.7 0.19 22 / 14%)', borderColor: 'var(--danger)', color: 'var(--danger)', duration: 0.4, stagger: 0.15 }, 2.6)
            .from('.cine-s2 .cine-req.is-miss .cine-ic', { scale: 0, duration: 0.4 }, 2.6);
          lightStep(tl, st, 4, 3.2);
          const n = el.querySelector('.cine-s2 .cine-count'); const o = { v: 0 };
          tl.to('.cine-s2 .cine-ring', { strokeDashoffset: 100 - 82, duration: 1.2, ease: 'power3.out' }, 3.2)
            .to(o, { v: 82, duration: 1.2, ease: 'power3.out', onUpdate: () => { if (n) n.textContent = String(Math.round(o.v)); } }, 3.2)
            .from('.cine-s2 .cine-verdict', { opacity: 0, y: 12, duration: 0.5 }, 3.9);
        });

        // Scene 3 — resume transformation
        scene('.cine-s3', (tl, st) => {
          lightStep(tl, st, 0, 0);
          tl.from('.cine-s3 .cine-doc', { opacity: 0, y: 40, rotate: -2, duration: 0.8 }, 0);
          lightStep(tl, st, 1, 0.9);
          tl.to('.cine-s3 .cine-scan', { top: '100%', duration: 1.2, ease: 'none' }, 0.9)
            .from('.cine-s3 .cine-kw', { opacity: 0, scale: 0.8, stagger: 0.1, duration: 0.4 }, 1.2);
          lightStep(tl, st, 2, 2.1);
          tl.from('.cine-s3 .cine-tip', { opacity: 0, x: 30, stagger: 0.15, duration: 0.5 }, 2.1);
          lightStep(tl, st, 3, 2.9);
          tl.to('.cine-s3 .cine-old', { opacity: 0, y: -8, stagger: 0.1, duration: 0.4 }, 2.9)
            .fromTo('.cine-s3 .cine-new', { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, 3.0)
            .to('.cine-s3 .cine-ats-fill', { scaleX: 0.96, duration: 1, ease: 'power3.out' }, 3.0)
            .from('.cine-s3 .cine-ats-badge', { opacity: 0, scale: 0.8, duration: 0.4 }, 3.7);
        });

        // Scene 4 — interview prep
        scene('.cine-s4', (tl, st) => {
          lightStep(tl, st, 0, 0);
          tl.from('.cine-s4 .cine-q', { opacity: 0, y: 50, rotateX: -25, stagger: 0.2, duration: 0.7, transformOrigin: 'top center' }, 0);
          lightStep(tl, st, 1, 1.2);
          tl.from('.cine-s4 .cine-tag', { opacity: 0, scale: 0.6, stagger: 0.1, duration: 0.4 }, 1.2);
          lightStep(tl, st, 2, 1.9);
          tl.from('.cine-s4 .cine-star-fill', { scaleX: 0, stagger: 0.18, duration: 0.6 }, 1.9);
          lightStep(tl, st, 3, 2.8);
          const n = el.querySelector('.cine-s4 .cine-prog'); const o = { v: 0 };
          tl.to('.cine-s4 .cine-prog-ring', { strokeDashoffset: 100 - 75, duration: 1, ease: 'power3.out' }, 2.8)
            .to(o, { v: 75, duration: 1, onUpdate: () => { if (n) n.textContent = `${Math.round(o.v)}%`; } }, 2.8);
        });

        // Tracking — kanban cards slide across with scroll
        gsap.timeline({ scrollTrigger: { trigger: '.cine-track', start: pinStart(el.querySelector('.cine-track')), end: () => `+=${Math.min(1400, Math.max(700, window.innerHeight * 2))}`, scrub: 0.8, pin: true, invalidateOnRefresh: true } })
          .from('.cine-col', { opacity: 0, y: 40, stagger: 0.15, duration: 0.6 })
          .to('.cine-move-a', { x: () => { const cols = el.querySelectorAll('.cine-col'); return cols[1].getBoundingClientRect().left - cols[0].getBoundingClientRect().left; }, duration: 1 }, '+=0.2')
          .to('.cine-move-b', { x: () => { const cols = el.querySelectorAll('.cine-col'); return cols[2].getBoundingClientRect().left - cols[0].getBoundingClientRect().left; }, duration: 1.2 }, '<0.2')
          .to('.cine-move-b', { borderColor: 'var(--success)', duration: 0.3 });
      });

      // Section headline reveals (all sizes)
      gsap.utils.toArray('.cine-reveal').forEach((h) => {
        gsap.from(h, { opacity: 0, y: 60, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
      });
    }, el);

    // subtle pointer parallax on hero layers
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      gsap.to('.cine-float', { x: x * 18, y: y * 14, duration: 1.2, ease: 'power3.out', overwrite: 'auto' });
    };
    window.addEventListener('pointermove', onMove);

    return () => {
      window.removeEventListener('pointermove', onMove);
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  const headline = ['Your', 'next', 'role,', 'found', 'and', 'scored', 'by', 'AI.'];

  return (
    <div ref={root} className="cine">
      {/* ================= HERO ================= */}
      <section className="cine-hero">
        <div className="cine-planet" aria-hidden />
        <div className="cine-hero-copy relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="cine-eyebrow justify-center mb-6"><Sparkles className="w-3.5 h-3.5" /> AI career studio</div>
          <h1 className="cine-h1">
            {headline.map((w, i) => (
              <React.Fragment key={i}><span className="cine-mask"><span className={`cine-hero-word ${w === 'AI.' ? 'cine-grad' : ''}`}>{w}</span></span>{' '}</React.Fragment>
            ))}
          </h1>
          <p className="cine-hero-sub mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Job Studio searches live job boards, scores every role against your real experience, rewrites your resume for each one and gets you ready for the interview.
          </p>
          <div className="cine-hero-ctas mt-9 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => onNavigateToTab('auth')} className="cine-btn-primary">Start searching jobs <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Product composition */}
        <div className="cine-hero-stage relative z-10 mt-16 sm:mt-20 max-w-5xl mx-auto px-4">
          <Window title="jobstudio.app / evaluator">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
              <Search className="w-4 h-4 text-subtle" />
              <span className="text-sm text-foreground"><span className="cine-typed" data-text="Operations analyst · fintech · remote EU" /><span className="cine-caret" /></span>
              <span className="ml-auto hidden sm:inline text-[11px] font-mono text-subtle">Greenhouse · Lever · Ashby</span>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">
              <div className="space-y-2">
                {JOBS.slice(0, 4).map((j, i) => (
                  <div key={i} className={`cine-hero-row flex items-center gap-3 rounded-xl border px-3.5 py-3 ${i === 0 ? 'border-brand/40 bg-brand/10' : 'border-border bg-surface/60'}`}>
                    <div className="w-8 h-8 rounded-lg bg-surface-2 grid place-items-center text-xs font-semibold">{j.c[0]}</div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{j.t}</div>
                      <div className="text-[11px] text-subtle">{j.c} · {j.l}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      {i === 0 && <span className="text-[10px] font-medium text-success border border-success/30 rounded-full px-2 py-0.5">New</span>}
                      <span className="hidden sm:inline text-[11px] font-mono text-subtle">{POSTED[i]}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden md:flex flex-col justify-center gap-4 rounded-xl border border-border bg-surface/60 p-4">
                <div>
                  <div className="text-2xl font-semibold">5 ATS</div>
                  <div className="text-[11px] uppercase tracking-widest text-subtle">Platforms searched</div>
                </div>
                <div className="h-px w-full bg-border" />
                <div>
                  <div className="text-2xl font-semibold">Live</div>
                  <div className="text-[11px] uppercase tracking-widest text-subtle">Fetched when you search</div>
                </div>
              </div>
            </div>
          </Window>
          <div className="cine-float cine-float-a hidden sm:flex"><Globe className="w-4 h-4 text-brand" /> Live from company job boards</div>
          <div className="cine-float cine-float-b hidden sm:flex"><Clock className="w-4 h-4 text-brand" /> Fetched live on each search</div>
          <div className="mt-4 text-center"><SampleTag /></div>
        </div>
        <a href="#cine-story" className="cine-scroll-hint" aria-label="Scroll to story"><ChevronDown className="w-4 h-4" /></a>
      </section>

      <div id="cine-story" className="cine-intro cine-reveal">
        <p className="cine-kicker">From search to signed offer</p>
        <h2 className="cine-display">One workspace. Four moves.<br /><span className="text-subtle">Watch it work.</span></h2>
      </div>

      {/* ================= SCENE 1 ================= */}
      <section className="cine-scene cine-s1">
        <SceneCopy idx={1} eyebrow="Discover" title="Every live role, read for you."
          steps={['Set what you want', 'Live jobs from company boards', 'The right ones rise to the top', 'Every role gets a match score']}
          cta="Open the Job Evaluator" onCta={() => onNavigateToTab('evaluator')} />
        <Window title="Live job search" className="cine-stage">
          <div className="flex flex-wrap gap-2">
            {[[Briefcase, 'Operations Analyst'], [MapPin, 'Remote · EU'], [Zap, 'Fintech'], [Target, 'Mid–Senior']].map(([I, t], i) => (
              <span key={i} className="cine-chip"><I className="w-3.5 h-3.5" />{t}</span>
            ))}
          </div>
          <div className="mt-5 space-y-2.5">
            {JOBS.map((j, i) => (
              <div key={i} className={`cine-job ${i < 2 ? 'is-top' : ''}`}>
                <div className="w-9 h-9 rounded-lg bg-surface-2 grid place-items-center text-xs font-semibold">{j.c[0]}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{j.t}</div>
                  <div className="text-[11px] text-subtle">{j.c} · {j.l}</div>
                </div>
                <div className="w-24 hidden sm:block"><div className="cine-bar"><div className="cine-bar-fill" style={{ width: `${j.s}%` }} /></div></div>
                <div className={`cine-score w-10 text-right text-xs font-mono ${j.s > 80 ? 'text-success' : 'text-muted-foreground'}`}>{j.s}%</div>
              </div>
            ))}
          </div>
          <div className="mt-4"><SampleTag /></div>
        </Window>
      </section>

      {/* ================= SCENE 2 ================= */}
      <section className="cine-scene cine-s2">
        <SceneCopy idx={2} eyebrow="Match" title="Know if it's worth applying before you apply."
          steps={['Reads your real experience', 'Pulls out what the job needs', 'Shows the skills you have', 'Flags what you are missing', 'Gives a clear match score']}
          cta="Score a job now" onCta={() => onNavigateToTab('evaluator')} />
        <Window title="Match analysis · Stripe · Senior Ops Analyst" className="cine-stage">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_150px] gap-4 items-start">
            <div>
              <div className="cine-label">Your resume</div>
              {['6 yrs real-time operations', 'SQL investigations at scale', 'Led incident bridges', 'Looker & Metabase dashboards', 'Owned SLA for 1,000+ agents'].map((t, i) => (
                <div key={i} className="cine-resume-line">{t}</div>
              ))}
            </div>
            <div>
              <div className="cine-label">Job needs</div>
              <div className="flex flex-wrap gap-2">
                {MATCH.map((m) => <span key={m} className="cine-req is-match"><CheckCircle2 className="cine-ic w-3.5 h-3.5" />{m}</span>)}
                {MISS.map((m) => <span key={m} className="cine-req is-miss"><XCircle className="cine-ic w-3.5 h-3.5" />{m}</span>)}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" pathLength="100" className="cine-ring-bg" />
                  <circle cx="18" cy="18" r="15.9" pathLength="100" className="cine-ring-fg cine-ring" strokeDasharray="100" strokeDashoffset="18" />
                </svg>
                <div className="absolute inset-0 grid place-items-center text-3xl font-semibold"><span className="cine-count">82</span></div>
              </div>
              <div className="cine-verdict mt-3 text-xs text-success font-medium">Apply · close 2 gaps</div>
            </div>
          </div>
          <div className="mt-5"><SampleTag /></div>
        </Window>
      </section>

      {/* ================= SCENE 3 ================= */}
      <section className="cine-scene cine-s3">
        <SceneCopy idx={3} eyebrow="Tailor" title="Your resume, rewritten for this exact job."
          steps={['Starts from your real resume', 'Reads the job description', 'Suggests honest improvements', 'Builds a one-page resume ready for ATS checks']}
          cta="Tailor my resume" onCta={() => onNavigateToTab('resume')} />
        <div className="cine-stage grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-4">
          <div className="cine-doc paper relative overflow-hidden">
            <div className="cine-scan" aria-hidden />
            <div className="text-[13px] font-bold tracking-wide">SUSHMIT SURENDRAN</div>
            <div className="text-[10px] opacity-60 mb-3">Operations · Real-time analytics</div>
            <div className="text-[10px] font-semibold tracking-widest opacity-70 mb-1.5">EXPERIENCE</div>
            {[
              ['Monitored queues for the support team.', 'Balanced 300+ live queues across EEA/UK, holding 98.4% SLA for 1,000+ agents.'],
              ['Wrote some SQL reports.', 'Built SQL investigations that removed repeat transfer loops, cutting handle time 18%.'],
              ['Helped during outages.', 'Led incident bridges during platform outages, restoring service with zero missed SLAs.'],
            ].map(([o, n], i) => (
              <div key={i} className="relative min-h-[34px] text-[11px] leading-snug mb-1.5 pl-3">
                <span className="absolute left-0 top-1.5 w-1 h-1 rounded-full bg-current opacity-60" />
                <span className="cine-old absolute inset-0 pl-3">{o}</span>
                <span className="cine-new block opacity-0">{n}</span>
              </div>
            ))}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['SLA', 'SQL', 'Incident', 'Queue'].map((k) => <span key={k} className="cine-kw">{k}</span>)}
            </div>
          </div>
          <div className="space-y-3">
            <div className="cine-window p-4">
              <div className="cine-label">ATS check</div>
              <div className="cine-bar h-2"><div className="cine-ats-fill" /></div>
              <div className="cine-ats-badge mt-3 inline-flex items-center gap-1.5 text-xs text-success"><ShieldCheck className="w-3.5 h-3.5" /> 96 / 100 · 1 page</div>
            </div>
            {['Add numbers to your results', 'Use the job’s wording: “SLA”', 'Put incident leadership first'].map((t, i) => (
              <div key={i} className="cine-tip"><Sparkles className="w-3.5 h-3.5 text-brand shrink-0" />{t}</div>
            ))}
            <SampleTag />
          </div>
        </div>
      </section>

      {/* ================= SCENE 4 ================= */}
      <section className="cine-scene cine-s4">
        <SceneCopy idx={4} eyebrow="Prepare" title="Walk in already knowing the questions."
          steps={['Questions written for this role', 'Behavioural and technical, sorted', 'Answers laid out in STAR format', 'Track how ready you are']}
          cta="Practise interviews" onCta={() => onNavigateToTab('screening')} />
        <Window title="Interview prep · Stripe" className="cine-stage">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4">
            <div className="space-y-2.5 [perspective:800px]">
              {QUESTIONS.map((q, i) => (
                <div key={i} className="cine-q">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`cine-tag ${q.k === 'Technical' ? 'text-info border-info/30' : q.k === 'Role-specific' ? 'text-warning border-warning/30' : 'text-brand border-brand/30'}`}>{q.k}</span>
                    <MessageSquare className="w-3.5 h-3.5 text-subtle ml-auto" />
                  </div>
                  <div className="text-sm">{q.q}</div>
                  {i === 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-1.5">
                      {['Situation', 'Task', 'Action', 'Result'].map((s) => (
                        <div key={s}><div className="cine-bar h-1"><div className="cine-star-fill" /></div><div className="mt-1 text-[10px] text-subtle">{s}</div></div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface/60 p-4">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" pathLength="100" className="cine-ring-bg" />
                  <circle cx="18" cy="18" r="15.9" pathLength="100" className="cine-ring-fg cine-prog-ring" strokeDasharray="100" strokeDashoffset="25" />
                </svg>
                <div className="absolute inset-0 grid place-items-center text-lg font-semibold"><span className="cine-prog">75%</span></div>
              </div>
              <div className="mt-2 text-[11px] uppercase tracking-widest text-subtle">Ready</div>
            </div>
          </div>
          <div className="mt-4"><SampleTag /></div>
        </Window>
      </section>

      {/* ================= TRACKING ================= */}
      <section className="cine-track">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="cine-eyebrow justify-center"><span className="font-mono">05</span> Track</div>
          <h2 className="cine-h2 mt-3">Every application, always in view.</h2>
          <p className="mt-4 text-muted-foreground">See which resume went where, and move each job from applied to offer.</p>
        </div>
        <div className="cine-window mt-12 max-w-5xl mx-auto p-4 sm:p-5">
          <div className="relative grid grid-cols-3 gap-4">
            {['Applied', 'Interviewing', 'Offer'].map((c, ci) => (
              <div key={c} className="cine-col">
                <div className="flex items-center justify-between mb-3"><span className="text-xs uppercase tracking-widest text-subtle">{c}</span><span className="text-[11px] font-mono text-subtle">{[3, 1, 0][ci]}</span></div>
                <div className="space-y-2 min-h-[150px]">
                  {ci === 0 && (<>
                    <div className="cine-kcard cine-move-b"><FileText className="w-3.5 h-3.5 text-brand" /> Stripe · Ops Analyst</div>
                    <div className="cine-kcard cine-move-a"><FileText className="w-3.5 h-3.5 text-brand" /> Revolut · Ops Lead</div>
                    <div className="cine-kcard"><FileText className="w-3.5 h-3.5 text-subtle" /> Linear · Support Mgr</div>
                  </>)}
                  {ci === 1 && <div className="cine-kcard"><FileText className="w-3.5 h-3.5 text-subtle" /> Notion · WFM Analyst</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4"><SampleTag /></div>
        </div>
        <div className="mt-10 text-center"><button onClick={() => onNavigateToTab('applied')} className="cine-link">Open my applications <ArrowRight className="w-4 h-4" /></button></div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="cine-final cine-reveal">
        <h2 className="cine-display">Stop sending generic resumes.<br /><span className="cine-grad">Start getting interview-ready.</span></h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button onClick={() => onNavigateToTab('auth')} className="cine-btn-primary">Start searching jobs <ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>
    </div>
  );
};
