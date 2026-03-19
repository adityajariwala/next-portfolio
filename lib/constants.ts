export const OWNER_INFO = {
  name: "Aditya Jariwala",
  title: "Senior Forward Deployed Engineer",
  company: "Healthcare AI Space",
  location: "Chicago, IL",
  domain: "adityajariwala.com",
  github: "https://github.com/adityajariwala",
  linkedin: "https://www.linkedin.com/in/aditya-jariwala",
  email: "contact@adityajariwala.com",
  twitter: "https://twitter.com/AdityaJ15",
  tagline: "Building agentic AI systems for complex, mission-driven problems",
  bio: [
    "Engineer building at the intersection of agentic AI, cloud infrastructure, and complex healthcare data. I design intelligent systems that surface critical signals from noisy, high-volume data — driven by a focus on improving patient outcomes and operational efficiency.",
    "Based in Chicago, IL with my wife Chelsea and our dog Juniper. Outside of work, I enjoy running and rock climbing.",
  ],
};

export const NAV_ITEMS = [
  { name: "Projects", path: "/projects" },
  { name: "Blog", path: "/blog" },
  { name: "Resume", path: "/resume" },
];

export const SKILLS = {
  Languages: ["Python", "Go", "TypeScript", "JavaScript", "Java", "C#", "SQL"],
  Frontend: ["React", "Next.js", "Angular", "Vue.js", "Tailwind CSS", "TypeScript"],
  Backend: ["Node.js", "FastAPI", "Express", "Spring Boot", "GraphQL", "Apache Camel"],
  "AI/ML": ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Spark", "MLOps"],
  "Cloud & DevOps": ["Kubernetes", "Docker", "AWS", "GCP", "Terraform", "Helm", "ArgoCD"],
  Data: ["PostgreSQL", "MongoDB", "Redis", "Kafka", "Elasticsearch", "Data Pipelines"],
  Tools: ["Git", "CI/CD", "Jenkins", "GitHub Actions", "Linux", "Agile", "System Design"],
};

export const TECH_STACK = {
  Languages: {
    color: "cyan",
    items: ["TypeScript", "JavaScript", "Python", "Java", "Go", "SQL"],
  },
  "AI / ML": {
    color: "yellow",
    items: ["TensorFlow", "PyTorch", "Spark", "Scikit-learn", "Pandas", "NumPy"],
  },
  "Cloud & DevOps": {
    color: "green",
    items: ["AWS", "GCP", "Kubernetes", "Docker", "Terraform", "Helm"],
  },
  Backend: {
    color: "purple",
    items: ["Node.js", "Express", "FastAPI", "Spring Boot", "GraphQL"],
  },
};

// 3-level constellation data: Category → Subcategory → Items
// Derived from actual repo scans across ~/dev and ~/nanoclaw.
export interface ConstellationItem {
  name: string;
}
export interface ConstellationSubcategory {
  name: string;
  items: ConstellationItem[];
}
export interface ConstellationCategory {
  color: string;
  subcategories: ConstellationSubcategory[];
}
export const CONSTELLATION_DATA: Record<string, ConstellationCategory> = {
  Languages: {
    color: "cyan",
    subcategories: [
      { name: "Primary", items: [{ name: "TypeScript" }, { name: "Python" }] },
      { name: "Systems", items: [{ name: "Rust" }, { name: "Go" }] },
      { name: "Other", items: [{ name: "Swift" }, { name: "Java" }, { name: "SQL" }] },
    ],
  },
  "AI / ML": {
    color: "yellow",
    subcategories: [
      { name: "LLMs", items: [{ name: "Claude" }, { name: "OpenAI" }, { name: "Ollama" }] },
      {
        name: "Frameworks",
        items: [{ name: "LightGBM" }, { name: "scikit-learn" }, { name: "SHAP" }],
      },
      { name: "Data", items: [{ name: "Pandas" }, { name: "NumPy" }, { name: "FAISS" }] },
      { name: "Patterns", items: [{ name: "RAG" }, { name: "Embeddings" }] },
    ],
  },
  "Cloud & Infra": {
    color: "green",
    subcategories: [
      { name: "Cloud", items: [{ name: "AWS" }, { name: "GCP" }, { name: "Vercel" }] },
      { name: "Containers", items: [{ name: "Kubernetes" }, { name: "Docker" }, { name: "Helm" }] },
      { name: "IaC", items: [{ name: "Terraform" }, { name: "GitHub Actions" }] },
      { name: "Monitoring", items: [{ name: "Prometheus" }, { name: "Grafana" }] },
    ],
  },
  Backend: {
    color: "purple",
    subcategories: [
      { name: "Web", items: [{ name: "Next.js" }, { name: "FastAPI" }, { name: "Express" }] },
      { name: "Data", items: [{ name: "SQLite" }, { name: "GraphQL" }] },
      { name: "Validation", items: [{ name: "Zod" }, { name: "Pydantic" }] },
    ],
  },
  Frontend: {
    color: "pink",
    subcategories: [
      { name: "Web", items: [{ name: "React" }, { name: "Tailwind" }, { name: "Framer Motion" }] },
      { name: "Desktop", items: [{ name: "Tauri" }, { name: "ratatui" }] },
      { name: "Mobile", items: [{ name: "SwiftUI" }] },
    ],
  },
  Systems: {
    color: "orange",
    subcategories: [
      { name: "Rust", items: [{ name: "Tokio" }, { name: "Cargo" }] },
      { name: "Go", items: [{ name: "Go Modules" }] },
      { name: "Search", items: [{ name: "HNSW" }, { name: "Vector Search" }] },
    ],
  },
};

