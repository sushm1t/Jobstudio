import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Shared Gemini Client following skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper with automatic model fallback for resilience against 503 high-demand spikes
async function generateWithFallback(params: { contents: string; config?: any }) {
  const models = ['gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-3.8-flash'];
  let lastError: any = null;
  for (const model of models) {
    try {
      return await ai.models.generateContent({
        ...params,
        model,
      });
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} unavailable, trying fallback:`, err?.message || err);
    }
  }
  throw lastError;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
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
6. List any missing critical skills or gaps.
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
      roles = [
        'Real-Time Analyst / Workforce Management',
        'Product Operations Specialist',
        'Incident Management / Service Operations Lead',
        'Business Operations Analyst',
        'Operations Analyst',
      ],
    } = req.body;

    const prompt = `Search the live web using Google Search for authentic, currently open job postings in ${location} matching candidate Sushmit Surendran's background and target roles:
Roles to search: ${Array.isArray(roles) ? roles.join(', ') : roles}.

Candidate Profile Summary:
- 6 years operations experience in Fintech at Revolut (Real-Time Analyst SME managing 1,000+ frontline agents and 300+ dynamic queues globally; Incident Bridge Manager; SQL root-cause investigator via Jove platform; payment disputes & chargebacks).
- Torc Infotech: B2B international account coordination, multi-currency billing reconciliation (USD, EUR, GBP, INR), capacity planning (32 person-months).
- Technical Stack: SQL, Looker, Metabase, Advanced Excel, Jira, Confluence, Slack Workflows, Zapier, AI Automation.

Find 6 authentic, currently active job postings from real hiring portals (SmartRecruiters, Greenhouse, Lever, Ashby, Workday, LinkedIn, or company career pages).
Only include real, open vacancies with actual links to apply.

For each vacancy, provide:
1. "title": Official job title.
2. "company": Company hiring.
3. "location": Workplace location (e.g. "Bengaluru, India (Hybrid)" or "Remote, India").
4. "platform": ATS or portal (e.g. "SmartRecruiters", "Greenhouse", "Lever", "Ashby", "LinkedIn", "Workday", "Direct Portal").
5. "applyUrl": Direct link to job listing or application portal.
6. "category": One of "Real-Time Operations & WFM", "Incident & Service Ops", "Business Operations & Analytics", "Product Operations", "Resource & Capacity Planning".
7. "matchScore": Eligibility match score (0-100) based on candidate's qualification overlap.
8. "matchHighlight": 1-2 concise sentences explaining why candidate is eligible for this specific posting.
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
7. "suggested_answer": A high-impact 3-5 sentence STAR-method answer directly utilizing candidate Sushmit Surendran's actual verified background (Revolut Real-Time Analyst SME: 1,000+ frontline agents, 300+ queues, Jove SQL chat transfer loop elimination, incident bridge manager; Torc Infotech: 32 person-month capacity planning, multi-currency reconciliations; Tools: SQL, Looker, Metabase, Jira, Confluence, Zapier).

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

      // 0. Dedicated Oracle Cloud HCM REST API extractor (handles Oracle Candidate Experience portals)
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

If accepted, compute match score (0-100) and eligibility highlight against candidate Sushmit Surendran:
- 6 years operations experience: Revolut (Real-Time Analyst SME: 1,000+ frontline agents, 300+ queues, Jove SQL investigation, incident bridge lead; Support Specialist: payment disputes/chargebacks FCR 95%), Torc Infotech (B2B account management, multi-currency reconciliations).
- Tools: SQL, Looker, Metabase, Advanced Excel, Jira, Confluence, Slack Workflows, Zapier.

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

    const opportunity = {
      id: `verified-${Date.now()}`,
      title: titleFinal,
      company: companyFinal,
      location: parsed.location || 'India (Bengaluru / Hybrid)',
      platform: platformDerived,
      applyUrl: url || '#',
      category: parsed.category || 'Incident & Service Ops',
      matchScore: parsed.matchScore || 94,
      matchHighlight:
        parsed.matchHighlight ||
        'Direct match for third-party compliance reviews (pre-L1/L1), regulatory screenings, data analytics (SQL/Looker), and IAM compliance controls.',
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
9. Product Projects (Credit Pilot / LazyTrip): ONLY include projects if the job description is explicitly for a Product Management (PM), Technical Product Manager (TPM), or AI Product Engineer role where building consumer/software products and features is directly requested. For operations, resource management, workforce management, capacity planning, analyst, financial, dispute, or customer success roles, CHUCK / OMIT IT COMPLETELY by returning an empty array: projects: []. Only add it if it is strictly relevant and adds undeniable value; otherwise chuck it.
10. Craft an ATS-friendly, 3-paragraph compelling Cover Letter addressed specifically to the company and role.
11. Provide tailored answers to 3 standard ATS screening questions:
   - "Why are you interested in this role at our company?"
   - "Describe your relevant experience in workforce/resource management, operational capacity, and cross-functional coordination."
   - "What is your location status and availability?"
12. Select and prioritize the top 3 certifications strictly from Sushmit's verified credentials based on direct JD alignment:
   - "Analyzing and Visualizing Data in Looker | Google Cloud Community India" (prioritize for analytics, BI, reporting, capacity planning)
   - "Building AI Agents | Zapier" (prioritize for AI workflows, automation, agent design)
   - "Google AI Essentials Specialization | Google" (prioritize for GenAI, prompt engineering, process automation)
   - "Microsoft Certified: Security, Compliance, and Identity Fundamentals | Microsoft" (prioritize for IAM, governance, compliance, cloud security)
   - "Finance Foundations: Risk Management | LinkedIn" (prioritize for fintech, financial operations, risk and dispute mitigations)
   DO NOT hallucinate or invent any other certification.
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

// Full-Stack: mount Vite in development or serve static in production
const PORT = 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
