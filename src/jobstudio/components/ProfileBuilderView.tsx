// @ts-nocheck -- ported verbatim from the original project
import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Building2,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Plus,
  Trash2,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  Layers,
  UploadCloud,
  RefreshCw,
  GraduationCap,
  Award,
  Briefcase,
  Check,
  FileUp,
  File,
  X,
} from 'lucide-react';
import {
  CandidateProfileRecord,
  getUserMasterProfile,
  saveUserMasterProfile,
  profileRecordToResume,
  profileRecordToCandidateInfo,
  SUSHMIT_PROFILE_RECORD,
} from '../data/candidateProfiles';
import { CandidateInfo, TailoredResumeData } from '../data/defaultData';

interface ProfileBuilderViewProps {
  currentProfileText: string;
  setMasterProfileText: (val: string) => void;
  candidateInfo: CandidateInfo;
  setCandidateInfo: React.Dispatch<React.SetStateAction<CandidateInfo>>;
  resume: TailoredResumeData;
  setResume: React.Dispatch<React.SetStateAction<TailoredResumeData>>;
  userName: string;
  setUserName: (val: string) => void;
  userEmail: string;
  setUserEmail: (val: string) => void;
  isLoggedIn: boolean;
  onLogin: (name: string, email: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const ProfileBuilderView: React.FC<ProfileBuilderViewProps> = ({
  userName,
  userEmail,
  isLoggedIn,
  setMasterProfileText,
  setCandidateInfo,
  setResume,
  setUserName,
  setUserEmail,
  onLogin,
  onNavigateToTab,
}) => {
  // Single Master Profile for the active user
  const [selectedProfile, setSelectedProfile] = useState<CandidateProfileRecord>(() => {
    return getUserMasterProfile(userEmail, userName);
  });

  // Re-hydrate when user context changes
  useEffect(() => {
    const userProfile = getUserMasterProfile(userEmail, userName);
    setSelectedProfile(userProfile);
  }, [userEmail, userName]);

  // Editor Tabs: 'import' | 'builder' | 'vault'
  const [activeStudioTab, setActiveStudioTab] = useState<'import' | 'builder' | 'vault'>('import');

  // AI Import & PDF Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPdf, setUploadedPdf] = useState<{
    file: File;
    name: string;
    sizeFormatted: string;
    base64: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [importMode, setImportMode] = useState<'pdf' | 'text'>('pdf');
  const [rawResumeInput, setRawResumeInput] = useState<string>('');
  const [isParsingWithAi, setIsParsingWithAi] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Skill Input helper
  const [skillInput, setSkillInput] = useState<string>('');

  // Save / Action feedback
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Activate & synchronize the master profile across the entire application
  const applyProfileToApp = (profile: CandidateProfileRecord) => {
    setSelectedProfile(profile);
    saveUserMasterProfile(profile, userEmail);

    // 1. Sync User / Auth Info (keep logged-in userEmail intact as account key!)
    if (profile.name && profile.name !== 'Candidate' && profile.name !== 'Parsed Candidate') {
      setUserName(profile.name);
      if (typeof window !== 'undefined') {
        localStorage.setItem('jobstudio_user_name', profile.name);
      }
    }

    // 2. Sync Candidate Contact Info
    const cInfo = profileRecordToCandidateInfo(profile);
    setCandidateInfo(cInfo);

    // 3. Sync Active Master Resume
    const resData = profileRecordToResume(profile);
    setResume(resData);

    // 4. Sync Master Ground-Truth Profile Text (for AI ATS Tailoring)
    setMasterProfileText(profile.masterProfileText);

    // 5. Global window hook for PDF exports
    if (typeof window !== 'undefined') {
      (window as any).__JOBSTUDIO_ACTIVE_RESUME__ = resData;
    }

    setSaveSuccessMessage(`Master Profile for "${profile.name}" is now live across Job Evaluator, Tailored Resume, and ATS Interview tabs!`);
    setTimeout(() => setSaveSuccessMessage(null), 5000);
  };

  // Add Skill Tag
  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    const fresh = skillInput.trim();
    if (!selectedProfile.skills.includes(fresh)) {
      const updated = {
        ...selectedProfile,
        skills: [...selectedProfile.skills, fresh],
        updatedAt: Date.now(),
      };
      setSelectedProfile(updated);
    }
    setSkillInput('');
  };

  // Remove Skill Tag
  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = {
      ...selectedProfile,
      skills: selectedProfile.skills.filter((s) => s !== skillToRemove),
      updatedAt: Date.now(),
    };
    setSelectedProfile(updated);
  };

