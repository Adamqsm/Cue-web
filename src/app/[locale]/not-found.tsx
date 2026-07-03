import Link from "next/link";
import { CueMark } from "@/components/BrandMark";

export default function NotFound() {
  return (
    <section className="container-pad flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <CueMark className="h-16 w-16 text-green dark:text-green-300 animate-spin-slow" />
      <h1 className="mt-8 font-display text-6xl font-semibold text-content">404</h1>
      <p className="mt-4 max-w-md text-content/65">
        This page could not be found. It may have moved, or never existed.
      </p>
      <Link href="/en" className="btn btn-primary mt-8">
        Back to home
      </Link>
    </section>
  );
}
