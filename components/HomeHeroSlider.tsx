"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { Swiper as SwiperType } from "swiper";

type Slide = {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
};

export default function HomeHeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [progress, setProgress] = useState(0);

  const heroText: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  useEffect(() => {
    const q = query(
      collection(db, "sliders"),
      where("active", "==", true),
      orderBy("order", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setSlides(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Slide, "id">),
        }))
      );
    });

    return () => unsub();
  }, []);

  if (slides.length === 0) return null;

  return (
    <div
      className="
        relative
        h-[60vh] sm:h-[70vh] lg:h-[85vh]
        overflow-hidden
        pointer-events-none
      "
      style={{
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
      }}
    >
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="w-full h-full pointer-events-none"
        onSlideChange={(swiper: SwiperType) => {
          const total = swiper.slides.length;
          const current = swiper.realIndex + 1;
          setProgress((current / total) * 100);
        }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full overflow-hidden">
              {/* BACKGROUND IMAGE */}
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                priority
                className="object-cover scale-[1.05]"
              />

              {/* OVERLAYS */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#020617]/95" />

              {/* REDUCED GLOW ON MOBILE */}
              <div className="absolute
    -top-1/4 sm:-top-1/3
    left-1/2 -translate-x-1/2
    w-[420px] h-[420px]
    sm:w-[700px] sm:h-[700px]
    lg:w-[900px] lg:h-[900px]
    bg-[radial-gradient(circle,rgba(45,212,191,0.22),transparent_70%)]
    sm:bg-[radial-gradient(circle,rgba(45,212,191,0.35),transparent_70%)]
    blur-[80px] sm:blur-[120px]
    pointer-events-none" />

              {/* CONTENT */}
              <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-end sm:items-center">
                <div className="mb-10 sm:mb-0 max-w-xl text-left sm:text-left">
                  <p className="uppercase tracking-[0.25em] text-[10px] sm:text-xs text-teal-300 mb-3">
                    Premium Digital Assets
                  </p>

                  <motion.h2
                    variants={heroText}
                    initial="hidden"
                    animate="visible"
                    className="
                      text-3xl sm:text-4xl md:text-6xl
                      font-[700]
                      leading-[1.1]
                      tracking-[-0.04em]
                      bg-gradient-to-b from-white via-white to-teal-300
                      bg-clip-text text-transparent
                      mb-4 sm:mb-6
                    "
                  >
                    {slide.title}
                  </motion.h2>

                  <motion.p
                    variants={heroText}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.15 }}
                    className="
                      text-sm sm:text-lg md:text-xl
                      text-white/70
                      leading-relaxed
                    "
                  >
                    {slide.subtitle}
                  </motion.p>
                </div>
              </div>

              {/* BOTTOM FADE */}
              <div className="absolute bottom-0 left-0 w-full h-24 sm:h-40 bg-gradient-to-t from-[#020617] to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] sm:h-[3px] bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-teal-300 via-teal-400 to-teal-300 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
