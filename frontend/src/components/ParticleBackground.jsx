import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ParticleBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />

      {/* Mouse Follow Glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-brand-500/15 blur-[120px] dark:bg-brand-500/20"
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 1 }}
      />

      {/* Cinematic aurora blobs */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute -top-[20%] -left-[10%] w-[55%] h-[55%] rounded-full bg-gradient-radial from-brand-500/20 via-brand-600/5 to-transparent blur-[120px] animate-pulse-glow dark:from-brand-500/20" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, delay: 0.5 }}
        className="absolute -bottom-[15%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-radial from-indigo-500/20 via-purple-600/5 to-transparent blur-[100px] animate-pulse-glow dark:from-indigo-500/20"
      />
      
      {/* Floating Orbs */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[30%] left-[20%] w-64 h-64 rounded-full bg-brand-400/20 blur-[80px]"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, -15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[60%] right-[30%] w-80 h-80 rounded-full bg-indigo-400/20 blur-[90px]"
      />

      {/* Subtle noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} 
      />
    </div>
  );
}
