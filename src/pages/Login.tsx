import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true);
    try { const r = isRegister ? await signUp(email, password) : await signIn(email, password);
      if (r.error) setError(r.error); else navigate('/profile'); } catch { setError('操作失败'); } finally { setLoading(false); } };

  if (user) return <div className="max-w-md mx-auto px-4 py-20 text-center"><motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} className="glass rounded-2xl p-8"><span className="text-5xl mb-4 block">🎉</span><h1 className="text-2xl font-bold text-text-primary mb-2">已登录</h1><p className="text-text-secondary mb-6">{(user as any).email||'用户'}</p><div className="flex flex-col gap-3"><button onClick={()=>navigate('/profile')} className="w-full py-3 rounded-xl bg-sakura-500 hover:bg-sakura-600 text-white font-semibold transition-all">进入个人中心</button><button onClick={async()=>{await signOut()}} className="w-full py-3 rounded-xl glass text-text-secondary hover:text-text-primary transition-all">退出登录</button></div></motion.div></div>;

  return <div className="max-w-md mx-auto px-4 py-20"><motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="glass-strong rounded-2xl p-8"><div className="text-center mb-8"><span className="text-5xl mb-3 block">🔑</span><h1 className="text-2xl font-bold font-display text-text-primary">{isRegister?'创建账号':'欢迎回来'}</h1><p className="text-text-secondary text-sm mt-2">{isRegister?'注册以管理你的追番列表':'登录以管理你的追番列表'}</p></div>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium text-text-secondary mb-1.5">📧 邮箱</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-glass-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sakura-500/50 focus:ring-2 focus:ring-sakura-500/20 transition-all"/></div>
      <div><label className="block text-sm font-medium text-text-secondary mb-1.5">🔒 密码</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="至少6位" required minLength={6} className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-glass-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sakura-500/50 focus:ring-2 focus:ring-sakura-500/20 transition-all"/></div>
      {error&&<motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-sm text-sakura-500 bg-sakura-500/10 rounded-lg px-4 py-2">⚠️ {error}</motion.p>}
      <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-sakura-500 hover:bg-sakura-600 text-white font-semibold transition-all shadow-lg shadow-sakura-500/25 hover:shadow-sakura-500/40 disabled:opacity-50">{loading?'处理中...':isRegister?'注册':'登录'}</button>
    </form>
    <div className="mt-6 text-center"><button onClick={()=>{setIsRegister(!isRegister);setError('')}} className="text-sm text-neon-purple-400 hover:text-sakura-500 transition-colors">{isRegister?'已有账号？去登录 →':'没有账号？去注册 →'}</button></div>
    <p className="mt-4 text-xs text-text-muted text-center">💡 数据存储在浏览器本地</p>
  </motion.div></div>;
}
