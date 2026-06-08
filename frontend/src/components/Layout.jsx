import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  LayoutDashboard, 
  FilePlus, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Building2, 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
  const { theme, toggleTheme } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Load theme classes on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Apply for Loan', path: '/apply', icon: FilePlus },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const pageVariants = {
    initial: { opacity: 0, y: 15, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen flex text-slate-900 dark:text-dark-100 font-sans relative overflow-hidden bg-slate-50 dark:bg-dark-950 transition-colors duration-500">
      
      {/* Immersive Animated Background System */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
        
        {/* Subtle radial glows / Aurora effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/10 dark:bg-brand-500/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 glass-panel border-r border-white/50 dark:border-dark-800/50 z-30">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-200/50 dark:border-dark-800/50">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-glow-brand text-white"
          >
            <Building2 className="w-5 h-5" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold font-sans tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-600 dark:from-white dark:via-dark-100 dark:to-brand-400 bg-clip-text text-transparent">
              Vitto
            </h1>
            <span className="text-[10px] font-semibold tracking-wider text-indigo-500 uppercase">Fintech</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto relative z-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative group z-10 ${
                  isActive ? 'text-brand-600 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-dark-400 dark:hover:text-dark-100'
                }`}
              >
                {/* Active Pill Background Indicator (Vercel Style) */}
                {isActive && (
                  <motion.div
                    layoutId="desktop-active-pill"
                    className="absolute inset-0 bg-white dark:bg-dark-800/80 rounded-xl shadow-sm border border-slate-200/50 dark:border-dark-700/50 z-[-1]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                
                {/* Hover Background */}
                {!isActive && (
                  <div className="absolute inset-0 bg-slate-100/0 dark:bg-dark-800/0 group-hover:bg-slate-100/50 dark:group-hover:bg-dark-800/40 rounded-xl transition-colors duration-300 z-[-1]" />
                )}

                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-brand-500 dark:text-brand-400' : 'text-slate-400 dark:text-dark-500 group-hover:text-brand-400 dark:group-hover:text-brand-400'
                }`} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Panel with Theme Toggle */}
        <div className="p-4 border-t border-slate-200/50 dark:border-dark-800/50 glass-panel">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/50 dark:bg-dark-900/50 border border-slate-200/50 dark:border-dark-800/50">
            <span className="text-xs font-semibold text-slate-500 dark:text-dark-400 pl-2">Appearance</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-white dark:bg-dark-800 shadow-sm border border-slate-200/50 dark:border-dark-700/50 hover:bg-slate-50 dark:hover:bg-dark-750 transition-colors text-brand-500 dark:text-brand-400"
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 flex items-center justify-between px-6 glass-panel z-40">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-glow-brand">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-dark-100 bg-clip-text text-transparent">
            Vitto
          </span>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-850 text-slate-500 dark:text-dark-400"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-850 text-slate-600 dark:text-dark-300"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer (Mobile Navigation) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.nav
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 bottom-0 left-0 w-72 glass-panel p-6 shadow-2xl border-r border-slate-200 dark:border-dark-800 flex flex-col z-50 md:hidden"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-200/50 dark:border-dark-800/50">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-glow-brand">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-dark-100 bg-clip-text text-transparent">
                    Vitto
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-500 dark:text-dark-400"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="flex-1 py-8 space-y-1 relative">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 relative z-10 ${
                        isActive ? 'text-brand-600 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-dark-400 dark:hover:text-dark-100'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="mobile-active-pill"
                          className="absolute inset-0 bg-white dark:bg-dark-800/80 rounded-xl shadow-sm border border-slate-200/50 dark:border-dark-700/50 z-[-1]"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-brand-500' : 'text-slate-400 dark:text-dark-500'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-0 min-h-screen flex flex-col z-10 relative">
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
    </div>
  );
}
