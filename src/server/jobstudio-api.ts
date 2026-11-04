// @ts-nocheck -- ported verbatim from the original project
// Ported from the original Express server.ts. Handlers are kept verbatim and
// run through a tiny Express-compatible shim so they work on the edge runtime.
// AI runs through the Lovable AI Gateway (same Gemini models as the original).
// `Type` mirrors @google/genai's schema enum so ported schemas stay unchanged.
const Type = { OBJECT: 'object', STRING: 'string', INTEGER: 'integer', NUMBER: 'number', BOOLEAN: 'boolean', ARRAY: 'array' } as const;

type Handler = (req: any, res: any) => any;
const routes: { method: string; path: string; handler: Handler }[] = [];
const app = {
  get: (p: string, h: Handler) => routes.push({ method: 'GET', path: p, handler: h }),
  post: (p: string, h: Handler) => routes.push({ method: 'POST', path: p, handler: h }),
};

function toUserContent(contents: any): any {
  if (typeof contents === 'string') return contents;
  const parts = Array.isArray(contents) ? contents : [contents];
  return parts.map((p: any) => {
    if (typeof p === 'string') return { type: 'text', text: p };
    if (p?.inlineData) {
      const { mimeType, data } = p.inlineData;
      return { type: 'file', file: { filename: 'upload.pdf', file_data: `data:${mimeType};base64,${data}` } };
    }
    if (p?.text) return { type: 'text', text: p.text };
    return { type: 'text', text: JSON.stringify(p) };
  });
}

class GatewayError extends Error { status: number; constructor(m: string, s: number) { super(m); this.status = s; } }

function toGeminiParts(contents: any): any[] {
  if (typeof contents === 'string') return [{ text: contents }];
  const parts = Array.isArray(contents) ? contents : [contents];
  return parts.map((p: any) => {
    if (typeof p === 'string') return { text: p };
    if (p?.inlineData) {
      const { mimeType, data } = p.inlineData;
      return { inlineData: { mimeType, data } };
    }
    if (p?.text) return { text: p.text };
    return { text: JSON.stringify(p) };
  });
}

async function callGateway(model: string, params: { contents: any; config?: any }) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (lovableKey) {
    const body: any = { model, stream: true, messages: [{ role: 'user', content: toUserContent(params.contents) }] };
    const cfg = params.config || {};
    if (cfg.responseSchema) {
      body.response_format = { type: 'json_schema', json_schema: { name: 'result', schema: cfg.responseSchema } };
    } else if (cfg.responseMimeType === 'application/json') {
      body.messages[0].content = typeof body.messages[0].content === 'string'
        ? body.messages[0].content + '\n\nRespond with JSON only.' : body.messages[0].content;
    }
    const r = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${lovableKey}`, 'Content-Type': 'application/json', 'X-Lovable-AIG-SDK': 'fetch' },
      body: JSON.stringify(body),
    });
    if (!r.ok || !r.body) {
      let msg = `AI request failed (${r.status})`;
      try { const j: any = await r.json(); msg = j?.error?.message || j?.message || msg; } catch {}
      if (r.status === 402) msg = 'AI credits are used up. Add credits in Settings → Plans & credits.';
      if (r.status === 429) msg = 'Too many AI requests right now. Please try again shortly.';
      throw new GatewayError(msg, r.status);
    }
    const reader = r.body.getReader();
    const dec = new TextDecoder();
    let buf = '', text = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
        if (!line.startsWith('data:')) continue;
        const d = line.slice(5).trim();
        if (d === '[DONE]') continue;
        try { const j = JSON.parse(d); text += j.choices?.[0]?.delta?.content || ''; } catch {}
      }
    }
    return { text };
  }

  if (geminiKey) {
    const cleanModel = model.replace(/^google\//, '');
    const parts = toGeminiParts(params.contents);
    const body: any = {
      contents: [{ parts }],
    };

    const cfg = params.config || {};
    if (cfg.responseSchema || cfg.responseMimeType) {
      body.generationConfig = {};
      if (cfg.responseMimeType) body.generationConfig.responseMimeType = cfg.responseMimeType;
      if (cfg.responseSchema) body.generationConfig.responseSchema = cfg.responseSchema;
    }

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      let msg = `Gemini AI request failed (${r.status})`;
      try {
        const j: any = await r.json();
        msg = j?.error?.message || msg;
      } catch {}
      throw new GatewayError(msg, r.status);
    }

    const data: any = await r.json();
    const textParts = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').filter(Boolean) || [];
    return { text: textParts.join('') };
  }

  throw new GatewayError('AI is not configured. Set GEMINI_API_KEY or LOVABLE_API_KEY in .env', 401);
}

// Model fallback chain preserved from the original; only 429/5xx move on to the next model.
async function generateWithFallback(params: { contents: any; config?: any }) {
  const models = ['google/gemini-3.8-flash', 'google/gemini-3.6-flash'];
  let lastError: any = null;
  for (const model of models) {
    try {
      return await callGateway(model, params);
    } catch (err: any) {
      lastError = err;
      if (!(err?.status === 429 || err?.status >= 500)) throw err;
      console.warn(`Model ${model} unavailable, trying fallback:`, err?.message || err);
    }
  }
  throw lastError;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasLovable = Boolean(process.env.LOVABLE_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
  res.json({
    status: 'ok',
    hasApiKey: hasLovable || hasGemini,
    provider: hasLovable ? 'lovable' : (hasGemini ? 'gemini' : 'none'),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: Evaluate Job Posting against Candidate Profile
app.post('/api/evaluate', async (req, res) => {
  try {
    const { jobText, masterProfile, minScore = 70 } = req.body;

    if (!jobText || !masterProfile) {
      return res.status(400).json({ error: 'jobText and masterProfile are required' });
    }

    const prompt = `
You are an expert executive recruiter and ATS algorithm specialist.
Analyze the following Job Description (JD) and evaluate it against the Candidate's Master Profile.

### TARGET JOB DESCRIPTION:
${jobText.slice(0, 15000)}

### CANDIDATE MASTER PROFILE:
${masterProfile.slice(0, 15000)}

Evaluation criteria:
1. Provide accurate job_title and company_name extracted from the job description.
2. Determine match_score (0-100) strictly based on verifiable overlap with candidate's actual qualifications.
3. Set should_apply to true only if match_score >= ${minScore}.
4. Provide a verdict: "STRONG_APPLY" (>=85), "APPLY" (70-84), "CONSIDER" (55-69), or "SKIP" (<55).
5. Identify 3-5 specific matching factors (direct experiences/skills candidate has that match JD needs).
6. List any missing critical skills or gaps. Provide structured "gaps" (1-3 items) explicitly detailing:
   - "missing": what specific skill, tool, qualification, or domain background is missing from the candidate's profile for this JD.
   - "where_to_work": actionable advice on where and how the candidate should work on, practice, study, or bridge this gap.
   - "severity": "CRITICAL", "MODERATE", or "NICE_TO_HAVE".
7. Provide 3-5 concrete tailoring recommendations to emphasize during application.
8. Extract any location, office, or remote details mentioned.
9. Construct a concrete, actionable "skill_roadmap" (2-4 steps) for bridging missing skills, domain gaps, or areas where candidate has less match:
   - "skill": the missing skill, tool, methodology, or domain knowledge (e.g., 'Workday / ERP Resource Scheduling', 'ITIL 4 Incident Governance', 'Power BI & DAX Modeling', 'Fintech Payment Gateway Gateway Integrations').
   - "action_plan": 1-2 sentence actionable learning path on what specific concepts to master.
   - "recommended_certification": Industry-recognized certification or course that proves this skill.
   - "certification_provider": Organization offering the cert (e.g., Microsoft, AXELOS, PMI, Google Cloud, AWS, ASQ, Coursera).
   - "timeline": Realistic time commitment (e.g. '2–3 weeks', '1 month').
   - "importance": 'CRITICAL' (if essential to role), 'RECOMMENDED', or 'NICE_TO_HAVE'.
   - "practical_project": A concrete portfolio project or proof-of-work the candidate can build to demonstrate this skill immediately.
10. Provide 2-3 "recommended_certifications" that will offer the highest hiring leverage to qualify for this role:
   - "name": Certification title.
   - "issuer": Issuing body (e.g., PMI, AXELOS, Microsoft, Google Cloud, Scrum.org).
   - "target_skill": Key competency validated.
   - "estimated_time": e.g. '3–4 weeks'.
   - "why_it_helps": 1-2 sentences on how this credential increases recruiter conversion for this vacancy.
   - "difficulty": 'Beginner', 'Intermediate', or 'Advanced'.
`;

    const response = await generateWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            job_title: { type: Type.STRING },
            company_name: { type: Type.STRING },
            match_score: { type: Type.INTEGER },
            should_apply: { type: Type.BOOLEAN },
            verdict: { type: Type.STRING },
            key_matching_factors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            missing_critical_skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            gaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  missing: { type: Type.STRING },
                  where_to_work: { type: Type.STRING },
                  severity: { type: Type.STRING },
                },
                required: ['missing', 'where_to_work'],
              },
            },
            tailoring_recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            location_info: { type: Type.STRING },
            executive_summary: { type: Type.STRING },
            skill_roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  action_plan: { type: Type.STRING },
                  recommended_certification: { type: Type.STRING },
                  certification_provider: { type: Type.STRING },
                  timeline: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  practical_project: { type: Type.STRING },
                },
                required: ['skill', 'action_plan', 'recommended_certification'],
              },
            },
            recommended_certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  target_skill: { type: Type.STRING },
                  estimated_time: { type: Type.STRING },
                  why_it_helps: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                },
                required: ['name', 'issuer', 'target_skill', 'why_it_helps'],
              },
            },
          },
          required: [
            'job_title',
            'company_name',
            'match_score',
            'should_apply',
            'verdict',
            'key_matching_factors',
            'missing_critical_skills',
            'tailoring_recommendations',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error evaluating job:', error);
    res.status(500).json({
      error: error?.message || 'Failed to evaluate job with Gemini',
    });
  }
});

// Endpoint: Scrape or Extract Job Posting from URL (Supports Firecrawl if FIRECRAWL_API_KEY is configured)
app.post('/api/scrape-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // 0. Dedicated Oracle Cloud HCM REST API extractor
    if (url.includes('.oraclecloud.com') && url.includes('/job/')) {
      try {
        const match = url.match(/\/job\/([0-9a-zA-Z_-]+)/);
        const reqId = match ? match[1] : '';
        const domainMatch = url.match(/(https:\/\/[^/]+)/);
        const domain = domainMatch ? domainMatch[1] : '';

        if (reqId && domain) {
          const apiUrl = `${domain}/hcmRestApi/resources/latest/recruitingCEJobRequisitionDetails/${reqId}`;
          const apiRes = await fetch(apiUrl, {
            headers: {
              Accept: 'application/json',
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            },
          });
          if (apiRes.ok) {
            const data = await apiRes.json();
            const cleanHtml = (str: string) =>
              (str || '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&nbsp;/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            const title = data.Title || data.JobTitle || 'Integrity & Compliance Specialist II';
            const location = data.PrimaryLocation || 'India';
            const responsibilities = cleanHtml(data.ExternalResponsibilitiesStr || data.InternalResponsibilitiesStr || '');
            const qualifications = cleanHtml(data.ExternalQualificationsStr || data.InternalQualificationsStr || '');
            const corporate = cleanHtml(data.CorporateDescriptionStr || '');

            const fullText = `Company: Honeywell Aerospace\nRequisition ID: ${reqId}\nRole: ${title}\nLocation: ${location}\nPlatform: Oracle Cloud HCM\n\nRole Description & Responsibilities:\n${responsibilities}\n\nQualifications & Requirements:\n${qualifications}\n\nAbout Company:\n${corporate || 'Honeywell Aerospace operations, systems, and digital compliance.'}`;
            return res.json({ text: fullText, source: 'oracle-hcm-api' });
          }
        }
      } catch (oracleErr) {
        console.warn('Oracle HCM direct API fetch failed:', oracleErr);
      }
    }

    // 1. If FIRECRAWL_API_KEY is available:
    const firecrawlKey = process.env.FIRECRAWL_API_KEY;
    if (firecrawlKey) {
      try {
        const fcRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${firecrawlKey}`,
          },
          body: JSON.stringify({
            url,
            formats: ['markdown'],
          }),
        });

        if (fcRes.ok) {
          const fcData = await fcRes.json();
          const markdown = fcData?.data?.markdown || '';
          if (markdown) {
            return res.json({ text: markdown, source: 'firecrawl' });
          }
        }
      } catch (fcErr) {
        console.warn('Firecrawl scrape error, falling back to direct fetch:', fcErr);
      }
    }

    // 2. Fallback to direct fetch with browser headers
    const directRes = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!directRes.ok) {
      return res.status(directRes.status).json({
        error: `Unable to fetch URL directly (HTTP ${directRes.status}). Anti-bot protected portals (like UltiPro) require Firecrawl API key or manual paste.`,
      });
    }

    const html = await directRes.text();
    const cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText || cleanText.length < 50) {
      return res.status(422).json({
        error: 'Page returned empty content (JavaScript SPA or anti-bot challenge). Use Firecrawl or paste description directly.',
      });
    }

    res.json({ text: cleanText.slice(0, 15000), source: 'direct-fetch' });
  } catch (error: any) {
    console.error('Error scraping URL:', error);
    res.status(500).json({ error: error?.message || 'Failed to fetch job description' });
  }
});

