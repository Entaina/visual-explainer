# visual-explainer

Agent Skill de Entaina para generar explicaciones visuales: páginas HTML autocontenidas (diagramas, arquitecturas, diff/plan reviews, recaps, tablas comparativas, decks de slides) y decks Slidev como fuente de proyecto — con storyboard como plan intermedio, temas por tokens y verificación mecánica de cada entregable.

La skill es un directorio plano y portable (`skills/visual-explainer/`): markdown + assets + scripts Node sin dependencias, sin APIs de ningún arnés. Este repositorio la envuelve además como plugin de Claude Code, plugin de Codex y paquete de pi.

Es un fork de [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer) — ver [Créditos](#créditos).

## Instalación por arnés

### Claude Code

Vía el marketplace de Entaina:

```
/plugin marketplace add Entaina/claude-marketplace
/plugin install visual-explainer@entaina
```

O directamente desde este repositorio (también es un plugin válido): `/plugin install` con la URL del repo.

### Claude Cowork

Añade la carpeta `skills/visual-explainer/` como skill desde los ajustes de skills de Cowork (subida de carpeta/zip). Nota: el subárbol `eval/` contiene un symlink que algunos empaquetadores zip no conservan — es utillaje de evaluación, la skill funciona igual sin él.

### Codex

Como plugin de Codex, con el propio repositorio haciendo de marketplace:

```
codex plugin marketplace add Entaina/visual-explainer
codex plugin add visual-explainer@entaina
```

`codex plugin list` muestra el estado y `codex plugin remove visual-explainer@entaina` lo desinstala. Mientras el repositorio no esté publicado, `codex plugin marketplace add /ruta/al/clon` hace lo mismo desde local.

Lo declaran el manifiesto portable de la raíz (`plugin.json`, esquema [agent-plugins 1.0.0](https://agent-plugins.org/schemas/1.0.0/plugin.schema.json)) y la entrada de marketplace (`.agents/plugins/marketplace.json`). Codex la expone como la skill `visual-explainer:visual-explainer`.

### pi

Como paquete de pi, directamente desde el repositorio:

```
pi install git:github.com/Entaina/visual-explainer
```

`pi install` escribe en los ajustes de usuario (`~/.pi/agent/settings.json`); con `-l` instala solo en el proyecto (`.pi/settings.json`). También acepta una ruta local (`pi install ./visual-explainer`) para trabajar sobre un clon, y se desinstala con `pi remove <source>`.

El `package.json` de la raíz lleva el manifiesto `pi` que declara la skill, así que pi la carga como `visual-explainer` y la expone como `/skill:visual-explainer [subcomando]` (p. ej. `/skill:visual-explainer diff-review`). Sin instalar el paquete también vale añadir `skills/visual-explainer` al array `skills` de los ajustes, o pasarla en la invocación con `pi --skill skills/visual-explainer`.

### Otros arneses (AGENTS.md)

Copia `skills/visual-explainer/` al repositorio (p. ej. en `skills/`) y añade el disparador a tu `AGENTS.md`:

> Para diagramas, reviews visuales, recaps, tablas comparativas o slides, lee `skills/visual-explainer/SKILL.md` y síguelo.

No requiere más integración: todo se resuelve con lectura de ficheros y shell.

## Requisitos del entorno

- Node.js ≥ 18 (scripts de entrega y verificación; Slidev en los proyectos de decks).
- Navegador para ver las páginas generadas.
- Opcionales: `surf-cli` (imágenes generadas), `glimpseui` (ventana nativa).

## Estructura

- `genres/` — contratos de contenido por tipo de salida (diagram, diff-review, plan-review, recap, visual-plan, deck, fact-check).
- `targets/` — entrega: página HTML, deck HTML, deck Slidev (este último tematizado por el proyecto destino; el look Entaina para Slidev vive en [`slidev-theme-entaina`](https://github.com/Entaina/slidev-theme-entaina)).
- `themes/` — paletas por tokens para páginas y decks HTML, con las variantes de pilar Entaina.
- `references/` — storyboard (representación intermedia), catálogo de tipos de slide, reglas de evidencia y de reviews.
- `scripts/` — `render.mjs` (entrega), `check_artifact.mjs` y `check_themes.mjs` (verificación), con tests (`node --test scripts/`).
- `eval/` — suite de evaluación en formato oficial `claude plugin eval` (early access).
- Manifiestos de instalación: `.claude-plugin/plugin.json` (Claude Code), `plugin.json` + `.agents/plugins/marketplace.json` (Codex) y `package.json` con la clave `pi` (pi).

## Créditos

Trabajo derivado de [**nicobailon/visual-explainer**](https://github.com/nicobailon/visual-explainer), de Nico Bailon: de ahí vienen la idea de la skill, su repertorio de géneros visuales (diagramas, diff/plan reviews, recaps, decks, fact-check) y la base sobre la que se escribió esta versión. Gracias por publicarla con licencia MIT.

Esta versión la reescribe y mantiene Entaina: la reorganiza en torno a los tres ejes género × target × tema, introduce el storyboard como plan intermedio entre contenido y formato, añade los temas por tokens (con las variantes de pilar Entaina) y el target Slidev, y sustituye la verificación por scripts Node sin dependencias más una suite de evaluación. Las diferencias de empaquetado y de instalación por arnés también son propias.

El aviso de copyright original (© 2025 Nico Bailon) se conserva en [`LICENSE`](LICENSE) y en [`skills/visual-explainer/LICENSE`](skills/visual-explainer/LICENSE).

## Licencia

MIT, como el proyecto original.
