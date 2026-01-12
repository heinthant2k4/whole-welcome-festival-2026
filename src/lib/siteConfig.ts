// src/lib/siteConfig.ts
export type Locale = "en";

export type SiteConfig = {
  eventTitle: string;
  tagline: string;
  startISO: string; // Myanmar time (+06:30)
  endISO: string;
  venueShort: string;
  venueFull: string;
  venueLink?: string;
  ctaLabel: string;
  ctaHref: string; // TikTok link
  socials: { label: string; href: string }[];
  partnerLine?: string; // leave blank until we get further info
  eventMail?: string;
  eventPhone?: string;
};

/**
 * Configuration object for the Whole Welcome Festival 2026 website. Default coded ones.
 */
export const siteConfig: SiteConfig = {
  eventTitle: "The Whole Welcome Festival 2026",
  tagline: "Where University Life Begins",
  // Myanmar Time (UTC+06:30)
  startISO: "2026-01-17T10:00:00+06:30",
  endISO: "2026-01-17T18:00:00+06:30",
  venueShort: "Wyndham Grand Ballroom",
  venueFull: "Wyndham Grand Yangon Hotel, Myanmar",
  venueLink: "https://maps.app.goo.gl/uUqrzgJAj88WjR7Y8",
  ctaLabel: "Visit Page",
  ctaHref: "https://www.tiktok.com/@the.whole.welcome?_r=1&_t=ZS-92zILFL27Hx",
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61585481756232" },
    { label: "TikTok", href: "https://www.tiktok.com/@the.whole.welcome?_r=1&_t=ZS-92zILFL27Hx" },
  ],
  eventMail: "thewholewelcomefestival2026@gmail.com",
  eventPhone: "+95 9 681 321845"
  // partnerLine: "blah blah partners go here",
};
