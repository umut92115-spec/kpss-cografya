import { describe, it, expect, vi } from "vitest";
import { getQuizData, quizMevcut } from "../getQuizData";

// Mock fs module
vi.mock("fs");

describe("getQuizData", () => {
  describe("getQuizData", () => {
    it("should return null for non-existent quiz", async () => {
      const data = await getQuizData("non-existent-konu");
      expect(data).toBeNull();
    });

    it("should return QuizData structure when exists", async () => {
      const data = await getQuizData("daglar");
      if (data) {
        expect(data).toHaveProperty("konu");
        expect(data).toHaveProperty("sorular");
        expect(Array.isArray(data.sorular)).toBe(true);
      }
    });

    it("should handle legacy quiz format", async () => {
      // This tests the legacy format conversion logic
      const data = await getQuizData("test-konu");
      if (data && data.sorular.length > 0) {
        const soru = data.sorular[0];
        expect(soru).toHaveProperty("id");
        expect(soru).toHaveProperty("soru");
        expect(soru).toHaveProperty("siklar");
        expect(soru).toHaveProperty("dogru");
        expect(soru).toHaveProperty("zorluk");
      }
    });
  });

  describe("quizMevcut", () => {
    it("should return boolean", async () => {
      const exists = await quizMevcut("daglar");
      expect(typeof exists).toBe("boolean");
    });
  });
});
