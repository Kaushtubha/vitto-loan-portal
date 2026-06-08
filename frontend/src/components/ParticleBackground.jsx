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
      {/* Crisp Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 dark:opacity-20" />

      {/* Mouse Follow Spotlight */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full bg-brand-500/10 blur-[140px] dark:bg-white/[0.04] dark:blur-[180px]"
        animate={{
          x: mousePosition.x - 400,
          y: mousePosition.y - 400,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 1.5 }}
      />

      {/* Subtle background glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white/40 dark:from-white/[0.02] to-transparent" />

      {/* Subtle noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} 
      />
    </div>
  );
}
