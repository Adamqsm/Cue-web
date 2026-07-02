import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localizedHref, cn } from "@/lib/utils";

export default function LocaleLink({
  href,
  locale,
  className,
  children,
  ...rest
}: {
  href: string;
  locale: Locale;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href">) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  if (external) {
    return (
      <a
        href={href}
        className={cn(className)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={localizedHref(href, locale)} className={cn(className)} {...rest}>
      {children}
    </Link>
  );
}
