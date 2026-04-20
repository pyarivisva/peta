import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Map as MapIcon, 
  Edit3, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import api from '../api/axiosConfig';
import ObjectFormModal from '../components/admin/ObjectFormModal';
import FeedbackModal from '../components/common/FeedbackModal';
import Loading from '../components/common/Loading';

export default function AdminDataPage() {
  const [markers, setMarkers] = useState([]);
  const [types, setTypes] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formModal, setFormModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [feedback, setFeedback] = useState({ isOpen: false, isConfirm: false, title: '', message: '', onConfirm: null });

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [resObjects, resTypes, resClusters] = await Promise.all([
        api.get('/objects'),
        api.get('/types'),
        api.get('/clusters')
      ]);
      setMarkers(resObjects.data);
      setTypes(resTypes.data);
      setClusters(resClusters.data);
    } catch (err) {
      console.error(err);
      showFeedback('Kesalahan Jaringan', 'Gagal memuat data dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  const showFeedback = (title, message, isConfirm = false, onConfirm = null) => {
    setFeedback({ isOpen: true, title, message, isConfirm, onConfirm });
  };

  const handleEdit = (item) => {
    setFormModal({ isOpen: true, mode: 'edit', data: item });
  };

  const handleDelete = (id) => {
    showFeedback(
      'Hapus Data?', 
      'Tindakan ini permanen dan data cluster terkait juga akan dihapus.',
      true,
      async () => {
        try {
          setIsLoading(true);
          await api.delete(`/objects/${id}`);
          fetchData();
          showFeedback('Berhasil', 'Data telah dihapus.');
        } catch (err) {
          showFeedback('Gagal', 'Terjadi kesalahan saat menghapus data.');
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  const handleFormSubmit = async (formData) => {
    setFormModal({ ...formModal, isOpen: false });
    setIsLoading(true);
    try {
      if (formModal.mode === 'create') {
        await api.post('/objects', formData);
        showFeedback('Berhasil', 'Data lokasi baru ditambahkan.');
      } else {
        await api.put(`/objects/${formModal.data.id}`, formData);
        showFeedback('Berhasil', 'Data lokasi diperbarui.');
      }
      fetchData();
    } catch (err) {
      showFeedback('Gagal', err.response?.data?.message || 'Terjadi kesalahan server.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMarkers = markers.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.type_name.toLowerCase().includes(search.toLowerCase()) ||
    (m.cluster_name && m.cluster_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-['Inter']">
      {isLoading && <Loading fullScreen />}
      
      <FeedbackModal 
        {...feedback} 
        onClose={() => setFeedback({ ...feedback, isOpen: false })} 
      />

      <ObjectFormModal 
        {...formModal}
        types={types}
        clusters={clusters}
        onClose={() => setFormModal({ ...formModal, isOpen: false })}
        onSubmit={handleFormSubmit}
      />

      {/* TOP HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Database className="text-blue-600" size={24} />
              Database Management
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Sistem Informasi Geografis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Search size={18} />
              </div>
              <input 
                type="text"
                placeholder="Cari nama, tipe, atau cluster..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-2xl w-80 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
              />
           </div>
           <button 
             onClick={() => setFormModal({ isOpen: true, mode: 'create', data: null })}
             className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 text-sm"
           >
             <Plus size={18} />
             Tambah Data
           </button>
        </div>
      </header>

      {/* MAIN CONTENT TABLE */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] w-20">ID</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Nama & Alamat</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Kategori</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Cluster</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMarkers.length > 0 ? filteredMarkers.map((m) => (
                  <tr key={m.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6 font-mono text-xs text-slate-400 font-bold">#{m.id}</td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-800 text-base">{m.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{m.address || 'Tanpa Alamat'}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-blue-50 text-blue-700 text-[11px] px-3 py-1 rounded-lg font-bold tracking-wide">
                        {m.type_name}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-slate-600 font-semibold text-sm">
                        {m.cluster_name || '—'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${m.status === 'Open' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                        <span className={`text-xs font-bold ${m.status === 'Open' ? 'text-green-600' : 'text-amber-600'}`}>
                          {m.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(m)}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(m.id)}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Search size={48} className="text-slate-200" />
                        <p className="text-slate-400 font-bold">Tidak ada data yang ditemukan.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* FOOTER PAGINATION PLACEHOLDER */}
          <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Total {filteredMarkers.length} Lokasi
            </p>
            <div className="flex gap-2">
              <button disabled className="p-2 text-slate-300 pointer-events-none focus:outline-none">
                <ChevronLeft size={20} />
              </button>
              <button disabled className="p-2 text-slate-300 pointer-events-none focus:outline-none">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* FLOATING ACTION */}
      <button 
        onClick={() => navigate('/admin')}
        className="fixed bottom-8 right-8 bg-slate-900 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40 group"
        title="Buka Peta"
      >
        <MapIcon size={24} />
        <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
          Kembali ke Peta
        </span>
      </button>
    </div>
  );
}
