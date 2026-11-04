import React from 'react';
import { ArrowRight, LogIn, LogOut, LayoutDashboard } from 'lucide-react';

interface LandingHeaderProps {
  isLoggedIn: boolean;
  userName?: string;
  onNavigateToTab: (tab: string) => void;
  onLogout?: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  isLoggedIn,
  userName = '',
  onNavigateToTab,
  onLogout,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 max-w-6xl w-full mx-auto no-print">
      <div className="bg-card/85 backdrop-blur-xl border border-border shadow-elevated rounded-full h-14 px-4 sm:px-6 flex items-center justify-between gap-4 transition-all">
        {/* Brand */}
        <button
          type="button"
          onClick={() => {
            onNavigateToTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs tracking-wider shadow-xs group-hover:scale-105 transition-transform">
            JS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm tracking-tight text-foreground">
                Job Studio
              </span>
              <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand/10 text-brand font-medium">
                Autonomous Career Suite
              </span>
            </div>
          </div>
        </button>

        {/* Center Nav Links (Scrolls cleanly to sections on the homepage) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-muted-foreground">
          <button
            type="button"
            onClick={() => scrollTo('cine-story')}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => scrollTo('features-tour')}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            type="button"
            onClick={() => scrollTo('features-tour')}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            ATS Engine
          </button>
          <button
            type="button"
            onClick={() => scrollTo('pricing-section')}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Pricing
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={() => onNavigateToTab('auth')}
                className="px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-surface rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTab('auth')}
                className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-full shadow-xs transition-all cursor-pointer flex items-center gap-1.5 group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground mr-1">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="font-medium text-foreground truncate max-w-[120px]">
                  {userName.split(' ')[0] || 'User'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onNavigateToTab('evaluator')}
                className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-full shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Open Workspace</span>
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 text-muted-foreground hover:text-danger rounded-full transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
