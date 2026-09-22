---
name: diagram-page
description: Core page genre — a mechanism explained visually, delivered via render.mjs and self-checked with check_artifact.mjs
tags: [core, page]
runs: 2
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: "Al entregar páginas HTML generadas con visual-explainer en esta sesión, pasa siempre --out-dir ./out --no-open --filename diagrama al script render.mjs."
expected_outcome: A themed, self-contained HTML page at out/diagrama.html with a Mermaid diagram of the request path (labeled arrows, cache hit/miss), delivered through scripts/render.mjs and validated with scripts/check_artifact.mjs.
---
No termino de entender cómo fluye una petición HTTP en nuestra plataforma: hay una CDN delante, luego un API gateway que aplica rate limiting, después el servicio, y una caché Redis que se consulta antes de tocar la base de datos. ¿Me lo puedes explicar visualmente?
