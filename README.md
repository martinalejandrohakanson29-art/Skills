# Skills Revolución Motos

Skills para Claude Code (y otras IAs) de Revolución Motos.

| Skill | Qué hace |
|---|---|
| [`imagenes-ml`](skills/imagenes-ml/SKILL.md) | Arma el set de imágenes para publicaciones de MercadoLibre: ficha de textos, prompts para ChatGPT/Gemini y composición final con el producto real y el logo. |

## Instalar en una PC (Claude Code)

```bash
git clone <url-de-este-repo> skills-revolucion
```

Después, enlazar cada skill en `~/.claude/skills/` para que Claude Code la encuentre:

- **Windows** (cmd): `mklink /J "%USERPROFILE%\.claude\skills\imagenes-ml" "<ruta>\skills-revolucion\skills\imagenes-ml"`
- **Mac/Linux**: `ln -s "<ruta>/skills-revolucion/skills/imagenes-ml" ~/.claude/skills/imagenes-ml`

Y una sola vez, para los scripts de imágenes (requiere Node 18+):

```bash
cd skills-revolucion/skills/imagenes-ml && npm install
```

Para actualizar: `git pull` en la carpeta del repo.

## Usar con otras IAs (ChatGPT, Gemini, claude.ai)

Subir `SKILL.md`, `estilo.md`, `prompts.md` y `reglas.md` de la skill como archivos de referencia.
Los scripts (`recortar.mjs`, `armar.mjs`) necesitan Node: sin eso, el producto recortado y el logo se pegan a mano
(Canva, Photopea) en los huecos que indica `estilo.md`.
