import { ArrowLeft, Briefcase, CheckCircle2, ChevronDown, Compass, Download, FileText, HelpCircle, Layers, LogOut, Mail, Milestone, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sections = [
  { label: 'JOB SEARCH', items: [
    { id: 'evaluator', label: 'Job Evaluator', icon: Compass },
    { id: 'applied', label: 'Applied Jobs', icon: Briefcase },
    { id: 'roadmaps', label: 'Career Roadmaps', icon: Milestone },
  ] },
  { label: 'APPLICATION STUDIO', items: [
    { id: 'resume', label: 'Tailored Resume', icon: FileText },
    { id: 'cover-letter', label: 'Cover Letter', icon: Mail },
    { id: 'screening', label: 'ATS & Interview', icon: HelpCircle },
  ] },
  { label: 'WORKSPACE', items: [
    { id: 'profile', label: 'Master Profile', icon: User },
    { id: 'pricing', label: 'Pricing', icon: Sparkles },
  ] },
];

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  appliedCount: number;
  userName: string;
  isProUser: boolean;
  tailoredCount: number;
  onLogout: () => void;
  onDownloadPdf: () => void;
  isDownloading: boolean;
  downloadSuccess: boolean;
}

export function WorkspaceNavigation(props: Props) {
  const current = sections.flatMap(section => section.items).find(item => item.id === props.activeTab);
  return <>
    <aside className="workspace-sidebar no-print">
      <Button variant="ghost" className="workspace-brand" onClick={() => props.setActiveTab('evaluator')} title="Back to workspace">
        <span className="workspace-logo"><Layers /></span><span>Job Studio</span>
      </Button>
      <div className="workspace-account"><span className="workspace-avatar">{props.userName.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><div><strong>{props.userName.split(' ')[0]}'s workspace</strong><span>Personal workspace</span></div></div>
      <nav aria-label="Workspace navigation">
        {sections.map(section => <div className="workspace-nav-group" key={section.label}>
          <p>{section.label}</p>
          {section.items.map(item => <Button key={item.id} variant="ghost" aria-label={item.label} className={`workspace-nav-item ${props.activeTab === item.id ? 'is-active' : ''}`} aria-current={props.activeTab === item.id ? 'page' : undefined} onClick={() => props.setActiveTab(item.id)}>
            <item.icon /><span>{item.label}</span>{item.id === 'applied' && props.appliedCount > 0 && <span className="workspace-count">{props.appliedCount}</span>}
          </Button>)}
        </div>)}
      </nav>
      <div className="workspace-sidebar-bottom">
        <div className="workspace-plan"><span>{props.isProUser ? 'Pro plan' : 'Free plan'}</span><span className="text-muted-foreground">{props.isProUser ? 'Unlimited tailoring' : `${2 - Math.min(props.tailoredCount, 2)} of 2 resumes left`}</span></div>
        <Button variant="outline" className="w-full" onClick={() => props.setActiveTab('pricing')}>{props.isProUser ? 'Manage plan' : 'View plans'}<Sparkles /></Button>
        <div className="flex justify-between pt-4"><Button variant="ghost" size="sm" onClick={() => props.setActiveTab('home')} title="Open the public landing page"><ArrowLeft />View website</Button><Button variant="ghost" size="icon" title="Sign out" aria-label="Sign out" onClick={props.onLogout}><LogOut /></Button></div>
      </div>
    </aside>
    <header className="workspace-topbar no-print">
      <div className="workspace-breadcrumb"><span>Workspace</span><span className="text-subtle">/</span><strong>{current?.label}</strong></div>
      <label className="workspace-mobile-navigation"><span className="sr-only">Workspace section</span><select value={props.activeTab} onChange={event => props.setActiveTab(event.target.value)}>{sections.map(section => <optgroup key={section.label} label={section.label}>{section.items.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</optgroup>)}<option value="home">Home</option></select><ChevronDown /></label>
      <div className="flex items-center gap-3"><span className="workspace-plan-label">{props.isProUser ? 'Pro workspace' : 'Free workspace'}</span><Button variant="outline" size="sm" onClick={props.onDownloadPdf} disabled={props.isDownloading}>{props.downloadSuccess ? <CheckCircle2 /> : <Download />}<span>{props.downloadSuccess ? 'Saved PDF' : props.isDownloading ? 'Exporting…' : 'Export PDF'}</span></Button><Button variant="outline" size="sm" className="workspace-mobile-signout" aria-label="Sign out" title="Sign out" onClick={props.onLogout}><LogOut /><span>Sign out</span></Button></div>
    </header>
  </>;
}