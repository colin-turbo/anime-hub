import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Props { title: string; subtitle?: string; icon?: string; linkTo?: string; linkLabel?: string; }
export default function SectionHeader({ title, subtitle, icon, linkTo, linkLabel }: Props) {
  return <motion.div className="flex items-end justify-between mb-6" initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
    <div><h2 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2">{icon&&<span className="text-2xl">{icon}</span>}{title}</h2>{subtitle&&<p className="text-sm text-text-muted mt-1">{subtitle}</p>}</div>
    {linkTo&&<Link to={linkTo} className="text-sm text-neon-purple-400 hover:text-sakura-500 transition-colors flex items-center gap-1 group">{linkLabel||'查看全部'}<span className="group-hover:translate-x-1 transition-transform">→</span></Link>}
  </motion.div>;
}
