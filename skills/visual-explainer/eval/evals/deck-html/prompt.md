---
name: deck-html
description: Core deck-html target — lifecycle decides HTML over Slidev; storyboard, varied compositions, self-checked
tags: [core, deck]
runs: 2
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: "Al entregar páginas o decks HTML generados con visual-explainer en esta sesión, pasa siempre --out-dir ./out --no-open --filename deck al script render.mjs."
expected_outcome: A self-contained HTML deck at out/deck.html (one-shot lifecycle → deck-html target, not Slidev), built from a shared storyboard, passing check_artifact.mjs --kind deck-html.
---
Prepárame una presentación breve para enviar por email a otro equipo — un único fichero HTML autocontenido, nadie la va a mantener después. Tema: por qué importan los índices compuestos en PostgreSQL — el orden de las columnas, la regla del prefijo, y cuándo un índice no ayuda. Unas seis u ocho diapositivas.
