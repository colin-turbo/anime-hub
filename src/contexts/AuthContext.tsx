// Auth context — supports Supabase and localStorage
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getLocalUser, signUpLocal, signInLocal, signOutLocal, type LocalUser } from '../lib/localStore';
import type { User, Session } from '@supabase/supabase-js';

interface AuthCtx { user: (User | LocalUser) | null; session: Session | null; loading: boolean; signUp: (e: string, p: string) => Promise<{ error?: string }>; signIn: (e: string, p: string) => Promise<{ error?: string }>; signOut: () => Promise<void>; }
const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<(User | LocalUser) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const local = getLocalUser(); if (local) setUser({ id: local.id, email: local.email } as any); setLoading(false); }, []);

  const signUp = async (e: string) => { const r = signUpLocal(e); if (r.error) return r; setUser({ id: r.data.user.id, email: r.data.user.email } as any); return {}; };
  const signIn = async (e: string) => { const r = signInLocal(e); if (r.error) return r; setUser({ id: r.data.user.id, email: r.data.user.email } as any); return {}; };
  const signOut = async () => { signOutLocal(); setUser(null); setSession(null); };

  return <Ctx.Provider value={{ user, session, loading, signUp, signIn, signOut }}>{children}</Ctx.Provider>;
}
export function useAuth() { const c = useContext(Ctx); if (!c) throw Error('useAuth inside AuthProvider'); return c; }
