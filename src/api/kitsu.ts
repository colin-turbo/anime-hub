const KITSU_API = 'https://kitsu.io/api/edge';

export interface KitsuAnimeData {
  id: string;
  type: string;
  attributes: {
    slug: string;
    canonicalTitle: string;
    titles: { en?: string; en_jp?: string; ja_jp?: string };
    synopsis: string;
    averageRating: string | null;
    popularityRank: number | null;
    ratingRank: number | null;
    episodeCount: number | null;
    episodeLength: number | null;
    status: string;
    startDate: string | null;
    endDate: string | null;
    ageRating: string | null;
    posterImage: {
      tiny?: string;
      small?: string;
      medium?: string;
      large?: string;
      original?: string;
    };
    coverImage: {
      tiny?: string;
      small?: string;
      large?: string;
      original?: string;
    } | null;
  };
}

// Search Kitsu by title
export async function searchKitsuAnime(query: string): Promise<KitsuAnimeData | null> {
  try {
    const res = await fetch(`${KITSU_API}/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=1`);
    if (!res.ok) return null;
    const data = await res.json() as { data: KitsuAnimeData[] };
    return data.data?.[0] || null;
  } catch {
    return null;
  }
}

// Get Kitsu data by Kitsu ID
export async function getKitsuAnime(kitsuId: number | string): Promise<KitsuAnimeData | null> {
  try {
    const res = await fetch(`${KITSU_API}/anime/${kitsuId}`);
    if (!res.ok) return null;
    const data = await res.json() as { data: KitsuAnimeData };
    return data.data;
  } catch {
    return null;
  }
}

// Get trending anime from Kitsu
export async function getKitsuTrending(): Promise<{ data: KitsuAnimeData[] }> {
  const res = await fetch(`${KITSU_API}/trending/anime?limit=10`);
  const data = await res.json() as { data: KitsuAnimeData[] };
  return data;
}

export default { searchKitsuAnime, getKitsuAnime, getKitsuTrending };
