import { siteUrl } from "@/lib/college";
import { getCollege, getNav } from "@/lib/data/college";
import { A11yProvider } from "@/components/a11y/A11yProvider";
import { A11yControls } from "@/components/a11y/A11yControls";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [college, nav] = await Promise.all([getCollege(), getNav()]);

  // Микроразметка организации (schema.org) — помогает поисковым системам и картам.
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: college.fullName,
    alternateName: college.abbr,
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    foundingDate: college.founded,
    email: college.contacts.email,
    telephone: college.contacts.phoneHref,
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Тотурбиева, д. 61",
      addressLocality: "Хасавюрт",
      addressRegion: "Республика Дагестан",
      postalCode: "368001",
      addressCountry: "RU",
    },
    parentOrganization: {
      "@type": "GovernmentOrganization",
      name: college.founder,
      url: college.founderUrl,
    },
    sameAs: [college.founderUrl],
  };

  return (
    <A11yProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <a href="#main" className="skip-link">
        Перейти к основному содержимому
      </a>
      <A11yControls />
      <Header college={college} nav={nav} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </A11yProvider>
  );
}
