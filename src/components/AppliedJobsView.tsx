import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  ExternalLink,
  Calendar,
  MapPin,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  X,
  Building2,
  Filter,
  FileText,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { AppliedJobRecord, ApplicationStatus } from '../data/defaultData';

interface AppliedJobsViewProps {
  appliedJobs: AppliedJobRecord[];
  onAddJob: (job: Omit<AppliedJobRecord, 'id' | 'created_at'>) => void;
  onUpdateJob: (id: string, updates: Partial<AppliedJobRecord>) => void;
  onDeleteJob: (id: string) => void;
  onClearAllJobs?: () => void;
  onSelectForTailoring?: (job: AppliedJobRecord) => void;
  onViewScreening?: (job: AppliedJobRecord) => void;
}

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  Applied: {
    label: 'Applied',
    bg: 'bg-[#0071E3]/10',
    text: 'text-[#0071E3]',
    dot: 'bg-[#0071E3]',
  },
  'Under Review': {
    label: 'Under Review',
    bg: 'bg-[#FF9500]/10',
    text: 'text-[#C93400]',
    dot: 'bg-[#FF9500]',
  },
  Interviewing: {
    label: 'Interviewing',
    bg: 'bg-[#AF52DE]/10',
    text: 'text-[#AF52DE]',
    dot: 'bg-[#AF52DE]',
  },
  'Offer Received': {
    label: 'Offer Received',
    bg: 'bg-[#34C759]/10',
    text: 'text-[#248A3D]',
    dot: 'bg-[#34C759]',
  },
  Rejected: {
    label: 'Rejected',
    bg: 'bg-[#86868B]/10',
    text: 'text-[#86868B]',
    dot: 'bg-[#86868B]',
  },
  Archived: {
    label: 'Archived',
    bg: 'bg-[#787880]/10',
    text: 'text-[#787880]',
    dot: 'bg-[#787880]',
  },
};

const ALL_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Under Review',
  'Interviewing',
  'Offer Received',
  'Rejected',
  'Archived',
];

