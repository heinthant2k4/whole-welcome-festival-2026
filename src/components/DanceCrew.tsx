"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

type Crew = {
  id: number;
  image: string;
};

const crews: Crew[] = [
  { id: 1, image: "/DanceCrew/DanceCrew.JPG" },
  { id: 2, image: "/DanceCrew/DanceCrew2.JPG" },
  { id: 3, image: "/DanceCrew/DanceCrew3.JPG" },
  { id: 4, image: "/DanceCrew/DanceCrew4.JPG" },
  { id: 5, image: "/DanceCrew/DanceCrew5.JPG" },
  { id: 6, image: "/DanceCrew/DanceCrew6.JPG" },
  { id: 7, image: "/DanceCrew/DanceCrew7.JPG" },
  { id: 8, image: "/DanceCrew/DanceCrew8.JPG" },
  { id: 9, image: "/DanceCrew/DanceCrew9.JPG" },
  { id: 10, image: "/DanceCrew/DanceCrew10.JPG" },
  { id: 11, image: "/DanceCrew/DanceCrew11.JPG" },
];

const CrewCard = ({ crew, index }: { crew: Crew; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex-shrink-0"
    >
      <div className="w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-gray-900/80 border border-gray-700/50 hover:border-gray-600/70 transition-all hover:scale-105 hover:shadow-2xl">
        <img
          src={crew.image}
          alt={`Dance Crew ${crew.id}`}
          className="w-full h-full object-cover"
          draggable={false}
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

    // Pause on hover
    const handleMouseEnter = () => {
      isPaused = true;
    };
    const handleMouseLeave = () => {
      isPaused = false;
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
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
          <p className="text-base text-gray-400">
            Hover to pause • Auto-scrolling carousel
          </p>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto py-4 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Duplicate items for infinite scroll effect */}
          {[...crews, ...crews].map((crew, index) => (
            <CrewCard key={`${crew.id}-${index}`} crew={crew} index={index} />
          ))}
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center gap-1.5 mt-6">
          {crews.map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full bg-gray-600/50"
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
