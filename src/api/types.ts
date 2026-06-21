export interface AnimeTitle {
  romaji?: string;
  english?: string;
  native?: string;
  chinese?: string;
}

export interface AnimeDate {
  year?: number;
  month?: number;
  day?: number;
}

export interface AnimeCover {
  extraLarge?: string;
  large?: string;
  medium?: string;
  color?: string;
}

export interface AnimeTrailer {
  id?: string;
  site?: string;
  thumbnail?: string;
}

export interface AnimeNextAiring {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
}

export interface AnimeCharacter {
  id: number;
  name: { full: string; native?: string };
  image: { medium?: string; large?: string };
  role: string;
}

export interface AnimeStaff {
  id: number;
  name: { full: string; native?: string };
  image: { medium?: string; large?: string };
  role: string;
}

export interface AnimeRelation {
  id: number;
  title: { romaji?: string; english?: string; native?: string };
  type: string;
  format?: string;
  coverImage: AnimeCover;
}

export interface Anime {
  // Core
  id: number;
  idMal?: number;
  idKitsu?: number;
  idBangumi?: number;

  title: AnimeTitle;
  type: 'ANIME' | 'MANGA';
  format?: string;
  status?: string;
  description?: string;

  // Dates
  season?: string;
  seasonYear?: number;
  startDate?: AnimeDate;
  endDate?: AnimeDate;

  // Media
  coverImage: AnimeCover;
  bannerImage?: string | null;
  trailer?: AnimeTrailer | null;

  // Scores & Rankings
  averageScore?: number;
  meanScore?: number;
  popularity?: number;
  favourites?: number;
  trending?: number;

  // Bangumi extras
  bangumiScore?: number;
  bangumiRank?: number;

  // Counts
  episodes?: number;
  duration?: number;
  chapters?: number;

  // Tags
  genres?: string[];
  tags?: { name: string; rank: number }[];
  studios?: { nodes?: { name: string }[] };

  // Air schedule
  nextAiringEpisode?: AnimeNextAiring | null;

  // Relations
  characters?: { edges?: { node: { id: number; name: { full: string; native?: string }; image: { medium?: string; large?: string } }; role: string }[] };
  relations?: { edges?: { node: AnimeRelation; relationType: string }[] };
}

export interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

export interface AnimeListResponse {
  pageInfo: PageInfo;
  results: Anime[];
}

export interface AnimeSearchParams {
  query?: string;
  season?: string;
  seasonYear?: number;
  format?: string;
  genre?: string;
  sort?: 'POPULARITY_DESC' | 'SCORE_DESC' | 'TRENDING_DESC' | 'FAVOURITES_DESC' | 'TITLE_ROMAJI';
  page?: number;
  perPage?: number;
}

export type MediaFormat = 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC';

export type MediaStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';

export type AnimeSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
