import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertHtmlDocument, outputFilename, prepareRenderedHtml, render } from "./render.mjs";

const DOC = "<!doctype html><html><head><title>T</title></head><body>hi $$a < b$$</body></html>";

test("outputFilename appends .html and rejects unsafe names", () => {
	assert.equal(outputFilename("report"), "report.html");
	assert.equal(outputFilename("report.html"), "report.html");
	assert.throws(() => outputFilename("a/b"));
	assert.throws(() => outputFilename("..secret"));
	assert.throws(() => outputFilename(""));
});

test("assertHtmlDocument accepts complete documents only", () => {
	assert.doesNotThrow(() => assertHtmlDocument(DOC));
	assert.doesNotThrow(() => assertHtmlDocument("<html><body>x</body></html>"));
	assert.throws(() => assertHtmlDocument("<div>fragment</div>"));
	assert.throws(() => assertHtmlDocument(""));
});

test("prepareRenderedHtml normalizes lang, viewport, favicon, math", () => {
	const prepared = prepareRenderedHtml(DOC);
	assert.match(prepared, /<html lang="en"/);
	assert.match(prepared, /name="viewport"/);
	assert.match(prepared, /rel="icon"/);
	assert.match(prepared, /\$\$a &lt; b\$\$/);
});

test("prepareRenderedHtml keeps an existing favicon", () => {
	const doc = '<html><head><link rel="icon" href="x.png"></head><body></body></html>';
	const prepared = prepareRenderedHtml(doc);
	assert.equal(prepared.match(/rel="icon"/g)?.length, 1);
});

test("render writes a normalized document without opening", async () => {
	const dir = mkdtempSync(join(tmpdir(), "ve-render-"));
	const input = join(dir, "in.html");
	writeFileSync(input, DOC);
	const result = await render({ input, filename: "out", outDir: dir, open: false });
	assert.equal(result.path, join(dir, "out.html"));
	assert.equal(result.open.status, "disabled");
	assert.match(readFileSync(result.path, "utf8"), /<html lang="en"/);
});

test("render rejects fragments", async () => {
	const dir = mkdtempSync(join(tmpdir(), "ve-render-"));
	const input = join(dir, "in.html");
	writeFileSync(input, "<p>nope</p>");
	await assert.rejects(() => render({ input, outDir: dir, open: false }));
});
