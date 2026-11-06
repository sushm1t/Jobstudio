import { PlayCircle, ArrowLeft, Briefcase, Bug, ChevronDown, Compass, FileText, HelpCircle, Layers, LogOut, Milestone, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const sections = [
  {
    label: 'Candidate Base',
    items: [
      { id: 'profile', label: 'Master Profile', icon: User },
    ],
  },
  {
    label: 'Core Workflow',
    items: [
      { id: 'evaluator', label: 'Job Evaluator', icon: Compass },
      { id: 'resume', label: 'Tailored Documents', icon: FileText },
      { id: 'screening', label: 'Interview Prep', icon: HelpCircle },
      { id: 'applied', label: 'Applied Jobs', icon: Briefcase },
    ],
  },
  {
    label: 'Career Growth',
    items: [
      { id: 'roadmaps', label: 'Career Roadmaps', icon: Milestone },
    ],
  },
];

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  appliedCount: number;
  userName: string;
  userPlan?: 'free' | 'plus' | 'pro';
  isProUser: boolean;
  tailoredCount: number;
  onLogout: () => void;
  onStartTour?: () => void;
  activeRole?: string;
  onReportBug?: () => void;
}

export function WorkspaceNavigation(props: Props) {
  const plan = props.userPlan || (props.isProUser ? 'pro' : 'free');
  const current = sections.flatMap(section => section.items).find(item =>
    item.id === props.activeTab || (item.id === 'resume' && (props.activeTab === 'cover-letter' || props.activeTab === 'referral'))
  );
  const currentLabel = props.activeTab === 'cover-letter'
    ? 'Tailored Documents / Cover Letter'
    : props.activeTab === 'referral'
    ? 'Tailored Documents / Referral Message'
    : current?.label || (props.activeTab === 'pricing' ? 'Pricing' : 'Workspace');

  return <>
    <aside className="workspace-sidebar no-print">
      <Button
        variant="ghost"
        className="workspace-brand"
        onClick={() => {
          props.setActiveTab('home');
          window.scrollTo(0, 0);
        }}
        title="Job Studio - Home"
      >
        <span className="workspace-logo"><Layers /></span><span>Job Studio</span>
      </Button>
      <div className="workspace-account">
        <span className="workspace-avatar">{props.userName.split(' ').map(part => part[0]).slice(0, 2).join('')}</span>
        <div><strong>{props.userName.split(' ')[0]}'s workspace</strong><span>Personal workspace</span></div>
      </div>
      {props.activeRole && (
        <div className="px-3 pb-3">
          <div className="workspace-active-badge" title={props.activeRole}>
            <span className="workspace-active-dot" />
            <span className="truncate">{props.activeRole}</span>
          </div>
        </div>
      )}
      <nav aria-label="Workspace navigation">
        {sections.map(section => <div className="workspace-nav-group" key={section.label}>
          <p>{section.label}</p>
          {section.items.map(item => {
            const isActive = props.activeTab === item.id || (item.id === 'resume' && (props.activeTab === 'cover-letter' || props.activeTab === 'referral'));
            return (
              <Button
                key={item.id}
                data-tour={`nav-${item.id}`}
                variant="ghost"
                aria-label={item.label}
                className={`workspace-nav-item ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => props.setActiveTab(item.id)}
              >
                <item.icon />
                <span>{item.label}</span>
                {item.id === 'applied' && props.appliedCount > 0 && <span className="workspace-count">{props.appliedCount}</span>}
              </Button>
            );
          })}
        </div>)}
      </nav>
      <div className="workspace-sidebar-bottom">
        {props.onStartTour && <Button variant="ghost" size="sm" className="w-full justify-start" onClick={props.onStartTour}><PlayCircle />Take the tour</Button>}
        <div className="workspace-plan">
          <span>{plan === 'pro' ? 'Pro plan' : plan === 'plus' ? 'Plus plan' : 'Free plan'}</span>
          <span className="text-muted-foreground">
            {plan === 'pro'
              ? 'Unlimited tailoring'
              : plan === 'plus'
              ? `${Math.max(0, 50 - props.tailoredCount)} of 50 resumes left`
              : `${Math.max(0, 2 - props.tailoredCount)} of 2 resumes left`}
          </span>
        </div>
        <Button variant="outline" className="w-full" onClick={() => props.setActiveTab('pricing')}>
          {plan !== 'free' ? 'Manage plan' : 'View plans'}
          <Sparkles />
        </Button>
        {props.onReportBug && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-amber-400 cursor-pointer"
            onClick={props.onReportBug}
            title="Report bugs or feedback"
          >
            <Bug className="w-4 h-4 mr-2 text-amber-400" />
            Report a bug
          </Button>
        )}
        <div className="flex justify-between pt-2"><Button variant="ghost" size="sm" onClick={() => props.setActiveTab('home')} title="Open the public landing page"><ArrowLeft />View website</Button><Button variant="ghost" size="icon" title="Sign out" aria-label="Sign out" onClick={props.onLogout}><LogOut /></Button></div>
      </div>
    </aside>
    <header className="workspace-topbar no-print">
      <div className="flex items-center gap-3 min-w-0">
        <div className="workspace-breadcrumb">
          <span>Workspace</span>
          <span className="text-subtle">/</span>
          <strong>{currentLabel}</strong>
        </div>
        {props.activeRole && (
          <span className="workspace-active-badge hidden sm:inline-flex" title={props.activeRole}>
            <span className="workspace-active-dot" />
            <span className="truncate">{props.activeRole}</span>
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 min-w-0">
        <label className="workspace-mobile-navigation">
          <span className="sr-only">Workspace section</span>
          <select
            aria-label="Workspace section"
            value={props.activeTab === 'cover-letter' || props.activeTab === 'referral' ? 'resume' : props.activeTab}
            onChange={event => event.target.value === '__tour' ? props.onStartTour?.() : props.setActiveTab(event.target.value)}
          >
            {sections.map(section => (
              <optgroup key={section.label} label={section.label}>
                {section.items.map(item => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </optgroup>
            ))}
            <option value="home">Home</option>
            {props.onStartTour && <option value="__tour">Take the tour</option>}
          </select>
          <ChevronDown />
        </label>
        {props.activeRole && (
          <span className="workspace-active-badge text-[10px] py-0.5 px-2 max-w-[140px] truncate sm:hidden" title={props.activeRole}>
            <span className="workspace-active-dot" />
            <span className="truncate">{props.activeRole.replace('Active: ', '')}</span>
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="workspace-plan-label">{plan === 'pro' ? 'Pro workspace' : plan === 'plus' ? 'Plus workspace' : 'Free workspace'}</span>
        <Button variant="outline" size="sm" className="workspace-mobile-signout" aria-label="Sign out" title="Sign out" onClick={props.onLogout}><LogOut /><span>Sign out</span></Button>
      </div>
    </header>
  </>;
}