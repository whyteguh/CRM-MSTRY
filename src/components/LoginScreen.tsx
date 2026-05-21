import React, { useState } from 'react';
import { KeyRound, Calendar, Award, ShieldAlert, CheckCircle2, UserCheck } from 'lucide-react';

interface LoginScreenProps {
  onUnlock: () => void;
}

export default function LoginScreen({ onUnlock }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const ACTUAL_PASSWORD = 'CRM2026';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorCode('Password wajib diisi');
      return;
    }

    setIsLoading(true);
    setErrorCode(null);

    // Simulate network authentication delay for premium feel
    setTimeout(() => {
      if (password.trim() === ACTUAL_PASSWORD) {
        setIsLoading(false);
        onUnlock();
      } else {
        setIsLoading(false);
        setErrorCode('Password workshop salah. Silakan coba lagi!');
      }
    }, 850);
  };

  return (
    <div id="login-container" className="min-h-screen grid lg:grid-cols-12 bg-slate-900 text-white overflow-hidden font-sans">
      {/* Decorative Branding Panel */}
      <div id="login-brand-panel" className="lg:col-span-7 bg-radial from-slate-800 to-slate-950 p-8 lg:p-16 flex flex-col justify-between relative">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-gradient-to-tr from-cyan-400 to-blue-600 p-2.5 rounded-xl shadow-lg border border-cyan-300/20">
            <UserCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-display font-medium text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              CRM Mastery
            </span>
            <span className="block text-[10px] font-mono tracking-wider text-cyan-400 uppercase">INTERACTIVE HUB</span>
          </div>
        </div>

        {/* Main Pitch */}
        <div className="my-16 lg:my-auto max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/20 mb-6 font-mono">
            <Calendar className="h-3 w-3" />
            <span>23 May 2026 - Malang</span>
          </div>
          
          <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">{`Panen Besar Dari Database Anda.`}</span>
          </h1>
          
          <p className="text-slate-350 text-base leading-relaxed mb-8">
            Selamat datang Di Workshop CRM Mastery. silakan masukkan password untuk mmengakses modul, handbook, dan tools yang digunakan selamat workshop belangsung.
          </p>

          {/* Agenda Highlights */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-850/40 rounded-xl border border-slate-800 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-cyan-400">
                <Award className="h-4 w-4" />
                <span>Modul Pembelajaran</span>
              </div>
              <p className="text-xs text-slate-400">akses materi pemabahasan selama di kelas</p>
            </div>
            
            <div className="p-4 bg-slate-850/40 rounded-xl border border-slate-800 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-blue-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Tools Architecting CRM</span>
              </div>
              <p className="text-xs text-slate-400">Akses aplikasi yang digunakan untuk mendesain arsitektur CRM</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright / Info */}
        <div className="text-xs text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/60 pt-6 relative z-10 uppercase">
          <span>hosted by incentric CX Consulting</span>
          <span>CRM-MSTR-2026</span>
        </div>
      </div>

      {/* Login Credentials Panel */}
      <div id="login-form-panel" className="lg:col-span-5 bg-slate-950 p-8 lg:p-16 flex flex-col justify-center border-l border-slate-800">
        <div className="max-w-md mx-auto w-full">
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-white mb-2">Akses Peserta</h2>
            <p className="text-sm text-slate-400">
              Silakan masukkan password resmi yang telah dibagikan oleh panitia untuk membuka akses dasbor interaktif.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="passcode-input" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password Workshop
              </label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="h-5 w-5" />
                </div>
                
                <input
                  id="passcode-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 font-mono transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              {errorCode && (
                <div className="mt-3 flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-left">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorCode}</span>
                </div>
              )}
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer text-sm font-sans"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Membuka Akses Dasbor...</span>
                </>
              ) : (
                <span>Masuk Ke Workshop Hub</span>
              )}
            </button>
          </form>

          {/* Privacy and Trust Footnote */}
          <div className="mt-12 text-center text-[11px] text-slate-600">
            <span className="block mb-1">Hubungan terenkripsi diaktifkan.</span>
            <span>Direktori ini khusus untuk anggota terdaftar Workshop CRM Mastery.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
