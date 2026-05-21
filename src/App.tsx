import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ResourcesView from './components/ResourcesView';
import ToolsView from './components/ToolsView';
import CommunityView from './components/CommunityView';

export default function App() {
  const USER_EMAIL = 'incentric.id@gmail.com';

  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'resources' | 'tools' | 'community'>('dashboard');

  // Completed class progress tasks tracker state variables
  const [completedTasks, setCompletedTasks] = useState({
    unlockedHub: false,
    resourcesViewed: false,
    toolCalculations: 0,
    ticketSent: false
  });

  // Local Storage syncing to preserve session experience
  useEffect(() => {
    const sessionAuth = localStorage.getItem('crm_workshop_unlocked');
    if (sessionAuth === 'true') {
      setIsUnlocked(true);
      setCompletedTasks(prev => ({ ...prev, unlockedHub: true }));
    }

    const savedProgress = localStorage.getItem('crm_workshop_progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setCompletedTasks(parsed);
      } catch (e) {
        // Fallback
      }
    }
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    localStorage.setItem('crm_workshop_unlocked', 'true');
    
    setCompletedTasks(prev => {
      const updated = { ...prev, unlockedHub: true };
      localStorage.setItem('crm_workshop_progress', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    localStorage.removeItem('crm_workshop_unlocked');
    localStorage.removeItem('crm_workshop_progress');
    localStorage.removeItem('crm_workshop_tickets');
    
    // Reset states
    setCurrentTab('dashboard');
    setCompletedTasks({
      unlockedHub: false,
      resourcesViewed: false,
      toolCalculations: 0,
      ticketSent: false
    });
  };

  const handleMarkResourceViewed = () => {
    setCompletedTasks(prev => {
      const updated = { ...prev, resourcesViewed: true };
      localStorage.setItem('crm_workshop_progress', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRunCalculation = () => {
    setCompletedTasks(prev => {
      const updated = { ...prev, toolCalculations: prev.toolCalculations + 1 };
      localStorage.setItem('crm_workshop_progress', JSON.stringify(updated));
      return updated;
    });
  };

  const handleTicketSent = () => {
    setCompletedTasks(prev => {
      const updated = { ...prev, ticketSent: true };
      localStorage.setItem('crm_workshop_progress', JSON.stringify(updated));
      return updated;
    });
  };

  if (!isUnlocked) {
    return <LoginScreen onUnlock={handleUnlock} />;
  }

  return (
    <div id="portal-root" className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-800">
      {/* Sidebar - responsive Left Menu */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={(tab) => setCurrentTab(tab)} 
        onLogout={handleLogout}
        userEmail={USER_EMAIL}
      />

      {/* Main Core View Area */}
      <main id="portal-main-panel" className="flex-1 overflow-x-hidden min-h-[calc(100vh-53px)] lg:min-h-screen flex flex-col bg-slate-100/40">
        
        {/* Dynamic Inner Panel routing */}
        <div className="flex-1 animate-fadeIn pb-16">
          {currentTab === 'dashboard' && (
            <DashboardView 
              userEmail={USER_EMAIL} 
              onNavigateTab={(tab) => setCurrentTab(tab)}
              completedTasks={completedTasks}
            />
          )}

          {currentTab === 'resources' && (
            <ResourcesView onMarkViewed={handleMarkResourceViewed} />
          )}

          {currentTab === 'tools' && (
            <ToolsView onCalculateRun={handleRunCalculation} />
          )}

          {currentTab === 'community' && (
            <CommunityView userEmail={USER_EMAIL} />
          )}
        </div>

        {/* Human Literal footer bar */}
        <footer className="py-4 px-6 lg:px-8 border-t border-slate-200/60 text-slate-400 text-xs flex flex-col sm:flex-row justify-between items-center bg-white/50 backdrop-blur-sm gap-2">
          <span>CRM Mastery INTERACTIVE HUB &copy; 2026. Oleh incentric CX Consulting. Semua hak cipta dilindungi.</span>
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span>Akun Peserta: <strong className="text-slate-600">{USER_EMAIL}</strong></span>
            <span>Kode Event: <strong className="text-slate-600">CRM-MSTR-2026</strong></span>
          </div>
        </footer>
      </main>
    </div>
  );
}
