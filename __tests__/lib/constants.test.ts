import { describe, it, expect } from "vitest";
import {
  OWNER_INFO,
  NAV_ITEMS,
  SOCIAL_LINKS,
  FEATURED_PROJECTS,
  CAREER_TIMELINE,
  TECH_STACK,
  SKILLS,
  EXPERIENCE,
  LANGUAGE_COLORS,
} from "@/lib/constants";

describe("constants", () => {
  describe("OWNER_INFO", () => {
    it("has required fields", () => {
      expect(OWNER_INFO.name).toBe("Aditya Jariwala");
      expect(OWNER_INFO.email).toContain("@");
      expect(OWNER_INFO.github).toContain("github.com");
      expect(OWNER_INFO.linkedin).toContain("linkedin.com");
      expect(OWNER_INFO.domain).toBeTruthy();
    });
  });

  describe("NAV_ITEMS", () => {
    it("has exactly 3 items (Projects, Blog, Resume)", () => {
      expect(NAV_ITEMS).toHaveLength(3);
      const paths = NAV_ITEMS.map((item) => item.path);
      expect(paths).toContain("/projects");
      expect(paths).toContain("/blog");
      expect(paths).toContain("/resume");
    });

    it("does not include Home, About, or Contact", () => {
      const paths = NAV_ITEMS.map((item) => item.path);
      expect(paths).not.toContain("/");
      expect(paths).not.toContain("/about");
      expect(paths).not.toContain("/contact");
    });
  });

  describe("SOCIAL_LINKS", () => {
    it("has GitHub, LinkedIn, and Email", () => {
      const platforms = SOCIAL_LINKS.map((l) => l.platform);
      expect(platforms).toContain("GitHub");
      expect(platforms).toContain("LinkedIn");
      expect(platforms).toContain("Email");
    });

    it("email link starts with mailto:", () => {
      const email = SOCIAL_LINKS.find((l) => l.platform === "Email");
      expect(email?.url).toMatch(/^mailto:/);
    });
  });

  describe("FEATURED_PROJECTS", () => {
    it("is a non-empty array of strings", () => {
      expect(FEATURED_PROJECTS.length).toBeGreaterThan(0);
      FEATURED_PROJECTS.forEach((p) => expect(typeof p).toBe("string"));
    });
  });

  describe("CAREER_TIMELINE", () => {
    it("has required fields for each entry", () => {
      expect(CAREER_TIMELINE.length).toBeGreaterThan(0);
      CAREER_TIMELINE.forEach((entry) => {
        expect(entry.company).toBeTruthy();
        expect(entry.role).toBeTruthy();
        expect(entry.period).toBeTruthy();
        expect(entry.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });
  });

  describe("TECH_STACK", () => {
    it("has categories with items", () => {
      const categories = Object.keys(TECH_STACK);
      expect(categories.length).toBeGreaterThan(0);
      categories.forEach((cat) => {
        const entry = TECH_STACK[cat as keyof typeof TECH_STACK];
        expect(entry.color).toBeTruthy();
        expect(entry.items.length).toBeGreaterThan(0);
      });
    });
  });

  describe("SKILLS", () => {
    it("has categories with skill arrays", () => {
      expect(Object.keys(SKILLS).length).toBeGreaterThan(0);
    });
  });

  describe("EXPERIENCE", () => {
    it("has entries with required fields", () => {
      expect(EXPERIENCE.length).toBeGreaterThan(0);
      EXPERIENCE.forEach((exp) => {
        expect(exp.title).toBeTruthy();
        expect(exp.company).toBeTruthy();
        expect(exp.highlights.length).toBeGreaterThan(0);
      });
    });
  });

  describe("LANGUAGE_COLORS", () => {
    it("has common languages", () => {
      expect(LANGUAGE_COLORS["TypeScript"]).toBeTruthy();
      expect(LANGUAGE_COLORS["Python"]).toBeTruthy();
      expect(LANGUAGE_COLORS["Go"]).toBeTruthy();
    });
  });
});
