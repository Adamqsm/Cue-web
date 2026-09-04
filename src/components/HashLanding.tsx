"use client";

import { useEffect } from "react";

/**
 * Land on the URL fragment once the page has hydrated.
 *
 * `html { scroll-behavior: smooth }` (globals.css) turns the browser's own
 * fragment scroll on a fresh page load into an animation, and hydration work
 * on the homepage cancels it partway: on production, /en#career-growth
 * stopped around 3400px with the section at 11667px. An instant
 * scrollIntoView after mount lands exactly, honouring each section's
 * scroll-margin so the fixed nav does not cover it. Client-side navigations
 * are not affected (the router scrolls to hashes with smooth scrolling
 * disabled), and this runs once per document load, so a visitor who has
 * already started scrolling is never yanked back.
 */
export default function HashLanding() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  return null;
}
