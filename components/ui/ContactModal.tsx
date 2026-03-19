"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import Button from "@/components/ui/Button";
import { useContactModal } from "@/lib/contact-context";

const initialFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactModal() {
  const { isOpen, close } = useContactModal();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form state when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setFormData(initialFormData);
        setIsSubmitted(false);
        setIsSubmitting(false);
        setError(null);
      }, 300); // Wait for exit animation to finish
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setIsSubmitted(true);

      // Auto-close after 3 seconds on success
      setTimeout(() => {
        close();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="tile w-full max-w-lg pointer-events-auto relative"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-modal-title"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-neon-green font-mono text-sm">$</span>
                  <h2
                    id="contact-modal-title"
                    className="text-xl font-bold text-neon-cyan font-mono"
                  >
                    send_message.sh
                  </h2>
                </div>
                <button
                  onClick={close}
                  className="text-dark-400 hover:text-dark-100 transition-colors p-1 rounded"
                  aria-label="Close contact modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center"
                >
                  <div className="w-14 h-14 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-dark-900" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-neon-green mb-2">Message Sent!</h3>
                  <p className="text-dark-300 text-sm">
                    Thank you for reaching out. I&apos;ll get back to you soon.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="modal-name"
                      className="block text-sm font-medium text-dark-200 mb-1.5"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="modal-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded focus:outline-none focus:border-neon-cyan transition-colors text-dark-50"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="modal-email"
                      className="block text-sm font-medium text-dark-200 mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="modal-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded focus:outline-none focus:border-neon-cyan transition-colors text-dark-50"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="modal-subject"
                      className="block text-sm font-medium text-dark-200 mb-1.5"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="modal-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded focus:outline-none focus:border-neon-cyan transition-colors text-dark-50"
                      placeholder="What is this about?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="modal-message"
                      className="block text-sm font-medium text-dark-200 mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="modal-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded focus:outline-none focus:border-neon-cyan transition-colors text-dark-50 resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="accent"
                    className="w-full flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    <Send size={18} />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
