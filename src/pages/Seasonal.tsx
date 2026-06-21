import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSeasonalAnime } from '../hooks/useAnimeQueries';
import AnimeCard from '../components/AnimeCard';

const seasons = ['WINTER','SPRING','SUMMER','FALL'] as const;
const sn: Record<string,string> = {WINTER:'❄️ 冬季',SPRING:'🌸 春季',SUMMER:'☀️ 夏季',FALL:'🍂 秋季'};
const yr = new Date().getFullYear();
const years = Array.from({length:20},(_,i)=>yr-i);

export default function Seasonal() {
  const [sel,setSel]=useState<typeof seasons[number]>(seasons[Math.floor(new Date().getMonth()/3)]);
  const [year,setYear]=useState(yr);
  const [page,setPage]=useState(1);
  const {data,isLoading}=useSeasonalAnime(sel,year,page,24);
  const media = (data as any)?.Page?.media || [];
  const pageInfo = (data as any)?.Page?.pageInfo;

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-8"><h1 className="text-3xl font-bold font-display text-text-primary mb-1">🌸 季度新番</h1><p className="text-text-secondary">按年份和季度浏览动漫</p></motion.div>
    <div className="glass rounded-2xl p-6 mb-8 space-y-4">
      <div className="flex gap-1">{seasons.map(s=><button key={s} onClick={()=>{setSel(s);setPage(1)}} className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${sel===s?'text-text-primary':'text-text-muted hover:text-text-secondary'}`}>{sel===s&&<motion.div layoutId="sz" className="absolute inset-0 bg-sakura-500/15 border border-sakura-500/30 rounded-xl" transition={{type:'spring',bounce:.2}}/>}<span className="relative z-10">{sn[s]}</span></button>)}</div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">{years.map(y=><button key={y} onClick={()=>{setYear(y);setPage(1)}} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-all ${year===y?'bg-neon-purple-500/20 border border-neon-purple-500/40 text-neon-purple-400':'bg-surface-800/50 text-text-muted hover:text-text-secondary'}`}>{y}</button>)}</div>
    </div>
    {isLoading?<div className="text-center py-20"><div className="inline-block w-10 h-10 border-2 border-sakura-500/30 border-t-sakura-500 rounded-full animate-spin"/></div>:
    media.length>0?<motion.div initial={{opacity:0}} animate={{opacity:1}}><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{media.map((a:any,i:number)=><AnimeCard key={a.id} anime={a} index={i} size="md"/>)}</div>{pageInfo?.lastPage>1&&<div className="flex justify-center items-center gap-3 mt-10"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-4 py-2 rounded-xl glass text-sm text-text-secondary hover:text-text-primary disabled:opacity-30">← 上一页</button><span className="text-sm text-text-muted">{page}/{pageInfo.lastPage}</span><button onClick={()=>setPage(p=>Math.min(pageInfo.lastPage,p+1))} disabled={!pageInfo.hasNextPage} className="px-4 py-2 rounded-xl glass text-sm text-text-secondary hover:text-text-primary disabled:opacity-30">下一页 →</button></div>}</motion.div>:<div className="text-center py-20 text-text-muted"><p className="text-4xl mb-4">🍃</p><p>该季度暂无数据</p></div>}
  </div>;
}
