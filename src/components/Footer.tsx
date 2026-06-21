import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black/20 border-t border-white/5 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌸</span>
              <span className="text-lg font-bold bg-gradient-to-r from-[#ff6b9d] to-[#a855f7] bg-clip-text text-transparent">
                AnimeHub
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              动漫收藏馆 — 一站式动漫数据聚合平台，整合多个数据源为您提供最全面的动漫信息。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white/60 mb-3">快速链接</h4>
            <div className="space-y-2">
              <Link to="/search" className="block text-sm text-white/40 hover:text-[#ff6b9d] transition-colors">搜索</Link>
              <Link to="/rankings" className="block text-sm text-white/40 hover:text-[#ff6b9d] transition-colors">排行榜</Link>
              <Link to="/seasonal" className="block text-sm text-white/40 hover:text-[#ff6b9d] transition-colors">季度新番</Link>
              <Link to="/schedule" className="block text-sm text-white/40 hover:text-[#ff6b9d] transition-colors">放送表</Link>
            </div>
          </div>

          {/* Data sources */}
          <div>
            <h4 className="text-sm font-semibold text-white/60 mb-3">数据来源</h4>
            <div className="space-y-2">
              <a href="https://anilist.co" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/40 hover:text-[#3b82f6] transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#3b82f6]" /> AniList
              </a>
              <a href="https://myanimelist.net" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/40 hover:text-[#4a90d9] transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#4a90d9]" /> MyAnimeList
              </a>
              <a href="https://kitsu.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/40 hover:text-[#f75239] transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#f75239]" /> Kitsu
              </a>
              <a href="https://bgm.tv" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/40 hover:text-[#f09199] transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#f09199]" /> Bangumi
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-white/30">
          &copy; {new Date().getFullYear()} AnimeHub — 动漫收藏馆. Powered by AniList, MyAnimeList, Kitsu &amp; Bangumi.
        </div>
      </div>
    </footer>
  );
}
