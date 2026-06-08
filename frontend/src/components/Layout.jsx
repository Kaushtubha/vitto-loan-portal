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
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
  const { theme, toggleTheme, setTheme } = useStore();
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
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Apply for Loan',
      path: '/apply',
      icon: FilePlus,
    },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-dark-100 transition-colors duration-300 font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white/60 dark:bg-dark-900/60 backdrop-blur-xl border-r border-slate-200/50 dark:border-dark-800/40 z-30">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-200/50 dark:border-dark-800/40">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-glow text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-sans tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-600 dark:from-white dark:via-dark-100 dark:to-brand-400 bg-clip-text text-transparent">
              Vitto
            </h1>
            <span className="text-[10px] font-semibold tracking-wider text-indigo-500 uppercase">Fintech</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'text-brand-600 dark:text-white bg-brand-500/10 dark:bg-brand-500/15 border-l-4 border-brand-500'
                    : 'text-slate-500 hover:text-slate-900 dark:text-dark-400 dark:hover:text-dark-100 hover:bg-slate-100/50 dark:hover:bg-dark-800/40'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-brand-500 dark:text-brand-400' : 'text-slate-400 dark:text-dark-500 group-hover:text-slate-500 dark:group-hover:text-dark-300'
                }`} />
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-y-0 right-0 w-1 bg-brand-500 rounded-l-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Panel with Theme Toggle & Subtitle */}
        <div className="p-4 border-t border-slate-200/50 dark:border-dark-800/40 bg-slate-50/50 dark:bg-dark-950/20">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-dark-900 border border-slate-200/30 dark:border-dark-800/30">
            <span className="text-xs font-semibold text-slate-500 dark:text-dark-400 pl-2">Appearance</span>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-white dark:bg-dark-800 shadow-sm border border-slate-200/50 dark:border-dark-700/50 hover:bg-slate-50 dark:hover:bg-dark-750 transition-colors text-brand-500 dark:text-brand-400"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="mt-4 flex items-center gap-2 px-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-400 dark:text-dark-500">Vitto Intern Track 2026</span>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-dark-900/70 backdrop-blur-lg border-b border-slate-200/50 dark:border-dark-800/40 z-40">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 text-white">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-dark-100 bg-clip-text text-transparent">
            Vitto
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-850 text-slate-500 dark:text-dark-400"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-850 text-slate-600 dark:text-dark-300"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Mobile Navigation) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.nav
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 bottom-0 left-0 w-72 bg-white dark:bg-dark-900 p-6 shadow-2xl border-r border-slate-200 dark:border-dark-800 flex flex-col z-50 md:hidden"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-dark-800">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 text-white">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-dark-100 bg-clip-text text-transparent">
                    Vitto
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-500 dark:text-dark-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 py-8 space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                        isActive
                          ? 'text-brand-600 dark:text-white bg-brand-500/10 dark:bg-brand-500/15 border-l-4 border-brand-500'
                          : 'text-slate-500 hover:text-slate-900 dark:text-dark-400 dark:hover:text-dark-100 hover:bg-slate-100/50 dark:hover:bg-dark-800/40'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-brand-500' : 'text-slate-400 dark:text-dark-500'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-dark-800 text-center">
                <span className="text-xs text-slate-400 dark:text-dark-500">Vitto Intern Track 2026</span>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-0 min-h-screen flex flex-col">
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
      
    </div>
  );
}
