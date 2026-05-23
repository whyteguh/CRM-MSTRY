import React from 'react';
import { 
  FolderLock, 
  ExternalLink,
  Zap,
  BookOpen,
  ArrowRight,
  FileText
} from 'lucide-react';

interface ResourcesViewProps {
  onMarkViewed: () => void;
}

export default function ResourcesView({ onMarkViewed }: ResourcesViewProps) {
  const googleDriveLink = "https://drive.google.com/drive/folders/1Lg9XQCmxQpfIOe1hbepLwwBanX7VpwT6?usp=sharing";

  const handleAccessDrive = () => {
    // Notify parental workshop tracker of user's interaction/progress
    onMarkViewed();
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 text-left max-w-4xl mx-auto font-sans">
      {/* Page Header */}
      <div className="border-b border-slate-200/60 pb-6">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-600">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            CRM Training Hub
          </span>
        </div>
        <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
          Materi Pembelajaran & Dokumen Referensi
        </h1>
        <p className="text-slate-505 text-slate-550 text-slate-500 text-sm mt-1 leading-relaxed">
          Semua dokumen pelatihan, draf modul CRM, dan lembar kerja pendukung kini disatukan dalam satu folder Google Drive bersama.
        </p>
      </div>

      {/* Main Single Centralized Google Drive Access Module */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg p-6 lg:p-10 text-center relative overflow-hidden transition-all hover:shadow-xl hover:border-indigo-200 group">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-300"></div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-505/10 transition-all duration-300"></div>

        <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2.5xl flex items-center justify-center text-indigo-600 mb-6 border border-indigo-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
          <FolderLock className="h-8 w-8" />
        </div>

        <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight mb-3">
          Akses Repositori Google Drive CRM
        </h2>
        
        <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed mb-8">
          Temukan handbook komprehensif, template penilaian RFP vendor, panduan diagram webhook teknis, serta spreadsheet simulasi ROI secara lengkap di folder Google Drive kami. Klik tombol di bawah untuk membuka repositori materi.
        </p>

        {/* The Action Card Link Button */}
        <div className="max-w-md mx-auto">
          <a
            href={googleDriveLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAccessDrive}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-sm py-4 px-6 rounded-2xl shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 transition-all text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <span>Buka Google Drive Materi</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Feature breakdown metrics below the main CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 mt-10 pt-8 max-w-2xl mx-auto text-left">
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-start gap-3">
            <span className="p-1 bg-indigo-50 text-indigo-600 rounded">
              <FileText className="h-3.5 w-3.5" />
            </span>
            <div>
              <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">Materi Modul 1-3</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">Panduan komprehensif implementasi CRM & Webhook payload.</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-start gap-3">
            <span className="p-1 bg-indigo-50 text-indigo-600 rounded">
              <Zap className="h-3.5 w-3.5" />
            </span>
            <div>
              <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">CRM Handbook PDF</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">Buku panduan utama untuk program pelatihan CRM Mastery.</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-start gap-3">
            <span className="p-1 bg-indigo-50 text-indigo-600 rounded">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <div>
              <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">Template & Kalkulator</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">Spreadsheet penilai vendor RFP dan pemodelan LTV pelanggan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
