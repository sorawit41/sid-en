import React, { useState, useEffect, useContext } from 'react';
import { ModalWrapper } from './Modals';
import { Zap, Target, ArrowRight, ArrowLeft, Check, Activity, Settings, Lightbulb } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const MEASURES = [
  { id: 'leak', name: 'ลดลมรั่ว', nameEn: 'Reduce Air Leaks', desc: 'ซ่อมแซม/เปลี่ยนข้อต่อ ท่อ และวาล์วที่รั่ว', descEn: 'Repair or replace leaking pipe couplings, hoses and valves', icon: 'Settings' },
  { id: 'replace', name: 'เปลี่ยนเครื่องใหม่', nameEn: 'Replace with High-Efficiency Compressor', desc: 'เปลี่ยนทดแทนด้วยรุ่นประสิทธิภาพสูง', descEn: 'Replace legacy compressor with high efficiency units', icon: 'Zap' },
  { id: 'inlet_temp', name: 'ลดอุณหภูมิขาเข้า', nameEn: 'Optimize Inlet Air Temp', desc: 'ปรับระบบระบายความร้อน หรือท่อดูดอากาศ', descEn: 'Improve cooling ventilation or draw air from cooler source', icon: 'Activity' },
  { id: 'pressure', name: 'ลดความดันใช้งาน', nameEn: 'Reduce System Operating Pressure', desc: 'ปรับลดความดันระบบลงให้เหมาะสม', descEn: 'Reduce discharge pressure setpoint to match demand requirements', icon: 'Target' },
  { id: 'vsd', name: 'ติดตั้ง VSD', nameEn: 'Install VSD Controller', desc: 'ควบคุมความเร็วรอบตามภาระงานจริง', descEn: 'Control motor frequency with variable speed drive matching actual load', icon: 'Zap' }
];

const iconMap = {
  Settings: <Settings size={24} />,
  Zap: <Zap size={24} />,
  Activity: <Activity size={24} />,
  Target: <Target size={24} />
};