export const EXPERIENCE = [
  {
    title: "Senior Software Engineer",
    company: "Capital One",
    location: "Chicago, IL",
    period: "2024–2026",
    description:
      "Leading development of cloud-native applications, ETL pipelines, and real-time APIs processing millions of daily transactions in financial services.",
    highlights: [
      "Architected and deployed scalable microservices, real-time APIs, and data pipelines on AWS (ECS, Lambda, Glue, SQS, Step Functions)",
      "Led cross-functional engineering teams partnering with external vendors (Experian, CreditSesame, CreditKarma, NerdWallet) to prescreen millions of customers daily",
      "Translated non-technical business & stakeholder intents to concrete engineering plans",
      "Implemented comprehensive CI/CD pipelines and automated testing reducing deployment time by 60%",
      "Mentored junior engineers and established best practices for cloud-native development",
    ],
  },
  {
    title: "Machine Learning Engineer II",
    company: "D2iQ (acquired by Nutanix)",
    location: "Remote, U.S.",
    period: "2022 - 2023",
    description:
      "Developed ML-based insights and AI capabilities for enterprise Kubernetes platform (DKP).",
    highlights: [
      "Built AI Navigator chatbot for DKP platform using machine learning and NLP",
      "Developed ML-based insights engine for Kubernetes cluster optimization and troubleshooting",
      "Contributed to enterprise-grade Kubernetes platform serving Fortune 500 companies",
      "Integrated machine learning workflows into container orchestration systems",
      "Collaborated with product and engineering teams to deliver AI-powered platform features",
    ],
  },
  {
    title: "Technical Consultant",
    company: "Red Hat",
    location: "Remote, U.S.",
    period: "2020 - 2022",
    description:
      "Consultant for public-sector clients, focusing on automation and cloud-migration.",
    highlights: [
      "Led on-prem to cloud-migration efforts for government agencies and other public sector clients",
      "Converted legacy monolith architecture to scalable Kubernetes microservices",
      "Automated major SDLC components using Ansible to save clients hundreds of developer-hours",
      "Contributed to open-source projects like RHEL and other Linux projects",
      "Mentored consultants on best practices, taught university students about Linux and open-source software",
    ],
  },
  {
    title: "Psychological Operations Specialist",
    company: "U.S. Army Reserves",
    location: "Peru, IN",
    period: "2017 - 2025",
    description: "PSYOP Specialist based in 316th PSYOP company",
    highlights: [
      "Obtained Secret level Clearance",
      "Led detachment of soldiers in training and real-world scenarios",
      "More information upon request",
    ],
  },
];

export const EDUCATION = [
  {
    degree: "M.S. in Computer Science",
    school: "University of Texas at Austin",
    location: "Austin, TX (Online)",
    period: "2021 - 2023",
    focus: "Deep Learning, Natural Language Processing",
    achievements: [
      "Specialized in NLP, Teaching Assistant for class while working full-time",
      "Focused on advanced modeling techniques, math, and predictive analytics",
      "Completed advanced coursework in OS, Virtualization, and Parallel Systems",
    ],
  },
  {
    degree: "B.S. in Computer Science & Mathematics",
    school: "Purdue University",
    location: "West Lafayette, IN",
    period: "2016 - 2020",
    focus: "Double Major: Computer Science and Mathematics",
    achievements: [
      "Graduated with double major in Computer Science and Mathematics",
      "Strong foundation in algorithms, data structures, and mathematical modeling",
      "Completed coursework in machine learning, software engineering, and systems programming",
      "Mathematics focus in real and complex analysis, group/ring theory, and abstract algebra",
    ],
  },
];

export const SOCIAL_LINKS = [
  { platform: "GitHub", url: OWNER_INFO.github, icon: "Github" },
  { platform: "LinkedIn", url: OWNER_INFO.linkedin, icon: "Linkedin" },
  { platform: "Email", url: `mailto:${OWNER_INFO.email}`, icon: "Mail" },
];

export const FEATURED_PROJECTS: string[] = ["go-cache-ml", "next-portfolio"];

export const CAREER_TIMELINE = [
  { company: "Red Hat", role: "Technical Consultant", period: "2020–2022", color: "#39ff14" },
  { company: "D2iQ", role: "ML Engineer II", period: "2022–2023", color: "#b829dd" },
  { company: "Capital One", role: "Senior SWE", period: "2023–2026", color: "#00f0ff" },
];

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Kotlin: "#A97BFF",
  Swift: "#ffac45",
};
