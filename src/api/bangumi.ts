const BANGUMI_API = 'https://api.bgm.tv';

export interface BangumiSubject {
  id: number;
  name: string;
  name_cn: string;
  summary: string;
  date?: string;
  images?: {
    large?: string;
    common?: string;
    medium?: string;
    small?: string;
    grid?: string;
  };
  rating?: {
    rank: number;
    total: number;
    score: number;
  };
  collection?: {
    doing: number;
  };
}

export interface BangumiSearchResponse {
  list: BangumiSubject[];
  total: number;
}

// Search Bangumi by Chinese/Japanese title
export async function searchBangumi(query: string): Promise<BangumiSubject | null> {
  try {
    const res = await fetch(`${BANGUMI_API}/search/subject/${encodeURIComponent(query)}?type=2&responseGroup=large`);
    if (!res.ok) return null;
    const data = await res.json() as { list: BangumiSubject[] };
    return data.list?.[0] || null;
  } catch {
    return null;
  }
}

// Get Bangumi subject by Bangumi ID
export async function getBangumiSubject(id: number): Promise<BangumiSubject | null> {
  try {
    const res = await fetch(`${BANGUMI_API}/v0/subjects/${id}`);
    if (!res.ok) return null;
    const data = await res.json() as BangumiSubject;
    return data;
  } catch {
    return null;
  }
}

// Search Bangumi by keyword (broader search)
export async function searchBangumiKeyword(query: string, limit: number = 5): Promise<BangumiSubject[]> {
  try {
    const res = await fetch(`${BANGUMI_API}/search/subject/${encodeURIComponent(query)}?type=2&responseGroup=small&max_results=${limit}`);
    if (!res.ok) return [];
    const data = await res.json() as { list: BangumiSubject[] };
    return data.list || [];
  } catch {
    return [];
  }
}

// Get Bangumi calendar (weekly schedule)
export async function getBangumiCalendar(): Promise<Record<string, BangumiSubject[]>> {
  try {
    const res = await fetch(`${BANGUMI_API}/calendar`);
    if (!res.ok) return {};
    const data = await res.json() as BangumiSubject[][];
    const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const calendar: Record<string, BangumiSubject[]> = {};
    if (Array.isArray(data)) {
      data.forEach((dayItems, i) => {
        calendar[weekdays[i]] = dayItems || [];
      });
    }
    return calendar;
  } catch {
    return {};
  }
}

export default { searchBangumi, getBangumiSubject, searchBangumiKeyword, getBangumiCalendar };
