const JIKAN_API = 'https://api.jikan.moe/v4';

export interface MALAnimeData {
  mal_id: number;
  url: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  source: string | null;
  rating: string | null;
}

// Search MAL by title
export async function searchMALAnime(query: string): Promise<MALAnimeData | null> {
  try {
    const res = await fetch(`${JIKAN_API}/anime?q=${encodeURIComponent(query)}&limit=1`);
    if (!res.ok) return null;
    const data = await res.json() as { data: MALAnimeData[] };
    return data.data?.[0] || null;
  } catch {
    return null;
  }
}

// Get MAL data by MAL ID
export async function getMALAnime(malId: number): Promise<MALAnimeData | null> {
  try {
    const res = await fetch(`${JIKAN_API}/anime/${malId}/full`);
    if (!res.ok) return null;
    const data = await res.json() as { data: MALAnimeData };
    return data.data;
  } catch {
    return null;
  }
}

// Get top anime from MAL
export async function getMALTopAnime(page: number = 1, type: string = ''): Promise<{ data: (MALAnimeData & { title_english?: string; title_japanese?: string; images?: { jpg?: { large_image_url?: string } } })[]; pagination: { last_visible_page: number } }> {
  const url = type
    ? `${JIKAN_API}/top/anime?page=${page}&type=${type}`
    : `${JIKAN_API}/top/anime?page=${page}`;
  const res = await fetch(url);
  const data = await res.json() as { data: Record<string, unknown>[]; pagination: { last_visible_page: number } };
  return data as never;
}

// Get seasonal anime from MAL
export async function getMALSeasonal(year: number, season: string): Promise<{ data: (MALAnimeData & { title_english?: string; title_japanese?: string; images?: { jpg?: { large_image_url?: string } } })[] }> {
  const res = await fetch(`${JIKAN_API}/seasons/${year}/${season.toLowerCase()}`);
  const data = await res.json() as { data: Record<string, unknown>[] };
  return data as never;
}

// Get schedule from MAL
export async function getMALSchedules(): Promise<{ data: (MALAnimeData & { title_english?: string; title_japanese?: string; images?: { jpg?: { large_image_url?: string } }; broadcast?: { day?: string; time?: string; string?: string } })[] }> {
  const res = await fetch(`${JIKAN_API}/schedules`);
  const data = await res.json() as { data: Record<string, unknown>[] };
  return data as never;
}

export default { searchMALAnime, getMALAnime, getMALTopAnime, getMALSeasonal, getMALSchedules };
