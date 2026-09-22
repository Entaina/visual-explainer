#!/usr/bin/env node
// visual-explainer — deterministic delivery check for produced artifacts.
// Validates the mechanical part of each target's contract; judgment stays
// with humans and eval rubrics. Used by the final checklist and by evals.
// Zero dependencies. Exit code 0 = artifact passes.
//
// Usage:
//   node check_artifact.mjs <file> --kind page      [--min-sections N] [--expect-table] [--expect-mermaid]
//   node check_artifact.mjs <file> --kind deck-html [--min-slides N]
//   node check_artifact.mjs <slides.md> --kind slidev
//
// Missing pieces are FAIL lines; softer signals are WARN lines (do not affect
// the exit code).

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { assertHtmlDocument } from "./render.mjs";

function count(haystack, re) {
	return [...haystack.matchAll(re)].length;
}

function checkHtmlCommon(doc, fails) {
	try {
		assertHtmlDocument(doc);
	} catch (error) {
		fails.push(error.message);
		return;
	}
	if (!/<title>[^<]+<\/title>/i.test(doc)) fails.push("missing non-empty <title>");
	if (!/<html\b[^>]*\blang\s*=/i.test(doc)) fails.push("missing lang attribute on <html>");
	if (!/<meta\b[^>]*name\s*=\s*["']viewport["']/i.test(doc)) fails.push("missing viewport meta");
	if (!doc.includes("var(--")) fails.push("no CSS custom properties used — theme tokens missing");
	const figures = count(doc, /<figure\b/gi);
	const captions = count(doc, /<figcaption\b/gi);
	if (captions < figures) fails.push(`${figures} <figure> but only ${captions} <figcaption> — every figure states its claim`);
}

export function checkPage(doc, { minSections, expectTable, expectMermaid } = {}) {
	const fails = [];
	const warns = [];
	checkHtmlCommon(doc, fails);
	const hasMermaid = doc.includes("mermaid.initialize") || doc.includes('class="mermaid');
	if (expectMermaid && !hasMermaid) fails.push("expected a Mermaid diagram, none found");
	if (hasMermaid) {
		for (const piece of ["diagram-shell", "zoom-controls", "mermaid-viewport"]) {
			if (!doc.includes(piece)) fails.push(`Mermaid present without the canonical shell (missing ${piece})`);
		}
	}
	if (minSections !== undefined) {
		const sections = count(doc, /<h2\b/gi);
		if (sections < minSections) fails.push(`expected at least ${minSections} major sections (<h2>), found ${sections}`);
	}
	if (expectTable && !/<table\b/i.test(doc)) fails.push("expected a semantic <table>, none found");
	return { fails, warns };
}

function stripHtmlTags(html) {
	return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// Countable density limits from references/slide-types/ — checked per <section>.
function checkHtmlDensity(doc, fails) {
	const sections = doc.split(/<section\b/i).slice(1);
	sections.forEach((chunk, index) => {
		const slideNo = index + 1;
		const rows = count(chunk, /<tr[\s>]/gi);
		const bodyRows = /<thead\b/i.test(chunk) ? rows - 1 : rows;
		if (bodyRows > 8) fails.push(`slide ${slideNo}: table has ${bodyRows} body rows (max 8 — paginate to the next slide)`);
		for (const list of chunk.matchAll(/<[ou]l[\s\S]*?<\/[ou]l>/gi)) {
			const bullets = count(list[0], /<li[\s>]/gi);
			if (bullets > 6) fails.push(`slide ${slideNo}: a list has ${bullets} bullets (max 5–6 per list — split the slide)`);
		}
		for (const pre of chunk.matchAll(/<pre\b([^>]*)>[\s\S]*?<\/pre>/gi)) {
			if (/mermaid/.test(pre[1])) continue;
			const lines = stripHtmlTags(pre[0]) === "" ? 0 : pre[0].replace(/^[\s\S]*?>/, "").trim().split("\n").length;
			if (lines > 10) fails.push(`slide ${slideNo}: code block has ${lines} lines (max 10)`);
		}
		for (const quote of chunk.matchAll(/<blockquote[\s\S]*?<\/blockquote>/gi)) {
			const length = stripHtmlTags(quote[0]).length;
			if (length > 160) fails.push(`slide ${slideNo}: quote is ${length} chars (~150 max — move it to a content slide)`);
		}
		const kpis = count(chunk, /slide__kpi-val/g);
		if (kpis > 6) fails.push(`slide ${slideNo}: ${kpis} KPI cards (max 6)`);
	});
}

export function checkDeckHtml(doc, { minSlides = 3 } = {}) {
	const fails = [];
	const warns = [];
	checkHtmlCommon(doc, fails);
	if (!doc.includes("checkSlideOverflow")) fails.push("missing checkSlideOverflow delivery check (see deck-html TARGET.md)");
	if (!doc.includes("keydown")) fails.push("missing keyboard navigation (no keydown listener)");
	const slides = count(doc, /class="slide[\s"]/g);
	if (slides < minSlides) fails.push(`expected at least ${minSlides} slides, found ${slides}`);
	if (/localStorage\.setItem/.test(doc) && !/localStorage\.getItem/.test(doc)) {
		fails.push("resume state is written (localStorage.setItem) but never restored (no getItem) — restore hash first, then localStorage");
	}
	if (doc.includes("deck-dot") && !doc.includes("deck-dot-label")) {
		fails.push("dots are not the expandable reader rail (no deck-dot-label) — copy the chrome from the exemplar");
	}
	if (!doc.includes("deck-arrow")) fails.push("no visible prev/next controls (deck-arrow) — copy the chrome from the exemplar");
	checkHtmlDensity(doc, fails);
	if (!/touchstart|pointerdown/.test(doc)) warns.push("no touch navigation (touchstart/pointerdown) — the exemplar's chrome includes swipe support");
	if (/\.innerHTML\s*[+]?=/.test(doc)) warns.push("innerHTML assignment found — the engine builds dynamic content with DOM creation and textContent");
	if (doc.includes("checkSlideOverflow") && !doc.includes("data-slide-check-label")) {
		warns.push("overflow check does not paint data-slide-check-label — failing slides won't be flagged on screen");
	}
	return { fails, warns };
}

function splitSlides(markdown) {
	const frontmatterMatch = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
	const frontmatter = frontmatterMatch ? frontmatterMatch[0] : "";
	const body = markdown.slice(frontmatter.length);
	const rawSegments = body.split(/^---\s*$/m);
	const slides = [];
	for (let i = 0; i < rawSegments.length; i++) {
		const segment = rawSegments[i];
		const isFrontmatterOnly =
			segment.trim().length > 0 &&
			segment.trim().split(/\r?\n/).every((line) => /^[A-Za-z0-9_-]+:.*$/.test(line.trim()) || line.trim() === "" || /^\s+\S/.test(line));
		if (isFrontmatterOnly && i + 1 < rawSegments.length) {
			slides.push(rawSegments[++i]);
		} else if (segment.trim()) {
			slides.push(segment);
		}
	}
	return { frontmatter, slides };
}

function stripFences(markdown) {
	return markdown.replace(/```[\s\S]*?```/g, "").replace(/<!--[\s\S]*?-->/g, "");
}

export function checkSlidev(slidesPath) {
	const fails = [];
	const warns = [];
	const markdown = readFileSync(slidesPath, "utf8");
	const deckDir = dirname(resolve(slidesPath));
	const { frontmatter, slides } = splitSlides(markdown);
	if (!frontmatter) fails.push("slides.md has no frontmatter");

	slides.forEach((slide, index) => {
		if (!/<!--[\s\S]*?-->/.test(slide)) fails.push(`slide ${index + 1} has no presenter note`);
		const slideNo = index + 1;
		const body = stripFences(slide);
		const tableLines = body.split(/\r?\n/).filter((line) => /^\s*\|.*\|\s*$/.test(line)).length;
		if (tableLines > 10) fails.push(`slide ${slideNo}: table has ${tableLines - 2} body rows (max 8 — paginate to the next slide)`);
		const bullets = body.split(/\r?\n/).filter((line) => /^\s*[-*+]\s+\S/.test(line)).length;
		if (bullets > 6) fails.push(`slide ${slideNo}: ${bullets} bullets (max 5–6 — split the slide)`);
		for (const fence of slide.matchAll(/```(\w*)[^\n]*\n([\s\S]*?)```/g)) {
			if (fence[1] === "mermaid") continue;
			const lines = fence[2].replace(/\n$/, "").split("\n").length;
			if (lines > 10) fails.push(`slide ${slideNo}: code block has ${lines} lines (max 10)`);
		}
	});
	const firstNote = slides[0]?.match(/<!--([\s\S]*?)-->/)?.[1] ?? "";
	if (slides.length && !/(\d+|N)\s*(min|seg|sec|s\b)/i.test(firstNote)) {
		fails.push("first slide's note does not state an estimated duration");
	}

	const inlineHexes = [...stripFences(markdown).matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0]);
	if (inlineHexes.length) fails.push(`inline colors in slides.md (style through tokens instead): ${[...new Set(inlineHexes)].join(", ")}`);

	for (const layer of ["global-top.vue", "global-bottom.vue"]) {
		if (existsSync(join(deckDir, layer))) {
			warns.push(`deck-local ${layer} — Slidev stacks global layers, so if the active theme already ships this layer it will render twice`);
		}
	}
	const stylePath = join(deckDir, "style.css");
	if (existsSync(stylePath) && /== visual-explainer:(theme|base)\b/.test(readFileSync(stylePath, "utf8"))) {
		fails.push("style.css carries legacy managed blocks duplicating the theme — migrate (see deck-slidev TARGET.md)");
	}

	return { fails, warns };
}

function parseArgs(argv) {
	const options = {};
	const positional = [];
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === "--kind") options.kind = argv[++i];
		else if (arg === "--min-sections") options.minSections = Number(argv[++i]);
		else if (arg === "--min-slides") options.minSlides = Number(argv[++i]);
		else if (arg === "--expect-table") options.expectTable = true;
		else if (arg === "--expect-mermaid") options.expectMermaid = true;
		else if (arg === "--help" || arg === "-h") options.help = true;
		else if (arg.startsWith("--")) throw new Error(`unknown option: ${arg}`);
		else positional.push(arg);
	}
	if (positional.length !== 1 && !options.help) throw new Error("expected exactly one artifact file");
	options.file = positional[0];
	return options;
}

function main() {
	const options = parseArgs(process.argv.slice(2));
	if (options.help) {
		console.log("Usage: node check_artifact.mjs <file> --kind page|deck-html|slidev [--min-sections N] [--min-slides N] [--expect-table] [--expect-mermaid]");
		return;
	}
	let result;
	if (options.kind === "page") result = checkPage(readFileSync(options.file, "utf8"), options);
	else if (options.kind === "deck-html") result = checkDeckHtml(readFileSync(options.file, "utf8"), options);
	else if (options.kind === "slidev") result = checkSlidev(options.file);
	else throw new Error("--kind must be page, deck-html, or slidev");
	for (const warn of result.warns) console.log(`WARN ${warn}`);
	if (result.fails.length) {
		for (const fail of result.fails) console.error(`FAIL ${fail}`);
		process.exit(1);
	}
	console.log(`OK — ${options.file} passes the ${options.kind} delivery check.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	try {
		main();
	} catch (error) {
		console.error(`check_artifact.mjs: ${error.message}`);
		process.exit(1);
	}
}
