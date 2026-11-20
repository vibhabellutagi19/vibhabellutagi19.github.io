import { Analytics } from "@vercel/analytics/next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { THEME_SCRIPT } from "@/lib/theme";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Headings, plus the italic accent word inside them.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const title = "Vibhavari Bellutagi · Data · Backend Engineer";
const description =
  "Data engineer with 10+ years in software, seven of them building data platforms on Spark, Kafka and Databricks at Deloitte, AgileLab and Mews, and now building backends on Postgres too.";

// The preview image is drawn at build time by opengraph-image.js / twitter-image.js in this folder.
export const metadata = {
  metadataBase: new URL("https://buildwithvibs.in"),
  title,
  description,
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Vibhavari Bellutagi · Blog" },
      ],
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Vibhavari Bellutagi",
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }) {
  return (
    // The theme script sets data-theme before React loads, so the server and client markup differ there on purpose.
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <div id="main">{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
