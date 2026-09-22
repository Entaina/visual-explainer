---
name: table-trigger
description: Edge — an implicit trigger. A 4×4 comparison must become an HTML table page with only a short chat summary, no ASCII table
tags: [edge, activation]
runs: 2
max_turns: 25
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: "Al entregar páginas HTML generadas con visual-explainer en esta sesión, pasa siempre --out-dir ./out --no-open --filename comparativa al script render.mjs."
expected_outcome: The 4-row comparison renders as a semantic HTML table page at out/comparativa.html; the chat reply is a short summary, not a terminal/markdown table.
---
Compárame SQLite, PostgreSQL, MySQL y DuckDB en cuatro dimensiones: licencia, modelo de concurrencia, sistema de tipos y caso de uso ideal.
