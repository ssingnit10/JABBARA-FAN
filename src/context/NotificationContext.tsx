import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Info, Mail, MapPin, X, Zap } from 'lucide-react';

export type NotificationType = 'match' | 'message' | 'meetup' | 'info';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (type: NotificationType, title: string, message: string) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addNotification = useCallback((type: NotificationType, title: string, message: string) => {
    const id = Date.now().toString();
    const newNotification: AppNotification = { id, type, title, message, timestamp: new Date() };
    setNotifications(prev => [newNotification, ...prev].slice(0, 5)); // Keep last 5

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationList notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};

const NotificationList: React.FC<{ notifications: AppNotification[], removeNotification: (id: string) => void }> = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-80 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="pointer-events-auto"
          >
            <div className="glass-dark p-4 shadow-2xl relative overflow-hidden group border-white/20">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent-gold shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
              
              <button 
                onClick={() => removeNotification(n.id)}
                className="absolute top-2 right-2 p-1 text-white/20 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>

              <div className="flex gap-4">
                <div className="mt-1">
                  {n.type === 'match' && <Zap size={18} className="text-accent-gold" />}
                  {n.type === 'message' && <Mail size={18} className="text-blue-400" />}
                  {n.type === 'meetup' && <MapPin size={18} className="text-emerald-400" />}
                  {n.type === 'info' && <Info size={18} className="text-white/40" />}
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">{n.title}</h4>
                  <p className="text-xs text-white/60 leading-relaxed italic">{n.message}</p>
                </div>
              </div>
              
              <div className="mt-3 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: 0 }}
                  transition={{ duration: 6, ease: 'linear' }}
                  className="h-full bg-accent-gold/30"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
