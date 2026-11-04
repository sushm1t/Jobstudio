// @ts-nocheck -- ported verbatim from the original project
import { useTailorProgress } from '../utils/useTailorProgress';
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Building2,
  MapPin,
  ExternalLink,
  RefreshCw,
  Search,
  Globe,
  Compass,
  Filter,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Milestone,
  Trash2,
  Zap,
  FileText,
  Link2,
  UserCheck,
} from 'lucide-react';
import {
  JobEvaluationData,
  JobOpportunity,
  PRESET_JOBS,
  ATSJobListing,
  ATSCompanyEntry,
  SeniorityFilter,
  WorkplaceFilter,
} from '../data/defaultData';
import { buildProfileTerms, scoreJobAgainstProfile, PROFILE_MATCH_THRESHOLD } from '../utils/profileMatch';

interface JobEvaluatorViewProps {
  evaluation: JobEvaluationData;
  opportunities?: JobOpportunity[];
  onAddOpportunities?: (newJobs: JobOpportunity[]) => void;
  onSelectPreset: (jobId: string, jobOverride?: any) => void;
  selectedJobId: string;
  customJobText: string;
  setCustomJobText: (val: string) => void;
  customUrl: string;
  setCustomUrl: (val: string) => void;
  onEvaluate: (jobTextOverride?: string) => void;
  isLoading: boolean;
  onProceedToResume: () => void;
  onRemoveOpportunity?: (jobId: string) => void;
  onClearOpportunities?: () => void;
  onTrackApplication?: (job: { company_name: string; job_title: string; location?: string; platform?: string; apply_url?: string; match_score?: number }) => void;
  isTracked?: boolean;
  isProUser?: boolean;
  tailoredCount?: number;
  onNavigateToPricing?: () => void;
  onOpenRecruiterReview?: () => void;
  masterProfileText?: string;
}

