"use client";

import { MotionConfig } from "framer-motion";

// Gates every framer-motion animation behind the user's OS reduced-motion
// preference (the CSS media-query clamp can't reach JS-driven transforms).
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
