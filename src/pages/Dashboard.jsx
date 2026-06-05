import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Eye, Trash2, Settings, Activity, ArrowRight, Zap, Target, Factory as FactoryIcon, Clock, Snowflake, Wind, Droplets, Flame, Tag, MapPin, AlignLeft } from 'lucide-react';
import { ModalWrapper } from '../components/Modals';

const iconMap = {
  Snowflake: <Snowflake size={14} />,
  Wind: <Wind size={14} />,
  Droplets: <Droplets size={14} />,
  Flame: <Flame size={14} />,
  Factory: <FactoryIcon size={14} />,
  Zap: <Zap size={14} />,
};

const COLORS = [
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#f97316', // Orange
  '#eab308', // Yellow
  '#10b981', // Emerald
  '#ec4899', // Pink
];

export default function Dashboard() {
  const { user, data, setData, addFactory, t, lang } = useContext(AppContext);
  const navigate = useNavigate();
  const [isAddFactoryOpen, setIsAddFactoryOpen] = useState(false);
  const [newFactory, setNewFactory] = useState({ name: '', location: '', desc: '' });
  
  const dtxt = new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
  
  const eqCount = data.equipments.length;
  const insCount = data.inspections.length;
  const measCount = data.measures.length;
  const totalKWh = data.measures.reduce((a, m) => a + (m.kWhYear || 0), 0);
  
  const factories = data.factories || [];
  const factoryCount = factories.length;

  const recentInspections = [...data.inspections].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  const handleDeleteInspection = (id) => {
    if (confirm('Are you sure you want to delete this inspection?')) {
      setData({ ...data, inspections: data.inspections.filter(i => i.id !== id) });
    }
  };

  const handleSaveFactory = (e) => {
    e.preventDefault();
    if (!newFactory.name.trim()) return alert('Factory Name is required');
    addFactory(newFactory);
    setNewFactory({ name: '', location: '', desc: '' });
    setIsAddFactoryOpen(false);
  };

  return (
    <div className="animate-slide-up space-y-8 pb-12 select-none">
      {/* Greetings Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-xl border border-border shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-text flex items-center gap-2">
            {t('hello')}, {user?.name?.split(' ')[0] || 'User'} <span className="animate-bounce">👋</span>
          </h2>
          <p className="text-xs md:text-sm text-muted mt-1">{t('system_desc')}</p>
        </div>
        <div className="text-xs font-semibold text-muted bg-surface border border-border/80 px-4 py-2 rounded-xl shadow-sm self-start md:self-auto font-mono">
          📅 {t('overview_for')} {dtxt}
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title={t('stat_equipments')} value={eqCount} icon={<Settings size={18} />} color="indigo" />
        <StatCard title={t('stat_inspections')} value={insCount} icon={<Activity size={18} />} color="blue" />
        <StatCard title={t('stat_measures')} value={measCount} icon={<Target size={18} />} color="violet" />
        <StatCard title={t('stat_potential')} value={(totalKWh/1000).toFixed(0)} icon={<Zap size={18} />} color="amber" />
        <StatCard title={t('stat_factories')} value={factoryCount} icon={<FactoryIcon size={18} />} color="emerald" />
      </div>

      {/* Factory Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-text">
            {t('factories_overview')}
          </h3>
          <button 
            onClick={() => setIsAddFactoryOpen(true)}
            className="py-1.5 px-3 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded shadow-sm cursor-pointer border-none flex items-center gap-1 active:scale-95 transition-all"
          >
            <Plus size={14} /> {t('add_factory')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {factories.length > 0 ? factories.map((fact, idx) => {
            const factoryName = fact.name;
            const fEqs = data.equipments.filter(e => e.factory === factoryName);
            const fEqIds = fEqs.map(e => e.id);
            const fIns = data.inspections.filter(i => fEqIds.includes(i.eqId));
            const fMeas = data.measures.filter(m => fEqIds.includes(m.eqId));
            
            const fKWh = fMeas.reduce((a, m) => a + (m.kWhYear || 0), 0);

            // Find unique categories for this factory
            const fCatIds = [...new Set(fEqs.map(e => e.catId))];
            const fCats = data.cats.filter(c => fCatIds.includes(c.id));
            
            const color = COLORS[idx % COLORS.length];
            
            return (
              <Link 
                key={factoryName} 
                to={`/equip?factory=${encodeURIComponent(factoryName)}`} 
                className="block bg-surface border border-border rounded-xl p-5 hover-lift relative overflow-hidden group cursor-pointer hover:border-accent/40"
              >
                <div className="flex justify-between items-start mb-4 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10 text-accent border border-accent/20 shrink-0 shadow-sm">
                      <FactoryIcon size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text text-[15px] line-clamp-1 group-hover:text-accent transition-colors" title={factoryName}>{factoryName}</h4>
                      <p className="text-xs text-muted font-medium mt-0.5">{fEqs.length} {t('stat_equipments')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-card2 border border-border/40 rounded-xl">
                  <div className="text-center">
                    <div className="text-[9px] text-muted font-bold uppercase tracking-wider mb-1">{t('stat_inspections')}</div>
                    <div className="font-mono text-xs font-bold text-text">{fIns.length}</div>
                  </div>
                  <div className="text-center border-l border-r border-border/50">
                    <div className="text-[9px] text-muted font-bold uppercase tracking-wider mb-1">{t('stat_measures')}</div>
                    <div className="font-mono text-xs font-bold text-accent">{fMeas.length}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-muted font-bold uppercase tracking-wider mb-1">{t('savings_mwh')}</div>
                    <div className="font-mono text-xs font-bold text-emerald-500">{(fKWh/1000).toFixed(0)}</div>
                  </div>
                </div>

                {fCats.length > 0 ? (
                  <div className="pt-1">
                    <div className="text-[9px] font-bold text-muted uppercase tracking-wider mb-2">{t('categories_present')}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {fCats.map(c => (
                        <span key={c.id} className="flex items-center gap-1 px-2 py-0.5 bg-card2 border border-border/40 rounded-lg text-[10px] font-semibold text-text" title={c.name}>
                          {iconMap[c.icon] || <Settings size={10} />} {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-muted italic pt-1">
                    {lang === 'th' ? 'ไม่มีประวัติเครื่องจักร' : 'No equipments registered'}
                  </div>
                )}
              </Link>
            );
          }) : (
            <div className="col-span-full p-12 border-2 border-dashed border-border rounded-2xl text-center text-muted">
              <FactoryIcon size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-semibold">{t('no_factories')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Inspections */}
      <div>
        <div className="flex items-center justify-between mb-4 mt-4">
          <h3 className="text-base font-bold text-text">
            {t('recent_inspections')}
          </h3>
          <Link to="/history" className="text-xs font-bold text-accent hover:text-accentHover flex items-center gap-1">
            {t('view_all')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="bg-surface border border-border/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[10px] text-muted uppercase tracking-wider bg-card2/50 border-b border-border/40">
                <tr>
                  <th className="px-5 py-3.5 font-bold">{t('date')}</th>
                  <th className="px-5 py-3.5 font-bold">{t('equipment')}</th>
                  <th className="px-5 py-3.5 font-bold">{t('factory')}</th>
                  <th className="px-5 py-3.5 font-bold">{t('category')}</th>
                  <th className="px-5 py-3.5 font-bold">{t('summary')}</th>
                  <th className="px-5 py-3.5 font-bold text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {recentInspections.length > 0 ? recentInspections.map(i => {
                  const eq = data.equipments.find(e => e.id === i.eqId);
                  const cat = data.cats.find(c => c.id === i.catId);
                  const dt = i.date ? new Date(i.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';
                  
                  return (
                    <tr key={i.id} className="hover:bg-card2/35 transition-colors">
                      <td className="px-5 py-4 text-muted whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]"><Clock size={12} className="text-dim"/> {dt}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-text">{eq?.tag || '—'}</div>
                        <div className="text-[10px] text-muted font-medium mt-0.5">{[eq?.brand, eq?.model].filter(Boolean).join('/') || ''}</div>
                      </td>
                      <td className="px-5 py-4 text-muted font-medium">
                        {eq?.factory || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-accent/10 text-accent border border-accent/20">
                          {cat?.name || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted max-w-[220px] truncate" title={i.summary}>{i.summary || '—'}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => navigate('/history')} className="p-2 text-muted hover:text-accent rounded-lg hover:bg-accent/10 transition-all cursor-pointer border-none bg-transparent active:scale-90" title={t('view_details')}><Eye size={15} /></button>
                          <button onClick={() => handleDeleteInspection(i.id)} className="p-2 text-muted hover:text-bad rounded-lg hover:bg-red-500/10 transition-all cursor-pointer border-none bg-transparent active:scale-90" title={t('delete_equipment')}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center text-muted">
                      <Activity size={32} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-semibold">{t('no_inspections')}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Factory Modal */}
      <ModalWrapper 
        isOpen={isAddFactoryOpen} 
        onClose={() => setIsAddFactoryOpen(false)} 
        title={t('add_factory')}
        maxWidth="500px"
      >
        <form onSubmit={handleSaveFactory} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">{t('factory_name')} *</label>
            <div className="relative">
              <input 
                required 
                type="text" 
                value={newFactory.name} 
                onChange={e => setNewFactory({ ...newFactory, name: e.target.value })} 
                placeholder="e.g. โรงงานอยุธยา" 
                className="w-full p-2.5 pl-10 bg-bg/50 border border-border rounded-xl text-xs font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 focus:bg-surface transition-all"
              />
              <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">{t('location')}</label>
            <div className="relative">
              <input 
                type="text" 
                value={newFactory.location} 
                onChange={e => setNewFactory({ ...newFactory, location: e.target.value })} 
                placeholder="e.g. นิคมอุตสาหกรรมโรจนะ" 
                className="w-full p-2.5 pl-10 bg-bg/50 border border-border rounded-xl text-xs font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 focus:bg-surface transition-all"
              />
              <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">{t('description')}</label>
            <div className="relative">
              <textarea 
                value={newFactory.desc} 
                onChange={e => setNewFactory({ ...newFactory, desc: e.target.value })} 
                placeholder="Short description..." 
                className="w-full p-2.5 pl-10 bg-bg/50 border border-border rounded-xl text-xs font-semibold outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 focus:bg-surface transition-all min-h-[80px]"
              />
              <AlignLeft size={14} className="absolute left-3.5 top-5 text-dim" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <button 
              type="button" 
              onClick={() => setIsAddFactoryOpen(false)} 
              className="px-4 py-2 rounded border border-border text-text font-semibold text-xs hover:bg-card2 transition-colors cursor-pointer active:scale-95"
            >
              {t('cancel')}
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-accent text-white font-semibold text-xs rounded hover:bg-accentHover transition-all cursor-pointer active:scale-95 border-none"
            >
              {t('add_factory')}
            </button>
          </div>
        </form>
      </ModalWrapper>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const cMap = {
    indigo: { text: 'text-accent', bg: 'bg-accent/10 border-accent/20' },
    blue: { text: 'text-accent', bg: 'bg-accent/10 border-accent/20' },
    violet: { text: 'text-accent', bg: 'bg-accent/10 border-accent/20' },
    amber: { text: 'text-warn', bg: 'bg-warn/10 border-warn/25' },
    emerald: { text: 'text-good', bg: 'bg-good/10 border-good/25' },
  };

  const style = cMap[color] || cMap.indigo;

  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between hover-lift">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-muted uppercase tracking-wider">{title}</span>
        <div className={`p-1.5 rounded-lg border ${style.bg} ${style.text} shrink-0`}>
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold text-text font-mono tracking-tight">{value}</div>
      </div>
    </div>
  );
}
