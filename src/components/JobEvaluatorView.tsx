import React, { useState, useMemo } from 'react';
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

interface JobEvaluatorViewProps {
  evaluation: JobEvaluationData;
  opportunities?: JobOpportunity[];
  onAddOpportunities?: (newJobs: JobOpportunity[]) => void;
  onSelectPreset: (jobId: string) => void;
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
}

export const JobEvaluatorView: React.FC<JobEvaluatorViewProps> = ({
  evaluation,
  opportunities = [],
  onAddOpportunities,
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
  const [importedAtsIds, setImportedAtsIds] = useState<Set<string>>(new Set());

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
      const totalAvailableStr = (data.totalAvailableInCatalogue || 7135839).toLocaleString();

      setAtsFeedback({
        type: 'success',
        message: targetCompany === 'all'
          ? `Aggregated ${totalCount} live positions${locLabel}${modeLabel} across Live ATS Network (${totalAvailableStr}+ matching roles, 172 ATS platforms) & direct tech boards.`
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
  const filteredAtsJobs = useMemo(() => {
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
      setImportedAtsIds((prev) => new Set(prev).add(job.id));
      if (andSelect) {
        onSelectPreset(data.opportunity.id);
        onProceedToResume();
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
    if (score >= 90) return 'text-[#34C759]';
    if (score >= 75) return 'text-[#0071E3]';
    if (score >= 60) return 'text-[#FF9500]';
    return 'text-[#FF3B30]';
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center space-y-5"
        style={{
          background: 'linear-gradient(135deg, #1D1D1F 0%, #2C2C2E 40%, #3A3A3C 100%)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(0, 113, 227, 0.4), transparent 50%), radial-gradient(circle at 70% 80%, rgba(88, 86, 214, 0.3), transparent 50%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center space-y-4">
          <span className="apple-badge-blue text-[11px] tracking-wider">
            JOB EVALUATOR
          </span>

          <h1 className="font-display text-3xl sm:text-5xl md:text-[56px] text-white font-semibold tracking-tight leading-[1.05]">
            Find your next role.
          </h1>

          <p className="text-white/70 max-w-lg text-sm sm:text-base font-normal leading-relaxed">
            Match scoring, ATS materials, and application intelligence — all in one place.
          </p>
        </div>
      </div>

      {/* Target Opportunities Card */}
      <div className="apple-card p-6 sm:p-8 space-y-5">
        {/* Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[rgba(0,0,0,0.06)]">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1D1D1F]">
                Target Opportunities
              </h2>
              {isProUser ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#34C759]/15 text-[#248A3D] font-mono tracking-wider">
                  ★ PRO
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F5F5F7] text-[#86868B] font-mono">
                  FREE PLAN
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="text-sm text-[#86868B]">
                Live roles matched against your profile with automated ATS tailoring.
              </p>
              {!isProUser && (
                <span className="text-xs text-[#0071E3] font-medium inline-flex items-center gap-1 bg-[#0071E3]/10 px-2 py-0.5 rounded-md">
                  <span>{2 - Math.min(tailoredCount, 2)} of 2 free tailored resumes left</span>
                  {onNavigateToPricing && (
                    <button
                      type="button"
                      onClick={onNavigateToPricing}
                      className="font-bold underline hover:text-[#0077ED] cursor-pointer ml-1"
                    >
                      Upgrade ($9.99/mo)
                    </button>
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Apple Segmented Control */}
          <div className="flex items-center p-1 bg-[#F5F5F7] rounded-xl text-[13px] font-medium self-start sm:self-auto shrink-0">
            <button
              onClick={() => setActiveInputMode('preset')}
              className={`px-4 py-2 rounded-[10px] transition-all cursor-pointer ${
                activeInputMode === 'preset'
                  ? 'bg-white text-[#1D1D1F] shadow-[0_1px_4px_rgba(0,0,0,0.08),0_0_1px_rgba(0,0,0,0.04)] font-semibold'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              Live Roles ({opportunities.length > 0 ? opportunities.length : '7.1M+'})
            </button>
            <button
              onClick={() => setActiveInputMode('custom')}
              className={`px-4 py-2 rounded-[10px] transition-all cursor-pointer ${
                activeInputMode === 'custom'
                  ? 'bg-white text-[#1D1D1F] shadow-[0_1px_4px_rgba(0,0,0,0.08),0_0_1px_rgba(0,0,0,0.04)] font-semibold'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
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
            <div className="p-5 bg-white rounded-3xl border border-[#0071E3]/20 shadow-[0_4px_24px_rgba(0,113,227,0.08)] space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(0,0,0,0.06)] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="apple-badge-blue text-[10px] flex items-center gap-1 font-mono">
                        <Zap className="w-3 h-3 text-[#0071E3]" />
                        LIVE ATS & ENTERPRISE PIPELINE
                      </span>
                      <h4 className="font-display font-semibold text-sm sm:text-base text-[#1D1D1F]">
                        Live ATS & Enterprise Job Board Explorer
                      </h4>
                    </div>
                    <p className="text-xs text-[#86868B] mt-0.5">
                      Direct unauthenticated feed across <strong>7,135,000+ live jobs</strong> from <strong>674,000+ companies</strong> on 172 ATS platforms (Greenhouse, Lever, Ashby, SmartRecruiters, Workday).
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#248A3D] bg-[#34C759]/10 px-2.5 py-1 rounded-full self-start sm:self-auto flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
                    7.1M+ Live Jobs · 172 ATS Platforms
                  </span>
                </div>

                {/* Curated Company Quick Select Pills */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">
                    Popular Tech & Operations Companies:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
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
                              ? 'bg-[#0071E3] text-white shadow-sm'
                              : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                          }`}
                        >
                          <span>{c.name}</span>
                          <span
                            className={`text-[10px] px-1 py-0.2 rounded font-mono uppercase ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[rgba(0,0,0,0.06)] text-[#86868B]'
                            }`}
                          >
                            {c.slug === 'all' ? 'ALL' : c.slug === 'revolut' ? 'DIR' : c.ats.slice(0, 2)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Input & Search Filters Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                  <div className="sm:col-span-5 relative">
                    <Building2 className="w-4 h-4 text-[#86868B] absolute left-3 top-1/2 -translate-y-1/2" />
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
                      className="w-full pl-9 pr-3 py-2 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-xl text-xs text-[#1D1D1F] outline-none transition-all"
                    />
                  </div>

                  <div className="sm:col-span-4 relative">
                    <Search className="w-4 h-4 text-[#86868B] absolute left-3 top-1/2 -translate-y-1/2" />
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
                      className="w-full pl-9 pr-3 py-2 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-xl text-xs text-[#1D1D1F] outline-none transition-all"
                    />
                  </div>

                  <div className="sm:col-span-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCrawlAts()}
                      disabled={isCrawlingAts}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-[0_2px_8px_rgba(0,113,227,0.25)]"
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
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[rgba(0,0,0,0.06)] text-xs">
                  <div className="flex items-center gap-1.5 text-[#86868B] font-semibold text-[11px] uppercase tracking-wider shrink-0 mr-1">
                    <Filter className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>Filter By:</span>
                  </div>

                  {/* Seniority / Experience Level Dropdown */}
                  <div className="relative shrink-0">
                    <select
                      value={selectedSeniority}
                      onChange={(e) => setSelectedSeniority(e.target.value as SeniorityFilter)}
                      className="appearance-none pl-3 pr-7 py-1.5 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] font-medium rounded-xl text-xs outline-none cursor-pointer border border-transparent focus:border-[#0071E3] transition-all"
                    >
                      <option value="All">All Experience Levels</option>
                      <option value="Early / Junior">🌱 Early / Junior (0-2 yrs)</option>
                      <option value="Mid-Level">⚡ Mid-Level (2-5 yrs)</option>
                      <option value="Senior">⭐ Senior (5-8 yrs)</option>
                      <option value="Lead / Staff / Director">👑 Lead / Staff / Director (8+ yrs)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#86868B]">
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
                      className="appearance-none pl-3 pr-7 py-1.5 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] font-medium rounded-xl text-xs outline-none cursor-pointer border border-transparent focus:border-[#0071E3] transition-all"
                    >
                      <option value="All">All Workplace Modes</option>
                      <option value="Remote">🌐 Remote Only</option>
                      <option value="Hybrid">🏢 Hybrid</option>
                      <option value="On-site">📍 On-site Only</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#86868B]">
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
                      className="appearance-none pl-3 pr-7 py-1.5 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] font-medium rounded-xl text-xs outline-none cursor-pointer border border-transparent focus:border-[#0071E3] transition-all"
                    >
                      <option value="All">All Locations</option>
                      <option value="India">🇮🇳 India (Bengaluru, Hyderabad, etc.)</option>
                      <option value="United States">🇺🇸 United States (SF, NY, Austin, etc.)</option>
                      <option value="Europe / UK">🇪🇺 Europe / UK (London, Dublin, etc.)</option>
                      <option value="Remote">🌍 Global Remote</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#86868B]">
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
                      className="text-[11px] font-semibold text-[#0071E3] hover:text-[#0077ED] px-2.5 py-1 rounded-lg hover:bg-[#0071E3]/10 transition-colors cursor-pointer"
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
                        ? 'bg-[#34C759]/10 text-[#248A3D] border border-[#34C759]/20'
                        : 'bg-[#FF3B30]/10 text-[#D70015] border border-[#FF3B30]/20'
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
                      className="text-[#86868B] hover:text-[#1D1D1F] text-xs font-bold shrink-0 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Results Grid */}
                {atsJobs.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-[rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between text-xs text-[#86868B] flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>
                          Showing <strong className="text-[#1D1D1F] font-semibold">{filteredAtsJobs.length}</strong> active positions across <strong className="text-[#0071E3] font-semibold">{uniqueCompaniesCount} companies</strong>
                          {selectedAtsLocation !== 'All' && (
                            <span> in <strong className="text-[#0071E3] font-semibold">{selectedAtsLocation}</strong></span>
                          )}
                          {selectedSeniority !== 'All' && <span> · <span className="text-[#1D1D1F] font-medium">{selectedSeniority}</span></span>}
                          {selectedWorkplace !== 'All' && <span> · <span className="text-[#1D1D1F] font-medium">{selectedWorkplace}</span></span>}
                          {filteredAtsJobs.length < atsJobs.length && (
                            <span className="text-[#86868B] text-[11px]"> (filtered from {atsJobs.length} loaded)</span>
                          )}
                        </span>
                        <span className="text-[10px] bg-[#0071E3]/10 text-[#0071E3] font-medium px-2 py-0.5 rounded-full font-mono">
                          Index: {totalInCatalogue.toLocaleString()}+ Live Roles · 172 ATS Platforms
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#248A3D] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
                        Live Stream Connected
                      </span>
                    </div>

                    {filteredAtsJobs.length === 0 ? (
                      <div className="p-8 text-center bg-[#F5F5F7] rounded-2xl space-y-2">
                        <p className="text-sm font-semibold text-[#1D1D1F]">No positions match your selected filters</p>
                        <p className="text-xs text-[#86868B]">
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
                          className="mt-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-colors cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
                        {filteredAtsJobs.map((job) => {
                          const isImported = importedAtsIds.has(job.id);
                          return (
                            <div
                              key={job.id}
                              className="apple-card p-4 flex flex-col justify-between gap-2.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all bg-white"
                            >
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="space-y-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-[11px] font-bold text-[#1D1D1F]">
                                        {job.company}
                                      </span>
                                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-[#F5F5F7] text-[#6E6E73]">
                                        {job.platform}
                                      </span>
                                      {job.seniority && (
                                        <span
                                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                            job.seniority === 'Early / Junior'
                                              ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                                              : job.seniority === 'Mid-Level'
                                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                              : job.seniority === 'Senior'
                                              ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                                              : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                          }`}
                                        >
                                          {job.seniority}
                                        </span>
                                      )}
                                      {job.workplaceType && (
                                        <span
                                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                            job.workplaceType === 'Remote'
                                              ? 'bg-[#34C759]/10 text-[#248A3D]'
                                              : job.workplaceType === 'Hybrid'
                                              ? 'bg-[#FF9500]/10 text-[#FF9500]'
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
                                      className="font-display font-semibold text-sm text-[#1D1D1F] line-clamp-1"
                                      title={job.title}
                                    >
                                      {job.title}
                                    </h5>
                                    {job.department && (
                                      <p className="text-[11px] text-[#86868B] truncate">
                                        {job.department}
                                      </p>
                                    )}
                                  </div>

                                  {job.matchScore !== undefined && (
                                    <span
                                      className={`text-xs font-bold shrink-0 ${getScoreColor(job.matchScore)}`}
                                    >
                                      {job.matchScore}%
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 text-[11px] text-[#86868B] flex-wrap">
                                  <span className="flex items-center gap-1 truncate" title={job.location}>
                                    <MapPin className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{job.location}</span>
                                  </span>
                                  {job.salarySnippet && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#248A3D] bg-[#34C759]/10 px-2 py-0.5 rounded-md">
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
                                        className="text-[9px] font-mono px-1.5 py-0.5 bg-[#F5F5F7] text-[#6E6E73] rounded border border-[rgba(0,0,0,0.04)]"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {job.matchHighlight && (
                                  <p className="text-[11px] text-[#6E6E73] bg-[#F5F5F7] p-2 rounded-lg line-clamp-2">
                                    <span className="font-semibold text-[#1D1D1F]">Match: </span>
                                    {job.matchHighlight}
                                  </p>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center justify-between pt-2 border-t border-[rgba(0,0,0,0.04)] text-xs">
                                {job.applyUrl && (
                                  <a
                                    href={job.applyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-[#0071E3] hover:underline flex items-center gap-1 font-medium"
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
                                        ? 'bg-[#34C759]/10 text-[#248A3D]'
                                        : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                                    }`}
                                  >
                                    {isImported ? '✓ Added' : '+ Add Opportunity'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleImportAtsJob(job, true)}
                                    className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-all cursor-pointer shadow-sm"
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
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[rgba(0,0,0,0.06)] bg-[#F5F5F7]/70 p-4 rounded-2xl">
                        <div className="text-xs text-[#6E6E73] text-center sm:text-left">
                          <p className="font-semibold text-[#1D1D1F]">
                            Showing {filteredAtsJobs.length} active positions across {uniqueCompaniesCount} companies
                          </p>
                          <p className="text-[11px] text-[#86868B] mt-0.5">
                            {totalInCatalogue.toLocaleString()}+ matching positions indexed in live ATS pipeline
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
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] shadow-[0_2px_10px_rgba(0,113,227,0.25)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
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
                    ? 'bg-[#34C759]/10 text-[#248A3D] border border-[#34C759]/20'
                    : 'bg-[#FF3B30]/10 text-[#D70015] border border-[#FF3B30]/20'
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
                  className="text-[#86868B] hover:text-[#1D1D1F] text-xs font-bold shrink-0 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Evaluated Workspace Opportunities (Rendered if user has saved/evaluated roles) */}
            {filteredOpportunities.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                    <h3 className="font-display font-semibold text-sm sm:text-base text-[#1D1D1F]">
                      Saved & Evaluated Roles ({filteredOpportunities.length})
                    </h3>
                  </div>
                  {onClearOpportunities && (
                    <button
                      type="button"
                      onClick={onClearOpportunities}
                      className="px-3 py-1.5 text-xs text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-full transition-colors font-medium cursor-pointer"
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
                        onClick={() => onSelectPreset(job.id)}
                        className={`p-5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'bg-white border-[#0071E3] ring-2 ring-[#0071E3]/20 shadow-[0_4px_20px_rgba(0,113,227,0.1)]'
                            : 'bg-white border-[rgba(0,0,0,0.06)] hover:border-[#D2D2D7] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Top Meta */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-[13px] font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-[#86868B]" />
                                <span>{job.company}</span>
                              </span>
                              <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-[rgba(120,120,128,0.12)] text-[#6E6E73]">
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
                                  className="p-1 rounded-md text-[#86868B] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors"
                                  title="Remove listing"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Job Title */}
                          <h3 className="font-display text-base font-semibold text-[#1D1D1F] line-clamp-1">
                            {job.title}
                          </h3>

                          {/* Location */}
                          <div className="text-[13px] text-[#86868B] flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>

                          {/* Why You're Eligible / Assessment */}
                          <div className={`p-3 rounded-xl text-[12px] leading-snug ${
                            (job.matchScore || 0) < 60
                              ? 'bg-amber-50 text-amber-900 border border-amber-200/60'
                              : 'bg-[#F5F5F7] text-[#6E6E73]'
                          }`}>
                            <span className="font-semibold text-[#1D1D1F]">
                              {(job.matchScore || 0) < 60 ? 'Eligibility Notice: ' : 'Why you match: '}
                            </span>
                            <span>{job.matchHighlight}</span>
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center justify-between pt-3 border-t border-[rgba(0,0,0,0.04)] text-[13px]">
                          <span className={`font-medium ${isSelected ? 'text-[#0071E3] font-semibold' : 'text-[#86868B]'}`}>
                            {isSelected ? '✓ Selected' : 'Click to select'}
                          </span>

                          {job.applyUrl && (
                            <a
                              href={job.applyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[12px] text-[#0071E3] font-medium transition-colors hover:underline"
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
            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-semibold text-[#1D1D1F]">
                      Import from Job Posting URL
                    </h3>
                    <p className="text-xs text-[#86868B]">
                      Paste any public job listing link. We'll automatically scrape and extract the job description.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-medium text-[#86868B] bg-[#F5F5F7] px-2.5 py-1 rounded-full self-start sm:self-auto">
                  LinkedIn · Greenhouse · Lever · Ashby · Workday
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Link2 className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                    className="w-full pl-10 pr-3 py-2.5 text-[13px] bg-[#F5F5F7] border border-transparent rounded-xl text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleScrapeUrl}
                    disabled={isScraping || !customUrl.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(0,113,227,0.2)]"
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
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Verify listing is active on official portal and calculate match score"
                  >
                    {isVerifyingListing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#248A3D]" />
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
                      ? 'bg-[#34C759]/10 text-[#248A3D] border border-[#34C759]/20'
                      : 'bg-[#FF9500]/10 text-[#C93400] border border-[#FF9500]/20'
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
                    className="text-[#86868B] hover:text-[#1D1D1F] text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {verificationFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center justify-between gap-2 ${
                    verificationFeedback.type === 'success'
                      ? 'bg-[#34C759]/10 text-[#248A3D] border border-[#34C759]/20'
                      : 'bg-[#FF3B30]/10 text-[#D70015] border border-[#FF3B30]/20'
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
                    className="text-[#86868B] hover:text-[#1D1D1F] text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Subtle Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgba(0,0,0,0.06)]" />
              </div>
              <span className="relative px-4 bg-white text-[11px] font-semibold tracking-wider text-[#86868B] uppercase">
                Or Paste Job Description Manually
              </span>
            </div>

            {/* Step 2: Job Description Textarea */}
            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#5856D6]/10 text-[#5856D6] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-semibold text-[#1D1D1F]">
                      Job Description Text & Requirements
                    </h3>
                    <p className="text-xs text-[#86868B]">
                      Paste the responsibilities, minimum qualifications, and skills from the posting.
                    </p>
                  </div>
                </div>

                {customJobText.trim() && (
                  <button
                    type="button"
                    onClick={() => setCustomJobText('')}
                    className="text-xs font-medium text-[#86868B] hover:text-[#FF3B30] transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-[#FF3B30]/10"
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
                  className="w-full p-4 text-[13px] bg-[#F5F5F7] border border-transparent rounded-xl text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all font-sans leading-relaxed"
                />
              </div>

              {/* Action Bar for Custom JD */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[rgba(0,0,0,0.04)]">
                <div className="text-xs text-[#86868B]">
                  {customJobText.trim() ? (
                    <span className="text-[#248A3D] font-medium flex items-center gap-1.5">
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
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-[13px] font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(0,113,227,0.25)] shrink-0"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing & Tailoring Resume...</span>
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
          <div className="apple-card p-6 sm:p-8 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                {/* Score Circle */}
                <div className={`relative w-16 h-16 rounded-full bg-[#F5F5F7] border-2 ${
                  evaluation.match_score >= 80 ? 'border-[#34C759]' : evaluation.match_score >= 60 ? 'border-[#0071E3]' : 'border-[#FF9500]'
                } flex flex-col items-center justify-center shrink-0`}>
                  <span className={`font-display text-lg font-bold tabular-nums ${getScoreColor(evaluation.match_score)}`}>
                    {evaluation.match_score}%
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-[#86868B]">
                    MATCH
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`apple-badge text-[11px] ${evaluation.should_apply ? 'bg-[#34C759]/10 text-[#248A3D]' : 'bg-[#FF9500]/10 text-[#C93400]'}`}>
                      {evaluation.verdict.replace('_', ' ')}
                    </span>
                    <span className="text-[13px] text-[#86868B] font-medium">
                      {evaluation.should_apply ? '✓ Recommended' : 'Low Overlap'}
                    </span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1D1D1F]">
                    {evaluation.job_title}
                  </h2>
                  <div className="text-[13px] text-[#86868B] flex items-center gap-2 font-medium">
                    <span className="text-[#1D1D1F] font-semibold">{evaluation.company_name}</span>
                    {evaluation.location_info && (
                      <>
                        <span className="text-[#D2D2D7]">·</span>
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Tailoring Materials...</span>
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
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-full transition-all cursor-pointer whitespace-nowrap shadow-xs"
                    title="Simulate 3-Person Hiring Committee Review"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Recruiter Panel Review</span>
                  </button>
                )}

                <button
                  onClick={onProceedToResume}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-full transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>View Resume</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#86868B]" />
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
                        ? 'bg-[#34C759]/10 text-[#248A3D] hover:bg-[#34C759]/20'
                        : 'text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED]'
                    }`}
                    title={isTracked ? 'Application tracked' : 'Track in Applied Jobs'}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isTracked ? 'text-[#34C759]' : 'text-[#86868B]'}`} />
                    <span>{isTracked ? 'Tracked as Applied' : 'Mark as Applied'}</span>
                  </button>
                )}
              </div>
            </div>

            {evaluation.executive_summary && (
              <p className="text-[13px] text-[#6E6E73] border-t border-[rgba(0,0,0,0.06)] pt-4 leading-relaxed">
                <span className="font-semibold text-[#1D1D1F]">Assessment: </span>
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
                      <h3 className="font-display font-semibold text-base text-[#1D1D1F]">Matching Qualifications</h3>
                    </div>
                    <ul className="space-y-2.5 text-[13px] text-[#6E6E73]">
                      {evaluation.key_matching_factors.map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
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
                        <span className="apple-badge text-[11px] bg-[#FF9500]/10 text-[#C93400] font-semibold">
                          GAP ANALYSIS
                        </span>
                        <h3 className="font-display font-semibold text-base text-[#1D1D1F]">
                          Gaps & Where to Work
                        </h3>
                      </div>
                      {gapsList.length > 0 && (
                        <span className="text-[11px] text-[#86868B] font-medium">
                          {gapsList.length} {gapsList.length === 1 ? 'area' : 'areas'}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3 text-[13px]">
                      {gapsList.length > 0 ? (
                        gapsList.map((gap, idx) => (
                          <li
                            key={idx}
                            className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[rgba(0,0,0,0.06)] space-y-2"
                          >
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-[#FF9500] shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF9500]">
                                    What is Missing
                                  </span>
                                  {gap.severity && (
                                    <span
                                      className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                                        gap.severity === 'CRITICAL'
                                          ? 'bg-[#FF3B30]/10 text-[#D70015]'
                                          : 'bg-[#FF9500]/10 text-[#C93400]'
                                      }`}
                                    >
                                      {gap.severity}
                                    </span>
                                  )}
                                </div>
                                <span className="font-semibold text-[#1D1D1F] leading-snug block">
                                  {gap.missing}
                                </span>
                              </div>
                            </div>

                            <div className="pl-6 pt-1.5 border-t border-[rgba(0,0,0,0.04)] text-[12px] text-[#6E6E73] leading-relaxed">
                              <span className="font-semibold text-[#0071E3] flex items-center gap-1 mb-0.5">
                                <Target className="w-3 h-3" />
                                <span>Where to work on:</span>
                              </span>
                              <span>{gap.where_to_work}</span>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="p-4 rounded-xl bg-[#34C759]/5 border border-[#34C759]/15 flex items-start gap-2.5 text-[#248A3D]">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#34C759] mt-0.5" />
                          <div>
                            <span className="font-semibold block mb-0.5">No Critical Gaps Detected</span>
                            <span className="text-[12px] text-[#248A3D]/80">
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
                      <h3 className="font-display font-semibold text-base text-[#1D1D1F]">Tailoring Recommendations</h3>
                    </div>
                    <ul className="space-y-2.5 text-[13px] text-[#6E6E73]">
                      {evaluation.tailoring_recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#F5F5F7] text-[#6E6E73] text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[rgba(0,0,0,0.06)]">
                  <div className="space-y-1">
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1D1D1F]">
                      Skill Roadmap & Certifications
                    </h3>
                    <p className="text-[13px] text-[#86868B]">
                      Learning milestones and certifications to bridge gaps and reach 100% eligibility.
                    </p>
                  </div>

                  <div className="shrink-0">
                    {gapPercentage > 0 ? (
                      <span className="apple-badge text-[11px]">
                        {gapPercentage}% TO BRIDGE
                      </span>
                    ) : (
                      <span className="apple-badge bg-[#34C759]/10 text-[#248A3D] text-[11px]">
                        100% MATCH
                      </span>
                    )}
                  </div>
                </div>

                {/* 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Column 1: Learning Roadmap */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#1D1D1F] font-display font-semibold text-[13px] uppercase tracking-wider">
                      <Milestone className="w-4 h-4 text-[#86868B]" />
                      <span>Learning Roadmap</span>
                    </div>

                    <div className="space-y-3">
                      {roadmapSteps.map((step, idx) => {
                        const isCritical = step.importance === 'CRITICAL';
                        return (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#FAFAFA] text-[13px] space-y-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <span className="w-6 h-6 rounded-full bg-[#0071E3] text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="font-display font-semibold text-[#1D1D1F] text-[14px]">
                                  {step.skill}
                                </span>
                              </div>

                              <span className={`apple-badge text-[10px] ${isCritical ? 'bg-[#FF3B30]/10 text-[#D70015]' : ''}`}>
                                {step.importance || 'RECOMMENDED'}
                              </span>
                            </div>

                            <p className="text-[#6E6E73] leading-relaxed pl-[34px]">
                              {step.action_plan}
                            </p>

                            <div className="pt-2 border-t border-[rgba(0,0,0,0.04)] pl-[34px] flex flex-wrap gap-2 text-[11px]">
                              {step.timeline && (
                                <span className="inline-flex items-center gap-1 text-[#6E6E73] bg-white border border-[rgba(0,0,0,0.06)] px-2.5 py-1 rounded-lg font-medium">
                                  <Clock className="w-3 h-3 text-[#86868B]" />
                                  <span>{step.timeline}</span>
                                </span>
                              )}

                              {step.recommended_certification && (
                                <span className="inline-flex items-center gap-1 text-[#0071E3] bg-white border border-[rgba(0,0,0,0.06)] px-2.5 py-1 rounded-lg font-semibold">
                                  <Award className="w-3 h-3" />
                                  <span>{step.recommended_certification}</span>
                                </span>
                              )}
                            </div>

                            {step.practical_project && (
                              <div className="ml-[34px] p-3 rounded-xl bg-white border border-[rgba(0,0,0,0.06)] text-[12px] text-[#6E6E73] flex items-start gap-2">
                                <Target className="w-3.5 h-3.5 text-[#86868B] shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-semibold text-[#1D1D1F]">Project: </span>
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
                    <div className="flex items-center gap-2 text-[#1D1D1F] font-display font-semibold text-[13px] uppercase tracking-wider">
                      <Award className="w-4 h-4 text-[#86868B]" />
                      <span>Target Certifications</span>
                    </div>

                    <div className="space-y-3">
                      {certifications.map((cert, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#FAFAFA] text-[13px] space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-display font-semibold text-[#1D1D1F] text-[14px]">
                                {cert.name}
                              </h4>
                              <span className="text-[12px] text-[#0071E3] font-medium block mt-0.5">
                                {cert.issuer}
                              </span>
                            </div>

                            {cert.difficulty && (
                              <span className="apple-badge text-[10px]">
                                {cert.difficulty}
                              </span>
                            )}
                          </div>

                          <div className="text-[#6E6E73] text-[12px] flex items-start gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-[#86868B] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-[#1D1D1F]">Validates: </span>
                              <span>{cert.target_skill}</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-white border border-[rgba(0,0,0,0.06)] text-[12px] text-[#6E6E73]">
                            <span className="font-semibold text-[#1D1D1F]">Impact: </span>
                            <span>{cert.why_it_helps}</span>
                          </div>

                          <div className="flex items-center justify-between pt-2 text-[11px] text-[#86868B] font-medium border-t border-[rgba(0,0,0,0.04)]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Prep: {cert.estimated_time}</span>
                            </span>
                            <span className="text-[#34C759] font-semibold">
                              ATS Approved ✓
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tip Banner */}
                <div className="p-4 rounded-2xl bg-[#F5F5F7] flex items-start sm:items-center gap-3 text-[13px]">
                  <Lightbulb className="w-5 h-5 text-[#FF9500] shrink-0" />
                  <div className="leading-relaxed text-[#6E6E73]">
                    <span className="font-semibold text-[#1D1D1F]">Tip: </span>
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
        <div className="apple-card p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F5F5F7] flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7 text-[#86868B]" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1D1D1F]">
              Select a Role to Begin
            </h3>
            <p className="text-[13px] sm:text-sm text-[#86868B] max-w-md mx-auto leading-relaxed">
              Choose an opportunity from the live list above or switch to &quot;Paste Custom JD&quot; to evaluate your match score and generate tailored materials.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
