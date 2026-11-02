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

  const categories = [
    'All',
    'Real-Time Operations & WFM',
    'Incident & Service Ops',
    'Resource & Capacity Planning',
    'Implementation Operations',
    'Business Operations & Analytics',
  ];

  const platforms = ['All', 'UltiPro', 'Oracle Cloud HCM', 'Greenhouse', 'LinkedIn', 'Lever', 'Ashby', 'Workable'];

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

  const getPlatformBadgeStyle = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'greenhouse':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'lever':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'ashby':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ultipro':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'oracle cloud hcm':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Target Job Selection Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>Target Opportunities & Match Intelligence</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified live opportunities matching Sushmit Surendran's master qualifications. Only confirmed active postings are displayed.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveInputMode('preset')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeInputMode === 'preset'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Confirmed Opportunities ({opportunities.length})
            </button>
            <button
              onClick={() => setActiveInputMode('custom')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeInputMode === 'custom'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paste Custom JD / URL
            </button>
          </div>
        </div>

        {/* Target Roles Supported by Master Vault */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Eligible Target Specializations (Verified Master Vault)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Business Operations',
              'Product Operations',
              'Implementation Operations',
              'Process Improvement',
              'Incident Management',
              'Real-Time Operations SME',
              'Operations Analyst',
              'Service Delivery',
              'AI Operations',
            ].map((role) => (
              <span
                key={role}
                className="text-[11px] px-2.5 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md font-medium shadow-2xs"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Verified Target Opportunities Area */}
        {activeInputMode === 'preset' ? (
          <div className="space-y-4">
            {/* Live Listing Verification Bar */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">
                    Verify & Add Live Job Listing
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Confirmed actual listings only — dummy or dead listings are rejected
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                    placeholder="Paste active vacancy URL (LinkedIn, Greenhouse, Lever, Ashby, Workday, UltiPro, etc.)..."
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleVerifyLiveJob()}
                  disabled={isVerifyingListing || !verifyUrlInput.trim()}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {isVerifyingListing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Live URL...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify & Add Listing</span>
                    </>
                  )}
                </button>
              </div>

              {verificationFeedback && (
                <div
                  className={`p-2.5 rounded-lg text-xs flex items-start gap-2 ${
                    verificationFeedback.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border border-rose-200 text-rose-900'
                  }`}
                >
                  {verificationFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <span className="font-semibold block">
                      {verificationFeedback.type === 'success'
                        ? 'Confirmed Active Listing'
                        : 'Verification Failed (Unverified Listings Are Not Displayed)'}
                    </span>
                    <span>{verificationFeedback.message}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Filter and Search Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Category:</span>
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter by company or role..."
                  className="w-full pl-8 pr-3 py-1 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Platform Filter Row */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-100">
              <span className="text-slate-500 font-medium shrink-0">Platform:</span>
              {platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPlatform(p)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
                    selectedPlatform === p
                      ? 'bg-indigo-100 text-indigo-900 font-bold border border-indigo-300'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Confirmed Opportunity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              {filteredOpportunities.map((job) => {
                const isSelected = selectedJobId === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => onSelectPreset(job.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 relative ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Top Meta: Company, Platform Badge, Match Score */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>{job.company}</span>
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${getPlatformBadgeStyle(
                              job.platform
                            )}`}
                          >
                            {job.platform}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold uppercase tracking-wider flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        </div>

                        <span
                          className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                            job.matchScore >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {job.matchScore}% Match
                        </span>
                      </div>

                      {/* Job Title */}
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {job.title}
                      </h3>

                      {/* Location */}
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>

                      {/* Eligibility Highlight Box */}
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 leading-snug">
                        <span className="font-semibold text-slate-900">Why You're Eligible: </span>
                        <span>{job.matchHighlight}</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-indigo-600">
                        <span>{isSelected ? '✓ Selected Target' : 'Click to Target'}</span>
                      </div>

                      {job.applyUrl && (
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-indigo-600 font-semibold transition-colors hover:underline"
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
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
                <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800">No verified listings match this filter</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Only confirmed live job postings are displayed. Paste an active vacancy URL above to verify and add it.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedPlatform('All');
                    setSearchFilter('');
                  }}
                  className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer pt-1"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Job Posting URL (Optional)
                </label>
                {customUrl.trim() && (
                  <button
                    type="button"
                    onClick={handleScrapeUrl}
                    disabled={isScraping}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50 cursor-pointer transition-colors"
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
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
                {customUrl.trim() && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleVerifyLiveJob(customUrl)}
                      disabled={isVerifyingListing}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shrink-0 disabled:opacity-50"
                    >
                      {isVerifyingListing ? 'Verifying...' : 'Verify Live Listing'}
                    </button>
                    <button
                      type="button"
                      onClick={handleScrapeUrl}
                      disabled={isScraping}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium cursor-pointer transition-colors shrink-0"
                    >
                      {isScraping ? 'Extracting...' : 'Fetch Text'}
                    </button>
                  </>
                )}
              </div>

              {scrapeNotification && (
                <div
                  className={`mt-2 p-2.5 rounded-lg text-xs flex items-start gap-2 ${
                    scrapeNotification.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}
                >
                  {scrapeNotification.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <span>{scrapeNotification.message}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Job Description Text (Paste full JD here)
              </label>
              <textarea
                value={customJobText}
                onChange={(e) => setCustomJobText(e.target.value)}
                rows={5}
                placeholder="Paste the job description, key requirements, and company info here..."
                className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 font-sans"
              />
            </div>
          </div>
        )}

        {/* Selected Target Summary & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            Selected Target Opportunity:{' '}
            <span className="font-bold text-slate-900">
              {evaluation.job_title}
            </span>{' '}
            at <span className="font-semibold text-slate-800">{evaluation.company_name}</span>
          </div>

          <button
            onClick={onEvaluate}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-60 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Tailoring Resume & Materials with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Evaluate & Tailor Resume for this Role</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Match Score & Verdict Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Big Circular Score */}
          <div className="relative w-20 h-20 rounded-full bg-slate-50 border-4 border-indigo-600 flex flex-col items-center justify-center shrink-0 shadow-xs">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {evaluation.match_score}
            </span>
            <span className="text-[10px] font-mono text-slate-500 -mt-1">/ 100</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {evaluation.verdict.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {evaluation.should_apply ? '✓ Recommended to Apply' : 'Skip Role'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {evaluation.job_title}
            </h2>
            <div className="text-xs text-slate-600 flex items-center gap-3">
              <span>{evaluation.company_name}</span>
              {evaluation.location_info && (
                <>
                  <span className="text-slate-300">·</span>
                  <span>{evaluation.location_info}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onProceedToResume}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
        >
          <span>View Tailored ATS Resume</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Executive Summary */}
      {evaluation.executive_summary && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <span className="font-semibold text-slate-900">Executive Assessment: </span>
          {evaluation.executive_summary}
        </div>
      )}

      {/* Grid: Strengths, Gaps, Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Strengths */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <h3>Key Matching Qualifications</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {evaluation.key_matching_factors.map((factor, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Skills / Gaps */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <h3>Potential Gaps & Mitigation</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {evaluation.missing_critical_skills.map((gap, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tailoring Recommendations */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
          <Lightbulb className="w-4 h-4 shrink-0" />
          <h3>Resume & Interview Tailoring Strategy</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {evaluation.tailoring_recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 text-xs text-slate-800 leading-relaxed flex items-start gap-2"
            >
              <span className="text-indigo-600 font-bold">#{idx + 1}</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
