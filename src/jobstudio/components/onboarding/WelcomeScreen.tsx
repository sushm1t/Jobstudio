import { ArrowRight, Briefcase, Compass, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PATH = [
  { icon: User, title: 'Build your master profile', text: 'Upload a resume PDF or use the builder to establish your baseline.' },
  { icon: Compass, title: 'Evaluate target jobs', text: 'Discover live roles and score compatibility against your profile.' },
  { icon: FileText, title: 'Tailor documents', text: 'Generate a role-specific resume, cover letter, and referral message.' },
  { icon: Briefcase, title: 'Interview prep & tracking', text: 'Practice role questions, STAR coaching, and track your pipeline.' },
];

interface Props {
  userName: string;
  onStartTour: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ userName, onStartTour, onSkip }: Props) {
  const first = (userName || '').split(' ')[0];
  return (
    <section className="onboarding-welcome" aria-labelledby="onboarding-title">
      <p className="onboarding-eyebrow">Welcome to Job Studio</p>
      <h1 id="onboarding-title">{first ? `Hi ${first}, let's get you set up.` : "Let's get you set up."}</h1>
      <p className="onboarding-lead">
        Job Studio saves you time on searching, tailoring and preparing. Here's how it works.
      </p>
      <ol className="onboarding-path">
        {PATH.map((step, i) => (
          <li key={step.title}>
            <span className="onboarding-step-index">{i + 1}</span>
            <step.icon aria-hidden />
            <strong>{step.title}</strong>
            <span>{step.text}</span>
          </li>
        ))}
      </ol>
      <div className="onboarding-actions">
        <Button onClick={onStartTour}>Take the 2-minute tour <ArrowRight /></Button>
        <Button variant="ghost" onClick={onSkip}>Skip, start with my profile</Button>
      </div>
    </section>
  );
}
