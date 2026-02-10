"use client";

import { motion } from "framer-motion";
import { Download, Linkedin } from "lucide-react";
import Button from "@/components/ui/Button";
import { OWNER_INFO } from "@/lib/constants";

export default function Resume() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            Resume
          </h1>
          <p className="text-dark-300 text-lg mb-8">
            Download my resume or view my professional profile
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/resume.pdf" download>
              <Button variant="cyber" className="flex items-center gap-2">
                <Download size={20} />
                Download Resume
              </Button>
            </a>
            <a
              href={OWNER_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" className="flex items-center gap-2">
                <Linkedin size={20} />
                View LinkedIn
              </Button>
            </a>
          </div>
        </motion.div>

        {/* PDF Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-dark-800 rounded-lg p-4 border border-dark-700"
        >
          <div className="w-full h-[800px] rounded overflow-hidden">
            <iframe
              src="/resume.pdf"
              className="w-full h-full"
              title="Resume PDF"
            />
          </div>

          {/* Fallback message */}
          <div className="mt-4 text-center text-dark-400 text-sm">
            <p>
              If the PDF doesn&apos;t load, please{" "}
              <a
                href="/resume.pdf"
                download
                className="text-neon-cyan hover:text-neon-pink transition-colors"
              >
                download it here
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
