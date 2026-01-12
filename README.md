# The Whole Welcome Festival 2026 — Event Landing Page MVP

A real-world, mobile-first event landing page built and launched in under 24 hours for **The Whole Welcome Festival 2026**, held in Yangon, Myanmar.

This project focuses on **speed, clarity, and real distribution**, rather than over-engineering features.

 Live site: https://wwfest.vercel.app  
Launch traction: 156 views within the first hour of deployment

---

## Overview

The Whole Welcome Festival 2026 is a student and youth-focused event designed to welcome new university students. The website serves as a **validation-first MVP**, optimized for social sharing and mobile access.

The goal was to ship a clean, high-performance landing page quickly, gather real user attention, and iterate only after feedback.

---

## Problem

The organizers needed a website that:
- Clearly communicates event details (date, time, venue)
- Is easy to share on social platforms (TikTok, messaging apps)
- Works well on mobile devices
- Can be built and deployed quickly with minimal cost

### Constraints
- 1-day development window
- No ticketing or registration at launch
- No CMS or admin panel
- Budget-conscious deployment
- Mobile-first audience (Myanmar region)

---

## Solution

We designed and built a single-page event website that includes:

- Hero section with event title, date, venue, and live countdown
- Artist and dance group lineup sections using poster-based layouts
- Featured activity section (“Red String of Fate”)
- Scroll-aware navigation with neon gradient progress
- Responsive, glassmorphism-inspired UI
- SEO and social sharing metadata for discoverability
- Fast, stable deployment on Vercel

The site was deployed publicly and shared immediately to validate interest.

---

## Tech Stack

- **Frontend:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS, shadcn/ui, FramerMotion
- **Images:** next/image with lazy loading and fade-in
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics
- **SEO:** Open Graph metadata, JSON-LD Event schema

---

## Key Technical Decisions

- Chose a static-first architecture for performance and reliability
- Focused on perceived performance rather than skeleton loaders
- Used image fade-in and glass overlays instead of placeholders
- Implemented a scroll-aware navbar to improve spatial awareness
- Optimized for social distribution rather than search-heavy SEO
- Used App Router metadata instead of legacy `<Head>` patterns

---

## Performance & SEO Considerations

- Single `<h1>` heading for semantic clarity
- Optimized images and avoided unnecessary JavaScript
- Added Open Graph metadata for social previews
- Implemented structured Event data (schema.org)
- Verified site ownership with Google Search Console

---

## Out of Scope (By Design)

The following features were intentionally excluded from the MVP:

- Ticket purchasing or RSVP forms
- User authentication
- Admin dashboard or CMS
- Multi-language support
- Detailed schedules or performer bios

These were left intentionally to develop and fast-working page in 24 hours.

---

## Possible Next Steps

- Introduce ticketing or registration flows
- Build a lightweight content management interface
- Use a custom domain for long-term reuse and QR distribution

---

## Author

Built by **Boolean Web Solution** 


---

## License

This project is intended as a portfolio and real-world MVP demonstration.
