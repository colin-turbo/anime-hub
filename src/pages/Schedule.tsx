import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAiringSchedule } from '../hooks/useAnimeQueries';

const DAYS = ['周一','周二','周三','周四','周五','周六','周日'];
const EM = ['🌊','🌿','🌸','☀️','🍂','❄️','🌙'];

function getRange() { const n=new Date(); const d=n.getDay(); const m=new Date(n); m.setDate(n.getDate()-(d===0?6:d-1)); m.setHours(0,0,0,0); const s=new Date(m); s.setDate(m.getDate()+7); s.setHours(23,59,59,999); return{ws:Math.floor(m.getTime()/1000),we:Math.floor(s.getTime()/1000),md:m}; }

export default function Schedule() {
  const {ws,we,md}=useMemo(getRange,[]);
  const {data,isLoading}=useAiringSchedule(ws,we);
  const byDay=useMemo(()=>{const days:any[][]=Array.from({length:7},()=>[]);(data as any)?.Page?.airingSchedules?.forEach((item:any)=>{const d=new Date(item.airingAt*1000);const idx=d.getDay()===0?6:d.getDay()-1;if(idx>=0&&idx<7)days[idx].push(item)});return days},[data]);
  const t=new Date(); const ti=t.getDay()===0?6:t.getDay()-1;

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-8"><h1 className="text-3xl font-bold font-display text-text-primary mb-1">📅 放送日历</h1><p className="text-text-secondary">本周动漫更新时间表 · {md.toLocaleDateString('zh-CN',{month:'long',day:'numeric'})} ~ {new Date(md.getTime()+6*86400000).toLocaleDateString('zh-CN',{month:'long',day:'numeric'})}</p></motion.div>
  {isLoading?<div className="text-center py-20"><div className="inline-block w-10 h-10 border-2 border-sakura-500/30 border-t-sakura-500 rounded-full animate-spin"/></div>:
  <div className="grid grid-cols-1 md:grid-cols-7 gap-3">{DAYS.map((dn,idx)=>{const items=byDay[idx];const isToday=idx===ti;const dd=new Date(md.getTime()+idx*86400000);
    return <motion.div key={idx} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:idx*.05}} className={`rounded-2xl overflow-hidden ${isToday?'glass-strong border-2 border-sakura-500/40':'glass border border-glass-border'}`}>
      <div className={`px-3 py-3 text-center ${isToday?'bg-sakura-500/10':''}`}><div className="flex items-center justify-center gap-1.5"><span className="text-lg">{EM[idx]}</span><span className={`text-sm font-bold ${isToday?'text-sakura-500 neon-text-sakura':'text-text-primary'}`}>{dn}</span></div><p className={`text-xs mt-0.5 ${isToday?'text-sakura-500/80':'text-text-muted'}`}>{dd.toLocaleDateString('zh-CN',{month:'numeric',day:'numeric'})}{isToday&&' · 今天'}</p></div>
      <div className="p-2 space-y-2 min-h-[120px]">{items.length===0?<div className="flex items-center justify-center h-24"><p className="text-xs text-text-muted">暂无更新</p></div>:items.map((item:any)=><Link key={item.id} to={`/anime/${item.media.id}`} className="flex items-center gap-2 p-2 rounded-xl bg-surface-800/50 hover:bg-surface-700/50 border border-transparent hover:border-sakura-500/20 transition-all group"><img src={item.media.coverImage?.medium} alt="" className="w-10 h-14 object-cover rounded-lg flex-shrink-0"/><div className="min-w-0 flex-1"><p className="text-xs font-medium text-text-primary truncate group-hover:text-sakura-500 transition-colors">{item.media.title?.romaji}</p><div className="flex items-center gap-2 mt-0.5"><span className="text-[10px] text-sakura-500 font-medium">EP {item.episode}</span><span className="text-[10px] text-text-muted">{new Date(item.airingAt*1000).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}</span></div></div></Link>)}</div>
    </motion.div>;
  })}</div>}
  </div>;
}
