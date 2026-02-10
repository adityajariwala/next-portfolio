import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { OWNER_INFO } from "@/lib/constants";
import { PersonStructuredData, WebsiteStructuredData } from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(`https://${OWNER_INFO.domain}`),
  title: {
    default: `${OWNER_INFO.name} - ${OWNER_INFO.title}`,
    template: `%s | ${OWNER_INFO.name}`,
  },
  description: OWNER_INFO.bio,
  keywords: [
    "Aditya Jariwala",
    "Senior Software Engineer",
    "AI/ML Engineer",
    "Machine Learning",
    "Kubernetes",
    "Cloud Architecture",
    "Financial Technology",
    "Capital One",
    "Full Stack Developer",
    "Software Engineering Blog",
    "Tech Blog",
    "Python",
    "TypeScript",
    "Go",
  ],
  authors: [{ name: OWNER_INFO.name, url: `https://${OWNER_INFO.domain}` }],
  creator: OWNER_INFO.name,
  publisher: OWNER_INFO.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `https://${OWNER_INFO.domain}`,
    siteName: `${OWNER_INFO.name}`,
    title: `${OWNER_INFO.name} - ${OWNER_INFO.title}`,
    description: OWNER_INFO.bio,
    images: [
      {
        url: "/og-image.png", // You'll need to add this image
        width: 1200,
        height: 630,
        alt: `${OWNER_INFO.name} - ${OWNER_INFO.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${OWNER_INFO.name} - ${OWNER_INFO.title}`,
    description: OWNER_INFO.bio,
    creator: "@AdityaJ15",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your verification code
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <PersonStructuredData />
        <WebsiteStructuredData />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
