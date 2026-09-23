import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BootOverlay } from "@/components/ui/BootOverlay";
import { PageVeil } from "@/components/ui/PageVeil";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.mission,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.mission,
    type: "website",
    locale: "en_GH",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${karla.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("eplm-theme");var d=t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: site.longName,
              alternateName: site.name,
              url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
              email: site.email,
              telephone: site.phones[0],
              address: {
                "@type": "PostalAddress",
                streetAddress: "4 Bournvita Road, Cantonments",
                addressLocality: "Accra",
                addressCountry: "GH",
              },
            }),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <BootOverlay />
        <PageVeil />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}