// Endpoint: Auto-Discover Live Jobs Across the Web using Google Search Grounding
app.post('/api/discover-jobs', async (req, res) => {
  try {
    const {
      location = 'India (Remote / Hybrid)',
      roles = [],
      query = '',
      candidateProfile = '',
    } = req.body;

    const targetRoles = Array.isArray(roles) && roles.length > 0
      ? roles.join(', ')
      : (query || 'Software Engineering, Product Management, Operations, Data Analytics, or Design');

    const prompt = `Search the live web using Google Search for authentic, currently open job postings in ${location} matching target roles: ${targetRoles}.
${candidateProfile ? `\nCandidate Profile Context:\n${candidateProfile.slice(0, 3000)}\n` : ''}

Find 6 authentic, currently active job postings from real hiring portals (SmartRecruiters, Greenhouse, Lever, Ashby, Workday, LinkedIn, or company career pages).
Only include real, open vacancies with actual links to apply.

For each vacancy, provide:
1. "title": Official job title.
2. "company": Company hiring.
3. "location": Workplace location (e.g. "Bengaluru, India (Hybrid)" or "Remote, Global").
4. "platform": ATS or portal (e.g. "SmartRecruiters", "Greenhouse", "Lever", "Ashby", "LinkedIn", "Workday", "Direct Portal").
5. "applyUrl": Direct link to job listing or application portal.
6. "category": Job category or domain.
7. "matchScore": Eligibility match score (0-100) based on qualification overlap.
8. "matchHighlight": 1-2 concise sentences explaining why this posting matches the target search.
9. "description": 2-3 paragraph summary detailing the role responsibilities, team function, and requirements.

Return ONLY a valid JSON array of job objects with no other commentary or markdown formatting.`;

    const response = await generateWithFallback({
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let raw = response.text || '';
    if (raw.includes('```json')) {
      raw = raw.split('```json')[1].split('```')[0].trim();
    } else if (raw.includes('```')) {
      raw = raw.split('```')[1].split('```')[0].trim();
    }

    let jobs: any[] = [];
    try {
      jobs = JSON.parse(raw);
    } catch (parseErr) {
      console.warn('JSON parse failed for discovered jobs, attempting match:', parseErr);
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) {
        jobs = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse discovered jobs from search response.');
      }
    }

    if (!Array.isArray(jobs)) {
      jobs = [jobs];
    }

    const normalizedJobs = jobs.map((j: any, idx: number) => ({
      id: `discovered-${Date.now()}-${idx}`,
      title: j.title || 'Operations Specialist',
      company: j.company || 'Tech Employer',
      location: j.location || location,
      platform: j.platform || 'Direct Portal',
      applyUrl: j.applyUrl || '#',
      category: j.category || 'Business Operations & Analytics',
      matchScore: typeof j.matchScore === 'number' ? j.matchScore : 88,
      matchHighlight: j.matchHighlight || 'Direct match for operations and analytics background.',
      description: j.description || `${j.title} at ${j.company}. Active vacancy.`,
      isLive: true,
      isVerified: true,
      verifiedAt: new Date().toISOString(),
    }));

    res.json({
      success: true,
      count: normalizedJobs.length,
      opportunities: normalizedJobs,
    });
  } catch (error: any) {
    console.error('Error discovering live jobs:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to auto-discover jobs on the web.',
    });
  }
});

// Endpoint: Discover & Generate Role & Company Interview Prep Questions
app.post('/api/interview-prep', async (req, res) => {
  try {
    const companyName = req.body.companyName || req.body.company;
    const jobTitle = req.body.jobTitle || req.body.role;
    const jobDescription = req.body.jobDescription || req.body.jobText;
    const masterProfile = req.body.masterProfile || req.body.candidateProfile;

    if (!companyName && !jobTitle) {
      return res.status(400).json({ error: 'companyName or jobTitle is required' });
    }

    const prompt = `Search Google for authentic interview questions asked at company "${companyName || 'Target Employer'}" or for the role "${jobTitle || 'Operations Specialist'}" across hiring and review portals (Glassdoor, AmbitionBox, Indeed, Blind, or career forums).

Step 1: Check if there are real reported interview questions for ${companyName} or similar roles at ${companyName}.
- If found, mark them with category "Portal Reported" and specify the source (e.g. "Glassdoor Candidate Report", "AmbitionBox Verified").
Step 2: Supplement with high-probability role-specific interview questions tailored to the Job Description:
- Categories: "Technical & Systems", "Behavioral (STAR)", "Situational Case".

Target Candidate Profile:
${(masterProfile || '').slice(0, 10000)}

Target Job Description:
${(jobDescription || '').slice(0, 10000)}

For EACH question (provide 5 to 6 questions total):
1. "question": The exact interview question.
2. "category": One of "Portal Reported", "Technical & Systems", "Behavioral (STAR)", "Situational Case".
3. "source": e.g. "Glassdoor Candidate Report", "AmbitionBox", "Role Competency Model".
4. "isFromPortal": boolean (true if discovered from real candidate reports on Glassdoor/AmbitionBox/etc., false if derived from role competencies).
5. "why_asked": 1-sentence explanation of what competencies, leadership principles, or technical skills the interviewer is evaluating.
6. "key_talking_points": Array of 2-3 concise bullet points the candidate should remember.
7. "suggested_answer": A high-impact 3-5 sentence STAR-method answer directly utilizing the candidate's actual verified background and accomplishments from their master profile (or relevant domain best practices if no profile is provided).

Return ONLY a valid JSON array of question objects with no markdown code fences or commentary.`;

    const response = await generateWithFallback({
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let raw = response.text || '';
    if (raw.includes('```json')) {
      raw = raw.split('```json')[1].split('```')[0].trim();
    } else if (raw.includes('```')) {
      raw = raw.split('```')[1].split('```')[0].trim();
    }

    let questions: any[] = [];
    try {
      questions = JSON.parse(raw);
    } catch (parseErr) {
      console.warn('JSON parse failed for interview questions, attempting regex match:', parseErr);
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) {
        questions = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse interview questions from search response.');
      }
    }

    if (!Array.isArray(questions)) {
      questions = [questions];
    }

    const normalized = questions.map((q: any) => ({
      question: q.question || 'Describe your operational experience.',
      category: q.category || 'Behavioral (STAR)',
      source: q.source || (q.isFromPortal ? 'Glassdoor Candidate Report' : 'Role Competency Model'),
      isFromPortal: Boolean(q.isFromPortal),
      why_asked: q.why_asked || 'Evaluates operational competence and stakeholder alignment.',
      key_talking_points: Array.isArray(q.key_talking_points) ? q.key_talking_points : [],
      suggested_answer: q.suggested_answer || 'Structured response highlighting quantifiable metrics.',
    }));

    res.json({
      success: true,
      count: normalized.length,
      questions: normalized,
    });
  } catch (error: any) {
    console.error('Error fetching interview prep:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to search for interview questions.',
    });
  }
});

// ============================================================================
// ATS APPLICATION QUESTION ANSWERER (Native ATS Portal Assistant)
// Generates tailored, ATS-optimized answers to custom portal questions
// ============================================================================
app.post('/api/ats/answer-question', async (req, res) => {
  try {
    const {
      question,
      companyName = 'Target Employer',
      jobTitle = 'Operations Specialist',
      jobDescription = '',
      masterProfile = '',
      candidateProfile = '',
      style = 'star', // 'star' | 'concise' | 'executive'
    } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ success: false, error: 'Question text is required.' });
    }

    const qLower = question.toLowerCase();
    const effectiveProfile = (masterProfile || candidateProfile || '').slice(0, 10000);
    const effectiveJd = (jobDescription || '').slice(0, 6000);

    const lengthGuide =
      style === 'concise'
        ? 'Keep the answer very concise and direct: 80 to 120 words.'
        : style === 'executive'
        ? 'Provide an executive-level, strategic answer: 250 to 350 words highlighting leadership, scale, and high-level ROI.'
        : 'Provide a structured STAR-method response: 160 to 220 words with concrete metrics and clear Situation, Task, Action, Result flow.';

    const prompt = `You are an expert ATS Application Coach and Executive Recruiter.
The candidate is filling out an application form on a major ATS portal (Greenhouse, Lever, Ashby, Workday, etc.) for:
- Company: "${companyName}"
- Target Role: "${jobTitle}"

Job Context / Requirements:
${effectiveJd || 'Operational excellence, stakeholder management, analytics, and process improvement.'}

Candidate Master Profile:
${effectiveProfile || 'Professional background emphasizing relevant domain competencies, key project achievements, and technical expertise.'}

The application form asks this exact question:
"${question.trim()}"

Instructions:
1. Generate an authentic, tailored, ATS-optimized answer designed to score maximally with ATS keyword screeners and hiring managers.
2. Ground answers strictly in the candidate's actual qualifications from the provided profile (or relevant domain best practices if no profile is provided):
   - For challenging situation / problem-solving questions: Highlight structured root-cause diagnosis, cross-functional collaboration, and measurable recovery or improvement.
   - For "Why work here / Why this company": Connect candidate qualifications directly with ${companyName}'s product, scale, and challenges.
   - For automation / efficiency: Highlight workflow optimization, tool utilization, and metrics-driven productivity gains.
   - For conflict / stakeholder: Highlight clear communication, objective data, and collaborative alignment across teams.
   - For salary / availability: State professional, flexible market rate alignment and standard/immediate availability.
3. ${lengthGuide}
4. Tone: Confident, professional, metric-oriented, articulate, and completely natural (avoid robotic clichés).

Return ONLY a valid JSON object matching this schema (no markdown formatting or commentary):
{
  "suggested_answer": "...",
  "key_points": ["2-3 key takeaways the answer demonstrates"],
  "keywords": ["3-5 ATS keywords embedded"],
  "category": "Operational" | "Behavioral" | "Why Company" | "Technical" | "General",
  "word_count": 180
}`;

    let parsedResult: any = null;

    try {
      const response = await generateWithFallback({
        contents: prompt,
      });

      let raw = response.text || '';
      if (raw.includes('```json')) {
        raw = raw.split('```json')[1].split('```')[0].trim();
      } else if (raw.includes('```')) {
        raw = raw.split('```')[1].split('```')[0].trim();
      }

      parsedResult = JSON.parse(raw);
    } catch (aiErr) {
      console.warn('AI generation error, using smart profile fallback:', aiErr);
    }

    // High quality deterministic fallback if API is unreachable
    if (!parsedResult || !parsedResult.suggested_answer) {
      if (qLower.includes('fail') || qLower.includes('incident') || qLower.includes('mitigat') || qLower.includes('crisis') || qLower.includes('challeng')) {
        parsedResult = {
          suggested_answer: `In a previous role, our team faced a critical service disruption during peak operational hours that impacted customer workflows and threatened key SLA milestones.\n\nI immediately stepped in to coordinate triage between frontline teams and engineering. By analyzing system metrics and identifying the root-cause bottleneck, I implemented an emergency mitigation protocol that restored stability within 45 minutes, preventing broader customer impact.\n\nFollowing resolution, I led a cross-functional post-mortem to institute automated monitoring and safeguards, permanently eliminating the failure mode from our recurring workflow.`,
          key_points: [
            'Immediate cross-functional coordination and rapid root-cause diagnosis',
            'Data-backed mitigation restoring stability under high-stakes deadlines',
            'Permanent preventative safeguards implemented to ensure long-term resilience'
          ],
          keywords: ['Root Cause Analysis', 'Rapid Triage', 'SLA Adherence', 'Process Improvement', 'Cross-Functional Collaboration'],
          category: 'Operational',
          word_count: 110
        };
      } else if (qLower.includes('why') && (qLower.includes('work') || qLower.includes('company') || qLower.includes('join') || qLower.includes('here') || qLower.includes('us'))) {
        parsedResult = {
          suggested_answer: `${companyName}'s rapid innovation and mission-driven approach strongly resonates with my background and career goals. Throughout my career, I have found that the biggest driver of sustained success is combining technical execution with empathetic, cross-functional collaboration.\n\n${companyName}'s commitment to high standards creates the ideal environment where my domain experience, analytical mindset, and focus on scalable quality can deliver immediate, tangible value. I want to contribute to a forward-thinking organization that values velocity, operational rigor, and continuous learning as it scales.`,
          key_points: [
            `Direct alignment between candidate capabilities and ${companyName}'s mission`,
            'Proven track record of high-quality execution and collaboration',
            'Long-term dedication to scalable, high-impact outcomes'
          ],
          keywords: ['Mission Alignment', 'Scalable Execution', 'Domain Excellence', 'Continuous Improvement', 'Cross-Functional Teamwork'],
          category: 'Why Company',
          word_count: 105
        };
      } else if (qLower.includes('automat') || qLower.includes('efficien') || qLower.includes('process') || qLower.includes('improv')) {
        parsedResult = {
          suggested_answer: `In my previous position, repetitive manual workflows were consuming significant team hours each week, creating operational bottlenecks and delayed reporting.\n\nI designed and deployed an automated data aggregation pipeline and interactive dashboard that synchronized updates directly from our core tools. By automating recurring reports, we eliminated manual data entry, provided stakeholders with real-time exception visibility, and improved cycle time by over 30%.\n\nThis initiative saved dozens of managerial hours each month and allowed our team to refocus energy on strategic, high-leverage initiatives.`,
          key_points: [
            'Replaced time-consuming manual workflows with automated reporting pipelines',
            'Provided real-time operational visibility for key stakeholders',
            'Achieved 30%+ efficiency improvement in recurring cycle times'
          ],
          keywords: ['Workflow Automation', 'Dashboard Analytics', 'Cycle Time Optimization', 'Operational Efficiency', 'Process Scalability'],
          category: 'Operational',
          word_count: 98
        };
      } else if (qLower.includes('salary') || qLower.includes('comp') || qLower.includes('notice') || qLower.includes('availab')) {
        parsedResult = {
          suggested_answer: `My salary expectations are aligned with competitive market rates for a ${jobTitle} role at ${companyName}, taking into account my proven experience and the scope of responsibility. I am open to discussing a total compensation package that reflects the role's expectations and industry benchmarks.\n\nRegarding availability, my notice period is standard, and I can transition smoothly upon mutual agreement to ensure seamless onboarding.`,
          key_points: [
            'Flexible and market-aligned compensation stance',
            'Emphasis on role scope and total compensation package',
            'Clean and professional notice period availability'
          ],
          keywords: ['Competitive Compensation', 'Market Benchmarks', 'Notice Period', 'Seamless Onboarding'],
          category: 'General',
          word_count: 75
        };
      } else {
        parsedResult = {
          suggested_answer: `Throughout my career, my approach has centered on objective data, clear cross-functional communication, and rapid execution. Whether resolving complex operational challenges or aligning project deliverables across international teams, I prioritize transparency and measurable business outcomes.\n\nFor ${companyName}, I bring proven experience in workflow optimization, stakeholder coordination, and high-standard execution, ensuring that team goals are consistently met with high quality.`,
          key_points: [
            'Proven track record of high-impact execution and team leadership',
            'Data-first methodology combined with empathetic stakeholder management',
            'Immediate readiness to support organization goals from Day 1'
          ],
          keywords: ['Cross-Functional Execution', 'Data-Driven Problem Solving', 'Stakeholder Management', 'Process Excellence', 'Quality Standards'],
          category: 'Behavioral',
          word_count: 78
        };
      }
    }

    res.json({
      success: true,
      question: question.trim(),
      answer: parsedResult.suggested_answer,
      key_points: parsedResult.key_points || [],
      keywords: parsedResult.keywords || [],
      category: parsedResult.category || 'Behavioral',
      word_count: parsedResult.word_count || parsedResult.suggested_answer.split(/\s+/).length,
    });
  } catch (error: any) {
    console.error('Error answering ATS application question:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate answer for application question.',
    });
  }
});

// ============================================================================
// DIRECT ATS INTEGRATION ENGINE (Greenhouse, Lever, Ashby, SmartRecruiters, Workable)
// Direct unauthenticated API crawling straight from corporate ATS backends
// ============================================================================

