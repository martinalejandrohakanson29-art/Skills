# Skills Revolución Motos

Skills para Claude Code (y otras IAs) de Revolución Motos.

| Skill | Qué hace |
|---|---|
| [`imagenes-ml`](skills/imagenes-ml/SKILL.md) | Asistente para las imágenes de MercadoLibre tomando como modelo una publicación de la competencia: pide los datos, reescribe los textos, arma un prompt por imagen para ChatGPT/Gemini (con nuestras fotos como referencia) y revisa el resultado. |

## Instalar en una PC (Claude Code)

```bash
git clone <url-de-este-repo> skills-revolucion
```

Después, enlazar cada skill en `~/.claude/skills/` para que Claude Code la encuentre:

- **Windows** (cmd): `mklink /J "%USERPROFILE%\.claude\skills\imagenes-ml" "<ruta>\skills-revolucion\skills\imagenes-ml"`
- **Mac/Linux**: `ln -s "<ruta>/skills-revolucion/skills/imagenes-ml" ~/.claude/skills/imagenes-ml`

Sólo para el plan B (pegar la foto real con scripts, requiere Node 18+): `cd skills/imagenes-ml/plan-b && npm install`.

Para actualizar: `git pull` en la carpeta del repo.

## Usar con otras IAs (ChatGPT, Gemini, claude.ai)

Seguir [`skills/imagenes-ml/instrucciones-gpt.md`](skills/imagenes-ml/instrucciones-gpt.md): instrucciones para pegar en un GPT
personalizado de ChatGPT (recomendado: pide los datos y genera las imágenes en el mismo lugar) o en un Gem de Gemini.
