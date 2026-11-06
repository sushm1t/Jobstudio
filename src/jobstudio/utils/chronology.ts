// Utility to enforce strict reverse-chronological ordering for work experiences
// Ensures that recent positions (e.g. 2023-Present, 2022-2023) are always listed
// before older positions (e.g. 2020-2022), preventing AI relevance reordering bugs.

export function parseDateRangeEndAndStart(dateRange: string): {
  endYear: number;
  endMonth: number;
  startYear: number;
  startMonth: number;
} {
  const normalized = (dateRange || '')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\bto\b/i, '-')
    .trim();
  const parts = normalized.split('-').map((p) => p.trim());

  const months: Record<string, number> = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
  };

  const parsePart = (part: string, isEnd = false) => {
    if (!part) return { year: 0, month: 0 };
    if (/present|current|now|ongoing/i.test(part)) return { year: 9999, month: 12 };

    const yearMatch = part.match(/\b(19\d\d|20\d\d)\b/);
    const year = yearMatch && yearMatch[1] ? parseInt(yearMatch[1], 10) : 0;

    const monthMatch = part.toLowerCase().match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/);
    const month = monthMatch && monthMatch[1] ? (months[monthMatch[1].slice(0, 3)] || (isEnd ? 12 : 1)) : (isEnd ? 12 : 1);

    return { year, month };
  };

  const start = parsePart(parts[0] || '', false);
  const end = parts.length > 1
    ? parsePart(parts[1] || '', true)
    : (start.year === 9999 ? start : { year: start.year, month: 12 });

  return { endYear: end.year, endMonth: end.month, startYear: start.year, startMonth: start.month };
}

export function sortExperiencesReverseChronological<T extends { date_range?: string }>(experiences: T[]): T[] {
  if (!Array.isArray(experiences) || experiences.length <= 1) return experiences;
  return [...experiences].sort((a, b) => {
    const dateA = parseDateRangeEndAndStart(a.date_range || '');
    const dateB = parseDateRangeEndAndStart(b.date_range || '');

    // 1. Most recent end year first (e.g. 9999 / Present > 2023 > 2022)
    if (dateB.endYear !== dateA.endYear) return dateB.endYear - dateA.endYear;
    // 2. Most recent end month first
    if (dateB.endMonth !== dateA.endMonth) return dateB.endMonth - dateA.endMonth;
    // 3. Most recent start year first
    if (dateB.startYear !== dateA.startYear) return dateB.startYear - dateA.startYear;
    // 4. Most recent start month first
    return dateB.startMonth - dateA.startMonth;
  });
}

