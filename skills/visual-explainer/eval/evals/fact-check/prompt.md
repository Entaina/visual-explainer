---
name: fact-check
description: Edge — the verifier genre. Corrects a generated report's false claims (function name, expiry) in place, with a verification summary
tags: [edge, fact-check]
runs: 2
max_turns: 25
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: out/report.html corrected in place (verifyToken, 60 minutes), structure preserved, plus a verification summary classifying the checked claims.
---
Haz un fact-check del documento out/report.html contra el código real de este repositorio y corrígelo donde no diga la verdad.
