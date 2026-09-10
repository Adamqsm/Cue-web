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
  // mailto: hands off to the mail client, so no new tab: target="_blank"
  // leaves an empty tab behind in browsers without a web mail handler.
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={cn(className)}>
        {children}
      </a>
    );
  }
  if (href.startsWith("http")) {
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
