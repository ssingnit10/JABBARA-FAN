import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { StadiumDashboard } from './components/StadiumDashboard';
import { Messenger } from './components/Messenger';
import { FanGroups } from './components/FanGroups';
import { MatchPlanner } from './components/MatchPlanner';
import { SportsmanshipChallenge } from './components/SportsmanshipChallenge';
import { Trophy, X, MessageSquare, Heart, Sparkles } from 'lucide-react';
import { generateBanter } from './lib/gemini';

import { useNotifications } from './context/NotificationContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('stadium');
  const [showSportiveEvent, setShowSportiveEvent] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [banter, setBanter] = useState('');
  const [isGeneratingBanter, setIsGeneratingBanter] = useState(false);
  const { addNotification } = useNotifications();

  const triggerSportiveEvent = async () => {
    setIsGeneratingBanter(true);
    setShowSportiveEvent(true);
    addNotification('match', 'MATCH CONCLUDED!', 'RCB has defeated CSK in a thrilling encounter!');
    const text = await generateBanter("RCB", "CSK", "RCB");
    setBanter(text);
    setIsGeneratingBanter(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden selection:bg-accent-gold/30">
      {/* Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-black/5 backdrop-blur-sm">
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'stadium' && (
              <motion.div
                key="stadium"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full"
              >
                <StadiumDashboard />
                {/* Temporary button to simulate match end */}
                {!showSportiveEvent && (
                  <div className="fixed bottom-6 right-80 2xl:right-96 z-30">
                     <button 
                      onClick={triggerSportiveEvent}
                      className="flex items-center gap-2 px-6 py-3 bg-accent-gold text-blue-900 rounded-full text-xs font-black shadow-2xl shadow-accent-gold/40 hover:scale-110 transition-transform border border-white/20 hover:bg-white"
                     >
                       <Trophy size={14} />
                       SIMULATE MATCH END
                     </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'tribes' && (
              <motion.div
                key="tribes"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full"
              >
                <FanGroups />
              </motion.div>
            )}

            {activeTab === 'planner' && (
              <motion.div
                key="planner"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full"
              >
                <MatchPlanner />
              </motion.div>
            )}
            
            {activeTab === 'parks' && (
              <motion.div
                key="others"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center h-full"
              >
                <div className="glass p-12 text-center max-w-md">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 text-accent-gold animate-bounce">
                    <Trophy size={32} />
                  </div>
                  <p className="text-white font-display font-medium text-lg leading-relaxed italic mb-6">"Something legendary is brewing here. The construction crew is still setting up the sights."</p>
                  <button onClick={() => setActiveTab('stadium')} className="px-8 py-3 bg-white text-blue-900 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">Return to Stadium</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Right Sidebar - Social Context */}
      <aside className="hidden xl:block w-80 2xl:w-96">
        <Messenger />
      </aside>

      {/* Sportive Event Overlay */}
      <AnimatePresence>
        {showSportiveEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-900/60 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-4xl bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[48px] p-10 relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col items-center"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 shadow-xl shadow-white/10"></div>
              
              <button 
                onClick={() => {
                  setShowSportiveEvent(false);
                  setShowChallenge(false);
                }}
                className="absolute top-8 right-8 p-3 rounded-full bg-white/10 text-white/50 hover:text-white transition-colors border border-white/10 hover:bg-white/20"
              >
                <X size={20} />
              </button>

              <div className="text-center flex flex-col items-center gap-8 w-full">
                 {!showChallenge ? (
                   <>
                     <div className="w-24 h-24 rounded-[32px] bg-accent-gold/20 flex items-center justify-center text-accent-gold shadow-2xl shadow-accent-gold/20 border border-accent-gold/30">
                        <Trophy size={48} />
                     </div>

                     <div>
                        <h2 className="text-4xl font-display font-black tracking-tighter mb-2 text-white italic">FINAL ROAR!</h2>
                        <p className="text-white/50 text-base font-medium">The stadium lights fade... but the spirit remains.</p>
                     </div>

                     <div className="w-full bg-white/5 rounded-[32px] p-8 border border-white/10 relative backdrop-blur-sm">
                        <div className="absolute -top-4 left-8 px-4 py-1.5 bg-blue-900 border border-white/20 rounded-full text-[11px] font-black text-accent-gold flex items-center gap-2 uppercase tracking-widest">
                           <MessageSquare size={12} />
                           Sportive AI Banter
                        </div>
                        
                        {isGeneratingBanter ? (
                          <div className="py-6 space-y-3">
                            <div className="h-5 bg-white/10 rounded-full w-3/4 animate-pulse"></div>
                            <div className="h-5 bg-white/10 rounded-full w-1/2 animate-pulse"></div>
                          </div>
                        ) : (
                          <p className="text-xl text-white leading-relaxed font-bold italic tracking-tight">
                            "{banter}"
                          </p>
                        )}
                     </div>

                     <div className="flex gap-4 w-full max-w-2xl">
                        <button 
                          onClick={() => setShowChallenge(true)}
                          className="flex-1 py-5 bg-accent-gold text-blue-900 font-black rounded-3xl hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-2xl shadow-accent-gold/20 uppercase tracking-widest text-xs"
                        >
                           <Sparkles size={20} />
                           START SPORTSMANSHIP CHALLENGE
                        </button>
                        <button className="flex-1 py-5 bg-white/10 text-white font-black rounded-3xl border border-white/20 hover:bg-white/20 transition-all uppercase tracking-widest text-xs">
                           SKIP TO LOBBY
                        </button>
                     </div>
                   </>
                 ) : (
                   <SportsmanshipChallenge 
                    teamA="RCB" 
                    teamB="CSK" 
                    winner="RCB" 
                    onClose={() => {
                      setShowSportiveEvent(false);
                      setShowChallenge(false);
                    }} 
                   />
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

