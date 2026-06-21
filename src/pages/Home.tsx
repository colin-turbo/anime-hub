import { useTopAnime, useSeasonalAnime } from '../hooks/useAnimeQueries';
import HeroBanner from '../components/HeroBanner';
import SectionHeader from '../components/SectionHeader';
import AnimeCard from '../components/AnimeCard';
import { motion } from 'framer-motion';

const yr = new Date().getFullYear();
const season = (['WINTER','SPRING','SUMMER','FALL'] as const)[Math.floor(new Date().getMonth()/3)];

function LoadingSkeleton() {
  return <div className="w-44 flex-shrink-0 animate-pulse"><div className="aspect-[3/4] rounded-xl bg-surface-800 mb-2.5"/><div className="h-4 bg-surface-800 rounded w-3/4 mb-1.5"/><div className="h-3 bg-surface-800 rounded w-1/2"/></div>;
}

export default function Home() {
  const top = useTopAnime('SCORE_DESC',1,12);
  const trending = useTopAnime('POPULARITY_DESC',1,12);
  const seasonal = useSeasonalAnime(season,yr,1,15);
  const topMedia = (top.data as any)?.Page?.media || [];
  const trendMedia = (trending.data as any)?.Page?.media || [];
  const seasMedia = (seasonal.data as any)?.Page?.media || [];
  const loading = top.isLoading || trending.isLoading || seasonal.isLoading;

  return <div className="min-h-screen">
    {topMedia.length > 0 && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="px-4 sm:px-6 lg:px-8 pt-6 max-w-7xl mx-auto"><HeroBanner featured={topMedia}/></motion.div>}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <section><SectionHeader icon="🔥" title="热门趋势" linkTo="/rankings"/><div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">{loading?Array(6).fill(0).map((_,i)=><LoadingSkeleton key={i}/>):trendMedia.map((a:any,i:number)=><AnimeCard key={a.id} anime={a} index={i} size="md"/>)}</div></section>
      <section><SectionHeader icon="⭐" title="高分推荐" linkTo="/rankings"/><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{loading?Array(6).fill(0).map((_,i)=><LoadingSkeleton key={i}/>):topMedia.map((a:any,i:number)=><AnimeCard key={a.id} anime={a} index={i} size="sm"/>)}</div></section>
      <section><SectionHeader icon="🌸" title={`${yr}年 ${season==='SPRING'?'春季':season==='SUMMER'?'夏季':season==='FALL'?'秋季':'冬季'}新番`} linkTo="/seasonal"/><div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">{seasonal.isLoading?Array(6).fill(0).map((_,i)=><LoadingSkeleton key={i}/>):seasMedia.map((a:any,i:number)=><AnimeCard key={a.id} anime={a} index={i} size="md"/>)}</div></section>
      <motion.section className="text-center py-8" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
        <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl glass">
          <span className="text-text-muted text-sm">数据来源</span>
          <span className="text-neon-purple-400 font-medium text-sm">📡 AniList</span><span className="text-text-muted">·</span>
          <span className="text-electric-blue-400 font-medium text-sm">📊 MAL</span><span className="text-text-muted">·</span>
          <span className="text-sakura-500 font-medium text-sm">🐱 Kitsu</span><span className="text-text-muted">·</span>
          <span className="text-green-400 font-medium text-sm">🇨🇳 Bangumi</span>
        </div>
      </motion.section>
    </div>
  </div>;
}
