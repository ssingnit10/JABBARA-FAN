import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, Calendar, Map, Bell, Settings, Trophy, MessageSquare } from 'lucide-react';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-20 md:w-64 flex flex-col h-full bg-black/10 backdrop-blur-md border-r border-white/10 p-4">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-2xl bg-accent-gold flex items-center justify-center shadow-lg shadow-accent-gold/20">
          <Trophy className="text-blue-900" size={20} />
        </div>
        <span className="hidden md:block font-display font-black text-xl tracking-tighter text-white">JABBARA-FAN</span>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <NavButton 
          icon={<LayoutDashboard />} 
          label="Stadium" 
          active={activeTab === 'stadium'} 
          onClick={() => setActiveTab('stadium')} 
        />
        <NavButton 
          icon={<Users />} 
          label="Tribes" 
          active={activeTab === 'tribes'} 
          onClick={() => setActiveTab('tribes')} 
        />
        <NavButton 
          icon={<Calendar />} 
          label="Match Planner" 
          active={activeTab === 'planner'} 
          onClick={() => setActiveTab('planner')} 
        />
        <NavButton 
          icon={<Map />} 
          label="Fan Parks" 
          active={activeTab === 'parks'} 
          onClick={() => setActiveTab('parks')} 
        />
      </div>

      <div className="pt-4 mt-auto border-t border-white/10 flex flex-col gap-2">
        <NavButton icon={<Bell />} label="Alerts" active={false} onClick={() => {}} />
        <NavButton icon={<Settings />} label="Tuning" active={false} onClick={() => {}} />
        
        <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 hidden md:block">
           <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse"></div>
              <span className="text-[10px] font-bold text-white/50 uppercase font-mono">My Loyalty</span>
           </div>
           <p className="text-xs font-bold text-white">RCB Bengaluru</p>
           <button className="mt-2 text-[10px] text-white/40 hover:text-white transition-colors">Change Team</button>
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
      active 
      ? 'bg-white/20 text-white shadow-lg border border-white/20' 
      : 'text-white/60 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className={active ? 'text-accent-gold' : ''}>
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    </div>
    <span className="hidden md:block text-sm font-bold">{label}</span>
    {active && <motion.div layoutId="nav-pill" className="hidden md:block ml-auto w-1 h-4 rounded-full bg-accent-gold" />}
  </button>
);
