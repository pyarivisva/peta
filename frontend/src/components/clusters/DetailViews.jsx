import React from 'react';

const BASE_URL = 'http://localhost:3000';
const getImageUrl = (url) => url && url.startsWith('/uploads') ? `${BASE_URL}${url}` : url;

export function FoodDetailView({ details }) {
  if (!details) return null;
  return (
    <div className="space-y-4 pt-6 border-t border-slate-100">
      <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest">Informasi Restoran</h3>
      <div className="grid grid-cols-1 gap-3">
        {details.signature_menu && (
          <div className="flex items-center gap-3 text-slate-700">
            <span className="text-blue-500">🍳</span>
            <span className="text-sm"><b>Menu Andalan:</b> {details.signature_menu}</span>
          </div>
        )}
        {(details.price_min !== undefined || details.price_max !== undefined) && (
          <div className="flex items-center gap-3 text-slate-700">
            <span className="text-blue-500">💰</span>
            <span className="text-sm"><b>Rentang Harga:</b> Rp {Number(details.price_min || 0).toLocaleString()} - Rp {Number(details.price_max || 0).toLocaleString()}</span>
          </div>
        )}
        {(details.open_time || details.close_time) ? (
          <div className="flex items-center gap-3 text-slate-700">
            <span className="text-blue-500">🕒</span>
            <span className="text-sm"><b>Jam Operasional:</b> {details.open_time?.slice(0, 5)} - {details.close_time?.slice(0, 5)}</span>
          </div>
        ) : details.opening_hours && (
          <div className="flex items-center gap-3 text-slate-700">
            <span className="text-blue-500">🕒</span>
            <span className="text-sm"><b>Jam Buka:</b> {details.opening_hours}</span>
          </div>
        )}
        <div className="flex gap-4 pt-1">
          <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${details.is_halal ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
            {details.is_halal ? '✔️ HALAL' : 'NON-HALAL'}
          </span>
          <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${details.has_wifi ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'}`}>
            {details.has_wifi ? '📶 WIFI' : 'NO WIFI'}
          </span>
        </div>
        
        {details.menu_image_url && (
            <div className="mt-4">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Foto Menu / Makanan</label>
               <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                  <img src={getImageUrl(details.menu_image_url)} alt="Menu" className="w-full h-40 object-cover cursor-pointer hover:scale-105 transition-transform" />
               </div>
            </div>
        )}
      </div>
    </div>
  );
}

export function NatureDetailView({ details }) {
  if (!details) return null;
  return (
    <div className="space-y-4 pt-6 border-t border-slate-100">
      <h3 className="text-sm font-bold text-green-600 uppercase tracking-widest">Informasi Alam</h3>
      <div className="grid grid-cols-1 gap-3">
        {details.elevation && (
          <div className="flex items-center gap-3 text-slate-700">
            <span className="text-green-500">🏔️</span>
            <span className="text-sm"><b>Ketinggian:</b> {details.elevation} mdpl</span>
          </div>
        )}
        {details.difficulty_level && (
          <div className="flex items-center gap-3 text-slate-700">
            <span className="text-green-500">🧗</span>
            <span className="text-sm"><b>Tingkat Kesulitan:</b> {details.difficulty_level}</span>
          </div>
        )}
        {(details.entry_fee_min !== undefined || details.entry_fee_max !== undefined) && (
          <div className="flex items-center gap-3 text-slate-700">
            <span className="text-green-500">🎟️</span>
            <span className="text-sm"><b>Tiket Masuk:</b> Rp {Number(details.entry_fee_min || 0).toLocaleString()} - Rp {Number(details.entry_fee_max || 0).toLocaleString()}</span>
          </div>
        )}
        
        {details.facility_list && details.facility_list.length > 0 && (
          <div className="pt-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Fasilitas Tersedia</label>
            <div className="flex flex-wrap gap-2">
              {details.facility_list.map((f, i) => (
                <span key={i} className="bg-green-50 text-green-700 text-[10px] px-2 py-1 rounded bg-opacity-50 border border-green-100 font-medium">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AccommodationDetailView({ details }) {
  if (!details) return null;
  return (
    <div className="space-y-4 pt-6 border-t border-slate-100">
      <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Informasi Penginapan</h3>
      <div className="grid grid-cols-1 gap-3">
        {details.star_rating && (
          <div className="flex items-center gap-3 text-slate-700">
            <span className="text-indigo-500">⭐</span>
            <span className="text-sm"><b>Rating:</b> {details.star_rating} Bintang</span>
          </div>
        )}
        {details.check_in_time && (
          <div className="flex items-center gap-3 text-slate-700">
            <span className="text-indigo-500">🔑</span>
            <span className="text-sm"><b>Check-in:</b> {details.check_in_time}</span>
          </div>
        )}
        {details.check_out_time && (
          <div className="flex items-center gap-3 text-slate-700">
            <span className="text-indigo-500">🚪</span>
            <span className="text-sm"><b>Check-out:</b> {details.check_out_time}</span>
          </div>
        )}
        <div className="pt-1">
          <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${details.has_pool ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
            {details.has_pool ? '🏊 KOLAM RENANG' : 'NO POOL'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function HealthcareDetailView({ details }) {
  if (!details) return null;
  return (
    <div className="space-y-4 pt-6 border-t border-slate-100">
      <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest">Informasi Kesehatan</h3>
      <div className="grid grid-cols-1 gap-3">
        {details.healthcare_type_list && details.healthcare_type_list.length > 0 ? (
          <div className="pt-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Tipe Fasilitas</label>
            <div className="flex flex-wrap gap-2">
              {details.healthcare_type_list.map((t, i) => (
                <span key={i} className="bg-red-50 text-red-700 text-[10px] px-2 py-1 rounded bg-opacity-50 border border-red-100 font-medium uppercase font-bold">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ) : details.facility_type && (
          <div className="flex items-center gap-3 text-slate-700">
            <span className="text-red-500">🏥</span>
            <span className="text-sm"><b>Tipe:</b> {details.facility_type}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          {details.has_igd && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">🚨 IGD 24/7</span>}
          {details.accepts_bpjs && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">💳 BPJS</span>}
          {details.ambulance_available && <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-1 rounded-full font-bold">🚑 AMBULANS</span>}
        </div>
      </div>
    </div>
  );
}

export function EducationDetailView({ details }) {
  if (!details) return null;
  return (
    <div className="space-y-4 pt-6 border-t border-slate-100">
      <h3 className="text-sm font-bold text-orange-600 uppercase tracking-widest">Informasi Pendidikan</h3>
      <div className="grid grid-cols-1 gap-3">
        {details.education_level && (
          <div className="flex items-center gap-3 text-slate-700">
            <span className="text-orange-500">🎓</span>
            <span className="text-sm"><b>Jenjang:</b> {details.education_level}</span>
          </div>
        )}
        {details.accreditation && (
          <div className="flex items-center gap-3 text-slate-700">
            <span className="text-orange-500">📜</span>
            <span className="text-sm"><b>Akreditasi:</b> {details.accreditation}</span>
          </div>
        )}
        {details.school_status && (
          <div className="flex items-center gap-3 text-slate-700">
            <span className="text-orange-500">🏛️</span>
            <span className="text-sm"><b>Status:</b> {details.school_status}</span>
          </div>
        )}
        {details.has_library && (
          <div className="pt-1">
            <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold">📚 PERPUSTAKAAN</span>
          </div>
        )}
      </div>
    </div>
  );
}
