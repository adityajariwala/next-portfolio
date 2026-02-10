# Cyberpunk Portfolio Website

A modern, cyberpunk-themed personal portfolio website built with Next.js 14, TypeScript, and Tailwind CSS.

![Portfolio Preview](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- **🎨 Cyberpunk Design**: Dark theme with neon accents (cyan, pink, purple, green)
- **⚡ Next.js 14**: Built with the latest App Router
- **📱 Responsive**: Mobile-first design that works on all devices
- **🎭 Animations**: Smooth Framer Motion animations throughout
- **🔮 Glitch Effects**: Custom glitch text animations
- **⌨️ Typewriter**: Dynamic typewriter effect for role cycling
- **🚀 GitHub Integration**: Auto-fetches and displays your latest repositories
- **📄 PDF Resume Viewer**: Embedded resume with download functionality
- **📬 Contact Form**: Beautiful contact form (ready for backend integration)
- **🎯 SEO Optimized**: Meta tags and semantic HTML

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/adityajariwala/next-portfolio.git
cd next-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Add your resume:
   - Place your `resume.pdf` file in the `/public` folder

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
next-portfolio/
├── app/                        # Next.js App Router pages
│   ├── about/
│   │   └── page.tsx           # About page
│   ├── contact/
│   │   └── page.tsx           # Contact page
│   ├── projects/
│   │   └── page.tsx           # Projects page with GitHub integration
│   ├── resume/
│   │   └── page.tsx           # Resume page
│   ├── globals.css            # Global styles and animations
│   ├── layout.tsx             # Root layout with Navbar and Footer
│   └── page.tsx               # Home page
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx         # Navigation component
│   │   └── Footer.tsx         # Footer component
│   └── ui/
│       ├── Button.tsx         # Reusable button component
│       ├── Card.tsx           # Card component with variants
│       ├── GlitchText.tsx     # Glitch effect text
│       └── TypewriterText.tsx # Typewriter animation
├── lib/
│   ├── constants.ts           # App constants and configuration
│   └── utils.ts               # Utility functions
├── public/
│   └── resume.pdf            # Your resume (add this)
└── tailwind.config.ts        # Tailwind configuration
```

## 🎨 Customization

### Update Personal Information

Edit `/lib/constants.ts` to update your personal information:

```typescript
export const OWNER_INFO = {
  name: "Your Name",
  title: "Your Title",
  company: "Your Company",
  location: "Your Location",
  domain: "yourdomain.com",
  github: "https://github.com/yourusername",
  linkedin: "https://www.linkedin.com/in/yourprofile",
  email: "your.email@example.com",
};
```

### Modify Tech Stack

Update the `TECH_STACK` and `SKILLS` objects in `/lib/constants.ts`:

```typescript
export const TECH_STACK = {
  Category: {
    color: "cyan", // cyan, pink, purple, green, yellow, orange
    items: ["Tech1", "Tech2", "Tech3"],
  },
};
```

### Add Experience

Update the `EXPERIENCE` array in `/lib/constants.ts`:

```typescript
export const EXPERIENCE = [
  {
    title: "Job Title",
    company: "Company Name",
    location: "Location",
    period: "2020 - Present",
    description: "Brief description...",
    highlights: [
      "Achievement 1",
      "Achievement 2",
    ],
  },
];
```

### Color Theme

The color palette is defined in `tailwind.config.ts`. You can customize the neon colors:

```typescript
neon: {
  cyan: "#00f0ff",
  pink: "#ff2d95",
  purple: "#b829dd",
  green: "#39ff14",
  yellow: "#fff01f",
  orange: "#ff6b35",
}
```

## 📝 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will auto-detect Next.js and configure the build
4. Add your custom domain in the Vercel dashboard

### Other Platforms

This project can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Railway
- Render

## 📬 Contact Form Integration

The contact form is currently frontend-only. To make it functional, integrate with:

### Option 1: Formspree
```bash
npm install @formspree/react
```

### Option 2: Netlify Forms
Add `data-netlify="true"` to your form element.

### Option 3: Custom API
Create an API route at `/app/api/contact/route.ts`.

## 🎯 Features Overview

### Home Page
- Animated hero section with glitch effect
- Typewriter animation cycling through roles
- Tech stack preview grid
- Call-to-action sections

### About Page
- Professional profile card
- Experience timeline
- Skills categorization
- Engineering philosophy

### Projects Page
- GitHub API integration
- Auto-fetches latest repositories
- Language indicators
- Live demo and source code links

### Resume Page
- Embedded PDF viewer
- Download functionality
- LinkedIn profile link

### Contact Page
- Professional contact form
- Contact information display
- Social media links

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Aditya Jariwala**
- Website: [adityajariwala.com](https://adityajariwala.com)
- GitHub: [@adityajariwala](https://github.com/adityajariwala)
- LinkedIn: [aditya-jariwala](https://www.linkedin.com/in/aditya-jariwala)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- Icons by [Lucide](https://lucide.dev/)

---

⭐ Star this repo if you find it helpful!
