import { deriveLeveragePoints } from './leveragePoints';

export function getRoleFamily(title: string, description = '') {
  const classify = (text: string) => {
    if (/\b(ai|llm|machine learning|ml|generative|artificial intelligence)\b/i.test(text)) return 'AI engineering';
    if (/\b(data scien|statistic|data analy|analytics)/i.test(text)) return 'Data science & analytics';
    if (/\b(sales|account executive|sdr|bdr|business development|gtm)\b/i.test(text)) return 'Sales & GTM';
    if (/\b(operations|operational|travel|tourism|hospitality|supply chain|logistics|workforce)\b/i.test(text)) return 'Operations';
    if (/\b(engineer|developer|software|programmer)\b/i.test(text)) return 'Software engineering';
    if (/\b(design|artist|creative|illustrat)\b/i.test(text)) return 'Design & creative';
    return undefined;
  };
  return classify(title) || classify(description) || 'Role-specific';
}

const TOPICS: Record<string, string[]> = {
  'AI engineering': ['How would you evaluate a RAG system and reduce unsupported answers?', 'How would you balance model quality, latency, cost, and privacy in production?', 'Describe how you would investigate a model failure and monitor the fix.'],
  'Data science & analytics': ['How would you test whether a business metric changed because of an intervention?', 'How would you detect data leakage and choose suitable validation metrics?', 'Describe how you would turn a messy dataset into a decision stakeholders can use.'],
  'Sales & GTM': ['How would you qualify a prospect and uncover the problem behind their request?', 'How would you handle a pricing objection without promising unsupported outcomes?', 'How would you prioritize a pipeline and investigate why deals are stalling?'],
  Operations: ['How would you prioritize demand when staffing or capacity is constrained?', 'How would you investigate a process bottleneck while protecting service quality?', 'Describe how you would coordinate stakeholders during a service disruption.'],
  'Software engineering': ['How would you design and test a reliable service for this role?', 'How would you investigate a production defect and prevent recurrence?', 'Explain a technical trade-off you made and how you evaluated alternatives.'],
  'Design & creative': ['Walk through your process from brief to final work and explain your decisions.', 'How would you incorporate conflicting feedback while protecting the project goal?', 'How would you evaluate whether your work meets user and accessibility needs?'],
  'Role-specific': ['Which requirements of this role can you demonstrate with a specific example?', 'How would you prioritize competing requirements in this role?', 'Describe a relevant challenge, your actions, and what you learned.'],
};

export function buildPracticeQuestions(title: string, description: string, profile: string) {
  const family = getRoleFamily(title, description);
  const evidence = deriveLeveragePoints(profile, 2);
  return {
    family,
    evidence,
    questions: (TOPICS[family] || []).map(q => ({ q, strategy: evidence
      ? `Use a relevant example from your saved profile: ${evidence}. Explain your own actions and the outcome; if this topic is not covered, describe your approach without claiming experience.`
      : 'Use a truthful example from your own experience, or explain your proposed approach. Do not claim tools, achievements, or numerical results you cannot support.' })),
  };
}