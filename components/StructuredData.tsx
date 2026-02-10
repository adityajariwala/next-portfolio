import { OWNER_INFO } from "@/lib/constants";

export function PersonStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: OWNER_INFO.name,
    jobTitle: OWNER_INFO.title,
    worksFor: {
      "@type": "Organization",
      name: OWNER_INFO.company,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chicago",
      addressRegion: "IL",
      addressCountry: "US",
    },
    email: OWNER_INFO.email,
    url: `https://${OWNER_INFO.domain}`,
    sameAs: [
      OWNER_INFO.github,
      OWNER_INFO.linkedin,
      OWNER_INFO.twitter,
    ],
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "University of Texas at Austin",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Purdue University",
      },
    ],
    knowsAbout: [
      "Software Engineering",
      "Machine Learning",
      "Artificial Intelligence",
      "Kubernetes",
      "Cloud Computing",
      "Financial Technology",
      "Python",
      "TypeScript",
      "Go",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${OWNER_INFO.name} Portfolio`,
    url: `https://${OWNER_INFO.domain}`,
    author: {
      "@type": "Person",
      name: OWNER_INFO.name,
    },
    description: OWNER_INFO.bio,
    inLanguage: "en-US",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface BlogPostStructuredDataProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: string;
  url: string;
  image?: string;
}

export function BlogPostStructuredData({
  title,
  description,
  datePublished,
  dateModified,
  author,
  url,
  image,
}: BlogPostStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: image || `https://${OWNER_INFO.domain}/og-image.png`,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: author,
      url: `https://${OWNER_INFO.domain}`,
    },
    publisher: {
      "@type": "Person",
      name: OWNER_INFO.name,
      url: `https://${OWNER_INFO.domain}`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
