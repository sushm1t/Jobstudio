import React from 'react';
import {
  Download,
  CheckCircle2,
  Compass,
  FileText,
  Mail,
  HelpCircle,
  Briefcase,
  Milestone,
  Sparkles,
  User,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDownloadPdf: () => void;
  isDownloading: boolean;
  downloadSuccess?: boolean;
  score?: number;
  appliedCount?: number;
  isProUser?: boolean;
  tailoredCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onDownloadPdf,
  isDownloading,
  downloadSuccess = false,
  appliedCount = 0,
  isProUser = false,
  tailoredCount = 0,
  isLoggedIn = true,
  userName = 'Sushmit Surendran',
  onOpenAuthModal,
  onLogout,
}) => {
  const tabs = [
    { id: 'evaluator', label: 'Job Evaluator', icon: Compass },
    { id: 'roadmaps', label: 'Career Roadmaps', icon: Milestone },
    { id: 'resume', label: 'Tailored Resume', icon: FileText },
    { id: 'cover-letter', label: 'Cover Letter', icon: Mail },
    { id: 'screening', label: 'ATS & Interview', icon: HelpCircle },
    { id: 'applied', label: 'Applied Jobs', icon: Briefcase, count: appliedCount },
    { id: 'pricing', label: 'Pricing', icon: Sparkles },
    { id: 'profile', label: 'Master Profile', icon: User },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-2.5 z-40 px-2 sm:px-6 max-w-7xl w-full mx-auto">
      <div className="bg-white/85 backdrop-blur-xl border border-[rgba(0,0,0,0.06)] shadow-[0_2px_14px_rgba(0,0,0,0.06)] rounded-full h-14 px-3 sm:px-4 flex items-center justify-between gap-2 lg:gap-3 transition-all duration-[0.25s] ease-in-out">
        {/* Brand - Combined logo and title navigate to Home */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 sm:gap-2.5 shrink-0 group cursor-pointer text-left focus:outline-none"
          title="Job Studio - Home"
        >
          <div className="w-7 h-7 rounded-lg bg-[#1D1D1F] group-hover:bg-[#0071E3] flex items-center justify-center text-white font-semibold text-xs shadow-2xs transition-colors duration-[0.2s]">
            <span className="text-[11px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>JS</span>
          </div>
          <span className="text-sm sm:text-base font-semibold tracking-tight text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors duration-[0.2s]" style={{ fontFamily: 'var(--font-display)' }}>
            Job Studio
          </span>
        </button>

        {/* Apple Segmented Control Navigation - 1 Sleek Bar without scrolling */}
        <nav className="flex items-center p-0.5 sm:p-1 bg-[#F5F5F7] rounded-full text-xs font-medium overflow-x-auto lg:overflow-visible scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-full transition-all duration-[0.2s] ease-in-out cursor-pointer whitespace-nowrap text-[11px] xl:text-xs ${
                  isActive
                    ? 'bg-white text-[#1D1D1F] shadow-[0_1px_4px_rgba(0,0,0,0.1),0_0_1px_rgba(0,0,0,0.05)] font-semibold'
                    : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1D1D1F]' : 'text-[#86868B]'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.label.split(' ')[0]}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold transition-colors ${
                      isActive ? 'bg-[#0071E3] text-white' : 'bg-[#E5E5EA] text-[#6E6E73]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Plan / Auth Status */}
        <div className="flex items-center gap-2 shrink-0">
          {isLoggedIn && (
            isProUser ? (
              <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 bg-[#34C759]/15 text-[#248A3D] text-[11px] font-bold rounded-full font-mono">
                <span>★ PRO</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('pricing')}
                className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#1D1D1F] hover:text-[#0071E3] bg-[#F5F5F7] hover:bg-[#0071E3]/10 rounded-full transition-colors cursor-pointer"
                title="View pricing & upgrade to Pro"
              >
                <span>Free</span>
                <span className="text-[#0071E3] font-semibold">({2 - Math.min(tailoredCount, 2)} left)</span>
              </button>
            )
          )}

          {/* User Sign In / Profile */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#0071E3]/10 border-[#0071E3] text-[#0071E3]'
                    : 'bg-[#F5F5F7] border-transparent hover:border-[#0071E3]/30 text-[#1D1D1F]'
                }`}
                title={`My Master Profile (${userName})`}
              >
                <div className="w-5 h-5 rounded-full bg-[#0071E3] text-white font-bold text-[9px] flex items-center justify-center">
                  {getInitials(userName || 'User')}
                </div>
                <span className="hidden xl:inline text-xs font-semibold max-w-[85px] truncate">
                  {userName.split(' ')[0]}
                </span>
              </button>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="hidden sm:flex p-1.5 text-[#86868B] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-full transition-colors cursor-pointer"
                  title="Sign out of workspace"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : null}

          {/* Export PDF: Hidden on home page and hidden when user is logged out */}
          {isLoggedIn && activeTab !== 'home' && (
            <button
              onClick={onDownloadPdf}
              disabled={isDownloading}
              className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-[0.25s] ease-in-out whitespace-nowrap cursor-pointer disabled:opacity-50 ${
                downloadSuccess
                  ? 'bg-[#34C759] text-white shadow-[0_2px_8px_rgba(52,199,89,0.3)]'
                  : 'bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-[0_2px_8px_rgba(0,113,227,0.3)]'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Saved PDF</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>{isDownloading ? 'Exporting...' : 'Export PDF'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
