"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useState } from "react";

type Card = {
  id: number;
  text: string;
};

const initialCards: Card[] = [
  { id: 1, text: "Card One" },
  { id: 2, text: "Card Two" },
  { id: 3, text: "Card Three" },
];

export default function CardStack() {
  const [cards, setCards] = useState<Card[]>(initialCards);

  const handleDragEnd = (event: any, info: any, id: number) => {
    if (Math.abs(info.point.x) > 150) {
      // Remove card when swiped far left/right
      setCards((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="relative w-[300px] h-[400px] mx-auto mt-10">
      <AnimatePresence>
        {cards.map((card, index) => {
          const mv = useMotionValue(0);
          const rotate = useTransform(mv, [-200, 200], [-15, 15]);
          const offset = (cards.length - index) * 6; // stack spacing

          return (
            <motion.div
              key={card.id}
              className="absolute w-full h-[350px] bg-white rounded-xl shadow-xl flex items-center justify-center text-xl font-semibold"
              style={{
                top: offset,
                x: mv,
                rotate,
                cursor: "grab",
                zIndex: index,
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => handleDragEnd(e, info, card.id)}
              whileDrag={{ scale: 1.05 }}
              exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.3 } }}
            >
              {card.text}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
