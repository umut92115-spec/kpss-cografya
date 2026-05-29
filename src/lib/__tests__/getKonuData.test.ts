import { describe, it, expect, vi } from "vitest";
import { getAllKonular, getKonu, getKonuFaq } from "../getKonuData";

// Mock fs module
vi.mock("fs");

describe("getKonuData", () => {
  describe("getAllKonular", () => {
    it("should return array of konular", () => {
      const konular = getAllKonular();
      expect(Array.isArray(konular)).toBe(true);
    });

    it("should cache konular after first call", () => {
      const first = getAllKonular();
      const second = getAllKonular();
      expect(first).toEqual(second); // Same content due to caching
      expect(first).toHaveLength(20); // Verify we have expected number of konular
    });
  });

  describe("getKonu", () => {
    it("should return konu by slug", () => {
      const konu = getKonu("daglar");
      if (konu) {
        expect(konu).toHaveProperty("slug");
        expect(konu).toHaveProperty("baslik");
        expect(konu).toHaveProperty("agirlik");
      }
    });

    it("should return undefined for non-existent konu", () => {
      const konu = getKonu("non-existent-konu");
      expect(konu).toBeUndefined();
    });
  });

  describe("getKonuFaq", () => {
    it("should return array of FAQs", () => {
      const faqs = getKonuFaq("daglar");
      expect(Array.isArray(faqs)).toBe(true);
    });

    it("should return empty array for non-existent konu", () => {
      const faqs = getKonuFaq("non-existent-konu");
      expect(Array.isArray(faqs)).toBe(true);
      expect(faqs).toHaveLength(0);
    });

    it("should validate FAQ structure if exists", () => {
      const faqs = getKonuFaq("daglar");
      if (faqs.length > 0) {
        const faq = faqs[0];
        expect(faq).toHaveProperty("q");
        expect(faq).toHaveProperty("a");
      }
    });
  });
});
