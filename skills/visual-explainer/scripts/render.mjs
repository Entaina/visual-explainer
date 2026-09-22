#!/usr/bin/env node
// visual-explainer — deliver a self-contained HTML page or HTML deck.
// Validates the input is a complete HTML document, normalizes it (lang,
// viewport, favicon, display-math escaping), writes it to the output
// directory and opens it in a viewer. Zero dependencies.
//
// Usage:
//   node render.mjs <input.html> [--filename <name>] [--out-dir <dir>]
//                   [--viewer browser|glimpse|auto] [--no-open]
//
// Output directory: --out-dir, else $VISUAL_EXPLAINER_OUTPUT_DIR, else ~/.agent/diagrams

import { existsSync, lstatSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { homedir } from "node:os";
import { basename, isAbsolute, join, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

function expandHome(path, home = homedir()) {
	return path === "~" || path.startsWith(`~${sep}`) ? resolve(home, path.slice(2)) : path;
}

export function outputDirectory(environment = process.env, override) {
	const configured = override ?? environment.VISUAL_EXPLAINER_OUTPUT_DIR;
	if (configured && configured.trim()) {
		const expanded = expandHome(configured.trim());
		if (!isAbsolute(expanded)) throw new Error("output directory must be an absolute path");
		return resolve(expanded);
	}
	return join(homedir(), ".agent", "diagrams");
}

export function outputFilename(input) {
	const raw = input.trim().replace(/^@/, "");
	if (!raw) throw new Error("filename is required");
	if (raw.includes("/") || raw.includes("\\")) throw new Error("filename must be a basename, not a path");
	if (raw.includes("..")) throw new Error("filename must not contain '..'");
	if (/[\0-\x1f\x7f]/.test(raw)) throw new Error("filename must not contain control characters");
	return /\.html?$/i.test(raw) ? raw : `${raw}.html`;
}

export function assertHtmlDocument(html) {
	const trimmed = html.trim();
	if (!trimmed) throw new Error("html is required");
	const start = trimmed.replace(/^\s*<!doctype\s+html\b[^>]*>\s*/i, "").replace(/^(?:<!--[\s\S]*?-->\s*)+/, "");
	if (!/^<html[\s>]/i.test(start) || !/<\/html>\s*$/i.test(trimmed)) {
		throw new Error("input must be a complete HTML document starting with <!doctype html> or <html> and ending with </html>");
	}
}

const standardFavicon =
	'<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 64 64\'%3E%3Crect width=\'64\' height=\'64\' rx=\'14\' fill=\'%230f172a\'/%3E%3Cpath d=\'M18 40V24l14-8 14 8v16l-14 8-14-8Z\' fill=\'none\' stroke=\'%23fbbf24\' stroke-width=\'4\' stroke-linejoin=\'round\'/%3E%3Ccircle cx=\'32\' cy=\'32\' r=\'5\' fill=\'%2338bdf8\'/%3E%3C/svg%3E">';

function escapeDisplayMath(html) {
	return html.replace(/\$\$([\s\S]*?)\$\$/g, (_match, math) => `$$${math.replace(/</g, "&lt;").replace(/>/g, "&gt;")}$$`);
}

function ensureFavicon(html) {
	if (/<link\b[^>]*\brel=["'][^"']*(?:icon|shortcut icon)[^"']*["'][^>]*>/i.test(html)) return html;
	if (/<\/title>/i.test(html)) return html.replace(/<\/title>/i, `</title>\n${standardFavicon}`);
	if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, (head) => `${head}\n${standardFavicon}`);
	return html.replace(/<html[^>]*>/i, (htmlTag) => `${htmlTag}\n<head>\n${standardFavicon}\n</head>`);
}

function ensureDocumentMetadata(html) {
	let output = html;
	if (!/<html\b[^>]*\blang\s*=/i.test(output)) output = output.replace(/<html\b/i, '<html lang="en"');
	if (!/<head[^>]*>/i.test(output)) output = output.replace(/<html[^>]*>/i, (htmlTag) => `${htmlTag}\n<head></head>`);
	if (!/<meta\b[^>]*\bname\s*=\s*["']viewport["'][^>]*>/i.test(output)) {
		output = output.replace(/<head[^>]*>/i, (head) => `${head}\n<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
	}
	return output;
}

export function prepareRenderedHtml(html) {
	return ensureDocumentMetadata(ensureFavicon(escapeDisplayMath(html)));
}

function runOpener(command, args, target) {
	return new Promise((resolvePromise) => {
		let child;
		try {
			child = spawn(command, args, { detached: true, stdio: "ignore", windowsHide: true });
		} catch (error) {
			resolvePromise({ status: "failed", target, error: error.message });
			return;
		}
		let settled = false;
		const settle = (result) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			resolvePromise(result);
		};
		child.once("error", (error) => settle({ status: "failed", target, error: error.message }));
		child.once("exit", (code, signal) => {
			if (code !== 0) settle({ status: "failed", target, error: code === null ? `opener exited with signal ${signal ?? "unknown"}` : `opener exited with code ${code}` });
		});
		const timer = setTimeout(() => settle({ status: "dispatched", target }), 250);
		child.unref();
	});
}

async function openInBrowser(path) {
	if (process.platform === "darwin") return runOpener("open", [path], "browser");
	if (process.platform === "linux") return runOpener("xdg-open", [path], "browser");
	if (process.platform === "win32") return runOpener("cmd", ["/c", "start", "", path], "browser");
	return { status: "unsupported", target: "browser" };
}

async function openInGlimpse(path) {
	return runOpener("glimpseui", ["--width", "1200", "--height", "900", "--title", "Visual Explainer", "--open-links", path], "glimpse");
}

export async function openRenderedPage(path, viewer) {
	if (viewer === "browser") return openInBrowser(path);
	if (viewer === "glimpse") return openInGlimpse(path);
	const glimpse = await openInGlimpse(path);
	if (glimpse.status !== "failed") return glimpse;
	const browser = await openInBrowser(path);
	return { ...browser, fallbackFrom: "glimpse", fallbackError: glimpse.error ?? "glimpseui failed" };
}

export async function render({ input, filename, outDir, viewer = "browser", open = true }) {
	const html = readFileSync(input, "utf8");
	assertHtmlDocument(html);
	const prepared = prepareRenderedHtml(html);
	const dir = outputDirectory(process.env, outDir);
	const name = outputFilename(filename ?? basename(input));
	const outputPath = join(dir, name);
	if (existsSync(dir) && lstatSync(dir).isSymbolicLink()) throw new Error(`${dir} must not be a symlink`);
	mkdirSync(dir, { recursive: true });
	if (existsSync(outputPath) && lstatSync(outputPath).isSymbolicLink()) throw new Error(`${outputPath} must not be a symlink`);
	writeFileSync(outputPath, prepared, "utf8");
	const openResult = open ? await openRenderedPage(outputPath, viewer) : { status: "disabled" };
	return { path: outputPath, open: openResult };
}

function parseArgs(argv) {
	const options = { viewer: "browser", open: true };
	const positional = [];
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === "--filename") options.filename = argv[++i];
		else if (arg === "--out-dir") options.outDir = argv[++i];
		else if (arg === "--viewer") options.viewer = argv[++i];
		else if (arg === "--no-open") options.open = false;
		else if (arg === "--help" || arg === "-h") options.help = true;
		else if (arg.startsWith("--")) throw new Error(`unknown option: ${arg}`);
		else positional.push(arg);
	}
	if (positional.length > 1) throw new Error("expected exactly one input file");
	options.input = positional[0];
	return options;
}

async function main() {
	const options = parseArgs(process.argv.slice(2));
	if (options.help || !options.input) {
		console.log("Usage: node render.mjs <input.html> [--filename <name>] [--out-dir <dir>] [--viewer browser|glimpse|auto] [--no-open]");
		process.exit(options.help ? 0 : 1);
	}
	if (!["browser", "glimpse", "auto"].includes(options.viewer)) throw new Error("viewer must be browser, glimpse, or auto");
	const result = await render(options);
	let message = `Wrote ${result.path}.`;
	if (result.open.status === "dispatched") message += ` ${result.open.target === "glimpse" ? "Glimpse" : "Browser"} open requested.`;
	else if (result.open.status === "failed") message += ` ${result.open.target} open failed: ${result.open.error}.`;
	else if (result.open.status === "unsupported") message += " Opening is unsupported on this platform.";
	if (result.open.fallbackFrom) message += ` Glimpse fallback reason: ${result.open.fallbackError}.`;
	console.log(message);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main().catch((error) => {
		console.error(`render.mjs: ${error.message}`);
		process.exit(1);
	});
}
