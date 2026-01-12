import React from "react";
import { Mail, Phone, MapPin, Facebook, Send } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";

interface FooterProps {
  config: SiteConfig;
}

const Footer: React.FC<FooterProps> = ({ config }) => {
  const quickLinks = [
    { name: "About", href: "#about" },
    { name: "Register", href: config.ctaHref },
    { name: "Program", href: "#program" },
    { name: "FAQ", href: "#faq" },
  ];

  // Map social labels to icons
  const getSocialIcon = (label: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      Facebook: <Facebook className="w-5 h-5" />,
      TikTok: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
      Instagram: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      Twitter: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      YouTube: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    };
    return iconMap[label] || <Facebook className="w-5 h-5" />;
  };

  const sponsors = [
    { name: "Partner 1", logo: "🎓" },
    { name: "Partner 2", logo: "🏢" },
    { name: "Partner 3", logo: "🎯" },
    { name: "Partner 4", logo: "⭐" },
  ];

  return (
    <footer className="w-full px-4 py-12 border-t border-gray-800/50">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 ml-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              The Whole Welcome
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {config.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http")
            ? "noopener noreferrer"
            : undefined
              }
              className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
            >
              {link.name}
            </a>
          </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Contact Us</h4>
            <div className="space-y-3">
          <div className="flex items-start gap-3 text-gray-400 text-sm">
          <a
            href="mailto:thewholewelcomefestival@gmail.com"
            className="flex items-start gap-3 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>thewholewelcomefestival</span>
          </a>
          </div>
          <div className="flex items-start gap-3 text-gray-400 text-sm">
          <a
            href="tel:+959681321845"
            className="flex items-start gap-3 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>+959681 321845</span>
          </a>
          </div>
          <div className="flex items-start gap-3 text-gray-400 text-sm">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            config.venueFull
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{config.venueFull}</span>
          </a>
          </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Follow Us</h4>
            <div className="flex gap-3">
              {config.socials.map((social, index) => (
          <a
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="w-10 h-10 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-200"
          >
            {getSocialIcon(social.label)}
          </a>
              ))}
            </div>
          </div>
        </div>

        {/* Partners/Sponsors */}
        {config.partnerLine && (
          <div className="mb-12">
            <h4 className="text-white font-semibold text-lg text-center mb-6">
              {config.partnerLine}
            </h4>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {sponsors.map((sponsor, index) => (
                <div
                  key={index}
                  className="w-20 h-20 rounded-xl bg-gray-800/30 border border-gray-700/50 flex items-center justify-center text-3xl hover:border-purple-500/50 transition-colors duration-200"
                  title={sponsor.name}
                >
                  {sponsor.logo}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2026 {config.eventTitle}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#privacy"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
