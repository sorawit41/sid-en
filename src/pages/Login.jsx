import React, { useState, useContext } from 'react';
import { Eye, EyeOff, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

const USERS = [
  {email:'admin@example.com', pw:'admin1234', name:'สมชาย วิศวกร', role:'Administrator', initials:'S'},
  {email:'consult@example.com', pw:'consult1234', name:'วิภาพร ที่ปรึกษา', role:'Consultant', initials:'V'}
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  
  const { user, login, t } = useContext(AppContext);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    const u = USERS.find(u => u.email === email && u.pw === password);
    if (!u) {
      setError(t('invalid_login'));
      return;
    }
    setError('');
    login(u);
  };

  const autofillUser = (u) => {
    setEmail(u.email);
    setPassword(u.pw);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-5 bg-bg relative overflow-hidden bg-grid-pattern">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-accent/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md bg-surface/85 backdrop-blur-xl border border-border/80 rounded-2xl p-8 md:p-10 shadow-2xl animate-fade-in relative z-10 hover:border-accent/20 transition-colors duration-500">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 bg-gradient-to-tr from-accent to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-accent/25 hover:rotate-[360deg] transition-transform duration-700">
            <ShieldCheck size={32} strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text">{t('welcome_title')}</h1>
          <p className="text-sm text-muted mt-2">{t('welcome_sub')}</p>
        </div>

        {/* Demo Access Helpers */}
        <div className="p-4 rounded-xl text-xs text-muted mb-6 bg-card2 border border-border/50 leading-relaxed">
          <div className="font-semibold text-text mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            {t('demo_access')}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {USERS.map((u, i) => (
              <button
                key={i}
                type="button"
                onClick={() => autofillUser(u)}
                className="p-2 text-left bg-surface/80 border border-border rounded-lg hover:border-accent/40 hover:bg-accent/5 transition-all text-[11px] truncate flex flex-col justify-between active:scale-[0.97]"
              >
                <span className="font-bold text-text truncate">{u.name}</span>
                <span className="text-[10px] text-muted truncate">{u.role}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg text-sm mb-5 bg-red-500/10 border border-red-500/20 text-red-500 animate-slide-up">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">{t('email')}</label>
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com" 
                className="w-full p-3 px-4 pl-11 bg-bg/50 border border-border rounded-xl text-sm transition-all focus:border-accent focus:ring-4 focus:ring-accent/10 focus:bg-surface outline-none shadow-sm font-medium text-text placeholder:text-dim"
                required
              />
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">{t('password')}</label>
            <div className="relative">
              <input 
                type={showPw ? 'text' : 'password'} 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full p-3 px-4 pl-11 pr-11 bg-bg/50 border border-border rounded-xl text-sm transition-all focus:border-accent focus:ring-4 focus:ring-accent/10 focus:bg-surface outline-none shadow-sm font-medium text-text placeholder:text-dim"
                required
              />
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" />
              <button 
                type="button" 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dim hover:text-text transition-colors bg-transparent border-none p-0 cursor-pointer"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full p-3 mt-4 rounded-xl bg-gradient-to-r from-accent to-indigo-500 text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98] flex justify-center items-center gap-2 cursor-pointer border-none"
          >
            {t('signin')} <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
