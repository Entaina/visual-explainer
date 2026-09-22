---
name: slidev-deck
description: Core Slidev target — project-source deck, storyboard first, presenter notes, self-checked
tags: [core, slidev]
runs: 2
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: A Slidev project-source deck (no copied theme styles or local global layers), slides.md with ~6 slides, presenter notes with durations, written after sharing a storyboard, and validated with check_artifact.mjs --kind slidev.
---
Monta en este proyecto un deck de Slidev de unas seis diapositivas que explique los tres estados de un fichero en Git (working directory, staging area y repositorio) a desarrolladores junior. Déjalo listo para previsualizar con `npm run slides:dev`.
