import { describe, it, expect } from 'vitest';
import { handleApi } from '@/server/jobstudio-api';

describe('/api/report-bug and /api/bug-reports endpoints', () => {
  it('rejects submissions with missing subject or description', async () => {
    const req = new Request('http://localhost:8080/api/report-bug', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: '', description: '' }),
    });

    const res = await handleApi(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toMatch(/subject is required/i);
  });

  it('records valid bug report and returns reference ID', async () => {
    const payload = {
      subject: 'Interview question audio playback bug',
      description: 'Audio fails to initialize in safari mobile viewport.',
      category: 'Interview Prep & Company Focus',
      severity: 'medium',
      contactEmail: 'qa@jobstudio.ai',
      diagnostics: {
        activeTab: 'screening',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
      },
    };

    const req = new Request('http://localhost:8080/api/report-bug', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const res = await handleApi(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.id).toMatch(/^BUG-/);

    // Verify it is queryable via GET /api/bug-reports
    const getReq = new Request('http://localhost:8080/api/bug-reports', {
      method: 'GET',
    });
    const getRes = await handleApi(getReq);
    expect(getRes.status).toBe(200);
    const listData = await getRes.json();
    expect(listData.success).toBe(true);
    expect(listData.reports.some((r: any) => r.id === data.id)).toBe(true);
  });
});

