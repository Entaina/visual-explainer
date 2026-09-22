---
name: no-activation
description: Negative near-miss — a plain code-editing request must not trigger the skill
tags: [negative, activation]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: The assistant answers with corrected code directly; the visual-explainer skill is never invoked.
---
Añade manejo de errores a esta función y devuélveme el código corregido:

```js
function parseConfig(raw) {
  const config = JSON.parse(raw);
  return { port: config.port, host: config.host.toLowerCase() };
}
```
