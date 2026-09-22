import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkDeckHtml, checkPage, checkSlidev } from "./check_artifact.mjs";

const VALID_SLIDES = `---
title: Demo
mdc: true
---

# Uno

<!--
Duración estimada: 1 min.
Nota de apertura.
-->

---
layout: section
---

# Dos

<!--
Duración estimada: 30 s.
Transición.
-->
`;

function writeDeck(content = VALID_SLIDES) {
	const deckDir = mkdtempSync(join(tmpdir(), "ve-deck-"));
	const slidesPath = join(deckDir, "slides.md");
	writeFileSync(slidesPath, content);
	return { deckDir, slidesPath };
}

const SKILL_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(SKILL_ROOT, path), "utf8");

test("page exemplars pass the page check", () => {
	for (const name of ["architecture.html", "data-table.html", "mermaid-flowchart.html"]) {
		const { fails } = checkPage(read(`targets/page/exemplars/${name}`));
		assert.deepEqual(fails, [], name);
	}
});

test("deck exemplar passes the deck-html check", () => {
	const { fails } = checkDeckHtml(read("targets/deck-html/exemplars/slide-deck.html"));
	assert.deepEqual(fails, []);
});

test("page check catches missing pieces", () => {
	const bare = "<!doctype html><html><body><figure>naked</figure></body></html>";
	const { fails } = checkPage(bare, { expectTable: true });
	assert.ok(fails.some((f) => f.includes("<title>")));
	assert.ok(fails.some((f) => f.includes("figcaption")));
	assert.ok(fails.some((f) => f.includes("<table>")));
	assert.ok(fails.some((f) => f.includes("tokens")));
});

test("page check requires the canonical shell when Mermaid is present", () => {
	const doc = '<!doctype html><html lang="en"><head><title>x</title><meta name="viewport" content="w"><style>:root{--bg:0} a{color:var(--bg)}</style></head><body><pre class="mermaid">graph TD</pre></body></html>';
	const { fails } = checkPage(doc);
	assert.ok(fails.some((f) => f.includes("diagram-shell")));
});

test("a minimal package-theme deck passes the slidev check", () => {
	const { slidesPath } = writeDeck();
	const { fails } = checkSlidev(slidesPath);
	assert.deepEqual(fails, []);
});

test("slidev check warns on deck-local global layers and fails on legacy managed blocks", () => {
	const withChrome = writeDeck();
	writeFileSync(join(withChrome.deckDir, "global-top.vue"), "<template><div/></template>");
	const chromeResult = checkSlidev(withChrome.slidesPath);
	assert.deepEqual(chromeResult.fails, []);
	assert.ok(chromeResult.warns.some((w) => w.includes("render twice")));
	const legacy = writeDeck();
	writeFileSync(join(legacy.deckDir, "style.css"), "/* == visual-explainer:theme entaina == */\n");
	assert.ok(checkSlidev(legacy.slidesPath).fails.some((f) => f.includes("legacy managed blocks")));
	const ownStyles = writeDeck();
	writeFileSync(join(ownStyles.deckDir, "style.css"), ".kpi { color: var(--accent); }\n");
	assert.deepEqual(checkSlidev(ownStyles.slidesPath).fails, []);
});

test("slidev check catches missing notes, duration, and inline colors", () => {
	const broken = VALID_SLIDES
		.replace(/<!--\nDuración estimada: 1 min\.\nNota de apertura\.\n-->/, "<!-- sin duración -->")
		.replace(/<!--\nDuración estimada: 30 s\.\nTransición\.\n-->/, "")
		+ "\n---\n\n# Extra slide\n\n<span style=\"color:#ff0000\">rojo</span>\n";
	const { slidesPath } = writeDeck(broken);
	const { fails } = checkSlidev(slidesPath);
	assert.ok(fails.some((f) => f.includes("estimated duration")));
	assert.ok(fails.some((f) => f.includes("presenter note")));
	assert.ok(fails.some((f) => f.includes("#ff0000")));
});

