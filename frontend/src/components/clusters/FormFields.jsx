import React from 'react';
import { DEFAULT_CONFIG } from '../../constants/config';

export function FoodFormFields({ details, onChange, onMenuImageChange, menuPreviewUrl }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-blue-100">
        <span className="text-xl">🍴</span>
        <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest">Detail Atribut Restoran</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Menu Andalan</label>
          <input 
            type="text"
            value={details.signature_menu || ''}
            onChange={(e) => onChange('signature_menu', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-semibold text-slate-700 bg-white"
            placeholder="Contoh: Nasi Goreng Spesial"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rentang Harga (Min - Max)</label>
          <div className="flex items-center gap-2">
            <input 
              type="number"
              value={details.price_min || ''}
              onChange={(e) => onChange('price_min', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-semibold text-slate-700 bg-white"
              placeholder="Min"
            />
            <span className="text-slate-400">-</span>
            <input 
              type="number"
              value={details.price_max || ''}
              onChange={(e) => onChange('price_max', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-semibold text-slate-700 bg-white"
              placeholder="Max"
            />
          </div>
        </div>
        
        {/* JAM OPERASIONAL: PRD-2 Time Picker */}
        <div className="space-y-1 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jam Operasional (Buka - Tutup)</label>
            <div className="flex items-center gap-4">
                <input 
                    type="time"
                    value={details.open_time || DEFAULT_CONFIG.TIMES.OPEN_DEFAULT}
                    onChange={(e) => onChange('open_time', e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-semibold text-slate-700 bg-white"
                />
                <span className="text-slate-300 font-bold">s/d</span>
                <input 
                    type="time"
                    value={details.close_time || DEFAULT_CONFIG.TIMES.CLOSE_DEFAULT}
                    onChange={(e) => onChange('close_time', e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-semibold text-slate-700 bg-white"
                />
            </div>
        </div>

        {/* PRD-2: Menu Image Upload */}
        <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Foto Menu / Unggulan</label>
            <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl bg-white border border-slate-100 overflow-hidden flex-shrink-0 shadow-inner">
                    {menuPreviewUrl ? (
                        <img src={menuPreviewUrl.startsWith('blob:') ? menuPreviewUrl : `http://localhost:3000${menuPreviewUrl}`} alt="Preview Menu" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a3 3 0 0 0-3-3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <input 
                        type="file" accept="image/*"
                        id="menu-file"
                        className="hidden"
                        onChange={onMenuImageChange}
                    />
                    <label htmlFor="menu-file" className="px-4 py-2 border-2 border-blue-100 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all cursor-pointer inline-block">
                        Unggah Foto Menu
                    </label>
                    <p className="text-[9px] text-slate-400 mt-2">Format: JPG, PNG. Rekomendasi rasio 4:3</p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-8 pt-2 md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox"
              className="w-5 h-5 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-blue-500/20"
              checked={details.is_halal || false}
              onChange={(e) => onChange('is_halal', e.target.checked)}
            />
            <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors uppercase tracking-tight">Label Halal</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox"
              className="w-5 h-5 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-blue-500/20"
              checked={details.has_wifi || false}
              onChange={(e) => onChange('has_wifi', e.target.checked)}
            />
            <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors uppercase tracking-tight">Koneksi WiFi</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export function NatureFormFields({ details, onChange, masterFacilities = [] }) {
  const toggleFacility = (id) => {
    const current = details.facility_ids || [];
    if (current.includes(id)) {
      onChange('facility_ids', current.filter(fid => fid !== id));
    } else {
      onChange('facility_ids', [...current, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-green-100">
        <span className="text-xl">🌿</span>
        <h3 className="text-sm font-black text-green-600 uppercase tracking-widest">Detail Atribut Alam</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ketinggian (mdpl)</label>
          <input 
            type="number"
            value={details.elevation || ''}
            onChange={(e) => onChange('elevation', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-semibold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tingkat Kesulitan Trek</label>
          <select 
            value={details.difficulty_level || ''}
            onChange={(e) => onChange('difficulty_level', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white font-semibold text-slate-700"
          >
            <option value="">Pilih</option>
            <option value="Easy">Mudah (Santai)</option>
            <option value="Moderate">Sedang (Menengah)</option>
            <option value="Hard">Sulit (Menantang)</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Biaya Masuk (Min - Max)</label>
          <div className="flex items-center gap-2">
            <input 
              type="number"
              value={details.entry_fee_min || ''}
              onChange={(e) => onChange('entry_fee_min', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-semibold"
              placeholder="Min"
            />
            <span className="text-slate-400">-</span>
            <input 
              type="number"
              value={details.entry_fee_max || ''}
              onChange={(e) => onChange('entry_fee_max', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-semibold"
              placeholder="Max"
            />
          </div>
        </div>

        {/* PRD-2: CHECKLIST FASILITAS */}
        <div className="space-y-3 md:col-span-2 mt-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fasilitas Umum Tersedia (Checklist)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {masterFacilities.map((f) => (
                    <button
                        key={f.id} type="button"
                        onClick={() => toggleFacility(f.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all text-xs font-bold ${
                            (details.facility_ids || []).includes(f.id)
                            ? 'bg-green-50 border-green-500 text-green-700'
                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                    >
                        <div className={`w-3 h-3 rounded-full border-2 ${
                             (details.facility_ids || []).includes(f.id) ? 'bg-green-500 border-green-500' : 'border-slate-200'
                        }`}></div>
                        {f.name}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

export function AccommodationFormFields({ details, onChange }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-indigo-100">
        <span className="text-xl">🏨</span>
        <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest">Detail Atribut Penginapan</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rating Bintang</label>
          <select 
            value={details.star_rating || ''}
            onChange={(e) => onChange('star_rating', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white font-semibold"
          >
            {[1,2,3,4,5].map(v => <option key={v} value={v}>{v} Bintang</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Waktu Check-in</label>
          <input 
            type="time"
            value={details.check_in_time || DEFAULT_CONFIG.TIMES.CHECKIN_DEFAULT}
            onChange={(e) => onChange('check_in_time', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none font-semibold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Waktu Check-out</label>
          <input 
            type="time"
            value={details.check_out_time || DEFAULT_CONFIG.TIMES.CHECKOUT_DEFAULT}
            onChange={(e) => onChange('check_out_time', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none font-semibold"
          />
        </div>
        <div className="flex items-center pt-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox"
              className="w-5 h-5 rounded-lg border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
              checked={details.has_pool || false}
              onChange={(e) => onChange('has_pool', e.target.checked)}
            />
            <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 uppercase tracking-tight">Tersedia Kolam Renang</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export function HealthcareFormFields({ details, onChange, masterHealthcareTypes = [] }) {
  const toggleType = (id) => {
    const current = details.healthcare_type_ids || [];
    if (current.includes(id)) {
      onChange('healthcare_type_ids', current.filter(tid => tid !== id));
    } else {
      onChange('healthcare_type_ids', [...current, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-red-100">
        <span className="text-xl">🚑</span>
        <h3 className="text-sm font-black text-red-600 uppercase tracking-widest">Detail Atribut Kesehatan</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PRD-2: CHECKLIST TIPE KESEHATAN */}
        <div className="space-y-3 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipe Fasilitas Kesehatan (Checklist Semua yang Sesuai)</label>
            <div className="flex flex-wrap gap-3">
                {masterHealthcareTypes.map((t) => (
                    <button
                        key={t.id} type="button"
                        onClick={() => toggleType(t.id)}
                        className={`px-4 py-2 rounded-2xl border-2 transition-all text-xs font-bold ${
                            (details.healthcare_type_ids || []).includes(t.id)
                            ? 'bg-red-50 border-red-500 text-red-700'
                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                    >
                        {t.name}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:col-span-2 pt-2 border-t border-slate-100 mt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={details.has_igd || false} onChange={(e) => onChange('has_igd', e.target.checked)} className="w-5 h-5 text-red-600 rounded-lg group-hover:ring-2 ring-red-500/10" />
            <span className="text-xs font-bold text-slate-600">IGD 24 Jam</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={details.accepts_bpjs || false} onChange={(e) => onChange('accepts_bpjs', e.target.checked)} className="w-5 h-5 text-red-600 rounded-lg group-hover:ring-2 ring-red-500/10" />
            <span className="text-xs font-bold text-slate-600">Terima BPJS</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={details.ambulance_available || false} onChange={(e) => onChange('ambulance_available', e.target.checked)} className="w-5 h-5 text-red-600 rounded-lg group-hover:ring-2 ring-red-500/10" />
            <span className="text-xs font-bold text-slate-600">Unit Ambulans</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export function EducationFormFields({ details, onChange }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-orange-100">
        <span className="text-xl">🏫</span>
        <h3 className="text-sm font-black text-orange-600 uppercase tracking-widest">Detail Atribut Pendidikan</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jenjang Pendidikan</label>
          <select 
            value={details.education_level || ''}
            onChange={(e) => onChange('education_level', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white font-semibold"
          >
            <option value="SD">SD (Sekolah Dasar)</option>
            <option value="SMP">SMP (Menengah Pertama)</option>
            <option value="SMA/K">SMA/SMK (Menengah Atas)</option>
            <option value="Perguruan Tinggi">Perguruan Tinggi</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Akreditasi Lembaga</label>
          <select 
            value={details.accreditation || ''}
            onChange={(e) => onChange('accreditation', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white font-semibold font-mono"
          >
            <option value="A">Unggul (A)</option>
            <option value="B">Baik Sekali (B)</option>
            <option value="C">Cukup (C)</option>
            <option value="TT">Belum Terakreditasi</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Kepemilikan</label>
          <select 
            value={details.school_status || ''}
            onChange={(e) => onChange('school_status', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white font-semibold"
          >
            <option value="Negeri">Negeri (Pemerintah)</option>
            <option value="Swasta">Swasta (Yayasan)</option>
          </select>
        </div>
        <div className="flex items-center pt-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={details.has_library || false} onChange={(e) => onChange('has_library', e.target.checked)} className="w-5 h-5 text-orange-600 rounded-lg" />
            <span className="text-sm font-bold text-slate-600 group-hover:text-orange-600 uppercase tracking-tight">Fasilitas Perpustakaan</span>
          </label>
        </div>
      </div>
    </div>
  );
}
