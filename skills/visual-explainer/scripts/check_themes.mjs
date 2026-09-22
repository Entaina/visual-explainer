#!/usr/bin/env node
// visual-explainer — verify the theme token contract.
// 1. Every theme file in themes/ defines every token of the contract
//    (themes/README.md is the human statement of the same list).
// 2. The deck-slidev managed assets consume only contract tokens, unless the
//    use carries an explicit fallback: var(--non-contract, <fallback>).
// Zero dependencies. Exit code 0 = contract holds.

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const CONTRACT = [
	"--bg", "--surface", "--surface2", "--surface-elevated",
	"--border", "--border-bright", "--text", "--text-dim",
	"--accent", "--accent-dim",
	"--node-a", "--node-a-dim", "--node-b", "--node-b-dim", "--node-c", "--node-c-dim",
	"--green", "--green-dim", "--red", "--red-dim", "--orange", "--orange-dim",
	"--code-bg", "--code-text",
	"--font-display", "--font-body", "--font-mono",
];

const SKILL_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function checkThemeFile(css) {
	const defined = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
	return CONTRACT.filter((token) => !defined.has(token));
}

export function checkConsumer(source) {
	const violations = [];
	for (const match of source.matchAll(/var\(\s*(--[a-z0-9-]+)\s*([,)])/g)) {
		const [, token, delimiter] = match;
		const hasFallback = delimiter === ",";
		if (!CONTRACT.includes(token) && !hasFallback) violations.push(token);
	}
	return [...new Set(violations)];
}

// `consumers` stays for ad-hoc checks of token-consuming files.
export function run({ themesDir = join(SKILL_ROOT, "themes"), consumers = [] } = {}) {
	const problems = [];
	const themeFiles = readdirSync(themesDir).filter((name) => name.endsWith(".css")).sort();
	if (themeFiles.length === 0) problems.push(`no theme files found in ${themesDir}`);
	for (const name of themeFiles) {
		const missing = checkThemeFile(readFileSync(join(themesDir, name), "utf8"));
		if (missing.length) problems.push(`${name}: missing contract tokens: ${missing.join(", ")}`);
	}
	for (const file of consumers) {
		const violations = checkConsumer(readFileSync(file, "utf8"));
		if (violations.length) problems.push(`${file}: consumes non-contract tokens without fallback: ${violations.join(", ")}`);
	}
	return { problems, themeFiles };
}

function main() {
	const { problems, themeFiles } = run();
	if (problems.length) {
		for (const problem of problems) console.error(`FAIL ${problem}`);
		process.exit(1);
	}
	console.log(`OK — ${themeFiles.length} themes satisfy the ${CONTRACT.length}-token contract.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
