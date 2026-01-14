"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Artist = {
  id: number;
  image: string;
};

const artistImages = [
  "/artist/Artist3.JPG",
  "/artist/Artist5.JPG",
  "/artist/Artist4.JPG",
  "/artist/Artist2.JPG",
  "/artist/Artist1.JPG",
  "/artist/Artist6.JPG",
];

const artists: Artist[] = artistImages.map((image) => ({
  id: Math.floor(Math.random() * 1_000_000_000),
  image,
}));

const swipeConfidenceThreshold = 90;

const cardVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? 280 : -280,
    opacity: 0,
    scale: 0.95,
  }),
};

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
      className={`${dimensions} relative rounded-2xl overflow-hidden shadow-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 ${className}`}
    >
      <img
        src={artist.image}
        alt={`Artist ${artist.id}`}
        className="w-full h-full object-cover"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/15" />
    </div>
  );
};

interface SwipeCardProps {
  artist: Artist;
  direction: number;
  onSwipe: (nextDirection: -1 | 1) => void;
}

const SwipeCard = ({ artist, direction, onSwipe }: SwipeCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-12, 12]);

  return (
    <motion.div
      className="absolute inset-0 z-10"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.18}
      dragSnapToOrigin
      onDragEnd={(e, info) => {
        if (info.offset.x > swipeConfidenceThreshold) onSwipe(1);
        if (info.offset.x < -swipeConfidenceThreshold) onSwipe(-1);
      }}
      custom={direction}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      style={{ x, rotate }}
    >
      <ArtistCard artist={artist} size="lg" />
    </motion.div>
  );
}

// Shuffle utility to randomize artist order (Fisher-Yates)
function shuffle<T>(array: T[]) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ArtistSection() {
  // Use a shuffled copy so the showcased order is random each mount
  const [shuffledArtists] = useState<Artist[]>(() => shuffle([...artists]));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showHint, setShowHint] = useState(true);

  const handleSwipe = (nextDirection: -1 | 1) => {
    setDirection(nextDirection);
    setShowHint(false);
    if (nextDirection === -1) {
      setCurrentIndex((prev) =>
        prev === shuffledArtists.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentIndex((prev) =>
        prev === 0 ? shuffledArtists.length - 1 : prev - 1
      );
    }
  };

  const getVisibleIndices = () => {
    const prev =
      currentIndex === 0 ? shuffledArtists.length - 1 : currentIndex - 1;
    const next =
      currentIndex === shuffledArtists.length - 1 ? 0 : currentIndex + 1;
    return { prev, current: currentIndex, next };
  };

  const { current, next } = getVisibleIndices();

  useEffect(() => {
    if (!showHint) return;
    const timeoutId = window.setTimeout(() => setShowHint(false), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [showHint]);

  return (
    <section
      id="lineup"
      className="px-5 py-16 sm:px-8"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") handleSwipe(1);
        if (event.key === "ArrowRight") handleSwipe(-1);
      }}
    >
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
          {/* Mobile Tinder View */}
          <div className="relative h-[400px] w-full max-w-[320px] sm:hidden">
            <div className="absolute inset-0 flex items-center justify-center z-0 scale-[0.94] translate-y-3 opacity-70">
              <ArtistCard artist={shuffledArtists[next]} size="lg" />
            </div>
            <AnimatePresence mode="wait" custom={direction}>
              <SwipeCard
                key={current}
                artist={shuffledArtists[current]}
                direction={direction}
                onSwipe={handleSwipe}
              />
            </AnimatePresence>
            <AnimatePresence>
              {showHint && (
                <motion.div
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs text-white/80 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                >
                  Swipe to browse artists
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Stack View */}
          <div className="relative hidden sm:flex items-center justify-center gap-4 h-[400px] w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                className="z-10"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 100) handleSwipe(1);
                  if (info.offset.x < -100) handleSwipe(-1);
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <ArtistCard artist={shuffledArtists[current]} size="lg" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => handleSwipe(1)}
              aria-label="Previous artist"
              className="p-2.5 rounded-full border border-gray-700 bg-gray-800/80 hover:bg-gray-700/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            {/* Dots */}
            <div className="flex gap-1.5">
              {shuffledArtists.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to artist ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-purple-500 w-6"
                      : "bg-gray-600 w-2 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => handleSwipe(-1)}
              aria-label="Next artist"
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
