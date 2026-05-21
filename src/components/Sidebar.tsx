import React, { useState } from 'react';
import { 
  BarChart3, 
  FolderOpen, 
  Wrench, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X, 
  CalendarCheck, 
  User,
  Clock
} from 'lucide-react';

interface SidebarProps {
  currentTab: 'dashboard' | 'resources' | 'tools' | 'community';
  onTabChange: (tab: 'dashboard' | 'resources' | 'tools' | 'community') => void;
  onLogout: () => void;
  userEmail: string;
}

export default function Sidebar({ currentTab, onTabChange, onLogout, userEmail }: SidebarProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Hub', icon: BarChart3, desc: 'Pusat aktivitas kelas' },
    { id: 'resources', label: 'Modul & Handbook', icon: FolderOpen, desc: 'Slides, sheets & panduan materi' },
    { id: 'tools', label: 'Tools Architecting', icon: Wrench, desc: 'Simulasi LTV & arsitektur CRM' },
    { id: 'community', label: 'Komunitas Diskusi', icon: MessageSquare, desc: 'Tanya jawab & opini antar peserta' },
  ] as const;

  const handleTabClick = (tabId: 'dashboard' | 'resources' | 'tools' | 'community') => {
    onTabChange(tabId);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div id="mobile-top-bar" className="lg:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-3 border-b border-slate-800 sticky top-0 z-40 w-full">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-cyan-400 to-blue-600 p-1.5 rounded-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-medium text-sm tracking-tight text-white">
            CRM Mastery Hub
          </span>
        </div>

        <button
          id="mobile-menu-toggle"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isOpenMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Slide-in Mobile Drawer */}
      {isOpenMobile && (
        <div id="mobile-drawer-overlay" className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop screen */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpenMobile(false)}
          />

          {/* Drawer content */}
          <div className="relative flex flex-col w-4/5 max-w-xs bg-slate-900 border-r border-slate-800 p-5 z-50 text-white overflow-y-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-tr from-cyan-400 to-blue-600 p-1.5 rounded-lg">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <span className="font-display font-medium text-sm tracking-tight">CRM Mastery</span>
              </div>
              <button 
                onClick={() => setIsOpenMobile(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Navigation Menus */}
            <nav className="space-y-1.5 flex-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-start gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer text-left ${
                      isActive 
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-medium' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <div>
                      <span className="block text-sm">{item.label}</span>
                      <span className="block text-[10px] text-slate-500 font-normal">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* User Session Footer */}
            <div className="mt-auto border-t border-slate-800 pt-4 text-left">
              <div className="flex items-center gap-2.5 mb-4 p-2 bg-slate-950 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <div className="overflow-hidden">
                  <span className="block text-xs font-semibold text-slate-300 truncate">{userEmail}</span>
                  <span className="block text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Peserta Terpilih
                  </span>
                </div>
              </div>

              <button
                id="mobile-logout-btn"
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white transition-colors cursor-pointer text-xs font-medium"
              >
                <LogOut className="h-3.5 w-3.5" />
                Keluar Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Desktop Sidebar */}
      <aside id="desktop-sidebar" className="hidden lg:flex flex-col w-72 bg-slate-900 border-r border-slate-800 min-h-screen text-white sticky top-0 shrink-0 select-none">
        {/* Hub Logo Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-cyan-400 to-blue-600 p-2.5 rounded-xl shadow-lg border border-cyan-300/10">
              <CalendarCheck className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-tight text-white">
                CRM Mastery
              </span>
              <span className="block text-[10px] font-mono tracking-wider text-cyan-400 uppercase">INTERACTIVE HUB</span>
            </div>
          </div>
        </div>

        {/* Navigation Menus List */}
        <nav className="p-4 space-y-2 flex-1 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`desktop-nav-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-start gap-4 px-4 py-3.5 rounded-xl transition-all border cursor-pointer text-left ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/5 text-cyan-300 border-cyan-500/20 shadow-inner' 
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border-transparent'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${isActive ? 'text-cyan-400' : 'text-slate-500 transition-colors group-hover:text-slate-300'}`} />
                <div>
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="block text-[10px] text-slate-500 group-hover:text-slate-400 font-normal mt-0.5">{item.desc}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer detailing metadata session info */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/60 mt-auto text-left">
          <div className="flex items-start gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800/80 mb-4 font-sans">
            <div className="h-9 w-9 rounded-full bg-slate-850 flex items-center justify-center border border-slate-800 shrink-0 text-cyan-400">
              <Clock className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <span className="block text-xs font-semibold text-slate-300 truncate" title={userEmail}>
                {userEmail}
              </span>
              <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                Sesi Aktif (Live)
              </span>
            </div>
          </div>

          <button
            id="desktop-logout-btn"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white transition-all text-xs font-medium cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar Hub
          </button>
        </div>
      </aside>
    </>
  );
}
