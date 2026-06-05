import React, { useState } from 'react';

const MAX_SLOTS = 5;

export default function ImageUpload({ images, setImages }) {
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const addSlot = () => {
    if (images.length >= MAX_SLOTS) {
      alert(`อัปโหลดได้สูงสุด ${MAX_SLOTS} รูป`);
      return;
    }
    setImages([...images, { dataUrl: null, caption: '' }]);
  };

  const removeImg = (idx) => {
    const newImages = [...images];
    newImages[idx].dataUrl = null;
    setImages(newImages);
  };

  const updateCaption = (idx, caption) => {
    const newImages = [...images];
    newImages[idx].caption = caption;
    setImages(newImages);
  };

  const handleFile = (file, idx) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newImages = [...images];
      newImages[idx].dataUrl = ev.target.result;
      setImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="card col-span-full mb-[14px]" style={{ animationDelay: '.12s' }}>
      <div className="flex justify-between items-center mb-2.5">
        <div className="ctitle mb-0">📷 รูปภาพประกอบ</div>
        <button className="bg-[rgba(0,200,255,0.1)] border border-[rgba(0,200,255,0.3)] rounded-lg py-1 px-3 text-xs text-accent cursor-pointer font-sans transition-colors duration-200 hover:bg-[rgba(0,200,255,0.2)]" onClick={addSlot}>
          ＋ เพิ่มรูป
        </button>
      </div>
      <p className="text-[11px] text-muted mb-3 leading-[1.6]">
        อัปโหลดรูปภาพอุปกรณ์ แผ่นป้ายพิกัด หรือจุดวัดค่า — รองรับ JPG, PNG, WEBP (ไม่เกิน 5 ภาพ)
      </p>
      
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 mt-1">
        {images.map((img, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <div 
              className={`relative aspect-[4/3] border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-colors duration-200 bg-surface flex flex-col items-center justify-center gap-1.5
                ${img.dataUrl ? 'border-solid border-accent' : 'border-border hover:border-accent hover:bg-[rgba(0,200,255,0.04)]'}
                ${dragOverIdx === idx ? 'border-accent2 bg-[rgba(0,229,176,0.08)]' : ''}
              `}
              onDragOver={(e) => { e.preventDefault(); setDragOverIdx(idx); }}
              onDragLeave={(e) => { e.preventDefault(); setDragOverIdx(null); }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverIdx(null);
                handleFile(e.dataTransfer.files[0], idx);
              }}
            >
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFile(e.target.files[0], idx)} 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-none bg-none text-[0px]" 
              />
              
              {!img.dataUrl ? (
                <div className="text-center pointer-events-none z-[1]">
                  <span className="text-[26px] opacity-40 block mb-1">🖼️</span>
                  <span className="text-[11px] text-muted leading-[1.4]">คลิกหรือลากวางรูป<br/><span className="text-[10px] opacity-60">JPG · PNG · WEBP</span></span>
                </div>
              ) : (
                <>
                  <img src={img.dataUrl} alt="" className="absolute inset-0 w-full h-full object-cover rounded-[10px] pointer-events-none" />
                  <div 
                    onClick={(e) => { e.preventDefault(); removeImg(idx); }} 
                    className="absolute top-1.5 right-1.5 z-20 w-[22px] h-[22px] rounded-full bg-[rgba(10,20,35,0.75)] border border-[rgba(255,255,255,0.2)] text-white text-[11px] leading-[22px] text-center cursor-pointer transition-colors duration-150 backdrop-blur-[4px] hover:bg-[rgba(255,69,96,0.85)] flex items-center justify-center"
                  >
                    ✕
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-1.5">
              <input 
                type="text" 
                placeholder={`คำบรรยายรูปที่ ${idx + 1}…`}
                value={img.caption}
                onChange={(e) => updateCaption(idx, e.target.value)}
                className="w-full bg-surface border border-border rounded-lg py-1.5 px-2.5 text-text font-sans text-xs outline-none transition-colors duration-200 focus:border-accent"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
