"use client";
import React from "react";
import Image from "next/image";

const Sponsorship: React.FC = () => {
  const sponsor = {
    name: "SU Business Group",
    website: "https://www.facebook.com/subusinessgroup",
  };

  return (
    <section id="sponsors" className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-xl font-semibold tracking-tight text-white mb-3">
            Thank you to our amazing sponsor for making this festival possible
          </h2>
        </div>

        {/* Single Sponsor Card */}
        <div className="flex justify-center">
          <a
            href={sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="w-64 h-64 md:w-80 md:h-80 rounded-3xl flex items-center justify-center cursor-pointer"
          >
            <div className="flex flex-col items-center gap-4 w-full px-8">
              <div className="w-full flex justify-center">
                <Image
                  src="/hero/Sponsor.PNG"
                  alt="SU Business Group"
                  width={200}
                  height={200}
                  className="h-auto w-full max-w-[200px] object-contain"
                />
              </div>
              <p className="text-white font-semibold text-lg">{sponsor.name}</p>
            </div>
          </a>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Official Sponsor of The Whole Welcome Festival 2026
          </p>
        </div>

        {/* Become a Sponsor CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Interested in sponsoring future events?
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default Sponsorship;
