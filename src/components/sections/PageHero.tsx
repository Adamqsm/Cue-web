import Masthead from "@/components/layout/Masthead";

/**
 * Compat wrapper — inner pages built before v4 call PageHero; it now
 * renders the v4 masthead grammar. `align` is accepted for API
 * compatibility and ignored: mastheads set from the reading edge.
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  align?: "start" | "center";
}) {
  return (
    <Masthead kicker={eyebrow} title={title} dek={subtitle}>
      {children}
    </Masthead>
  );
}
