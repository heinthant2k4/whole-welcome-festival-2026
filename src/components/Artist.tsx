"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Artist = {
  id: number;
  image: string;
};

const artists: Artist[] = [
  { id: 1, image: "/artist/Artist1.JPG" },
  { id: 2, image: "/artist/Artist2.JPG" },
  { id: 3, image: "/artist/Artist3.JPG" },
  { id: 4, image: "/artist/Artist4.JPG" },
  { id: 5, image: "/artist/Artist5.JPG" },
  { id: 6, image: "/artist/Artist6.JPG" },
];

interface ArtistCardProps {
  artist: Artist;
  size: "sm" | "lg";
  className?: string;
}

const ArtistCard = ({ artist, size, className = "" }: ArtistCardProps) => {
  const dimensions =
    size === "lg" ? "w-[280px] h-[373px]" : "w-[200px] h-[267px]";

  return (
    <div
      className={`${dimensions} rounded-2xl overflow-hidden shadow-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 ${className}`}
    >
      <img
        src={artist.image}
        alt={`Artist ${artist.id}`}
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  );
};

export default function ArtistSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentIndex((prev) => (prev === 0 ? artists.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === artists.length - 1 ? 0 : prev + 1));
    }
  };

  const getVisibleIndices = () => {
    const prev = currentIndex === 0 ? artists.length - 1 : currentIndex - 1;
    const next = currentIndex === artists.length - 1 ? 0 : currentIndex + 1;
    return { prev, current: currentIndex, next };
  };

  const { prev, current, next } = getVisibleIndices();

  return (
    <section id="lineup" className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-3">
            Featured Artists
          </h2>
          <p className="text-sm leading-7 text-gray-400">
            Explore our amazing artist lineup
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          {/* Stack View */}
          <div className="relative flex items-center justify-center gap-4 h-[400px] w-full max-w-2xl">
            {/* Previous Card (Preview) */}
            <motion.div
              key={`prev-${prev}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 0.4, x: 0, scale: 0.85 }}
              className="absolute left-0 md:left-8 hidden sm:block"
            >
              <ArtistCard
                artist={artists[prev]}
                size="sm"
                className="blur-[1px]"
              />
            </motion.div>

            {/* Current Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="z-10"
              >
                <ArtistCard artist={artists[current]} size="lg" />
              </motion.div>
            </AnimatePresence>

            {/* Next Card (Preview) */}
            <motion.div
              key={`next-${next}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 0.4, x: 0, scale: 0.85 }}
              className="absolute right-0 md:right-8 hidden sm:block"
            >
              <ArtistCard
                artist={artists[next]}
                size="sm"
                className="blur-[1px]"
              />
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("prev")}
              className="p-2.5 rounded-full border border-gray-700 bg-gray-800/80 hover:bg-gray-700/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            {/* Dots */}
            <div className="flex gap-1.5">
              {artists.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-purple-500 w-6"
                      : "bg-gray-600 w-2 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => navigate("next")}
              className="p-2.5 rounded-full border border-gray-700 bg-gray-800/80 hover:bg-gray-700/80 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
