"use client";

import { motion } from "framer-motion";

export default function CategoryHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mb-16"
    >
      {/* Accent glow line */}
      <div
        className="
          absolute -top-6 left-0 h-[2px] w-32
          bg-gradient-to-r from-teal-400/60 to-transparent
        "
      />

      {/* Glass container */}
      <div
        className="
          inline-block
          rounded-2xl
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          px-6 py-4
        "
      >
        <h2
          className="
            text-4xl md:text-5xl
            font-black tracking-tight
            text-white
          "
        >
          {title}
        </h2>

        {subtitle && (
          <p className="mt-2 text-sm md:text-base text-white/60 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
