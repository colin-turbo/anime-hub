import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAnimeSearch } from '../hooks/useAnimeQueries';
import AnimeCard from '../components/AnimeCard';

const GENRES = ['Action','Adventure','Comedy','Drama','Fantasy','Horror','Mecha','Music','Mystery','Psychological','Romance','Sci-Fi','Slice of Life','Sports','Supernatural','Thriller'];
const FORMATS = [{l:'TV',v:'TV'},{l:'电影',v:'MOVIE'},{l:'OVA',v:'OVA'},{l:'特别篇',v:'SPECIAL'},{l:'ONA',v:'ONA'}];
const SORTS = [{l:'人气',v:'POPULARITY_DESC'},{l:'评分',v:'SCORE_DESC'},{l:'标题',v:'TITLE_ROMAJI'},{l:'最新',v:'START_DATE_DESC'}];

export default function Search() {
  const [q,setQ]=useState(''); const [sq,setSq]=useState(''); const [page,setPage]=useState(1);
  const [genres,setGenres]=useState<string[]>([]); const [fmt,setFmt]=useState<string|undefined>();
  const [sort,setSort]=useState('POPULARITY_DESC');
  const filters = {query:sq||undefined, genres:genres.length>0?genres:undefined, format:fmt, sort};
  const {data,isLoading}=useAnimeSearch(filters,page,24);
  const media=(data as any)?.Page?.media||[]; const pi=(data as any)?.Page?.pageInfo;

  const tg=(g:string)=>{setGenres(p=>p.includes(g)?p.filter(x=>x!==g):[...p,g]);setPage(1)};

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-8"><h1 className="text-3xl font-bold font-display text-text-primary mb-1">🔍 探索动漫</h1><p className="text-text-secondary">发现你的下一部最爱</p></motion.div>
    <form onSubmit={e=>{e.preventDefault();setSq(q);setPage(1)}} className="mb-6"><div className="relative"><input type="text" value={q} onChange={e=>setQ(e.target.value)} placeholder="搜索动漫名称..." className="w-full px-5 py-4 rounded-2xl glass-strong border border-glass-border text-text-primary placeholder:text-text-muted text-lg focus:outline-none focus:border-sakura-500/50 focus:ring-2 focus:ring-sakura-500/20 transition-all"/><button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-xl bg-sakura-500 hover:bg-sakura-600 text-white font-semibold transition-all shadow-lg shadow-sakura-500/25">搜索</button></div></form>
    <div className="glass rounded-2xl p-5 mb-8 space-y-4">
      <div><h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">类型</h3><div className="flex flex-wrap gap-1.5">{GENRES.map(g=><button key={g} onClick={()=>tg(g)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${genres.includes(g)?'bg-sakura-500/20 border border-sakura-500/50 text-sakura-500':'bg-surface-800/50 border border-transparent text-text-secondary hover:border-glass-border hover:text-text-primary'}`}>{g}</button>)}</div></div>
      <div className="flex flex-wrap gap-4"><div><h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">格式</h3><div className="flex gap-1.5">{FORMATS.map(f=><button key={f.v} onClick={()=>{setFmt(fmt===f.v?undefined:f.v);setPage(1)}} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${fmt===f.v?'bg-electric-blue-500/20 border border-electric-blue-500/50 text-electric-blue-400':'bg-surface-800/50 border border-transparent text-text-secondary hover:border-glass-border'}`}>{f.l}</button>)}</div></div></div>
      <div className="flex items-center justify-between pt-2 border-t border-glass-border"><div className="flex gap-1.5">{SORTS.map(s=><button key={s.v} onClick={()=>{setSort(s.v);setPage(1)}} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${sort===s.v?'text-neon-purple-400 bg-neon-purple-500/10':'text-text-muted hover:text-text-secondary'}`}>{s.l}</button>)}</div>{data ? <span className="text-xs text-text-muted">共 {String(pi?.total||0)} 部</span> : null}</div>
    </div>
    {isLoading?<div className="text-center py-20"><div className="inline-block w-10 h-10 border-2 border-sakura-500/30 border-t-sakura-500 rounded-full animate-spin"/></div>:
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{media.map((a:any,i:number)=><AnimeCard key={a.id} anime={a} index={i} size="md"/>)}</div>}
    {pi?.lastPage>1&&<div className="flex justify-center items-center gap-3 mt-10"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-4 py-2 rounded-xl glass text-sm text-text-secondary hover:text-text-primary disabled:opacity-30">← 上一页</button><span className="text-sm text-text-muted">{page}/{pi.lastPage}</span><button onClick={()=>setPage(p=>Math.min(pi.lastPage,p+1))} disabled={!pi.hasNextPage} className="px-4 py-2 rounded-xl glass text-sm text-text-secondary hover:text-text-primary disabled:opacity-30">下一页 →</button></div>}
  </div>;
}