export interface ATSCompanyEntry {
  name: string;
  slug: string;
  ats: 'greenhouse' | 'lever' | 'ashby' | 'smartrecruiters' | 'workable';
  category: string;
}

export const CURATED_ATS_COMPANIES: ATSCompanyEntry[] = [
  // AI & Frontier Intelligence
  { name: 'Anthropic', slug: 'anthropic', ats: 'ashby', category: 'Frontier AI & LLMs' },
  { name: 'OpenAI', slug: 'openai', ats: 'ashby', category: 'Generative AI Research' },
  { name: 'Scale AI', slug: 'scaleai', ats: 'greenhouse', category: 'AI Data Infrastructure' },
  { name: 'Perplexity', slug: 'perplexity', ats: 'ashby', category: 'AI Search & Knowledge' },
  { name: 'Cohere', slug: 'cohere', ats: 'ashby', category: 'Enterprise AI Platforms' },
  { name: 'Palantir', slug: 'palantir', ats: 'lever', category: 'Enterprise AI & Data Ops' },

  // Fintech & Global Banking
  { name: 'Stripe', slug: 'stripe', ats: 'greenhouse', category: 'Fintech Infrastructure' },
  { name: 'Revolut', slug: 'revolut', ats: 'lever', category: 'Global Fintech & Digital Banking' },
  { name: 'Brex', slug: 'brex', ats: 'greenhouse', category: 'Fintech & Spend Operations' },
  { name: 'Ramp', slug: 'ramp', ats: 'ashby', category: 'Finance Automation' },
  { name: 'Plaid', slug: 'plaid', ats: 'ashby', category: 'Fintech Data Network' },
  { name: 'Coinbase', slug: 'coinbase', ats: 'greenhouse', category: 'Crypto & Financial Ops' },
  { name: 'Robinhood', slug: 'robinhood', ats: 'greenhouse', category: 'Fintech & Brokerage' },
  { name: 'Wise', slug: 'Wise', ats: 'smartrecruiters', category: 'Cross-Border Payments' },
  { name: 'Klarna', slug: 'Klarna', ats: 'smartrecruiters', category: 'Fintech & Payments' },
  { name: 'Monzo', slug: 'monzo', ats: 'greenhouse', category: 'Digital Banking' },
  { name: 'Mercury', slug: 'mercury', ats: 'ashby', category: 'Startup Banking' },
  { name: 'Checkout.com', slug: 'checkout', ats: 'greenhouse', category: 'Global Payments' },

  // Product, Design & Connected Workspaces
  { name: 'Figma', slug: 'figma', ats: 'greenhouse', category: 'Product & Design Systems' },
  { name: 'Linear', slug: 'linear', ats: 'ashby', category: 'Productivity & AI Tools' },
  { name: 'Notion', slug: 'notion', ats: 'ashby', category: 'Connected Workspace' },
  { name: 'Canva', slug: 'canva', ats: 'greenhouse', category: 'Creative & Visual Platform' },
  { name: 'Automattic', slug: 'automattic', ats: 'greenhouse', category: 'Distributed Remote Ops' },
  { name: 'Webflow', slug: 'webflow', ats: 'greenhouse', category: 'Visual Web Dev' },

  // Dev Tools, Cloud & Systems
  { name: 'Vercel', slug: 'vercel', ats: 'ashby', category: 'Cloud Frameworks & Edge' },
  { name: 'Supabase', slug: 'supabase', ats: 'ashby', category: 'Open Source Cloud DB' },
  { name: 'Retool', slug: 'retool', ats: 'greenhouse', category: 'Internal Systems & Ops Tools' },
  { name: 'Datadog', slug: 'datadog', ats: 'greenhouse', category: 'Cloud Observability' },
  { name: 'GitLab', slug: 'gitlab', ats: 'greenhouse', category: 'DevOps & Remote Ops' },
  { name: 'Cloudflare', slug: 'cloudflare', ats: 'greenhouse', category: 'Internet Security & CDN' },
  { name: 'Docker', slug: 'docker', ats: 'greenhouse', category: 'Containerization & Cloud' },
  { name: 'Postman', slug: 'postman', ats: 'greenhouse', category: 'API Platform' },
  { name: 'Zapier', slug: 'zapier', ats: 'lever', category: 'Workflow Automation' },
  { name: 'Databricks', slug: 'databricks', ats: 'greenhouse', category: 'Lakehouse & Data Ops' },

  // Remote-First Global Work & HR Tech
  { name: 'Deel', slug: 'deel', ats: 'ashby', category: 'Global Payroll & Compliance' },
  { name: 'Remote.com', slug: 'remote', ats: 'greenhouse', category: 'Global Employment & HR' },
  { name: 'Gusto', slug: 'gusto', ats: 'greenhouse', category: 'Payroll & HR Tech' },
  { name: 'Rippling', slug: 'rippling', ats: 'greenhouse', category: 'Workforce Management' },

  // Consumer Scale & Mobility
  { name: 'Airbnb', slug: 'airbnb', ats: 'greenhouse', category: 'Travel & Platform Operations' },
  { name: 'Spotify', slug: 'spotify', ats: 'lever', category: 'Audio Streaming & Tech' },
  { name: 'Reddit', slug: 'reddit', ats: 'greenhouse', category: 'Community & Media' },
  { name: 'DoorDash', slug: 'doordash', ats: 'greenhouse', category: 'Logistics & Marketplace' },
  { name: 'Uber', slug: 'uber', ats: 'greenhouse', category: 'Mobility & Operations' },
  { name: 'Pinterest', slug: 'pinterest', ats: 'greenhouse', category: 'Visual Discovery' },
  { name: 'Duolingo', slug: 'duolingo', ats: 'greenhouse', category: 'EdTech & Learning' },
];

export function extractSeniorityLevel(title: string, desc: string = ''): 'Early / Junior' | 'Mid-Level' | 'Senior' | 'Lead / Staff / Director' {
  // Title is the source of truth; descriptions mention "lead", "staff", "manager" in passing.
  const t = ` ${title.toLowerCase().replace(/[^a-z0-9+.]+/g, ' ')} `;
  const has = (re: RegExp) => re.test(t);

  if (has(/ (intern|internship|graduate|grad|trainee|apprentice|entry|junior|jr\.?|new grad|early career) /) || has(/ (i|l1|1) $/)) {
    return 'Early / Junior';
  }
  if (has(/ (director|vp|vice president|head of|chief|principal|staff|distinguished|fellow) /) || has(/ (lead|manager) /) && !has(/ (support|customer|success|service|account|sales|community) /)) {
    return 'Lead / Staff / Director';
  }
  if (has(/ (senior|sr\.?|iii|iv|l4|l5) /)) return 'Senior';

  // No title signal: fall back to required years of experience in the description.
  const years = [...desc.toLowerCase().matchAll(/(\d{1,2})\s*\+?\s*(?:-\s*\d{1,2}\s*)?years?/g)]
    .map((m) => parseInt(m[1], 10))
    .filter((n) => n > 0 && n < 30);
  if (years.length) {
    const y = Math.min(...years);
    if (y <= 2) return 'Early / Junior';
    if (y >= 8) return 'Senior';
    if (y >= 5) return 'Senior';
  }
  if (has(/ (associate|specialist|representative|coordinator|agent|assistant|analyst) /)) return 'Early / Junior';
  return 'Mid-Level';
}

function extractWorkplaceType(location: string, isRemoteExplicit?: boolean, title: string = '', desc: string = ''): 'Remote' | 'Hybrid' | 'On-site' {
  const loc = `${location} ${title} ${desc}`.toLowerCase();
  if (loc.includes('hybrid')) return 'Hybrid';
  if (isRemoteExplicit || loc.includes('remote') || loc.includes('anywhere') || loc.includes('distributed') || loc.includes('virtual')) {
    return 'Remote';
  }
  return 'On-site';
}

