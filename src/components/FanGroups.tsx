import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Plus, Hash, Globe, Lock, Star } from 'lucide-react';
import { TEAMS } from '../constants';

const MOCK_GROUPS = [
  { id: '1', name: 'RCB Loyalists', type: 'team', teamId: 'rcb', members: 4520, description: 'Ee Sala Cup Namde! Discussion on match strategies.' },
  { id: '2', name: 'CSK Whistle Podu', type: 'team', teamId: 'csk', members: 8900, description: 'The yellow army global hub. MSD fans welcome.' },
  { id: '3', name: 'Bangalore Meetup Park', type: 'interest', members: 120, description: 'Coordinating meetup at the Cubbon Park Big Screen.' },
  { id: '4', name: 'Fantasy Kings', type: 'interest', members: 1200, description: 'Dream 11 tips and selection strategies for IPL.' },
];

import { useNotifications } from '../context/NotificationContext';

export const FanGroups: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const { addNotification } = useNotifications();

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-white uppercase italic">Fan Tribes</h2>
          <p className="text-white/50 text-sm">Join a group of like-minded fans and coordinate your roar.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-accent-gold text-blue-900 rounded-full font-black text-sm hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-accent-gold/20">
          <Plus size={18} />
          Create Tribe
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All Tribes</TabButton>
        <TabButton active={activeTab === 'my'} onClick={() => setActiveTab('my')}>My Tribes</TabButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_GROUPS.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};

const TabButton = ({ active, children, onClick }: { active: boolean, children: React.ReactNode, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all border ${
      active ? 'bg-white text-blue-900 border-white scale-105 shadow-lg' : 'bg-white/10 text-white/50 border-white/10 hover:bg-white/20'
    }`}
  >
    {children}
  </button>
);

const GroupCard = ({ group }: { group: any; key?: string }) => {
  const team = TEAMS.find(t => t.id === group.teamId);
  const { addNotification } = useNotifications();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass p-6 relative overflow-hidden flex flex-col h-[220px]"
    >
      {team && (
        <div 
          className="absolute -top-12 -right-12 w-24 h-24 rounded-full opacity-20 blur-2xl"
          style={{ backgroundColor: team.color }}
        ></div>
      )}
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
             {group.type === 'team' ? <Star size={20} className="text-accent-gold" /> : <Hash size={20} className="text-white/40" />}
          </div>
          <div>
            <h4 className="font-display font-bold text-lg text-white">{group.name}</h4>
            <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono tracking-tighter">
              <Users size={12} className="text-accent-gold" />
              <span>{group.members.toLocaleString()} MEMBERS</span>
              <span className="w-1 h-1 rounded-full bg-white/10"></span>
              <Globe size={12} />
              <span>PUBLIC</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
          {group.description}
        </p>
      </div>

      <div className="mt-auto pt-6 flex items-center justify-between gap-4">
        <button className="flex-1 text-xs font-bold text-white hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/20">
          Preview
        </button>
        <button 
          onClick={() => addNotification('message', 'Tribe Joined!', `You are now a member of ${group.name}. Start cheering!`)}
          className="flex-1 text-xs font-bold px-4 py-2 bg-white text-blue-900 rounded-xl hover:bg-white transition-colors"
        >
          Join
        </button>
      </div>
    </motion.div>
  );
};
