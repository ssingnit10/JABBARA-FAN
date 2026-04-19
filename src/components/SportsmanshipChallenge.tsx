import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, HelpCircle, BarChart2, MessageSquare, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { generateSportsmanshipChallenge } from '../lib/gemini';

type ChallengeData = {
  trivia: { question: string; options: string[]; correctIndex: number };
  poll: { question: string; options: string[] };
  debatePrompt: string;
};

export const SportsmanshipChallenge: React.FC<{ teamA: string; teamB: string; winner: string; onClose: () => void }> = ({ teamA, teamB, winner, onClose }) => {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState<'trivia' | 'poll' | 'debate'>('trivia');
  const [selectedTrivia, setSelectedTrivia] = useState<number | null>(null);
  const [selectedPoll, setSelectedPoll] = useState<number | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      setLoading(true);
      const data = await generateSportsmanshipChallenge(teamA, teamB, winner);
      setChallenge(data);
      setLoading(false);
    };
    fetchChallenge();
  }, [teamA, teamB, winner]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-accent-gold border-t-transparent animate-spin"></div>
        <p className="text-white/50 font-display italic">Curating a fair play challenge for the fans...</p>
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      {/* Header Tabs */}
      <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
        <ChallengeTab 
          active={activeStep === 'trivia'} 
          onClick={() => setActiveStep('trivia')}
          icon={<HelpCircle size={16} />}
          label="Match Trivia"
        />
        <ChallengeTab 
          active={activeStep === 'poll'} 
          onClick={() => setActiveStep('poll')}
          icon={<BarChart2 size={16} />}
          label="Fan Poll"
        />
        <ChallengeTab 
          active={activeStep === 'debate'} 
          onClick={() => setActiveStep('debate')}
          icon={<MessageSquare size={16} />}
          label="Friendly Debate"
        />
      </div>

      {/* Challenge Content */}
      <div className="glass p-8 min-h-[300px] flex flex-col justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeStep === 'trivia' && (
            <motion.div
              key="trivia"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h4 className="text-xl font-display font-bold text-white">{challenge.trivia.question}</h4>
              <div className="grid grid-cols-1 gap-3">
                {challenge.trivia.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTrivia(idx)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      selectedTrivia === idx
                        ? idx === challenge.trivia.correctIndex
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                          : 'bg-red-500/20 border-red-500 text-red-200'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option}</span>
                      {selectedTrivia !== null && idx === challenge.trivia.correctIndex && <CheckCircle2 size={18} className="text-emerald-500" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeStep === 'poll' && (
            <motion.div
              key="poll"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h4 className="text-xl font-display font-bold text-white">{challenge.poll.question}</h4>
              <div className="grid grid-cols-1 gap-3">
                {challenge.poll.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPoll(idx)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      selectedPoll === idx
                        ? 'bg-accent-gold/20 border-accent-gold text-accent-gold'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option}</span>
                      {selectedPoll === idx && <div className="text-[10px] font-black uppercase">Your Vote</div>}
                    </div>
                    {selectedPoll !== null && (
                      <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.random() * 60 + 20}%` }}
                          className="h-full bg-accent-gold/50"
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeStep === 'debate' && (
            <motion.div
              key="debate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 text-center py-4"
            >
              <div className="p-6 bg-accent-gold/5 border border-accent-gold/20 rounded-3xl italic text-lg text-white font-medium leading-relaxed">
                "{challenge.debatePrompt}"
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-white/40 uppercase tracking-widest font-bold">Guidelines for healthy banter</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-3 py-1.5 bg-white/5 rounded-full text-[10px] text-white/60 border border-white/10">Respect Performance</span>
                  <span className="px-3 py-1.5 bg-white/5 rounded-full text-[10px] text-white/60 border border-white/10">No Toxicity</span>
                  <span className="px-3 py-1.5 bg-white/5 rounded-full text-[10px] text-white/60 border border-white/10">Critique Tactics</span>
                </div>
                <button className="mt-4 px-8 py-3 bg-white text-blue-900 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform mx-auto">
                  Post Your Argument
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center px-4">
        <p className="text-xs text-white/30 font-medium">Challenge created to foster sportsmanship between {teamA} & {teamB} fans.</p>
        <button 
          onClick={() => {
            if (activeStep === 'trivia') setActiveStep('poll');
            else if (activeStep === 'poll') setActiveStep('debate');
            else onClose();
          }}
          className="flex items-center gap-2 text-accent-gold text-sm font-bold hover:translate-x-1 transition-transform"
        >
          {activeStep === 'debate' ? 'Finish' : 'Next Step'}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const ChallengeTab = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
      active ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
