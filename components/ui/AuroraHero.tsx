"use client";

import { motion } from "framer-motion";

export default function AuroraHero({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Aurora gradient */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-teal-500/30 blur-[120px]" />
        <div className="absolute top-20 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>

      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('/noise.png')]" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
