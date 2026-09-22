import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTRACT, checkConsumer, checkThemeFile, run } from "./check_themes.mjs";

test("the skill's own themes and deck assets satisfy the contract", () => {
	const { problems } = run();
	assert.deepEqual(problems, []);
});

test("checkThemeFile reports missing tokens", () => {
	const missing = checkThemeFile(":root { --bg: #fff; --text: #000; }");
	assert.ok(missing.includes("--accent"));
	assert.ok(!missing.includes("--bg"));
	assert.equal(checkThemeFile(CONTRACT.map((token) => `${token}: x;`).join("\n")).length, 0);
});

test("checkConsumer flags non-contract tokens unless a fallback is given", () => {
	assert.deepEqual(checkConsumer("a { color: var(--accent); }"), []);
	assert.deepEqual(checkConsumer("a { color: var(--mystery, red); }"), []);
	assert.deepEqual(checkConsumer("a { color: var(--mystery); }"), ["--mystery"]);
});
