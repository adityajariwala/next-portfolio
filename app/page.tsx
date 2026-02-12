"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, ChevronDown } from "lucide-react";
import GlitchText from "@/components/ui/GlitchText";
import TypewriterText from "@/components/ui/TypewriterText";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { OWNER_INFO, ROLES, TECH_STACK } from "@/lib/constants";

const techStackColors: Record<string, string> = {
  cyan: "border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-900",
  yellow: "border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-dark-900",
  green: "border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-900",
  purple: "border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-dark-900",
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-linear-to-br from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10 animate-glow-pulse" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-neon-cyan font-mono text-sm md:text-base mb-4">Hi, I&apos;m</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <GlitchText text={OWNER_INFO.name} className="text-glow-cyan text-neon-cyan" />
            </h1>
            <div className="text-2xl md:text-4xl lg:text-5xl font-bold mb-8 h-16 flex items-center justify-center">
              <TypewriterText words={ROLES} className="gradient-text inline-block" />
            </div>
            <p className="text-dark-200 text-lg md:text-xl max-w-3xl mx-auto mb-12">
              Building cloud-native applications that process millions of transactions daily.
              Specializing in machine learning, Kubernetes, and scalable systems for financial
              services. Designing novel AI/ML use-cases that add real customer value and have a high
              ROI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/projects">
                <Button variant="cyber" className="w-full sm:w-auto">
                  View Projects
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Get in Touch
                </Button>
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex gap-6 justify-center mb-16">
              <motion.a
                href={OWNER_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                className="text-dark-300 hover:text-neon-cyan transition-colors"
                aria-label="GitHub"
              >
                <Github size={28} />
              </motion.a>
              <motion.a
                href={OWNER_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                className="text-dark-300 hover:text-neon-cyan transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={28} />
              </motion.a>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="text-neon-cyan" size={32} />
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">
              Tech Stack
            </h2>
            <p className="text-dark-300 text-center mb-12 max-w-2xl mx-auto">
              Technologies and tools I work with to build modern, scalable applications
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(TECH_STACK).map(([category, { color, items }]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card glow>
                    <CardHeader>
                      <h3
                        className={`text-xl font-bold border-l-4 pl-4 ${
                          techStackColors[color as keyof typeof techStackColors]
                        }`}
                      >
                        {category}
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1 bg-dark-700 rounded text-sm text-dark-100 hover:bg-dark-600 transition-colors"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Teaser */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Featured Projects</h2>
            <p className="text-dark-300 mb-8 max-w-2xl mx-auto">
              Check out some of my recent work and open-source contributions
            </p>
            <Link href="/projects">
              <Button variant="cyber">View All Projects</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Let&apos;s Build Something</span>
              <br />
              <span className="text-neon-cyan">Amazing Together</span>
            </h2>
            <p className="text-dark-300 text-lg mb-8">
              I&apos;m always interested in hearing about new projects and opportunities.
            </p>
            <Link href="/contact">
              <Button variant="cyber" className="text-lg px-8 py-4">
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
