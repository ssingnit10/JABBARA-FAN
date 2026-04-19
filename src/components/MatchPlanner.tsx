import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Clock, Plus, Users, X, Info } from 'lucide-react';
import { Meetup } from '../types';
import { useNotifications } from '../context/NotificationContext';

const MOCK_MEETUPS: Meetup[] = [
  {
    id: '1',
    title: 'RCB vs CSK Mega Viewing',
    matchId: '1',
    date: '2026-04-20',
    time: '19:00',
    location: 'Cubbon Park, Bangalore',
    organizer: 'Sunil_TrueFan',
    attendees: 45,
    description: 'Bringing the stadium vibes to the park. Big screen and chants ready!'
  },
  {
    id: '2',
    title: 'Yellow Army Gathering',
    matchId: '1',
    date: '2026-04-20',
    time: '18:30',
    location: 'Chepauk Fans Corner',
    organizer: 'ChennaiSuperFan',
    attendees: 120,
    description: 'Special screening for the high voltage match. Whistle Podu!'
  }
];

export const MatchPlanner: React.FC = () => {
  const [meetups, setMeetups] = useState<Meetup[]>(MOCK_MEETUPS);
  const [showModal, setShowModal] = useState(false);
  const { addNotification } = useNotifications();
  const [newMeetup, setNewMeetup] = useState<Partial<Meetup>>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetup.title || !newMeetup.date || !newMeetup.time || !newMeetup.location) return;

    const meetup: Meetup = {
      id: Date.now().toString(),
      title: newMeetup.title || '',
      matchId: '1',
      date: newMeetup.date || '',
      time: newMeetup.time || '',
      location: newMeetup.location || '',
      organizer: 'You',
      attendees: 1,
      description: newMeetup.description || ''
    };

    setMeetups(prev => [meetup, ...prev]);
    setShowModal(false);
    setNewMeetup({ title: '', date: '', time: '', location: '', description: '' });
    addNotification('meetup', 'Meetup Created!', `Your meetup "${meetup.title}" is now live!`);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-white uppercase italic">Match Planner</h2>
          <p className="text-white/50 text-sm">Coordinate viewing parties, fan walks, and stadium meetups.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-accent-gold text-blue-900 rounded-full font-black text-sm hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-accent-gold/20"
        >
          <Plus size={18} />
          Plan Meetup
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {meetups.map((meetup) => (
            <MeetupCard key={meetup.id} meetup={meetup} />
          ))}
        </AnimatePresence>
      </div>

      {/* Create Meetup Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-blue-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg glass-dark p-8 relative z-10 border-white/20"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 text-white/30 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-display font-black text-white mb-6 uppercase tracking-tight">Create New Meetup</h3>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-accent-gold uppercase tracking-widest mb-1 block">Meetup Title</label>
                  <input 
                    type="text" 
                    required
                    value={newMeetup.title}
                    onChange={e => setNewMeetup(p => ({ ...p, title: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent-gold transition-colors"
                    placeholder="e.g. South Stand Pre-match Chant"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-accent-gold uppercase tracking-widest mb-1 block">Date</label>
                    <input 
                      type="date" 
                      required
                      value={newMeetup.date}
                      onChange={e => setNewMeetup(p => ({ ...p, date: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-accent-gold uppercase tracking-widest mb-1 block">Time</label>
                    <input 
                      type="time" 
                      required
                      value={newMeetup.time}
                      onChange={e => setNewMeetup(p => ({ ...p, time: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent-gold transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-accent-gold uppercase tracking-widest mb-1 block">Location</label>
                  <input 
                    type="text" 
                    required
                    value={newMeetup.location}
                    onChange={e => setNewMeetup(p => ({ ...p, location: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent-gold transition-colors"
                    placeholder="Enter venue or landmark"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-accent-gold uppercase tracking-widest mb-1 block">Description</label>
                  <textarea 
                    value={newMeetup.description}
                    onChange={e => setNewMeetup(p => ({ ...p, description: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent-gold transition-colors h-24"
                    placeholder="What's the plan?"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-accent-gold text-blue-900 font-black rounded-xl hover:scale-[1.02] transition-transform active:scale-95 shadow-xl shadow-accent-gold/20 uppercase tracking-widest text-sm"
                >
                  Create Meetup
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MeetupCard: React.FC<{ meetup: Meetup }> = ({ meetup }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="glass p-6 flex flex-col gap-4 relative overflow-hidden group border-white/10 hover:border-white/20 transition-all shadow-lg"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Calendar size={64} className="text-white" />
      </div>

      <div className="flex-1">
        <h4 className="text-xl font-display font-bold text-white mb-2 leading-tight">{meetup.title}</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Calendar size={14} className="text-accent-gold" />
            <span>{meetup.date}</span>
            <Clock size={14} className="text-accent-gold ml-2" />
            <span>{meetup.time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
            <MapPin size={14} className="text-accent-gold" />
            <span>{meetup.location}</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-white/50 line-clamp-2 leading-relaxed italic">
          "{meetup.description}"
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black border border-white/10">
            {meetup.organizer[0]}
          </div>
          <div className="text-[10px]">
            <p className="text-white/40 font-mono tracking-widest uppercase mb-0.5">Organizer</p>
            <p className="text-white font-bold tracking-tight">@{meetup.organizer}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <Users size={12} className="text-accent-gold" />
          <span className="text-[10px] font-bold text-white">{meetup.attendees}</span>
        </div>
      </div>
      
      <button className="mt-2 w-full py-2.5 bg-white/10 border border-white/10 rounded-xl text-xs font-black text-white hover:bg-white/20 transition-all uppercase tracking-widest active:scale-95">
        View & Join
      </button>
    </motion.div>
  );
};
