// English content — source of truth for the Dictionary shape.
// Voice: direct, confident, human. Short sentences. No inflated claims.

const en = {
  dir: "ltr",
  brand: {
    name: "Cue",
    tagline: "Simple for guests, structured for operators.",
    location: "Launching in Amman",
  },

  nav: {
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/partner", label: "Partner" },
      { href: "/about", label: "About" },
      { href: "/careers", label: "Careers" },
      { href: "/faq", label: "FAQ" },
    ],
    cta: "Get in Cue",
    langToggle: "العربية",
    menu: "Menu",
    close: "Close",
  },

  common: {
    getStarted: "Get in Cue",
    partnerWithCue: "Partner with Cue",
    bookACall: "Book a call",
    learnMore: "Learn more",
    seeHowItWorks: "See how it works",
    joinWaitlist: "Join early access",
    readMore: "Read more",
    backToTop: "Back to top",
    preLaunch: "Pre-launch · Amman",
    theme: { light: "Switch to light mode", dark: "Switch to dark mode" },
  },

  // ---------------- HOME ----------------
  home: {
    meta: {
      title: "Cue — The coordination layer for hospitality",
      description:
        "Cue is the reservation and coordination layer between guests and venues. Every request in one place, confirmed in one tap. Bilingual by design. Launching in Amman.",
    },
    hero: {
      status: "Pre-launch · Amman",
      titleTop: "Every reservation,",
      titleAccent: "under control.",
      subtitle:
        "Cue is the coordination layer between guests and venues. Requests arrive, your team confirms, and everyone knows exactly where they stand. No phone tag. No double-bookings. No walk-in guesswork.",
      primary: "Partner with Cue",
      secondary: "Join early access",
      note: "Partnering with founding venues in Amman.",
      board: {
        title: "Tonight · Service board",
        live: "Live",
        states: {
          incoming: "Incoming",
          confirmed: "Confirmed",
          seated: "Seated",
        },
        rows: [
          { name: "Layali — party of 4", time: "8:30 PM" },
          { name: "Nadia K. — party of 2", time: "9:00 PM" },
          { name: "Sami R. — party of 6", time: "9:15 PM" },
          { name: "Hold — party of 3", time: "9:45 PM" },
        ],
        footerLabel: "Covers tonight",
        footerValue: "142",
        confirmLabel: "Confirm",
      },
    },
    problem: {
      label: "The problem",
      title: "Bookings break in the gaps.",
      body: "Reservations live across DMs, phone calls, walk-ins, and a paper book. Nobody holds the full picture — so tables get double-booked and no-shows go unnoticed.",
      resolve: "Cue puts every request in one place and gives your team a single source of truth.",
    },
    hiw: {
      label: "How it works",
      title: "One system. Two sides.",
      body: "Simple for the guest. Structured for the team running the floor.",
      tabs: {
        guests: "For guests",
        operators: "For operators",
      },
      guests: [
        { title: "Discover", body: "Browse venues across Amman — by area, cuisine, and price." },
        { title: "Request", body: "Pick a date, time, and party size. Add a note. Send." },
        { title: "Get confirmed", body: "An instant, unambiguous status — no chasing a reply." },
        { title: "Arrive", body: "Show up to a table that's actually held for you." },
      ],
      operators: [
        { title: "Receive", body: "Every request lands in one queue the moment it's made." },
        { title: "Decide", body: "Confirm, decline, or hold in a single tap." },
        { title: "Coordinate", body: "Group bookings, event nights, and guest flow, handled in the background." },
        { title: "Review", body: "See covers, confirmation rates, and what's working." },
      ],
    },
    features: {
      label: "What you get",
      title: "Built for the pass, not the pitch deck.",
      items: [
        {
          icon: "inbox",
          title: "Real-time requests",
          body: "Every booking request in one live queue, the moment it's made.",
        },
        {
          icon: "dashboard",
          title: "Operator dashboard",
          body: "Confirm, decline, and track covers from a single screen.",
        },
        {
          icon: "shield",
          title: "No-show controls",
          body: "Automatic confirmations and reminders keep tables from going cold.",
        },
        {
          icon: "language",
          title: "Bilingual by default",
          body: "Arabic and English as equals — for your guests and your team.",
        },
        {
          icon: "flow",
          title: "Guest flow",
          body: "Group bookings and busy nights, coordinated without the back-and-forth.",
        },
        {
          icon: "pin",
          title: "Built for Amman",
          body: "Launching local, tuned to how venues here actually run service.",
        },
      ],
    },
    demo: {
      label: "The product",
      title: "See Cue in motion.",
      body: "A pass through the app your guests use and the dashboard your team runs on.",
      play: "Play",
      pause: "Pause",
      slides: [
        { img: "/images/cue-app-home-screen.jpeg", caption: "Guests discover venues across Amman." },
        { img: "/images/cue-app-profile-screen.jpeg", caption: "Tonight's floor, at a glance." },
        { img: "/images/cue-app-search-filters.jpeg", caption: "Confirm or decline in one tap." },
        { img: "/images/cue-app-booking-flow.jpeg", caption: "Event nights and table demand, in one view." },
        { img: "/images/cue-app-venue-detail.jpeg", caption: "The numbers that tell you what's working." },
      ],
    },
    operators: {
      label: "For operators",
      title: "The control room for your floor.",
      body: "One screen for every reservation — confirmed covers, pending requests, event nights, and the numbers behind them. Cue runs quietly in the background so your team stays on service.",
      points: [
        "Confirm or decline requests in one tap",
        "See tonight's covers before you open the doors",
        "Cut no-shows with automatic confirmations",
        "Coordinate group bookings and event nights",
      ],
      cta: "Partner with Cue",
      image: "/images/cue-app-profile-screen.jpeg",
      imageAlt: "Cue operator dashboard — tonight's bookings at a glance",
    },
    traction: {
      label: "Traction",
      title: "Operational truth over vanity metrics.",
      body: "We're onboarding founding venues in Amman now. Real partner logos and results land here as they go live.",
      logosLabel: "Founding partners",
      logosPlaceholder: "Your venue here",
      targetsLabel: "Where we're headed — 18-month targets",
      targets: [
        { value: "60+", label: "Live venues" },
        { value: "12K+", label: "Monthly requests" },
        { value: "90%+", label: "Confirmation rate" },
        { value: "85%+", label: "Venue retention" },
      ],
    },
    faqHome: {
      label: "FAQ",
      title: "Straight answers.",
      seeAll: "See all questions",
    },
    finalCta: {
      title: "Bring your floor onto Cue.",
      body: "We partner with a small number of founding venues in Amman. If clarity and control matter to how you run service, let's talk.",
      primary: "Partner with Cue",
      secondary: "Join early access",
    },
  },

  // ---------------- HOW IT WORKS ----------------
  how: {
    meta: {
      title: "How Cue works — the platform and the thinking behind it",
      description:
        "See how Cue works for guests and operators: discovery, booking, confirmation, coordination, and a full partner dashboard. Built for real-world hospitality.",
    },
    hero: {
      eyebrow: "How it works",
      title: "The platform, and the thinking behind it.",
      subtitle:
        "Cue is built end to end — a clean experience for guests, a structured system for operators. Here's how the whole loop fits together.",
    },
    loop: {
      kicker: "The booking loop",
      title: "Four steps. One reliable flow.",
      steps: [
        {
          n: "01",
          title: "Discover",
          body: "Guests find venues through rich cards, search, and filters for area, cuisine, and price. Your venue shows up the way you'd want it to.",
        },
        {
          n: "02",
          title: "Request",
          body: "A guest picks a date, time, party size, and adds any notes. The request lands in your queue as pending — nothing is confirmed until you say so.",
        },
        {
          n: "03",
          title: "Confirm",
          body: "Your team reviews and confirms, declines, or completes. The guest gets an instant, unambiguous status update.",
        },
        {
          n: "04",
          title: "Coordinate",
          body: "Group activity, guest flow, and reminders are handled in the background — so service stays the focus.",
        },
      ],
    },
    guest: {
      kicker: "For guests",
      title: "A booking experience that feels effortless.",
      body: "Guests get a simple, transparent way to plan and manage outings — from first browse to a confirmed table.",
      features: [
        {
          img: "/app/discover.png",
          title: "Browse & search",
          body: "A curated home screen of venues in Amman, with search and filters for area, cuisine, and price level.",
        },
        {
          img: "/app/venue.png",
          title: "Venue detail",
          body: "Gallery, hours, location, menu, and price level — everything a guest needs to decide, in one view.",
        },
        {
          img: "/app/book.png",
          title: "Request a table",
          body: "Date, time, party size, and special requests — a fast, clear booking flow.",
        },
        {
          img: "/app/bookings.png",
          title: "My bookings",
          body: "Every reservation and its status in one place, with history and detail on tap.",
        },
      ],
    },
    operator: {
      kicker: "For operators",
      title: "A dashboard built for the pass, not the boardroom.",
      body: "Cue gives your team visibility and control without adding load. Confirm bookings, manage busy nights, and understand performance — all in one structured system.",
      features: [
        {
          img: "/images/cue-app-profile-screen.jpeg",
          title: "Today at a glance",
          body: "Confirmed covers, pending requests, and the night ahead — the moment you open the app.",
        },
        {
          img: "/images/cue-app-search-filters.jpeg",
          title: "Booking management",
          body: "Review, confirm, decline, and complete requests. Every reservation, one clear queue.",
        },
        {
          img: "/images/cue-app-booking-flow.jpeg",
          title: "Event nights",
          body: "Coordinate high-demand nights — table sessions, capacity, and group activity in one place.",
        },
        {
          img: "/images/cue-app-venue-detail.jpeg",
          title: "Performance",
          body: "Booking volume, confirmation rates, and trends — the numbers that tell you what's working.",
        },
      ],
    },
    philosophy: {
      kicker: "The thinking",
      title: "We build on what actually works on the ground.",
      body: "Cue isn't here to replace your team or force a new process. It's structured infrastructure that fits how hospitality already operates — fast to adopt, reliable under pressure, and bilingual from day one.",
      points: [
        {
          title: "Operational truth",
          body: "Every feature is grounded in how venues really run a service — not how software wishes they would.",
        },
        {
          title: "Fast before complex",
          body: "We ship the core booking loop first and keep it clean. Depth comes without clutter.",
        },
        {
          title: "Bilingual by design",
          body: "Arabic and English as equals — for guests and for your team, everywhere in the product.",
        },
      ],
    },
    cta: {
      title: "See it with your own venue in mind.",
      body: "Let's walk through how Cue fits your operation.",
      primary: "Partner with Cue",
      secondary: "Join early access",
    },
  },

  // ---------------- PARTNER ----------------
  partner: {
    meta: {
      title: "Partner with Cue — structured booking for hospitality operators",
      description:
        "Cue partners with restaurants, venues, and hospitality groups to simplify reservations, reduce manual coordination, and improve operational control.",
    },
    hero: {
      eyebrow: "Partner with Cue",
      title: "A booking platform built to support modern operations.",
      subtitle:
        "Cue partners with restaurants, venues, and hospitality businesses to simplify reservations, reduce manual coordination, and improve operational control — without disrupting how your team works.",
      primary: "Start a conversation",
      secondary: "See how it works",
    },
    why: {
      kicker: "Why partner with Cue",
      title: "Built for businesses that value clarity, efficiency, and consistency.",
      items: [
        {
          title: "Reduce operational friction",
          body: "Eliminate unnecessary back-and-forth, manual confirmations, and fragmented booking channels.",
        },
        {
          title: "Maintain control at scale",
          body: "Manage reservations, group activity, and guest flow through structured, automated systems.",
        },
        {
          title: "Improve reliability",
          body: "Standardized booking infrastructure reduces errors and improves consistency across operations.",
        },
        {
          title: "Designed for real-world use",
          body: "Cue aligns with how hospitality teams already operate — no forced process changes.",
        },
      ],
    },
    builtFor: {
      kicker: "Who Cue is built for",
      title: "For operations that depend on timing, coordination, and reliability.",
      body: "Cue partners with hospitality businesses that manage regular guest flow and group activity.",
      items: [
        "Restaurants and dining concepts",
        "Event-focused venues",
        "Hospitality groups and multi-location operators",
        "Businesses modernizing reservations without overcomplication",
      ],
    },
    steps: {
      kicker: "How Cue works for partners",
      title: "Integrate. Automate. Operate with clarity.",
      items: [
        {
          n: "01",
          title: "Integrate",
          body: "Cue connects with your booking flow to centralize reservations and guest coordination.",
        },
        {
          n: "02",
          title: "Automate",
          body: "Manual steps are reduced through structured, real-time reservation handling.",
        },
        {
          n: "03",
          title: "Operate with clarity",
          body: "Teams gain visibility and control without increasing load. Cue works quietly in the background, so staff focus on service rather than logistics.",
        },
      ],
    },
    approach: {
      kicker: "Our partnership approach",
      title: "Partnerships based on alignment — not volume.",
      body: "Cue partners selectively with businesses that value operational discipline and long-term reliability. We build systems that support hospitality teams, not replace them. Partnerships are based on alignment, clarity, and shared standards.",
    },
    cta: {
      title: "Start a conversation.",
      body: "If you're interested in partnering with Cue, connect with our team to explore fit and next steps.",
      primary: "Partner with Cue",
      secondary: "Book a call",
    },
  },

  // ---------------- ABOUT ----------------
  about: {
    meta: {
      title: "About Cue — where guests and hospitality connect",
      description:
        "Cue is a hospitality booking and coordination platform that balances guest experience with operational control, setting a higher standard for how bookings are managed.",
    },
    hero: {
      eyebrow: "About Cue",
      title: "Where guests and hospitality connect.",
      subtitle:
        "Cue is a hospitality-focused booking and coordination platform designed to simplify how people plan outings and how venues manage demand.",
    },
    mission: {
      kicker: "The mission",
      title: "Dependable booking infrastructure for real-world hospitality.",
      body: "Cue connects guests and hospitality operators through a structured, reliable system that reduces friction on both sides of the experience. Our goal is to set a higher standard for how hospitality bookings are managed.",
    },
    problem: {
      kicker: "What Cue solves",
      title: "Booking is fragmented. Coordination is manual. Cue fixes both.",
      body: "Cue addresses common challenges in hospitality — fragmented booking processes, group coordination, and operational inefficiencies. By bringing these elements onto a single platform, Cue supports reservations, group activity, and guest flow in a clear, controlled way.",
      columns: [
        {
          title: "For guests",
          body: "A simple and transparent way to plan and manage outings — from browsing to a confirmed table.",
        },
        {
          title: "For operators",
          body: "The operational structure to handle bookings efficiently, aligned with real-world hospitality workflows.",
        },
      ],
    },
    values: {
      kicker: "What we stand on",
      title: "The principles behind every decision.",
      items: [
        { title: "Local before broad", body: "Win Amman first. Build depth before breadth." },
        { title: "Fast before complex", body: "Ship the core loop, keep it clean, add depth without clutter." },
        { title: "Operational truth", body: "Build on what actually works on the ground." },
        { title: "Bilingual by design", body: "Arabic and English as equals — everywhere." },
        { title: "Licensed rails", body: "Compliant and considered from day one." },
        { title: "Data minimization", body: "Collect only what's needed. Nothing more." },
      ],
    },
    vision: {
      kicker: "The vision",
      title: "A higher standard for hospitality bookings.",
      body: "Cue's goal is to deliver dependable booking infrastructure that balances guest experience with operational control — starting in Amman, and built to grow across the region.",
      cta: "Discover Cue",
    },
  },

  // ---------------- REACH OUT ----------------
  reach: {
    meta: {
      title: "Get in Cue — join early access",
      description:
        "Cue is in its final development phase. Join early access to be among the first businesses and guests to work with us.",
    },
    hero: {
      eyebrow: "Get started",
      status: "Cue is in its final development phase and preparing for launch.",
      title: "Let's get started.",
      subtitle:
        "We're in the final stages of building Cue. If you'd like to be among the first to work with us, share your details and we'll reach out with updates and early partnership opportunities.",
    },
    form: {
      heading: "Join early access",
      subheading: "Frictionless. We only ask for what we need.",
      audienceLabel: "I'm reaching out as",
      audiences: [
        { value: "operator", label: "A venue / operator" },
        { value: "guest", label: "A guest / early adopter" },
        { value: "talent", label: "Talent / job seeker" },
      ],
      fields: {
        name: "Full name",
        email: "Email",
        phone: "Phone",
        establishment: "Establishment name",
        instagram: "Instagram (optional)",
        message: "Anything you'd like us to know? (optional)",
      },
      placeholders: {
        name: "Your name",
        email: "you@example.com",
        phone: "+962 …",
        establishment: "Your venue's name",
        instagram: "@yourhandle",
        message: "Tell us about your venue or what you're looking for",
      },
      establishmentHint: "Shown because you're reaching out as an operator.",
      submit: "Join early access",
      submitting: "Sending…",
      contactPref: "Preferred contact",
      contactOptions: [
        { value: "email", label: "Email me" },
        { value: "call", label: "Schedule a call" },
      ],
      requiredNote: "Required fields are marked with an asterisk (*).",
      success: {
        title: "You're in.",
        body: "Thanks — we've got your details. We'll be in touch with early access updates and next steps.",
        again: "Submit another response",
      },
      error: "Something went wrong. Please try again, or email us directly.",
      secondaryCta: "Prefer to talk? Book a call",
    },
  },

  // ---------------- CAREERS ----------------
  careers: {
    meta: {
      title: "Careers at Cue — build the future of hospitality booking",
      description:
        "Cue is building the future of seamless restaurant reservations and hospitality technology. We welcome talented people from around the world.",
    },
    hero: {
      eyebrow: "Careers",
      title: "Build the next generation of dining experiences.",
      subtitle:
        "Cue is building the future of seamless restaurant reservations and hospitality technology. We're always looking for talented, driven people who want to shape it with us.",
      primary: "Open application",
    },
    why: {
      kicker: "Why Cue",
      title: "Small team. Real product. Room to shape it.",
      body: "We operate as a global team and welcome applications from professionals across all regions. Whether your expertise is technology, operations, partnerships, marketing, design, or customer success — if you believe in building simple, powerful solutions for real-world businesses, we want to hear from you.",
      items: [
        { title: "Real ownership", body: "Early enough that your work defines the product, not just maintains it." },
        { title: "Craft matters", body: "We care about the details — in code, in design, and in how we treat partners." },
        { title: "Global & bilingual", body: "A team that works across regions and builds for Arabic and English as equals." },
      ],
    },
    roles: {
      kicker: "Where we're hiring",
      title: "Current focus areas.",
      note: "Don't see your exact role? Send an open application — we're always meeting exceptional people.",
      items: [
        { title: "Application development", area: "Engineering", body: "Ship and scale the Cue app and partner dashboard." },
        { title: "Brand management", area: "Brand", body: "Own and grow the Cue brand across every touchpoint." },
        { title: "Content development", area: "Marketing", body: "Craft the words, guides, and stories that build trust." },
        { title: "Media management", area: "Marketing", body: "Run social and creator partnerships across Amman." },
      ],
    },
    cta: {
      title: "We're always hiring exceptional people.",
      body: "Tell us how you can add value to the team.",
      primary: "Open application",
    },
  },

  // ---------------- FAQ ----------------
  faq: {
    meta: {
      title: "FAQ — Cue hospitality booking platform",
      description:
        "Answers to common questions about Cue: what it is, how it works, how restaurants join, and when Cue launches.",
    },
    hero: {
      eyebrow: "Help center",
      title: "Questions, answered.",
      subtitle: "The essentials on what Cue is, how it works, and how to join.",
    },
    items: [
      {
        q: "What is Cue?",
        a: "Cue is the coordination layer between guests and venues. Guests get a simple way to find and book a table; venues get one structured system for reservations, group activity, and guest flow. One source of truth for both sides of every booking.",
      },
      {
        q: "How do reservations work?",
        a: "A guest picks a venue, date, time, and party size, then sends the request. It lands in the venue's dashboard as pending. The venue confirms, declines, or holds it — and the guest gets an instant, unambiguous status. Reminders and coordination run in the background.",
      },
      {
        q: "Is Cue free for guests?",
        a: "Yes. Discovering venues and booking a table through Cue is free for guests. There's no charge to browse, request, or manage your reservations.",
      },
      {
        q: "How does my restaurant sign up?",
        a: "We partner selectively with venues that value clarity and reliability. Go to Partner with Cue, share a few details, and our team reaches out to check fit and walk you through onboarding. Founding partners in Amman onboard at zero risk.",
      },
      {
        q: "Where is Cue available?",
        a: "Amman first. We're launching locally and going deep before we go broad — tuned to how venues in Amman actually run service. Expansion across the region follows once the local network is solid.",
      },
      {
        q: "Is Cue available in Arabic?",
        a: "Yes. Cue is bilingual by design — full English and Arabic across the app, the dashboard, this site, and every form and notification. Neither language is an afterthought.",
      },
      {
        q: "What's the cancellation policy?",
        a: "Guests can cancel a reservation from the app whenever plans change; earlier is always better for the venue. Each venue sets its own terms for holds and no-shows, and those terms are shown before you confirm. Repeated no-shows may limit an account.",
      },
      {
        q: "How is my data handled?",
        a: "Cue follows a strict data-minimization approach under Jordan's PDPL. We collect only what's needed to run a booking, share only what a venue needs to fulfill it, and never sell personal data. See our Privacy Policy for the full detail.",
      },
    ],
    contact: {
      kicker: "Any other questions?",
      title: "We're here to help.",
      body: "Send us a message and we'll get back to you within 48 hours.",
      fields: {
        name: "Name",
        email: "Email",
        message: "Message",
      },
      submit: "Send message",
      success: "Thanks — your message is on its way. We'll reply within 48 hours.",
    },
  },

  // ---------------- LEGAL ----------------
  legal: {
    meta: {
      title: "Legal — Cue",
      description:
        "Cue legal center: Terms of Service, Privacy Policy, Cookie Policy, Data Processing Agreement, and Legal Notice. Governed by the laws of the Hashemite Kingdom of Jordan.",
    },
    index: {
      eyebrow: "Legal center",
      title: "Terms & policies.",
      subtitle:
        "Cue Technologies operates under the laws of the Hashemite Kingdom of Jordan, with jurisdiction in the courts of Amman. We follow a data-minimization approach and never sell personal data.",
      docsLabel: "Documents",
      docs: [
        { href: "/legal/terms", title: "Terms of Service", body: "The terms that govern use of the Cue app, website, and services." },
        { href: "/legal/privacy", title: "Privacy Policy", body: "How we collect, use, and protect personal data under Jordan's PDPL." },
        { href: "/legal/cookies", title: "Cookie Policy", body: "How Cue uses cookies and similar technologies." },
        { href: "/legal/dpa", title: "Data Processing Agreement", body: "How Cue processes personal data on behalf of partners." },
        { href: "/legal/notice", title: "Legal Notice", body: "Company identity, entity details, and general legal terms." },
      ],
    },
    common: {
      lastUpdated: "Last updated",
      updatedValue: "July 2026",
      backToLegal: "All legal documents",
      governing:
        "Governed by the laws of the Hashemite Kingdom of Jordan. Jurisdiction: the competent courts of Amman.",
    },
    // Documents: each has title, intro, and sections [{h, p?[], list?[]}]
    terms: {
      title: "Terms of Service",
      intro:
        "These Terms and Conditions (“Terms”) govern access to and use of the Cue mobile application, website, and related services (“Cue” or the “Service”). By creating an account, accessing the platform, or submitting a reservation, the user (“User”) agrees to be legally bound by these Terms. Cue is operated by Cue Technologies (“Company”), registered in the Hashemite Kingdom of Jordan. If the User does not agree to these Terms, the User must not access or use Cue.",
      sections: [
        {
          h: "1. Acceptance of Terms",
          list: [
            "By accessing or using Cue, the User confirms acceptance of these Terms.",
            "These Terms constitute a legally binding agreement between the User and Cue.",
            "Cue reserves the right to update or modify these Terms at any time with or without notice.",
          ],
        },
        {
          h: "2. Eligibility",
          list: [
            "The User must be at least 18 years old to create an account or make reservations.",
            "Users under 18 must obtain consent from a parent or legal guardian.",
            "Cue may refuse access or terminate accounts that violate eligibility requirements.",
          ],
        },
        {
          h: "3. User Account",
          list: [
            "The User must provide accurate, complete, and current information during registration.",
            "The User is responsible for maintaining the confidentiality of their login credentials.",
            "The User is fully responsible for all activity under their account.",
            "Cue may suspend or terminate accounts for providing false information, misuse of the platform, or violations of these Terms.",
          ],
        },
        {
          h: "4. Use of the Cue Platform",
          list: [
            "Cue provides a digital interface enabling Users to request table reservations at participating restaurants.",
            "Cue is not a restaurant, food provider, or dining establishment.",
            "Cue does not guarantee the availability, quality, or accuracy of restaurant services or information.",
            "Users must comply with all restaurant rules, policies, and instructions.",
            "Cue may modify, suspend, or discontinue any part of the Service at any time.",
          ],
        },
        {
          h: "5. Reservation Requests",
          list: [
            "Cue forwards User reservation requests to restaurants for review.",
            "Reservations created through Cue are considered requests, not confirmed bookings, unless explicitly approved by the restaurant.",
            "Cue is not responsible for restaurant response times, reservation approval or rejection, or restaurant errors, cancellations, or mistakes.",
            "Once confirmed by the restaurant, the User is expected to attend the reservation as scheduled.",
          ],
        },
        {
          h: "6. Cancellations, No-Shows, and Changes",
          list: [
            "Users should cancel reservations in advance when they cannot attend.",
            "Repeated no-shows may result in account limitations or termination.",
            "Restaurants reserve the right to cancel confirmed reservations due to operational reasons.",
            "Cue is not liable for losses or damages arising from cancellations, delays, or changes initiated by Users or restaurants.",
          ],
        },
        {
          h: "7. User Conduct",
          p: [
            "The User agrees not to misuse Cue, including but not limited to: providing false reservation details; attempting to bypass system controls; harassing or abusing restaurant staff; or impersonating another person.",
            "Cue may take action including account termination, legal steps, or reporting to authorities.",
          ],
        },
        {
          h: "8. Restaurant Information and Accuracy",
          list: [
            "Restaurant details (images, menu items, hours, pricing, etc.) are provided by the restaurants.",
            "Cue does not guarantee the accuracy, completeness, or reliability of any restaurant information.",
            "Cue is not responsible for outdated or incorrect listings.",
          ],
        },
        {
          h: "9. Third-Party Interactions",
          list: [
            "All interactions between the User and restaurants occur at the User's own risk.",
            "Cue is not responsible for disputes, injuries, damages, service quality, or experiences occurring at any restaurant.",
            "Cue does not monitor or control restaurant operations.",
          ],
        },
        {
          h: "10. Payment Terms (Future Features)",
          p: [
            "If Cue introduces payment processing, the User agrees to provide accurate payment information, authorize Cue or third-party processors to charge applicable fees, and comply with the refund and cancellation rules.",
            "All payment processing will comply with relevant financial regulations in Jordan.",
          ],
        },
        {
          h: "11. Intellectual Property",
          p: [
            "Cue owns all intellectual property rights related to platform design, software architecture, branding and logos, and content created by Cue.",
            "Users may not copy, modify, distribute, or exploit Cue's intellectual property without written permission.",
          ],
        },
        {
          h: "12. Privacy and Data Protection",
          list: [
            "Cue complies with the Jordan Personal Data Protection Law (PDPL).",
            "User data is processed solely for reservation and platform functionality.",
            "Cue may share limited User information with restaurants for reservation fulfillment.",
            "Cue will never sell User data to third parties.",
            "Users acknowledge that electronic transmission of data cannot be fully secured.",
          ],
        },
        {
          h: "13. Limitation of Liability",
          list: [
            "Cue is not liable for restaurant errors, conduct, or service quality; no-shows or missed reservations; damages, injuries, or losses occurring at restaurant premises; or loss of profits, reputation, business, or data.",
            "Cue provides the Service on an “as-is” and “as-available” basis.",
            "Cue's maximum liability is limited to the total amount paid by the User to Cue in the previous six months (if any).",
          ],
        },
        {
          h: "14. Indemnification",
          p: [
            "The User agrees to indemnify and hold Cue harmless from claims, damages, expenses, and liabilities arising from misuse of the platform, violation of these Terms, disputes with restaurants, or incorrect User information.",
          ],
        },
        {
          h: "15. Termination",
          list: [
            "Cue may terminate or suspend User access without notice for violations of these Terms.",
            "Users may delete their account at any time.",
            "Upon termination, Users will lose access to their reservation history and stored data.",
          ],
        },
        {
          h: "16. Governing Law and Dispute Resolution",
          list: [
            "These Terms are governed by the laws of the Hashemite Kingdom of Jordan.",
            "Any disputes shall be resolved before the competent courts of Amman.",
            "Parties agree to attempt amicable resolution before formal legal action.",
          ],
        },
        {
          h: "17. Modifications to the Terms",
          list: [
            "Cue reserves the right to amend these Terms at any time.",
            "Continued use of the Service after updates constitutes acceptance of the revised Terms.",
          ],
        },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      intro:
        "This Privacy Policy explains how Cue Technologies (“Cue,” “we,” “us”) collects, uses, and protects personal data when you use the Cue app, website, and services. Cue is committed to the Jordan Personal Data Protection Law (PDPL) and follows a strict data-minimization approach: we collect only what we need to operate the Service, and we never sell personal data.",
      sections: [
        {
          h: "1. Data We Collect",
          list: [
            "Account data: name, email, and optional phone number.",
            "Reservation data: venue, date, time, party size, and any notes you provide.",
            "Contact submissions: details you share through our forms (such as establishment name or Instagram).",
            "Technical data: limited device and usage information needed to keep the Service secure and reliable.",
          ],
        },
        {
          h: "2. How We Use Data",
          list: [
            "To create and manage your account and process reservation requests.",
            "To share limited reservation details with venues so they can fulfill your booking.",
            "To communicate with you about your bookings, updates, and early-access opportunities.",
            "To maintain security, prevent misuse, and improve the reliability of the Service.",
          ],
        },
        {
          h: "3. Legal Basis & Consent",
          list: [
            "We process personal data based on your consent, the performance of our services to you, and our legitimate operational interests.",
            "You may withdraw consent for optional processing at any time.",
          ],
        },
        {
          h: "4. Sharing of Data",
          list: [
            "We share limited data with venues solely to fulfill your reservation.",
            "We may use trusted service providers (such as hosting and communications) under appropriate safeguards.",
            "We never sell personal data to third parties.",
          ],
        },
        {
          h: "5. Data Retention & Security",
          list: [
            "We retain personal data only for as long as necessary to provide the Service or as required by law.",
            "We apply appropriate technical and organizational security measures to protect your data.",
            "No electronic transmission or storage is fully secure; we work continuously to safeguard your information.",
          ],
        },
        {
          h: "6. Your Rights",
          p: [
            "Subject to applicable law, you may request access to, correction of, or deletion of your personal data, and you may object to or restrict certain processing. To exercise these rights, contact us using the details in our Legal Notice.",
          ],
        },
        {
          h: "7. Cross-Border Transfers",
          p: [
            "Where data is transferred outside Jordan, we take steps to ensure an adequate level of protection consistent with the PDPL.",
          ],
        },
        {
          h: "8. Children",
          p: [
            "Cue is intended for users aged 18 and over. We do not knowingly collect data from children without appropriate consent.",
          ],
        },
        {
          h: "9. Changes to This Policy",
          p: [
            "We may update this Privacy Policy from time to time. Material changes will be communicated through the Service.",
          ],
        },
      ],
    },
    cookies: {
      title: "Cookie Policy",
      intro:
        "This Cookie Policy explains how Cue uses cookies and similar technologies on our website. We use them sparingly and in line with our data-minimization approach.",
      sections: [
        {
          h: "1. What Cookies Are",
          p: [
            "Cookies are small text files stored on your device that help websites function and remember preferences. Similar technologies include local storage and pixels.",
          ],
        },
        {
          h: "2. How We Use Cookies",
          list: [
            "Essential: required for the site to function, such as remembering your language preference.",
            "Performance: help us understand how the site is used so we can improve it.",
            "We do not use cookies to sell your data or build advertising profiles across other services.",
          ],
        },
        {
          h: "3. Managing Cookies",
          p: [
            "You can control or delete cookies through your browser settings. Disabling essential cookies may affect how the site works.",
          ],
        },
        {
          h: "4. Changes",
          p: [
            "We may update this Cookie Policy as our practices evolve. Please review it periodically.",
          ],
        },
      ],
    },
    dpa: {
      title: "Data Processing Agreement",
      intro:
        "This Data Processing Agreement (“DPA”) describes how Cue Technologies processes personal data on behalf of partner venues (“Controllers”) in connection with the Cue platform. It supplements the Restaurant Partnership Agreement and reflects the requirements of the Jordan Personal Data Protection Law (PDPL).",
      sections: [
        {
          h: "1. Roles",
          list: [
            "The partner venue acts as the Controller for guest data it receives to fulfill reservations.",
            "Cue acts as a Processor for such data and as a Controller for its own platform data.",
          ],
        },
        {
          h: "2. Scope & Purpose",
          p: [
            "Cue processes personal data only to provide the booking and coordination services described in the Partnership Agreement, and in accordance with the Controller's documented instructions.",
          ],
        },
        {
          h: "3. Processor Obligations",
          list: [
            "Process personal data only for the agreed purposes.",
            "Ensure persons authorized to process data are bound by confidentiality.",
            "Apply appropriate technical and organizational security measures.",
            "Assist the Controller in responding to data-subject requests where reasonably possible.",
            "Not use guest data to sell, disclose, or distribute for unrelated purposes.",
          ],
        },
        {
          h: "4. Sub-Processors",
          p: [
            "Cue may engage trusted sub-processors (such as hosting and communications providers) under written obligations no less protective than this DPA.",
          ],
        },
        {
          h: "5. Data Subject Rights",
          p: [
            "Cue will provide reasonable assistance to enable Controllers to respond to requests to access, correct, or delete personal data.",
          ],
        },
        {
          h: "6. Breach Notification",
          p: [
            "Cue will notify the Controller without undue delay after becoming aware of a personal data breach affecting the Controller's data.",
          ],
        },
        {
          h: "7. Return & Deletion",
          p: [
            "On termination, Cue will delete or return personal data processed on behalf of the Controller, except where retention is required by law.",
          ],
        },
      ],
    },
    notice: {
      title: "Legal Notice",
      intro:
        "This Legal Notice sets out the identity of the entity operating Cue and general legal terms applicable to the website and services.",
      sections: [
        {
          h: "1. Company Identity",
          list: [
            "Operating entity: Cue Technologies, operating under the registered trade name “Cue.”",
            "Jurisdiction of registration: Hashemite Kingdom of Jordan.",
            "Nature of service: a digital reservation and hospitality coordination platform.",
          ],
        },
        {
          h: "2. Contact",
          p: [
            "For legal, privacy, or partnership matters, please reach us through the Get Started page. We aim to respond within 48 hours.",
          ],
        },
        {
          h: "3. Intellectual Property",
          p: [
            "The Cue name, logo, platform design, and content are the property of Cue Technologies and may not be used without written permission.",
          ],
        },
        {
          h: "4. Governing Law",
          p: [
            "These terms and all use of Cue are governed by the laws of the Hashemite Kingdom of Jordan, with jurisdiction in the competent courts of Amman.",
          ],
        },
        {
          h: "5. Disclaimer",
          p: [
            "The website and services are provided on an “as-is” and “as-available” basis. Cue is a booking coordination platform and is not a restaurant or food provider.",
          ],
        },
      ],
    },
  },

  // ---------------- FOOTER ----------------
  footer: {
    tagline: "Simple for guests, structured for operators.",
    blurb: "Built to simplify bookings. Designed for real-world hospitality.",
    ctaTitle: "Get in Cue.",
    ctaBody: "Join early access and be first to work with us.",
    ctaButton: "Get started",
    columns: [
      {
        title: "Company",
        links: [
          { href: "/about", label: "About" },
          { href: "/how-it-works", label: "How it works" },
          { href: "/partner", label: "Partner with Cue" },
          { href: "/careers", label: "Careers" },
        ],
      },
      {
        title: "Support",
        links: [
          { href: "/faq", label: "Help center" },
          { href: "/reach-out", label: "Get started" },
          { href: "/faq", label: "FAQ" },
        ],
      },
      {
        title: "Legal",
        links: [
          { href: "/legal/terms", label: "Terms of Service" },
          { href: "/legal/privacy", label: "Privacy Policy" },
          { href: "/legal/cookies", label: "Cookie Policy" },
          { href: "/legal/dpa", label: "DPA" },
          { href: "/legal/notice", label: "Legal Notice" },
        ],
      },
    ],
    social: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Facebook", href: "https://facebook.com" },
      { label: "X", href: "https://x.com" },
    ],
    rights: "© 2026 Cue. All rights reserved.",
    ownedBy: "A Qasem Capital & Enterprise company.",
  },
};

export type Dictionary = typeof en;
export default en;
