import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites, useWatchlist } from '../hooks/useUserData';
import AnimeCard from '../components/AnimeCard';
import SectionHeader from '../components/SectionHeader';

const TABS = [{k:'all',l:'全部',i:'📋'},{k:'watching',l:'在看',i:'👀'},{k:'completed',l:'看过',i:'✅'},{k:'plan_to_watch',l:'想看',i:'📌'},{k:'dropped',l:'搁置',i:'💤'}] as const;

function StatCard({icon,label,value}:{icon:string;label:string;value:number}) {
  return <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="glass rounded-xl p-4 text-center"><span className="text-2xl block mb-1">{icon}</span><p className="text-2xl font-bold text-text-primary">{value}</p><p className="text-xs text-text-muted">{label}</p></motion.div>;
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { favorites: fq } = useFavorites();
  const { watchlist: wq } = useWatchlist();
  const [tab, setTab] = useState<string>('all');

  if (!user) return <div className="max-w-md mx-auto px-4 py-20 text-center"><motion.div initial={{opacity:0}} animate={{opacity:1}} className="glass rounded-2xl p-8"><span className="text-5xl mb-4 block">🔒</span><h1 className="text-2xl font-bold text-text-primary mb-2">请先登录</h1><p className="text-text-secondary mb-6">登录后即可管理追番列表和收藏</p><Link to="/login" className="inline-block px-8 py-3 rounded-xl bg-sakura-500 hover:bg-sakura-600 text-white font-semibold transition-all shadow-lg shadow-sakura-500/25">前往登录 →</Link></motion.div></div>;

  const favData = (fq.data||[]).map((f:any)=>({...f.anime_data, id: f.anime_id}));
  const wlData = tab==='all'?(wq.data||[]):(wq.data||[]).filter((w:any)=>w.status===tab);
  const wlAnime = wlData.map((w:any)=>({...w.anime_data, id: w.anime_id, watchStatus: w.status}));
  const stats = { total:(wq.data||[]).length, watching:(wq.data||[]).filter((w:any)=>w.status==='watching').length, completed:(wq.data||[]).filter((w:any)=>w.status==='completed').length, favorites:(fq.data||[]).length };

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="glass rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-sakura-500/20 border-2 border-sakura-500/50 flex items-center justify-center text-3xl flex-shrink-0">🎌</div>
      <div className="flex-1 text-center sm:text-left"><h1 className="text-2xl font-bold font-display text-text-primary">{(user as any).email||'动漫爱好者'}</h1><p className="text-text-secondary text-sm mt-1">AnimeHub 追番用户</p></div>
      <button onClick={async()=>{await signOut();navigate('/')}} className="px-4 py-2 rounded-xl glass text-sm text-text-secondary hover:text-sakura-500 transition-colors">退出</button>
    </motion.div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"><StatCard icon="📚" label="追番总数" value={stats.total}/><StatCard icon="👀" label="在看" value={stats.watching}/><StatCard icon="✅" label="看过" value={stats.completed}/><StatCard icon="💖" label="收藏" value={stats.favorites}/></div>
    <section className="mb-12"><SectionHeader icon="📋" title="追番列表"/>
      <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-hide">{TABS.map(t=><button key={t.k} onClick={()=>setTab(t.k)} className={`relative px-4 py-2 rounded-xl text-sm font-medium flex-shrink-0 transition-all ${tab===t.k?'text-text-primary':'text-text-muted hover:text-text-secondary'}`}>{tab===t.k&&<motion.div layoutId="pt" className="absolute inset-0 bg-sakura-500/15 border border-sakura-500/30 rounded-xl" transition={{type:'spring',bounce:.2}}/>}<span className="relative z-10">{t.i} {t.l}</span></button>)}</div>
      {wlAnime.length>0?<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{wlAnime.map((a:any,i:number)=><AnimeCard key={a.id} anime={a} index={i} size="md"/>)}</div>:<div className="text-center py-16 glass rounded-2xl"><span className="text-4xl mb-3 block">📭</span><p className="text-text-secondary mb-4">{tab==='all'?'还没有追番记录':'该分类下暂无动漫'}</p><Link to="/search" className="text-sm text-sakura-500 hover:underline">去探索动漫 →</Link></div>}
    </section>
    <section><SectionHeader icon="💖" title="我的收藏"/>{favData.length>0?<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{favData.map((a:any,i:number)=><AnimeCard key={a.id} anime={a} index={i} size="md"/>)}</div>:<div className="text-center py-12 glass rounded-2xl"><span className="text-4xl mb-3 block">💝</span><p className="text-text-secondary">还没有收藏任何动漫</p></div>}</section>
  </div>;
}
