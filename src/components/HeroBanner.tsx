import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Props { featured: any[]; }
export default function HeroBanner({ featured }: Props) {
  const [current, setCurrent] = useState(0);
  const items = featured.slice(0, 5);
  const next = useCallback(() => setCurrent(p => (p + 1) % items.length), [items.length]);
  useEffect(() => { if (items.length <= 1) return; const t = setInterval(next, 5000); return () => clearInterval(t); }, [next, items.length]);
  if (items.length === 0) return null;
  const anime = items[current];
  return <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl">
    <AnimatePresence mode="wait"><motion.div key={anime.id} initial={{opacity:0,scale:1.05}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:.8}} className="absolute inset-0">
      <img src={anime.bannerImage||anime.coverImage?.extraLarge||anime.coverImage?.large} alt="" className="w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/60 to-surface-950/30"/>
      <div className="absolute inset-0 bg-gradient-to-r from-surface-950/90 via-surface-950/50 to-transparent"/>
    </motion.div></AnimatePresence>
    <div className="relative z-10 h-full flex items-center"><div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait"><motion.div key={anime.id} initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:30}} transition={{duration:.5}} className="max-w-2xl">
        <div className="flex gap-2 mb-4">{(anime.genres||[]).slice(0,3).map((g:any,i:number)=><span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-sakura-500/10 border border-sakura-500/30 text-sakura-500">{typeof g==='string'?g:g.name}</span>)}</div>
        <h1 className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-3 leading-tight">{anime.chineseTitle||anime.title?.native||anime.title?.romaji}</h1>
        {anime.title?.romaji !== (anime.chineseTitle||'') && <p className="text-lg text-text-secondary mb-4">{anime.title?.romaji}</p>}
        <div className="flex items-center gap-4 mb-4">
          {anime.averageScore&&<><span className="text-amber-400 text-lg">★</span><span className="text-xl font-bold text-sakura-500">{anime.averageScore}%</span></>}
          <span className="text-text-muted">|</span><span className="text-sm text-text-secondary">{anime.format?.replace('_',' ')}</span>
          {anime.episodes&&<><span className="text-text-muted">|</span><span className="text-sm text-text-secondary">{anime.episodes}话</span></>}
        </div>
        <Link to={`/anime/${anime.id}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sakura-500 hover:bg-sakura-600 text-white font-semibold transition-all duration-200 shadow-lg shadow-sakura-500/25 hover:shadow-sakura-500/40 hover:scale-105">查看详情<span className="text-lg">→</span></Link>
      </motion.div></AnimatePresence>
    </div></div>
    {items.length>1&&<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">{items.map((item:any,i:number)=><button key={item.id} onClick={()=>setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i===current?'bg-sakura-500 w-8 shadow-md shadow-sakura-500/50':'bg-white/30 hover:bg-white/50'}`}/>)}</div>}
  </div>;
}