export const JobEvaluatorView: React.FC<JobEvaluatorViewProps> = ({
  evaluation,
  opportunities = [],
  onAddOpportunities,
  masterProfileText = '',
  onSelectPreset,
  selectedJobId,
  customJobText,
  setCustomJobText,
  customUrl,
  setCustomUrl,
  onEvaluate,
  isLoading,
  onProceedToResume,
  onRemoveOpportunity,
  onClearOpportunities,
  onTrackApplication,
  isTracked = false,
  isProUser = false,
  tailoredCount = 0,
  onNavigateToPricing,
  onOpenRecruiterReview,
}) => {
  const [activeInputMode, setActiveInputMode] = useState<'preset' | 'custom'>('preset');
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapeNotification, setScrapeNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Live opportunity verification & filtering
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [isVerifyingListing, setIsVerifyingListing] = useState<boolean>(false);
  const [verificationFeedback, setVerificationFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const platforms = [
    'All',
    'SmartRecruiters',
    'Greenhouse',
    'Lever',
    'Ashby',
    'LinkedIn',
    'UltiPro',
    'Oracle Cloud HCM',
    'Workable',
  ];

  // Direct ATS Crawler State (Zero-Scrape unauthenticated APIs) - On-demand only (no auto-refresh on mount)
  const [showAtsFeed, setShowAtsFeed] = useState<boolean>(true);
  const [atsCompanies] = useState<ATSCompanyEntry[]>([
    { name: '🌐 All Companies (Unified Live Feed)', slug: 'all', ats: 'greenhouse', category: 'Aggregated Live Feed' },
    // AI Leaders
    { name: 'Anthropic', slug: 'anthropic', ats: 'ashby', category: 'Frontier AI & LLMs' },
    { name: 'OpenAI', slug: 'openai', ats: 'ashby', category: 'Generative AI Research' },
    { name: 'Scale AI', slug: 'scaleai', ats: 'greenhouse', category: 'AI Data Infrastructure' },
    { name: 'Perplexity', slug: 'perplexity', ats: 'ashby', category: 'AI Search & Knowledge' },
    { name: 'Cohere', slug: 'cohere', ats: 'ashby', category: 'Enterprise AI Platforms' },
    { name: 'Palantir', slug: 'palantir', ats: 'lever', category: 'Enterprise AI & Data Ops' },
    // Fintech & Global Banking
    { name: 'Stripe', slug: 'stripe', ats: 'greenhouse', category: 'Fintech Infrastructure' },
    { name: 'Revolut', slug: 'revolut', ats: 'lever', category: 'Global Fintech & Digital Banking' },
    { name: 'Brex', slug: 'brex', ats: 'greenhouse', category: 'Fintech & Spend Operations' },
    { name: 'Ramp', slug: 'ramp', ats: 'ashby', category: 'Finance Automation' },
    { name: 'Plaid', slug: 'plaid', ats: 'ashby', category: 'Fintech Data Network' },
    { name: 'Coinbase', slug: 'coinbase', ats: 'greenhouse', category: 'Crypto & Financial Ops' },
    { name: 'Robinhood', slug: 'robinhood', ats: 'greenhouse', category: 'Fintech & Brokerage' },
    { name: 'Wise', slug: 'Wise', ats: 'smartrecruiters', category: 'Cross-Border Payments' },
    { name: 'Klarna', slug: 'Klarna', ats: 'smartrecruiters', category: 'Fintech & Payments' },
    { name: 'Monzo', slug: 'monzo', ats: 'greenhouse', category: 'Digital Banking' },
    // Product & Productivity
    { name: 'Figma', slug: 'figma', ats: 'greenhouse', category: 'Product & Design Systems' },
    { name: 'Linear', slug: 'linear', ats: 'ashby', category: 'Productivity & AI Tools' },
    { name: 'Notion', slug: 'notion', ats: 'ashby', category: 'Connected Workspace' },
    { name: 'Canva', slug: 'canva', ats: 'greenhouse', category: 'Creative & Visual Platform' },
    { name: 'Automattic', slug: 'automattic', ats: 'greenhouse', category: 'Distributed Remote Ops' },
    // Dev Tools & Infrastructure
    { name: 'Vercel', slug: 'vercel', ats: 'ashby', category: 'Cloud Frameworks & Edge' },
    { name: 'Supabase', slug: 'supabase', ats: 'ashby', category: 'Open Source Cloud DB' },
    { name: 'Retool', slug: 'retool', ats: 'greenhouse', category: 'Internal Systems & Ops Tools' },
    { name: 'Datadog', slug: 'datadog', ats: 'greenhouse', category: 'Cloud Observability' },
    { name: 'GitLab', slug: 'gitlab', ats: 'greenhouse', category: 'DevOps & Remote Ops' },
    { name: 'Cloudflare', slug: 'cloudflare', ats: 'greenhouse', category: 'Internet Security & CDN' },
    { name: 'Docker', slug: 'docker', ats: 'greenhouse', category: 'Containerization & Cloud' },
    { name: 'Postman', slug: 'postman', ats: 'greenhouse', category: 'API Platform' },
    { name: 'Zapier', slug: 'zapier', ats: 'lever', category: 'Workflow Automation' },
    // Global Remote & HR
    { name: 'Deel', slug: 'deel', ats: 'ashby', category: 'Global Payroll & Compliance' },
    { name: 'Remote.com', slug: 'remote', ats: 'greenhouse', category: 'Global Employment & HR' },
    { name: 'Gusto', slug: 'gusto', ats: 'greenhouse', category: 'Payroll & HR Tech' },
    { name: 'Rippling', slug: 'rippling', ats: 'greenhouse', category: 'Workforce Management' },
    // Consumer Tech & Scale
    { name: 'Airbnb', slug: 'airbnb', ats: 'greenhouse', category: 'Travel & Platform Ops' },
    { name: 'Spotify', slug: 'spotify', ats: 'lever', category: 'Audio Streaming & Tech' },
    { name: 'Reddit', slug: 'reddit', ats: 'greenhouse', category: 'Community & Media' },
    { name: 'DoorDash', slug: 'doordash', ats: 'greenhouse', category: 'Logistics & Marketplace' },
    { name: 'Uber', slug: 'uber', ats: 'greenhouse', category: 'Mobility & Operations' },
  ]);
  const [selectedAtsCompany, setSelectedAtsCompany] = useState<string>('all');
  const [atsCustomInput, setAtsCustomInput] = useState<string>('');
  const [atsKeyword, setAtsKeyword] = useState<string>('');
  const [selectedSeniority, setSelectedSeniority] = useState<SeniorityFilter>('All');
  const [selectedWorkplace, setSelectedWorkplace] = useState<WorkplaceFilter>('All');
  const [selectedAtsLocation, setSelectedAtsLocation] = useState<string>('All');
  const [isCrawlingAts, setIsCrawlingAts] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [atsJobs, setAtsJobs] = useState<ATSJobListing[]>([]);
  const [totalInCatalogue, setTotalInCatalogue] = useState<number>(7135839);
  const [atsFeedback, setAtsFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showAllRoles, setShowAllRoles] = useState<boolean>(false);
  const { progress: tailorProgress, etaLabel: tailorEta } = useTailorProgress(!!isLoading);
  const [importedAtsIds, setImportedAtsIds] = useState<Map<string, string>>(new Map());

  const handleCrawlAts = async (
    companyInputOverride?: string,
    seniorityOverride?: SeniorityFilter,
    workplaceOverride?: WorkplaceFilter,
    locationOverride?: string,
    keywordOverride?: string,
    isLoadMore: boolean = false
  ) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsCrawlingAts(true);
      setAtsFeedback(null);
    }

    const targetCompany = companyInputOverride !== undefined ? companyInputOverride : (atsCustomInput.trim() || selectedAtsCompany);
    if (companyInputOverride !== undefined) {
      setSelectedAtsCompany(companyInputOverride);
    }
    const currentSeniority = seniorityOverride || selectedSeniority;
    const currentWorkplace = workplaceOverride || selectedWorkplace;
    const currentLocation = locationOverride || selectedAtsLocation;
    const currentKeyword = keywordOverride !== undefined ? keywordOverride : atsKeyword;

    try {
      const res = await fetch('/api/ats/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: targetCompany,
          keyword: currentKeyword,
          seniority: currentSeniority,
          workplaceType: currentWorkplace,
          location: currentLocation,
          limit: 400,
          offset: isLoadMore ? atsJobs.length : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to crawl ATS board.');
      }

      if (data.totalAvailableInCatalogue) {
        setTotalInCatalogue(data.totalAvailableInCatalogue);
      }

      const incomingJobs: ATSJobListing[] = data.jobs || [];

      if (isLoadMore) {
        setAtsJobs((prev) => {
          const existingIds = new Set(prev.map((j) => j.id));
          const fresh = incomingJobs.filter((j) => !existingIds.has(j.id));
          return [...prev, ...fresh];
        });
      } else {
        setAtsJobs(incomingJobs);
      }

      const locLabel = currentLocation && currentLocation !== 'All' ? ` in ${currentLocation}` : '';
      const modeLabel = currentWorkplace && currentWorkplace !== 'All' ? ` · ${currentWorkplace}` : '';
      const totalCount = isLoadMore ? atsJobs.length + incomingJobs.length : incomingJobs.length;

      setAtsFeedback({
        type: 'success',
        message: targetCompany === 'all'
          ? `Aggregated ${totalCount} live positions${locLabel}${modeLabel} from company ATS boards & selected tech job boards.`
          : `Fetched ${incomingJobs.length} active roles for "${data.company}"${locLabel} from official ${data.ats?.toUpperCase() || 'ATS'} boards.`,
      });
    } catch (err: any) {
      console.error('ATS crawl error:', err);
      setAtsFeedback({
        type: 'error',
        message: err.message || 'Failed to query ATS board. Please check company slug or link.',
      });
    } finally {
      setIsCrawlingAts(false);
      setIsLoadingMore(false);
    }
  };

  // Instant reactive client-side filter
  const profileTerms = useMemo(() => buildProfileTerms(masterProfileText), [masterProfileText]);
  const hasProfile = profileTerms.size > 0;

  const baseFilteredAtsJobs = useMemo(() => {
    return atsJobs.filter((job) => {
      // 1. Seniority filter
      if (selectedSeniority !== 'All' && job.seniority !== selectedSeniority) {
        return false;
      }
      // 2. Workplace filter
      if (selectedWorkplace !== 'All') {
        const combined = `${job.location || ''} ${job.title || ''}`.toLowerCase();
        if (selectedWorkplace === 'Remote') {
          if (!job.isRemote && job.workplaceType !== 'Remote' && !combined.includes('remote') && !combined.includes('anywhere') && !combined.includes('wfh')) {
            return false;
          }
        } else if (selectedWorkplace === 'Hybrid') {
          if (job.workplaceType !== 'Hybrid' && !combined.includes('hybrid')) {
            return false;
          }
        } else if (selectedWorkplace === 'On-site') {
          if (job.workplaceType !== 'On-site' && (job.isRemote || combined.includes('remote'))) {
            return false;
          }
        }
      }
      // 3. Location filter
      if (selectedAtsLocation !== 'All') {
        const lq = selectedAtsLocation.toLowerCase();
        const loc = (job.location || '').toLowerCase();
        const titleLoc = (job.title || '').toLowerCase();
        const combined = `${loc} ${titleLoc}`;

        if (lq === 'remote') {
          if (!job.isRemote && job.workplaceType !== 'Remote' && !combined.includes('remote') && !combined.includes('anywhere')) {
            return false;
          }
        } else if (lq.includes('india')) {
          const isIndia =
            combined.includes('india') ||
            combined.includes('bengaluru') ||
            combined.includes('bangalore') ||
            combined.includes('hyderabad') ||
            combined.includes('mumbai') ||
            combined.includes('delhi') ||
            combined.includes('gurgaon') ||
            combined.includes('gurugram') ||
            combined.includes('noida') ||
            combined.includes('kochi') ||
            combined.includes('pune') ||
            combined.includes('chennai') ||
            combined.includes('kolkata') ||
            combined.includes('ahmedabad');
          if (!isIndia) return false;
        } else if (lq.includes('united states') || lq === 'us') {
          const isUS =
            combined.includes('united states') ||
            combined.includes('usa') ||
            combined.includes('san francisco') ||
            combined.includes('new york') ||
            combined.includes('seattle') ||
            combined.includes('austin') ||
            combined.includes('california') ||
            combined.includes('texas') ||
            combined.includes('boston') ||
            combined.includes('chicago');
          if (!isUS) return false;
        } else if (lq.includes('europe') || lq.includes('uk')) {
          const isEuUk =
            combined.includes('europe') ||
            combined.includes('london') ||
            combined.includes('uk') ||
            combined.includes('united kingdom') ||
            combined.includes('dublin') ||
            combined.includes('ireland') ||
            combined.includes('germany') ||
            combined.includes('berlin') ||
            combined.includes('france') ||
            combined.includes('paris') ||
            combined.includes('amsterdam') ||
            combined.includes('netherlands') ||
            combined.includes('poland') ||
            combined.includes('krakow') ||
            combined.includes('spain');
          if (!isEuUk) return false;
        } else {
          if (!combined.includes(lq)) return false;
        }
      }
      // 4. Keyword search
      if (atsKeyword.trim()) {
        const q = atsKeyword.toLowerCase().trim();
        const matches =
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          (job.department && job.department.toLowerCase().includes(q)) ||
          (job.descriptionSnippet && job.descriptionSnippet.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [atsJobs, selectedSeniority, selectedWorkplace, selectedAtsLocation, atsKeyword]);

  // Score every fetched role against the Master Profile; by default show only matching roles, best first.
  const scoredAtsJobs = useMemo(
    () => baseFilteredAtsJobs.map((job) => (hasProfile ? { ...job, matchScore: scoreJobAgainstProfile(job, profileTerms) } : job)),
    [baseFilteredAtsJobs, profileTerms, hasProfile]
  );
  const profileMatchedJobs = useMemo(
    () => scoredAtsJobs.filter((j) => (j.matchScore || 0) >= PROFILE_MATCH_THRESHOLD).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)),
    [scoredAtsJobs]
  );
  const filteredAtsJobs = hasProfile && !showAllRoles ? profileMatchedJobs : scoredAtsJobs;

  const uniqueCompaniesCount = useMemo(() => {
    const set = new Set<string>();
    filteredAtsJobs.forEach((j) => {
      if (j.company) set.add(j.company.toLowerCase().trim());
    });
    return set.size;
  }, [filteredAtsJobs]);

  const handleImportAtsJob = async (job: ATSJobListing, andSelect: boolean = false) => {
    try {
      const res = await fetch('/api/ats/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.opportunity) {
        throw new Error(data.error || 'Failed to import ATS job.');
      }
      if (onAddOpportunities) {
        onAddOpportunities([data.opportunity]);
      }
      setImportedAtsIds((prev) => new Map(prev).set(job.id, data.opportunity.id));
      onSelectPreset(data.opportunity.id, data.opportunity);
      if (andSelect) {
        onProceedToResume();
      } else {
        // Jump to the newly added role in "Saved & Evaluated Roles" so its actions are visible.
        const targetId = data.opportunity.id;
        let tries = 0;
        const scrollToCard = () => {
          const el = document.querySelector(`[data-saved-job-id="${CSS.escape(targetId)}"]`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          else if (tries++ < 20) setTimeout(scrollToCard, 100);
        };
        setTimeout(scrollToCard, 50);
      }
    } catch (err: any) {
      console.error('Import ATS job error:', err);
      alert('Failed to import job: ' + (err.message || 'Unknown error'));
    }
  };

  // Handle URL scraping via Firecrawl or direct fetch
  const handleScrapeUrl = async () => {
    if (!customUrl.trim()) return;
    setIsScraping(true);
    setScrapeNotification(null);

    try {
      const res = await fetch('/api/scrape-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: customUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch job content');
      }

      if (data.text) {
        setCustomJobText(data.text);
        setScrapeNotification({
          type: 'success',
          message: `Successfully extracted job description via ${data.source === 'firecrawl' ? 'Firecrawl' : 'direct web crawler'}!`,
        });
      }
    } catch (err: any) {
      setScrapeNotification({
        type: 'error',
        message: err.message || 'Could not auto-fetch page. Please copy-paste the JD below.',
      });
    } finally {
      setIsScraping(false);
    }
  };

  // Verify and confirm an active live listing from any hiring platform URL before displaying
  const handleVerifyLiveJob = async (inputUrl?: string) => {
    const targetUrl = (inputUrl || customUrl).trim();
    if (!targetUrl) return;

    setIsVerifyingListing(true);
    setVerificationFeedback(null);

    try {
      const res = await fetch('/api/verify-and-import-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();
      if (!res.ok || !data.verified) {
        throw new Error(
          data.error ||
            'Could not confirm an active live job listing at this URL. Unverified or closed listings cannot be displayed.'
        );
      }

      if (data.opportunity) {
        if (onAddOpportunities) {
          onAddOpportunities([data.opportunity]);
        }
        onSelectPreset(data.opportunity.id);
        setVerificationFeedback({
          type: 'success',
          message: `✓ Confirmed active listing: "${data.opportunity.title}" at ${data.opportunity.company} (${data.opportunity.platform}) is verified live! Calculated ${data.opportunity.matchScore}% eligibility match.`,
        });
      }
    } catch (err: any) {
      setVerificationFeedback({
        type: 'error',
        message:
          err.message ||
          'Listing verification failed. Only confirmed live job postings from active hiring portals can be added.',
      });
    } finally {
      setIsVerifyingListing(false);
    }
  };

  // Filter opportunities based on platform
  const filteredOpportunities = opportunities.filter((job) => {
    const matchesPlatform =
      selectedPlatform === 'All' ||
      job.platform?.toLowerCase() === selectedPlatform.toLowerCase();
    return matchesPlatform;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-brand';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getGapsList = (evalData: JobEvaluationData): Array<{ missing: string; where_to_work: string; severity?: string }> => {
    // 1. Explicit structured gaps if available
    if (evalData.gaps && evalData.gaps.length > 0) {
      return evalData.gaps;
    }

    // 2. Parse from missing_critical_skills
    if (evalData.missing_critical_skills && evalData.missing_critical_skills.length > 0) {
      return evalData.missing_critical_skills.map((raw) => {
        if (raw.includes('— Where to work on:')) {
          const [missingPart, workPart] = raw.split('— Where to work on:');
          return {
            missing: missingPart.replace(/^Missing:\s*/i, '').trim(),
            where_to_work: workPart.trim(),
            severity: 'CRITICAL',
          };
        }
        if (raw.includes('(mitigated by')) {
          const parts = raw.split('(mitigated by');
          return {
            missing: parts[0].trim(),
            where_to_work: `Mitigate by: ${parts[1].replace(/\)$/, '').trim()}`,
            severity: 'MODERATE',
          };
        }
        const matchedRoadmap = evalData.skill_roadmap?.find((r) =>
          r.skill.toLowerCase().includes(raw.toLowerCase().slice(0, 15)) ||
          raw.toLowerCase().includes(r.skill.toLowerCase().slice(0, 15))
        );
        if (matchedRoadmap) {
          return {
            missing: raw,
            where_to_work: matchedRoadmap.action_plan,
            severity: matchedRoadmap.importance || 'RECOMMENDED',
          };
        }
        return {
          missing: raw,
          where_to_work: 'Review core domain frameworks and highlight transferable problem-solving from Revolut & Torc Infotech experience.',
          severity: 'RECOMMENDED',
        };
      });
    }

    // 3. Fallback to skill_roadmap if missing_critical_skills is empty
    if (evalData.skill_roadmap && evalData.skill_roadmap.length > 0) {
      return evalData.skill_roadmap.slice(0, 3).map((s) => ({
        missing: s.skill,
        where_to_work: s.action_plan,
        severity: s.importance || 'RECOMMENDED',
      }));
    }

    return [];
  };

  return (
    <div className="workspace-evaluator space-y-6 max-w-5xl mx-auto">
      <div className="workspace-page-header">
        <div><h1>Job Evaluator</h1><p>Discover opportunities and evaluate how well they match your experience.</p></div>
        <span className="workspace-header-status"><span className="workspace-status-dot" />{isProUser ? 'Pro plan · Unlimited tailoring' : `${2 - Math.min(tailoredCount, 2)} of 2 tailored resumes available`}</span>
      </div>

      {/* Target Opportunities Card */}
      <div className="workspace-discovery p-6 sm:p-8 space-y-5">
        {/* Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                Target opportunities
              </h2>
              {isProUser ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/15 text-success font-mono tracking-wider">
                  ★ PRO
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-surface text-subtle font-mono">
                  FREE PLAN
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="text-sm text-subtle">
                Live roles matched against your profile with automated ATS tailoring.
              </p>
              {!isProUser && (
                <span className="text-xs text-brand font-medium inline-flex items-center gap-1 bg-brand/10 px-2 py-0.5 rounded-md">
                  <span>{2 - Math.min(tailoredCount, 2)} of 2 free tailored resumes left</span>
                  {onNavigateToPricing && (
                    <button
                      type="button"
                      onClick={onNavigateToPricing}
                      className="font-bold underline hover:text-brand cursor-pointer ml-1"
                    >
                      Upgrade ($9.99/mo)
                    </button>
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Apple Segmented Control */}
          <div className="flex items-center p-1 bg-surface rounded-xl text-[13px] font-medium self-start sm:self-auto shrink-0">
            <button
              onClick={() => setActiveInputMode('preset')}
              className={`px-4 py-2 rounded-[10px] transition-all cursor-pointer ${
                activeInputMode === 'preset'
                  ? 'bg-card text-foreground shadow-elevated font-semibold'
                  : 'text-subtle hover:text-foreground'
              }`}
            >
              Live Roles ({opportunities.length})
            </button>
            <button
              onClick={() => setActiveInputMode('custom')}
              className={`px-4 py-2 rounded-[10px] transition-all cursor-pointer ${
                activeInputMode === 'custom'
                  ? 'bg-card text-foreground shadow-elevated font-semibold'
                  : 'text-subtle hover:text-foreground'
              }`}
            >
              Custom JD / URL Import
            </button>
          </div>
        </div>

        {/* Live Opportunities Mode */}
        {activeInputMode === 'preset' ? (
          <div className="space-y-6">
            {/* ATS Direct Crawler Hub (Enterprise unauthenticated API crawling) */}
            <div className="workspace-search-section space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-semibold text-sm sm:text-base text-foreground">
                        Discover live roles
                      </h4>
                    </div>
                    <p className="text-xs text-subtle mt-0.5">
                    Search official company boards across Greenhouse, Lever, Ashby, and other ATS platforms.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full self-start sm:self-auto flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    Live job feed
                  </span>
                </div>

                {/* Curated Company Quick Select Pills */}
                <details className="workspace-company-picker" open>
                  <summary>Browse companies <span className="text-subtle">{atsCompanies.length} sources</span></summary>
                  <span className="text-[11px] font-semibold text-subtle uppercase tracking-wider">
                    Company boards
                  </span>
                  <div className="workspace-company-grid text-xs">
                    {atsCompanies.map((c) => {
                      const isSelected = selectedAtsCompany === c.slug;
                      return (
                        <button
                          key={c.slug}
                          type="button"
                          onClick={() => {
                            setSelectedAtsCompany(c.slug);
                            setAtsCustomInput(c.slug === 'all' ? '' : c.slug);
                            handleCrawlAts(c.slug);
                          }}
                          className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'bg-surface text-foreground hover:bg-surface-2'
                          }`}
                        >
                          <span>{c.name}</span>
                          <span
                            className={`text-[10px] px-1 py-0.2 rounded font-mono uppercase ${
                              isSelected ? 'bg-card/20 text-primary-foreground' : 'bg-surface text-subtle'
                            }`}
                          >
                            {c.slug === 'all' ? 'ALL' : c.slug === 'revolut' ? 'DIR' : c.ats.slice(0, 2)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </details>

                {/* Input & Search Filters Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                  <div className="sm:col-span-5 relative">
                    <Building2 className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={atsCustomInput}
                      onChange={(e) => setAtsCustomInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCrawlAts();
                        }
                      }}
                      placeholder="Company slug (e.g. 'stripe', 'linear') or ATS link..."
                      className="w-full pl-9 pr-3 py-2 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-xl text-xs text-foreground outline-none transition-all"
                    />
                  </div>

                  <div className="sm:col-span-4 relative">
                    <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={atsKeyword}
                      onChange={(e) => setAtsKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCrawlAts();
                        }
                      }}
                      placeholder="Keyword filter (e.g. Operations, Analyst, Lead)..."
                      className="w-full pl-9 pr-3 py-2 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-xl text-xs text-foreground outline-none transition-all"
                    />
                  </div>

                  <div className="sm:col-span-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCrawlAts()}
                      disabled={isCrawlingAts}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-elevated"
                    >
                      {isCrawlingAts ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Querying ATS...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Fetch Live Roles</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Refinement Filters Bar: Experience & Seniority + Workplace Mode + Location */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border text-xs">
                  <div className="flex items-center gap-1.5 text-subtle font-semibold text-[11px] uppercase tracking-wider shrink-0 mr-1">
                    <Filter className="w-3.5 h-3.5 text-brand" />
                    <span>Filter By:</span>
                  </div>

                  {/* Seniority / Experience Level Dropdown */}
                  <div className="relative shrink-0">
                    <select
                      value={selectedSeniority}
                      onChange={(e) => setSelectedSeniority(e.target.value as SeniorityFilter)}
                      className="appearance-none pl-3 pr-7 py-1.5 bg-surface hover:bg-surface-2 text-foreground font-medium rounded-xl text-xs outline-none cursor-pointer border border-transparent focus:border-brand transition-all"
                    >
                      <option value="All">All Experience Levels</option>
                      <option value="Early / Junior">🌱 Early / Junior (0-2 yrs)</option>
                      <option value="Mid-Level">⚡ Mid-Level (2-5 yrs)</option>
                      <option value="Senior">⭐ Senior (5-8 yrs)</option>
                      <option value="Lead / Staff / Director">👑 Lead / Staff / Director (8+ yrs)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-subtle">
                      <svg className="fill-current h-3 w-3" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>

                  {/* Workplace Mode (Remote / Hybrid / On-site) Dropdown */}
                  <div className="relative shrink-0">
                    <select
                      value={selectedWorkplace}
                      onChange={(e) => {
                        const newWorkplace = e.target.value as WorkplaceFilter;
                        setSelectedWorkplace(newWorkplace);
                        if (atsJobs.length > 0) {
                          handleCrawlAts(selectedAtsCompany, selectedSeniority, newWorkplace, selectedAtsLocation, atsKeyword);
                        }
                      }}
                      className="appearance-none pl-3 pr-7 py-1.5 bg-surface hover:bg-surface-2 text-foreground font-medium rounded-xl text-xs outline-none cursor-pointer border border-transparent focus:border-brand transition-all"
                    >
                      <option value="All">All Workplace Modes</option>
                      <option value="Remote">🌐 Remote Only</option>
                      <option value="Hybrid">🏢 Hybrid</option>
                      <option value="On-site">📍 On-site Only</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-subtle">
                      <svg className="fill-current h-3 w-3" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>

                  {/* Location Selector Dropdown */}
                  <div className="relative shrink-0">
                    <select
                      value={selectedAtsLocation}
                      onChange={(e) => {
                        const newLoc = e.target.value;
                        setSelectedAtsLocation(newLoc);
                        handleCrawlAts(selectedAtsCompany, selectedSeniority, selectedWorkplace, newLoc, atsKeyword);
                      }}
                      className="appearance-none pl-3 pr-7 py-1.5 bg-surface hover:bg-surface-2 text-foreground font-medium rounded-xl text-xs outline-none cursor-pointer border border-transparent focus:border-brand transition-all"
                    >
                      <option value="All">All Locations</option>
                      <option value="India">🇮🇳 India (Bengaluru, Hyderabad, etc.)</option>
                      <option value="United States">🇺🇸 United States (SF, NY, Austin, etc.)</option>
                      <option value="Europe / UK">🇪🇺 Europe / UK (London, Dublin, etc.)</option>
                      <option value="Remote">🌍 Global Remote</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-subtle">
                      <svg className="fill-current h-3 w-3" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>

                  {/* Reset Filters Shortcut */}
                  {(selectedSeniority !== 'All' || selectedWorkplace !== 'All' || selectedAtsLocation !== 'All' || atsKeyword.trim()) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSeniority('All');
                        setSelectedWorkplace('All');
                        setSelectedAtsLocation('All');
                        setAtsKeyword('');
                        if (atsJobs.length > 0) {
                          handleCrawlAts(selectedAtsCompany, 'All', 'All', 'All', '');
                        }
                      }}
                      className="text-[11px] font-semibold text-brand hover:text-brand px-2.5 py-1 rounded-lg hover:bg-brand/10 transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>

                {/* Feedback */}
                {atsFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center justify-between gap-2 ${
                      atsFeedback.type === 'success'
                        ? 'bg-success/10 text-success border border-success/20'
                        : 'bg-danger/10 text-danger border border-danger/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {atsFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{atsFeedback.message}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAtsFeedback(null)}
                      className="text-subtle hover:text-foreground text-xs font-bold shrink-0 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Results Grid */}
                {atsJobs.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-xs text-subtle flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>
                          Showing <strong className="text-foreground font-semibold">{filteredAtsJobs.length}</strong> active positions across <strong className="text-brand font-semibold">{uniqueCompaniesCount} companies</strong>
                          {selectedAtsLocation !== 'All' && (
                            <span> in <strong className="text-brand font-semibold">{selectedAtsLocation}</strong></span>
                          )}
                          {selectedSeniority !== 'All' && <span> · <span className="text-foreground font-medium">{selectedSeniority}</span></span>}
                          {selectedWorkplace !== 'All' && <span> · <span className="text-foreground font-medium">{selectedWorkplace}</span></span>}
                          {filteredAtsJobs.length < atsJobs.length && (
                            <span className="text-subtle text-[11px]"> (filtered from {atsJobs.length} loaded)</span>
                          )}
                        </span>
                        {hasProfile ? (
                          <span className="text-[11px] text-muted-foreground">
                            {showAllRoles
                              ? `Showing all ${scoredAtsJobs.length} fetched roles`
                              : `${profileMatchedJobs.length} of ${scoredAtsJobs.length} fetched roles match your Master Profile`}
                            <button type="button" onClick={() => setShowAllRoles((v) => !v)} className="ml-2 text-brand font-semibold hover:underline cursor-pointer">
                              {showAllRoles ? 'Show profile matches only' : 'Show all roles'}
                            </button>
                          </span>
                        ) : (
                          <span className="text-[11px] text-warning">Add your Master Profile to see only roles that match you.</span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-success flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        Live Stream Connected
                      </span>
                    </div>

                    {filteredAtsJobs.length === 0 ? (
                      <div className="p-8 text-center bg-surface rounded-2xl space-y-2">
                        <p className="text-sm font-semibold text-foreground">{hasProfile && !showAllRoles && scoredAtsJobs.length > 0 ? 'None of the fetched roles match your Master Profile yet' : 'No positions match your selected filters'}</p>
                        <p className="text-xs text-subtle">
                          Try adjusting your Experience Level, Workplace Mode, or Location filters.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSeniority('All');
                            setSelectedWorkplace('All');
                            setSelectedAtsLocation('All');
                            setAtsKeyword('');
                          }}
                          className="mt-2 px-3.5 py-1.5 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-colors cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      </div>
                    ) : (
                      <div className="workspace-job-results grid grid-cols-1 gap-0 max-h-[600px] overflow-y-auto">
                        {filteredAtsJobs.map((job) => {
                          const importedId = importedAtsIds.get(job.id);
                          const isImported = !!importedId && opportunities.some((o) => o.id === importedId);
                          return (
                            <div
                              key={job.id}
                              className="workspace-job-row p-4 flex flex-col justify-between gap-2.5 transition-all"
                            >
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="space-y-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-[11px] font-bold text-foreground">
                                        {job.company}
                                      </span>
                                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-surface text-muted-foreground">
                                        {job.platform}
                                      </span>
                                      {job.seniority && (
                                        <span
                                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                            job.seniority === 'Early / Junior'
                                              ? 'bg-brand/10 text-brand border border-brand/25/60'
                                              : job.seniority === 'Mid-Level'
                                              ? 'bg-success/10 text-success border border-success/30/60'
                                              : job.seniority === 'Senior'
                                              ? 'bg-info/10 text-info border border-info/25/60'
                                              : 'bg-warning/10 text-warning border border-warning/25/60'
                                          }`}
                                        >
                                          {job.seniority}
                                        </span>
                                      )}
                                      {job.workplaceType && (
                                        <span
                                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                            job.workplaceType === 'Remote'
                                              ? 'bg-success/10 text-success'
                                              : job.workplaceType === 'Hybrid'
                                              ? 'bg-warning/10 text-warning'
                                              : 'bg-[#8E8E93]/10 text-[#636366]'
                                          }`}
                                        >
                                          {job.workplaceType === 'Remote'
                                            ? '🌐 Remote'
                                            : job.workplaceType === 'Hybrid'
                                            ? '🏢 Hybrid'
                                            : '📍 On-site'}
                                        </span>
                                      )}
                                    </div>
                                    <h5
                                      className="font-display font-semibold text-sm text-foreground line-clamp-1"
                                      title={job.title}
                                    >
                                      {job.title}
                                    </h5>
                                    {job.department && (
                                      <p className="text-[11px] text-subtle truncate">
                                        {job.department}
                                      </p>
                                    )}
                                  </div>

                                  {job.matchScore !== undefined && (
                                    <span
                                      className={`text-xs font-bold shrink-0 ${getScoreColor(job.matchScore)}`}
                                      title="Quick keyword estimate. Tailor Application runs the full check against the job's requirements."
                                    >
                                      <span className="font-medium text-muted-foreground mr-1">Quick fit</span>{job.matchScore}%
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 text-[11px] text-subtle flex-wrap">
                                  <span className="flex items-center gap-1 truncate" title={job.location}>
                                    <MapPin className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{job.location}</span>
                                  </span>
                                  {job.salarySnippet && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-md">
                                      <span>💰</span>
                                      <span>{job.salarySnippet}</span>
                                    </span>
                                  )}
                                </div>

                                {job.skills && job.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1 pt-0.5">
                                    {job.skills.slice(0, 4).map((skill, sIdx) => (
                                      <span
                                        key={sIdx}
                                        className="text-[9px] font-mono px-1.5 py-0.5 bg-surface text-muted-foreground rounded border border-border"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {job.matchHighlight && (
                                  <p className="text-[11px] text-muted-foreground bg-surface p-2 rounded-lg line-clamp-2">
                                    <span className="font-semibold text-foreground">Match: </span>
                                    {job.matchHighlight}
                                  </p>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                                {job.applyUrl && (
                                  <a
                                    href={job.applyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-brand hover:underline flex items-center gap-1 font-medium"
                                  >
                                    <span>Portal</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleImportAtsJob(job, false)}
                                    disabled={isImported}
                                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-full transition-all cursor-pointer ${
                                      isImported
                                        ? 'bg-success/10 text-success'
                                        : 'bg-surface text-foreground hover:bg-surface-2'
                                    }`}
                                  >
                                    {isImported ? '✓ Added' : '+ Add Opportunity'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleImportAtsJob(job, true)}
                                    className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all cursor-pointer shadow-sm"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                    <span>Tailor Resume</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Load Next 100+ Live Positions Button */}
                    {filteredAtsJobs.length > 0 && (
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border bg-surface/70 p-4 rounded-2xl">
                        <div className="text-xs text-muted-foreground text-center sm:text-left">
                          <p className="font-semibold text-foreground">
                            Showing {filteredAtsJobs.length} active positions across {uniqueCompaniesCount} companies
                          </p>
                          <p className="text-[11px] text-subtle mt-0.5">
                            Fetched live from public company job boards at search time
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleCrawlAts(
                              selectedAtsCompany,
                              selectedSeniority,
                              selectedWorkplace,
                              selectedAtsLocation,
                              atsKeyword,
                              true
                            )
                          }
                          disabled={isLoadingMore || isCrawlingAts}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 shadow-elevated transition-all cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          {isLoadingMore ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Loading Next 100+ Jobs...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5" />
                              <span>Load Next 100+ Live Positions</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            {/* Notification Feedback */}
            {verificationFeedback && (
              <div
                className={`p-3 rounded-2xl text-[13px] flex items-center justify-between gap-2 ${
                  verificationFeedback.type === 'success'
                    ? 'bg-success/10 text-success border border-success/20'
                    : 'bg-danger/10 text-danger border border-danger/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  {verificationFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{verificationFeedback.message}</span>
                </div>
                <button
                  onClick={() => setVerificationFeedback(null)}
                  className="text-subtle hover:text-foreground text-xs font-bold shrink-0 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Evaluated Workspace Opportunities (Rendered if user has saved/evaluated roles) */}
            {filteredOpportunities.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <h3 className="font-display font-semibold text-sm sm:text-base text-foreground">
                      Saved & Evaluated Roles ({filteredOpportunities.length})
                    </h3>
                  </div>
                  {onClearOpportunities && (
                    <button
                      type="button"
                      onClick={onClearOpportunities}
                      className="px-3 py-1.5 text-xs text-danger hover:bg-danger/10 rounded-full transition-colors font-medium cursor-pointer"
                      title="Clear evaluated opportunities from workspace"
                    >
                      Clear Evaluated ({filteredOpportunities.length})
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredOpportunities.map((job) => {
                    const isSelected = selectedJobId === job.id;
                    return (
                      <div
                        key={job.id}
                        data-saved-job-id={job.id}
                        style={{ scrollMarginTop: 96 }}
                        onClick={() => onSelectPreset(job.id)}
                        className={`p-5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'bg-card border-brand ring-2 ring-brand/20 shadow-elevated'
                            : 'bg-card border-border hover:border-border hover:shadow-elevated'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Top Meta */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-subtle" />
                                <span>{job.company}</span>
                              </span>
                              <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-[rgba(120,120,128,0.12)] text-muted-foreground">
                                {job.platform}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold tabular-nums ${getScoreColor(job.matchScore)}`}>
                                {job.matchScore}%
                              </span>
                              {onRemoveOpportunity && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveOpportunity(job.id);
                                  }}
                                  className="p-1 rounded-md text-subtle hover:text-danger hover:bg-danger/10 transition-colors"
                                  title="Remove listing"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Job Title */}
                          <h3 className="font-display text-base font-semibold text-foreground line-clamp-1">
                            {job.title}
                          </h3>

                          {/* Location */}
                          <div className="text-[13px] text-subtle flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>

                          {/* Why You're Eligible / Assessment */}
                          <div className={`p-3 rounded-xl text-[12px] leading-snug ${
                            (job.matchScore || 0) < 60
                              ? 'bg-warning/10 text-warning border border-warning/25/60'
                              : 'bg-surface text-muted-foreground'
                          }`}>
                            <span className="font-semibold text-foreground">
                              {(job.matchScore || 0) < 60 ? 'Eligibility Notice: ' : 'Why you match: '}
                            </span>
                            <span>{job.matchHighlight}</span>
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center justify-between pt-3 border-t border-border text-[13px]">
                          <span className={`font-medium ${isSelected ? 'text-brand font-semibold' : 'text-subtle'}`}>
                            {isSelected ? '✓ Selected' : 'Click to select'}
                          </span>

                          {job.applyUrl && (
                            <a
                              href={job.applyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[12px] text-brand font-medium transition-colors hover:underline"
                              title="Open verified live posting in new tab"
                            >
                              <span>Open on {job.platform}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 pt-1">
            {/* Step 1: Import from Job Posting URL */}
            <div className="p-5 sm:p-6 bg-card rounded-2xl border border-border shadow-elevated space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-semibold text-foreground">
                      Import from Job Posting URL
                    </h3>
                    <p className="text-xs text-subtle">
                      Paste any public job listing link. We'll automatically scrape and extract the job description.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-medium text-subtle bg-surface px-2.5 py-1 rounded-full self-start sm:self-auto">
                  LinkedIn · Greenhouse · Lever · Ashby · Workday
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Link2 className="w-4 h-4 text-subtle absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleScrapeUrl();
                      }
                    }}
                    placeholder="https://boards.greenhouse.io/... or https://jobs.lever.co/... or LinkedIn job URL"
                    className="w-full pl-10 pr-3 py-2.5 text-[13px] bg-surface border border-transparent rounded-xl text-foreground placeholder:text-subtle focus:outline-none focus:bg-card focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleScrapeUrl}
                    disabled={isScraping || !customUrl.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-elevated"
                  >
                    {isScraping ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Extracting JD...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Auto-Fetch & Load JD</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVerifyLiveJob(customUrl)}
                    disabled={isVerifyingListing || !customUrl.trim()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium text-foreground bg-surface hover:bg-surface-2 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Verify listing is active on official portal and calculate match score"
                  >
                    {isVerifyingListing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                        <span>Verify & Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Notification Feedback */}
              {scrapeNotification && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center justify-between gap-2 ${
                    scrapeNotification.type === 'success'
                      ? 'bg-success/10 text-success border border-success/20'
                      : 'bg-warning/10 text-warning border border-warning/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {scrapeNotification.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{scrapeNotification.message}</span>
                  </div>
                  <button
                    onClick={() => setScrapeNotification(null)}
                    className="text-subtle hover:text-foreground text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {verificationFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center justify-between gap-2 ${
                    verificationFeedback.type === 'success'
                      ? 'bg-success/10 text-success border border-success/20'
                      : 'bg-danger/10 text-danger border border-danger/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {verificationFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{verificationFeedback.message}</span>
                  </div>
                  <button
                    onClick={() => setVerificationFeedback(null)}
                    className="text-subtle hover:text-foreground text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Subtle Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative px-4 bg-card text-[11px] font-semibold tracking-wider text-subtle uppercase">
                Or Paste Job Description Manually
              </span>
            </div>

            {/* Step 2: Job Description Textarea */}
            <div className="p-5 sm:p-6 bg-card rounded-2xl border border-border shadow-elevated space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-info/10 text-info flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-semibold text-foreground">
                      Job Description Text & Requirements
                    </h3>
                    <p className="text-xs text-subtle">
                      Paste the responsibilities, minimum qualifications, and skills from the posting.
                    </p>
                  </div>
                </div>

                {customJobText.trim() && (
                  <button
                    type="button"
                    onClick={() => setCustomJobText('')}
                    className="text-xs font-medium text-subtle hover:text-danger transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-danger/10"
                  >
                    Clear text
                  </button>
                )}
              </div>

              <div className="relative">
                <textarea
                  value={customJobText}
                  onChange={(e) => setCustomJobText(e.target.value)}
                  rows={8}
                  placeholder="Paste the job description, role overview, and key requirements here...&#10;&#10;e.g.:&#10;About the Role: We are seeking an Operations Analyst to oversee incident management...&#10;Requirements:&#10;• 3+ years experience with CRM and incident triage&#10;• Experience with SQL or analytics dashboards"
                  className="w-full p-4 text-[13px] bg-surface border border-transparent rounded-xl text-foreground placeholder:text-subtle focus:outline-none focus:bg-card focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all font-sans leading-relaxed"
                />
              </div>

              {/* Action Bar for Custom JD */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-border">
                <div className="text-xs text-subtle">
                  {customJobText.trim() ? (
                    <span className="text-success font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{customJobText.trim().length.toLocaleString()} characters ready for ATS analysis</span>
                    </span>
                  ) : (
                    <span>Paste JD text or auto-fetch from URL to analyze match & tailor your resume</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onEvaluate(customJobText)}
                  disabled={isLoading || !customJobText.trim()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-[13px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-elevated shrink-0"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Tailoring… {tailorProgress}%</span>
                      <span className="text-[11px] opacity-70">{tailorEta}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tailor Resume for this Job</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {evaluation.job_title && evaluation.match_score > 0 ? (
        <>
          {/* Evaluation Card */}
          <div id="evaluation-summary" className="apple-card p-6 sm:p-8 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                {/* Score Circle */}
                <div className={`relative w-16 h-16 rounded-full bg-surface border-2 ${
                  evaluation.match_score >= 80 ? 'border-success' : evaluation.match_score >= 60 ? 'border-brand' : 'border-warning'
                } flex flex-col items-center justify-center shrink-0`}>
                  <span className={`font-display text-lg font-bold tabular-nums ${getScoreColor(evaluation.match_score)}`}>
                    {evaluation.match_score}%
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-subtle">
                    MATCH
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`apple-badge text-[11px] ${evaluation.should_apply ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                      {evaluation.verdict.replace('_', ' ')}
                    </span>
                    <span className="text-[13px] text-subtle font-medium">
                      {evaluation.should_apply ? '✓ Recommended' : 'Low Overlap'}
                    </span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                    {evaluation.job_title}
                  </h2>
                  <div className="text-[13px] text-subtle flex items-center gap-2 font-medium">
                    <span className="text-foreground font-semibold">{evaluation.company_name}</span>
                    {evaluation.location_info && (
                      <>
                        <span className="text-subtle">·</span>
                        <span>{evaluation.location_info}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => onEvaluate()}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span className="tabular-nums">Tailoring… {tailorProgress}%</span>
                      <span className="text-[11px] opacity-70">{tailorEta}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tailor Application</span>
                    </>
                  )}
                </button>

                {onOpenRecruiterReview && (
                  <button
                    onClick={onOpenRecruiterReview}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-info bg-info/10 hover:bg-info/10 border border-info/25 rounded-full transition-all cursor-pointer whitespace-nowrap shadow-xs"
                    title="Simulate 3-Person Hiring Committee Review"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-info" />
                    <span>Recruiter Panel Review</span>
                  </button>
                )}

                <button
                  onClick={onProceedToResume}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-foreground bg-surface hover:bg-surface-2 rounded-full transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>View Resume</span>
                  <ArrowRight className="w-3.5 h-3.5 text-subtle" />
                </button>

                {onTrackApplication && (
                  <button
                    onClick={() =>
                      onTrackApplication({
                        company_name: evaluation.company_name,
                        job_title: evaluation.job_title,
                        location: evaluation.location_info,
                        apply_url: customUrl,
                        match_score: evaluation.match_score,
                      })
                    }
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                      isTracked
                        ? 'bg-success/10 text-success hover:bg-success/20'
                        : 'text-foreground bg-surface hover:bg-surface-2'
                    }`}
                    title={isTracked ? 'Application tracked' : 'Track in Applied Jobs'}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isTracked ? 'text-success' : 'text-subtle'}`} />
                    <span>{isTracked ? 'Tracked as Applied' : 'Mark as Applied'}</span>
                  </button>
                )}
              </div>
            </div>

            {evaluation.executive_summary && (
              <p className="text-[13px] text-muted-foreground border-t border-border pt-4 leading-relaxed">
                <span className="font-semibold text-foreground">Assessment: </span>
                {evaluation.executive_summary}
              </p>
            )}
          </div>

          {/* 3-Column: Matching Qualifications, Gaps & Growth Areas, Tailoring Strategy */}
          {(() => {
            const gapsList = getGapsList(evaluation);
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Key Qualifications */}
                <div className="apple-card p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="apple-badge-blue text-[11px]">FIT FACTORS</span>
                      <h3 className="font-display font-semibold text-base text-foreground">Matching Qualifications</h3>
                    </div>
                    <ul className="space-y-2.5 text-[13px] text-muted-foreground">
                      {evaluation.key_matching_factors.map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 2. Gap Analysis & Where to Work */}
                <div className="apple-card p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="apple-badge text-[11px] bg-warning/10 text-warning font-semibold">
                          GAP ANALYSIS
                        </span>
                        <h3 className="font-display font-semibold text-base text-foreground">
                          Gaps & Where to Work
                        </h3>
                      </div>
                      {gapsList.length > 0 && (
                        <span className="text-[11px] text-subtle font-medium">
                          {gapsList.length} {gapsList.length === 1 ? 'area' : 'areas'}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3 text-[13px]">
                      {gapsList.length > 0 ? (
                        gapsList.map((gap, idx) => (
                          <li
                            key={idx}
                            className="p-3.5 rounded-xl bg-surface border border-border space-y-2"
                          >
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-warning">
                                    What is Missing
                                  </span>
                                  {gap.severity && (
                                    <span
                                      className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                                        gap.severity === 'CRITICAL'
                                          ? 'bg-danger/10 text-danger'
                                          : 'bg-warning/10 text-warning'
                                      }`}
                                    >
                                      {gap.severity}
                                    </span>
                                  )}
                                </div>
                                <span className="font-semibold text-foreground leading-snug block">
                                  {gap.missing}
                                </span>
                              </div>
                            </div>

                            <div className="pl-6 pt-1.5 border-t border-border text-[12px] text-muted-foreground leading-relaxed">
                              <span className="font-semibold text-brand flex items-center gap-1 mb-0.5">
                                <Target className="w-3 h-3" />
                                <span>Where to work on:</span>
                              </span>
                              <span>{gap.where_to_work}</span>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="p-4 rounded-xl bg-success/5 border border-success/15 flex items-start gap-2.5 text-success">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-success mt-0.5" />
                          <div>
                            <span className="font-semibold block mb-0.5">No Critical Gaps Detected</span>
                            <span className="text-[12px] text-success/80">
                              Candidate qualifications strongly align with all primary requirements.
                            </span>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* 3. Tailoring Strategy */}
                <div className="apple-card p-6 space-y-4 md:col-span-2 lg:col-span-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="apple-badge text-[11px]">STRATEGY</span>
                      <h3 className="font-display font-semibold text-base text-foreground">Tailoring Recommendations</h3>
                    </div>
                    <ul className="space-y-2.5 text-[13px] text-muted-foreground">
                      {evaluation.tailoring_recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-surface text-muted-foreground text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Skill-Building Roadmap & Certifications */}
          {(() => {
            const roadmapSteps =
              evaluation.skill_roadmap && evaluation.skill_roadmap.length > 0
                ? evaluation.skill_roadmap
                : evaluation.missing_critical_skills.map((gap, i) => ({
                    skill: gap.split('(')[0].replace(/mitigated by.*$/i, '').trim(),
                    action_plan: `Master core operational methodologies and industry frameworks related to: ${gap}.`,
                    recommended_certification: 'Industry Professional Certification',
                    certification_provider: 'Accredited Provider',
                    timeline: '2–4 weeks',
                    importance: i === 0 ? 'CRITICAL' : 'RECOMMENDED',
                    practical_project: 'Build a targeted portfolio case study demonstrating practical application of this competency.',
                  }));

            const titleLow = (evaluation.job_title || '').toLowerCase();
            const isB2B = titleLow.includes('merchant') || titleLow.includes('b2b') || titleLow.includes('payment') || titleLow.includes('acquiring') || titleLow.includes('client delivery');
            const isFinCrime = titleLow.includes('fincrime') || titleLow.includes('financial crime') || titleLow.includes('dispute') || titleLow.includes('fraud') || titleLow.includes('aml') || titleLow.includes('compliance');
            const isIncident = titleLow.includes('incident') || titleLow.includes('itsm') || titleLow.includes('service delivery');
            const isWfm = titleLow.includes('workforce') || titleLow.includes('wfm') || titleLow.includes('real-time') || titleLow.includes('queue');
            const isProdOps = titleLow.includes('product') || titleLow.includes('program');

            const domainFallbackCertifications = isB2B
              ? [
                  {
                    name: 'Certified Payments Professional (CPP)',
                    issuer: 'Electronic Transactions Association (ETA)',
                    target_skill: 'Merchant operations, acquiring workflows & payment gateway API specs',
                    estimated_time: '2–3 weeks',
                    why_it_helps: 'High-value ATS qualification for fintech merchant and B2B operational scaling.',
                    difficulty: 'Intermediate',
                  },
                  {
                    name: 'B2B Client Relationship & Account Governance',
                    issuer: 'SuccessHACKER',
                    target_skill: 'Multi-currency account management, SLA metrics & delivery integrity',
                    estimated_time: '2 weeks',
                    why_it_helps: 'Proves client lifecycle ownership and revenue retention capabilities.',
                    difficulty: 'Beginner',
                  },
                ]
              : isFinCrime
              ? [
                  {
                    name: 'Certified Anti-Money Laundering Specialist (CAMS)',
                    issuer: 'ACAMS',
                    target_skill: 'Regulatory screening, AML red flags & dispute investigation',
                    estimated_time: '3–4 weeks',
                    why_it_helps: 'Industry benchmark for financial crime operations and dispute integrity.',
                    difficulty: 'Intermediate',
                  },
                  {
                    name: 'SC-900: Security, Compliance, and Identity Fundamentals',
                    issuer: 'Microsoft',
                    target_skill: 'Access control, audit trails & digital regulatory compliance',
                    estimated_time: '1–2 weeks',
                    why_it_helps: 'Direct proof of compliance controls and access governance.',
                    difficulty: 'Beginner',
                  },
                ]
              : isIncident
              ? [
                  {
                    name: 'ITIL 4 Foundation in IT Service Management',
                    issuer: 'AXELOS / PeopleCert',
                    target_skill: 'Incident command, problem management, ITIL service governance',
                    estimated_time: '2 weeks',
                    why_it_helps: 'The universal benchmark for major incident command and enterprise service management roles.',
                    difficulty: 'Beginner',
                  },
                  {
                    name: 'ServiceNow Certified System Administrator (ITSM)',
                    issuer: 'ServiceNow',
                    target_skill: 'Enterprise ticketing workflow automation, SLA alerting, incident triage',
                    estimated_time: '3–4 weeks',
                    why_it_helps: 'High demand across BETSOL and IT service employers looking for platform-certified incident leads.',
                    difficulty: 'Intermediate',
                  },
                ]
              : isWfm
              ? [
                  {
                    name: 'Certified Workforce Planning Professional (CWPP)',
                    issuer: 'The Workforce Management Institute (SWPP)',
                    target_skill: 'Capacity forecasting, intraday variance steering, Erlang modeling',
                    estimated_time: '3–4 weeks',
                    why_it_helps: 'Proves formal mastery of global workforce management theory alongside candidate practical Revolut SME experience.',
                    difficulty: 'Intermediate',
                  },
                  {
                    name: 'Advanced Operational Queue & Capacity Modeling',
                    issuer: 'Operations Management Institute',
                    target_skill: 'Dynamic sensitivity analysis, shift optimization formulas, roster forecasting',
                    estimated_time: '2 weeks',
                    why_it_helps: 'Demonstrates deep analytical rigor for command center lead positions.',
                    difficulty: 'Intermediate',
                  },
                ]
              : isProdOps
              ? [
                  {
                    name: 'Certified Scrum Product Owner (CSPO)',
                    issuer: 'Scrum Alliance',
                    target_skill: 'Sprint-level backlog prioritization, stakeholder alignment, feature rollout telemetry',
                    estimated_time: '2 weeks',
                    why_it_helps: 'Gold standard for agile product operations and cross-functional feature lifecycle management.',
                    difficulty: 'Beginner',
                  },
                  {
                    name: 'Product Operations & Telemetry Governance',
                    issuer: 'Product Institute',
                    target_skill: 'Operational readiness reviews (ORR), incident feedback loops, product KPIs',
                    estimated_time: '3 weeks',
                    why_it_helps: 'Validates operational excellence and engineering defect triage expertise.',
                    difficulty: 'Intermediate',
                  },
                ]
              : [
                  {
                    name: 'Lean Six Sigma Green Belt (LSSGB)',
                    issuer: 'ASQ / IASSC',
                    target_skill: 'Root-cause analysis, defect reduction, DMAIC process re-engineering',
                    estimated_time: '3–4 weeks',
                    why_it_helps: 'Offers strong proof of candidate process improvement and defect elimination capability.',
                    difficulty: 'Intermediate',
                  },
                  {
                    name: 'Certified Business Analysis Professional (CBAP)',
                    issuer: 'IIBA',
                    target_skill: 'Requirements analysis, operational mapping, process governance',
                    estimated_time: '3–4 weeks',
                    why_it_helps: 'Validates business analysis capability across complex enterprise environments.',
                    difficulty: 'Intermediate',
                  },
                ];

            const certifications =
              evaluation.recommended_certifications && evaluation.recommended_certifications.length > 0
                ? evaluation.recommended_certifications
                : domainFallbackCertifications;

            const gapPercentage = Math.max(0, 100 - evaluation.match_score);

            return (
              <div className="apple-card p-6 sm:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border">
                  <div className="space-y-1">
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                      Skill Roadmap & Certifications
                    </h3>
                    <p className="text-[13px] text-subtle">
                      Learning milestones and certifications to bridge gaps and reach 100% eligibility.
                    </p>
                  </div>

                  <div className="shrink-0">
                    {gapPercentage > 0 ? (
                      <span className="apple-badge text-[11px]">
                        {gapPercentage}% TO BRIDGE
                      </span>
                    ) : (
                      <span className="apple-badge bg-success/10 text-success text-[11px]">
                        100% MATCH
                      </span>
                    )}
                  </div>
                </div>

                {/* 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Column 1: Learning Roadmap */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-foreground font-display font-semibold text-[13px] uppercase tracking-wider">
                      <Milestone className="w-4 h-4 text-subtle" />
                      <span>Learning Roadmap</span>
                    </div>

                    <div className="space-y-3">
                      {roadmapSteps.map((step, idx) => {
                        const isCritical = step.importance === 'CRITICAL';
                        return (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl border border-border bg-surface text-[13px] space-y-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="font-display font-semibold text-foreground text-[14px]">
                                  {step.skill}
                                </span>
                              </div>

                              <span className={`apple-badge text-[10px] ${isCritical ? 'bg-danger/10 text-danger' : ''}`}>
                                {step.importance || 'RECOMMENDED'}
                              </span>
                            </div>

                            <p className="text-muted-foreground leading-relaxed pl-[34px]">
                              {step.action_plan}
                            </p>

                            <div className="pt-2 border-t border-border pl-[34px] flex flex-wrap gap-2 text-[11px]">
                              {step.timeline && (
                                <span className="inline-flex items-center gap-1 text-muted-foreground bg-card border border-border px-2.5 py-1 rounded-lg font-medium">
                                  <Clock className="w-3 h-3 text-subtle" />
                                  <span>{step.timeline}</span>
                                </span>
                              )}

                              {step.recommended_certification && (
                                <span className="inline-flex items-center gap-1 text-brand bg-card border border-border px-2.5 py-1 rounded-lg font-semibold">
                                  <Award className="w-3 h-3" />
                                  <span>{step.recommended_certification}</span>
                                </span>
                              )}
                            </div>

                            {step.practical_project && (
                              <div className="ml-[34px] p-3 rounded-xl bg-card border border-border text-[12px] text-muted-foreground flex items-start gap-2">
                                <Target className="w-3.5 h-3.5 text-subtle shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-semibold text-foreground">Project: </span>
                                  <span>{step.practical_project}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 2: Certifications */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-foreground font-display font-semibold text-[13px] uppercase tracking-wider">
                      <Award className="w-4 h-4 text-subtle" />
                      <span>Target Certifications</span>
                    </div>

                    <div className="space-y-3">
                      {certifications.map((cert, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl border border-border bg-surface text-[13px] space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-display font-semibold text-foreground text-[14px]">
                                {cert.name}
                              </h4>
                              <span className="text-[12px] text-brand font-medium block mt-0.5">
                                {cert.issuer}
                              </span>
                            </div>

                            {cert.difficulty && (
                              <span className="apple-badge text-[10px]">
                                {cert.difficulty}
                              </span>
                            )}
                          </div>

                          <div className="text-muted-foreground text-[12px] flex items-start gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-subtle shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-foreground">Validates: </span>
                              <span>{cert.target_skill}</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-card border border-border text-[12px] text-muted-foreground">
                            <span className="font-semibold text-foreground">Impact: </span>
                            <span>{cert.why_it_helps}</span>
                          </div>

                          <div className="flex items-center justify-between pt-2 text-[11px] text-subtle font-medium border-t border-border">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Prep: {cert.estimated_time}</span>
                            </span>
                            <span className="text-success font-semibold">
                              ATS Approved ✓
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tip Banner */}
                <div className="p-4 rounded-2xl bg-surface flex items-start sm:items-center gap-3 text-[13px]">
                  <Lightbulb className="w-5 h-5 text-warning shrink-0" />
                  <div className="leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">Tip: </span>
                    <span>
                      Completing even 1 targeted certification or documenting the suggested project in your resume can elevate a {evaluation.match_score}% match into a top-tier interview invitation.
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      ) : (
        <div className="workspace-evaluation-empty">
          <div className="workspace-empty-symbol">
            <Compass className="w-5 h-5 text-subtle" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
              Your match analysis starts here
            </h3>
            <p className="text-[13px] sm:text-sm text-subtle max-w-md leading-relaxed">
              Find a live role or bring your own job description to see your match, skill gaps, and tailored application materials.
            </p>
            <Button variant="ghost" size="sm" type="button" onClick={() => setActiveInputMode('custom')} className="gap-2 text-brand text-xs font-medium mt-3 px-0">Import a job description <ArrowRight className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
      )}
    </div>
  );
};
