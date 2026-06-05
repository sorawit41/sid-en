import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, Eye, Trash2, Clock, History as HistoryIcon, Filter } from 'lucide-react';

export default function History() {
  const { data, setData, t } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterFact, setFilterFact] = useState('');

  const factories = [...new Set(data.equipments.map(e => e.factory).filter(Boolean))];

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this inspection?')) {
      setData({
        ...data,
        inspections: data.inspections.filter(i => i.id !== id)
      });
    }
  };

  const inspections = useMemo(() => {
    return data.inspections.filter(i => {
      if (filterCat && i.catId !== filterCat) return false;
      const eq = data.equipments.find(e => e.id === i.eqId);
      if (filterFact && (!eq || eq.factory !== filterFact)) return false;
      if (search) {
        const q = search.toLowerCase();
        return JSON.stringify(i).toLowerCase().includes(q) || (eq && JSON.stringify(eq).toLowerCase().includes(q));
      }
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [data.inspections, data.equipments, search, filterCat, filterFact]);

  return (
    <div className="animate-slide-up space-y-6 pb-12 select-none">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-text flex items-center gap-2">
          <span className="w-1.5 h-4 bg-accent rounded-full animate-pulse" /> {t('inspections_history')}
        </h2>
        <p className="text-xs md:text-sm text-muted mt-1">{t('log_inspections')}</p>
      </div>

      {/* Filters row control */}
      <div className="flex gap-3 flex-wrap items-center bg-surface/70 border border-border/60 p-4 rounded-2xl backdrop-blur-sm shadow-sm">
        <div className="flex-1 min-w-[240px] relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input 
            type="text" 
            placeholder={t('search_records')} 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full py-2.5 px-4 pl-10 bg-bg/50 border border-border rounded-xl text-xs font-semibold transition-all focus:border-accent focus:ring-4 focus:ring-accent/5 focus:bg-surface outline-none"
          />
        </div>
        
        <div className="flex gap-2.5 shrink-0 w-full sm:w-auto">
          <div className="flex items-center gap-1">
            <Filter size={14} className="text-dim mr-1 hidden sm:block" />
            <select 
              className="py-2.5 px-4 bg-bg/50 border border-border rounded-xl text-xs font-bold outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all cursor-pointer min-w-[140px]"
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
            >
              <option value="">{t('all_categories')}</option>
              {data.cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <select 
              className="py-2.5 px-4 bg-bg/50 border border-border rounded-xl text-xs font-bold outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all cursor-pointer min-w-[140px]"
              value={filterFact}
              onChange={e => setFilterFact(e.target.value)}
            >
              <option value="">{t('all_factories')}</option>
              {factories.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* History table log */}
      <div className="bg-surface border border-border/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] text-muted uppercase tracking-wider bg-card2/50 border-b border-border/40">
              <tr>
                <th className="px-5 py-3.5 font-bold">{t('date')}</th>
                <th className="px-5 py-3.5 font-bold">{t('equipment')}</th>
                <th className="px-5 py-3.5 font-bold">{t('category')}</th>
                <th className="px-5 py-3.5 font-bold">{t('factory')}</th>
                <th className="px-5 py-3.5 font-bold">{t('summary')}</th>
                <th className="px-5 py-3.5 font-bold text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {inspections.length > 0 ? inspections.map(i => {
                const eq = data.equipments.find(e => e.id === i.eqId);
                const cat = data.cats.find(c => c.id === i.catId);
                const dt = i.date ? new Date(i.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';
                
                return (
                  <tr key={i.id} className="hover:bg-card2/25 transition-colors">
                    <td className="px-5 py-4 text-muted whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]"><Clock size={13} className="text-dim"/> {dt}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-text">{eq?.tag || '—'}</div>
                      <div className="text-[10px] text-muted font-medium mt-0.5">{[eq?.brand, eq?.model].filter(Boolean).join('/') || ''}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-accent/10 text-accent uppercase tracking-wide border border-accent/10">
                        {cat?.name || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted font-medium">{eq?.factory || '—'}</td>
                    <td className="px-5 py-4 text-muted max-w-[240px] truncate" title={i.summary}>{i.summary || '—'}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="p-2 text-muted hover:text-accent rounded-lg hover:bg-accent/15 transition-all cursor-pointer border-none bg-transparent active:scale-90" title={t('view_details')}><Eye size={15} /></button>
                        <button onClick={() => handleDelete(i.id)} className="p-2 text-bad hover:text-bad rounded-lg hover:bg-red-500/10 transition-all cursor-pointer border-none bg-transparent active:scale-90" title={t('delete_inspection')}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-muted">
                    <HistoryIcon size={36} className="mx-auto mb-3 opacity-20" />
                    <p className="text-xs font-bold text-muted">{t('no_inspections')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
