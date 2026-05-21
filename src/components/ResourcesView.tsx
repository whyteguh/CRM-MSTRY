import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  BookOpen, 
  ExternalLink,
  Check,
  AlertCircle,
  HelpCircle,
  Zap
} from 'lucide-react';
import { ResourceItem } from '../types';

interface ResourcesViewProps {
  onMarkViewed: () => void;
}

export default function ResourcesView({ onMarkViewed }: ResourcesViewProps) {
  const userEmail = 'incentric.id@gmail.com';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [inspectingResource, setInspectingResource] = useState<ResourceItem | null>(null);

  // Hardcoded real CRM strategy handbook files
  const initialResources: ResourceItem[] = [
    {
      id: 'res-1',
      title: 'Blueprint Alur Penjualan (Pipeline) CRM Modern',
      category: 'Strategi',
      type: 'Template',
      description: 'Lembar kerja utama eksekutif. Petakan tahapan pipeline Anda (kualifikasi, negosiasi, pencapaian) dengan batas pembobotan akurat seperti yang dibahas pada Sesi 1.',
      fileSize: '4.8 MB',
      downloadsCount: 142
    },
    {
      id: 'res-2',
      title: 'Panduan Integrasi REST API & Payload Webhook',
      category: 'Integrasi',
      type: 'Guide',
      description: 'Daftar lengkap endpoint sandbox. Contoh detail skema sinkronisasi kontak, header autentikasi, dan skema respons payload.',
      fileSize: '1.2 MB',
      downloadsCount: 98
    },
    {
      id: 'res-3',
      title: 'Matriks Retensi Kohort & LTV Pelanggan',
      category: 'Analitis',
      type: 'Spreadsheet',
      description: 'Laporan Excel/Google Sheet interaktif untuk menghitung Customer Lifetime Value (CLV). Masukkan jumlah pembelian rata-rata kohort, margin, dan profil churn secara langsung.',
      fileSize: '2.5 MB',
      downloadsCount: 220
    },
    {
      id: 'res-4',
      title: 'Alur Kerja Otomatisasi Siklus Hidup & Nurturing Prospek',
      category: 'Otomatisasi Penjualan',
      type: 'Cheat Sheet',
      description: 'Diagram alir visual yang memetakan pemicu niat tinggi, kenaikan skor prospek (lead score), urutan seret-pasang (drag-drop), dan matriks penugasan otomatis.',
      fileSize: '3.1 MB',
      downloadsCount: 167
    },
    {
      id: 'res-5',
      title: 'Buku Panduan RFP dan Evaluasi Perangkat Lunak CRM',
      category: 'Strategi',
      type: 'Ebook',
      description: 'Panduan sepanjang 24 halaman yang merinci pertanyaan penting untuk diajukan kepada vendor. Lengkap dengan matriks evaluasi, proyeksi biaya, dan peta risiko integrasi.',
      fileSize: '8.4 MB',
      downloadsCount: 74
    }
  ];

  const categories = ['Semua', 'Strategi', 'Integrasi', 'Analitis', 'Otomatisasi Penjualan'];

  const filteredResources = initialResources.filter((res) => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || res.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (id: string) => {
    if (downloadingId) return; // Wait for previous
    setDownloadingId(id);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingId(null);
            setDownloadedIds((prevList) => [...prevList, id]);
            // Mark as viewed in progress stats
            onMarkViewed();
          }, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 100);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Spreadsheet':
      case 'Template':
        return <FileSpreadsheet className="h-6 w-6 text-emerald-500" />;
      case 'Guide':
      case 'Cheat Sheet':
        return <FileText className="h-6 w-6 text-cyan-500" />;
      default:
        return <BookOpen className="h-6 w-6 text-indigo-500" />;
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 text-left max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          Materi Pembelajaran & Dokumen Referensi
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-3xl">
          Cari dan unduh blueprint pipeline, panduan webhook teknis, spreadsheet penilaian model, serta materi playbook strategi CRM lainnya. Mengunduh template simulasi ini akan berkontribusi pada sertifikasi progres lab Anda.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        {/* Keywords input */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-sm"
            placeholder="Cari kata kunci, misal 'Webhook', 'Pipeline'..."
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => {
            const isDownloaded = downloadedIds.includes(res.id);
            const isDownloading = downloadingId === res.id;
            
            return (
              <div 
                key={res.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors">
                      {getTypeIcon(res.type)}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 font-mono uppercase bg-slate-100 px-2.5 py-1 rounded-md">
                      {res.category}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-sm text-slate-900 leading-snug mb-2 group-hover:text-cyan-600 transition-colors">
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                    {res.description}
                  </p>
                </div>

                {/* Card footer detailing progress states */}
                <div className="border-t border-slate-100 pt-4 mt-2 space-y-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Ukuran: {res.fileSize}</span>
                    <span>Diunduh: {isDownloaded ? res.downloadsCount + 1 : res.downloadsCount} kali</span>
                  </div>

                  {/* Operational actions: simulated progress or direct modal inspection */}
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => setInspectingResource(res)}
                      className="flex-1 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer text-center flex items-center justify-center gap-1 transition-colors"
                    >
                      <Zap className="h-3.5 w-3.5 text-slate-400" />
                      Pratinjau Cepat
                    </button>

                    <button
                      disabled={isDownloaded || isDownloading}
                      onClick={() => handleDownload(res.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer text-center flex items-center justify-center transition-all ${
                        isDownloaded 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold' 
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isDownloading ? (
                        <div className="flex items-center gap-1">
                          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>{downloadProgress}%</span>
                        </div>
                      ) : isDownloaded ? (
                        <Check className="h-4.5 w-4.5 text-emerald-600 strike-[3]" />
                      ) : (
                        <Download className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>

                  {/* Progressive bar animation */}
                  {isDownloading && (
                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-cyan-500 h-full rounded-full transition-all duration-100" 
                        style={{ width: `${downloadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <span className="block text-slate-800 font-semibold text-sm">Tidak ada materi yang cocok</span>
            <span className="block text-slate-400 text-xs mt-1">Coba sesuaikan filter kategori Anda atau bersihkan pencarian kata kunci.</span>
          </div>
        )}
      </div>

      {/* Inspecting Modal/Drawer */}
      {inspectingResource && (
        <div id="inspector-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 lg:p-8 max-h-[85vh] overflow-y-auto border border-slate-200 shadow-2xl relative text-left">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-md">
                  Pratinjau Kategori: {inspectingResource.category}
                </span>
                <h3 className="font-display text-xl font-bold text-slate-900 mt-2">{inspectingResource.title}</h3>
              </div>
              <button 
                onClick={() => setInspectingResource(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-100 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Simulated Content Previews based on category */}
            <div className="space-y-6">
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {inspectingResource.description}
              </p>

              {inspectingResource.category === 'Integrasi' && (
                <div className="space-y-3 font-mono">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Struktur Contoh Payload Webhook</span>
                  <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs overflow-x-auto leading-relaxed border border-slate-800">
                    <pre>{`POST /api/v1/contacts/sync HTTP/1.1
Host: sandbox.crm-workshop.com
Authorization: Bearer wkshp_sk_2026_x89aF
Content-Type: application/json

{
  "lead_source": "Workshop Form",
  "contact": {
    "email": "${userEmail}",
    "full_name": "${userEmail.split('@')[0]}",
    "verified": true
  },
  "deal_pipeline": {
    "initial_stage": "qualification",
    "predicted_probability": 35.0,
    "assigned_value_idr": 75000000
  },
  "metadata": {
    "cohort_id": "MAY-2026-A",
    "last_sync_utc": "2026-05-23T15:20"
  }
}`}</pre>
                  </div>
                </div>
              )}

              {inspectingResource.category === 'Strategi' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Tahapan Alur Pipeline Strategis</span>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="p-3">Tahap Penjualan</th>
                          <th className="p-3">Rekomendasi Bobot</th>
                          <th className="p-3">Kriteria Keluar (Exit Criteria)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr>
                          <td className="p-3 font-semibold text-slate-950">1. Kualifikasi</td>
                          <td className="p-3">10% - 15%</td>
                          <td className="p-3">Validasi kriteria kebutuhan & anggaran selesai</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-slate-950">2. Demo Proposal</td>
                          <td className="p-3">30% - 50%</td>
                          <td className="p-3">Presentasi skema harga spesifik dikirimkan</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-slate-950">3. Negosiasi</td>
                          <td className="p-3 font-semibold text-cyan-600">70% - 85%</td>
                          <td className="p-3">Review kontrak hukum & persetujuan lisan eksekutif</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {inspectingResource.category === 'Analitis' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Perhitungan Umur Masa Hidup Pelanggan (LTV)</span>
                  <div className="bg-slate-900 text-white p-4 rounded-xl text-xs space-y-2 border border-slate-800">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Rata-rata Churn (Penyusutan)</span>
                      <span className="font-mono text-cyan-400">12.5% per Tahun</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Formula Umur Pelanggan (Lifespan)</span>
                      <span className="font-mono">1 / Churn = 8.0 Tahun Berlangganan</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Batas Maksimal CAC agar Untung</span>
                      <span className="font-mono text-emerald-400">Proyeksi LTV / 3 = Rp 42.000.000 limit margin subsidi</span>
                    </div>
                  </div>
                </div>
              )}

              {inspectingResource.category === 'Otomatisasi Penjualan' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Pemicu Otomatisasi & Tindakan Rute</span>
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex gap-3 text-xs">
                      <div className="bg-cyan-100 text-cyan-700 font-bold px-2 py-1 rounded h-fit">Skenario</div>
                      <div>
                        <span className="font-bold text-slate-800 block">Mengunjungi Halaman Harga &gt; 3 kali</span>
                        <span className="text-slate-500">Tingkatkan skor prospek (lead score) sebesar +25 poin seketika.</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex gap-3 text-xs">
                      <div className="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded h-fit">Aksi Rute</div>
                      <div>
                        <span className="font-bold text-slate-800 block">Tugaskan ke Rep Enterprise Specialist</span>
                        <span className="text-slate-500">Sistem mengecek demografi prospek dan menugaskan ke AE regional.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Informative Note */}
              <div className="p-4 bg-yellow-50 rounded-xl text-[11px] text-yellow-800 border border-yellow-100 flex gap-3">
                <HelpCircle className="h-5 w-5 shrink-0 text-yellow-600" />
                <span>
                  Pratinjau ini menunjukkan rangkuman skema parsial yang disediakan untuk lingkungan sandbox aktif. Unduh versi lengkap materi selama pengujian untuk format spreadsheet metrik atau slide presentasi lengkap.
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setInspectingResource(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer text-slate-700"
              >
                Tutup Review
              </button>
              
              {!downloadedIds.includes(inspectingResource.id) && (
                <button
                  onClick={() => {
                    handleDownload(inspectingResource.id);
                    setInspectingResource(null);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Unduh File Lengkap
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
