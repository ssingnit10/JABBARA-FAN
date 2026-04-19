import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Languages, Sparkles, Smile, Image as ImageIcon, X } from 'lucide-react';
import { translateText, summarizeThread } from '../lib/gemini';
import { ChatMessage } from '../types';

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: '1', sender: 'Rohit_Fans_45', text: 'आज की पारी बहुत शानदार थी!', timestamp: '22:15', language: 'Hindi' },
  { id: '2', sender: 'Sathya_Chepauk', text: 'நம்ம CSK இன்னைக்கு ஜெயிக்கும்!', timestamp: '22:16', language: 'Tamil' },
  { id: '3', sender: 'Virat_Warrior', text: 'That bowling change was perfect.', timestamp: '22:17', language: 'English' },
];

import { useNotifications } from '../context/NotificationContext';

const SUPPORTED_LANGUAGES = ['English', 'Hindi', 'Tamil', 'Kannada', 'Telugu', 'Bengali', 'Malayalam', 'Marathi', 'Gujarati'];

export const Messenger: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate incoming messages
  useEffect(() => {
    const mockInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'Global_Fan_Bot',
          text: 'What a display of skill! AI match analysis is predicting a close finish.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: 'English'
        };
        setMessages(prev => [...prev, newMessage]);
        addNotification('message', 'New Global Message', 'Global_Fan_Bot: What a display of skill!');
      }
    }, 20000);

    return () => clearInterval(mockInterval);
  }, [addNotification]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: 'English'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const handleTranslate = async (msgId: string, text: string) => {
    setIsTranslating(msgId);
    const translated = await translateText(text, preferredLanguage);
    
    setMessages(prev => prev.map(m => 
      m.id === msgId ? { ...m, originalText: m.text, text: translated } : m
    ));
    setIsTranslating(null);
  };

  const handleSummarize = async () => {
    if (isSummarizing) return;
    setIsSummarizing(true);
    const result = await summarizeThread(messages);
    setSummary(result);
    setIsSummarizing(false);
  };

  return (
    <div className="flex flex-col h-full bg-white/10 backdrop-blur-xl border-l border-white/10 relative">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-display font-bold text-white uppercase tracking-wider">Fan Messenger</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white border border-white/10 transition-colors flex items-center gap-1"
              title="Preferred Language"
            >
              <Languages size={14} />
              <span className="text-[10px] uppercase font-bold">{preferredLanguage.slice(0, 3)}</span>
            </button>
            
            <AnimatePresence>
              {showLangMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-32 glass-dark z-50 p-2 shadow-2xl overflow-hidden border-white/20"
                >
                  <div className="text-[10px] font-black text-accent-gold uppercase mb-2 px-2 tracking-widest">Translate to:</div>
                  <div className="max-h-48 overflow-y-auto scrollbar-hide">
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <button
                        key={lang}
                        onClick={() => {
                          setPreferredLanguage(lang);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-md text-[11px] font-bold transition-colors ${
                          preferredLanguage === lang ? 'bg-accent-gold text-blue-900' : 'text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="px-2 py-1 rounded-lg bg-accent-gold/20 text-accent-gold text-[10px] font-black uppercase flex items-center gap-1 hover:bg-accent-gold/30 transition-colors border border-accent-gold/20"
          >
            {isSummarizing ? (
              <Sparkles size={10} className="animate-spin" />
            ) : (
              <Sparkles size={10} />
            )}
            {isSummarizing ? '...' : 'SUM'}
          </button>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>
      </div>

      <AnimatePresence>
        {summary && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-accent-gold/10 border-b border-accent-gold/20 p-4 relative"
          >
            <button 
              onClick={() => setSummary(null)}
              className="absolute top-2 right-2 p-1 text-accent-gold/50 hover:text-accent-gold"
            >
              <X size={14} />
            </button>
            <p className="text-[10px] font-black text-accent-gold uppercase mb-2 tracking-widest flex items-center gap-1">
              <Sparkles size={10} />
              AI Thread Summary
            </p>
            <div className="text-xs text-white/80 space-y-2 whitespace-pre-wrap leading-relaxed">
              {summary}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{msg.sender}</span>
                <span className="text-[9px] text-white/20 font-mono">{msg.timestamp}</span>
              </div>
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm relative transition-all shadow-lg ${
                  msg.sender === 'You' 
                  ? 'bg-accent-gold text-blue-900 rounded-tr-none font-bold' 
                  : 'bg-white/10 text-white rounded-tl-none border border-white/10 backdrop-blur-sm'
                }`}
              >
                {msg.text}
                
                {!msg.originalText && msg.sender !== 'You' && (
                  <button 
                    onClick={() => handleTranslate(msg.id, msg.text)}
                    disabled={isTranslating === msg.id}
                    className="absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 text-white/50 hover:text-white transition-colors border border-white/10"
                  >
                    {isTranslating === msg.id ? (
                       <Sparkles size={12} className="animate-spin text-accent-gold" />
                    ) : (
                       <Languages size={12} />
                    )}
                  </button>
                )}
                
                {msg.originalText && (
                  <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-white/40 italic">
                    Original: {msg.originalText}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10">
        <div className="flex items-center gap-2 bg-black/20 rounded-2xl px-4 py-2 border border-white/10 focus-within:border-white/30 transition-colors">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Chirp in any language..." 
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/30"
          />
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity text-white/60">
             <Smile size={18} className="cursor-pointer" />
             <ImageIcon size={18} className="cursor-pointer" />
          </div>
          <button 
            onClick={handleSend}
            className="p-2 bg-accent-gold text-blue-900 rounded-xl hover:bg-white transition-colors disabled:opacity-50"
            disabled={!inputText.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
