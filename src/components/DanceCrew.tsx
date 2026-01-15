"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import VoteCTA from "./voteCTA";

type Crew = {
  id: number;
  image: string;
  color?: string; // accent color for the crew card
};

const crews: Crew[] = [
  { id: 1, image: "/DanceCrew/DanceCrew.JPG", color: "#50C878" },
  { id: 2, image: "/DanceCrew/DanceCrew2.JPG", color: "#F59E0B" },
  { id: 3, image: "/DanceCrew/DanceCrew3.JPG", color: "#40E0D0" },
  { id: 4, image: "/DanceCrew/DanceCrew4.JPG", color: "#06B6D4" },
  { id: 5, image: "/DanceCrew/DanceCrew5.JPG", color: "#C8102E" },
  { id: 6, image: "/DanceCrew/DanceCrew6.JPG", color: "#D58512" },
  { id: 7, image: "/DanceCrew/DanceCrew7.JPG", color: "#EC4899" },
  { id: 8, image: "/DanceCrew/DanceCrew8.JPG", color: "#00FFFF" },
  { id: 9, image: "/DanceCrew/DanceCrew9.JPG", color: "#14B8A6" },
  { id: 10, image: "/DanceCrew/DanceCrew10.JPG", color: "#D58512" },
  { id: 11, image: "/DanceCrew/DanceCrew11.JPG", color: "#E31E24" },
];

const CrewCard = ({ crew, index }: { crew: Crew; index: number }) => {
  const accent = crew.color ?? "#7c3aed";
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex-shrink-0"
    >
      <div
        className="relative w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-gray-900/80 border transition-all hover:scale-105 focus:scale-105 hover:shadow-2xl focus:shadow-2xl"
        style={{
          border: `1px solid ${accent}33`,
          boxShadow: `0 10px 30px ${accent}22, inset 0 1px 0 rgba(255,255,255,0.02)`,
        }}
        role="group"
        tabIndex={0}
        aria-label={`Dance Crew ${crew.id}`}
      >
        <img
          src={crew.image}
          alt={`Dance Crew ${crew.id}`}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* color overlay gradient to make each card "pop" */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, ${accent}22 0%, transparent 40%, rgba(0,0,0,0.45) 100%)`,
            mixBlendMode: "overlay",
          }}
        />

        {/* subtle glow on focus/hover */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
          style={{
            boxShadow: `0 18px 60px ${accent}30`,
            willChange: "opacity",
          }}
        />
      </div>
    </motion.div>
  );
};

export default function DanceCrewCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let isPaused = false;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += 1;

        // Reset to start when reaching the end
        if (
          scrollContainer.scrollLeft >=
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        ) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Start auto-scroll
    animationFrameId = requestAnimationFrame(scroll);

    // Pause on hover / focus
    const handleMouseEnter = () => {
      isPaused = true;
    };
    const handleMouseLeave = () => {
      isPaused = false;
    };
    const handleFocusIn = () => {
      isPaused = true;
    };
    const handleFocusOut = () => {
      isPaused = false;
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);
    scrollContainer.addEventListener("focusin", handleFocusIn);
    scrollContainer.addEventListener("focusout", handleFocusOut);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      scrollContainer.removeEventListener("focusin", handleFocusIn);
      scrollContainer.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return (
    <section id="lineup" className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
            Dance Crew Lineup
          </h2>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto py-4 scrollbar-hide focus:outline-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          tabIndex={0}
        >
          {/* Duplicate items for infinite scroll effect */}
          {[...crews, ...crews].map((crew, index) => (
            <CrewCard key={`${crew.id}-${index}`} crew={crew} index={index} />
          ))}
        </div>

        <VoteCTA/>

        {/* Scroll Indicators */}
        <div className="flex justify-center gap-1.5 mt-6">
          {crews.map((c, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: c.color ?? "#64748b" }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        /* show glow on focus for accessibility */
        .flex-shrink-0:focus-within > div,
        .flex-shrink-0:focus > div {
          transform: scale(1.03);
        }
      `}</style>
    </section>
  );
}