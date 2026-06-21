import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTopAnime } from '../hooks/useAnimeQueries';

const tabs = [{k:'SCORE_DESC',l:'评分最高',i:'⭐'},{k:'POPULARITY_DESC',l:'人气最高',i:'🔥'},{k:'FAVOURITES_DESC',l:'收藏最多',i:'💖'}];

function Badge({r}:{r:number}) { if(r===1)return<span className="text-2xl">🥇</span>; if(r===2)return<span className="text-2xl">🥈</span>; if(r===3)return<span className="text-2xl">🥉</span>; return<span className="text-sm font-bold text-text-muted w-8 text-center">#{r}</span>; }

export default function Rankings() {
  const [tab, setTab] = useState('SCORE_DESC'); const [page, setPage] = useState(1);
  const { data, isLoading } = useTopAnime(tab, page, 30);
  const media = (data as any)?.Page?.media || [];
  const pageInfo = (data as any)?.Page?.pageInfo;

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-8"><h1 className="text-3xl font-bold font-display text-text-primary mb-1">🏆 排行榜</h1><p className="text-text-secondary">综合评分 · 人气 · 收藏</p></motion.div>
    <div className="flex gap-1 mb-8 p-1 glass rounded-2xl w-fit">{tabs.map(t=><button key={t.k} onClick={()=>{setTab(t.k);setPage(1)}} className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab===t.k?'text-text-primary':'text-text-muted hover:text-text-secondary'}`}>{tab===t.k&&<motion.div layoutId="rank-tab" className="absolute inset-0 bg-sakura-500/15 border border-sakura-500/30 rounded-xl" transition={{type:'spring',bounce:.2}}/>}<span className="relative z-10 flex items-center gap-1.5"><span>{t.i}</span> {t.l}</span></button>)}</div>
    {isLoading?<div className="text-center py-20"><div className="inline-block w-10 h-10 border-2 border-sakura-500/30 border-t-sakura-500 rounded-full animate-spin"/></div>:
    <><motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="space-y-2">{
      media.map((anime:any,i:number)=><Link key={anime.id} to={`/anime/${anime.id}`} className="flex items-center gap-4 p-3 glass rounded-xl hover:border-sakura-500/20 transition-all group">
        <div className="w-10 text-center flex-shrink-0"><Badge r={i+1}/></div>
        <img src={anime.coverImage?.medium} alt="" className="w-12 h-16 object-cover rounded-lg flex-shrink-0"/>
        <div className="flex-1 min-w-0"><h3 className="text-sm font-medium text-text-primary truncate group-hover:text-sakura-500 transition-colors">{anime.title?.romaji}</h3><div className="flex items-center gap-3 mt-1"><span className="text-xs text-text-muted">{anime.format?.replace('_',' ')}</span>{anime.seasonYear&&<><span className="text-text-muted/50">·</span><span className="text-xs text-text-muted">{anime.seasonYear}</span></>}</div></div>
        <div className="text-right flex-shrink-0">{anime.averageScore&&<div className="flex items-center gap-1"><span className="text-amber-400 text-sm">★</span><span className="text-sm font-bold text-sakura-500">{anime.averageScore}%</span></div>}<span className="text-xs text-text-muted">{anime.popularity?.toLocaleString()}关注</span></div>
      </Link>)
    }</motion.div>
    {pageInfo?.lastPage>1&&<div className="flex justify-center items-center gap-3 mt-8 pt-4"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-4 py-2 rounded-xl glass text-sm text-text-secondary hover:text-text-primary disabled:opacity-30">← 上一页</button><span className="text-sm text-text-muted">{page}/{pageInfo.lastPage}</span><button onClick={()=>setPage(p=>Math.min(pageInfo.lastPage,p+1))} disabled={!pageInfo.hasNextPage} className="px-4 py-2 rounded-xl glass text-sm text-text-secondary hover:text-text-primary disabled:opacity-30">下一页 →</button></div>}</>
    }</div>;
}
