// localStorage-based data store
export type WatchStatus = 'watching' | 'completed' | 'plan_to_watch' | 'dropped' | 'on_hold';

export interface LocalUser {
  id: string;
  email: string;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function getStorage<T>(key: string): T[] {
  try { const d = localStorage.getItem(`animehub_${key}`); return d ? JSON.parse(d) : []; } catch { return []; }
}
function setStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(`animehub_${key}`, JSON.stringify(data));
}

// ── User ──
export function getLocalUser(): LocalUser | null {
  const u = localStorage.getItem('animehub_user');
  return u ? JSON.parse(u) : null;
}
export function signUpLocal(email: string): { data: { user: LocalUser }; error?: string } {
  if (localStorage.getItem('animehub_user')) return { data: null as any, error: 'User exists' };
  const user: LocalUser = { id: generateId(), email };
  localStorage.setItem('animehub_user', JSON.stringify(user));
  return { data: { user } };
}
export function signInLocal(email: string): { data: { user: LocalUser }; error?: string } {
  let user: LocalUser;
  const stored = localStorage.getItem('animehub_user');
  if (!stored) { user = { id: generateId(), email }; localStorage.setItem('animehub_user', JSON.stringify(user)); }
  else { user = JSON.parse(stored); if (user.email !== email) return { data: null as any, error: 'Wrong email' }; }
  return { data: { user } };
}
export function signOutLocal(): void {}

// ── Favorites ──
export const localStore = {
  getFavorites(userId: string): Array<{ anime_id: number; anime_data: any; created_at: string }> {
    return getStorage<any>('favorites').filter((f: any) => f.user_id === userId);
  },
  toggleFavorite(userId: string, animeId: number, animeData: any): 'added' | 'removed' {
    const all = getStorage<any>('favorites');
    const idx = all.findIndex((f: any) => f.user_id === userId && f.anime_id === animeId);
    if (idx >= 0) { all.splice(idx, 1); setStorage('favorites', all); return 'removed'; }
    all.push({ user_id: userId, anime_id: animeId, anime_data: animeData, created_at: new Date().toISOString() });
    setStorage('favorites', all);
    return 'added';
  },
  isFavorite(userId: string, animeId: number): boolean {
    return getStorage<any>('favorites').some((f: any) => f.user_id === userId && f.anime_id === animeId);
  },
  // ── Watchlist ──
  getWatchlist(userId: string): Array<{ anime_id: number; anime_data: any; status: WatchStatus }> {
    return getStorage<any>('watchlist').filter((w: any) => w.user_id === userId);
  },
  addToWatchlist(userId: string, animeId: number, animeData: any, status: WatchStatus = 'plan_to_watch'): void {
    const all = getStorage<any>('watchlist');
    const idx = all.findIndex((w: any) => w.user_id === userId && w.anime_id === animeId);
    if (idx >= 0) { all[idx].status = status; all[idx].updated_at = new Date().toISOString(); }
    else { all.push({ user_id: userId, anime_id: animeId, anime_data: animeData, status, progress: 0, updated_at: new Date().toISOString() }); }
    setStorage('watchlist', all);
  },
  updateWatchStatus(userId: string, animeId: number, status: WatchStatus): void {
    const all = getStorage<any>('watchlist');
    const item = all.find((w: any) => w.user_id === userId && w.anime_id === animeId);
    if (item) { item.status = status; item.updated_at = new Date().toISOString(); setStorage('watchlist', all); }
  },
  getWatchStatus(userId: string, animeId: number): WatchStatus | undefined {
    return getStorage<any>('watchlist').find((w: any) => w.user_id === userId && w.anime_id === animeId)?.status;
  },
};