export default function CompressorCalcModal({ isOpen, onClose, equipment }) {
  const { data, setData, t, lang } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [calcResult, setCalcResult] = useState(null);
  
  // Step 1: Input State
  const [params, setParams] = useState({
    processType: 'isentropic',
    p1: 101.325, p2: 700, t1: 30, gamma: 1.4, n_poly: 1.3, molWt: 28.97,
    eta_is: 80, flowRate: 10, stages: 1, pMotor: 55, etaMotor: 95, etaMech: 98,
    vDisplace: 5, rpm: 1450
  });

  // Step 2-4: Measure State
  const [selectedMeasure, setSelectedMeasure] = useState(null);
  const [measureData, setMeasureData] = useState({
    pctReduction: 10,
    opHours: 8000,
    elecRate: 4.50,
    investCost: 0,
    remark: ''
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCalcResult(null);
      setSelectedMeasure(null);
      if (equipment) {
        setParams(p => ({
          ...p,
          pMotor: parseFloat(equipment.kw || equipment.capacity || p.pMotor) || p.pMotor
        }));
      }
    }
  }, [isOpen, equipment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams(p => ({ ...p, [name]: isNaN(parseFloat(value)) ? value : parseFloat(value) }));
  };

  const calculate = () => {
    const R_u = 8314;
    const P1 = params.p1 * 1000;
    const P2 = params.p2 * 1000;
    const T1 = params.t1 + 273.15;
    const gamma = params.gamma;
    const n = params.n_poly;
    const M = params.molWt;
    const eta_is = params.eta_is / 100;
    const Q_m3m = params.flowRate;
    const P_mot = params.pMotor;
    const etaMot = params.etaMotor / 100;
    const etaMch = params.etaMech / 100;
    
    if (P2 <= P1) return alert(lang === 'th' ? 'แรงดันจ่าย P2 ต้องมากกว่าแรงดันทางเข้า P1' : 'P2 must be greater than P1');

    const R = R_u / M;
    const rho1 = P1 / (R * T1);
    const Q_s = Q_m3m / 60;
    const mdot = rho1 * Q_s;
    const pr = P2 / P1;

    let w_ideal, T2_ideal;
    if (params.processType === 'isentropic') {
      const exp = (gamma - 1) / gamma;
      T2_ideal = T1 * Math.pow(pr, exp);
      const Cp = gamma * R / (gamma - 1);
      w_ideal = Cp * (T2_ideal - T1);
    } else if (params.processType === 'polytropic') {
      const exp = (n - 1) / n;
      T2_ideal = T1 * Math.pow(pr, exp);
      const Cn = n * R / (n - 1);
      w_ideal = Cn * (T2_ideal - T1);
    } else {
      T2_ideal = T1;
      w_ideal = R * T1 * Math.log(pr);
    }

    const exp_is = (gamma - 1) / gamma;
    const T2_is_ideal = T1 * Math.pow(pr, exp_is);
    const T2_actual = T1 + (T2_is_ideal - T1) / eta_is;

    const P_ideal_kW = mdot * w_ideal / 1000;
    const P_shaft_kW = P_mot * etaMot * etaMch;
    const overall_eta = (P_ideal_kW / P_shaft_kW) * 100;
    const spec_power = P_shaft_kW / Q_m3m;

    const Q_theoretical = (params.vDisplace * 0.001 * params.rpm);
    const eta_vol = Q_theoretical > 0 ? (Q_m3m / Q_theoretical) * 100 : null;

    setCalcResult({
      overall_eta, P_ideal_kW, P_shaft_kW, spec_power, eta_vol,
      T2_actual: T2_actual - 273.15, mdot, Q_m3m
    });
    setStep(2);
  };

  const saveMeasure = () => {
    if (!calcResult || !selectedMeasure) return;
    
    const pShaft = calcResult.P_shaft_kW;
    const kWhSave = pShaft * (measureData.pctReduction / 100) * measureData.opHours;
    const bahtSave = kWhSave * measureData.elecRate;
    const payback = measureData.investCost > 0 && bahtSave > 0 ? (measureData.investCost / bahtSave) : null;

    const newMeasure = {
      id: 'm_' + Date.now(),
      eqId: equipment?.id,
      eqTag: equipment?.tag,
      catId: equipment?.catId,
      factory: equipment?.factory,
      date: new Date().toISOString(),
      measName: lang === 'th' ? selectedMeasure.name : selectedMeasure.nameEn,
      pct: measureData.pctReduction,
      opHours: measureData.opHours,
      kWhYear: kWhSave,
      bahtYear: bahtSave,
      invest: measureData.investCost,
      payback: payback,
      energyType: 'elec',
      ghgTon: (kWhSave * 0.4999) / 1000
    };

    setData({
      ...data,
      measures: [...data.measures, newMeasure]
    });
    
    onClose();
  };

  const handleMeasureDataChange = (e) => {
    setMeasureData(p => ({ ...p, [e.target.name]: parseFloat(e.target.value) || e.target.value }));
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={`${t('compressor_calculator')} - ${equipment?.tag || 'New'}`} maxWidth="800px">
      
      {/* Steps Indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[
          {n: 1, label: t('parameters')},
          {n: 2, label: t('results')},
          {n: 3, label: t('measures')},
          {n: 4, label: t('save')}
        ].map(s => (
          <div key={s.n} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= s.n ? 'bg-accent text-white' : 'bg-slate-100 text-slate-400'}`}>
              {step > s.n ? <Check size={16} /> : s.n}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step >= s.n ? 'text-text' : 'text-slate-400'}`}>{s.label}</span>
            {s.n < 4 && <div className={`w-8 h-px ${step > s.n ? 'bg-accent' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <div className="min-h-[400px]">
        
        {/* Step 1: Input Parameters */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-text uppercase tracking-wider mb-2 border-b border-border pb-2">Conditions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Process Type</label>
                    <select name="processType" value={params.processType} onChange={handleChange} className="w-full p-2 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent">
                      <option value="isentropic">Isentropic</option>
                      <option value="polytropic">Polytropic</option>
                      <option value="isothermal">Isothermal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Gas Type</label>
                    <select className="w-full p-2 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent">
                      <option value="air">Air</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">P1 (kPa)</label>
                    <input type="number" name="p1" value={params.p1} onChange={handleChange} className="w-full p-2 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">P2 (kPa)</label>
                    <input type="number" name="p2" value={params.p2} onChange={handleChange} className="w-full p-2 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">T1 (°C)</label>
                    <input type="number" name="t1" value={params.t1} onChange={handleChange} className="w-full p-2 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Eta Isentropic (%)</label>
                    <input type="number" name="eta_is" value={params.eta_is} onChange={handleChange} className="w-full p-2 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-mono" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-text uppercase tracking-wider mb-2 border-b border-border pb-2">Flow & Power</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Flow (m³/min)</label>
                    <input type="number" name="flowRate" value={params.flowRate} onChange={handleChange} className="w-full p-2 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Motor Power (kW)</label>
                    <input type="number" name="pMotor" value={params.pMotor} onChange={handleChange} className="w-full p-2 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Eta Motor (%)</label>
                    <input type="number" name="etaMotor" value={params.etaMotor} onChange={handleChange} className="w-full p-2 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Eta Mech (%)</label>
                    <input type="number" name="etaMech" value={params.etaMech} onChange={handleChange} className="w-full p-2 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Vol. Displace (L/rev)</label>
                    <input type="number" name="vDisplace" value={params.vDisplace} onChange={handleChange} className="w-full p-2 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">RPM</label>
                    <input type="number" name="rpm" value={params.rpm} onChange={handleChange} className="w-full p-2 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent font-mono" />
                  </div>
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

        {/* Step 2: Results */}
        {step === 2 && calcResult && (
          <div className="animate-fade-in space-y-6">
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="col-span-2 md:col-span-3 mb-2">
                <ResultBox label="Overall Efficiency" val={calcResult.overall_eta} unit="%" color={calcResult.overall_eta > 80 ? 'text-emerald-600' : 'text-amber-600'} highlight large />
              </div>
              <ResultBox label="Specific Power" val={calcResult.spec_power} unit="kW/(m³/min)" color={calcResult.spec_power < 6 ? 'text-emerald-600' : 'text-amber-600'} />
              <ResultBox label="Discharge Temp (T2)" val={calcResult.T2_actual} unit="°C" />
              <ResultBox label="Ideal Power" val={calcResult.P_ideal_kW} unit="kW" />
              <ResultBox label="Shaft Power" val={calcResult.P_shaft_kW} unit="kW" />
              <ResultBox label="Volumetric Eff." val={calcResult.eta_vol || 0} unit="%" />
            </div>

            <div className={`p-4 rounded-lg flex items-start gap-3 border ${calcResult.overall_eta > 80 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
              <Lightbulb size={20} className="shrink-0 mt-0.5" />
              <div className="text-sm">
                {calcResult.overall_eta > 80 
                  ? (lang === 'th' ? "ประสิทธิภาพอยู่ในเกณฑ์ดีเยี่ยม รักษาระดับการบำรุงรักษาตามปกติ" : "Efficiency is in excellent range. Maintain routine scheduling.") 
                  : (lang === 'th' ? "ประสิทธิภาพค่อนข้างต่ำ ควรพิจารณามาตรการซ่อมบำรุง หรือลดแรงดันระบบ" : "Efficiency is relatively low. Consider leak audits or reducing discharge pressure.")}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-border mt-6">
              <button onClick={() => setStep(1)} className="px-5 py-2.5 bg-white border border-border text-text font-medium rounded-md hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer">
                <ArrowLeft size={16} /> {t('parameters')}
              </button>
              <button onClick={() => setStep(3)} className="px-6 py-2.5 bg-accent text-white font-medium rounded-md hover:bg-accentHover transition-colors flex items-center gap-2 shadow-sm border-none cursor-pointer">
                {t('measures')} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select Measures */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-base font-bold text-text mb-4">{t('select_measure')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {MEASURES.map(m => (
                <div 
                  key={m.id} 
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedMeasure?.id === m.id ? 'border-accent bg-accent/5' : 'border-border bg-surface hover:border-accent/50 hover:shadow-sm'}`}
                  onClick={() => setSelectedMeasure(m)}
                >
                  <div className="flex items-center gap-3 mb-2 text-slate-700">
                    {iconMap[m.icon]}
                    <span className="font-semibold text-text">{lang === 'th' ? m.name : m.nameEn}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{lang === 'th' ? m.desc : m.descEn}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-border mt-6">
              <button onClick={() => setStep(2)} className="px-5 py-2.5 bg-white border border-border text-text font-medium rounded-md hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer">
                <ArrowLeft size={16} /> {t('results')}
              </button>
              <button 
                onClick={() => setStep(4)} 
                disabled={!selectedMeasure}
                className="px-6 py-2.5 bg-accent text-white font-medium rounded-md hover:bg-accentHover transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 border-none cursor-pointer"
              >
                {t('save')} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Estimation */}
        {step === 4 && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-base font-bold text-text mb-4 border-b border-border pb-2">{t('potential_assessment')}: {lang === 'th' ? selectedMeasure?.name : selectedMeasure?.nameEn}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">{t('energy_reduction')}</label>
                <input type="number" name="pctReduction" value={measureData.pctReduction} onChange={handleMeasureDataChange} className="w-full p-2.5 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">{t('operating_hours')}</label>
                <input type="number" name="opHours" value={measureData.opHours} onChange={handleMeasureDataChange} className="w-full p-2.5 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">{t('electricity_rate')}</label>
                <input type="number" name="elecRate" value={measureData.elecRate} onChange={handleMeasureDataChange} className="w-full p-2.5 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">{t('investment_cost')}</label>
                <input type="number" name="investCost" value={measureData.investCost} onChange={handleMeasureDataChange} className="w-full p-2.5 bg-bg border border-border rounded-md text-sm outline-none focus:border-accent" />
              </div>
            </div>

            {calcResult && (
              <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl mt-4 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <div className="text-xs text-emerald-800 uppercase tracking-wide font-medium mb-1">{t('estimated_savings')}</div>
                  <div className="text-2xl font-bold text-emerald-600 font-mono">
                    {((calcResult.P_shaft_kW * (measureData.pctReduction/100) * measureData.opHours) || 0).toLocaleString(undefined, {maximumFractionDigits:0})} <span className="text-sm text-emerald-700/80 font-sans">{t('kwh_yr')}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-emerald-800 uppercase tracking-wide font-medium mb-1">{t('carbon_reduction')}</div>
                  <div className="text-2xl font-bold text-emerald-600 font-mono">
                    {(((calcResult.P_shaft_kW * (measureData.pctReduction/100) * measureData.opHours) * 0.4999) / 1000).toLocaleString(undefined, {maximumFractionDigits:1})} <span className="text-sm text-emerald-700/80 font-sans">tCO₂e/yr</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-emerald-800 uppercase tracking-wide font-medium mb-1">{t('cost_savings')}</div>
                  <div className="text-2xl font-bold text-emerald-600 font-mono">
                    {((calcResult.P_shaft_kW * (measureData.pctReduction/100) * measureData.opHours * measureData.elecRate) || 0).toLocaleString(undefined, {maximumFractionDigits:0})} <span className="text-sm text-emerald-700/80 font-sans">{t('thb_yr')}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-border mt-6">
              <button onClick={() => setStep(3)} className="px-5 py-2.5 bg-white border border-border text-text font-medium rounded-md hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer">
                <ArrowLeft size={16} /> {t('measures')}
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

function ResultBox({ label, val, unit, color = "text-text", highlight, large }) {
  return (
    <div className={`p-4 border rounded-xl ${highlight ? 'bg-accent/5 border-accent/40 shadow-sm' : 'bg-surface border-border'} flex flex-col justify-center`}>
      <div className={`font-medium text-muted uppercase tracking-wider mb-1 ${large ? 'text-xs text-accent' : 'text-[11px]'}`}>{label}</div>
      <div className={`font-bold font-mono ${color} ${large ? 'text-4xl' : 'text-2xl'}`}>
        {typeof val === 'number' ? val.toFixed(1) : val}
      </div>
      <div className="text-[10px] text-muted mt-1">{unit}</div>
    </div>
  );
}
