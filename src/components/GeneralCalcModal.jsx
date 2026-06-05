import React, { useState, useEffect, useContext } from 'react';
import { ModalWrapper } from './Modals';
import { AppContext } from '../context/AppContext';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

export default function GeneralCalcModal({ isOpen, onClose, equipment }) {
  const { data, setData, t, lang } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [calcResult, setCalcResult] = useState(null);
  
  const [params, setParams] = useState({
    measureName: 'เปลี่ยนอุปกรณ์ประสิทธิภาพสูง',
    measureNameEn: 'Replace with High-Efficiency Equipment',
    currentKW: 10,
    proposedKW: 5,
    opHours: 8000,
    elecRate: 4.5,
    investCost: 50000
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCalcResult(null);
      if (equipment) {
        setParams(p => ({
          ...p,
          measureName: lang === 'th' ? 'ปรับปรุงประสิทธิภาพเครื่องจักร' : 'Improve Equipment Efficiency',
          measureNameEn: 'Improve Equipment Efficiency',
          currentKW: parseFloat(equipment.kw || equipment.capacity || p.currentKW) || p.currentKW
        }));
      }
    }
  }, [isOpen, equipment, lang]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams(p => ({ ...p, [name]: name === 'measureName' || name === 'measureNameEn' ? value : (isNaN(parseFloat(value)) || value === '' ? value : parseFloat(value)) }));
  };

  const calculate = () => {
    const { currentKW, proposedKW, opHours, elecRate, investCost } = params;
    
    if (proposedKW >= currentKW) return alert(lang === 'th' ? 'กำลังไฟฟ้าหลังปรับปรุงต้องน้อยกว่ากำลังไฟฟ้าปัจจุบัน' : 'Proposed kW must be less than Current kW for energy savings.');
    if (currentKW <= 0 || proposedKW <= 0 || opHours <= 0) return alert(lang === 'th' ? 'ค่าต้องมากกว่า 0' : 'Values must be greater than 0.');

    const kwSaved = currentKW - proposedKW;
    const kWhYear = kwSaved * opHours;
    const bahtYear = kWhYear * elecRate;
    const payback = investCost > 0 && bahtYear > 0 ? (investCost / bahtYear) : null;
    const ghgTon = (kWhYear * 0.4999) / 1000;

    setCalcResult({
      kwSaved, kWhYear, bahtYear, payback, ghgTon, investCost
    });
    setStep(2);
  };

  const saveMeasure = () => {
    if (!calcResult) return;
    
    const pct = ((params.currentKW - params.proposedKW) / params.currentKW) * 100;

    const newMeasure = {
      id: 'm_' + Date.now(),
      eqId: equipment?.id || null,
      eqTag: equipment?.tag || 'General',
      catId: equipment?.catId || 'other',
      factory: equipment?.factory || 'Unknown',
      date: new Date().toISOString(),
      measName: lang === 'th' ? params.measureName : params.measureNameEn,
      pct: pct,
      opHours: params.opHours,
      kWhYear: calcResult.kWhYear,
      bahtYear: calcResult.bahtYear,
      invest: calcResult.investCost,
      payback: calcResult.payback,
      energyType: 'elec',
      ghgTon: calcResult.ghgTon
    };

    setData({
      ...data,
      measures: [...data.measures, newMeasure]
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={`${t('general_calculator')} - ${equipment?.tag || 'New'}`} maxWidth="700px">
      
      <div className="flex items-center justify-center gap-4 mb-8">
        {[
          {n: 1, label: t('parameters')},
          {n: 2, label: lang === 'th' ? 'ผลลัพธ์ & บันทึก' : 'Results & Save'}
        ].map(s => (
          <div key={s.n} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= s.n ? 'bg-accent text-white' : 'bg-slate-100 text-slate-400'}`}>
              {step > s.n ? <Check size={16} /> : s.n}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step >= s.n ? 'text-text' : 'text-slate-400'}`}>{s.label}</span>
            {s.n < 2 && <div className={`w-8 h-px ${step > s.n ? 'bg-accent' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <div className="min-h-[300px]">
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-surface border border-border p-5 rounded-xl space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">{t('measure_name')}</label>
                <input type="text" name={lang === 'th' ? "measureName" : "measureNameEn"} value={lang === 'th' ? params.measureName : params.measureNameEn} onChange={handleChange} className="w-full p-2.5 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-semibold" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">{t('current_power')}</label>
                  <input type="number" name="currentKW" value={params.currentKW} onChange={handleChange} className="w-full p-2.5 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">{lang === 'th' ? "กำลังไฟฟ้าหลังปรับปรุง (kW)" : "Proposed Power (kW)"}</label>
                  <input type="number" name="proposedKW" value={params.proposedKW} onChange={handleChange} className="w-full p-2.5 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">{t('operating_hours')}</label>
                  <input type="number" name="opHours" value={params.opHours} onChange={handleChange} className="w-full p-2.5 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">{t('electricity_rate')}</label>
                  <input type="number" name="elecRate" value={params.elecRate} onChange={handleChange} className="w-full p-2.5 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-mono" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted mb-1">{t('investment_cost')}</label>
                  <input type="number" name="investCost" value={params.investCost} onChange={handleChange} className="w-full p-2.5 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-mono" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border mt-6">
              <button onClick={calculate} className="px-6 py-2.5 bg-accent text-white font-medium rounded-md hover:bg-accentHover transition-colors flex items-center gap-2 shadow-sm border-none cursor-pointer">
                {t('calculate')} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && calcResult && (
          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2 p-4 bg-surface border border-border rounded-xl">
                <div className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">{t('estimated_savings')}</div>
                <div className="text-3xl font-bold font-mono text-emerald-600">
                  {calcResult.kWhYear.toLocaleString(undefined, {maximumFractionDigits:0})} <span className="text-sm font-sans text-emerald-700/70">{t('kwh_yr')}</span>
                </div>
              </div>
              <div className="col-span-2 p-4 bg-surface border border-border rounded-xl">
                <div className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">{t('cost_savings')}</div>
                <div className="text-3xl font-bold font-mono text-indigo-600">
                  {calcResult.bahtYear.toLocaleString(undefined, {maximumFractionDigits:0})} <span className="text-sm font-sans text-indigo-700/70">{t('thb_yr')}</span>
                </div>
              </div>
              
              <div className="col-span-2 p-4 bg-surface border border-border rounded-xl">
                <div className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">{t('carbon_reduction')}</div>
                <div className="text-2xl font-bold font-mono text-emerald-600">
                  {calcResult.ghgTon.toLocaleString(undefined, {maximumFractionDigits:1})} <span className="text-sm font-sans text-muted">tCO₂e/yr</span>
                </div>
              </div>
              <div className="col-span-2 p-4 bg-surface border border-border rounded-xl">
                <div className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">{t('payback')}</div>
                <div className="text-2xl font-bold font-mono text-slate-700">
                  {calcResult.payback ? calcResult.payback.toFixed(1) : '—'} <span className="text-sm font-sans text-muted">{t('years')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-border mt-6">
              <button onClick={() => setStep(1)} className="px-5 py-2.5 bg-white border border-border text-text font-medium rounded-md hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer">
                <ArrowLeft size={16} /> {t('parameters')}
              </button>
              <button 
                onClick={saveMeasure} 
                className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm border-none cursor-pointer"
              >
                {t('save_measure')} <Check size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}
