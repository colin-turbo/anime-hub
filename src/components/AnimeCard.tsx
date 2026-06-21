import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Props { anime: any; index?: number; size?: 'sm'|'md'|'lg'; }
const sz = { sm: 'w-36', md: 'w-44', lg: 'w-56' };
export default function AnimeCard({ anime, index = 0, size = 'md' }: Props) {
  const title = anime.chineseTitle || anime.title?.native || anime.title?.romaji || '';
  const score = anime.averageScore;
  const sc = !score ? 'text-text-muted' : score>=80 ? 'text-sakura-500' : score>=70 ? 'text-neon-purple-400' : score>=60 ? 'text-electric-blue-400' : 'text-text-secondary';
  return <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:index*.05,duration:.4}} whileHover={{y:-6,scale:1.03}} className={`${sz[size]} flex-shrink-0`}>
    <Link to={`/anime/${anime.id}`} className="block group">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2.5 border border-glass-border group-hover:border-sakura-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-sakura-500/20">
        <img src={anime.coverImage?.large||anime.coverImage?.medium} alt={title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
        {score&&<div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-surface-950/80 backdrop-blur-sm border border-glass-border flex items-center gap-1"><span className="text-amber-400 text-xs">★</span><span className={`text-xs font-bold ${sc}`}>{score}%</span></div>}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-neon-purple-500/20 border border-neon-purple-500/30 text-neon-purple-400 text-[10px] font-medium uppercase">{anime.format?.replace('_',' ')||'TV'}</div>
      </div>
      <h3 className="text-sm font-medium text-text-primary line-clamp-2 leading-snug group-hover:text-sakura-500 transition-colors duration-200">{title}</h3>
      <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">{anime.seasonYear&&<span>{anime.seasonYear}</span>}{anime.episodes&&<span>{anime.episodes}话</span>}</div>
    </Link>
  </motion.div>;
}