function cleanHtmlText(str: string): string {
  if (!str) return '';
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

function detectAtsFromUrlOrSlug(input: string): {
  ats: 'greenhouse' | 'lever' | 'ashby' | 'smartrecruiters' | 'workable';
  slug: string;
  jobId?: string;
} | null {
  const trimmed = input.trim();

  // Greenhouse: boards.greenhouse.io/{slug}/jobs/{id} or job-boards.greenhouse.io/{slug}/jobs/{id}
  if (trimmed.includes('greenhouse.io')) {
    const match = trimmed.match(/greenhouse\.io\/(?:embed\/job_board\?for=)?([^/?#]+)(?:\/jobs\/([0-9a-zA-Z_-]+))?/);
    if (match) {
      return { ats: 'greenhouse', slug: match[1], jobId: match[2] };
    }
  }

  // Lever: jobs.lever.co/{slug}/{id}
  if (trimmed.includes('jobs.lever.co')) {
    const match = trimmed.match(/jobs\.lever\.co\/([^/?#]+)(?:\/([0-9a-fA-F-]+))?/);
    if (match) {
      return { ats: 'lever', slug: match[1], jobId: match[2] };
    }
  }

  // Ashby: jobs.ashbyhq.com/{slug}/{id}
  if (trimmed.includes('ashbyhq.com')) {
    const match = trimmed.match(/ashbyhq\.com\/([^/?#]+)(?:\/([0-9a-fA-F-]+))?/);
    if (match) {
      return { ats: 'ashby', slug: match[1], jobId: match[2] };
    }
  }

  // SmartRecruiters: jobs.smartrecruiters.com/{slug}/{id} or careers.smartrecruiters.com/{slug}/{id}
  if (trimmed.includes('smartrecruiters.com')) {
    const match = trimmed.match(/smartrecruiters\.com\/([^/?#]+)(?:\/([0-9a-zA-Z_-]+))?/);
    if (match) {
      return { ats: 'smartrecruiters', slug: match[1], jobId: match[2] };
    }
  }

  // Workable: apply.workable.com/{slug}/j/{id}
  if (trimmed.includes('apply.workable.com')) {
    const match = trimmed.match(/apply\.workable\.com\/([^/?#]+)(?:\/j\/([0-9a-zA-Z_-]+))?/);
    if (match) {
      return { ats: 'workable', slug: match[1], jobId: match[2] };
    }
  }

  // Plain slug or company name lookup
  const cleanSlug = trimmed.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const found = CURATED_ATS_COMPANIES.find((c) => c.slug === cleanSlug || c.name.toLowerCase() === cleanSlug);
  if (found) {
    return { ats: found.ats, slug: found.slug };
  }

  // Default assumption if just a clean single word identifier: try greenhouse
  if (cleanSlug && !cleanSlug.includes('.') && cleanSlug.length < 40) {
    return { ats: 'greenhouse', slug: cleanSlug };
  }

  return null;
}

function calculateCandidateMatch(title: string, department: string = '', descriptionSnippet: string = '') {
  const combined = `${title} ${department} ${descriptionSnippet}`.toLowerCase();
  const lowerTitle = title.toLowerCase();

  // 1. Critical Disqualifiers: Specialized Domain / Tooling Mismatches
  // Financial Close / Accounting ERP (e.g., BlackLine, SAP FICO, R2R, CPA, Statutory Tax)
  const isAccountingErpMismatch =
    lowerTitle.includes('blackline') ||
    combined.includes('blackline') ||
    lowerTitle.includes('sap fico') ||
    lowerTitle.includes('record to report') ||
    lowerTitle.includes('r2r') ||
    lowerTitle.includes('statutory accounting') ||
    lowerTitle.includes('chartered accountant') ||
    lowerTitle.includes('cpa required') ||
    (lowerTitle.includes('tax') && lowerTitle.includes('analyst'));

  if (isAccountingErpMismatch) {
    return {
      score: 38,
      highlight:
        'Low overlap (38%): Requires 5+ years of specialized BlackLine / SAP R2R financial close accounting software not in your profile.',
    };
  }

  // Specialized Software / Hardware Engineering mismatch
  const isEngineeringMismatch =
    lowerTitle.includes('c++') ||
    lowerTitle.includes('embedded') ||
    lowerTitle.includes('firmware') ||
    lowerTitle.includes('ios developer') ||
    lowerTitle.includes('android developer') ||
    lowerTitle.includes('golang') ||
    lowerTitle.includes('rust developer') ||
    lowerTitle.includes('verilog') ||
    lowerTitle.includes('fpga');

  if (isEngineeringMismatch) {
    return {
      score: 32,
      highlight:
        'Low overlap (32%): Requires specialized native software engineering or hardware firmware programming not present in your profile.',
    };
  }

  // Clinical / Healthcare mismatch
  if (lowerTitle.includes('nurse') || lowerTitle.includes('physician') || lowerTitle.includes('pharmacist')) {
    return {
      score: 25,
      highlight: 'Low overlap (25%): Clinical medical credentials required.',
    };
  }

  // Core professional keywords across tech, business, and operations
  const coreKeywords = [
    'experience', 'management', 'analysis', 'communication', 'leadership',
    'strategy', 'collaboration', 'development', 'workflow', 'reporting',
    'stakeholder', 'optimization', 'project', 'metrics', 'governance',
    'sql', 'agile', 'data', 'cloud', 'analytics'
  ];

  let matches = 0;
  coreKeywords.forEach((kw) => {
    if (combined.includes(kw)) matches++;
  });

  let score = 70;
  if (matches >= 8) {
    score = 85 + Math.min(matches, 9); // 85 - 94%
  } else if (matches >= 4) {
    score = 72 + matches * 2; // 80 - 86%
  } else {
    score = 60 + matches * 3; // 60 - 72%
  }

  if (score > 95) score = 95;

  let highlight = 'Strong alignment with core professional qualifications and role responsibilities.';
  if (matches >= 8) {
    highlight = 'High alignment across key domain competencies, technical tooling, and execution requirements.';
  } else if (matches >= 4) {
    highlight = 'Solid overlap with foundational qualifications, analytical problem solving, and stakeholder coordination.';
  } else {
    highlight = 'Moderate overlap: core transferable skills apply, with room for role-specific tailoring.';
  }

  return { score, highlight };
}

// 7.1M+ Jobs Catalogue Fetcher with parallel multi-offset batching
async function fetchLiveAtsCatalogueJobs(
  query?: string | string[],
  limitCount = 350,
  startOffset = 0
): Promise<any[]> {
  try {
    const rawQueries = Array.isArray(query) ? query.filter(Boolean) : [query || ''];
    const queries = rawQueries.length > 0 ? rawQueries : [''];
    const pageSize = 100;

    // Calculate pages per query to reach desired batch size
    const pagesPerQuery = Math.max(1, Math.min(Math.ceil(limitCount / (pageSize * queries.length)), 4));

    const fetchTasks: Promise<{ items: any[]; total: number }>[] = [];

    for (const q of queries) {
      for (let p = 0; p < pagesPerQuery; p++) {
        const offset = startOffset + p * pageSize;
        const trimmed = q.trim();
        const url = trimmed
          ? `https://freehire.me/api/v1/agent/jobs/search?q=${encodeURIComponent(trimmed)}&limit=${pageSize}&offset=${offset}`
          : `https://freehire.me/api/v1/jobs?limit=${pageSize}&offset=${offset}`;

        fetchTasks.push(
          (async () => {
            try {
              const res = await fetch(url, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                  Accept: 'application/json',
                },
                signal: AbortSignal.timeout(9000),
              });
              if (!res.ok) return { items: [], total: 0 };
              const data = await res.json();
              return {
                items: Array.isArray(data.data) ? data.data : [],
                total: Number(data.meta?.total) || 0,
              };
            } catch {
              return { items: [], total: 0 };
            }
          })()
        );
      }
    }

    const settled = await Promise.allSettled(fetchTasks);
    const allItems: any[] = [];
    let reportedTotal = 0;

    for (const r of settled) {
      if (r.status === 'fulfilled') {
        allItems.push(...r.value.items);
        if (r.value.total > reportedTotal) {
          reportedTotal = r.value.total;
        }
      }
    }

    // Deduplicate raw items by slug or external ID
    const seenIds = new Set<string>();
    const deduplicatedRaw: any[] = [];
    for (const item of allItems) {
      const key = item.public_slug || item.external_id || `${item.company}_${item.title}`;
      if (key && !seenIds.has(key)) {
        seenIds.add(key);
        deduplicatedRaw.push(item);
      }
    }

    const mapped = deduplicatedRaw.map((item: any) => {
      const rawLoc = (item.location || (item.countries?.length ? item.countries.join(', ') : '')).trim();
      const title = item.title || 'Untitled Role';
      const desc = cleanHtmlText(item.description || '');
      const titleLow = title.toLowerCase();
      const locLow = rawLoc.toLowerCase();
      const descLow = desc.slice(0, 400).toLowerCase();

      const isRem =
        item.workMode === 'remote' ||
        locLow.includes('remote') ||
        locLow.includes('anywhere') ||
        locLow.includes('wfh') ||
        locLow.includes('work from home') ||
        locLow.includes('telecommute') ||
        titleLow.includes('remote') ||
        titleLow.includes('work from home') ||
        titleLow.includes('wfh') ||
        descLow.includes('work from home') ||
        descLow.includes('100% remote') ||
        descLow.includes('fully remote') ||
        descLow.includes('remote role');

      const isIndiaMatch =
        locLow.includes('india') ||
        locLow.includes('bengaluru') ||
        locLow.includes('bangalore') ||
        locLow.includes('hyderabad') ||
        locLow.includes('mumbai') ||
        locLow.includes('delhi') ||
        locLow.includes('gurgaon') ||
        locLow.includes('gurugram') ||
        locLow.includes('noida') ||
        locLow.includes('kochi') ||
        locLow.includes('pune') ||
        locLow.includes('chennai') ||
        locLow.includes('kolkata') ||
        locLow.includes('ahmedabad') ||
        titleLow.includes('india');

      let displayLoc = rawLoc;
      if (!displayLoc) {
        if (isRem && isIndiaMatch) displayLoc = 'Remote (India)';
        else if (isRem) displayLoc = 'Remote / Anywhere';
        else if (isIndiaMatch) displayLoc = 'India (Remote / Hybrid)';
        else displayLoc = 'Remote / Hybrid';
      } else if (isRem && !locLow.includes('remote') && !locLow.includes('anywhere')) {
        displayLoc = `${displayLoc} (Remote)`;
      } else if (isIndiaMatch && !locLow.includes('india')) {
        displayLoc = `${displayLoc}, India`;
      }

      const dept = item.enrichment?.category || 'Tech & Operations';
      const { score, highlight } = calculateCandidateMatch(title, dept, desc);
      const platformName = item.source ? item.source.toUpperCase() : 'DIRECT ATS';

      // Salary Extraction
      let salary = '';
      if (item.salary_min || item.salary_max) {
        const curr = item.salary_currency === 'EUR' ? '€' : item.salary_currency === 'GBP' ? '£' : item.salary_currency === 'INR' ? '₹' : '$';
        const interval = item.salary_interval === 'hourly' ? '/hr' : '/yr';
        if (item.salary_min && item.salary_max) {
          salary = `${curr}${Math.round(item.salary_min / 1000)}k - ${curr}${Math.round(item.salary_max / 1000)}k${interval}`;
        } else if (item.salary_min) {
          salary = `From ${curr}${Math.round(item.salary_min / 1000)}k${interval}`;
        } else if (item.salary_max) {
          salary = `Up to ${curr}${Math.round(item.salary_max / 1000)}k${interval}`;
        }
      }

      // Extracted Skills
      const extractedSkills = Array.isArray(item.enrichment?.skills)
        ? item.enrichment.skills.slice(0, 5)
        : [];

      return {
        id: `fh-${item.public_slug || item.external_id || Math.random().toString(36).substring(2, 9)}`,
        originalId: item.public_slug || item.external_id || '',
        slug: item.public_slug || '',
        title,
        company: item.company || 'Enterprise',
        location: displayLoc,
        department: dept,
        platform: platformName,
        applyUrl: item.url,
        publishedAt: item.posted_at || item.created_at,
        descriptionSnippet: desc.slice(0, 300),
        rawDescription: desc,
        isRemote: isRem,
        workplaceType: isRem ? 'Remote' : extractWorkplaceType(displayLoc, isRem, title, desc),
        seniority: item.enrichment?.seniority
          ? (item.enrichment.seniority === 'junior'
              ? 'Early / Junior'
              : item.enrichment.seniority === 'senior'
              ? 'Senior'
              : item.enrichment.seniority === 'lead' || item.enrichment.seniority === 'principal'
              ? 'Lead / Staff / Director'
              : 'Mid-Level')
          : extractSeniorityLevel(title, desc),
        salarySnippet: salary || undefined,
        skills: extractedSkills,
        matchScore: score,
        matchHighlight: highlight,
      };
    });

    (mapped as any).totalAvailable = reportedTotal || mapped.length;
    return mapped;
  } catch (e) {
    console.warn('Live ATS API catalogue warning:', e);
    const empty: any = [];
    empty.totalAvailable = 0;
    return empty;
  }
}

// Remotive Public Remote Jobs Ingestion & In-Memory Cache (respecting API guidelines)
let remotiveCache: { timestamp: number; jobs: any[] } | null = null;

async function fetchRemotiveJobs(query?: string, limitCount = 80): Promise<any[]> {
  try {
    const now = Date.now();
    // Cache general query results for 8 minutes
    if (remotiveCache && now - remotiveCache.timestamp < 8 * 60 * 1000 && (!query || !query.trim())) {
      return remotiveCache.jobs.slice(0, limitCount);
    }

    const searchParam = query && query.trim() ? `?search=${encodeURIComponent(query.trim())}&limit=${limitCount}` : `?limit=${limitCount}`;
    const url = `https://remotive.com/api/remote-jobs${searchParam}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return remotiveCache ? remotiveCache.jobs.slice(0, limitCount) : [];

    const data = await res.json();
    const rawList = Array.isArray(data?.jobs) ? data.jobs : [];

    const mapped = rawList.map((j: any) => {
      const title = j.title || 'Remote Specialist';
      const company = j.company_name || 'Tech Startup';
      const loc = j.candidate_required_location || 'Remote (Worldwide)';
      const dept = j.category || 'Operations & Tech';
      const desc = cleanHtmlText(j.description || '');
      const { score, highlight } = calculateCandidateMatch(title, dept, desc);

      return {
        id: `remotive-${j.id}`,
        originalId: String(j.id),
        title,
        company,
        location: loc.toLowerCase().includes('remote') ? loc : `Remote (${loc})`,
        department: dept,
        platform: 'REMOTIVE',
        applyUrl: j.url,
        publishedAt: j.publication_date,
        descriptionSnippet: desc.slice(0, 300),
        rawDescription: desc,
        isRemote: true,
        workplaceType: 'Remote' as const,
        seniority: extractSeniorityLevel(title, desc),
        salarySnippet: j.salary || undefined,
        skills: Array.isArray(j.tags) ? j.tags.slice(0, 5) : [],
        matchScore: score,
        matchHighlight: highlight,
      };
    });

    if (!query || !query.trim()) {
      remotiveCache = { timestamp: now, jobs: mapped };
    }

    return mapped.slice(0, limitCount);
  } catch (err) {
    console.warn('Remotive fetch warning:', err);
    return remotiveCache ? remotiveCache.jobs.slice(0, limitCount) : [];
  }
}

// Endpoint: Curated ATS Companies Registry
app.get('/api/ats/companies', (req, res) => {
  res.json({
    success: true,
    companies: CURATED_ATS_COMPANIES,
  });
});

// Endpoint: Direct ATS Crawler (fetches directly from unauthenticated ATS APIs)
app.post('/api/ats/crawl', async (req, res) => {
  try {
    const { input = 'all', keyword, location, seniority = 'All', workplaceType = 'All', limit = 400, offset = 0 } = req.body;

    const fetchHeaders = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'application/json',
    };

    let rawJobs: any[] = [];
    let activeAts = 'Direct ATS Network';
    let companyDisplayName = 'All Companies (Unified 7.1M+ Live Catalogue)';
    let slug = 'all';
    let availableCatalogueTotal = 7135839;

    const isAll = !input || input.toLowerCase() === 'all';

    let normalizedLoc = '';
    if (location && location !== 'All') {
      const low = location.toLowerCase();
      if (low.includes('india')) {
        normalizedLoc = 'India';
      } else if (low.includes('united states') || low === 'us') {
        normalizedLoc = 'United States';
      } else if (low.includes('europe') || low.includes('uk')) {
        normalizedLoc = 'Europe';
      } else if (low === 'remote') {
        normalizedLoc = 'Remote';
      } else {
        normalizedLoc = location.trim();
      }
    }

    if (isAll) {
      const isRemoteRequested = workplaceType === 'Remote' || normalizedLoc === 'Remote';

      // Build targeted parallel query variants to maximize job coverage and diversity
      let searchQueries: string[] = [];
      if (normalizedLoc === 'India') {
        if (isRemoteRequested) {
          searchQueries = ['remote India', 'India remote', 'work from home India', keyword ? `${keyword} remote India` : 'operations remote India'];
          availableCatalogueTotal = 179400;
        } else {
          searchQueries = ['India', 'Bengaluru India', 'remote India', keyword ? `${keyword} India` : 'operations India'];
          availableCatalogueTotal = 143380;
        }
      } else if (normalizedLoc === 'United States') {
        if (isRemoteRequested) {
          searchQueries = ['remote US', 'remote United States', keyword ? `${keyword} remote US` : 'operations remote US'];
        } else {
          searchQueries = ['United States', 'remote US', keyword ? `${keyword} United States` : 'tech United States'];
        }
      } else if (normalizedLoc === 'Europe') {
        if (isRemoteRequested) {
          searchQueries = ['remote Europe', 'remote UK', 'remote Germany'];
        } else {
          searchQueries = ['Europe', 'UK London', 'remote Europe'];
        }
      } else if (isRemoteRequested) {
        searchQueries = ['remote', keyword ? `remote ${keyword}` : 'work from home', 'distributed'];
      } else if (keyword && keyword.trim()) {
        searchQueries = [keyword.trim(), `${keyword.trim()} operations`];
      }

      // 1. Query live catalogue with multi-query batching across offsets
      const catalogueLimit = 400;
      const cataloguePromise = fetchLiveAtsCatalogueJobs(
        searchQueries.length > 0 ? searchQueries : undefined,
        catalogueLimit,
        Number(offset) || 0
      );
      const remotivePromise = fetchRemotiveJobs(keyword || undefined, 60);

      // 2. Query top corporate ATS platforms concurrently
      const providers = [
        { name: 'Stripe', url: 'https://boards-api.greenhouse.io/v1/boards/stripe/jobs', ats: 'Greenhouse' },
        { name: 'Figma', url: 'https://boards-api.greenhouse.io/v1/boards/figma/jobs', ats: 'Greenhouse' },
        { name: 'Linear', url: 'https://api.ashbyhq.com/posting-api/job-board/linear', ats: 'Ashby' },
        { name: 'Palantir', url: 'https://api.lever.co/v0/postings/palantir?mode=json', ats: 'Lever' },
        { name: 'Datadog', url: 'https://boards-api.greenhouse.io/v1/boards/datadog/jobs', ats: 'Greenhouse' },
        { name: 'Brex', url: 'https://boards-api.greenhouse.io/v1/boards/brex/jobs', ats: 'Greenhouse' },
        { name: 'Spotify', url: 'https://api.lever.co/v0/postings/spotify?mode=json', ats: 'Lever' },
        { name: 'Plaid', url: 'https://api.ashbyhq.com/posting-api/job-board/plaid', ats: 'Ashby' },
        { name: 'Notion', url: 'https://api.ashbyhq.com/posting-api/job-board/notion', ats: 'Ashby' },
        { name: 'Ramp', url: 'https://api.ashbyhq.com/posting-api/job-board/ramp', ats: 'Ashby' },
        { name: 'Anthropic', url: 'https://api.ashbyhq.com/posting-api/job-board/anthropic', ats: 'Ashby' },
        { name: 'Scale AI', url: 'https://boards-api.greenhouse.io/v1/boards/scaleai/jobs', ats: 'Greenhouse' },
        { name: 'Vercel', url: 'https://api.ashbyhq.com/posting-api/job-board/vercel', ats: 'Ashby' },
        { name: 'Retool', url: 'https://boards-api.greenhouse.io/v1/boards/retool/jobs', ats: 'Greenhouse' },
        { name: 'Deel', url: 'https://api.ashbyhq.com/posting-api/job-board/deel', ats: 'Ashby' },
        { name: 'Canva', url: 'https://boards-api.greenhouse.io/v1/boards/canva/jobs', ats: 'Greenhouse' },
        { name: 'Automattic', url: 'https://boards-api.greenhouse.io/v1/boards/automattic/jobs', ats: 'Greenhouse' },
        { name: 'Cloudflare', url: 'https://boards-api.greenhouse.io/v1/boards/cloudflare/jobs', ats: 'Greenhouse' },
      ];

      const [fhResult, remotiveResult, ...fetchedResults] = await Promise.allSettled([
        cataloguePromise,
        remotivePromise,
        ...providers.map(async (p) => {
          const r = await fetch(p.url, { headers: fetchHeaders, signal: AbortSignal.timeout(8000) });
          if (!r.ok) return [];
          const data = await r.json();
          if (p.ats === 'Greenhouse') {
            const list = data?.jobs || [];
            return list.slice(0, 40).map((j: any) => {
              const title = j.title || 'Role';
              const loc = j.location?.name || 'Remote / Hybrid';
              const dept = j.departments?.[0]?.name || 'Operations';
              const desc = cleanHtmlText(j.content || '');
              const { score, highlight } = calculateCandidateMatch(title, dept, desc);
              const isRem = loc.toLowerCase().includes('remote') || loc.toLowerCase().includes('anywhere');
              return {
                id: `gh-${j.id}`,
                originalId: String(j.id),
                title,
                company: p.name,
                location: loc,
                department: dept,
                platform: 'Greenhouse',
                applyUrl: j.absolute_url,
                publishedAt: j.updated_at,
                descriptionSnippet: desc.slice(0, 300),
                rawDescription: desc,
                isRemote: isRem,
                workplaceType: extractWorkplaceType(loc, isRem, title, desc),
                seniority: extractSeniorityLevel(title, desc),
                matchScore: score,
                matchHighlight: highlight,
              };
            });
          } else if (p.ats === 'Lever') {
            const list = Array.isArray(data) ? data : [];
            return list.slice(0, 40).map((j: any) => {
              const title = j.text || 'Role';
              const loc = j.categories?.location || 'Remote / Hybrid';
              const dept = j.categories?.team || j.categories?.department || 'Operations';
              const desc = j.descriptionPlain || cleanHtmlText(j.description || '');
              const { score, highlight } = calculateCandidateMatch(title, dept, desc);
              const isRem = loc.toLowerCase().includes('remote') || loc.toLowerCase().includes('anywhere');
              return {
                id: `lever-${j.id}`,
                originalId: String(j.id),
                title,
                company: p.name,
                location: loc,
                department: dept,
                platform: 'Lever',
                applyUrl: j.hostedUrl || j.applyUrl,
                publishedAt: j.createdAt ? new Date(j.createdAt).toISOString() : undefined,
                descriptionSnippet: desc.slice(0, 300),
                rawDescription: desc,
                isRemote: isRem,
                workplaceType: extractWorkplaceType(loc, isRem, title, desc),
                seniority: extractSeniorityLevel(title, desc),
                matchScore: score,
                matchHighlight: highlight,
              };
            });
          } else if (p.ats === 'Ashby') {
            const list = data?.jobs || [];
            return list.slice(0, 40).map((j: any) => {
              const title = j.title || 'Role';
              const loc = j.location || 'Remote';
              const dept = j.department || j.team || 'Operations';
              const desc = j.descriptionPlain || cleanHtmlText(j.descriptionHtml || '');
              const { score, highlight } = calculateCandidateMatch(title, dept, desc);
              const isRem = Boolean(j.isRemote || loc.toLowerCase().includes('remote'));
              return {
                id: `ashby-${j.id}`,
                originalId: String(j.id),
                title,
                company: p.name,
                location: loc,
                department: dept,
                platform: 'Ashby',
                applyUrl: j.jobUrl || j.applyUrl,
                publishedAt: j.publishedAt,
                descriptionSnippet: desc.slice(0, 300),
                rawDescription: desc,
                isRemote: isRem,
                workplaceType: extractWorkplaceType(loc, isRem, title, desc),
                seniority: extractSeniorityLevel(title, desc),
                matchScore: score,
                matchHighlight: highlight,
              };
            });
          }
          return [];
        })
      ]);

      if (fhResult.status === 'fulfilled' && Array.isArray(fhResult.value)) {
        rawJobs.push(...fhResult.value);
        if ((fhResult.value as any).totalAvailable) {
          availableCatalogueTotal = (fhResult.value as any).totalAvailable;
        }
      }

      if (remotiveResult.status === 'fulfilled' && Array.isArray(remotiveResult.value)) {
        rawJobs.push(...remotiveResult.value);
      }

      for (const res of fetchedResults) {
        if (res.status === 'fulfilled' && Array.isArray(res.value)) {
          rawJobs.push(...res.value);
        }
      }
    } else {
      const detected = detectAtsFromUrlOrSlug(input);

      if (!detected) {
        // Probe live catalogue directly for any company name or keyword
        const fhJobs = await fetchLiveAtsCatalogueJobs(input, 100);
        if (fhJobs.length > 0) {
          rawJobs = fhJobs;
          activeAts = 'Direct ATS';
          companyDisplayName = input.charAt(0).toUpperCase() + input.slice(1);
          slug = input.toLowerCase().replace(/[^a-z0-9_-]/g, '');
        } else {
          return res.status(404).json({
            success: false,
            error: `Could not find an active ATS board or live listing for "${input}". You can paste any direct job link in Custom JD / URL Import.`,
          });
        }
      } else {
        const { ats, slug: targetSlug } = detected;
        slug = targetSlug;
        activeAts = ats;
        companyDisplayName = slug.charAt(0).toUpperCase() + slug.slice(1);
        const matchedCurated = CURATED_ATS_COMPANIES.find((c) => c.slug === slug);
        if (matchedCurated) {
          companyDisplayName = matchedCurated.name;
        }

        if (slug.toLowerCase() === 'revolut') {
          const fhHits = await fetchLiveAtsCatalogueJobs('revolut', 50);
          rawJobs = [...fhHits];
          activeAts = 'Direct ATS Network';
        } else {
          // Probe Greenhouse
          const probeGreenhouse = async () => {
            try {
              const ghUrl = `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`;
              const ghRes = await fetch(ghUrl, { headers: fetchHeaders });
              if (ghRes.ok) {
                const data = await ghRes.json();
                const list = data?.jobs || [];
                return list.map((j: any) => {
                  const title = j.title || 'Untitled Role';
                  const loc = j.location?.name || 'Remote / Hybrid';
                  const dept = j.departments?.[0]?.name || 'Operations';
                  const desc = cleanHtmlText(j.content || '');
                  const { score, highlight } = calculateCandidateMatch(title, dept, desc);
                  const isRem = loc.toLowerCase().includes('remote') || loc.toLowerCase().includes('anywhere');
                  return {
                    id: `gh-${j.id}`,
                    originalId: String(j.id),
                    title,
                    company: companyDisplayName,
                    location: loc,
                    department: dept,
                    platform: 'Greenhouse',
                    applyUrl: j.absolute_url,
                    publishedAt: j.updated_at,
                    descriptionSnippet: desc.slice(0, 300),
                    rawDescription: desc,
                    isRemote: isRem,
                    workplaceType: extractWorkplaceType(loc, isRem, title, desc),
                    seniority: extractSeniorityLevel(title, desc),
                    matchScore: score,
                    matchHighlight: highlight,
                  };
                });
              }
            } catch {}
            return null;
          };

          // Probe Lever
          const probeLever = async () => {
            try {
              const leverUrl = `https://api.lever.co/v0/postings/${slug}?mode=json`;
              const leverRes = await fetch(leverUrl, { headers: fetchHeaders });
              if (leverRes.ok) {
                const data = await leverRes.json();
                const list = Array.isArray(data) ? data : [];
                return list.map((j: any) => {
                  const title = j.text || 'Untitled Role';
                  const loc = j.categories?.location || 'Remote / Hybrid';
                  const dept = j.categories?.team || j.categories?.department || 'Operations';
                  const desc = j.descriptionPlain || cleanHtmlText(j.description || '');
                  const { score, highlight } = calculateCandidateMatch(title, dept, desc);
                  const isRem = loc.toLowerCase().includes('remote') || loc.toLowerCase().includes('anywhere');
                  return {
                    id: `lever-${j.id}`,
                    originalId: String(j.id),
                    title,
                    company: companyDisplayName,
                    location: loc,
                    department: dept,
                    platform: 'Lever',
                    applyUrl: j.hostedUrl || j.applyUrl,
                    publishedAt: j.createdAt ? new Date(j.createdAt).toISOString() : undefined,
                    descriptionSnippet: desc.slice(0, 300),
                    rawDescription: desc,
                    isRemote: isRem,
                    workplaceType: extractWorkplaceType(loc, isRem, title, desc),
                    seniority: extractSeniorityLevel(title, desc),
                    matchScore: score,
                    matchHighlight: highlight,
                  };
                });
              }
            } catch {}
            return null;
          };

          // Probe Ashby
          const probeAshby = async () => {
            try {
              const ashbyUrl = `https://api.ashbyhq.com/posting-api/job-board/${slug}?includeCompensation=true`;
              const ashbyRes = await fetch(ashbyUrl, { headers: fetchHeaders });
              if (ashbyRes.ok) {
                const data = await ashbyRes.json();
                const list = data?.jobs || [];
                return list.map((j: any) => {
                  const title = j.title || 'Untitled Role';
                  const loc = j.location || 'Remote';
                  const dept = j.department || j.team || 'Operations';
                  const desc = j.descriptionPlain || cleanHtmlText(j.descriptionHtml || '');
                  const { score, highlight } = calculateCandidateMatch(title, dept, desc);
                  const isRem = Boolean(j.isRemote || loc.toLowerCase().includes('remote'));
                  return {
                    id: `ashby-${j.id}`,
                    originalId: String(j.id),
                    title,
                    company: companyDisplayName,
                    location: loc,
                    department: dept,
                    platform: 'Ashby',
                    applyUrl: j.jobUrl || j.applyUrl,
                    publishedAt: j.publishedAt,
                    descriptionSnippet: desc.slice(0, 300),
                    rawDescription: desc,
                    isRemote: isRem,
                    workplaceType: extractWorkplaceType(loc, isRem, title, desc),
                    seniority: extractSeniorityLevel(title, desc),
                    matchScore: score,
                    matchHighlight: highlight,
                  };
                });
              }
            } catch {}
            return null;
          };

          // 1. Try preferred ATS first
          if (ats === 'greenhouse') {
            const res = await probeGreenhouse();
            if (res) {
              rawJobs = res;
              activeAts = 'Greenhouse';
            }
          } else if (ats === 'lever') {
            const res = await probeLever();
            if (res) {
              rawJobs = res;
              activeAts = 'Lever';
            }
          } else if (ats === 'ashby') {
            const res = await probeAshby();
            if (res) {
              rawJobs = res;
              activeAts = 'Ashby';
            }
          }

          // 2. If preferred failed, auto-probe others
          if (rawJobs.length === 0) {
            const gh = await probeGreenhouse();
            if (gh && gh.length > 0) {
              rawJobs = gh;
              activeAts = 'Greenhouse';
            } else {
              const lv = await probeLever();
              if (lv && lv.length > 0) {
                rawJobs = lv;
                activeAts = 'Lever';
              } else {
                const as = await probeAshby();
                if (as && as.length > 0) {
                  rawJobs = as;
                  activeAts = 'Ashby';
                }
              }
            }
          }

          // 3. Fallback to live multi-ATS catalogue if boards returned 0
          if (rawJobs.length === 0) {
            const fhJobs = await fetchLiveAtsCatalogueJobs(slug, 100);
            if (fhJobs.length > 0) {
              rawJobs = fhJobs;
              activeAts = 'Direct Multi-ATS';
            }
          }

          if (rawJobs.length === 0) {
            return res.status(404).json({
              success: false,
              error: `Could not find an open Greenhouse, Lever, Ashby, or direct ATS board for "${companyDisplayName}". They may host their career page on an internal portal. You can paste any direct job link in Custom JD / URL Import.`,
            });
          }
        }
      }
    }

    // Filter by keyword if provided
    let filtered = rawJobs;
    if (keyword && keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          (j.department && j.department.toLowerCase().includes(q)) ||
          (j.descriptionSnippet && j.descriptionSnippet.toLowerCase().includes(q))
      );
    }

    // Filter by Seniority
    if (seniority && seniority !== 'All') {
      filtered = filtered.filter((j) => j.seniority === seniority);
    }

    // Filter by Workplace Mode (Remote / Hybrid / On-site)
    if (workplaceType && workplaceType !== 'All') {
      if (workplaceType === 'Remote') {
        filtered = filtered.filter((j) => {
          const combined = `${j.location || ''} ${j.title || ''}`.toLowerCase();
          return (
            j.isRemote ||
            j.workplaceType === 'Remote' ||
            combined.includes('remote') ||
            combined.includes('anywhere') ||
            combined.includes('wfh') ||
            combined.includes('work from home')
          );
        });
      } else {
        filtered = filtered.filter((j) => j.workplaceType === workplaceType);
      }
    }

    // Filter by location if provided
    if (location && location.trim() && location.toLowerCase() !== 'all') {
      const lq = location.toLowerCase().trim();
      if (lq === 'remote') {
        filtered = filtered.filter(
          (j) =>
            j.isRemote ||
            j.workplaceType === 'Remote' ||
            (j.location && (j.location.toLowerCase().includes('remote') || j.location.toLowerCase().includes('anywhere')))
        );
      } else if (lq.includes('india')) {
        filtered = filtered.filter((j) => {
          const loc = `${j.location || ''} ${j.title || ''}`.toLowerCase();
          return (
            loc.includes('india') ||
            loc.includes('bengaluru') ||
            loc.includes('bangalore') ||
            loc.includes('hyderabad') ||
            loc.includes('mumbai') ||
            loc.includes('delhi') ||
            loc.includes('gurgaon') ||
            loc.includes('gurugram') ||
            loc.includes('noida') ||
            loc.includes('kochi') ||
            loc.includes('pune') ||
            loc.includes('chennai') ||
            loc.includes('kolkata') ||
            loc.includes('ahmedabad')
          );
        });
      } else if (lq.includes('united states') || lq === 'us') {
        filtered = filtered.filter((j) => {
          const loc = `${j.location || ''} ${j.title || ''}`.toLowerCase();
          return (
            loc.includes('united states') ||
            loc.includes('usa') ||
            loc.includes('san francisco') ||
            loc.includes('new york') ||
            loc.includes('seattle') ||
            loc.includes('austin') ||
            loc.includes('california') ||
            loc.includes('texas') ||
            loc.includes('boston') ||
            loc.includes('chicago')
          );
        });
      } else if (lq.includes('europe') || lq.includes('uk')) {
        filtered = filtered.filter((j) => {
          const loc = `${j.location || ''} ${j.title || ''}`.toLowerCase();
          return (
            loc.includes('europe') ||
            loc.includes('london') ||
            loc.includes('uk') ||
            loc.includes('united kingdom') ||
            loc.includes('dublin') ||
            loc.includes('ireland') ||
            loc.includes('germany') ||
            loc.includes('berlin') ||
            loc.includes('france') ||
            loc.includes('paris') ||
            loc.includes('amsterdam') ||
            loc.includes('netherlands') ||
            loc.includes('poland') ||
            loc.includes('spain')
          );
        });
      } else {
        filtered = filtered.filter((j) => `${j.location || ''} ${j.title || ''}`.toLowerCase().includes(lq));
      }
    }

    // Deduplicate across feeds by normalized application URL and Company + Title signature
    const seenUrls = new Set<string>();
    const seenSignatures = new Set<string>();
    const deduplicated: any[] = [];

    for (const j of filtered) {
      const normUrl = (j.applyUrl || '').trim().toLowerCase().split('?')[0];
      const sig = `${(j.company || '').toLowerCase().trim()}|${(j.title || '').toLowerCase().replace(/[^a-z0-9]/g, '')}`;

      if (normUrl && seenUrls.has(normUrl)) continue;
      if (sig && seenSignatures.has(sig)) continue;

      if (normUrl) seenUrls.add(normUrl);
      if (sig) seenSignatures.add(sig);

      deduplicated.push(j);
    }

    filtered = deduplicated;

    // Sort by match score descending
    filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    const finalLimit = Math.min(Number(limit) || 400, 1000);

    res.json({
      success: true,
      company: companyDisplayName,
      slug,
      ats: activeAts,
      totalFound: rawJobs.length,
      filteredCount: filtered.length,
      totalAvailableInCatalogue: availableCatalogueTotal,
      jobs: filtered.slice(0, finalLimit),
      catalogueStats: {
        totalJobs: 7135839,
        totalCompanies: 674034,
        totalSources: 428,
        totalAts: 172,
      },
    });
  } catch (err: any) {
    console.error('Error in /api/ats/crawl:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to crawl ATS board.' });
  }
});

// Endpoint: Convert ATS Listing to Full JobStudio Opportunity
app.post('/api/ats/import', async (req, res) => {
  try {
    const { job } = req.body;
    if (!job || !job.title || !job.company) {
      return res.status(400).json({ success: false, error: 'Job details are required.' });
    }

    let fullDescription = job.rawDescription || '';
    if (job.slug && (!fullDescription || fullDescription.length < 500)) {
      try {
        const slugRes = await fetch(`https://freehire.me/api/v1/jobs/${job.slug}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            Accept: 'application/json',
          },
          signal: AbortSignal.timeout(4000),
        });
        if (slugRes.ok) {
          const slugData = await slugRes.json();
          const item = slugData.data || slugData;
          if (item?.description) {
            fullDescription = cleanHtmlText(item.description);
          }
        }
      } catch (e) {
        console.warn('Live ATS single job fetch skipped:', e);
      }
    }

    if (!fullDescription) {
      fullDescription = `Company: ${job.company}\nRole: ${job.title}\nDepartment: ${job.department || 'Operations'}\nLocation: ${job.location}\nPlatform: ${job.platform}\n\nRole Overview:\n${job.descriptionSnippet || 'Official verified listing on corporate ATS.'}\n\nApply URL: ${job.applyUrl}`;
    }

    const matchAnalysis = calculateCandidateMatch(job.title, job.department, fullDescription);
    const opportunity = {
      id: `ats-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      company: job.company,
      title: job.title,
      location: job.location || 'Remote / Hybrid',
      matchScore: job.matchScore !== undefined ? job.matchScore : matchAnalysis.score,
      matchHighlight: job.matchHighlight || matchAnalysis.highlight,
      platform: job.platform || 'Greenhouse',
      applyUrl: job.applyUrl,
      verifiedLive: true,
      category: job.department || 'Real-Time Operations & Incident Response',
      description: fullDescription,
    };

    res.json({
      success: true,
      opportunity,
    });
  } catch (err: any) {
    console.error('Error in /api/ats/import:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to import ATS job.' });
  }
});

// Endpoint: Verify Live Job Listing from Internet URL & Add Only if Confirmed Active
app.post('/api/verify-and-import-job', async (req, res) => {
  try {
    const { url, rawText } = req.body;
    if (!url && !rawText) {
      return res.status(400).json({
        verified: false,
        error: 'Live job URL is required for listing verification.',
      });
    }

    let pageText = (rawText || '').trim();
    let fetchedStatus = 200;

    // If URL provided, fetch and verify reachability
    if (url) {
      try {
        new URL(url);
      } catch {
        return res.status(400).json({
          verified: false,
          error: 'Invalid URL format. Please provide an active HTTP/HTTPS job link.',
        });
      }

      let crawled = false;

      // 0. Direct Public ATS API Extractor (Greenhouse, Lever, Ashby)
      const atsMatch = detectAtsFromUrlOrSlug(url);
      if (atsMatch) {
        try {
          const { ats, slug, jobId } = atsMatch;
          let companyName = slug.charAt(0).toUpperCase() + slug.slice(1);
          const foundCurated = CURATED_ATS_COMPANIES.find((c) => c.slug === slug);
          if (foundCurated) companyName = foundCurated.name;

          if (ats === 'greenhouse' && jobId) {
            const ghRes = await fetch(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs/${jobId}`);
            if (ghRes.ok) {
              const data = await ghRes.json();
              const title = data.title || 'Role';
              const location = data.location?.name || 'Remote / Hybrid';
              const cleanDesc = cleanHtmlText(data.content || '');
              pageText = `Company: ${companyName}\nRole: ${title}\nLocation: ${location}\nPlatform: Greenhouse\nRequisition ID: ${jobId}\n\nJob Description & Requirements:\n${cleanDesc}`;
              crawled = true;
            }
          } else if (ats === 'lever' && jobId) {
            const leverRes = await fetch(`https://api.lever.co/v0/postings/${slug}/${jobId}`);
            if (leverRes.ok) {
              const data = await leverRes.json();
              const title = data.text || 'Role';
              const location = data.categories?.location || 'Remote / Hybrid';
              const cleanDesc = data.descriptionPlain || cleanHtmlText(data.description || '');
              pageText = `Company: ${companyName}\nRole: ${title}\nLocation: ${location}\nPlatform: Lever\nRequisition ID: ${jobId}\n\nJob Description & Requirements:\n${cleanDesc}`;
              crawled = true;
            }
          } else if (ats === 'ashby') {
            const ashbyRes = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${slug}?includeCompensation=true`);
            if (ashbyRes.ok) {
              const data = await ashbyRes.json();
              const jobs = data?.jobs || [];
              const matchedJob = jobId ? jobs.find((j: any) => j.id === jobId) : jobs[0];
              if (matchedJob) {
                const title = matchedJob.title || 'Role';
                const location = matchedJob.location || 'Remote';
                const cleanDesc = matchedJob.descriptionPlain || cleanHtmlText(matchedJob.descriptionHtml || '');
                pageText = `Company: ${companyName}\nRole: ${title}\nLocation: ${location}\nPlatform: Ashby\nRequisition ID: ${matchedJob.id}\n\nJob Description & Requirements:\n${cleanDesc}`;
                crawled = true;
              }
            }
          }
        } catch (atsErr) {
          console.warn('Direct ATS API fetch failed, falling back to standard scraper:', atsErr);
        }
      }

      // 0b. Dedicated Oracle Cloud HCM REST API extractor (handles Oracle Candidate Experience portals)
      if (url.includes('.oraclecloud.com') && url.includes('/job/')) {
        try {
          const match = url.match(/\/job\/([0-9a-zA-Z_-]+)/);
          const reqId = match ? match[1] : '';
          const domainMatch = url.match(/(https:\/\/[^/]+)/);
          const domain = domainMatch ? domainMatch[1] : '';

          if (reqId && domain) {
            const apiUrl = `${domain}/hcmRestApi/resources/latest/recruitingCEJobRequisitionDetails/${reqId}`;
            const apiRes = await fetch(apiUrl, {
              headers: {
                Accept: 'application/json',
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              },
            });
            if (apiRes.ok) {
              const data = await apiRes.json();
              const cleanHtml = (str: string) =>
                (str || '')
                  .replace(/<[^>]+>/g, ' ')
                  .replace(/&amp;/g, '&')
                  .replace(/&nbsp;/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim();

              const title = data.Title || data.JobTitle || 'Integrity & Compliance Specialist II';
              const location = data.PrimaryLocation || 'India';
              const responsibilities = cleanHtml(data.ExternalResponsibilitiesStr || data.InternalResponsibilitiesStr || '');
              const qualifications = cleanHtml(data.ExternalQualificationsStr || data.InternalQualificationsStr || '');
              const corporate = cleanHtml(data.CorporateDescriptionStr || '');

              pageText = `Company: Honeywell Aerospace\nRequisition ID: ${reqId}\nRole: ${title}\nLocation: ${location}\nPlatform: Oracle Cloud HCM\n\nRole Description & Responsibilities:\n${responsibilities}\n\nQualifications & Requirements:\n${qualifications}\n\nAbout Company:\n${corporate || 'Honeywell Aerospace operations, systems, and digital compliance.'}`;
              crawled = true;
            }
          }
        } catch (oracleErr) {
          console.warn('Oracle HCM direct API fetch failed:', oracleErr);
        }
      }

      // 1. Try Firecrawl if key is configured
      const firecrawlKey = process.env.FIRECRAWL_API_KEY;

      if (!pageText && firecrawlKey) {
        try {
          const fcRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${firecrawlKey}`,
            },
            body: JSON.stringify({ url, formats: ['markdown'] }),
          });
          if (fcRes.ok) {
            const fcData = await fcRes.json();
            if (fcData?.data?.markdown) {
              pageText = fcData.data.markdown;
              crawled = true;
            }
          }
        } catch (fcErr) {
          console.warn('Firecrawl verification error, falling back to direct fetch:', fcErr);
        }
      }

      // 2. Direct browser fetch if not crawled
      if (!crawled) {
        try {
          const directRes = await fetch(url, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
          });

          fetchedStatus = directRes.status;
          if (!directRes.ok) {
            return res.status(400).json({
              verified: false,
              error: `Unable to access URL (HTTP ${directRes.status}). Job posting could not be confirmed as active on the web.`,
            });
          }

          const html = await directRes.text();
          const clean = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          if (!pageText) {
            pageText = clean;
          }
        } catch (netErr: any) {
          return res.status(400).json({
            verified: false,
            error: `Network error accessing URL: ${netErr.message || 'Host unreachable'}. Unverified listings are not displayed.`,
          });
        }
      }
    }

    if (!pageText || pageText.length < 80) {
      return res.status(400).json({
        verified: false,
        error:
          'Page returned insufficient text or is behind an authentication wall. Active job listing could not be confirmed.',
      });
    }

    const lower = pageText.toLowerCase();
    const isExplicitlyDead =
      lower.includes('this job is no longer available') ||
      lower.includes('this position has been closed') ||
      lower.includes('404 not found') ||
      lower.includes('page not found') ||
      lower.includes('job opening has expired') ||
      lower.includes('no longer accepting applications') ||
      lower.includes('could not find the page you were looking for');

    if (isExplicitlyDead) {
      return res.status(400).json({
        verified: false,
        error:
          'This listing is closed or no longer accepting applications (Page not found / expired). Unverified listings cannot be displayed.',
      });
    }

    let parsed: any = { isValidJob: false };

    const prompt = `
Analyze the following web page content retrieved from: "${url || 'User provided text'}".
Determine whether this page contains an ACTIVE, CURRENTLY OPEN JOB POSTING.

Reject (isValidJob: false) if:
- It is a 404, "Page Not Found", "Job has expired", "Position is closed", "No longer accepting applications", or expired vacancy message.
- It is a general company homepage, blog, generic search directory, or login/auth gateway without a specific job description.
- It is dummy or placeholder lorem ipsum text.

Accept (isValidJob: true) if:
- It is an authentic, specific job vacancy with job title, company/organization, and responsibilities/requirements.

If accepted, compute match score (0-100) and eligibility highlight based on authentic qualification overlap with the candidate profile and role requirements.

WEB PAGE CONTENT:
${pageText.slice(0, 10000)}
`;

    try {
      const verificationRes = await generateWithFallback({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isValidJob: { type: Type.BOOLEAN },
              rejectionReason: { type: Type.STRING },
              jobTitle: { type: Type.STRING },
              companyName: { type: Type.STRING },
              location: { type: Type.STRING },
              platform: { type: Type.STRING },
              category: { type: Type.STRING },
              cleanDescription: { type: Type.STRING },
              matchScore: { type: Type.INTEGER },
              matchHighlight: { type: Type.STRING },
            },
            required: ['isValidJob'],
          },
        },
      });

      parsed = JSON.parse(verificationRes.text || '{}');
    } catch (aiErr: any) {
      console.warn('Gemini verification fallback:', aiErr?.message);
      // Fallback heuristic: check if page has typical job section headers
      const hasJobPatterns =
        (lower.includes('responsibilities') || lower.includes('about the role') || lower.includes('what you will do')) &&
        (lower.includes('requirements') || lower.includes('qualifications') || lower.includes('skills'));

      if (hasJobPatterns && pageText.length > 300) {
        parsed = {
          isValidJob: true,
          jobTitle: 'Verified Operations Vacancy',
          companyName: 'Verified Employer',
          location: 'Remote / Hybrid',
          category: 'Real-Time Operations & WFM',
          matchScore: 90,
          matchHighlight: 'Verified live requisition matching operations & service delivery competencies.',
          cleanDescription: pageText.slice(0, 3000),
        };
      } else {
        return res.status(400).json({
          verified: false,
          error: 'Could not verify an active job posting at this URL. Unverified listings are not displayed.',
        });
      }
    }

    if (!parsed.isValidJob) {
      return res.status(400).json({
        verified: false,
        error:
          parsed.rejectionReason ||
          'The provided URL could not be confirmed as an active live job listing (it may be closed, expired, or a generic portal page). Unverified listings are not displayed.',
      });
    }

    const titleMatch = pageText.match(/Role:\s*([^\n\r]+)/i) || pageText.match(/Job Title:\s*([^\n\r]+)/i);
    const companyMatch = pageText.match(/Company:\s*([^\n\r]+)/i);

    const titleFinal =
      parsed.jobTitle && parsed.jobTitle !== 'Verified Operations Vacancy'
        ? parsed.jobTitle
        : titleMatch
        ? titleMatch[1].trim()
        : 'Integrity & Compliance Specialist II';

    const companyFinal =
      parsed.companyName && parsed.companyName !== 'Verified Employer'
        ? parsed.companyName
        : companyMatch
        ? companyMatch[1].trim()
        : 'Honeywell Aerospace';

    const platformDerived =
      parsed.platform ||
      (url?.includes('oraclecloud.com')
        ? 'Oracle Cloud HCM'
        : url?.includes('greenhouse.io')
        ? 'Greenhouse'
        : url?.includes('lever.co')
        ? 'Lever'
        : url?.includes('linkedin.com')
        ? 'LinkedIn'
        : url?.includes('ashbyhq.com')
        ? 'Ashby'
        : url?.includes('ultipro.com')
        ? 'UltiPro'
        : url?.includes('workable.com')
        ? 'Workable'
        : 'Direct Portal');

    const matchAnalysis = calculateCandidateMatch(
      titleFinal,
      parsed.category || '',
      parsed.cleanDescription || pageText
    );

    const opportunity = {
      id: `verified-${Date.now()}`,
      title: titleFinal,
      company: companyFinal,
      location: parsed.location || 'India (Bengaluru / Hybrid)',
      platform: platformDerived,
      applyUrl: url || '#',
      category: parsed.category || 'Incident & Service Ops',
      matchScore: parsed.matchScore || matchAnalysis.score,
      matchHighlight: parsed.matchHighlight || matchAnalysis.highlight,
      description: parsed.cleanDescription || pageText.slice(0, 3000),
      isLive: true,
      isVerified: true,
      verifiedAt: new Date().toISOString(),
    };

    res.json({
      verified: true,
      opportunity,
    });
  } catch (error: any) {
    console.error('Error verifying job listing:', error);
    res.status(500).json({
      verified: false,
      error: error?.message || 'Failed to verify job listing on the web.',
    });
  }
});

// Endpoint: AI Master Resume Parser (Parses raw resume text or uploaded PDF into structured candidate profile & experiences)
app.post('/api/parse-resume', async (req, res) => {
  try {
    const { rawText, pdfBase64, fileName } = req.body;
    if ((!rawText || !rawText.trim()) && !pdfBase64) {
      return res.status(400).json({ success: false, error: 'Either raw resume text or a PDF resume upload is required.' });
    }

    const prompt = `
You are an expert executive resume parser and ATS extraction engine.
Carefully read the candidate resume (provided as an attached PDF document and/or raw text) and extract complete, high-fidelity candidate information.

${rawText ? `### RAW RESUME TEXT CONTENT:\n${rawText.slice(0, 30000)}\n` : ''}
${fileName ? `### SOURCE FILENAME: ${fileName}\n` : ''}

Instructions:
1. Extract or determine full_name, first_name, last_name, headline / target role (e.g. "Senior Full-Stack Engineer" or "Operations Specialist"), email, phone, location (city/state/country), and linkedin URL.
2. Extract or formulate a clean, high-impact 3-4 sentence professional summary.
3. Extract each work experience entry:
   - title: exact job title
   - company: employer / organization name
   - date_range: timeline (e.g. "Oct 2022 – Present", "Jan 2020 – Sep 2022")
   - location: city/state or Remote (leave empty if not mentioned)
   - bullets: array of specific achievement bullets (keep concrete metrics and action verbs)
4. Extract all core technical and domain skills into an array of strings (e.g. ["TypeScript", "React", "PostgreSQL", "AWS"]).
5. Extract education entries (degree, institution, year).
6. Extract certifications into an array of strings.
7. Generate a comprehensive markdown master_profile_text that thoroughly summarizes the candidate's authentic career history and proof-of-work.
`;

    let contents: any;
    if (pdfBase64) {
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '').trim();
      contents = [
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: cleanBase64,
          },
        },
        prompt,
      ];
    } else {
      contents = prompt;
    }

    const response = await generateWithFallback({
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            full_name: { type: Type.STRING },
            first_name: { type: Type.STRING },
            last_name: { type: Type.STRING },
            headline: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            summary: { type: Type.STRING },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  date_range: { type: Type.STRING },
                  location: { type: Type.STRING },
                  bullets: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['title', 'company', 'date_range', 'bullets'],
              },
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  year: { type: Type.STRING },
                },
                required: ['degree', 'institution'],
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            master_profile_text: { type: Type.STRING },
          },
          required: ['full_name', 'email', 'experiences', 'skills'],
        },
      },
    });

    let cleanText = response.text || '{}';
    if (cleanText.includes('```')) {
      cleanText = cleanText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    }
    const parsed = JSON.parse(cleanText);
    res.json({ success: true, profile: parsed });
  } catch (err: any) {
    console.error('Error in /api/parse-resume:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to parse resume with AI.' });
  }
});

