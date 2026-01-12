import type { SiteConfig } from "@/lib/siteConfig";
import { Music, Users, MapPin, Ticket } from "lucide-react";
import ScrollReveal from "./ScrollReveal";


export default function About({ config }: { config: SiteConfig }) {
  const highlights = [
    {
      icon: <Music className="w-5 h-5" />,
      text: "Amazing performances by renowned artists",
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Meet new friends from different majors",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      text: "Premium venue at Wyndham Grand Hotel",
    },
  ];

  return (
    <section id="about" className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Main Heading */}
        <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            University Life Begins Here
          </h2>
          <p className="text-lg text-gray-300">
            Ready for your first and most epic step into university life? 🔥
          </p>
        </div>
        </ScrollReveal>

        {/* Description */}
                <ScrollReveal direction="up" delay={0.2}>
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">
            THE WHOLE WELCOME FESTIVAL 2026
          </h3>

          {/* Highlights */}
          <div className="space-y-4 mb-6">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1 text-purple-400 flex-shrink-0">
                  {highlight.icon}
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {highlight.text}
                </p>
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-sm">
            Start creating unforgettable memories of your student life at{" "}
            {config.venueFull}.
          </p>
        </div>
        </ScrollReveal>

        {/* Ticket Info */}
        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl p-3 flex-shrink-0">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white mb-2">
                Ticket Information
              </h4>
              <p className="text-2xl font-bold text-white mb-3">40,000 MMK</p>
              <p className="text-gray-300 text-sm mb-4">
                Get your tickets now and join us for an unforgettable
                experience!
              </p>

              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">
                  <span className="font-semibold text-white">
                    Purchase via:
                  </span>{" "}
                  Official page chat box
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold text-white">Hotline:</span>{" "}
                  09681321845 | 09951722284
                </p>
                <p className="text-gray-400 text-xs">
                  (Available 9:00 AM - 6:00 PM)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
                <ScrollReveal direction="up" delay={0.4}>

        <div className="text-center mt-8">
          <p className="text-gray-300 text-lg">
            See you all at the festival! 🤘🏻❤️‍🔥
          </p>
        </div>
                </ScrollReveal>

      </div>
    </section>
  );
}
