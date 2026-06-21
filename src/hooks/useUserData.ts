import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { localStore } from '../lib/localStore';
import type { WatchStatus } from '../lib/localStore';

const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://YOUR_PROJECT_ID.supabase.co';
let supabaseModule: any = null;
if (hasSupabase) import('../lib/supabase').then(m => { supabaseModule = m.supabase; });

function uid(user: any): string { return user?.id || ''; }

export function useFavorites() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const favQuery = useQuery({
    queryKey: ['favorites', uid(user)],
    queryFn: async () => {
      if (!user) return [];
      if (hasSupabase && supabaseModule) {
        const { data } = await supabaseModule.from('favorites').select('*').eq('user_id', uid(user)).order('created_at', { ascending: false });
        return data || [];
      }
      return localStore.getFavorites(uid(user));
    },
    enabled: !!user,
  });
  const toggle = useMutation({
    mutationFn: async ({ animeId, animeData }: { animeId: number; animeData: any }) => {
      if (!user) throw new Error('Not logged in');
      if (hasSupabase && supabaseModule) {
        const { data: ex } = await supabaseModule.from('favorites').select('id').eq('user_id', uid(user)).eq('anime_id', animeId).single();
        if (ex) { await supabaseModule.from('favorites').delete().eq('id', ex.id); return 'removed'; }
        await supabaseModule.from('favorites').insert({ user_id: uid(user), anime_id: animeId, anime_data: animeData });
        return 'added';
      }
      return localStore.toggleFavorite(uid(user), animeId, animeData);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  });
  const isFav = (animeId: number) => {
    if (!user) return false;
    return localStore.isFavorite(uid(user), animeId);
  };
  return { favorites: favQuery, toggleFavorite: toggle, isFavorite: isFav };
}

export function useWatchlist() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const wlQuery = useQuery({
    queryKey: ['watchlist', uid(user)],
    queryFn: async () => {
      if (!user) return [];
      if (hasSupabase && supabaseModule) {
        const { data } = await supabaseModule.from('watchlist').select('*').eq('user_id', uid(user)).order('updated_at', { ascending: false });
        return data || [];
      }
      return localStore.getWatchlist(uid(user));
    },
    enabled: !!user,
  });
  const add = useMutation({
    mutationFn: async ({ animeId, animeData, status = 'plan_to_watch' as WatchStatus }: { animeId: number; animeData: any; status?: WatchStatus }) => {
      if (!user) throw new Error('Not logged in');
      if (hasSupabase && supabaseModule) {
        const { data: ex } = await supabaseModule.from('watchlist').select('id').eq('user_id', uid(user)).eq('anime_id', animeId).single();
        if (ex) await supabaseModule.from('watchlist').update({ status, updated_at: new Date().toISOString() }).eq('id', ex.id);
        else await supabaseModule.from('watchlist').insert({ user_id: uid(user), anime_id: animeId, anime_data: animeData, status, progress: 0 });
      } else {
        localStore.addToWatchlist(uid(user), animeId, animeData, status);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  });
  const updateStatus = useMutation({
    mutationFn: async ({ animeId, status }: { animeId: number; status: WatchStatus }) => {
      if (!user) throw new Error('Not logged in');
      if (hasSupabase && supabaseModule) {
        await supabaseModule.from('watchlist').update({ status, updated_at: new Date().toISOString() }).eq('user_id', uid(user)).eq('anime_id', animeId);
      } else {
        localStore.updateWatchStatus(uid(user), animeId, status);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  });
  const getStatus = (animeId: number): WatchStatus | undefined => {
    if (!user) return undefined;
    return localStore.getWatchStatus(uid(user), animeId);
  };
  return { watchlist: wlQuery, addToWatchlist: add, updateStatus, getStatus };
}
