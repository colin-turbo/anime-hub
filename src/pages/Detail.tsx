import { useParams, Link } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { useAnimeDetail } from '../hooks/useAnimeQueries';
import { useFavorites, useWatchlist } from '../hooks/useUserData';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const animeId = parseInt(id || '0');
  const { data: anime, isLoading } = useAnimeDetail(animeId);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToWatchlist, getStatus } = useWatchlist();
  const { user } = useAuth();

  const [faved, setFaved] = useState(false);
  const [watchStatus, setWatchStatus] = useState<string>('');
  const [showTrailer, setShowTrailer] = useState(false);

  // Initialize local state from store
  if (anime) {
    const isFav = isFavorite(anime.id);
    if (isFav !== faved) setFaved(isFav);
    const ws = getStatus(anime.id);
    if (ws !== watchStatus) setWatchStatus(ws || '');
  }

  const handleToggleFavorite = useCallback(async () => {
    if (!anime) return;
    if (!user) return;
    const result = await toggleFavorite.mutateAsync({ animeId: anime.id, animeData: { id: anime.id, title: anime.title, coverImage: anime.coverImage } });
    setFaved(result === 'added');
  }, [anime, user, toggleFavorite]);

  const handleWatchStatus = useCallback(async (status: string) => {
    if (!anime) return;
    if (!user) return;
    setWatchStatus(status);
    await addToWatchlist.mutateAsync({ animeId: anime.id, animeData: { id: anime.id, title: anime.title, coverImage: anime.coverImage }, status: status as any });
  }, [anime, user, addToWatchlist]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-96 rounded-2xl skeleton mb-8" />
        <div className="space-y-4 max-w-3xl">
          <div className="h-10 w-2/3 skeleton" />
          <div className="h-6 w-1/2 skeleton" />
          <div className="h-4 w-full skeleton" />
          <div className="h-4 w-full skeleton" />
          <div className="h-4 w-3/4 skeleton" />
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <span className="text-6xl mb-4 block">😕</span>
        <h1 className="text-2xl font-bold text-white mb-2">未找到该动漫</h1>
        <Link to="/" className="text-[#3b82f6] hover:underline">返回首页</Link>
      </div>
    );
  }

  const title = anime.title.chinese || anime.title.english || anime.title.romaji || '';
  const subtitle = anime.title.romaji || anime.title.english || '';
  const bgImage = anime.bannerImage || anime.coverImage.extraLarge || anime.coverImage.large;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null;
  const characters = anime.characters?.edges || [];
  const relations = anime.relations?.edges || [];
  const trailerId = anime.trailer?.site === 'youtube' ? anime.trailer.id : null;

  const watchStatuses = [
    { key: 'watching', label: '在看', color: 'bg-[#3b82f6]' },
    { key: 'completed', label: '看过', color: 'bg-[#22c55e]' },
    { key: 'planning', label: '想看', color: 'bg-[#a855f7]' },
    { key: 'paused', label: '搁置', color: 'bg-[#f59e0b]' },
    { key: 'dropped', label: '弃了', color: 'bg-[#ef4444]' },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {bgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/70 to-[#0a0a1a]/40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Poster + Quick Info */}
          <div className="w-full md:w-72 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                {(anime.coverImage.large || anime.coverImage.medium) && (
                  <img
                    src={anime.coverImage.large || anime.coverImage.medium}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Action buttons */}
              {user && (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
                      faved
                        ? 'bg-[#ff6b9d]/20 border border-[#ff6b9d]/40 text-[#ff6b9d]'
                        : 'glass text-white/70 hover:text-white hover:border-[#ff6b9d]/30'
                    }`}
                  >
                    {faved ? '❤️ 已收藏' : '🤍 收藏'}
                  </button>

                  {/* Watch status dropdown */}
                  <div className="flex flex-wrap gap-1.5">
                    {watchStatuses.map(({ key, label, color }) => (
                      <button
                        key={key}
                        onClick={() => handleWatchStatus(key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          watchStatus === key
                            ? `${color}/20 border border-current text-white`
                            : 'glass text-white/40 hover:text-white/70'
                        }`}
                        style={watchStatus === key ? { color } : undefined}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {title}
              </h1>
              {subtitle !== title && (
                <p className="text-lg text-white/50 mb-4">{subtitle}</p>
              )}

              {/* Meta badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {score && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#a855f7]/20 border border-[#a855f7]/30 backdrop-blur-sm">
                    <span className="text-[#a855f7]">★</span>
                    <span className="text-white font-bold">{score}</span>
                  </div>
                )}
                {anime.format && (
                  <span className="px-3 py-1.5 rounded-xl glass text-white/70 text-sm backdrop-blur-sm">
                    {anime.format.replace(/_/g, ' ')}
                  </span>
                )}
                {anime.status && (
                  <span className="px-3 py-1.5 rounded-xl glass text-white/70 text-sm backdrop-blur-sm">
                    {anime.status === 'RELEASING' ? '放送中' : anime.status === 'FINISHED' ? '已完结' : anime.status === 'NOT_YET_RELEASED' ? '未放送' : anime.status}
                  </span>
                )}
                {anime.episodes && (
                  <span className="px-3 py-1.5 rounded-xl glass text-white/70 text-sm backdrop-blur-sm">
                    {anime.episodes} 话
                  </span>
                )}
                {anime.season && anime.seasonYear && (
                  <span className="px-3 py-1.5 rounded-xl glass text-white/70 text-sm backdrop-blur-sm">
                    {anime.season} {anime.seasonYear}
                  </span>
                )}
              </div>

              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {anime.genres.map((g) => (
                    <Link
                      key={g}
                      to={`/search?genre=${g}`}
                      className="px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/60 text-xs hover:text-[#ff6b9d] hover:border-[#ff6b9d]/20 transition-all"
                    >
                      {g}
                    </Link>
                  ))}
                </div>
              )}

              {/* Description */}
              {anime.description && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-2">简介</h3>
                  <div
                    className="text-white/60 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: anime.description }}
                  />
                </div>
              )}

              {/* Trailer */}
              {trailerId && (
                <div className="mb-8">
                  <button
                    onClick={() => setShowTrailer(!showTrailer)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-white/70 hover:text-white transition-all text-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    {showTrailer ? '隐藏预告片' : '观看预告片'}
                  </button>
                  {showTrailer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 aspect-video rounded-xl overflow-hidden max-w-2xl"
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${trailerId}`}
                        className="w-full h-full"
                        allowFullScreen
                        title="Trailer"
                      />
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 mb-12"
        >
          {[
            { label: 'AniList评分', value: anime.averageScore ? `${(anime.averageScore / 10).toFixed(1)}` : '-', color: 'text-[#a855f7]' },
            { label: '人气排名', value: anime.popularity ? `#${anime.popularity.toLocaleString()}` : '-', color: 'text-[#3b82f6]' },
            { label: '收藏数', value: anime.favourites?.toLocaleString() ?? '-', color: 'text-[#ff6b9d]' },
            { label: 'Bangumi评分', value: anime.bangumiScore ? anime.bangumiScore.toFixed(1) : '-', color: 'text-[#f09199]' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Characters */}
        {characters.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-xl font-bold text-white mb-4">角色</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {characters.map((edge) => (
                <div key={edge.node.id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-white/5 mb-2">
                    {edge.node.image.medium && (
                      <img
                        src={edge.node.image.medium}
                        alt={edge.node.name.full}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <p className="text-xs text-white/70 line-clamp-1">{edge.node.name.full}</p>
                  <p className="text-[10px] text-white/40">{edge.role}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Relations */}
        {relations.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-xl font-bold text-white mb-4">关联作品</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relations.slice(0, 6).map((edge) => {
                const rel = edge.node;
                const relTitle = rel.title.romaji || rel.title.english || rel.title.native || '';
                return (
                  <Link
                    key={rel.id}
                    to={`/anime/${rel.id}`}
                    className="block group"
                  >
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white/5 mb-2">
                      {(rel.coverImage.large || rel.coverImage.medium) && (
                        <img
                          src={rel.coverImage.large || rel.coverImage.medium}
                          alt={relTitle}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <p className="text-xs text-white/50 line-clamp-2 group-hover:text-[#ff6b9d] transition-colors">
                      {relTitle}
                    </p>
                    <p className="text-[10px] text-white/30">{edge.relationType}</p>
                  </Link>
                );
              })}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
