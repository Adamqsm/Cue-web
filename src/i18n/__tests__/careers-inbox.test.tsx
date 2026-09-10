import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import en from "../content/en";
import ar from "../content/ar";
import CareersPage from "@/app/[locale]/careers/page";
import LeadForm from "@/components/sections/LeadForm";
import { CAREERS_EMAIL, careersMailto } from "@/lib/careers";

/**
 * Cue does not hire; Qasem Portal does. These pin the routing rule so no
 * careers path on cue-app.net drifts back to a Cue address or a Cue form:
 * every application link on /careers is a mailto: to the Qasem Portal
 * careers inbox, and the reach-out form no longer takes job seekers.
 */

const locales = [
  ["en", en],
  ["ar", ar],
] as const;

function hrefs(html: string): string[] {
  return Array.from(html.matchAll(/href="([^"]*)"/g), (m) => m[1].replace(/&amp;/g, "&"));
}

describe("careersMailto", () => {
  it("targets the Qasem Portal careers inbox with a [Careers] subject", () => {
    expect(CAREERS_EMAIL).toBe("careers@qasem-portal.com");
    expect(careersMailto("Open application")).toBe(
      "mailto:careers@qasem-portal.com?subject=%5BCareers%5D%20Open%20application"
    );
  });

  it("percent-encodes an Arabic topic and keeps the Latin tag", () => {
    const href = careersMailto("طلب توظيف مفتوح");
    expect(href.startsWith("mailto:careers@qasem-portal.com?subject=%5BCareers%5D%20")).toBe(true);
    expect(decodeURIComponent(href.split("subject=")[1])).toBe("[Careers] طلب توظيف مفتوح");
  });
});

describe.each(locales)("/%s/careers", (locale, dict) => {
  const html = renderToStaticMarkup(<CareersPage params={{ locale }} />);
  const links = hrefs(html);
  const mailtos = links.filter((h) => h.startsWith("mailto:"));

  it("sends every application link to the Qasem Portal careers inbox", () => {
    // hero button + hero note address + one per role + closing CTA
    expect(mailtos).toHaveLength(dict.careers.roles.items.length + 3);
    for (const href of mailtos) {
      expect(href.startsWith(`mailto:${CAREERS_EMAIL}?subject=`), href).toBe(true);
    }
    for (const role of dict.careers.roles.items) {
      expect(mailtos).toContain(careersMailto(role.title));
    }
    expect(mailtos).toContain(careersMailto(dict.careers.applySubject));
  });

  it("never points at the Cue reach-out form or a Cue address", () => {
    expect(links.some((h) => h.includes("/reach-out"))).toBe(false);
    expect(html).not.toMatch(/@cue-app\.net/);
  });

  it("opens mail in place, not in a blank new tab", () => {
    for (const tag of html.match(/<a [^>]*href="mailto:[^>]*>/g) ?? []) {
      expect(tag).not.toContain('target="_blank"');
    }
  });

  it("shows the address itself, isolated LTR, in the hero note", () => {
    // LTR-isolated (Arabic period placement) and unbreakable (phones would
    // otherwise split it at the hyphen).
    expect(html).toContain(`dir="ltr" class="whitespace-nowrap font-semibold text-content underline`);
    expect(html).toContain(`>${CAREERS_EMAIL}</a>`);
    expect(html).toContain("Qasem Portal");
  });
});

describe.each(locales)("%s reach-out form", (locale, dict) => {
  const html = renderToStaticMarkup(
    <LeadForm
      form={dict.reach.form}
      locale={locale}
      careersSubject={dict.careers.applySubject}
    />
  );

  it("no longer offers a job-seeker audience", () => {
    expect(dict.reach.form.audiences.map((a) => a.value)).toEqual(["operator", "guest"]);
    expect(html).not.toMatch(/talent/i);
  });

  it("points job seekers at the careers inbox instead", () => {
    expect(hrefs(html)).toContain(careersMailto(dict.careers.applySubject));
    expect(html).toContain(`>${CAREERS_EMAIL}</a>`);
  });
});

describe.each(locales)("%s careers copy", (_locale, dict) => {
  const changed = [
    dict.careers.meta.title,
    dict.careers.hero.primary,
    dict.careers.hero.note,
    dict.careers.applySubject,
    dict.careers.cta.primary,
    dict.reach.form.careersNote,
  ];

  it("has no em or en dashes in the strings this routing touches", () => {
    for (const s of changed) expect(s, s).not.toMatch(/[—–]/);
  });

  it("has exactly one {email} slot in each inbox sentence", () => {
    for (const s of [dict.careers.hero.note, dict.reach.form.careersNote]) {
      expect(s.split("{email}"), s).toHaveLength(2);
      expect(s, s).toContain("Qasem Portal");
    }
  });
});
