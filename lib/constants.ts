export const OWNER_INFO = {
  name: "Aditya Jariwala",
  title: "Senior Software Engineer",
  company: "Capital One",
  location: "Chicago, IL",
  domain: "adityajariwala.com",
  github: "https://github.com/adityajariwala",
  linkedin: "https://www.linkedin.com/in/aditya-jariwala",
  email: "ajariwala24@gmail.com",
  twitter: "https://twitter.com/AdityaJ15",
  tagline: "Building AI-powered, cloud-native applications at scale",
  bio: "Senior Software Engineer specializing in AI/ML and Kubernetes. I architect scalable systems that process millions of transactions daily, combining machine learning with cloud-native technologies to solve complex problems in financial services.",
};

export const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Projects", href: "/projects" },
  { name: "Resume", href: "/resume" },
];

export const ROLES = [
  "Senior Software Engineer",
  "AI/ML Engineer",
  "Kubernetes Platform Developer",
  "Cloud Architect",
  "Full Stack Engineer",
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

export const EXPERIENCE = [
  {
    title: "Senior Software Engineer",
    company: "Capital One",
    location: "Chicago, IL",
    period: "Present",
    description:
      "Leading development of AI/ML-powered cloud-native applications processing millions of daily transactions in financial services.",
    highlights: [
      "Architected and deployed scalable microservices, real-time APIs, and ML-powered data pipelines on AWS and Kubernetes",
      "Led cross-functional engineering teams partnering with external vendors to prescreen millions of customers daily",
      "Built ML-based credit risk scoring systems and predictive analytics solutions for financial products",
      "Implemented comprehensive CI/CD pipelines and automated testing reducing deployment time by 60%",
      "Mentored junior engineers and established best practices for cloud-native development",
    ],
  },
  {
    title: "Software Engineer",
    company: "D2iQ",
    location: "Remote",
    period: "2021 - 2023",
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
    title: "Instructor",
    company: "Red Hat Academy",
    location: "Remote",
    period: "2019 - 2021",
    description:
      "Taught cutting-edge technologies including Linux, containers, Kubernetes, and open-source development to university students.",
    highlights: [
      "Delivered comprehensive courses on Linux fundamentals, containers, and Kubernetes",
      "Trained hundreds of students at universities and community colleges in cloud-native technologies",
      "Developed curriculum and hands-on labs for container orchestration and DevOps practices",
      "Contributed to next-generation developer education in open-source technologies",
      "Received excellent student feedback and teaching evaluations",
    ],
  },
];

export const EDUCATION = [
  {
    degree: "M.S. in Computer Science",
    school: "University of Texas at Austin",
    location: "Austin, TX",
    period: "2018 - 2020",
    focus: "Machine Intelligence, Predictive Analytics",
    achievements: [
      "Specialized in Machine Learning and Artificial Intelligence",
      "Focused on predictive analytics and data-driven systems",
      "Completed advanced coursework in distributed systems and cloud computing",
    ],
  },
  {
    degree: "B.S. in Computer Science & Mathematics",
    school: "Purdue University",
    location: "West Lafayette, IN",
    period: "2014 - 2018",
    focus: "Double Major: Computer Science and Mathematics",
    achievements: [
      "Graduated with double major in Computer Science and Mathematics",
      "Strong foundation in algorithms, data structures, and mathematical modeling",
      "Completed coursework in machine learning, software engineering, and systems programming",
    ],
  },
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