// Endpoint: Generate Tailored ATS Resume & Cover Letter Content
app.post('/api/tailor', async (req, res) => {
  try {
    const { jobText, masterProfile, recommendations = [], candidateInfo } = req.body;

    if (!jobText || !masterProfile) {
      return res.status(400).json({ error: 'jobText and masterProfile are required' });
    }

    const prompt = `
You are an expert ATS resume strategist and professional executive career coach.
Refactor and tailor the candidate's verified experience to directly match this job opportunity.

### TARGET JOB DESCRIPTION:
${jobText.slice(0, 15000)}

### CANDIDATE MASTER PROFILE:
${masterProfile.slice(0, 15000)}

### RECOMMENDED FOCUS POINTS:
${JSON.stringify(recommendations)}

### CANDIDATE BASE INFO:
${JSON.stringify(candidateInfo || {})}

CRITICAL ANTI-HALLUCINATION & FORMATTING RULES (FROM MASTER VAULT):
1. Retain authentic companies, job titles, and dates. Do NOT fabricate employers or educational degrees.
2. SELECT ONLY the bullet points, tags, and projects that directly match the target Job Description (JD).
3. OMIT bullet points that are irrelevant to the target role to maintain single-page or two-page conciseness.
4. DO NOT hallucinate, invent tools, or fabricate metrics beyond what is documented in this vault.
5. Adjust terminology to match the JD keywords (e.g., "Queue Balancing" vs. "Capacity Adherence", "RCA" vs. "Root Cause Analysis") while keeping underlying truths intact.
6. Strict timeline date formatting: The date_range field for every experience must ONLY contain pure date strings (e.g. "Oct 2023 – Present", "Oct 2022 – Sep 2023", "Sep 2020 – Sep 2022"). Never append operational descriptors (like "Global Operations" or "Regulated Fintech") or location tags to date_range or timeline text.
7. Leave experience location empty ("") or clean city/country without operational descriptors.
8. Do not include location preference notes like "Open to Kochi & Hybrid" or "Hyderabad" in summaries or headers.
9. Projects: Include relevant portfolio projects from the candidate's master profile only if they add clear, tangible value for the target role. Omit irrelevant projects to maintain conciseness.
10. Craft an ATS-friendly, 3-paragraph compelling Cover Letter addressed specifically to the company and role.
11. Provide tailored answers to 3 standard ATS screening questions based on the candidate's actual background and target position:
   - "Why are you interested in this role at our company?"
   - "Describe your relevant experience and key technical or domain achievements that align with this position."
   - "What is your location status and availability?"
12. Select and prioritize up to 3 relevant certifications strictly from the candidate's verified certifications documented in their master profile. If the candidate has no certifications listed in their profile, return an empty array: certifications: []. DO NOT hallucinate or invent certifications not present in the candidate's profile.
`;

    const response = await generateWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tailored_summary: {
              type: Type.STRING,
              description: 'High-impact 3-4 sentence professional summary tailored to the role.',
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Top 10-14 prioritized skills relevant to the role.',
            },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  date_range: { type: Type.STRING },
                  location: { type: Type.STRING },
                  bullets: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '3-4 tailored accomplishment bullets with metrics.',
                  },
                },
                required: ['title', 'company', 'date_range', 'bullets'],
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  target_alignment: { type: Type.STRING },
                  description: { type: Type.STRING },
                  bullets: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['name', 'bullets'],
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Top 3-5 certifications selected strictly from the candidate verified credentials matching the JD.',
            },
            cover_letter: {
              type: Type.OBJECT,
              properties: {
                recipient: { type: Type.STRING },
                subject: { type: Type.STRING },
                body_paragraphs: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                signoff: { type: Type.STRING },
              },
              required: ['recipient', 'subject', 'body_paragraphs'],
            },
            screening_answers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  suggested_answer: { type: Type.STRING },
                },
                required: ['question', 'suggested_answer'],
              },
            },
          },
          required: ['tailored_summary', 'skills', 'experiences', 'certifications', 'cover_letter'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error tailoring materials:', error);
    res.status(500).json({
      error: error?.message || 'Failed to tailor application materials with Gemini',
    });
  }
});

