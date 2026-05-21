import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  TrendingUp, 
  RotateCcw, 
  BookOpen, 
  Lightbulb, 
  Target, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  ExternalLink,
  ChevronRight,
  Award,
  AlertCircle
} from 'lucide-react';

interface DashboardViewProps {
  userEmail: string;
  onNavigateTab: (tab: 'dashboard' | 'resources' | 'tools' | 'community') => void;
  completedTasks: {
    unlockedHub: boolean;
    resourcesViewed: boolean;
    toolCalculations: number;
    ticketSent: boolean;
  };
}

interface Initiative {
  id: string;
  text: string;
  done: boolean;
}

interface KeyResult {
  id: string;
  title: string;
  targetValue: string;
  toolTab: 'tools' | 'resources' | 'community';
  toolHint: string;
  initiatives: Initiative[];
}

const DEFAULT_OBJECTIVE = "Membangun Fondasi CRM Unggul untuk Memaksimalkan Siklus Penjualan & Loyalitas Pelanggan Berkelanjutan";

const DEFAULT_KEY_RESULTS: KeyResult[] = [
  {
    id: "kr-1",
    title: "Siklus Pipeline Efisien",
    targetValue: "Siklus Konversi Rerata Menjadi 18 Hari",
    toolTab: "tools",
    toolHint: "Gunakan 'Model Perkiraan Pipeline' di menu Tools untuk menyelaraskan probabilitas penutupan transaksi secara real-time.",
    initiatives: [
      { id: "init-1-1", text: "Memetakan matriks alur kualifikasi (BANT) & penetapan penugasan otomatis untuk prospek baru.", done: false },
      { id: "init-1-2", text: "Mengonfigurasi kriteria keluar (Exit Criteria) yang ketat pada setiap tahap pipeline penjualan.", done: false },
      { id: "init-1-3", text: "Menguji webhook otomatis untuk sinkronisasi nilai kontrak kotor dengan sistem pemodalan.", done: false }
    ]
  },
  {
    id: "kr-2",
    title: "Akurasi Kualifikasi Prospek",
    targetValue: "Skor Kualifikasi BANT Mencapai Akurasi 85%",
    toolTab: "tools",
    toolHint: "Gunakan 'Kualifikasi Prospek BANT' di menu Tools untuk mengukur akurasi prioritas prospek berdasarkan skor otomatis.",
    initiatives: [
      { id: "init-2-1", text: "Memicu otomatisasi urutan pengasuhan (nurturing) bagi prospek berkategori hangat.", done: false },
      { id: "init-2-2", text: "Melakukan audit dan penyesuaian parameter skor prioritas tinggi sesuai tingkat dampak kendala.", done: false },
      { id: "init-2-3", text: "Membuat alur otomatisasi rute prospek instan ke representasi penjualan spesifik (SLA < 15 menit).", done: false }
    ]
  },
  {
    id: "kr-3",
    title: "Optimasi Nilai LTV Pelanggan",
    targetValue: "Menjaga Rasio Masa Hidup (LTV) terhadap CAC >= 3:1",
    toolTab: "tools",
    toolHint: "Gunakan 'Simulator Nilai LTV Pelanggan' di menu Tools untuk mensimulasikan rasio loyalitas yang menguntungkan.",
    initiatives: [
      { id: "init-3-1", text: "Merancang simulasi LTV interaktif menggunakan koefisien margin produk neto.", done: false },
      { id: "init-3-2", text: "Menetapkan batas maksimal Biaya Akuisisi Pelanggan (CAC Ceiling) guna menekan denda margin kerugian.", done: false },
      { id: "init-3-3", text: "Melakukan analisis segmentasi tahunan berbasis kohort untuk menganalisis retensi pelanggan.", done: false }
    ]
  }
];

