import { describe, it, expect, vi } from "vitest";
import {
  getAllIller,
  getIl,
  getKonuMatris,
  getIlKonuData,
  bolgeler,
  getBolgeByUrl,
  getIllerByBolge,
} from "../getIlData";

// Mock fs module
vi.mock("fs");
vi.mock("path");

describe("getIlData", () => {
  describe("bolgeler", () => {
    it("should contain all 7 geographic regions", () => {
      expect(bolgeler).toHaveLength(7);
      expect(bolgeler.map((b) => b.ad)).toContain("Akdeniz");
      expect(bolgeler.map((b) => b.ad)).toContain("Marmara");
    });

    it("should have consistent slug and url patterns", () => {
      bolgeler.forEach((bolge) => {
        expect(bolge.slug).toBeTruthy();
        expect(bolge.ad).toBeTruthy();
        expect(bolge.url).toContain("bolgesi");
      });
    });
  });

  describe("getBolgeByUrl", () => {
    it("should find region by URL", () => {
      const bolge = getBolgeByUrl("akdenizbolgesi");
      expect(bolge).toBeDefined();
      expect(bolge?.slug).toBe("akdeniz");
    });

    it("should return undefined for invalid URL", () => {
      const bolge = getBolgeByUrl("invalid-bolge");
      expect(bolge).toBeUndefined();
    });
  });

  describe("getAllIller", () => {
    it("should return array of iller", async () => {
      const iller = await getAllIller();
      expect(Array.isArray(iller)).toBe(true);
    });
  });

  describe("getIl", () => {
    it("should return undefined for non-existent il", async () => {
      const il = await getIl("non-existent-slug");
      expect(il).toBeUndefined();
    });
  });

  describe("getIllerByBolge", () => {
    it("should return array", async () => {
      const iller = await getIllerByBolge("akdeniz");
      expect(Array.isArray(iller)).toBe(true);
    });
  });

  describe("getKonuMatris", () => {
    it("should handle non-existent matris gracefully", async () => {
      const matris = await getKonuMatris("non-existent-konu");
      expect(matris).toBeNull();
    });
  });

  describe("getIlKonuData", () => {
    it("should return null for non-existent data", async () => {
      const data = await getIlKonuData("invalid-il", "invalid-konu");
      expect(data).toBeNull();
    });
  });
});
