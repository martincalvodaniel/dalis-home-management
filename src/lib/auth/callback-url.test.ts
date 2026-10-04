import { describe, expect, test } from "bun:test";
import { getSafeCallbackUrl } from "./callback-url";

describe("getSafeCallbackUrl", () => {
	test("keeps internal paths", () => {
		expect(getSafeCallbackUrl("/household?tab=tasks")).toBe(
			"/household?tab=tasks",
		);
	});

	test("rejects absolute and protocol-relative URLs", () => {
		expect(getSafeCallbackUrl("https://example.com")).toBe("/dashboard");
		expect(getSafeCallbackUrl("//example.com")).toBe("/dashboard");
	});

	test("falls back when no callback is provided", () => {
		expect(getSafeCallbackUrl(undefined)).toBe("/dashboard");
	});
});
