// English content — source of truth for the Dictionary shape.
// Voice: friendly, direct, human. Short sentences. No inflated claims,
// no corporate hedging, and no em-dashes anywhere in on-page copy.

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
    claimCta: "Claim 3 months free",
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
    preLaunch: "Pre-launch · Amman",
    skipToContent: "Skip to content",
    contactUs: "Talk to us",
    theme: { light: "Switch to light mode", dark: "Switch to dark mode" },
  },

  consent: {
    eyebrow: "Privacy & cookies",
    title: "Before you continue",
    body: "Cue uses essential cookies and similar technologies to run this site and remember your preferences. By continuing, you agree to the policies below.",
    accept: "Accept & continue",
    note: "You can read the full policies any time in the legal center.",
  },

  // ---------------- HOME ----------------
  home: {
    meta: {
      title: "Book Restaurant Tables in Amman | Cue",
      description:
        "Reserve a table at the best restaurants in Amman. Instant confirmations, group dining, split payments. Download Cue today.",
    },
    hero: {
      status: "Launching soon · Amman",
      titleTop: "Don't wait in the queue.",
      titleAccent: "Join the Cue.",
      subtitle:
        "Book tables at Amman's best restaurants, from Abdoun to Rainbow Street. Instant confirmations, easy group plans, and split payments so everyone covers their share.",
      primary: "Claim 3 months free",
      secondary: "For restaurants",
      proof: "People are already in the queue — see the live count",
      phoneFrontAlt:
        "A confirmed restaurant reservation in the Cue app, Amman",
      phoneBackAlt:
        "Requesting a table at an Amman restaurant in the Cue app",
      chips: {
        confirmed: "Table confirmed",
        ticketLabel: "Your queue spot",
        ticket: "№ 048",
        time: "Tonight · 8:30 PM",
      },
      board: {
        title: "Tonight · Service board",
        live: "Live",
        states: {
          incoming: "Incoming",
          confirmed: "Confirmed",
          seated: "Seated",
        },
        rows: [
          { name: "Layali · party of 4", time: "8:30 PM" },
          { name: "Nadia K. · party of 2", time: "9:00 PM" },
          { name: "Sami R. · party of 6", time: "9:15 PM" },
          { name: "Hold · party of 3", time: "9:45 PM" },
        ],
        footerLabel: "Covers tonight",
        footerValue: "142",
        confirmLabel: "Confirm",
      },
    },
    waitlist: {
      label: "The queue",
      title: "The queue is filling up.",
      body: "Every number here is a real person holding a Cue Insider code for launch day. Claim yours and you're in from night one.",
      cta: "Claim your spot",
      note: "Free to join. One code per person.",
      ticketLabel: "Now in the queue",
      countLabel: "and counting",
    },
    problem: {
      label: "The problem",
      title: "Bookings break in the gaps.",
      body: "Reservations live across DMs, phone calls, walk-ins, and a paper book. Nobody holds the full picture, so tables get double-booked and no-shows go unnoticed.",
      resolve: "Cue puts every request in one place and gives your team a single source of truth.",
    },
    hiw: {
      label: "How it works",
      title: "How restaurant reservations work",
      body: "Simple for the guest booking a table. Structured for the team running the floor.",
      tabs: {
        guests: "For guests",
        operators: "For operators",
      },
      guests: [
        { title: "Discover", body: "Browse venues across Amman by area, cuisine, and price." },
        { title: "Request", body: "Pick a date, time, and party size. Add a note. Send." },
        { title: "Get confirmed", body: "An instant, unambiguous status. No chasing a reply." },
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
      title: "Why choose Cue for restaurant reservations?",
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
          body: "Arabic and English as equals, for your guests and your team.",
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
      spotlight: {
        label: "Group payments",
        title: "Split payments with your group.",
        body: "Secure the table before the night. Everyone pays their share up front: send each guest a payment link over WhatsApp or Apple Pay, and watch the booking fill up. No chasing cash, and no one stuck covering the whole bill.",
        points: [
          "A link per guest, paid in seconds",
          "Prepayment secures the table and cuts no-shows",
          "Live status as each share lands",
        ],
        image: "/images/cue-app-guest-payment-split.jpeg",
        imageAlt: "Splitting a group restaurant booking payment in the Cue app, Amman",
      },
    },
    demo: {
      label: "The product",
      title: "See Cue in motion.",
      body: "A pass through the app your guests use and the dashboard your team runs on.",
      play: "Play",
      pause: "Pause",
      slides: [
        { img: "/images/cue-app-guest-booking-request.jpeg", caption: "Request a table at venues across Amman." },
        { img: "/images/cue-app-profile-screen.jpeg", caption: "Tonight's floor, at a glance." },
        { img: "/images/cue-app-search-filters.jpeg", caption: "Confirm or decline in one tap." },
        { img: "/images/cue-app-booking-flow.jpeg", caption: "Event nights and table demand, in one view." },
        { img: "/images/cue-app-venue-detail.jpeg", caption: "The numbers that tell you what's working." },
      ],
    },
    operators: {
      label: "For operators",
      title: "The control room for your floor.",
      body: "One screen for every reservation: confirmed covers, pending requests, event nights, and the numbers behind them. Cue runs quietly in the background so your team stays on service.",
      points: [
        "Confirm or decline requests in one tap",
        "See tonight's covers before you open the doors",
        "Cut no-shows with automatic confirmations",
        "Coordinate group bookings and event nights",
      ],
      cta: "Partner with Cue",
    },
    socialProof: {
      label: "Early words",
      title: "What people say about Cue.",
      body: "Real quotes from early guests and founding venues will live here as they come in.",
      placeholderTag: "Placeholder · real quotes before launch",
      quotes: [
        {
          text: "Placeholder quote. What an early guest says about booking a table with Cue goes here, in their own words.",
          initial: "G",
          name: "Guest name",
          role: "Early access member",
        },
        {
          text: "Placeholder quote. What a founding restaurant says about running service on Cue goes here.",
          initial: "R",
          name: "Owner name",
          role: "Founding partner venue",
        },
        {
          text: "Placeholder quote. What a group organizer says about splitting the bill on Cue goes here.",
          initial: "O",
          name: "Organizer name",
          role: "Cue Insider member",
        },
      ],
      pressLabel: "Launch coverage",
      pressSlots: ["Press logo", "Press logo", "Press logo", "Press logo"],
    },
    founder: {
      label: "From the founder",
      paragraphs: [
        "Cue was founded out of a simple, persistent observation: the experience of booking a table, whether as a diner or a restaurant, had never been given the attention it deserved. Having encountered these difficulties myself, from locating available tables to managing and confirming reservations, I came to believe that a more thoughtful solution was needed, one that went beyond the conventional approach. Our goal is to build a seamless and dependable experience, from discovery through reservation and payment, for both guests and the restaurants that welcome them.",
      ],
      signName: "Adam Qasem",
      signRole: "Founder, Cue",
    },
    traction: {
      label: "Traction",
      title: "Operational truth over vanity metrics.",
      body: "We're onboarding founding venues in Amman now. Real partner logos and results land here as they go live.",
      logosLabel: "Founding partners",
      logosPlaceholder: "Your venue here",
      targetsLabel: "Where we're headed: 18-month targets",
      targets: [
        { value: "60+", label: "Live venues" },
        { value: "12K+", label: "Monthly requests" },
        { value: "90%+", label: "Confirmation rate" },
        { value: "85%+", label: "Venue retention" },
      ],
    },
    neighborhoods: {
      label: "Across Amman",
      title: "Browse restaurants by neighborhood",
      body: "Cue is launching across Amman's busiest dining areas, from rooftop lounges to casual spots, with more neighborhoods added as new restaurants come online.",
      areas: [
        "Abdoun",
        "Sweifieh",
        "Rainbow Street",
        "Seventh Circle",
        "Jabal Amman",
        "Shmeisani",
        "Al Weibdeh",
        "Dabouq",
      ],
    },
    faqHome: {
      label: "FAQ",
      title: "Frequently asked questions",
      seeAll: "See all questions",
    },
    finalCta: {
      title: "Bring your floor onto Cue.",
      body: "We partner with a small number of founding venues in Amman. If clarity and control matter to how you run service, let's talk.",
      primary: "Partner with Cue",
      secondary: "Join early access",
    },

    earlyAccess: {
      label: "Get in early",
      title: "Two seats at the early table.",
      body: "Cue opens with an offer on each side of the booking: one for the people who dine, one for the rooms that host them.",
      guest: {
        eyebrow: "For guests",
        title: "3 months of Cue Insider, free",
        body: "Claim your code now, redeem it in the app the day we launch. One code per person, emailed to you and kept safe until then.",
        cta: "Claim your code",
      },
      operator: {
        eyebrow: "For restaurants",
        title: "12 months free as a founding partner",
        body: "The full platform at JD 0 for your first year, with hands-on onboarding, for venues that join before launch.",
        cta: "Partner with Cue",
      },
    },
  },

  // ---------------- HOW IT WORKS ----------------
  how: {
    meta: {
      title: "How Restaurant Reservations Work in Amman | Cue",
      description:
        "See how booking a restaurant table in Amman works on Cue — discover venues, request, confirm, split payments, and a full dashboard for restaurant operators.",
    },
    hero: {
      eyebrow: "How it works",
      title: "The platform, and the thinking behind it.",
      subtitle:
        "Cue is built end to end: a clean experience for guests, a structured system for operators. Here's how the whole loop fits together.",
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
          body: "A guest picks a date, time, party size, and adds any notes. The request lands in your queue as pending. Nothing is confirmed until you say so.",
        },
        {
          n: "03",
          title: "Confirm",
          body: "Your team reviews and confirms, declines, or completes. The guest gets an instant, unambiguous status update.",
        },
        {
          n: "04",
          title: "Coordinate",
          body: "Group activity, guest flow, and reminders are handled in the background, so service stays the focus.",
        },
      ],
    },
    guest: {
      kicker: "For guests",
      title: "A booking experience that feels effortless.",
      body: "Guests get a simple, transparent way to plan and manage outings, from first browse to a confirmed table.",
      features: [
        {
          img: "/images/cue-app-guest-booking-request.jpeg",
          title: "Request a table",
          body: "Pick a venue, date, time, and party size. A fast, clear booking flow with any special requests.",
        },
        {
          img: "/images/cue-app-guest-payment-split.jpeg",
          title: "Split the prepayment",
          body: "For group nights, everyone pays their share up front: a secure link each, over WhatsApp or Apple Pay.",
        },
        {
          img: "/images/cue-app-guest-reservation-confirmed.jpeg",
          title: "Confirmed, in one place",
          body: "An instant, unambiguous status, plus every reservation and its history on tap.",
        },
      ],
    },
    operator: {
      kicker: "For operators",
      title: "A dashboard built for the pass, not the boardroom.",
      body: "Cue gives your team visibility and control without adding load. Confirm bookings, manage busy nights, and understand performance, all in one structured system.",
      features: [
        {
          img: "/images/cue-app-profile-screen.jpeg",
          title: "Today at a glance",
          body: "Confirmed covers, pending requests, and the night ahead, the moment you open the app.",
        },
        {
          img: "/images/cue-app-search-filters.jpeg",
          title: "Booking management",
          body: "Review, confirm, decline, and complete requests. Every reservation, one clear queue.",
        },
        {
          img: "/images/cue-app-booking-flow.jpeg",
          title: "Event nights",
          body: "Coordinate high-demand nights: table sessions, capacity, and group activity in one place.",
        },
        {
          img: "/images/cue-app-venue-detail.jpeg",
          title: "Performance",
          body: "Booking volume, confirmation rates, and trends. The numbers that tell you what's working.",
        },
      ],
    },
    philosophy: {
      kicker: "The thinking",
      title: "We build on what actually works on the ground.",
      body: "Cue isn't here to replace your team or force a new process. It's structured infrastructure that fits how hospitality already operates: fast to adopt, reliable under pressure, and bilingual from day one.",
      points: [
        {
          title: "Operational truth",
          body: "Every feature is grounded in how venues really run a service, not how software wishes they would.",
        },
        {
          title: "Fast before complex",
          body: "We ship the core booking loop first and keep it clean. Depth comes without clutter.",
        },
        {
          title: "Bilingual by design",
          body: "Arabic and English as equals, for guests and for your team, everywhere in the product.",
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
      title: "For Restaurants: Partner with Cue in Amman | Cue",
      description:
        "List your Amman restaurant on Cue. Take reservations, reduce no-shows, coordinate group dining and event nights, and run it all from one dashboard.",
    },
    hero: {
      eyebrow: "Partner with Cue",
      title: "A booking platform built to support modern operations.",
      subtitle:
        "Cue partners with restaurants, venues, and hospitality businesses to simplify reservations, reduce manual coordination, and improve operational control, without disrupting how your team works.",
      primary: "Apply to Join",
      secondary: "See how it works",
    },
    founding: {
      badge: "Founding partner offer",
      title: "Founding partners: first 12 months at JD 0",
      body: "Full platform free for the first year, plus a founding-partner badge inside the app, early priority placement, and hands-on onboarding and staff training.",
      perks: [
        "Full platform free for 12 months",
        "Founding-partner badge in the app",
        "Early priority placement",
        "Hands-on onboarding & staff training",
      ],
      cta: "Apply to Join",
      waitlistNote:
        "The Cue Insider early-access list is now open to guests. Every claimed code is a diner committed to launch day.",
    },
    pricing: {
      kicker: "Plans & pricing",
      title: "Simple plans. Zero risk to start.",
      body: "Every plan starts with the same structured booking core. Pay only when Cue is clearly earning it.",
      perMonth: "per month",
      tiers: [
        {
          id: "free",
          name: "Cue Free",
          tag: "Founding partner",
          price: "JD 0",
          priceNote: "free permanently",
          features: [
            "Unified reservation dashboard",
            "One-tap confirm & decline",
            "Automated confirmation reminders",
            "Up to ~100 covers/month",
          ],
        },
        {
          id: "core",
          name: "Cue Core",
          tag: "Recommended",
          price: "JD 39",
          priceNote: "≈ USD 55 · per month",
          features: [
            "Everything in Free",
            "Unlimited covers",
            "Group & event-night coordination",
            "Full performance analytics",
            "WhatsApp reminders",
          ],
        },
        {
          id: "pro",
          name: "Cue Pro",
          tag: "Full platform",
          price: "JD 89",
          priceNote: "≈ USD 125 · per month",
          features: [
            "Everything in Core",
            "POS / Foodics integration",
            "Insider-member targeting",
            "Premium placement eligibility",
            "Priority support",
          ],
        },
      ],
      cta: "Apply to Join",
    },
    commission: {
      kicker: "Commission structure",
      title: "Your own guests are never taxed.",
      body: "Commission applies only where Cue clearly created the value, never on the business you already own.",
      items: [
        {
          lead: "JD 0, always",
          body: "on your own bookings, walk-ins, and repeat guests. On every plan.",
        },
        {
          lead: "JD 0.25–0.50",
          body: "per net-new, Cue-discovered seated diner, only when Cue originated the booking. Core & Pro only, with an optional monthly cap.",
        },
        {
          lead: "2.5–4%",
          body: "of the prepaid amount on group prepayments, bill-splitting, and event-night tickets, only when that feature is used.",
        },
      ],
      addons: {
        title: "Optional visibility add-ons",
        note: "Explicitly optional. Never a tax on bookings.",
        items: [
          { name: "Featured placement", price: "JD 120–350 / month" },
          { name: "Promoted event night", price: "JD 40–90 / event" },
        ],
      },
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
          body: "Cue aligns with how hospitality teams already operate. No forced process changes.",
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
      title: "Partnerships based on alignment, not volume.",
      body: "Cue partners selectively with businesses that value operational discipline and long-term reliability. We build systems that support hospitality teams, not replace them. Partnerships are based on alignment, clarity, and shared standards.",
    },
    cta: {
      title: "First 12 months at JD 0.",
      body: "Join as a founding partner: the full platform free for the first year, with hands-on onboarding for your team.",
      primary: "Apply to Join",
      secondary: "See how it works",
    },
  },

  // ---------------- PARTNER / APPLY ----------------
  partnerApply: {
    meta: {
      title: "Apply to Join Cue — Restaurant Partner Application | Cue",
      description:
        "Apply to list your restaurant on Cue. Tell us about your venue and our team will reach out to walk you through onboarding as a founding partner in Amman.",
    },
    hero: {
      eyebrow: "Apply to join",
      title: "Tell us about your venue.",
      subtitle:
        "A few structured details so we can set your venue up properly. It takes about five minutes, and our team reviews every application personally.",
    },
    form: {
      heading: "Partner application",
      subheading: "Required fields are marked with an asterisk (*).",
      sections: {
        venue: "Your venue",
        contact: "Contact",
        details: "Location & cuisine",
        hours: "Working hours",
        menu: "Menu & photos",
        plan: "Plans & extras",
      },
      fields: {
        venueName: "Restaurant / venue name",
        contactName: "Contact person",
        role: "Role",
        phone: "Phone / WhatsApp",
        email: "Email",
        neighborhood: "Neighborhood",
        neighborhoodOther: "Which area?",
        street: "Street address",
        cuisines: "Cuisine / category",
        avgPrice: "Average price per person",
        menuFile: "Menu (PDF, max 10MB)",
        menuLink: "Or link to your menu",
        instagram: "Instagram handle",
        whatsappBusiness: "WhatsApp Business link",
        photos: "Photos of your venue",
        prepayment: "Interested in group prepayment / event-night ticketing?",
        plan: "Which plan are you interested in?",
        notes: "Anything else we should know?",
      },
      placeholders: {
        venueName: "Your venue's name",
        contactName: "Your name",
        role: "e.g. Owner, Manager",
        phone: "+962 7X XXX XXXX",
        email: "you@example.com",
        street: "Street, building, landmark (optional)",
        neighborhoodOther: "Neighborhood or area name",
        menuLink: "https://…",
        instagram: "@yourhandle",
        whatsappBusiness: "https://wa.me/… (if different from the number above)",
        notes: "Tell us anything that helps us set you up right",
      },
      hints: {
        role: "Optional",
        optional: "Optional",
        cuisines: "Pick everything that applies.",
        menu: "Upload a PDF menu, share a link, or both. At least one is required.",
        photos: "Up to 6 images (JPG/PNG/WebP, max 8MB each). Optional.",
        whatsappBusiness: "Only if different from the contact number.",
        hours: "Set your opening and closing time for each day, or mark it closed.",
      },
      hours: {
        open: "Opens",
        close: "Closes",
        closed: "Closed",
        days: {
          sun: "Sunday",
          mon: "Monday",
          tue: "Tuesday",
          wed: "Wednesday",
          thu: "Thursday",
          fri: "Friday",
          sat: "Saturday",
        },
      },
      options: {
        neighborhoodPlaceholder: "Select a neighborhood",
        other: "Other",
        avgPricePlaceholder: "Select a range (optional)",
        avgPrice: [
          { value: "1", label: "Under JD 10" },
          { value: "2", label: "JD 10–20" },
          { value: "3", label: "JD 20–35" },
          { value: "4", label: "JD 35+" },
        ],
        yes: "Yes",
        no: "No",
        plans: [
          { value: "free", label: "Free" },
          { value: "core", label: "Core" },
          { value: "pro", label: "Pro" },
          { value: "not_sure", label: "Not sure yet" },
        ],
        planPlaceholder: "Select a plan (optional)",
      },
      cuisines: [
        { id: "italian", label: "Italian" },
        { id: "mediterranean", label: "Mediterranean" },
        { id: "jordanian", label: "Jordanian" },
        { id: "levantine", label: "Levantine" },
        { id: "lebanese", label: "Lebanese" },
        { id: "grill", label: "Grill" },
        { id: "cafe", label: "Cafe" },
        { id: "international", label: "International" },
      ],
      consent: {
        pre: "I agree to be contacted by Cue about this application, per the",
        privacy: "Privacy Policy",
        and: "and",
        terms: "Terms of Service",
        post: ".",
      },
      submit: "Submit application",
      submitting: "Submitting…",
      errors: {
        required: "Please fill in all required fields.",
        email: "Please enter a valid email address.",
        menu: "Please upload a menu PDF or add a menu link. At least one is required.",
        menuType: "The menu must be a PDF file.",
        menuSize: "The menu PDF must be under 10MB.",
        photoType: "Photos must be images (JPG, PNG, or WebP).",
        photoSize: "Each photo must be under 8MB.",
        photoCount: "You can upload up to 6 photos.",
        consent: "Please agree to be contacted so we can follow up on your application.",
        // Verbatim from claim.form.errors.rateLimited — same situation, same
        // wording, already translated.
        rateLimited: "Too many attempts from this connection. Please wait a few minutes and try again.",
        submit: "Something went wrong while submitting. Please try again, or reach out to us directly.",
      },
      success: {
        title: "We've received your application.",
        body: "Someone from Cue will reach out within 3 business days to walk you through the next steps.",
        home: "Back to home",
      },
    },
  },

  // ---------------- CLAIM (Cue Insider early access) ----------------
  claim: {
    meta: {
      title: "Claim 3 Months of Cue Insider Free | Cue",
      description:
        "Join Cue's early-access list and claim 3 months of Cue Insider membership free. One code per person, emailed to you now, redeemed in the app at launch.",
    },
    hero: {
      eyebrow: "Cue Insider · early access",
      //   keeps the "Cue Insider" wordmark on one line under text-balance.
      title: "Three months of Cue Insider. On the house.",
      subtitle:
        "Cue Insider is Cue's membership for people who dine out. Claim your place before launch and your first three months are free. Your code arrives by email and waits for opening night.",
    },
    offer: {
      kicker: "What you're claiming",
      title: "One code. Three months. Yours from day one.",
      points: [
        {
          title: "Skip the wait",
          body: "Get your table confirmed faster, no back-and-forth.",
        },
        {
          title: "Front of the line",
          body: "Priority booking at peak times, when everyone else is stuck waiting.",
        },
        {
          title: "Save on every booking",
          body: "Reduced fees on reservations, every time.",
        },
        {
          title: "Deals from your favorite spots",
          body: "Exclusive discounts at partner restaurants across Amman.",
        },
        {
          title: "Earn as you dine",
          body: "Collect points with every booking, redeem them for more.",
        },
        {
          title: "Move up the list",
          body: "When a spot opens up, Insiders get first dibs before anyone else on the waitlist.",
        },
      ],
      timing:
        "Your three months start when you redeem the code in the Cue app at launch, not today. Claiming now just holds your place.",
    },
    steps: {
      kicker: "How it works",
      title: "Claim now, dine later.",
      items: [
        {
          title: "Claim your code",
          body: "Leave your name, email, and phone. That's the whole form.",
        },
        {
          title: "Keep the email",
          body: "Your personal code arrives in your inbox. One code, issued once, tied to you.",
        },
        {
          title: "Redeem at launch",
          body: "When the Cue app goes live, enter the code and your three free months begin.",
        },
      ],
    },
    form: {
      title: "Claim your code",
      name: "Full name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      phone: "Phone number",
      phonePlaceholder: "07 9012 3456",
      phoneHint: "All countries work — we default to Jordan (+962).",
      countrySelect: {
        label: "Country code",
        searchPlaceholder: "Type a country name…",
        noResults: "No matching countries.",
      },
      consent:
        "Keep me posted about Cue's launch and Cue Insider news. No spam, unsubscribe any time.",
      submit: "Claim 3 months free",
      submitting: "Claiming…",
      protection: "Protected against automated signups.",
      protectionFailed: "The signup check couldn't load. Refresh the page to try again.",
      errors: {
        name: "Please enter your name.",
        email: "Please enter a valid email address.",
        phone: "Please enter a valid phone number.",
        phoneCountry: "We couldn't recognize that country code. Check the number and try again.",
        turnstile: "We couldn't verify you're human. Please retry the check and submit again.",
        rateLimited: "Too many attempts from this connection. Please wait a few minutes and try again.",
        server: "Something went wrong on our side and your claim was not saved. Please try again.",
        network: "We couldn't reach the server. Check your connection and try again.",
      },
    },
    success: {
      eyebrow: "Claim confirmed",
      title: "Your code is in. Guard it well.",
      body: "This is your Cue Insider code. We've also emailed it to you for safekeeping.",
      ticket: {
        label: "Cue Insider · early seat",
        codeLabel: "Redemption code",
        nameLabel: "Held for",
        issuedLabel: "Issued",
        statusLabel: "Status",
        statusIssued: "Issued, waiting for launch",
      },
      copy: "Copy code",
      copied: "Copied",
      emailedTo: "Sent to {email}",
      next: "We'll email you the day Cue goes live. Until then, there's nothing else to do. Your seat is held.",
      home: "Back to home",
    },
    duplicate: {
      title: "You already have a code.",
      body: "This email already claimed its Cue Insider code, so we didn't issue a new one. We've re-sent your original code to your inbox instead.",
      bodyPhone:
        "This mobile number already claimed a Cue Insider code. Your code lives with the email you signed up with. Submit the form with that email and we'll re-send it there.",
      rateLimited:
        "You already have a code, and we re-sent it recently. Check your inbox (and spam folder). You can request it again in a few minutes.",
      resendLimit:
        "You already have a code and we've re-sent it the maximum number of times for now. Reach us through the help center and we'll sort it out.",
    },
    terms: {
      title: "The small print",
      items: [
        "One code per person. A claim matching your email or your mobile number returns your original code.",
        "Codes are personal and non-transferable.",
        "Redeeming requires the Cue app, at launch.",
        "Your three free months start at redemption, not at signup.",
      ],
    },
    modal: {
      title: "Claim 3 months of Cue Insider",
      close: "Close",
    },
  },

  // ---------------- ABOUT ----------------
  about: {
    meta: {
      title: "About Cue — Restaurant Reservations in Amman",
      description:
        "Cue is a restaurant reservation platform built in Amman — balancing a simple booking experience for guests with real operational control for restaurants.",
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
      body: "Cue addresses common challenges in hospitality: fragmented booking processes, group coordination, and operational inefficiencies. By bringing these elements onto a single platform, Cue supports reservations, group activity, and guest flow in a clear, controlled way.",
      columns: [
        {
          title: "For guests",
          body: "A simple and transparent way to plan and manage outings, from browsing to a confirmed table.",
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
        { title: "Bilingual by design", body: "Arabic and English as equals, everywhere." },
        { title: "Licensed rails", body: "Compliant and considered from day one." },
        { title: "Data minimization", body: "Collect only what's needed. Nothing more." },
      ],
    },
    vision: {
      kicker: "The vision",
      title: "A higher standard for hospitality bookings.",
      body: "Cue's goal is to deliver dependable booking infrastructure that balances guest experience with operational control, starting in Amman and built to grow across the region.",
      cta: "Discover Cue",
    },
  },

  // ---------------- REACH OUT ----------------
  reach: {
    meta: {
      title: "Join Cue — Book Restaurants in Amman Early Access",
      description:
        "Join Cue early access to book tables at the best restaurants in Amman — or list your restaurant. Be among the first guests and venues at launch.",
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
        body: "Thanks. We've got your details, and we'll be in touch with early access updates and next steps.",
        again: "Submit another response",
      },
      error: "Something went wrong. Please try again, or email us directly.",
      secondaryCta: "Prefer to talk? Book a call",
    },
  },

  // ---------------- CAREERS ----------------
  careers: {
    meta: {
      title: "Careers at Cue — Building Amman's Reservation Platform",
      description:
        "Join the team building Cue, the restaurant reservation platform for Amman. Roles across engineering, operations, partnerships, marketing, and design.",
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
      body: "We operate as a global team and welcome applications from professionals across all regions. Whether your expertise is technology, operations, partnerships, marketing, design, or customer success: if you believe in building simple, powerful solutions for real-world businesses, we want to hear from you.",
      items: [
        { title: "Real ownership", body: "Early enough that your work defines the product, not just maintains it." },
        { title: "Craft matters", body: "We care about the details, in code, in design, and in how we treat partners." },
        { title: "Global & bilingual", body: "A team that works across regions and builds for Arabic and English as equals." },
      ],
    },
    roles: {
      kicker: "Where we're hiring",
      title: "Current focus areas.",
      note: "Don't see your exact role? Send an open application. We're always meeting exceptional people.",
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
      title: "Restaurant Booking FAQs | Cue Amman",
      description:
        "How to book a table on Cue, whether it's free for guests, how split payments and group reservations work, which Amman restaurants are available, and how to cancel a reservation.",
    },
    hero: {
      eyebrow: "Help center",
      title: "Restaurant booking questions, answered.",
      subtitle: "How to book a table in Amman, what it costs, split payments, group dining, and cancellations. Straight answers, no runaround.",
    },
    items: [
      {
        q: "How do I book a table on Cue?",
        a: "Pick a restaurant, pick a date and time, tell us how many of you are coming, and send the request. The restaurant confirms it in the app and the table is yours. No phone calls, no DMs, no wondering whether anyone actually wrote it down.",
      },
      {
        q: "Is Cue free for guests?",
        a: "Yes, completely. Browsing and booking cost nothing. The only time money comes into it is when a venue asks for a small deposit on a high-demand table or an event night, and that deposit counts toward your bill when you show up.",
      },
      {
        q: "How do split payments work?",
        a: "You book the table, then everyone pays their own share up front. Each person in your group gets a secure payment link over WhatsApp or Apple Pay, and you can literally watch the booking fill up as the shares land. Nobody fronts the whole bill and spends the next week collecting.",
      },
      {
        q: "What restaurants are available in Amman?",
        a: "We're launching with venues across the areas people actually go out in: Abdoun, Sweifieh, Rainbow Street, Seventh Circle, and more. Fine dining, casual spots, lounges. We're adding venues every week as onboarding continues, so if your favorite spot is missing, tell them to talk to us.",
      },
      {
        q: "Can I book for large groups?",
        a: "Yes, that's half the reason we built Cue. Set your party size when you book, split the deposit across the group so nobody carries it alone, and the restaurant sees exactly what's coming. Big tables and event nights work the same way.",
      },
      {
        q: "How do I cancel a reservation?",
        a: "Open the booking in the app and cancel it. That's it. Cancel early when your plans change; the restaurant would rather re-sell the table than eat the no-show. Each venue sets its own deposit and no-show terms and you see them before you confirm. If someone keeps no-showing, their account gets limited.",
      },
      {
        q: "What is Cue?",
        a: "A restaurant reservation platform, built in Amman for Amman. Guests get a simple way to find and book tables. Restaurants get one system for requests, group bookings, and busy nights, instead of a phone, an Instagram inbox, and a paper book that never agree with each other.",
      },
      {
        q: "How does my restaurant sign up?",
        a: "Head to Partner with Cue and tell us about your venue. It takes about five minutes. We read every application ourselves and reach out to see if it's a fit. Founding partners in Amman get their first year free, so there's genuinely no catch to trying it.",
      },
      {
        q: "Is Cue available in Arabic?",
        a: "Yes, fully. The app, the dashboard, this site, every form and every notification exist in Arabic and English as equals. We didn't translate an English product into Arabic as an afterthought; we built both from the start.",
      },
      {
        q: "How is my data handled?",
        a: "We collect only what a booking needs, share only what the restaurant needs to seat you, and never sell personal data. Full stop. We operate under Jordan's Personal Data Protection Law, and the Privacy Policy spells out the details in plain language.",
      },
      {
        q: "What is the Cue Insider 3-months-free offer?",
        a: "Cue Insider is our membership for people who dine out. Join the early-access list before launch and your first three months are free. You claim a personal code now, we email it to you, and it activates the day you redeem it in the app.",
      },
      {
        q: "Who can claim the free 3 months, and how many codes can I get?",
        a: "One code per person. We match claims on both email and mobile number, so submitting twice just gets you your original code again. Codes are tied to you and can't be passed around.",
      },
      {
        q: "When do my free months start?",
        a: "When you redeem the code in the app, not when you claim it. Your code sits safely until launch day, so claiming early never costs you a single day of the offer.",
      },
      {
        q: "How do I use my Cue Insider code?",
        a: "When the app launches, sign in and type the code exactly as it appears in your email. It looks like CUE-XXXX-XXXX. The app checks it on the spot and your three months start right there.",
      },
      {
        q: "I lost my code. What do I do?",
        a: "Fill in the claim form again with the same email or phone number. We don't issue duplicates; we re-send your original code to the email you claimed with. If you've lost access to that inbox too, message us through the form below and we'll sort it out.",
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
      success: "Thanks! Your message is on its way. We'll reply within 48 hours.",
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
        "Cue operates under the laws of the Hashemite Kingdom of Jordan, with jurisdiction in the courts of Amman. We follow a data-minimization approach and never sell personal data.",
      docsLabel: "Documents",
      docs: [
        { href: "/legal/terms", title: "Terms of Service", body: "The terms that govern use of the Cue app, website, and services." },
        { href: "/legal/privacy", title: "Privacy Policy", body: "How we collect, use, and protect personal data under Jordan's PDPL." },
        { href: "/legal/cookies", title: "Cookie Policy", body: "How Cue uses cookies and similar technologies." },
        { href: "/legal/dpa", title: "Data Processing Agreement", body: "How Cue processes personal data on behalf of partners." },
        { href: "/legal/notice", title: "Legal Notice", body: "Service identity and general legal terms." },
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
        "These Terms and Conditions (“Terms”) govern access to and use of the Cue mobile application, website, and related services (“Cue” or the “Service”). By creating an account, accessing the platform, or submitting a reservation, the user (“User”) agrees to be legally bound by these Terms. The Service is operated under the trading name “Cue.” If the User does not agree to these Terms, the User must not access or use Cue.",
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
        "This Privacy Policy explains how Cue (“we,” “us”) collects, uses, and protects personal data when you use the Cue app, website, and services. Cue is committed to the Jordan Personal Data Protection Law (PDPL) and follows a strict data-minimization approach: we collect only what we need to operate the Service, and we never sell personal data.",
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
        "This Data Processing Agreement (“DPA”) describes how Cue processes personal data on behalf of partner venues (“Controllers”) in connection with the Cue platform. It supplements the Restaurant Partnership Agreement and reflects the requirements of the Jordan Personal Data Protection Law (PDPL).",
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
        "This Legal Notice sets out the identity of the Cue service and general legal terms applicable to the website and services.",
      sections: [
        {
          h: "1. Service Identity",
          list: [
            "The platform and its services are provided under the trading name “Cue.”",
            "Base of operations: Amman, the Hashemite Kingdom of Jordan.",
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
            "All rights in the Cue name, logo, platform design, and content are reserved; they may not be used without written permission.",
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
          {
            href: "/claim?utm_source=cue-site&utm_medium=internal&utm_content=footer",
            label: "Cue Insider early access",
          },
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
      {
        icon: "linkedin",
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/cuebooking",
      },
    ],
    rights: "© 2026 Cue. All rights reserved.",
    ownedBy: "A Qasem Portal company.",
  },
};

export type Dictionary = typeof en;
export default en;
