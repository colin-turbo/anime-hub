import { useQuery } from '@tanstack/react-query';
import { searchAnime, getAnimeById, getTopAnime, getSeasonalAnime, getAiringSchedule } from '../api/anilist';
import { enrichAnime } from '../api/aggregator';

export function useAnimeSearch(filters: any, page = 1, perPage = 20) {
  return useQuery({ queryKey: ['anime','search',filters,page,perPage], queryFn: () => searchAnime(filters, page, perPage), placeholderData: (prev: any) => prev, staleTime: 5*60*1000 });
}
export function useAnimeDetail(id: number | null) {
  return useQuery({ queryKey: ['anime','detail',id], queryFn: async () => { if (!id) throw new Error('No ID'); const data = await getAnimeById(id); return enrichAnime((data as any).Media); }, enabled: !!id, staleTime: 10*60*1000 });
}
export function useTopAnime(sort = 'SCORE_DESC', page = 1, perPage = 30) {
  return useQuery({ queryKey: ['anime','top',sort,page,perPage], queryFn: () => getTopAnime(sort, page, perPage), placeholderData: (prev: any) => prev, staleTime: 10*60*1000 });
}
export function useSeasonalAnime(season: string, year: number, page = 1, perPage = 30) {
  return useQuery({ queryKey: ['anime','seasonal',season,year,page,perPage], queryFn: () => getSeasonalAnime(season, year, page, perPage), placeholderData: (prev: any) => prev, staleTime: 30*60*1000 });
}
export function useAiringSchedule(weekStart: number, weekEnd: number) {
  return useQuery({ queryKey: ['anime','schedule',weekStart,weekEnd], queryFn: () => getAiringSchedule(weekStart, weekEnd), staleTime: 10*60*1000 });
}
