import React, { useEffect } from 'react';

export default function FormHeader({ logo, setLogo, meta, setMeta }) {
  useEffect(() => {
    if (!meta.hdrDate) {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yy = now.getFullYear() + 543;
      setMeta(prev => ({ ...prev, hdrDate: `${dd}/${mm}/${yy}` }));
    }
  }, [meta.hdrDate, setMeta]);

  const onLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogo(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => setLogo(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeta(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-[1020px] mx-auto mb-[18px] bg-card border border-border rounded-[18px] py-5 px-7 flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-fade-up overflow-hidden relative" style={{ animationDelay: '.02s' }}>
      {/* Background accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,200,255,0.04)] to-transparent pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-accent2 rounded-l-[18px]" />

      {/* Logo zone */}
      <div className={`relative shrink-0 w-[110px] h-[80px] sm:w-[90px] sm:h-[66px] border-2 border-dashed rounded-xl bg-surface flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-colors duration-200 hover:border-accent hover:bg-[rgba(0,200,255,0.05)] ${logo ? 'border-solid border-accent' : 'border-border'}`}>
        <input type="file" accept="image/*" onChange={onLogoChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full text-[0px] p-0 border-none bg-none z-10" />
        
        {!logo ? (
          <div className="text-center pointer-events-none z-[1]">
            <span className="text-[22px] opacity-40 block mb-[3px]">🏢</span>
            <span className="text-[10px] text-muted leading-[1.4]">โลโก้<br/>บริษัท</span>
          </div>
        ) : (
          <>
            <img src={logo} alt="Company Logo" className="absolute inset-0 w-full h-full object-contain p-1.5 pointer-events-none" />
            <div onClick={(e) => { e.preventDefault(); removeLogo(); }} className="absolute top-1 right-1 z-20 w-[18px] h-[18px] rounded-full bg-[rgba(10,20,35,0.8)] border border-[rgba(255,255,255,0.2)] text-white text-[9px] leading-[18px] text-center cursor-pointer backdrop-blur-[4px] transition-colors duration-150 hover:bg-[rgba(255,69,96,0.85)] flex items-center justify-center">
              ✕
            </div>
          </>
        )}
      </div>

      {/* Text block */}
      <div className="flex-1 min-w-0 z-10 w-full">
        <div className="text-[clamp(15px,2vw,19px)] font-bold text-text tracking-[-0.3px] mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
          <input 
            type="text" 
            name="docTitle"
            value={meta.docTitle}
            onChange={handleChange}
            placeholder="ชื่อเอกสาร / รายงาน เช่น รายงานการตรวจสอบประสิทธิภาพ Chiller" 
            maxLength="100"
            className="w-full bg-transparent border-none border-b border-border py-[2px] text-text font-sans text-[clamp(15px,2vw,18px)] font-bold outline-none transition-colors duration-200 focus:border-accent placeholder:text-muted placeholder:font-normal"
          />
        </div>
        <div className="flex flex-wrap gap-x-[18px] gap-y-1.5 mt-2">
          <input type="text" name="hdrCompany" value={meta.hdrCompany} onChange={handleChange} placeholder="ชื่อบริษัท / โรงงาน" maxLength="80" className="flex-1 min-w-[130px] max-w-[200px] bg-transparent border-none border-b border-border py-[3px] text-muted font-sans text-xs outline-none transition-colors duration-200 focus:border-accent focus:text-text placeholder:text-border" />
          <input type="text" name="hdrPrepBy" value={meta.hdrPrepBy} onChange={handleChange} placeholder="จัดทำโดย" maxLength="60" className="flex-1 min-w-[130px] max-w-[200px] bg-transparent border-none border-b border-border py-[3px] text-muted font-sans text-xs outline-none transition-colors duration-200 focus:border-accent focus:text-text placeholder:text-border" />
          <input type="text" name="hdrDocNo" value={meta.hdrDocNo} onChange={handleChange} placeholder="เลขที่เอกสาร" maxLength="40" className="flex-1 min-w-[130px] max-w-[200px] bg-transparent border-none border-b border-border py-[3px] text-muted font-sans text-xs outline-none transition-colors duration-200 focus:border-accent focus:text-text placeholder:text-border" />
          <input type="text" name="hdrRevision" value={meta.hdrRevision} onChange={handleChange} placeholder="Rev. 0" maxLength="20" className="flex-1 min-w-[130px] max-w-[200px] bg-transparent border-none border-b border-border py-[3px] text-muted font-sans text-xs outline-none transition-colors duration-200 focus:border-accent focus:text-text placeholder:text-border" />
        </div>
      </div>

      {/* Date badge */}
      <div className="self-start shrink-0 bg-[rgba(0,200,255,0.08)] border border-[rgba(0,200,255,0.25)] rounded-lg py-1.5 px-3 text-center z-10 w-full sm:w-auto mt-2 sm:mt-0">
        <div className="text-[9px] text-muted uppercase tracking-[1px]">วันที่</div>
        <div className="font-mono text-[13px] text-accent font-bold whitespace-nowrap">{meta.hdrDate}</div>
        <div className="mt-1">
          <input 
            type="text" 
            name="hdrDate"
            value={meta.hdrDate}
            onChange={handleChange}
            placeholder="วว/ดด/ปปปป"
            className="bg-transparent border-none border-b border-border font-mono text-[11px] text-muted w-[90px] text-center outline-none py-[2px]"
          />
        </div>
      </div>
    </div>
  );
}
