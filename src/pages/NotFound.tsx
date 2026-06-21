import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          🌸
        </motion.div>

        <h1 className="text-6xl font-black text-white mb-4">
          <span className="gradient-text">404</span>
        </h1>

        <p className="text-white/40 text-lg mb-8">
          哎呀，这个页面藏起来了...
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6b9d] to-[#a855f7] text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-[#a855f7]/25"
          >
            🏠 返回首页
          </Link>
          <Link
            to="/search"
            className="px-6 py-3 rounded-xl glass text-white/70 hover:text-white transition-all"
          >
            🔍 搜索动漫
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
