"use client";

export default function GlobalAurora() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617]" />

      {/* Aurora blobs */}
      <div className="absolute -top-48 -left-48 h-[700px] w-[700px] rounded-full bg-teal-500/25 blur-[160px]" />
      <div className="absolute top-1/3 -right-48 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[160px]" />
      <div className="absolute bottom-0 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-[140px]" />

      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[0.035] bg-[url('/noise.png')]" />
    </div>
  );
}
