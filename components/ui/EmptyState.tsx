"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
        relative
        mx-auto
        max-w-md
        rounded-3xl
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        px-10 py-12
        text-center
      "
    >
      {/* Subtle glow */}
      <div
        className="
          absolute inset-x-0 -top-12 h-12
          bg-[radial-gradient(circle,rgba(45,212,191,0.25),transparent_70%)]
          blur-[80px]
          pointer-events-none
        "
      />

      <h3 className="text-2xl font-semibold text-white">
        {title}
      </h3>

      {description && (
        <p className="mt-3 text-sm text-white/60 leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="
            inline-block mt-6
            px-6 py-3 rounded-xl
            border border-teal-400/40
            text-teal-300 font-medium
            hover:bg-teal-400/10
            transition
          "
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}
