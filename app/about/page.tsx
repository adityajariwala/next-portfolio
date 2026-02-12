"use client";

import { motion } from "framer-motion";
import { MapPin, Building2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { OWNER_INFO, EXPERIENCE, SKILLS, EDUCATION } from "@/lib/constants";

export default function About() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">About Me</h1>
          <p className="text-dark-300 text-lg">Get to know more about my journey and expertise</p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <Card glow className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-neon-cyan shadow-lg shadow-neon-cyan/50">
                  <img
                    src="/aditya.jpg"
                    alt={OWNER_INFO.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-neon-cyan mb-2">{OWNER_INFO.name}</h2>
                <p className="text-xl text-dark-200 mb-4">{OWNER_INFO.title}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start text-dark-300">
                  <div className="flex items-center gap-2">
                    <Building2 size={18} className="text-neon-purple" />
                    <span>{OWNER_INFO.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-neon-pink" />
                    <span>{OWNER_INFO.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <h2 className="text-3xl font-bold text-neon-cyan">My Story</h2>
            </CardHeader>
            <CardContent>
              <div className="text-dark-200 space-y-4 leading-relaxed">
                <p>
                  I&apos;m a Senior Software Engineer at Capital One, where I architect
                  AI/ML-powered, cloud-native applications that process millions of daily
                  transactions. With a Master&apos;s degree in Computer Science from UT Austin and a
                  dual Bachelor&apos;s in CS and Mathematics from Purdue, I bring both theoretical
                  depth and practical expertise to every project.
                </p>
                <p>
                  My career spans the full spectrum of modern software engineering—from mentoring
                  others Linux and Kubernetes at Red Hat Academy, to building ML-based insights for
                  enterprise Kubernetes platforms at D2iQ, to my current role developing scalable
                  systems, high-volume ETL pipelines, and real-time APIs in financial services.
                  I&apos;ve contributed to open-source healthcare projects like ChRIS, and built
                  everything from credit risk scoring systems to AI chatbots.
                </p>
                <p>
                  I specialize in the intersection of artificial intelligence, distributed systems,
                  and cloud-native architecture. Whether it&apos;s designing ML pipelines,
                  optimizing Kubernetes deployments, or building high-throughput APIs, I love
                  solving complex technical challenges that have real-world impact.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Experience</h2>
          <div className="space-y-8">
            {EXPERIENCE.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative pl-8 border-l-2 border-neon-cyan"
              >
                {/* Timeline dot */}
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-neon-cyan animate-glow-pulse" />

                <Card glow>
                  <CardHeader>
                    <h3 className="text-2xl font-bold text-neon-cyan">{exp.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-dark-300 mt-2">
                      <span className="font-semibold">{exp.company}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{exp.location}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="font-mono text-sm">{exp.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-dark-200 mb-4">{exp.description}</p>
                    <ul className="space-y-2">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2 text-dark-300">
                          <span className="text-neon-purple mt-1">▹</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Education</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {EDUCATION.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card glow>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h3 className="text-2xl font-bold text-neon-purple">{edu.degree}</h3>
                        <p className="text-lg text-dark-100 mt-1">{edu.school}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-dark-400 font-mono text-sm">{edu.period}</p>
                        <p className="text-dark-400 text-sm">{edu.location}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neon-cyan font-semibold mb-3">{edu.focus}</p>
                    <ul className="space-y-2">
                      {edu.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2 text-dark-300">
                          <span className="text-neon-purple mt-1">▹</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">
            Skills & Technologies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(SKILLS).map(([category, skills], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card glow>
                  <CardHeader>
                    <h3 className="text-xl font-bold text-neon-cyan">{category}</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-dark-700 rounded text-sm text-dark-100 hover:bg-dark-600 hover:text-neon-cyan transition-all"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card glow>
            <CardHeader>
              <h2 className="text-3xl font-bold text-neon-cyan">My Approach</h2>
            </CardHeader>
            <CardContent>
              <div className="text-dark-200 space-y-4 leading-relaxed">
                <p>
                  I believe in writing clean, maintainable code that not only solves problems but is
                  also a joy to work with. My approach combines:
                </p>
                <ul className="space-y-2 pl-6">
                  <li className="flex items-start gap-2">
                    <span className="text-neon-cyan mt-1">▹</span>
                    <span>
                      <strong>User-First Thinking:</strong> Always keeping the end user in mind when
                      designing solutions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-cyan mt-1">▹</span>
                    <span>
                      <strong>Continuous Learning:</strong> Staying updated with the latest
                      technologies and best practices
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-cyan mt-1">▹</span>
                    <span>
                      <strong>Collaboration:</strong> Working closely with teams to deliver
                      exceptional results
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-cyan mt-1">▹</span>
                    <span>
                      <strong>Quality Over Quantity:</strong> Focusing on well-tested, optimized
                      solutions
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
