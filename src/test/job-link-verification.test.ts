import { describe, expect, it, vi, beforeEach } from 'vitest';
import { DEAD_PAGE_PATTERNS, verifyLiveJobUrl, isDirectJobUrl } from '../server/jobstudio-api';

describe('Job Link Verification Engine', () => {
  describe('DEAD_PAGE_PATTERNS regex detection', () => {
    it('detects Narayana Health 404 HTML (from user screenshot)', () => {
      const narayanaHtml = `
        <div class="error-container">
          <h1>404</h1>
          <h2>Page Not Available</h2>
          <p>We couldn't find the page you were looking for.</p>
          <a href="/">Back to Homepage</a>
        </div>
      `;
      const isDead = DEAD_PAGE_PATTERNS.some((pat) => pat.test(narayanaHtml));
      expect(isDead).toBe(true);
    });

    it('detects Agilus Diagnostics 404 HTML (from user screenshot)', () => {
      const agilusHtml = `
        <div class="not-found-wrapper">
          <h2>Page Not Found</h2>
          <p>The page you are looking for does not exist or may have been moved.</p>
          <button>Back to Home</button>
        </div>
      `;
      const isDead = DEAD_PAGE_PATTERNS.some((pat) => pat.test(agilusHtml));
      expect(isDead).toBe(true);
    });

    it('detects Tata Memorial Centre empty portal update notice (from user screenshot)', () => {
      const tmcHtml = `
        <div class="tmc-container">
          <h1>TATA MEMORIAL CENTRE</h1>
          <p style="color: red;">Sorry, No updates available, Please do visit us again.</p>
        </div>
      `;
      const isDead = DEAD_PAGE_PATTERNS.some((pat) => pat.test(tmcHtml));
      expect(isDead).toBe(true);
    });

    it('detects Dr. Lal PathLabs 404 HTML (from user screenshot)', () => {
      const lalPathLabsHtml = `
        <div class="error-page">
          <h2>Page Not Found</h2>
          <p>Sorry! The page you were looking for is not available. Please try a different search or go back to the previous screen</p>
          <button>Back to Home</button>
        </div>
      `;
      const isDead = DEAD_PAGE_PATTERNS.some((pat) => pat.test(lalPathLabsHtml));
      expect(isDead).toBe(true);
    });

    it('detects TMC "Request Rejected" WAF block HTML (from user screenshot)', () => {
      const tmcRejectedHtml = `
        <html>
          <head><title>Request Rejected</title></head>
          <body>
            <p>The requested URL was rejected. Please consult with your administrator.</p>
            <p>Your support ID is: &lt;850865993848000286&gt;</p>
            <a href="/">[Go Back]</a>
          </body>
        </html>
      `;
      const isDead = DEAD_PAGE_PATTERNS.some((pat) => pat.test(tmcRejectedHtml));
      expect(isDead).toBe(true);
    });

    it('detects Fortis "Access Denied" WAF block HTML (from user screenshot)', () => {
      const fortisBlockedHtml = `
        <html>
          <head><title>Access Denied</title></head>
          <body>
            <h1>Access Denied</h1>
            <p>You don't have permission to access on this server.</p>
          </body>
        </html>
      `;
      const isDead = DEAD_PAGE_PATTERNS.some((pat) => pat.test(fortisBlockedHtml));
      expect(isDead).toBe(true);
    });

    it('detects standard ATS closed/expired listings', () => {
      const deadPhrases = [
        'This job is no longer available',
        'This position has been closed',
        'This position has been filled',
        'Job opening has expired',
        'We are no longer accepting applications for this role',
        'The requisition has been closed',
        'Application not found',
        'Job not found',
        'This job has expired',
      ];

      for (const phrase of deadPhrases) {
        const isDead = DEAD_PAGE_PATTERNS.some((pat) => pat.test(`<div>${phrase}</div>`));
        expect(isDead, `Expected "${phrase}" to be recognized as dead`).toBe(true);
      }
    });

    it('does NOT falsely flag legitimate active job descriptions', () => {
      const liveJobHtml = `
        <div class="job-description">
          <h1>Medical Laboratory Technologist - Blood Centre</h1>
          <p>Aster DM Healthcare is seeking a qualified Technologist to join our Transfusion Medicine team in Calicut, Kerala.</p>
          <h3>Key Responsibilities:</h3>
          <ul>
            <li>Perform therapeutic apheresis and blood component separation under standard operating procedures.</li>
            <li>Conduct immunohematological testing, cross-matching, and antibody screening.</li>
            <li>Ensure strict adherence to NABH and NABL diagnostic quality standards.</li>
          </ul>
          <button class="apply-btn">Apply Now</button>
        </div>
      `;
      const isDead = DEAD_PAGE_PATTERNS.some((pat) => pat.test(liveJobHtml));
      expect(isDead).toBe(false);
    });
  });

  describe('verifyLiveJobUrl URL check behavior', () => {
    it('rejects invalid, empty, or non-http URLs', async () => {
      const emptyRes = await verifyLiveJobUrl('');
      expect(emptyRes.ok).toBe(false);

      const hashRes = await verifyLiveJobUrl('#');
      expect(hashRes.ok).toBe(false);

      const ftpRes = await verifyLiveJobUrl('ftp://example.com/job');
      expect(ftpRes.ok).toBe(false);
    });

    it('rejects private IP addresses and localhost addresses', async () => {
      const localRes = await verifyLiveJobUrl('http://localhost:3000/job/123');
      expect(localRes.ok).toBe(false);

      const privateIpRes = await verifyLiveJobUrl('http://192.168.1.100/job/123');
      expect(privateIpRes.ok).toBe(false);
    });

    it('detects 404 HTTP status responses and marks listing as dead', async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        url: 'https://careers.example.com/job/missing',
        text: async () => '404 Not Found',
      } as any);

      try {
        const result = await verifyLiveJobUrl('https://careers.example.com/job/missing');
        expect(result.ok).toBe(false);
        expect(result.reason).toContain('404');
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('detects HTTP 200 SPAs that contain "Page Not Available" in the body', async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        url: 'https://careers.healthcorp-example.com/careers/job/junior-medical-lab-technologist',
        text: async () => '<html><body><h1>404 Page Not Available</h1><p>We couldn\'t find the page you were looking for.</p></body></html>',
      } as any);

      try {
        const result = await verifyLiveJobUrl('https://careers.healthcorp-example.com/careers/job/junior-medical-lab-technologist');
        expect(result.ok).toBe(false);
        expect(result.reason).toContain('Page content indicates listing is dead or expired');
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('detects redirects to 404 error URLs', async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        url: 'https://careers.example.com/page-not-found',
        text: async () => '<html><body>Error</body></html>',
      } as any);

      try {
        const result = await verifyLiveJobUrl('https://careers.example.com/job/expired-slug');
        expect(result.ok).toBe(false);
        expect(result.reason).toContain('404 error page');
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('detects empty portal notice and rejects URL', async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        url: 'https://careers.state-oncology.org/careers',
        text: async () => '<html><body><h1>STATE CANCER CENTRE</h1><p>Sorry, No updates available, Please do visit us again.</p></body></html>',
      } as any);

      try {
        const result = await verifyLiveJobUrl('https://careers.state-oncology.org/careers');
        expect(result.ok).toBe(false);
        expect(result.reason).toBeDefined();
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('strictly rejects generic company/career homepages that lack direct job requisition permalinks', async () => {
      // These are the exact URLs reported in user screenshots that do not lead to the specific role
      const genericUrls = [
        'https://careers.manipalhospitals.com/',
        'https://www.linkedin.com/company/narayana-health/jobs/',
        'https://www.kimshospitals.com/',
        'https://www.linkedin.com/company/dr-lal-pathlabs/jobs/',
        'https://tmc.gov.in/m_events/Events/careers',
        'https://www.fortishealthcare.com/careers',
        'https://careers.example.com/',
        'https://careers.example.com/careers',
      ];

      for (const url of genericUrls) {
        expect(isDirectJobUrl(url), `Expected ${url} to be identified as non-direct`).toBe(false);
        const result = await verifyLiveJobUrl(url);
        expect(result.ok, `Expected verifyLiveJobUrl to reject generic portal: ${url}`).toBe(false);
      }
    });

    it('accepts legitimate direct job requisition URLs', () => {
      expect(isDirectJobUrl('https://boards.greenhouse.io/stripe/jobs/6123456')).toBe(true);
      expect(isDirectJobUrl('https://jobs.lever.co/figma/abc-123-def')).toBe(true);
      expect(isDirectJobUrl('https://www.linkedin.com/jobs/view/4123456789')).toBe(true);
      expect(isDirectJobUrl('https://in.indeed.com/viewjob?jk=12345abcdef')).toBe(true);
      expect(isDirectJobUrl('https://careers.apollohospitals.com/job/medical-lab-technologist-123')).toBe(true);
    });

    it('verifies and accepts legitimate active job listings', async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        url: 'https://careers.apollohospitals.com/job/medical-lab-technologist',
        text: async () => `
          <html>
            <head><title>Medical Laboratory Technologist - Apollo Hospitals</title></head>
            <body>
              <h1>Medical Laboratory Technologist</h1>
              <p>Apollo Hospitals Bengaluru. Apply today to join our laboratory medicine team.</p>
              <button>Submit Application</button>
            </body>
          </html>
        `,
      } as any);

      try {
        const result = await verifyLiveJobUrl('https://careers.apollohospitals.com/job/medical-lab-technologist');
        expect(result.ok).toBe(true);
        expect(result.finalUrl).toBe('https://careers.apollohospitals.com/job/medical-lab-technologist');
      } finally {
        global.fetch = originalFetch;
      }
    });
  });
});

