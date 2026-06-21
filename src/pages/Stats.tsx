import { motion } from 'framer-motion';
import { useTopAnime } from '../hooks/useAnimeQueries';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const COLORS = ['#ff6b9d','#a855f7','#3b82f6','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6'];
const tipStyle = {background:'rgba(18,18,42,0.95)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:'12px',color:'#f0f0ff'};

export default function Stats() {
  const top50 = useTopAnime('SCORE_DESC',1,50);
  const media = (top50.data as any)?.Page?.media || [];
  const loading = top50.isLoading;

  const genreData = (()=>{const c:Record<string,number>={}; media.forEach((a:any)=>{(a.genres||[]).forEach((g:any)=>{const n=typeof g==='string'?g:g.name; if(n)c[n]=(c[n]||0)+1})}); return Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([n,v])=>({name:n,value:v}));})();
  const studioData = (()=>{const c:Record<string,number>={}; media.forEach((a:any)=>{(a.studios?.nodes||[]).forEach((s:any)=>{c[s.name]=(c[s.name]||0)+1})}); return Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([n,v])=>({name:n.length>15?n.slice(0,14)+'…':n,value:v}));})();
  const scoreDist = (()=>{const b={0:0,1:0,2:0,3:0,4:0,5:0,6:0}; media.forEach((a:any)=>{if(!a.averageScore)return; if(a.averageScore<40)b[0]++; else if(a.averageScore<50)b[1]++; else if(a.averageScore<60)b[2]++; else if(a.averageScore<70)b[3]++; else if(a.averageScore<80)b[4]++; else if(a.averageScore<90)b[5]++; else b[6]++}); return ['0-39','40-49','50-59','60-69','70-79','80-89','90-100'].map((n,i)=>({name:n,value:b[i as keyof typeof b]}));})();

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-8"><h1 className="text-3xl font-bold font-display text-text-primary mb-1">📊 数据统计</h1><p className="text-text-secondary">类型分布 · 制作公司 · 评分分析</p></motion.div>
  {loading?<div className="text-center py-20"><div className="inline-block w-10 h-10 border-2 border-sakura-500/30 border-t-sakura-500 rounded-full animate-spin"/></div>:
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="glass rounded-2xl p-6"><h3 className="text-lg font-bold text-text-primary mb-4">🎨 类型分布 Top 10</h3><ResponsiveContainer width="100%" height={320}><PieChart><Pie data={genreData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={3} dataKey="value">{genreData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip contentStyle={tipStyle}/></PieChart></ResponsiveContainer></motion.div>
    <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.1}} className="glass rounded-2xl p-6"><h3 className="text-lg font-bold text-text-primary mb-4">📈 评分分布</h3><ResponsiveContainer width="100%" height={320}><BarChart data={scoreDist}><CartesianGrid strokeDasharray="3 3" stroke="rgba(168,85,247,0.1)"/><XAxis dataKey="name" stroke="#a0a0cc" fontSize={12}/><YAxis stroke="#a0a0cc" fontSize={12}/><Tooltip contentStyle={tipStyle}/><Bar dataKey="value" name="数量" radius={[6,6,0,0]}>{scoreDist.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer></motion.div>
    <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.2}} className="glass rounded-2xl p-6"><h3 className="text-lg font-bold text-text-primary mb-4">🏢 制作公司 Top 10</h3><ResponsiveContainer width="100%" height={320}><BarChart data={studioData} layout="vertical" margin={{left:-20}}><CartesianGrid strokeDasharray="3 3" stroke="rgba(168,85,247,0.1)"/><XAxis type="number" stroke="#a0a0cc" fontSize={12}/><YAxis dataKey="name" type="category" stroke="#a0a0cc" fontSize={11} width={80}/><Tooltip contentStyle={tipStyle}/><Bar dataKey="value" name="作品数" radius={[0,6,6,0]}>{studioData.map((_,i)=><Cell key={i} fill={COLORS[(i+3)%COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer></motion.div>
    <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.3}} className="glass rounded-2xl p-6"><h3 className="text-lg font-bold text-text-primary mb-4">📉 评分趋势</h3><ResponsiveContainer width="100%" height={320}><LineChart data={media.filter((a:any)=>a.averageScore).map((a:any,i:number)=>({rank:i+1,score:a.averageScore,name:a.title?.romaji?.slice(0,12)||''})).slice(0,30)}><CartesianGrid strokeDasharray="3 3" stroke="rgba(168,85,247,0.1)"/><XAxis dataKey="rank" stroke="#a0a0cc" fontSize={12}/><YAxis domain={[70,100]} stroke="#a0a0cc" fontSize={12}/><Tooltip contentStyle={tipStyle}/><Line type="monotone" dataKey="score" stroke="#ff6b9d" strokeWidth={2} dot={{r:3,fill:'#ff6b9d'}} activeDot={{r:6}}/></LineChart></ResponsiveContainer></motion.div>
  </div>}
  </div>;
}
