import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { User, Mail, Shield, Key, Check } from 'lucide-react';

export default function AccountSettings() {
  const { user, login, t } = useContext(AppContext);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    role: user?.role || '',
    email: user?.email || 'admin@enginspect.com'
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    login({ ...user, ...profileData });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleUpdatePassword = () => {
    alert("Password updated successfully!");
  };

  return (
    <div className="animate-slide-up space-y-6 pb-12 select-none">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-text flex items-center gap-2">
          <span className="w-1.5 h-4 bg-accent rounded-full animate-pulse" /> {t('account_settings')}
        </h2>
        <p className="text-xs md:text-sm text-muted mt-1">{t('account_desc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-surface border border-border/80 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm relative overflow-hidden group">
            {/* Soft decorative glow background */}
            <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-accent/5 blur-xl pointer-events-none group-hover:scale-150 transition-all duration-700" />
            
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-accent to-indigo-500 text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-accent/15 select-none transition-transform group-hover:scale-105 duration-300">
              {user?.initials || user?.name?.[0] || 'U'}
            </div>
            <h3 className="text-base font-bold text-text">{user?.name || 'Guest User'}</h3>
            <p className="text-xs font-semibold text-muted mt-1">{user?.role || 'Administrator'}</p>
            
            <button className="mt-5 px-4 py-2 bg-card2/80 hover:bg-card2 text-text text-xs font-semibold rounded-xl transition-all w-full border border-border/40 active:scale-95 cursor-pointer">
              {t('change_avatar')}
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface border border-border/80 rounded-2xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-text uppercase tracking-wider border-b border-border/50 pb-3 mb-5 flex items-center gap-2">
              <User size={15} className="text-accent" /> {t('personal_info')}
            </h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">{t('full_name')}</label>
                  <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} className="w-full p-2.5 bg-bg/50 border border-border rounded-xl text-xs font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 focus:bg-surface transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">{t('role_position')}</label>
                  <input type="text" name="role" value={profileData.role} onChange={handleProfileChange} className="w-full p-2.5 bg-bg/50 border border-border rounded-xl text-xs font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 focus:bg-surface transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">{t('email')}</label>
                <div className="relative">
                  <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className="w-full p-2.5 pl-10 bg-bg/50 border border-border rounded-xl text-xs font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 focus:bg-surface transition-all font-mono" />
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" />
                </div>
              </div>
              <div className="pt-2 flex items-center gap-3">
                <button onClick={handleSaveProfile} className="px-5 py-2.5 bg-accent hover:bg-accentHover text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-accent/15 flex items-center gap-2 active:scale-95 cursor-pointer border-none">
                  {t('save_changes')}
                </button>
                {isSaved && (
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 animate-fade-in">
                    <Check size={14} /> {t('profile_updated')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border/80 rounded-2xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-text uppercase tracking-wider border-b border-border/50 pb-3 mb-5 flex items-center gap-2">
              <Shield size={15} className="text-accent" /> {t('security_credentials')}
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">{t('current_password')}</label>
                <div className="relative">
                  <input type="password" placeholder="••••••••" className="w-full p-2.5 pl-10 bg-bg/50 border border-border rounded-xl text-xs font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 focus:bg-surface transition-all" />
                  <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">{t('new_password')}</label>
                  <input type="password" placeholder="Enter new password" className="w-full p-2.5 bg-bg/50 border border-border rounded-xl text-xs font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 focus:bg-surface transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">{t('confirm_password')}</label>
                  <input type="password" placeholder="Confirm new password" className="w-full p-2.5 bg-bg/50 border border-border rounded-xl text-xs font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 focus:bg-surface transition-all" />
                </div>
              </div>
              
              <div className="pt-2">
                <button onClick={handleUpdatePassword} className="px-5 py-2.5 bg-card2/80 hover:bg-card2 text-text font-semibold text-xs uppercase tracking-wider rounded-xl border border-border/40 transition-all active:scale-95 cursor-pointer">
                  {t('update_password')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
