import type { Anime } from './types';
import { getMALAnime, searchMALAnime } from './mal';
import { getKitsuAnime, searchKitsuAnime } from './kitsu';
import { getBangumiSubject, searchBangumi } from './bangumi';

interface EnrichmentData {
  malScore?: number;
  malRank?: number;
  malPopularity?: number;
  malFavorites?: number;
  kitsuScore?: number;
  kitsuId?: number;
  bangumiScore?: number;
  bangumiRank?: number;
  bangumiId?: number;
  bangumiNameCn?: string;
}

// Enrich a single anime with data from MAL, Kitsu, and Bangumi
export async function enrichAnime(anime: Anime): Promise<Anime> {
  const enriched = { ...anime };
  const enrich: EnrichmentData = {};

  try {
    // Try MAL
    if (anime.idMal) {
      const mal = await getMALAnime(anime.idMal);
      if (mal) {
        enrich.malScore = mal.score ?? undefined;
        enrich.malRank = mal.rank ?? undefined;
        enrich.malPopularity = mal.popularity ?? undefined;
        enrich.malFavorites = mal.favorites ?? undefined;
      }
    } else {
      const title = anime.title.romaji || anime.title.english || anime.title.native;
      if (title) {
        const mal = await searchMALAnime(title);
        if (mal) {
          enrich.malScore = mal.score ?? undefined;
          enrich.malRank = mal.rank ?? undefined;
          enriched.idMal = mal.mal_id;
        }
      }
    }
  } catch {
    // MAL failed, continue
  }

  try {
    // Try Kitsu
    if (anime.idKitsu) {
      const kitsu = await getKitsuAnime(anime.idKitsu);
      if (kitsu && kitsu.attributes.averageRating) {
        enrich.kitsuScore = parseFloat(kitsu.attributes.averageRating);
      }
    } else {
      const title = anime.title.english || anime.title.romaji || anime.title.native;
      if (title) {
        const kitsu = await searchKitsuAnime(title);
        if (kitsu) {
          enrich.kitsuId = parseInt(kitsu.id);
          enriched.idKitsu = enrich.kitsuId;
          if (kitsu.attributes.averageRating) {
            enrich.kitsuScore = parseFloat(kitsu.attributes.averageRating);
          }
        }
      }
    }
  } catch {
    // Kitsu failed, continue
  }

  try {
    // Try Bangumi
    if (anime.idBangumi) {
      const bgm = await getBangumiSubject(anime.idBangumi);
      if (bgm) {
        enrich.bangumiScore = bgm.rating?.score;
        enrich.bangumiRank = bgm.rating?.rank;
        enrich.bangumiNameCn = bgm.name_cn;
      }
    } else {
      const title = anime.title.native || anime.title.romaji || '';
      if (title) {
        const bgm = await searchBangumi(title);
        if (bgm) {
          enrich.bangumiId = bgm.id;
          enriched.idBangumi = bgm.id;
          enrich.bangumiScore = bgm.rating?.score;
          enrich.bangumiRank = bgm.rating?.rank;
          enrich.bangumiNameCn = bgm.name_cn;
        }
      }
    }
  } catch {
    // Bangumi failed, continue
  }

  // Apply enrichment
  if (enrich.bangumiScore !== undefined) enriched.bangumiScore = enrich.bangumiScore;
  if (enrich.bangumiRank !== undefined) enriched.bangumiRank = enrich.bangumiRank;
  if (enrich.bangumiNameCn) enriched.title.chinese = enrich.bangumiNameCn;

  return enriched;
}

// Enrich batch of anime (with concurrency limit)
export async function enrichAnimeBatch(animeList: Anime[], concurrency: number = 3): Promise<Anime[]> {
  const results: Anime[] = [];
  for (let i = 0; i < animeList.length; i += concurrency) {
    const batch = animeList.slice(i, i + concurrency);
    const enriched = await Promise.allSettled(batch.map(enrichAnime));
    for (const result of enriched) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        // If enrichment failed, use the original
        const idx = enriched.indexOf(result);
        results.push(batch[idx]);
      }
    }
  }
  return results;
}