  // Add Experience Card
  const handleAddExperience = () => {
    const updated = {
      ...selectedProfile,
      experiences: [
        {
          title: 'Senior Specialist',
          company: 'Company Name',
          date_range: '2023 – Present',
          location: 'Remote',
          bullets: [
            'Led strategic initiatives that improved core performance metrics by 25%.',
            'Partnered with executive stakeholders to author SOPs and implement workflow automation.',
          ],
        },
        ...selectedProfile.experiences,
      ],
      updatedAt: Date.now(),
    };
    setSelectedProfile(updated);
  };

  // Update Experience Card Field
  const handleUpdateExperience = (index: number, field: string, value: any) => {
    const list = [...selectedProfile.experiences];
    list[index] = { ...list[index], [field]: value };
    setSelectedProfile({
      ...selectedProfile,
      experiences: list,
      updatedAt: Date.now(),
    });
  };

  // Add Bullet Point to Experience
  const handleAddBullet = (expIndex: number) => {
    const list = [...selectedProfile.experiences];
    list[expIndex].bullets.push('Delivered measurable operational enhancements and cross-functional project milestones.');
    setSelectedProfile({
      ...selectedProfile,
      experiences: list,
      updatedAt: Date.now(),
    });
  };

  // Remove Bullet Point from Experience
  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    const list = [...selectedProfile.experiences];
    list[expIndex].bullets.splice(bulletIndex, 1);
    setSelectedProfile({
      ...selectedProfile,
      experiences: list,
      updatedAt: Date.now(),
    });
  };

  // Remove Experience Card
  const handleRemoveExperience = (index: number) => {
    const list = selectedProfile.experiences.filter((_, i) => i !== index);
    setSelectedProfile({
      ...selectedProfile,
      experiences: list,
      updatedAt: Date.now(),
    });
  };

  // Add Education
  const handleAddEducation = () => {
    setSelectedProfile({
      ...selectedProfile,
      education: [
        ...selectedProfile.education,
        {
          degree: 'Bachelor of Science',
          institution: 'Accredited University',
          year: '2018 – 2022',
        },
      ],
      updatedAt: Date.now(),
    });
  };

  // Remove Education
  const handleRemoveEducation = (index: number) => {
    setSelectedProfile({
      ...selectedProfile,
      education: selectedProfile.education.filter((_, i) => i !== index),
      updatedAt: Date.now(),
    });
  };

  // Add Certification
  const handleAddCertification = () => {
    const name = window.prompt('Enter Certification Name (e.g., "AWS Solutions Architect", "Scrum Master", "PMP"):');
    if (!name || !name.trim()) return;
    setSelectedProfile({
      ...selectedProfile,
      certifications: [...selectedProfile.certifications, name.trim()],
      updatedAt: Date.now(),
    });
  };

  // Remove Certification
  const handleRemoveCertification = (index: number) => {
    setSelectedProfile({
      ...selectedProfile,
      certifications: selectedProfile.certifications.filter((_, i) => i !== index),
      updatedAt: Date.now(),
    });
  };

  // Auto-generate Markdown Master Vault text from the visual fields
  const handleSyncToVaultText = () => {
    const expText = selectedProfile.experiences
      .map(
        (e) => `**${e.company}** | ${e.title} | ${e.date_range}${e.location ? ` | ${e.location}` : ''}
${e.bullets.map((b) => `- ${b}`).join('\n')}`
      )
      .join('\n\n');

    const eduText = selectedProfile.education
      .map((ed) => `- ${ed.degree}, ${ed.institution} (${ed.year})`)
      .join('\n');

    const certText = selectedProfile.certifications.map((c) => `- ${c}`).join('\n');

    const vault = `### CANDIDATE: ${selectedProfile.name}
**Target Role / Headline:** ${selectedProfile.headline}
**Contact:** ${selectedProfile.email} | ${selectedProfile.phone} | ${selectedProfile.location} | ${selectedProfile.linkedin}

### PROFESSIONAL SUMMARY
${selectedProfile.summary}

### CORE COMPETENCIES & KEY TECHNICAL STACK
${selectedProfile.skills.join(', ')}

### VERIFIED PROFESSIONAL EXPERIENCE
${expText}

### EDUCATION
${eduText}

### CERTIFICATIONS & CREDENTIALS
${certText}
`;

    setSelectedProfile({
      ...selectedProfile,
      masterProfileText: vault,
      updatedAt: Date.now(),
    });
  };

  // File format and upload helpers
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processSelectedFile = (file: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setParseError('Please upload a valid PDF file (.pdf format).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setParseError('The selected PDF file exceeds 25MB. Please upload a smaller resume PDF.');
      return;
    }

    setParseError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setUploadedPdf({
          file,
          name: file.name,
          sizeFormatted: formatFileSize(file.size),
          base64: result,
        });
      }
    };
    reader.onerror = () => {
      setParseError('Failed to read the PDF file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearPdf = () => {
    setUploadedPdf(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // AI Resume Parsing Handler (supports PDF upload or raw text)
  const handleParseResumeWithAi = async () => {
    if (importMode === 'pdf') {
      if (!uploadedPdf) {
        setParseError('Please upload or drag-and-drop a PDF resume before analyzing.');
        return;
      }
    } else {
      if (!rawResumeInput.trim()) {
        setParseError('Please paste your resume text before running AI extraction.');
        return;
      }
    }

    setIsParsingWithAi(true);
    setParseError(null);

    try {
      const payload: any = {};
      if (importMode === 'pdf' && uploadedPdf) {
        payload.pdfBase64 = uploadedPdf.base64;
        payload.fileName = uploadedPdf.name;
        if (rawResumeInput.trim()) {
          payload.rawText = rawResumeInput.trim();
        }
      } else {
        payload.rawText = rawResumeInput.trim();
      }

      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.profile) {
        throw new Error(data.error || 'Failed to parse resume with AI.');
      }

      const p = data.profile;
      const parsedRecord: CandidateProfileRecord = {
        id: `profile-${userEmail}-${Date.now()}`,
        isPreset: false,
        name: p.full_name || userName || selectedProfile.name || 'Candidate',
        headline: p.headline || selectedProfile.headline || 'Professional Headline',
        email: p.email || userEmail || selectedProfile.email,
        phone: p.phone || selectedProfile.phone || '',
        location: p.location || selectedProfile.location || 'Remote',
        linkedin: p.linkedin || selectedProfile.linkedin || '',
        summary: p.summary || '',
        skills: Array.isArray(p.skills) && p.skills.length > 0 ? p.skills : [],
        experiences: Array.isArray(p.experiences) && p.experiences.length > 0 ? p.experiences : [],
        education: Array.isArray(p.education) && p.education.length > 0 ? p.education : [],
        certifications: Array.isArray(p.certifications) ? p.certifications : [],
        masterProfileText: p.master_profile_text || rawResumeInput,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      saveUserMasterProfile(parsedRecord, userEmail);
      setSelectedProfile(parsedRecord);
      applyProfileToApp(parsedRecord);

      setActiveStudioTab('builder');
      setSaveSuccessMessage(
        `🎉 Successfully parsed ${uploadedPdf?.name ? `PDF "${uploadedPdf.name}"` : 'resume'} for "${parsedRecord.name}"! Loaded contact details, ${parsedRecord.experiences.length} positions, and ${parsedRecord.skills.length} skills into your Master Profile.`
      );
      setTimeout(() => setSaveSuccessMessage(null), 7000);
    } catch (err: any) {
      console.error('Resume parsing error:', err);
      setParseError(err.message || 'Failed to parse resume. Check the file/text and try again.');
    } finally {
      setIsParsingWithAi(false);
    }
  };

  // Save changes to current master profile and update entire application
  const handleSaveAndActivate = () => {
    // 1. Ensure masterProfileText reflects any new changes
    handleSyncToVaultText();

    // 2. Persist to storage
    saveUserMasterProfile(selectedProfile, userEmail);

    // 3. Apply to live app
    applyProfileToApp(selectedProfile);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="workspace-profile space-y-6 max-w-5xl mx-auto pb-16">
      {/* Guest Mode Notice */}
      {!isLoggedIn && (
        <div className="bg-brand/5 border border-brand/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-brand shrink-0" />
            <span className="text-foreground">
              You are currently viewing in guest mode. <strong>Sign in or create a free account</strong> to save and isolate your personal Master Profile.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('home')}
            className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shrink-0 transition-colors cursor-pointer shadow-xs"
          >
            Create Free Account / Sign In
          </button>
        </div>
      )}

      {/* Top Banner & Header: Single User Master Profile */}
      <div className="apple-card p-6 sm:p-8 bg-card border border-border shadow-elevated space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="apple-badge-blue text-[10px] flex items-center gap-1 font-mono uppercase">
                <User className="w-3 h-3 text-brand" />
                MY MASTER PROFILE
              </span>
              <span className="text-[11px] font-mono text-success bg-success/10 px-2.5 py-0.5 rounded-full font-semibold">
                ● Live ATS Source of Truth
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              Master Profile
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Your single master profile powers all downstream job tailoring, evaluations, cover letters, and interview preparation. Upload your resume PDF or edit below.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveStudioTab('import');
                setImportMode('pdf');
                setTimeout(() => fileInputRef.current?.click(), 80);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-brand bg-brand/10 hover:bg-brand/20 rounded-full transition-all cursor-pointer"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Upload PDF Resume</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAndActivate}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all shadow-elevated cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Master Profile</span>
            </button>
          </div>
        </div>

        {/* Current User Identity Card */}
        <div className="pt-4 border-t border-border flex items-center justify-between flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-2xs">
              {getInitials(selectedProfile.name || userName)}
            </div>
            <div>
              <div className="font-bold text-sm text-foreground flex items-center gap-2">
                <span>{selectedProfile.name || userName}</span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                    selectedProfile.experiences.length > 0 || selectedProfile.skills.length > 0
                      ? 'bg-success/10 text-success'
                      : 'bg-warning/10 text-warning'
                  }`}
                >
                  {selectedProfile.experiences.length > 0 || selectedProfile.skills.length > 0
                    ? '● Master Profile Active'
                    : '○ Awaiting Resume Upload'}
                </span>
              </div>
              <div className="text-subtle text-xs">
                {selectedProfile.experiences.length > 0 || selectedProfile.skills.length > 0
                  ? `${selectedProfile.headline || 'Master Profile Active'} · ${selectedProfile.email || userEmail}`
                  : `Upload your resume PDF to auto-create profile · ${userEmail || selectedProfile.email}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-subtle">
            <span>{selectedProfile.experiences.length} positions · {selectedProfile.skills.length} skills</span>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {saveSuccessMessage && (
        <div className="p-4 rounded-2xl bg-success/10 text-success border border-success/20 flex items-center justify-between gap-3 text-xs sm:text-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-success" />
            <span className="font-medium">{saveSuccessMessage}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateToTab('evaluator')}
              className="text-xs font-semibold text-brand hover:underline"
            >
              Test with Live Jobs →
            </button>
            <button
              type="button"
              onClick={() => setSaveSuccessMessage(null)}
              className="text-subtle hover:text-foreground p-1 cursor-pointer font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Mode Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-1 bg-surface p-1 rounded-full text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveStudioTab('import')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeStudioTab === 'import'
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-subtle hover:text-foreground'
            }`}
          >
            <FileUp className="w-3.5 h-3.5 text-brand" />
            <span>Upload PDF / AI Import</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStudioTab('builder')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeStudioTab === 'builder'
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-subtle hover:text-foreground'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Interactive Resume Builder</span>
          </button>
          <button
            type="button"
            onClick={() => {
              handleSyncToVaultText();
              setActiveStudioTab('vault');
            }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeStudioTab === 'vault'
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-subtle hover:text-foreground'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Master Vault Context (Markdown)</span>
          </button>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveAndActivate}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all shadow-elevated cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save &amp; Activate Profile</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AI RESUME AUTO-IMPORTER (PDF UPLOAD + TEXT) */}
      {activeStudioTab === 'import' && (
        <div className="apple-card p-6 sm:p-8 bg-card border border-border shadow-elevated space-y-6">
          {/* Header & Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
            <div className="space-y-1">
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-brand" />
                <span>Upload Resume &amp; Create Master Profile</span>
              </h3>
              <p className="text-xs text-subtle">
                Upload your resume PDF or paste raw text. Gemini AI automatically parses contact details, work history, metric-driven bullets, and skills into your master profile.
              </p>
            </div>

            {/* Toggle: PDF Upload vs Text Paste */}
            <div className="flex items-center p-1 bg-surface rounded-full text-xs font-medium shrink-0">
              <button
                type="button"
                onClick={() => {
                  setImportMode('pdf');
                  setParseError(null);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  importMode === 'pdf'
                    ? 'bg-card text-foreground shadow-xs font-semibold'
                    : 'text-subtle hover:text-foreground'
                }`}
              >
                <FileUp className="w-3.5 h-3.5 text-brand" />
                <span>Upload PDF</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setImportMode('text');
                  setParseError(null);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  importMode === 'text'
                    ? 'bg-card text-foreground shadow-xs font-semibold'
                    : 'text-subtle hover:text-foreground'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-subtle" />
                <span>Paste Text</span>
              </button>
            </div>
          </div>

          {parseError && (
            <div className="p-3.5 rounded-xl bg-danger/10 text-danger border border-danger/20 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {/* MODE 1: PDF UPLOAD (DRAG & DROP) */}
          {importMode === 'pdf' && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="application/pdf,.pdf"
                className="hidden"
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-brand bg-brand/5 scale-[1.01]'
                    : uploadedPdf
                    ? 'border-success bg-success/5'
                    : 'border-border hover:border-brand hover:bg-surface/70 bg-surface'
                }`}
              >
                {uploadedPdf ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-danger/10 text-danger flex items-center justify-center shadow-xs">
                      <FileText className="w-9 h-9" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-success/15 text-success text-xs font-semibold rounded-full mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>PDF Ready for AI Extraction</span>
                      </div>
                      <h4 className="font-semibold text-base sm:text-lg text-foreground">
                        {uploadedPdf.name}
                      </h4>
                      <p className="text-xs text-subtle font-mono mt-0.5">
                        File Size: {uploadedPdf.sizeFormatted}
                      </p>
                    </div>

                    <div
                      className="flex items-center justify-center gap-3 pt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-xs font-semibold text-foreground bg-card hover:bg-surface rounded-full border border-[rgba(0,0,0,0.12)] shadow-2xs transition-all cursor-pointer"
                      >
                        Select Different PDF
                      </button>
                      <button
                        type="button"
                        onClick={handleClearPdf}
                        className="px-4 py-2 text-xs font-semibold text-danger hover:bg-danger/10 rounded-full transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-brand/10 text-brand flex items-center justify-center shadow-xs">
                      <FileUp className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base sm:text-lg text-foreground">
                        Drag &amp; drop your resume PDF here
                      </h4>
                      <p className="text-xs sm:text-sm text-subtle mt-1">
                        or <span className="text-brand underline font-medium">browse files</span> to upload from your device
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-card rounded-full border border-border text-[11px] text-subtle shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      <span>Supports PDF (up to 25MB) · Native Multimodal AI Parsing</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons for PDF Mode */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-xs text-subtle">
                  Extracts: Contact Details, Role Timeline, Bullets, Skills, Education &amp; Certifications.
                </span>

                <button
                  type="button"
                  onClick={handleParseResumeWithAi}
                  disabled={isParsingWithAi || !uploadedPdf}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-xs sm:text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all shadow-elevated disabled:opacity-50 cursor-pointer"
                >
                  {isParsingWithAi ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing PDF &amp; Extracting Profile with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Extract &amp; Create Master Profile from PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: RAW TEXT / MARKDOWN PASTE */}
          {importMode === 'text' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-subtle">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Raw Resume or LinkedIn Text:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setRawResumeInput(`Alex Rivera
Senior Software Engineer | San Francisco, CA | alex.rivera@gmail.com | (555) 234-5678 | linkedin.com/in/alex-rivera

SUMMARY:
Full-stack software engineer with 5 years of experience building scalable microservices and responsive web platforms. Proficient in React, TypeScript, Node.js, and AWS.

EXPERIENCE:
Staff Software Engineer | CloudFlow Inc. | 2021 - Present | Remote
- Led migration of monolith to 12 serverless microservices on AWS Lambda and DynamoDB, cutting infrastructure spend by 35%.
- Built customer-facing dashboard in Next.js and TailwindCSS with sub-second page loads.
- Mentored 6 engineers and instituted CI/CD testing with GitHub Actions.

Software Engineer | DevPulse | 2019 - 2021 | San Francisco, CA
- Developed RESTful APIs in Node.js handling 2M requests daily.
- Optimized PostgreSQL queries to reduce p99 response times from 450ms to 95ms.

EDUCATION:
B.S. in Computer Science | San Jose State University | 2015 - 2019

SKILLS:
TypeScript, JavaScript, React, Next.js, Node.js, Express, PostgreSQL, MongoDB, Redis, AWS (Lambda, S3, DynamoDB), Docker, Jest`)
                      }
                      className="text-brand hover:underline"
                    >
                      Paste Sample Software Engineer CV
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => setRawResumeInput('')}
                      className="text-subtle hover:text-foreground"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <textarea
                  value={rawResumeInput}
                  onChange={(e) => setRawResumeInput(e.target.value)}
                  placeholder="Paste raw text from your PDF, Word document, or LinkedIn profile here..."
                  rows={10}
                  className="w-full p-4 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-2xl text-xs sm:text-sm font-mono text-foreground outline-none transition-all leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-xs text-subtle">
                  Extracts: Contact Details, Role Timeline, Bullets, Skills, Education &amp; Certifications.
                </span>

                <button
                  type="button"
                  onClick={handleParseResumeWithAi}
                  disabled={isParsingWithAi || !rawResumeInput.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all shadow-elevated disabled:opacity-50 cursor-pointer"
                >
                  {isParsingWithAi ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing &amp; Extracting Profile with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Parse &amp; Auto-Build Profile with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INTERACTIVE STRUCTURED BUILDER */}
      {activeStudioTab === 'builder' && (
        <div className="space-y-6">
          {/* Section: Candidate Personal Info */}
          <div className="apple-card p-6 bg-card border border-border shadow-elevated space-y-4">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-brand" />
                  <span>1. Contact &amp; Candidate Headline</span>
                </h3>
                <p className="text-xs text-subtle">Official name and contact credentials used on resumes and job applications.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold text-[11px] uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={selectedProfile.name}
                  onChange={(e) => setSelectedProfile({ ...selectedProfile, name: e.target.value, updatedAt: Date.now() })}
                  className="w-full px-3 py-2 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-xl text-xs text-foreground outline-none transition-all"
                  placeholder="e.g. Sushmit Surendran"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold text-[11px] uppercase tracking-wider mb-1">Target Headline / Role</label>
                <input
                  type="text"
                  value={selectedProfile.headline}
                  onChange={(e) => setSelectedProfile({ ...selectedProfile, headline: e.target.value, updatedAt: Date.now() })}
                  className="w-full px-3 py-2 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-xl text-xs text-foreground outline-none transition-all"
                  placeholder="e.g. Operations Specialist / Senior SWE"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold text-[11px] uppercase tracking-wider mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={selectedProfile.email}
                    onChange={(e) => setSelectedProfile({ ...selectedProfile, email: e.target.value, updatedAt: Date.now() })}
                    className="w-full pl-8 pr-3 py-2 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-xl text-xs text-foreground outline-none transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold text-[11px] uppercase tracking-wider mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={selectedProfile.phone}
                    onChange={(e) => setSelectedProfile({ ...selectedProfile, phone: e.target.value, updatedAt: Date.now() })}
                    className="w-full pl-8 pr-3 py-2 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-xl text-xs text-foreground outline-none transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold text-[11px] uppercase tracking-wider mb-1">Location (City, Country)</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={selectedProfile.location}
                    onChange={(e) => setSelectedProfile({ ...selectedProfile, location: e.target.value, updatedAt: Date.now() })}
                    className="w-full pl-8 pr-3 py-2 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-xl text-xs text-foreground outline-none transition-all"
                    placeholder="e.g. San Francisco, CA (or Remote)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold text-[11px] uppercase tracking-wider mb-1">LinkedIn Profile URL</label>
                <div className="relative">
                  <Linkedin className="w-3.5 h-3.5 text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={selectedProfile.linkedin}
                    onChange={(e) => setSelectedProfile({ ...selectedProfile, linkedin: e.target.value, updatedAt: Date.now() })}
                    className="w-full pl-8 pr-3 py-2 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-xl text-xs text-foreground outline-none transition-all"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Professional Summary */}
          <div className="apple-card p-6 bg-card border border-border shadow-elevated space-y-3">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand" />
                  <span>2. Professional Executive Summary</span>
                </h3>
                <p className="text-xs text-subtle">A high-impact narrative highlighting your core competencies and career achievements.</p>
              </div>
            </div>

            <textarea
              value={selectedProfile.summary}
              onChange={(e) => setSelectedProfile({ ...selectedProfile, summary: e.target.value, updatedAt: Date.now() })}
              rows={4}
              className="w-full p-3.5 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-xl text-xs sm:text-sm text-foreground outline-none transition-all leading-relaxed"
              placeholder="Detail your overarching experience, domain leadership, and key business outcomes..."
            />
          </div>

          {/* Section: Work Experience */}
          <div className="apple-card p-6 bg-card border border-border shadow-elevated space-y-4">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand" />
                  <span>3. Work Experience ({selectedProfile.experiences.length} positions)</span>
                </h3>
                <p className="text-xs text-subtle">Your authentic work history with verifiable accomplishments and metrics.</p>
              </div>

              <button
                type="button"
                onClick={handleAddExperience}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand bg-brand/10 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-4">
              {selectedProfile.experiences.map((exp, expIdx) => (
                <div key={expIdx} className="p-4 rounded-2xl bg-surface/80 border border-border space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 text-xs">
                      <div>
                        <label className="block text-muted-foreground font-semibold text-[10px] uppercase mb-0.5">Job Title</label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => handleUpdateExperience(expIdx, 'title', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-card border border-transparent focus:border-brand rounded-lg text-xs font-semibold text-foreground outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-muted-foreground font-semibold text-[10px] uppercase mb-0.5">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(expIdx, 'company', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-card border border-transparent focus:border-brand rounded-lg text-xs text-foreground outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-muted-foreground font-semibold text-[10px] uppercase mb-0.5">Date Range</label>
                        <input
                          type="text"
                          value={exp.date_range}
                          onChange={(e) => handleUpdateExperience(expIdx, 'date_range', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-card border border-transparent focus:border-brand rounded-lg text-xs text-foreground outline-none font-mono"
                          placeholder="e.g. Oct 2022 – Present"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(expIdx)}
                      className="text-subtle hover:text-danger p-1.5 rounded-lg hover:bg-danger/10 transition-colors shrink-0"
                      title="Remove experience"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                      <span>Accomplishment Bullets ({exp.bullets.length}):</span>
                      <button
                        type="button"
                        onClick={() => handleAddBullet(expIdx)}
                        className="text-brand hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add bullet</span>
                      </button>
                    </div>

                    {exp.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-1.5">
                        <span className="text-brand font-bold text-xs mt-1.5">•</span>
                        <textarea
                          value={bullet}
                          onChange={(e) => {
                            const list = [...selectedProfile.experiences];
                            list[expIdx].bullets[bIdx] = e.target.value;
                            setSelectedProfile({ ...selectedProfile, experiences: list, updatedAt: Date.now() });
                          }}
                          rows={2}
                          className="flex-1 p-2 bg-card border border-transparent focus:border-brand rounded-lg text-xs text-foreground outline-none leading-relaxed resize-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(expIdx, bIdx)}
                          className="text-subtle hover:text-danger p-1 mt-1 rounded hover:bg-danger/10 transition-colors"
                          title="Remove bullet"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Skills */}
          <div className="apple-card p-6 bg-card border border-border shadow-elevated space-y-4">
            <div className="border-b border-border pb-3">
              <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand" />
                <span>4. Core Competencies &amp; Technical Skills ({selectedProfile.skills.length})</span>
              </h3>
              <p className="text-xs text-subtle">ATS keyword repository matched against incoming job opportunities.</p>
            </div>

            {/* Skill Input Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type a skill and press Enter (e.g. Python, React, SQL, SLA Governance)..."
                className="flex-1 px-3 py-2 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-xl text-xs text-foreground outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-foreground hover:bg-primary text-primary-foreground rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Add Skill
              </button>
            </div>

            {/* Skill Tags List */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedProfile.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface hover:bg-surface-2 text-foreground text-xs font-medium rounded-full transition-colors"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-subtle hover:text-danger text-xs cursor-pointer font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section: Education & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Education */}
            <div className="apple-card p-6 bg-card border border-border shadow-elevated space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-brand" />
                  <span>5. Education</span>
                </h4>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="text-[11px] font-semibold text-brand hover:underline"
                >
                  + Add Degree
                </button>
              </div>

              <div className="space-y-2">
                {selectedProfile.education.map((edu, edIdx) => (
                  <div key={edIdx} className="p-3 bg-surface rounded-xl flex items-start justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground">{edu.degree}</p>
                      <p className="text-subtle">{edu.institution} · <span className="font-mono">{edu.year}</span></p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(edIdx)}
                      className="text-subtle hover:text-danger p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="apple-card p-6 bg-card border border-border shadow-elevated space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
                  <Award className="w-4 h-4 text-success" />
                  <span>6. Certifications &amp; Licenses</span>
                </h4>
                <button
                  type="button"
                  onClick={handleAddCertification}
                  className="text-[11px] font-semibold text-brand hover:underline"
                >
                  + Add Cert
                </button>
              </div>

              <div className="space-y-1.5">
                {selectedProfile.certifications.map((cert, cIdx) => (
                  <div key={cIdx} className="p-2.5 bg-surface rounded-xl flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-foreground truncate">{cert}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCertification(cIdx)}
                      className="text-subtle hover:text-danger p-1 shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MASTER GROUND-TRUTH VAULT (MARKDOWN) */}
      {activeStudioTab === 'vault' && (
        <div className="apple-card p-6 sm:p-8 bg-card border border-border shadow-elevated space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand" />
                <span>Master Ground-Truth Vault (Markdown)</span>
              </h3>
              <p className="text-xs text-subtle">
                This is the raw, unhallucinated factual source of truth sent to Gemini AI for job evaluations, ATS score grading, and cover letters.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSyncToVaultText}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-brand bg-brand/10 hover:bg-brand/15 rounded-full transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync from Visual Builder</span>
            </button>
          </div>

          <textarea
            value={selectedProfile.masterProfileText}
            onChange={(e) => setSelectedProfile({ ...selectedProfile, masterProfileText: e.target.value, updatedAt: Date.now() })}
            rows={18}
            className="w-full p-4 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-2xl text-xs sm:text-sm font-mono text-foreground outline-none transition-all leading-relaxed"
          />
        </div>
      )}

      {/* Floating Bottom Action Bar */}
      <div className="sticky bottom-4 z-30 p-4 bg-card/90 backdrop-blur-xl border border-border shadow-elevated rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs shadow-xs">
            {getInitials(selectedProfile.name || userName)}
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {selectedProfile.experiences.length > 0 || selectedProfile.skills.length > 0 ? (
                <>Active Profile: <span className="text-brand">{selectedProfile.name || userName}</span></>
              ) : (
                <>Active Account: <span className="text-brand">{selectedProfile.name || userName}</span> (Awaiting Resume)</>
              )}
            </p>
            <p className="text-[11px] text-subtle truncate max-w-[280px]">
              {selectedProfile.experiences.length > 0 || selectedProfile.skills.length > 0
                ? `${selectedProfile.headline} · ${selectedProfile.experiences.length} positions · ${selectedProfile.skills.length} skills`
                : 'Upload your resume PDF or paste text to auto-populate'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {selectedProfile.experiences.length === 0 && selectedProfile.skills.length === 0 && (
            <button
              type="button"
              onClick={() => {
                setActiveStudioTab('import');
                setImportMode('pdf');
                setTimeout(() => fileInputRef.current?.click(), 80);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-brand bg-brand/10 hover:bg-brand/20 rounded-full transition-all cursor-pointer"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Upload Resume PDF</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveAndActivate}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all shadow-elevated cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save &amp; Activate Master Profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              handleSaveAndActivate();
              onNavigateToTab('evaluator');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-foreground hover:text-brand bg-surface hover:bg-brand/10 rounded-full transition-colors cursor-pointer"
          >
            <span>Job Evaluator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

