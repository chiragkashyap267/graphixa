"use client";

import { motion } from "framer-motion";

export default function ShimmerText({ text }: { text: string }) {
  return (
    <motion.span
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: "100% 50%" }}
      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
      className="
        bg-gradient-to-r from-white via-teal-300 to-white
        bg-[length:200%_200%]
        bg-clip-text text-transparent
      "
    >
      {text}
    </motion.span>
  );
}
