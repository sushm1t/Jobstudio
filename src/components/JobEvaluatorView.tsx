import React, { useState } from 'react';
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
  GraduationCap,
  Award,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Milestone,
} from 'lucide-react';
import { JobEvaluationData, JobOpportunity, PRESET_JOBS } from '../data/defaultData';

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
  onEvaluate: () => void;
  isLoading: boolean;
  onProceedToResume: () => void;
}

export const JobEvaluatorView: React.FC<JobEvaluatorViewProps> = ({
  evaluation,
  opportunities = PRESET_JOBS,
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
}) => {
  const [activeInputMode, setActiveInputMode] = useState<'preset' | 'custom'>('preset');
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapeNotification, setScrapeNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Live opportunity verification & filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [verifyUrlInput, setVerifyUrlInput] = useState<string>('');
  const [isVerifyingListing, setIsVerifyingListing] = useState<boolean>(false);
  const [verificationFeedback, setVerificationFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Autonomous Web Job Discovery
  const [isDiscovering, setIsDiscovering] = useState<boolean>(false);
  const [discoveryLocation, setDiscoveryLocation] = useState<string>('India (Remote / Hybrid)');
  const [discoveryFeedback, setDiscoveryFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);

  const categories = [
    'All',
    'Real-Time Operations & WFM',
    'Incident & Service Ops',
    'Resource & Capacity Planning',
    'Implementation Operations',
    'Business Operations & Analytics',
    'Product Operations',
  ];

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

  // Autonomous Web Job Discovery Agent using Google Search Grounding
  const handleAutoDiscoverJobs = async () => {
    setIsDiscovering(true);
    setDiscoveryFeedback(null);
    try {
      const res = await fetch('/api/discover-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: discoveryLocation,
          roles: [
            'Real-Time Analyst / Workforce Management',
            'Product Operations Specialist',
            'Incident Management / Service Operations Lead',
            'Business Operations Analyst',
            'Operations Analyst',
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to auto-discover jobs across the web.');
      }

      if (data.opportunities && data.opportunities.length > 0) {
        if (onAddOpportunities) {
          onAddOpportunities(data.opportunities);
        }
        onSelectPreset(data.opportunities[0].id);
        setDiscoveryFeedback({
          type: 'success',
          message: `Discovered and verified ${data.opportunities.length} live matching vacancies across Google Search!`,
        });
      } else {
        setDiscoveryFeedback({
          type: 'error',
          message: 'No live jobs matching the criteria were returned. Please try searching with a broader location.',
        });
      }
    } catch (err: any) {
      setDiscoveryFeedback({
        type: 'error',
        message: err.message || 'Error auto-discovering jobs across the web.',
      });
    } finally {
      setIsDiscovering(false);
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
    const targetUrl = (inputUrl || verifyUrlInput).trim();
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
        setVerifyUrlInput('');
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

  // Filter opportunities based on category, platform, and keyword search
  const filteredOpportunities = opportunities.filter((job) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      job.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesPlatform =
      selectedPlatform === 'All' ||
      job.platform?.toLowerCase() === selectedPlatform.toLowerCase();

    const q = searchFilter.toLowerCase().trim();
    const matchesSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.matchHighlight.toLowerCase().includes(q);

    return matchesCategory && matchesPlatform && matchesSearch;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#34C759]';
    if (score >= 75) return 'text-[#0071E3]';
    if (score >= 60) return 'text-[#FF9500]';
    return 'text-[#FF3B30]';
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
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1D1D1F]">
              Target Opportunities
            </h2>
            <p className="text-sm text-[#86868B] mt-1">
              Live roles matched against your profile with automated ATS tailoring.
            </p>
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
              Live Roles ({opportunities.length})
            </button>
            <button
              onClick={() => setActiveInputMode('custom')}
              className={`px-4 py-2 rounded-[10px] transition-all cursor-pointer ${
                activeInputMode === 'custom'
                  ? 'bg-white text-[#1D1D1F] shadow-[0_1px_4px_rgba(0,0,0,0.08),0_0_1px_rgba(0,0,0,0.04)] font-semibold'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              Paste Custom JD
            </button>
          </div>
        </div>

        {/* Live Opportunities Mode */}
        {activeInputMode === 'preset' ? (
          <div className="space-y-4">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 text-[13px]">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#86868B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter by title, company, or skill..."
                  className="w-full pl-10 pr-3 py-2 bg-[#F5F5F7] border-0 rounded-xl text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all"
                />
              </div>

              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-2 px-3 bg-[#F5F5F7] border-0 rounded-xl text-[#1D1D1F] font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Specializations' : c}
                  </option>
                ))}
              </select>

              {/* Location */}
              <select
                value={discoveryLocation}
                onChange={(e) => setDiscoveryLocation(e.target.value)}
                className="py-2 px-3 bg-[#F5F5F7] border-0 rounded-xl text-[#1D1D1F] font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
              >
                <option value="India (Remote / Hybrid)">India (Remote / Hybrid)</option>
                <option value="Remote, India">Fully Remote (India)</option>
                <option value="Bengaluru / Hyderabad, India">Bengaluru / Hyderabad</option>
                <option value="Global Remote">Worldwide Remote</option>
              </select>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {(searchFilter || selectedCategory !== 'All' || selectedPlatform !== 'All' || selectedJobId) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchFilter('');
                      setSelectedCategory('All');
                      setSelectedPlatform('All');
                      onSelectPreset('');
                    }}
                    className="px-3 py-2 text-[13px] text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition-colors cursor-pointer whitespace-nowrap font-medium"
                    title="Clear filters and deselected job"
                  >
                    Clear All
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleAutoDiscoverJobs}
                  disabled={isDiscovering}
                  className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-colors cursor-pointer disabled:opacity-50"
                  title="Scan Google Search for live matching jobs"
                >
                  {isDiscovering ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-Scan</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className={`px-3 py-2 font-medium rounded-xl transition-colors cursor-pointer ${
                    showUrlInput
                      ? 'bg-[#E8E8ED] text-[#1D1D1F] font-semibold'
                      : 'bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                  title="Import a specific job URL"
                >
                  {showUrlInput ? 'Close' : '+ Import URL'}
                </button>
              </div>
            </div>

            {/* Import URL Box */}
            {showUrlInput && (
              <div className="p-3 bg-[#F5F5F7] rounded-2xl flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Globe className="w-4 h-4 text-[#86868B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={verifyUrlInput}
                    onChange={(e) => setVerifyUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleVerifyLiveJob();
                      }
                    }}
                    placeholder="Paste job link (LinkedIn, SmartRecruiters, Greenhouse, Ashby, Workday)..."
                    className="w-full pl-10 pr-3 py-2 text-[13px] bg-white border-0 rounded-xl text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleVerifyLiveJob()}
                  disabled={isVerifyingListing || !verifyUrlInput.trim()}
                  className="px-4 py-2 text-[13px] font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isVerifyingListing ? 'Verifying...' : 'Verify & Add'}
                </button>
              </div>
            )}

            {/* Notification Feedback */}
            {(discoveryFeedback || verificationFeedback) && (
              <div
                className={`p-3 rounded-2xl text-[13px] flex items-center justify-between gap-2 ${
                  (discoveryFeedback?.type || verificationFeedback?.type) === 'success'
                    ? 'bg-[#34C759]/10 text-[#248A3D] border border-[#34C759]/20'
                    : 'bg-[#FF3B30]/10 text-[#D70015] border border-[#FF3B30]/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  {(discoveryFeedback?.type || verificationFeedback?.type) === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{discoveryFeedback?.message || verificationFeedback?.message}</span>
                </div>
                <button
                  onClick={() => {
                    setDiscoveryFeedback(null);
                    setVerificationFeedback(null);
                  }}
                  className="text-[#86868B] hover:text-[#1D1D1F] text-xs font-bold shrink-0"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Opportunities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
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

                        <span className={`text-sm font-bold tabular-nums ${getScoreColor(job.matchScore)}`}>
                          {job.matchScore}%
                        </span>
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

                      {/* Why You're Eligible */}
                      <div className="p-3 rounded-xl bg-[#F5F5F7] text-[12px] text-[#6E6E73] leading-snug">
                        <span className="font-semibold text-[#1D1D1F]">Why you match: </span>
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

            {filteredOpportunities.length === 0 && (
              <div className="p-10 text-center bg-[#F5F5F7] border border-dashed border-[#D2D2D7] rounded-2xl space-y-2">
                <AlertCircle className="w-6 h-6 text-[#86868B] mx-auto" />
                <h4 className="font-display text-sm font-semibold text-[#1D1D1F]">No listings match this filter</h4>
                <p className="text-[13px] text-[#86868B] max-w-sm mx-auto">
                  Only confirmed live job postings are displayed. Paste an active vacancy URL above to verify and add it.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedPlatform('All');
                    setSearchFilter('');
                  }}
                  className="text-[13px] text-[#0071E3] font-medium hover:underline cursor-pointer pt-1"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#1D1D1F]">
                  Job Posting URL (Optional)
                </label>
                {customUrl.trim() && (
                  <button
                    type="button"
                    onClick={handleScrapeUrl}
                    disabled={isScraping}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0071E3] hover:text-[#0077ED] disabled:opacity-50 cursor-pointer transition-colors"
                  >
                    {isScraping ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Fetching Content...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-3 h-3" />
                        <span>Auto-Fetch Job Content</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://recruiting2.ultipro.com/WEA1003WEAV/... or Greenhouse / Lever / Workday URL"
                  className="flex-1 px-4 py-2.5 text-[13px] bg-[#F5F5F7] border-0 rounded-xl text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                />
                {customUrl.trim() && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleVerifyLiveJob(customUrl)}
                      disabled={isVerifyingListing}
                      className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-[13px] font-semibold cursor-pointer transition-colors shrink-0 disabled:opacity-50"
                    >
                      {isVerifyingListing ? 'Verifying...' : 'Verify Listing'}
                    </button>
                    <button
                      type="button"
                      onClick={handleScrapeUrl}
                      disabled={isScraping}
                      className="px-4 py-2 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] rounded-full text-[13px] font-medium cursor-pointer transition-colors shrink-0"
                    >
                      {isScraping ? 'Extracting...' : 'Fetch Text'}
                    </button>
                  </>
                )}
              </div>

              {scrapeNotification && (
                <div
                  className={`mt-3 p-3 rounded-xl text-[13px] flex items-start gap-2 ${
                    scrapeNotification.type === 'success'
                      ? 'bg-[#34C759]/10 text-[#248A3D] border border-[#34C759]/20'
                      : 'bg-[#FF9500]/10 text-[#C93400] border border-[#FF9500]/20'
                  }`}
                >
                  {scrapeNotification.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{scrapeNotification.message}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-[13px] font-medium text-[#1D1D1F] block mb-2">
                Job Description Text (Paste full JD here)
              </label>
              <textarea
                value={customJobText}
                onChange={(e) => setCustomJobText(e.target.value)}
                rows={5}
                placeholder="Paste the job description, key requirements, and company info here..."
                className="w-full p-4 text-[13px] bg-[#F5F5F7] border-0 rounded-xl text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3] font-sans leading-relaxed"
              />
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
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={onEvaluate}
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

                <button
                  onClick={onProceedToResume}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-full transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>View Resume</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#86868B]" />
                </button>
              </div>
            </div>

            {evaluation.executive_summary && (
              <p className="text-[13px] text-[#6E6E73] border-t border-[rgba(0,0,0,0.06)] pt-4 leading-relaxed">
                <span className="font-semibold text-[#1D1D1F]">Assessment: </span>
                {evaluation.executive_summary}
              </p>
            )}
          </div>

          {/* 2-Column: Key Qualifications & Tailoring Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Key Qualifications */}
            <div className="apple-card p-6 space-y-4">
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

            {/* Tailoring Strategy */}
            <div className="apple-card p-6 space-y-4">
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

            const certifications =
              evaluation.recommended_certifications && evaluation.recommended_certifications.length > 0
                ? evaluation.recommended_certifications
                : [
                    {
                      name: 'PL-300: Microsoft Power BI Data Analyst',
                      issuer: 'Microsoft',
                      target_skill: 'Advanced reporting, dashboard analytics & operational data modeling',
                      estimated_time: '2–3 weeks',
                      why_it_helps: 'Strong ATS keyword validation for analytics and business operations roles.',
                      difficulty: 'Intermediate',
                    },
                    {
                      name: 'ITIL 4 Foundation / Six Sigma Green Belt',
                      issuer: 'AXELOS / ASQ',
                      target_skill: 'Structured incident governance and process defect elimination',
                      estimated_time: '3–4 weeks',
                      why_it_helps: 'Universally recognized standard for operational management and SLA integrity.',
                      difficulty: 'Intermediate',
                    },
                  ];

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