const VALID_DECK = `<!doctype html><html lang="en"><head><title>d</title><meta name="viewport" content="w"><style>:root{--bg:#fff}a{color:var(--bg)}</style></head><body>
<section class="slide s1"><h2>One</h2></section>
<section class="slide s2"><h2>Two</h2></section>
<section class="slide s3"><h2>Three</h2></section>
<div class="deck-arrows"><button class="deck-arrow">←</button><button class="deck-arrow">→</button></div>
<nav><button class="deck-dot"><span class="deck-dot-label">One</span></button></nav>
<script>function checkSlideOverflow(){/* data-slide-check-label */}document.addEventListener('keydown',function(){});document.addEventListener('touchstart',function(){});<\/script>
</body></html>`;

test("a minimal canonical deck passes the deck-html check", () => {
	assert.deepEqual(checkDeckHtml(VALID_DECK).fails, []);
});

test("deck-html check catches write-only resume, reduced rail, and missing arrows", () => {
	const writeOnly = checkDeckHtml(VALID_DECK.replace("keydown',function(){});", "keydown',function(){});localStorage.setItem('k',1);"));
	assert.ok(writeOnly.fails.some((f) => f.includes("never restored")));
	const noLabel = checkDeckHtml(VALID_DECK.replace(/<span class="deck-dot-label">One<\/span>/, ""));
	assert.ok(noLabel.fails.some((f) => f.includes("expandable reader rail")));
	const noArrows = checkDeckHtml(VALID_DECK.replace(/deck-arrow/g, "nav-btn"));
	assert.ok(noArrows.fails.some((f) => f.includes("prev/next")));
});

test("deck-html check enforces countable density limits", () => {
	const rows = Array.from({ length: 10 }, (_, i) => `<tr><td>${i}</td></tr>`).join("");
	const bigTable = checkDeckHtml(VALID_DECK.replace("<h2>Two</h2>", `<h2>Two</h2><table><thead><tr><th>h</th></tr></thead><tbody>${rows}</tbody></table>`));
	assert.ok(bigTable.fails.some((f) => f.includes("10 body rows")));
	const bullets = Array.from({ length: 7 }, (_, i) => `<li>b${i}</li>`).join("");
	const bigList = checkDeckHtml(VALID_DECK.replace("<h2>Two</h2>", `<h2>Two</h2><ul>${bullets}</ul>`));
	assert.ok(bigList.fails.some((f) => f.includes("7 bullets")));
	const longQuote = checkDeckHtml(VALID_DECK.replace("<h2>Three</h2>", `<blockquote>${"palabra ".repeat(30)}</blockquote>`));
	assert.ok(longQuote.fails.some((f) => f.includes("quote is")));
	const longCode = checkDeckHtml(VALID_DECK.replace("<h2>Three</h2>", `<pre><code>${Array.from({ length: 12 }, (_, i) => `line${i}`).join("\n")}</code></pre>`));
	assert.ok(longCode.fails.some((f) => f.includes("code block has 12 lines")));
});

test("slidev check enforces countable density limits", () => {
	const tableRows = Array.from({ length: 10 }, (_, i) => `| r${i} | x |`).join("\n");
	const bullets = Array.from({ length: 7 }, (_, i) => `- punto ${i}`).join("\n");
	const code = Array.from({ length: 12 }, (_, i) => `line${i}`).join("\n");
	const { slidesPath } = writeDeck(
		VALID_SLIDES + `\n---\n\n# Densa\n\n| a | b |\n|---|---|\n${tableRows}\n\n${bullets}\n\n\`\`\`js\n${code}\n\`\`\`\n\n<!--\n30 s. Nota.\n-->\n`,
	);
	const { fails } = checkSlidev(slidesPath);
	assert.ok(fails.some((f) => f.includes("table has 10 body rows")));
	assert.ok(fails.some((f) => f.includes("7 bullets")));
	assert.ok(fails.some((f) => f.includes("code block has 12 lines")));
});

test("slidev check ignores hex colors inside mermaid fences", () => {
	const { slidesPath } = writeDeck(
		VALID_SLIDES + "\n---\n\n# Diagram\n\n```mermaid {themeVariables: {primaryColor: '#f5f5f5'}}\ngraph TD\n  A --> B\n```\n\n<!--\n30 s. Nota.\n-->\n",
	);
	const { fails } = checkSlidev(slidesPath);
	assert.deepEqual(fails, []);
});
