"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Github, Linkedin, Send } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { OWNER_INFO } from "@/lib/constants";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Show success message
      setIsSubmitted(true);

      // Reset form after 5 seconds
      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">Get In Touch</h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Have a question or want to work together? I&apos;d love to hear from you. Send me a
            message and I&apos;ll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card glow>
              <CardHeader>
                <h2 className="text-2xl font-bold text-neon-cyan">Contact Information</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <Mail className="text-neon-pink mt-1 shrink-0" size={20} />
                    <div>
                      <p className="text-dark-400 text-sm">Email</p>
                      <a
                        href={`mailto:${OWNER_INFO.email}`}
                        className="text-dark-100 hover:text-neon-cyan transition-colors break-all"
                      >
                        {OWNER_INFO.email}
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <MapPin className="text-neon-purple mt-1 shrink-0" size={20} />
                    <div>
                      <p className="text-dark-400 text-sm">Location</p>
                      <p className="text-dark-100">{OWNER_INFO.location}</p>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <p className="text-dark-400 text-sm mb-3">Social</p>
                    <div className="flex gap-4">
                      <a
                        href={OWNER_INFO.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark-300 hover:text-neon-cyan transition-colors"
                        aria-label="GitHub"
                      >
                        <Github size={24} />
                      </a>
                      <a
                        href={OWNER_INFO.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark-300 hover:text-neon-cyan transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin size={24} />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card glow>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-neon-green font-mono">$</span>
                  <h2 className="text-2xl font-bold text-neon-cyan font-mono">send_message.sh</h2>
                </div>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="text-dark-900" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-neon-green mb-2">Message Sent!</h3>
                    <p className="text-dark-300">
                      Thank you for reaching out. I&apos;ll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-dark-200 mb-2"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded focus:outline-none focus:border-neon-cyan transition-colors text-dark-50"
                        placeholder="Your name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-dark-200 mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded focus:outline-none focus:border-neon-cyan transition-colors text-dark-50"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-dark-200 mb-2"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded focus:outline-none focus:border-neon-cyan transition-colors text-dark-50"
                        placeholder="What is this about?"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-dark-200 mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded focus:outline-none focus:border-neon-cyan transition-colors text-dark-50 resize-none"
                        placeholder="Your message..."
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-4 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="cyber"
                      className="w-full flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      <Send size={20} />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
