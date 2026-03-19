"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { OWNER_INFO, SOCIAL_LINKS } from "@/lib/constants";
import SkillConstellation from "@/components/home/SkillConstellation";

const ICON_MAP = {
  Github,
  Linkedin,
  Mail,
} as const;

type IconName = keyof typeof ICON_MAP;

export default function HeroSection() {
  return (
    <section className="relative min-h-screen">
      {/* Constellation — covers full viewport as background, pointer events enabled */}
      <div className="hidden lg:block absolute inset-0 z-0">
        <SkillConstellation className="w-full h-full" />
      </div>

      {/* Text — pointer-events-none on the wrapper so clicks pass through to canvas,
           but re-enable on interactive children (buttons, links) */}
      <div className="relative z-10 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-24 lg:py-0 min-h-screen text-center lg:text-left lg:max-w-[45%] pointer-events-none">
        {/* System tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.0 }}
        >
          <span
            className="text-neon-cyan font-mono uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "11px",
              letterSpacing: "3px",
            }}
          >
            {"// PORTFOLIO.SYS"}
          </span>
        </motion.div>

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-4"
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              letterSpacing: "-2px",
              color: "#f0f0f0",
              lineHeight: 1.05,
            }}
            className="text-[40px] lg:text-[56px]"
          >
            Aditya
            <br />
            Jariwala
          </h1>
        </motion.div>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4"
          style={{
            fontSize: "15px",
            color: "#00f0ff",
            textShadow: "0 0 10px rgba(0,240,255,0.3)",
          }}
        >
          {OWNER_INFO.title} at {OWNER_INFO.company}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-3 mx-auto lg:mx-0"
          style={{
            fontSize: "14px",
            color: "#555",
            maxWidth: "440px",
            lineHeight: 1.6,
          }}
        >
          Building AI-powered, cloud-native systems that process millions of transactions daily.
          Specializing in ML, Kubernetes, and scalable architecture.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 flex flex-row gap-3 justify-center lg:justify-start flex-wrap pointer-events-auto"
        >
          <Link
            href="/projects"
            className="bg-transparent border border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] rounded-lg px-7 py-3 text-sm font-medium transition-all duration-200"
          >
            Explore Work
          </Link>
          <Link
            href="/blog"
            className="border border-dark-600 text-dark-300 hover:border-dark-400 rounded-lg px-7 py-3 text-sm font-medium transition-all duration-200"
          >
            Read Blog
          </Link>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-6 flex flex-row gap-5 justify-center lg:justify-start pointer-events-auto"
        >
          {SOCIAL_LINKS.map((link) => {
            const IconComponent = ICON_MAP[link.icon as IconName];
            return (
              <a
                key={link.platform}
                href={link.url}
                target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                aria-label={link.platform}
                className="flex items-center gap-1.5 transition-colors duration-200"
                style={{ fontSize: "11px", color: "#444" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#00f0ff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#444";
                }}
              >
                {IconComponent && <IconComponent size={16} />}
                <span>{link.platform}</span>
              </a>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-dark-400 uppercase tracking-[2px]" style={{ fontSize: "9px" }}>
          Scroll
        </span>
        <div
          className="w-px h-5"
          style={{
            background: "linear-gradient(to bottom, var(--color-dark-400, #444), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
