import React from "react";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";

interface InfoCard {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

interface QuickInfoCardsProps {
  config: SiteConfig;
}

const QuickInfoCards: React.FC<QuickInfoCardsProps> = ({ config }) => {
  // Parse dates from ISO strings
  const startDate = new Date(config.startISO);
  const endDate = new Date(config.endISO);

  // Format date
  const formattedDate = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format time range
  const startTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const endTime = endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const timeRange = `${startTime} - ${endTime}`;

  const dateTimeCards: InfoCard[] = [
    {
      icon: <Calendar className="w-6 h-6" />,
      label: "Date",
      value: formattedDate,
      color: "from-pink-500 to-purple-500",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: "Time",
      value: timeRange,
      color: "from-cyan-500 to-pink-500",
    },
  ];

  // Combine all cards into one array
  const allCards: InfoCard[] = [
    ...dateTimeCards,
    {
      icon: <MapPin className="w-6 h-6" />,
      label: "Location",
      value: config.venueShort,
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: "Who Can Join",
      value: "All University Students",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <section className="w-full px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
          Festival Informations
        </h2>

        {/* All Cards in 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {allCards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Gradient Background on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
              />

              {/* Icon Container */}
              <div
                className={`relative w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}
              >
                {card.icon}
              </div>

              {/* Content */}
              <div className="relative">
                <p className="text-gray-400 text-sm font-medium mb-1">
                  {card.label}
                </p>
                <p className="text-white text-lg font-semibold leading-tight">
                  {card.value}
                </p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-purple-500/30 group-hover:bg-purple-500 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickInfoCards;
