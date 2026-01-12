"use client";

import Image from "next/image";
import { Users, Trophy, Briefcase, Heart } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  activities?: string[];
}

export default function EventActivityPartner() {
  const partners: Partner[] = [
    {
      id: "uyab",
      name: "United Youth Association of Burma",
      title: "UYAB",
      description:
        "A leading youth organization dedicated to empowering Myanmar's young generation through community engagement, leadership development, and social initiatives.",
      image: "/EventActivityPartner/EventActivityPartner2.JPG",
      category: "Youth Organization",
      icon: <Heart className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-500",
      activities: [
        "Community Building Activities",
        "Youth Leadership Workshops",
        "Networking Sessions",
        "Social Impact Initiatives",
      ],
    },
    {
      id: "su-journey",
      name: "SU Journey & Pan Yaung Chel",
      title: "Career Life Influencers",
      description:
        "Professional career coaches and lifestyle influencers helping students navigate their career paths and personal development journey.",
      image: "/EventActivityPartner/EventActivityPartner3.PNG",
      category: "Career Development",
      icon: <Briefcase className="w-6 h-6" />,
      color: "from-pink-500 to-purple-500",
      activities: [
        "Career Guidance Sessions",
        "Personal Branding Workshop",
        "Life Skills Mentoring",
        "Success Stories Sharing",
      ],
    },
    {
      id: "uen",
      name: "University Esports Network",
      title: "UEN",
      description:
        "Myanmar's premier university esports organization connecting students through competitive gaming, tournaments, and digital sports culture.",
      image: "/EventActivityPartner/EventActivityPartner.JPG",
      category: "Esports & Gaming",
      icon: <Trophy className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      activities: [
        "Esports Tournaments",
        "Gaming Demos & Trials",
        "Team Building Games",
        "Interactive Gaming Zone",
      ],
    },
  ];

  return (
    <section id="partners" className="px-5 py-16 sm:px-8 bg-black/20">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-white/50 mb-3">
            Event Activity Partners
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powered by Amazing Partners
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            We&apos;re proud to collaborate with these incredible organizations to
            bring you diverse activities, workshops, and experiences throughout
            the festival.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner, index) => (
            <PartnerCard key={partner.id} partner={partner} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-black/40 p-8 backdrop-blur-xl shadow-[0_22px_80px_rgba(0,0,0,0.55)]">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.12),transparent_45%)]" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-cyan-400/10" />
            
            <Users className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <h3 className="text-2xl font-semibold text-white mb-3">
              Join Forces With Us
            </h3>
            <p className="text-white/70 mb-6 max-w-xl mx-auto">
              Interested in becoming an activity partner for future events?
              Let&apos;s create meaningful experiences together!
            </p>
            <a
              href="#contact"
              className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
            >
              Partner With Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnerCard({
  partner,
  index,
}: {
  partner: Partner;
  index: number;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-3xl border border-white/12 bg-black/40 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)] transition-all duration-300 hover:scale-[1.02] hover:border-white/20"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Gradient glow on hover */}
      <div
        className={`pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br ${partner.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
      />

      {/* Glass highlights */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.1),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

      {/* Partner Image */}
      <div className="relative h-[400px] sm:h-[450px] lg:h-[500px] w-full overflow-hidden">
        <Image
          src={partner.image}
          alt={`${partner.name} - ${partner.title}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={index === 0}
          unoptimized
        />
        
        {/* Icon Badge on Image */}
        <div
          className={`absolute top-4 right-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${partner.color} shadow-lg backdrop-blur-sm bg-opacity-90`}
        >
          {partner.icon}
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6">
        {/* Category Tag */}
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/15 text-white/70 mb-3">
          {partner.category}
        </span>

        {/* Partner Info */}
        <h3 className="text-xl font-bold text-white mb-2">{partner.title}</h3>
        <h4 className="text-sm text-white/60 mb-3">{partner.name}</h4>
        <p className="text-sm leading-relaxed text-white/70 mb-4">
          {partner.description}
        </p>

        {/* Activities List */}
        {partner.activities && (
          <div className="space-y-2 pt-4 border-t border-white/10">
            <p className="text-xs font-semibold text-white/80 uppercase tracking-wide mb-2">
              Activities at Festival
            </p>
            <ul className="space-y-1.5">
              {partner.activities.map((activity, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-white/60"
                >
                  <span
                    className={`mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 bg-gradient-to-r ${partner.color}`}
                  />
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hover Effect Indicator */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${partner.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
        />
      </div>
    </div>
  );
}