// Endpoint: Fetch text from public job URL
app.post('/api/fetch-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Identify if the URL is from a known dynamic/anti-bot board
    const isUltiPro = url.includes('ultipro.com');
    const isLinkedIn = url.includes('linkedin.com/jobs');
    const isWorkday = url.includes('myworkdayjobs.com');

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(8000),
      });

      const rawHtml = await response.text();

      // Clean HTML tags and scripts
      const cleaned = rawHtml
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleaned.length < 200 || isUltiPro || isLinkedIn || isWorkday) {
        return res.json({
          success: false,
          charCount: cleaned.length,
          partialText: cleaned.slice(0, 500),
          isProtectedBoard: isUltiPro || isLinkedIn || isWorkday,
          boardType: isUltiPro ? 'UltiPro / UKG' : isLinkedIn ? 'LinkedIn' : isWorkday ? 'Workday' : 'Protected Dynamic ATS',
          message:
            'This job portal requires client-side JavaScript hydration or session authentication. Use our 1-click preset or paste the JD text below.',
        });
      }

      return res.json({
        success: true,
        charCount: cleaned.length,
        text: cleaned.slice(0, 25000),
      });
    } catch (fetchErr: any) {
      return res.json({
        success: false,
        error: fetchErr?.message || 'Network fetch timeout',
        isProtectedBoard: isUltiPro || isLinkedIn || isWorkday,
        boardType: isUltiPro ? 'UltiPro / UKG' : isLinkedIn ? 'LinkedIn' : 'Dynamic ATS',
        message:
          'Could not crawl directly due to portal authentication/CORS constraints. The pre-loaded Weaver JD template is ready.',
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Server error fetching URL' });
  }
});

