import type { Metadata } from "next";
import Link from "next/link";
import { CueMark } from "@/components/BrandMark";

// 404s must never be indexed or surface a canonical of their own.
export const metadata: Metadata = {
  title: "Page not found · Cue",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="container-pad flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <CueMark className="h-16 w-16 text-accent" />
      <h1 className="mt-8 text-6xl tabular-nums text-content">404</h1>
      <p className="mt-4 max-w-md text-muted">
        This page could not be found. It may have moved, or never existed.
      </p>
      <Link href="/en" className="btn btn-primary mt-8">
        Back to home
      </Link>
    </section>
  );
}