export const AppliedJobsView: React.FC<AppliedJobsViewProps> = ({
  appliedJobs,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
  onClearAllJobs,
  onSelectForTailoring,
  onViewScreening,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ApplicationStatus>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<AppliedJobRecord | null>(null);

  // Form State for Adding / Editing
  const [formCompany, setFormCompany] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formLocation, setFormLocation] = useState('Remote / Hybrid');
  const [formPlatform, setFormPlatform] = useState('Direct Portal');
  const [formUrl, setFormUrl] = useState('');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formMatchScore, setFormMatchScore] = useState<number | undefined>(90);
  const [formStatus, setFormStatus] = useState<ApplicationStatus>('Applied');
  const [formSalary, setFormSalary] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const openAddModal = () => {
    setEditingJob(null);
    setFormCompany('');
    setFormTitle('');
    setFormLocation('Remote / Hybrid');
    setFormPlatform('Direct Portal');
    setFormUrl('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormMatchScore(90);
    setFormStatus('Applied');
    setFormSalary('');
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (job: AppliedJobRecord) => {
    setEditingJob(job);
    setFormCompany(job.company_name);
    setFormTitle(job.job_title);
    setFormLocation(job.location || '');
    setFormPlatform(job.platform || 'Direct Portal');
    setFormUrl(job.apply_url || '');
    setFormDate(job.applied_date || new Date().toISOString().split('T')[0]);
    setFormMatchScore(job.match_score);
    setFormStatus(job.status);
    setFormSalary(job.salary || '');
    setFormNotes(job.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany.trim() || !formTitle.trim()) return;

    if (editingJob) {
      onUpdateJob(editingJob.id, {
        company_name: formCompany.trim(),
        job_title: formTitle.trim(),
        location: formLocation.trim() || undefined,
        platform: formPlatform.trim() || undefined,
        apply_url: formUrl.trim() || undefined,
        applied_date: formDate,
        match_score: formMatchScore,
        status: formStatus,
        salary: formSalary.trim() || undefined,
        notes: formNotes.trim() || undefined,
      });
    } else {
      onAddJob({
        company_name: formCompany.trim(),
        job_title: formTitle.trim(),
        location: formLocation.trim() || undefined,
        platform: formPlatform.trim() || undefined,
        apply_url: formUrl.trim() || undefined,
        applied_date: formDate,
        match_score: formMatchScore,
        status: formStatus,
        salary: formSalary.trim() || undefined,
        notes: formNotes.trim() || undefined,
      });
    }

    setIsAddModalOpen(false);
    setEditingJob(null);
  };

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return appliedJobs
      .filter((job) => {
        if (statusFilter !== 'All' && job.status !== statusFilter) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          job.company_name.toLowerCase().includes(q) ||
          job.job_title.toLowerCase().includes(q) ||
          (job.location && job.location.toLowerCase().includes(q)) ||
          (job.platform && job.platform.toLowerCase().includes(q)) ||
          (job.notes && job.notes.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
  }, [appliedJobs, statusFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = appliedJobs.length;
    const applied = appliedJobs.filter((j) => j.status === 'Applied').length;
    const reviewing = appliedJobs.filter((j) => j.status === 'Under Review').length;
    const interviewing = appliedJobs.filter((j) => j.status === 'Interviewing').length;
    const offered = appliedJobs.filter((j) => j.status === 'Offer Received').length;
    const scores = appliedJobs.map((j) => j.match_score).filter((s): s is number => typeof s === 'number');
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

    return { total, applied, reviewing, interviewing, offered, avgScore };
  }, [appliedJobs]);

  // Export to CSV
  const handleExportCsv = () => {
    if (appliedJobs.length === 0) return;
    const headers = ['Company', 'Job Title', 'Status', 'Applied Date', 'Match Score', 'Location', 'Platform', 'Portal URL', 'Notes'];
    const rows = appliedJobs.map((j) => [
      `"${j.company_name.replace(/"/g, '""')}"`,
      `"${j.job_title.replace(/"/g, '""')}"`,
      `"${j.status}"`,
      `"${j.applied_date}"`,
      j.match_score ? `${j.match_score}%` : 'N/A',
      `"${(j.location || '').replace(/"/g, '""')}"`,
      `"${(j.platform || '').replace(/"/g, '""')}"`,
      `"${(j.apply_url || '').replace(/"/g, '""')}"`,
      `"${(j.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JobStudio_Applied_Jobs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* KPI / Metrics Header Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="apple-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">Total Applied</span>
          <div className="text-2xl font-bold text-[#1D1D1F] mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            {stats.total}
          </div>
          <span className="text-[10px] text-[#86868B] mt-0.5">Tracked applications</span>
        </div>

        <div className="apple-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#0071E3] uppercase tracking-wider">Sent / Pending</span>
          <div className="text-2xl font-bold text-[#0071E3] mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            {stats.applied}
          </div>
          <span className="text-[10px] text-[#86868B] mt-0.5">Awaiting initial review</span>
        </div>

        <div className="apple-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#FF9500] uppercase tracking-wider">Under Review</span>
          <div className="text-2xl font-bold text-[#C93400] mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            {stats.reviewing}
          </div>
          <span className="text-[10px] text-[#86868B] mt-0.5">Recruiter screening</span>
        </div>

        <div className="apple-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#AF52DE] uppercase tracking-wider">Interviewing</span>
          <div className="text-2xl font-bold text-[#AF52DE] mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            {stats.interviewing}
          </div>
          <span className="text-[10px] text-[#86868B] mt-0.5">Active interview rounds</span>
        </div>

        <div className="apple-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#34C759] uppercase tracking-wider">Offers</span>
          <div className="text-2xl font-bold text-[#248A3D] mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            {stats.offered}
          </div>
          <span className="text-[10px] text-[#86868B] mt-0.5">Offers received</span>
        </div>

        <div className="apple-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">Avg Match</span>
          <div className="text-2xl font-bold text-[#1D1D1F] mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            {stats.avgScore ? `${stats.avgScore}%` : '—'}
          </div>
          <span className="text-[10px] text-[#86868B] mt-0.5">ATS fit overlap</span>
        </div>
      </div>

      {/* Control Bar: Search, Filters, and New Application CTA */}
      <div className="apple-card p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, title, notes, or platform..."
            className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-full text-xs text-[#1D1D1F] placeholder-[#86868B] outline-none transition-all"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap text-xs font-medium ${
              statusFilter === 'All'
                ? 'bg-[#1D1D1F] text-white shadow-sm'
                : 'bg-[#F5F5F7] text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            All ({appliedJobs.length})
          </button>
          {ALL_STATUSES.map((st) => {
            const count = appliedJobs.filter((j) => j.status === st).length;
            if (count === 0 && statusFilter !== st) return null;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap text-xs font-medium flex items-center gap-1.5 ${
                  statusFilter === st
                    ? 'bg-[#1D1D1F] text-white shadow-sm'
                    : 'bg-[#F5F5F7] text-[#86868B] hover:text-[#1D1D1F]'
                }`}
              >
                <span>{st}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Actions: Add Application & Export */}
        <div className="flex items-center gap-2 shrink-0">
          {appliedJobs.length > 0 && (
            <button
              onClick={handleExportCsv}
              title="Export as CSV"
              className="p-2 text-[#86868B] hover:text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-full transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)] cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Track Application</span>
          </button>
        </div>
      </div>

      {/* Applications List */}
      {filteredJobs.length === 0 ? (
        <div className="apple-card p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F5F5F7] text-[#86868B] mx-auto flex items-center justify-center">
            <Briefcase className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="font-display font-semibold text-base text-[#1D1D1F]">
              {searchQuery || statusFilter !== 'All'
                ? 'No applications match your filter'
                : 'No Applications Tracked Yet'}
            </h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              {searchQuery || statusFilter !== 'All'
                ? 'Try clearing your search query or selecting "All" to view all tracked roles.'
                : 'Keep all your applied roles, interview statuses, and follow-ups in one unified workspace. Track applications directly from the Job Evaluator or add them manually.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {searchQuery || statusFilter !== 'All' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] rounded-full transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,113,227,0.25)]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Track Your First Application</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => {
            const statusStyle = STATUS_CONFIG[job.status] || STATUS_CONFIG.Applied;
            return (
              <div
                key={job.id}
                className="apple-card p-5 transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  {/* Company & Role */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] border border-[rgba(0,0,0,0.06)] flex items-center justify-center text-[#1D1D1F] font-semibold text-sm shrink-0">
                      {job.company_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display font-semibold text-base text-[#1D1D1F] truncate" title={job.job_title}>
                          {job.job_title}
                        </h4>
                        {job.match_score !== undefined && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#34C759]/10 text-[#248A3D]">
                            {job.match_score}% Match
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#86868B] flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="font-medium text-[#1D1D1F]">{job.company_name}</span>
                        {job.location && (
                          <>
                            <span className="text-[#D2D2D7]">·</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#86868B]" />
                              {job.location}
                            </span>
                          </>
                        )}
                        {job.platform && (
                          <>
                            <span className="text-[#D2D2D7]">·</span>
                            <span className="px-1.5 py-0.2 bg-[#F5F5F7] rounded text-[11px] text-[#6E6E73]">
                              {job.platform}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown Selector & Quick Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <div className="relative inline-block">
                      <select
                        value={job.status}
                        onChange={(e) =>
                          onUpdateJob(job.id, {
                            status: e.target.value as ApplicationStatus,
                          })
                        }
                        className={`appearance-none cursor-pointer text-xs font-semibold px-3 py-1.5 pr-7 rounded-full border border-transparent transition-all outline-none ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {ALL_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className={`w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${statusStyle.text}`}
                      />
                    </div>

                    <button
                      onClick={() => openEditModal(job)}
                      title="Edit application details"
                      className="p-1.5 text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-full transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Remove ${job.company_name} - ${job.job_title} from your tracker?`)) {
                          onDeleteJob(job.id);
                        }
                      }}
                      title="Delete application"
                      className="p-1.5 text-[#86868B] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-full transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Metadata & Notes row */}
                <div className="border-t border-[rgba(0,0,0,0.04)] pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#86868B]">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1.5 text-[#6E6E73]">
                      <Calendar className="w-3.5 h-3.5 text-[#86868B]" />
                      Applied: {job.applied_date || 'Recent'}
                    </span>
                    {job.salary && (
                      <span className="text-[#1D1D1F] font-medium bg-[#F5F5F7] px-2 py-0.5 rounded">
                        {job.salary}
                      </span>
                    )}
                    {job.apply_url && (
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#0071E3] hover:underline font-medium"
                      >
                        <span>Portal Listing</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Cross-Tab Jumps */}
                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                    {onSelectForTailoring && (
                      <button
                        onClick={() => onSelectForTailoring(job)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                        title="Open tailored resume for this job"
                      >
                        <FileText className="w-3 h-3 text-[#0071E3]" />
                        <span>Resume</span>
                      </button>
                    )}
                    {onViewScreening && (
                      <button
                        onClick={() => onViewScreening(job)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                        title="View ATS answers and interview prep"
                      >
                        <HelpCircle className="w-3 h-3 text-[#FF9500]" />
                        <span>ATS Prep</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Notes snippet if present */}
                {job.notes && (
                  <div className="bg-[#F5F5F7] rounded-xl p-3 text-xs text-[#5D5A63] leading-relaxed">
                    <span className="font-semibold text-[#1D1D1F]">Notes: </span>
                    {job.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Application Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.08)] max-w-lg w-full p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="apple-badge-blue text-[11px]">TRACKER</span>
              <h3 className="font-display font-semibold text-lg text-[#1D1D1F]">
                {editingJob ? 'Edit Application' : 'Track New Application'}
              </h3>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  placeholder="e.g. Revolut, Honeywell, Google"
                  className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-xl text-xs text-[#1D1D1F] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Real-Time Operations SME / Product Ops Lead"
                  className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-xl text-xs text-[#1D1D1F] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-xl text-xs text-[#1D1D1F] outline-none transition-all"
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                    Applied Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-xl text-xs text-[#1D1D1F] outline-none transition-all"
                  >
                  </input>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                    Location / Work Type
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Remote Hybrid / Bengaluru"
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-xl text-xs text-[#1D1D1F] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                    Platform / ATS
                  </label>
                  <input
                    type="text"
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value)}
                    placeholder="e.g. Workday, SmartRecruiters, LinkedIn"
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-xl text-xs text-[#1D1D1F] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                    Match Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formMatchScore ?? ''}
                    onChange={(e) => setFormMatchScore(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 94"
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-xl text-xs text-[#1D1D1F] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                    Target Compensation
                  </label>
                  <input
                    type="text"
                    value={formSalary}
                    onChange={(e) => setFormSalary(e.target.value)}
                    placeholder="e.g. ₹22-26 LPA"
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-xl text-xs text-[#1D1D1F] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                  Portal URL / Listing Link
                </label>
                <input
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-xl text-xs text-[#1D1D1F] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                  Notes / Interview Next Steps
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Recruiter contact, interview scheduled date, screening questions asked, etc."
                  className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-xl text-xs text-[#1D1D1F] outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[rgba(0,0,0,0.06)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-all shadow-[0_2px_8px_rgba(0,113,227,0.3)] cursor-pointer"
                >
                  {editingJob ? 'Save Changes' : 'Add to Applications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