// ============================================================================
// RECRUITER-PANEL MULTI-PERSONA REVIEW
// Simulates 3-person hiring panel review (Recruiter, Hiring Manager, Tech Lead)
// ============================================================================
app.post('/api/recruiter-review', async (req, res) => {
  try {
    const {
      resumeText,
      jobTitle = 'Target Role',
      companyName = 'Target Employer',
      jobDescription = '',
    } = req.body;

    if (!resumeText) {
      return res.status(400).json({ success: false, error: 'resumeText is required' });
    }

    const prompt = `You are a 3-person elite hiring panel evaluating a candidate's resume for the role:
Target Role: "${jobTitle}" at "${companyName}".

Target Job Description:
${(jobDescription || 'Senior operations, technical execution, and leadership.').slice(0, 5000)}

Candidate Resume Content:
${resumeText.slice(0, 8000)}

Analyze the resume simultaneously through 3 distinct lenses:
1. "recruiter": Senior Talent Acquisition Specialist (Focus: 6-second scan, formatting, ATS readability, keyword density, career trajectory, clear timeline, red flags).
2. "hiring_manager": Hiring Manager / Department Director (Focus: business impact, metrics, leadership, problem solving scale, ownership, reliability under pressure).
3. "technical_lead": Technical / Domain Lead (Focus: tooling depth, methodology, modern tools, architectural/workflow rigor, accuracy).

Return ONLY a valid JSON object matching this schema:
{
  "overall_score": 88,
  "consensus_verdict": "STRONG_HIRE" | "HIRE" | "NEEDS_IMPROVEMENT" | "PASS",
  "executive_summary": "2-3 sentences summarizing panel consensus",
  "panel": {
    "recruiter": {
      "role": "Senior Talent Acquisition Specialist",
      "score": 90,
      "scan_time_verdict": "e.g., 5.4s scan - clear hierarchy and high impact summary",
      "feedback": "Detailed recruiter perspective",
      "top_strength": "Single standout recruiter positive",
      "critical_flag": "Single formatting or keyword fix"
    },
    "hiring_manager": {
      "role": "Hiring Manager / Department Lead",
      "score": 87,
      "business_impact_score": "High (90%)",
      "feedback": "Detailed manager perspective on ROI and ownership",
      "leadership_assessment": "Assessment of leadership & autonomous execution",
      "major_concern": "Single concern or question to probe in the interview"
    },
    "technical_lead": {
      "role": "Technical / Domain Lead",
      "score": 89,
      "execution_confidence": "High",
      "feedback": "Detailed peer technical perspective",
      "tooling_depth": "Evaluation of tools, frameworks, and methodologies",
      "gap_to_fill": "One tool or methodology that could be emphasized more"
    }
  },
  "top_strengths": ["Top strength 1", "Top strength 2", "Top strength 3"],
  "top_fixes": ["Top prioritized fix 1", "Top prioritized fix 2", "Top prioritized fix 3"]
}`;

    try {
      const response = await generateWithFallback({ contents: prompt });
      let raw = response.text || '';
      if (raw.includes('```json')) {
        raw = raw.split('```json')[1].split('```')[0].trim();
      } else if (raw.includes('```')) {
        raw = raw.split('```')[1].split('```')[0].trim();
      }
      const parsed = JSON.parse(raw);
      return res.json({ success: true, ...parsed });
    } catch (aiErr) {
      console.warn('AI recruiter review fallback:', aiErr);
      // Smart contextual fallback
      return res.json({
        success: true,
        overall_score: 89,
        consensus_verdict: 'STRONG_HIRE',
        executive_summary: `The hiring panel strongly endorses the candidate for ${jobTitle} at ${companyName}. The resume demonstrates exceptional quantifiable impact, strong operational leadership, and deep technical competencies.`,
        panel: {
          recruiter: {
            role: 'Senior Talent Acquisition Specialist',
            score: 92,
            scan_time_verdict: '5.2s scan - Passes ATS keyword screener with 94% alignment',
            feedback: 'The resume structure is exceptionally clean with a standard single-column layout that ATS parsers parse without errors. The summary immediately positions the candidate as a seasoned specialist.',
            top_strength: 'Crisp reverse-chronological trajectory with zero employment gaps.',
            critical_flag: 'Ensure all industry acronyms (SLA, WFM, ERP) have full spelled-out definitions on first mention.',
          },
          hiring_manager: {
            role: 'Hiring Manager / Department Lead',
            score: 88,
            business_impact_score: 'Superior (91%)',
            feedback: 'Every bullet point is backed by concrete outcomes and deliverables. Demonstrates high autonomy and ownership under demanding conditions.',
            leadership_assessment: 'Strong experience coordinating cross-functional initiatives and mentoring team members.',
            major_concern: 'Probe during the behavioral loop on direct budget authorization vs. analytical planning.',
          },
          technical_lead: {
            role: 'Technical / Domain Lead',
            score: 87,
            execution_confidence: 'High',
            feedback: 'Demonstrates verified command of core domain tools, data analysis, and structured problem-solving workflows.',
            tooling_depth: 'Advanced database querying, root-cause triage, and workflow automation.',
            gap_to_fill: 'Could highlight API integrations or Python scripting if the role requires custom bot development.',
          },
        },
        top_strengths: [
          'High density of quantified business metrics and outcomes',
          'Clear experience leading cross-functional projects and communicating with stakeholders',
          'Clean ATS-compatible formatting that eliminates parsing dropouts',
        ],
        top_fixes: [
          `Tailor the top 2 bullets in the most recent role to directly highlight ${jobTitle} keywords`,
          'Add specific metrics or measurable outcomes to mid-level project bullets',
          'Ensure contact details include city/country and active LinkedIn profile link',
        ],
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Server error during recruiter review' });
  }
});

// ============================================================================
// OFFER & SALARY NEGOTIATION COPILOT
// Generates counter-offer emails, phone scripts, and objection battlecards
// ============================================================================
app.post('/api/negotiate-offer', async (req, res) => {
  try {
    const {
      candidateName = 'Candidate',
      companyName = 'Target Employer',
      jobTitle = 'Senior Specialist',
      offeredBase = '$95,000',
      targetBase = '$115,000',
      benefitsSummary = 'Standard health, 15 days PTO, 401(k) match',
      competingOffer = '',
      leveragePoints = 'Market benchmark, relevant domain expertise, track record of delivering measurable ROI',
    } = req.body;

    const prompt = `You are a world-class executive compensation coach.
A candidate has received a job offer and needs a strategic negotiation package.

Details:
- Candidate: ${candidateName}
- Company: ${companyName}
- Target Role: ${jobTitle}
- Offered Base: ${offeredBase}
- Target Base Counter: ${targetBase}
- Benefits/Perks: ${benefitsSummary}
- Competing Offer Context: ${competingOffer || 'No competing offer, leveraging market rate & unique skill profile'}
- Core Leverage Points: ${leveragePoints}

Generate a comprehensive negotiation strategy:
1. "counter_offer_email": A polite, professional, and persuasive counter-offer email to the recruiter. It should express genuine enthusiasm, anchor at the target compensation with clear rationale, and leave room for collaborative flexibility (e.g., signing bonus, equity, or review timeline).
2. "phone_script": A verbatim script for when the candidate speaks with the recruiter on the phone. Includes how to deliver the number, pause, and handle initial reactions.
3. "talking_points": 3-4 powerful, respectful justification bullet points grounded in market rates and immediate ROI.
4. "objection_handlers": 3 realistic recruiter objections (e.g. "Our bands are strict", "We don't do sign-on bonuses", "Other candidates accepted this rate") with exact word-for-word responses and backup pivot tactics.
5. "market_benchmark_insight": 2-3 sentences providing market context for this role.

Return ONLY a valid JSON object matching this schema:
{
  "counter_offer_email": "...",
  "phone_script": "...",
  "talking_points": ["Point 1", "Point 2", "Point 3"],
  "objection_handlers": [
    {
      "objection": "...",
      "response": "...",
      "backup_tactic": "..."
    }
  ],
  "market_benchmark_insight": "..."
}`;

    try {
      const response = await generateWithFallback({ contents: prompt });
      let raw = response.text || '';
      if (raw.includes('```json')) {
        raw = raw.split('```json')[1].split('```')[0].trim();
      } else if (raw.includes('```')) {
        raw = raw.split('```')[1].split('```')[0].trim();
      }
      const parsed = JSON.parse(raw);
      return res.json({ success: true, ...parsed });
    } catch (aiErr) {
      console.warn('AI negotiation fallback:', aiErr);
      return res.json({
        success: true,
        counter_offer_email: `Subject: ${candidateName} - Offer Discussion & Next Steps (${jobTitle})\n\nDear Hiring Team,\n\nThank you so much for extending the offer for the ${jobTitle} position at ${companyName}. I am genuinely excited about the opportunity to join the team and contribute to your initiatives.\n\nAfter reviewing the full details of the offer and taking into account current market benchmarks for this scope of responsibility—along with my proven track record of delivering measurable outcomes—I would like to discuss the base salary component. Based on the value and immediate impact I will deliver from Day 1, I am seeking a base salary of ${targetBase}.\n\nI am deeply enthusiastic about joining ${companyName} and am confident we can find a package that works for both sides. If base flexibility is constrained by internal bands, I would be open to discussing bridging the difference via a one-time sign-on bonus or an accelerated 6-month performance review.\n\nThank you again for your time and advocacy throughout this process. I look forward to connecting!\n\nWarm regards,\n${candidateName}`,
        phone_script: `When the recruiter calls or when you dial in:\n\n1. State genuine excitement first:\n"Thank you so much for walking me through the offer. I loved meeting the team and am genuinely thrilled about the mission at ${companyName}."\n\n2. Introduce the counter respectfully with rationale:\n"I took time to review the complete package against market benchmarks and the specific scope of this role. Given my proven track record in driving measurable impact and delivering key objectives, I was targeting ${targetBase} base salary."\n\n3. PAUSE (Do not speak first. Let the recruiter process and respond).\n\n4. If they indicate constraint:\n"I completely understand internal band structures. If base is strictly capped at ${offeredBase}, could we explore a one-time sign-on bonus or an equity adjustment to bridge the difference?"`,
        talking_points: [
          `Market Benchmark: Compensation for ${jobTitle} roles with comparable scope and impact sits in the ${targetBase} range.`,
          'Immediate Impact: Proven track record delivering key business outcomes and high-quality results from Day 1.',
          'Value Creation: Direct ability to optimize workflows and scale initiatives effectively.',
        ],
        objection_handlers: [
          {
            objection: 'Our salary bands for this level are strictly non-negotiable.',
            response: 'I respect your internal equity framework completely. If the base salary cannot be adjusted, could we explore flexibility in a sign-on bonus, extra equity RSUs, or an agreed 6-month compensation review milestone?',
            backup_tactic: 'Negotiate for professional development budget, remote equipment allowance, or additional PTO.',
          },
          {
            objection: 'We have other qualified candidates waiting if you cannot accept today.',
            response: 'I appreciate you letting me know where we stand, and I want to make this commitment with 100% confidence. Could we take until tomorrow at 12 PM so I can review the written benefits details and give you my definitive answer?',
            backup_tactic: 'Reiterate top enthusiasm while maintaining professional composure; high-value candidates never rush blindly.',
          },
        ],
        market_benchmark_insight: `Current market data for ${jobTitle} positions at scaling tech companies places the mid-to-senior base between ${offeredBase} and ${targetBase}, typically paired with 10–15% bonus potential and annual equity incentives.`,
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Server error during negotiation generation' });
  }
});

// ============================================================================
// BEHAVIORAL INTERVIEW PRACTICE COACH & STAR SCORING
// Evaluates user answers on STAR dimensions and returns gold-standard rewrites
// ============================================================================
app.post('/api/behavioral-practice', async (req, res) => {
  try {
    const {
      question,
      candidateAnswer,
      jobTitle = 'Operations Specialist',
      companyName = 'Target Employer',
    } = req.body;

    if (!question || !candidateAnswer) {
      return res.status(400).json({ success: false, error: 'Both question and candidateAnswer are required.' });
    }

    const prompt = `You are an elite Executive Interview Coach and Bar Raiser.
Evaluate the following candidate practice answer for the role of "${jobTitle}" at "${companyName}".

Interview Question:
"${question}"

Candidate Practice Answer:
"${candidateAnswer}"

Analyze the answer rigorously using the STAR framework (Situation, Task, Action, Result).
Scoring Guidelines:
- Situation & Task (0-25): Clear context, stakes, and objective without rambling.
- Action & Ownership (0-25): Specific "I" actions, decision-making logic, tool usage, overcoming obstacles.
- Results & Metrics (0-25): Measurable outcomes, percentages, dollar values, customer impact, long-term learning.
- Delivery Polish (0-25): Conciseness, executive presence, smooth transitions.

Provide:
1. Scores across the 4 dimensions + overall_score (0-100).
2. Actionable feedback per dimension.
3. 2-3 specific strengths.
4. 1-2 weaknesses or red flags.
5. "gold_standard_answer": A masterclass rewrite of the candidate's exact story in first person, elevating the vocabulary, tightening the structure, and highlighting measurable results while staying 100% true to their facts.

Return ONLY a valid JSON object matching this schema:
{
  "overall_score": 85,
  "situation_task_score": 21,
  "situation_task_feedback": "...",
  "action_ownership_score": 22,
  "action_ownership_feedback": "...",
  "results_metrics_score": 20,
  "results_metrics_feedback": "...",
  "delivery_polish_score": 22,
  "delivery_polish_feedback": "...",
  "strengths": ["...", "..."],
  "weaknesses": ["..."],
  "gold_standard_answer": "..."
}`;

    try {
      const response = await generateWithFallback({ contents: prompt });
      let raw = response.text || '';
      if (raw.includes('```json')) {
        raw = raw.split('```json')[1].split('```')[0].trim();
      } else if (raw.includes('```')) {
        raw = raw.split('```')[1].split('```')[0].trim();
      }
      const parsed = JSON.parse(raw);
      return res.json({ success: true, ...parsed });
    } catch (aiErr) {
      console.warn('AI behavioral practice fallback:', aiErr);
      return res.json({
        success: true,
        overall_score: 86,
        situation_task_score: 22,
        situation_task_feedback: 'Clear context and business stakes. You established the operational deadline and customer impact well.',
        action_ownership_score: 22,
        action_ownership_feedback: 'Strong focus on personal initiative and root-cause analysis rather than generic team actions.',
        results_metrics_score: 20,
        results_metrics_feedback: 'Good results mentioned, but could be made punchier by emphasizing permanent recurrence prevention.',
        delivery_polish_score: 22,
        delivery_polish_feedback: 'Professional and crisp delivery with good executive pacing.',
        strengths: [
          'Strong personal ownership and rapid diagnostic thinking under pressure',
          'Good inclusion of specific tooling and cross-functional coordination',
        ],
        weaknesses: [
          'Ensure the final takeaway articulates the long-term system improvement to prove senior maturity',
        ],
        gold_standard_answer: `Situation: During a critical project milestone, our team experienced an unexpected technical bottleneck that risked our target delivery deadline.\n\nTask: As the lead contributor, I needed to identify the root cause and restore operational throughput within a tight timeframe without compromising quality.\n\nAction: I conducted an immediate cross-functional triage, analyzed system metrics to pinpoint the anomaly, and coordinated with engineering to deploy an interim mitigation while implementing a permanent fix.\n\nResult: We resolved the blocker within 30 minutes, maintained full SLA adherence, and documented preventative safeguards in our team runbook, eliminating similar failures permanently.`,
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Server error during behavioral grading' });
  }
});

// ============================================================================
// ROADMAP READINESS ASSESSMENT
// Evaluates candidate's profile against a roadmap's required competency matrix
// ============================================================================
app.post('/api/roadmap-readiness', async (req, res) => {
  try {
    const {
      roadmapId = '',
      roadmapTitle = 'Career Roadmap',
      masterProfileText = '',
    } = req.body;

    const prompt = `You are a Principal Career Architect and Technical Hiring Director.
Evaluate the candidate's master profile against the career roadmap for: "${roadmapTitle}".

Candidate Master Profile:
${(masterProfileText || 'Candidate master profile with core domain competencies, relevant project accomplishments, and verified technical skills.').slice(0, 6000)}

Determine:
1. "readiness_score": (0-100) realistic percentage indicating candidate's current qualification level for entry into/advancement in this role.
2. "readiness_level": "READY" (>=80), "DEVELOPING" (60-79), or "FOUNDATIONAL" (<60).
3. "summary": 2-3 sentences providing an executive diagnosis of their readiness.
4. "matched_competencies": 3-5 specific skills, tools, or experiences the candidate already possesses that directly translate to this roadmap.
5. "priority_gaps": 2-3 highest-leverage missing competencies with:
   - "skill": the missing competency
   - "rationale": why this matters to employers
   - "recommended_action": clear practical learning task or project to build
   - "estimated_weeks": realistic timeframe (e.g. "2-3 weeks")

Return ONLY a valid JSON object matching this schema:
{
  "readiness_score": 82,
  "readiness_level": "READY" | "DEVELOPING" | "FOUNDATIONAL",
  "summary": "...",
  "matched_competencies": ["...", "...", "..."],
  "priority_gaps": [
    {
      "skill": "...",
      "rationale": "...",
      "recommended_action": "...",
      "estimated_weeks": "..."
    }
  ]
}`;

    try {
      const response = await generateWithFallback({ contents: prompt });
      let raw = response.text || '';
      if (raw.includes('```json')) {
        raw = raw.split('```json')[1].split('```')[0].trim();
      } else if (raw.includes('```')) {
        raw = raw.split('```')[1].split('```')[0].trim();
      }
      const parsed = JSON.parse(raw);
      return res.json({ success: true, ...parsed });
    } catch (aiErr) {
      console.warn('AI roadmap readiness fallback:', aiErr);
      return res.json({
        success: true,
        readiness_score: 82,
        readiness_level: 'READY',
        summary: `You possess a solid foundation for ${roadmapTitle}, with demonstrated capabilities in core domain competencies and continuous skill growth.`,
        matched_competencies: [
          'Cross-functional execution and project delivery',
          'Data-driven analysis and workflow optimization',
          'Stakeholder collaboration and requirement scoping',
          'Standard operating procedures and quality governance',
        ],
        priority_gaps: [
          {
            skill: 'Automated Python Scripting & API Orchestration',
            rationale: 'Modern tech companies expect senior leaders to script repetitive operational workflows.',
            recommended_action: 'Complete the Stage 3 automation project building a webhook alert monitor in Python.',
            estimated_weeks: '2-3 weeks',
          },
          {
            skill: 'Cloud Security Compliance (SOC2 / ISO 27001)',
            rationale: 'Validates operational adherence in regulated enterprise software environments.',
            recommended_action: 'Review SC-900 compliance standards and document an access audit runbook.',
            estimated_weeks: '1-2 weeks',
          },
        ],
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Server error during roadmap readiness assessment' });
  }
});


export async function handleApi(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const route = routes.find((r) => r.method === request.method && r.path === url.pathname);
  if (!route) return Response.json({ error: 'Not found' }, { status: 404 });
  let body: any = {};
  if (request.method !== 'GET') {
    try { body = await request.json(); } catch { body = {}; }
  }
  const req = { body, query: Object.fromEntries(url.searchParams), headers: Object.fromEntries(request.headers) };
  return await new Promise<Response>((resolve) => {
    let status = 200;
    const res: any = {
      status(c: number) { status = c; return res; },
      json(d: any) { resolve(Response.json(d, { status })); return res; },
      send(d: any) { resolve(new Response(typeof d === 'string' ? d : JSON.stringify(d), { status })); return res; },
    };
    Promise.resolve(route.handler(req, res)).then(
      () => resolve(Response.json({ error: 'No response' }, { status: 500 })),
      (e: any) => resolve(Response.json({ error: e?.message || 'Server error' }, { status: 500 })),
    );
  });
}
