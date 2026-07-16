import { describe, it, expect } from "vitest";
import { normalizePhone } from "../normalizePhone.js";

describe("normalizePhone", () => {
    it("should remove non-numeric characters", () => {
        expect(normalizePhone("+60 12-345 6789")).toBe("60123456789");
        expect(normalizePhone("(012) 345-6789")).toBe("60123456789");
    });

    it("should handle numbers starting with 0", () => {
        expect(normalizePhone("0123456789")).toBe("60123456789");
        expect(normalizePhone("019-8765432")).toBe("60198765432");
    });

    it("should handle numbers starting with 1 (missing country code and 0)", () => {
        expect(normalizePhone("123456789")).toBe("60123456789");
    });

    it("should handle numbers already formatted with 60", () => {
        expect(normalizePhone("60123456789")).toBe("60123456789");
        expect(normalizePhone("60 12 345 6789")).toBe("60123456789");
    });
});