export default function DashboardView({ userEmail, onNavigateTab, completedTasks }: DashboardViewProps) {
  // Persistence using local state + localStorage
  const [objective, setObjective] = useState<string>(() => {
    const saved = localStorage.getItem('crm_okr_objective_v2');
    return saved !== null ? saved : DEFAULT_OBJECTIVE;
  });

  const [keyResults, setKeyResults] = useState<KeyResult[]>(() => {
    const saved = localStorage.getItem('crm_okr_key_results_v2');
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_KEY_RESULTS;
      }
    }
    return DEFAULT_KEY_RESULTS;
  });

  // Edit states
  const [isEditingObjective, setIsEditingObjective] = useState(false);
  const [editedObjectiveText, setEditedObjectiveText] = useState(objective);

  const [editingKRId, setEditingKRId] = useState<string | null>(null);
  const [editedKRTitle, setEditedKRTitle] = useState('');
  const [editedKRTarget, setEditedKRTarget] = useState('');

  // Input states for new initiatives per KR
  const [newInitiativeText, setNewInitiativeText] = useState<{ [key: string]: string }>({});

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('crm_okr_objective_v2', objective);
  }, [objective]);

  useEffect(() => {
    localStorage.setItem('crm_okr_key_results_v2', JSON.stringify(keyResults));
  }, [keyResults]);

  // Handle ticking initiative checkbox
  const handleToggleInitiative = (krId: string, initId: string) => {
    const updated = keyResults.map((kr) => {
      if (kr.id === krId) {
        const updatedInits = kr.initiatives.map((init) => {
          if (init.id === initId) {
            return { ...init, done: !init.done };
          }
          return init;
        });
        return { ...kr, initiatives: updatedInits };
      }
      return kr;
    });
    setKeyResults(updated);
  };

  // Add custom initiative
  const handleAddInitiative = (krId: string) => {
    const text = newInitiativeText[krId]?.trim();
    if (!text) return;

    const newInit: Initiative = {
      id: `custom-init-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text,
      done: false
    };

    const updated = keyResults.map((kr) => {
      if (kr.id === krId) {
        return { ...kr, initiatives: [...kr.initiatives, newInit] };
      }
      return kr;
    });

    setKeyResults(updated);
    setNewInitiativeText({
      ...newInitiativeText,
      [krId]: ''
    });
  };

  // Delete initiative
  const handleDeleteInitiative = (krId: string, initId: string) => {
    const updated = keyResults.map((kr) => {
      if (kr.id === krId) {
        return {
          ...kr,
          initiatives: kr.initiatives.filter(init => init.id !== initId)
        };
      }
      return kr;
    });
    setKeyResults(updated);
  };

  // Handle objective save
  const handleSaveObjective = () => {
    const trimmed = editedObjectiveText.trim();
    if (trimmed) {
      setObjective(trimmed);
    }
    setIsEditingObjective(false);
  };

  // Handle Edit KR action trigger
  const handleStartEditKR = (kr: KeyResult) => {
    setEditingKRId(kr.id);
    setEditedKRTitle(kr.title);
    setEditedKRTarget(kr.targetValue);
  };

  const handleSaveKRDetails = (krId: string) => {
    const updated = keyResults.map((kr) => {
      if (kr.id === krId) {
        return {
          ...kr,
          title: editedKRTitle.trim() || kr.title,
          targetValue: editedKRTarget.trim() || kr.targetValue
        };
      }
      return kr;
    });
    setKeyResults(updated);
    setEditingKRId(null);
  };

  // Reset entire dashboard OKRs to default
  const handleResetToDefaults = () => {
    if (window.confirm("Apakah Anda yakin ingin menyetel ulang seluruh data inisiatif OKR ini ke semula?")) {
      setObjective(DEFAULT_OBJECTIVE);
      setEditedObjectiveText(DEFAULT_OBJECTIVE);
      setKeyResults(DEFAULT_KEY_RESULTS);
      setIsEditingObjective(false);
      setEditingKRId(null);
      setNewInitiativeText({});
    }
  };

  // Mathematical progress calculations
  const calculateKRProgress = (kr: KeyResult) => {
    if (!kr.initiatives || kr.initiatives.length === 0) return 0;
    const completed = kr.initiatives.filter(init => init.done).length;
    return Math.round((completed / kr.initiatives.length) * 100);
  };

  const totalWeightedProgress = Math.round(
    keyResults.reduce((acc, kr) => acc + calculateKRProgress(kr), 0) / (keyResults.length || 1)
  );

  // Dynamic feedback comments based on achievement rate
  const getStrategicFeedback = (percent: number) => {
    if (percent === 100) {
      return {
        label: "🏆 Arsitektur Sempurna & OKR Tercapai 100%!",
        color: "bg-emerald-50 border-emerald-200 text-emerald-800",
        message: "Luar biasa! Seluruh inisiatif operasional, pemodelan data, dan simulasi strategi CRM Anda telah rampung divalidasi. Seluruh sirkulasi pipeline, analisis kualifikasi, dan proyeksi loyalitas sekarang terintegrasi menyeluruh."
      };
    }
    if (percent >= 70) {
      return {
        label: "⚡ Akselerasi Strategis Tinggi (Progres Sangat Baik)",
        color: "bg-cyan-50 border-cyan-200 text-cyan-800",
        message: "Progres luar biasa! Anda telah menjembatani sebagian besar teori dengan praktik langsung menggunakan pemodelan kalkulator. Tuntaskan beberapa inisiatif sisa untuk menyematkan keutuhan arsitektur CRM Mastery Anda."
      };
    }
    if (percent >= 35) {
      return {
        label: "📈 Target Mulai Terarah (Progres Menengah)",
        color: "bg-amber-50 border-amber-200 text-amber-800",
        message: "Rencana strategis mulai terealisasi. Silakan berlanjut ke menu 'Tools' untuk mengebor parameter kualifikasi BANT secara dinamis, mengunduh blueprint, atau melakukan simulasi order berulang pada kalkulator LTV."
      };
    }
    return {
      label: "📌 Perencanaan Terbuka (Siap Memulai)",
      color: "bg-slate-50 border-slate-250 text-slate-700",
      message: "Sasaran strategis telah dipetakan dengan rapi. Mari kita lakukan eksplorasi taktis: centang inisiatif yang telah Anda lakukan atau gunakan tools CRM interaktif untuk memulai progres kelas hari ini!"
    };
  };

  const currentFeedback = getStrategicFeedback(totalWeightedProgress);

  return (
    <div className="p-4 lg:p-8 space-y-8 select-none font-sans text-left max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50/40 rounded-full blur-3xl pointer-events-none -translate-x-6 translate-y-6"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-cyan-100 text-cyan-800 rounded-md font-semibold font-sans">
                Portal Kelas
              </span>
              <span className="text-slate-400 font-mono text-xs">Main Dashboard</span>
            </div>
            <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Selamat Datang, {userEmail.split('@')[0]}
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl">
              Anda telah berhasil masuk ke Dashboard pembelajaran CRM Mastery. Gunakan papan sasaran interaktif di bawah ini untuk merancang, mengkuantifikasi, serta menguji inisiatif peningkatan efisiensi organisasi Anda.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('tools')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lightbulb className="h-4 w-4" />
              Buka Tools & Kalkulator
            </button>
            <button
              onClick={() => onNavigateTab('resources')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer"
            >
              <BookOpen className="h-4 w-4" />
              Buka Dokumen Handbook
            </button>
          </div>
        </div>
      </div>

      {/* OBJECTIVE: Master Card */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl p-6 lg:p-8 relative overflow-hidden">
        {/* Glow indicator decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 space-y-6">
          {/* Badge & Setel Ulang Action */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Target className="h-4 w-4" />
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-cyan-400 mb-0.5">
                SASARAN UTAMA STRATEGIS (OBJECTIVE)
              </span>
            </div>
            
            <button
              onClick={handleResetToDefaults}
              className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer border border-slate-800 hover:border-rose-500/30 px-2.5 py-1 rounded-lg bg-slate-950 font-mono font-medium flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Sasaran OKR
            </button>
          </div>

          {/* Objective Title Edit block */}
          <div className="space-y-2">
            {isEditingObjective ? (
              <div className="space-y-3">
                <textarea
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all leading-relaxed"
                  value={editedObjectiveText}
                  onChange={(e) => setEditedObjectiveText(e.target.value)}
                  rows={2}
                  maxLength={200}
                  placeholder="Ketik deskripsi sasaran utama yang baru disini..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveObjective}
                    className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                    Simpan Perubahan
                  </button>
                  <button
                    onClick={() => {
                      setEditedObjectiveText(objective);
                      setIsEditingObjective(false);
                    }}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4 group">
                <h2 className="font-display text-xl lg:text-2xl font-extrabold tracking-tight text-white leading-snug">
                  "{objective}"
                </h2>
                <button
                  onClick={() => {
                    setEditedObjectiveText(objective);
                    setIsEditingObjective(true);
                  }}
                  className="text-slate-400 hover:text-cyan-400 shrink-0 p-1.5 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Edit Sasaran Utama"
                >
                  <Edit3 className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
          </div>

          {/* Objective Progress Block */}
          <div className="border-t border-slate-800 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div>
                <span className="text-[10px] font-mono text-slate-400 tracking-wider block uppercase">Progress Hasil Kumulatif</span>
                <span className="text-sm font-bold text-slate-200">Berdasarkan penyelesaian inisiatif pada 3 Key Results</span>
              </div>
              <div className="flex items-baseline gap-1 bg-slate-950 px-4 py-2 border border-slate-850 rounded-xl w-fit">
                <span className="text-3xl font-black font-mono text-cyan-400">{totalWeightedProgress}%</span>
                <span className="text-[11px] font-mono text-slate-400">selesai</span>
              </div>
            </div>

            {/* Combined Bar */}
            <div className="w-full bg-slate-950 border border-slate-800 h-3.5 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${totalWeightedProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Strategic Feedback Alertbox */}
          <div className={`p-4 rounded-xl border flex gap-3.5 transition-all text-xs duration-300 ${currentFeedback.color}`}>
            <Award className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block tracking-tight font-display">{currentFeedback.label}</span>
              <p className="leading-relaxed text-[11px] opacity-90">{currentFeedback.message}</p>
            </div>
          </div>
        </div>
      </div>

      {/* GRID SECTION: 3 KEY RESULTS & INITIATIVE LISTS */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-4.5 w-4.5 text-cyan-600" />
          <h3 className="font-display text-base font-extrabold text-slate-900 uppercase tracking-tight">
            Metrik & Inisiatif Hasil Kunci (3 Key Results)
          </h3>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {keyResults.map((kr, krIdx) => {
            const isEditingThisKR = editingKRId === kr.id;
            const progress = calculateKRProgress(kr);

            return (
              <div 
                key={kr.id} 
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col hover:border-slate-300 transition-colors"
              >
                {/* Custom Card Header */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex-1 flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-black text-cyan-600 uppercase tracking-widest bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                      KEY RESULT 0{krIdx + 1}
                    </span>
                    
                    {!isEditingThisKR && (
                      <button
                        onClick={() => handleStartEditKR(kr)}
                        className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1"
                        title="Edit Target KR"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {isEditingThisKR ? (
                    <div className="space-y-2.5 bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <label className="text-[9px] font-mono text-slate-500 font-bold block mb-1">Judul Hasil Kunci</label>
                        <input
                          type="text"
                          className="w-full text-xs font-bold text-slate-805 bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded px-2 py-1 focus:outline-none"
                          value={editedKRTitle}
                          onChange={(e) => setEditedKRTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-slate-500 font-bold block mb-1">Target Batas Tolok Ukur</label>
                        <input
                          type="text"
                          className="w-full text-xs font-semibold text-slate-805 bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded px-2 py-1 focus:outline-none"
                          value={editedKRTarget}
                          onChange={(e) => setEditedKRTarget(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-1.5 pt-1">
                        <button
                          onClick={() => handleSaveKRDetails(kr.id)}
                          className="px-2.5 py-1 bg-slate-900 text-white font-bold text-[10px] rounded hover:bg-slate-850 cursor-pointer flex items-center gap-1"
                        >
                          <Check className="h-3 w-3 stroke-[2.5]" />
                          Simpan
                        </button>
                        <button
                          onClick={() => setEditingKRId(null)}
                          className="px-2.5 py-1 border border-slate-200 text-slate-500 font-semibold text-[10px] rounded hover:bg-slate-50 cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-display font-black text-slate-900 text-sm tracking-tight leading-snug">
                        {kr.title}
                      </h4>
                      <p className="text-xs text-cyan-600 font-bold mt-1 leading-snug">
                        Target: {kr.targetValue}
                      </p>
                    </div>
                  )}

                  {/* Dynamic Progress indicator */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400 font-medium">Tingkat Capaian KR:</span>
                      <span className="text-slate-900 font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          progress === 100 
                            ? 'bg-emerald-500' 
                            : progress > 35 ? 'bg-cyan-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Checklist Initiatives Container */}
                <div className="p-5 flex-2 flex flex-col space-y-4">
                  <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wider">
                    Daftar Inisiatif Taktis ({kr.initiatives?.length || 0})
                  </span>

                  {kr.initiatives && kr.initiatives.length > 0 ? (
                    <div className="space-y-3 flex-1">
                      {kr.initiatives.map((init) => (
                        <div 
                          key={init.id} 
                          className="flex items-start justify-between gap-3 group/init p-2 rounded-xl border border-slate-50 hover:bg-slate-50/70 hover:border-slate-200/60 transition-all text-xs"
                        >
                          <label className="flex items-start gap-2.5 cursor-pointer flex-1 select-none">
                            <input
                              type="checkbox"
                              checked={init.done}
                              onChange={() => handleToggleInitiative(kr.id, init.id)}
                              className="mt-0.5 h-4 w-4 accent-cyan-600 cursor-pointer border-slate-300 rounded focus:ring-0"
                            />
                            <span className={`leading-relaxed text-[11px] ${
                              init.done ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700 font-medium'
                            }`}>
                              {init.text}
                            </span>
                          </label>
                          
                          <button
                            onClick={() => handleDeleteInitiative(kr.id, init.id)}
                            className="opacity-0 group-hover/init:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-1 cursor-pointer shrink-0"
                            title="Hapus inisiatif"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 py-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col justify-center items-center">
                      <AlertCircle className="h-6 w-6 text-slate-300 mb-1.5" />
                      <span className="block text-[11px] text-slate-700 font-bold">Inisiatif Kosong</span>
                      <span className="block text-[9px] text-slate-405 mt-0.5">Gunakan form di bawah untuk menambahkan inisiatif kustom.</span>
                    </div>
                  )}

                  {/* Add Initiative small input form */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddInitiative(kr.id);
                    }}
                    className="flex gap-2 pt-2 border-t border-slate-100"
                  >
                    <input
                      type="text"
                      className="flex-1 bg-slate-50/80 border border-slate-200 focus:border-cyan-500 focus:bg-white rounded-lg px-2.5 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
                      placeholder="Tambah inisiatif custom..."
                      value={newInitiativeText[kr.id] || ''}
                      onChange={(e) => setNewInitiativeText({
                        ...newInitiativeText,
                        [kr.id]: e.target.value
                      })}
                      maxLength={120}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddInitiative(kr.id)}
                      className="p-1.5 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm transition-all flex items-center justify-center shrink-0 cursor-pointer"
                      title="Tambah inisiatif"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </form>

                  {/* Quick-link Associated Tools helper */}
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => onNavigateTab(kr.toolTab)}
                      className="w-full text-left bg-slate-50 hover:bg-slate-100 px-3 py-2.5 rounded-xl border border-slate-150 flex items-start gap-2 group transition-colors cursor-pointer text-xs"
                    >
                      <Lightbulb className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5 group-hover:text-cyan-700 transition-colors" />
                      <div>
                        <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1 group-hover:text-cyan-950">
                          <span>Uji dengan Tools Pendukung</span>
                          <ChevronRight className="h-3 w-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                          {kr.toolHint}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
