import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Users, Zap, MessageSquare, TrendingUp, CloudRain, MapPin, Calendar, Languages } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TEAMS, MOCK_MATCHES } from '../constants';
import { Team, Match } from '../types';

const sentimentData = [
  { time: '19:30', sentiment: 0.2 },
  { time: '19:45', sentiment: 0.5 },
  { time: '20:00', sentiment: 0.3 },
  { time: '20:15', sentiment: 0.7 },
  { time: '20:30', sentiment: 0.8 },
  { time: '20:45', sentiment: 0.6 },
  { time: '21:00', sentiment: 0.9 },
];

import { useNotifications } from '../context/NotificationContext';

export const StadiumDashboard: React.FC = () => {
  const [match, setMatch] = useState<Match>(MOCK_MATCHES[0]);
  const [liveFans, setLiveFans] = useState(12405);
  const { addNotification } = useNotifications();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveFans(prev => prev + Math.floor(Math.random() * 10) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simulate random match events
  useEffect(() => {
    const events = [
      { type: 'match', title: 'WICKET!', message: 'Virat Kohli has been caught! Stadium silent... then roaring!' },
      { type: 'match', title: 'MAXIMUM!', message: 'That went into the second tier! 110m monster.' },
      { type: 'meetup', title: 'MEETUP ALERT', message: 'Fans are gathering at the South Stand entrance for the 40th over chant.' }
    ];

    const eventInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const event = events[Math.floor(Math.random() * events.length)];
        addNotification(event.type as any, event.title, event.message);
      }
    }, 15000);

    return () => clearInterval(eventInterval);
  }, [addNotification]);

  // Simulate real-time score updates
  useEffect(() => {
    const scoreInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setMatch(prev => {
          const isTeamA = Math.random() > 0.5;
          const runChange = Math.random() > 0.7 ? 4 : (Math.random() > 0.5 ? 6 : 1);
          
          if (isTeamA) {
            // Check if score is in runs/wickets format
            const scoreParts = prev.scoreA.split('/');
            if (scoreParts.length === 2) {
              const runs = parseInt(scoreParts[0]);
              const wickets = parseInt(scoreParts[1]);
              const newRuns = runs + runChange;
              if (runChange === 4 || runChange === 6) {
                addNotification('match', `${runChange === 6 ? 'SIX' : 'FOUR'}!`, `${prev.teamA.shortName} scores ${runChange}!`);
              }
              return { ...prev, scoreA: `${newRuns}/${wickets}` };
            }
            return prev;
          } else {
            const scoreParts = prev.scoreB.split('/');
            if (scoreParts.length === 2) {
              const runs = parseInt(scoreParts[0]);
              const wickets = parseInt(scoreParts[1]);
              const newRuns = runs + runChange;
              if (runChange === 4 || runChange === 6) {
                addNotification('match', `${runChange === 6 ? 'SIX' : 'FOUR'}!`, `${prev.teamB.shortName} scores ${runChange}!`);
              }
              return { ...prev, scoreB: `${newRuns}/${wickets}` };
            }
            return prev;
          }
        });
      }
    }, 10000);

    return () => clearInterval(scoreInterval);
  }, [addNotification]);

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto">
      {/* Live Match Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden glass p-8 shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-4">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/30 text-white text-xs font-bold animate-pulse border border-red-500/50">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            LIVE
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex flex-col items-center gap-4 text-center md:w-1/3">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-5xl shadow-xl border-4 border-white/20 backdrop-blur-md" style={{ borderColor: match.teamA.color }}>
              {match.teamA.logo}
            </div>
            <div>
              <h2 className="text-2xl font-display font-extrabold tracking-tight text-white">{match.teamA.shortName}</h2>
              <p className="text-white/60 text-sm">{match.teamA.name}</p>
            </div>
            <div className="text-4xl font-mono font-black text-accent-gold drop-shadow-lg">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={match.scoreA}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  {match.scoreA}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-white/20 font-display font-black text-7xl italic">VS</div>
            <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-mono text-white/50 border border-white/10">
              {match.venue}
            </div>
            <div className="flex items-center gap-4 mt-2">
               <div className="flex items-center gap-1 text-sm text-white/70">
                  <Users size={14} className="text-accent-gold" />
                  <span>{liveFans.toLocaleString()} Fans Reacting</span>
               </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 text-center md:w-1/3">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-5xl shadow-xl border-4 border-white/20 backdrop-blur-md" style={{ borderColor: match.teamB.color }}>
              {match.teamB.logo}
            </div>
            <div>
              <h2 className="text-2xl font-display font-extrabold tracking-tight text-white">{match.teamB.shortName}</h2>
              <p className="text-white/60 text-sm">{match.teamB.name}</p>
            </div>
            <div className="text-4xl font-mono font-black text-white/20">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={match.scoreB}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  {match.scoreB}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sportive Banner integrated in header like requested in HTML example */}
        <div className="mt-8 bg-gradient-to-r from-emerald-500/80 to-blue-500/80 p-3 rounded-xl flex justify-between items-center backdrop-blur-md border border-white/20">
           <span className="text-xs font-bold text-white flex items-center gap-2">
              <Zap size={14} className="text-yellow-300" />
              SPORTIVE GESTURE: Fans sending respect across teams!
           </span>
           <button className="px-3 py-1 bg-white text-black text-[10px] font-black rounded uppercase hover:scale-105 transition-transform">
              Send High Five
           </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fan Sentiment Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-accent-gold" />
              <h3 className="font-display font-bold text-lg text-white">Fan Sentiment Pulse</h3>
            </div>
            <span className="text-xs text-white/40 font-mono tracking-widest">LIVE TRACKING</span>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentimentData}>
                <defs>
                  <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fbbf24' }}
                />
                <Area type="monotone" dataKey="sentiment" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorSentiment)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Context / Matchday Planning */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 flex flex-col gap-6"
        >
          <h3 className="font-display font-bold text-lg flex items-center gap-2 text-accent-gold">
            <Calendar size={18} />
            Venue Info
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <StatBox value="28°C" label="Clear Sky" icon={<CloudRain className="text-blue-300" />} />
            <StatBox value="High" label="Stadium Traffic" icon={<MapPin className="text-red-400" />} />
            <StatBox value="19:30" label="Start Time" icon={<Calendar className="text-accent-gold" />} />
            <StatBox value="6.4km" label="Closest Metro" icon={<MapPin className="text-emerald-400" />} />
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 mt-2">
             <p className="text-[10px] text-white/40 mb-2 font-mono uppercase tracking-widest">Connect Recommend</p>
             <p className="text-sm text-white/80 leading-snug">
                "Fans at Chinnaswamy are gathering at Gate 5 for a combined chant."
             </p>
             <button className="w-full mt-4 py-3 bg-white/10 border border-white/20 text-white text-xs font-bold rounded-xl hover:bg-white/20 transition-colors">
                VIEW MEETUP POINT
             </button>
          </div>
        </motion.div>
      </div>

      {/* Fan Interactions Feed */}
      <div className="flex flex-col gap-4">
        <h3 className="font-display font-bold text-lg text-white uppercase tracking-widest">Global Stadium Feed</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InteractionCard 
            user="Rahul_VK_Fan" 
            team="rcb" 
            text="That maximum was UNREAL! The stadium is shaking right now! 🏟️🔥" 
            time="2 mins ago"
          />
          <InteractionCard 
            user="Chinathambi_CSK" 
            team="csk" 
            text="Waiting for MSD to come out. The yellow army is ready everywhere! 💛" 
            time="5 mins ago"
          />
          <InteractionCard 
            user="Priya_🏏" 
            team="rcb" 
            text="Can we talk about that bowling spell? Pure masterclass." 
            time="1 min ago"
          />
          <InteractionCard 
            user="IPL_StatCenter" 
            team="neutral" 
            text="RCB has a 72% chance of winning from this position." 
            time="Now"
          />
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ value, label, icon }: { value: string, label: string, icon: React.ReactNode }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center group hover:bg-white/10 transition-colors">
    <div className="flex justify-center mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
       {React.cloneElement(icon as React.ReactElement, { size: 14 })}
    </div>
    <div className="text-lg font-black text-accent-gold tracking-tight">{value}</div>
    <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest leading-none mt-1">{label}</div>
  </div>
);

const InteractionCard = ({ user, team, text, time }: { user: string, team: string, text: string, time: string }) => {
  const teamColor = TEAMS.find(t => t.id === team)?.color || 'rgba(255,255,255,0.2)';
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass p-5 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: teamColor }}></div>
           <p className="text-[10px] font-black text-white/70 uppercase tracking-tighter">@{user}</p>
        </div>
        <span className="text-[9px] text-white/30 uppercase font-mono">{time}</span>
      </div>
      <p className="text-sm text-white/80 leading-relaxed italic line-clamp-3">{text}</p>
      <div className="mt-4 flex gap-2">
         <button className="flex-1 py-1.5 rounded-lg bg-black/20 border border-white/10 text-[10px] text-white/60 hover:text-white hover:bg-black/40 transition-all flex items-center justify-center gap-1 font-bold">
            <MessageSquare size={10} />
            React
         </button>
         <button className="flex-1 py-1.5 rounded-lg bg-black/20 border border-white/10 text-[10px] text-white/60 hover:text-white hover:bg-black/40 transition-all flex items-center justify-center gap-1 font-bold">
            <Languages size={10} />
            Translate
         </button>
      </div>
    </motion.div>
  );
};
