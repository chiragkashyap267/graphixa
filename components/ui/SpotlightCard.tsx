"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";

export default function SpotlightCard({
  children,
}: {
  children: React.ReactNode;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const background = useTransform(
    [x, y],
    ([x, y]) =>
      `radial-gradient(300px at ${x}px ${y}px, rgba(45,212,191,0.15), transparent 80%)`
  );

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
      style={{ background }}
      className="
        relative rounded-2xl
        bg-white/5 border border-white/10
        transition-all duration-300
        hover:border-teal-400/40
      "
    >
      {children}
    </motion.div>
  );
}
