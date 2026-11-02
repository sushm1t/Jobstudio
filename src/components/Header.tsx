import React from 'react';
import { Download, CheckCircle2, Compass, FileText, Mail, HelpCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDownloadPdf: () => void;
  isDownloading: boolean;
  downloadSuccess?: boolean;
  score?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onDownloadPdf,
  isDownloading,
  downloadSuccess = false,
}) => {
  const tabs = [
    { id: 'evaluator', label: 'Job Evaluator', icon: Compass },
    { id: 'resume', label: 'Tailored Resume', icon: FileText },
    { id: 'cover-letter', label: 'Cover Letter', icon: Mail },
    { id: 'screening', label: 'ATS & Interview', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-2.5 z-40 px-3 sm:px-6 max-w-7xl w-full mx-auto">
      <div className="bg-white/80 backdrop-blur-xl border border-[rgba(0,0,0,0.04)] shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-full h-14 px-3 sm:px-5 flex items-center justify-between gap-3 transition-all duration-[0.25s] ease-in-out">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#1D1D1F] flex items-center justify-center text-white font-semibold text-xs">
            <span className="text-[11px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>JS</span>
          </div>
          <button
            onClick={() => setActiveTab('evaluator')}
            className="text-left group cursor-pointer"
          >
            <span className="text-sm sm:text-base font-semibold tracking-tight text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors duration-[0.25s] ease-in-out" style={{ fontFamily: 'var(--font-display)' }}>
              Job Studio
            </span>
          </button>
        </div>

        {/* Apple Segmented Control Navigation */}
        <nav className="flex items-center p-1 bg-[#F5F5F7] rounded-full text-xs font-medium">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-[0.25s] ease-in-out cursor-pointer whitespace-nowrap text-xs ${
                  isActive
                    ? 'bg-white text-[#1D1D1F] shadow-[0_1px_4px_rgba(0,0,0,0.1),0_0_1px_rgba(0,0,0,0.05)] font-semibold'
                    : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1D1D1F]' : 'text-[#86868B]'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onDownloadPdf}
            disabled={isDownloading}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-[0.25s] ease-in-out whitespace-nowrap cursor-pointer disabled:opacity-50 ${
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
        </div>
      </div>
    </header>
  );
};
