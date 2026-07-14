# Lessons

## Instrucción Para La IA

Este archivo guarda lecciones operativas del proyecto para evitar repetir errores y para mantener presentes las recomendaciones del usuario durante futuras tareas.

La IA debe revisarlo antes de ejecutar trabajo importante y actualizarlo cuando el usuario marque un comportamiento como incorrecto, mejorable o deseable.

## Qué Debe Guardarse Aquí

1. errores de la IA que el usuario indique como tales
2. comportamientos que no deben repetirse
3. preferencias explícitas del usuario
4. recomendaciones prácticas para futuras sesiones
5. aclaraciones sobre cómo interpretar instrucciones del proyecto

## Regla De Uso

Solo deben registrarse lecciones confirmadas por el usuario o aprendidas con claridad durante el trabajo en este proyecto.

No deben agregarse opiniones vagas ni reglas inventadas.

## Lecciones Actuales

### Documentos internos para la IA

- lección: los archivos dentro de .local son instrucciones internas para la IA, no documentación pública del paquete.
- implicación: la IA debe tratarlos como notas de operación y referencia antes de actuar.

### AGENTS.md local

- lección: AGENTS.md en la raíz debe funcionar como instrucción local para la IA, pero no debe subirse al repositorio.
- implicación: la IA debe mantener AGENTS.md fuera de Git y no asumir que es un archivo destinado a versionarse.

### Honestidad sobre el estado de implementación

- lección: no afirmar que un cambio quedó escrito si no fue persistido realmente en el workspace.
- implicación: la IA debe reportar con precisión lo que sí quedó aplicado y lo que sigue pendiente.

### Pendientes explícitos

- lección: las tareas futuras deben quedar en todo.md solo si el usuario dijo explícitamente que quedan pendientes.
- implicación: la IA no debe promover ideas implícitas a backlog sin confirmación.

### Todos los paquetes dentro de `Packages/` deben usar bun como package manager (decisión 2026-07-13)

- situación: el usuario decidió (2026-07-13) que **este proyecto y todos los demás proyectos dentro de la carpeta padre `Packages/`** deben usar **bun** como package manager.
- regla a mantener en adelante:
  1. **Lockfile canónico:** `bun.lock` (texto, git-friendly, default desde bun 1.2). **NO** commitear `bun.lockb` (binario legacy de bun ≤ 1.1), `package-lock.json` (npm), `yarn.lock` (yarn) ni `pnpm-lock.yaml` (pnpm).
  2. **Comando de install:** `bun install` (no `npm install`/`yarn`/`pnpm i`).
  3. **`.gitignore`:** ignorar `bun.lockb` (legacy binario) y `node_modules/`. **NO** ignorar `bun.lock` (texto) — ese SÍ se commitea. Tampoco ignorar `AGENTS.md` ni `.agents/`.
  4. **`.npmignore`:** excluir TODOS los lockfiles Y `AGENTS.md` Y `.agents/` para que el tarball publicado no incluya ninguno de estos.
  5. **Scripts:** pueden invocarse con `bun run X` o `npm run X` — ambos funcionan. Para ser explícito sobre la toolchain, usar `bun run`.
  6. **Publish:** `bun publish` o `npm publish` — ambos producen el mismo tarball. La elección es del usuario; el `prepublishOnly` se ejecuta igual.
  7. **Conversión limpia:** al convertir un paquete, borrar el lockfile viejo **del working tree y del commit de conversión** — no dejarlo como untracked.

### `AGENTS.md` y `.agents/` se versionan; `.local/` está deprecado (decisión 2026-07-13)

- situación: la convención anterior (todo en `.local/`, fuera de git, incluyendo `AGENTS.md`) fue reemplazada el 2026-07-13. La nueva convención es: `AGENTS.md` y `.agents/` se commitean (versionados) pero se excluyen del tarball npm. `.local/` ya no se usa.
- regla a mantener en adelante:
  1. `.local/` no debe existir en este paquete. Si vuelve a aparecer, hay que moverlo a `.agents/`.
  2. `AGENTS.md` es la puerta de entrada a las instrucciones para la IA; debe ser corto y enlazar a `.agents/agent-index.md`.
  3. `.agents/` contiene los documentos internos detallados (`agent-index.md`, `lessons.md`, `deploy-and-release-guide.md`, etc.). Todos versionados.
  4. `.gitignore` debe ignorar `node_modules/`, `bun.lockb`, `dist/`, etc. — pero **NO** `AGENTS.md` ni `.agents/`.
  5. `.npmignore` debe incluir `AGENTS.md` y `.agents/` para que no entren al tarball.

## Cómo Añadir Nuevas Lecciones

Usar bloques simples con:

- situación
- error o preferencia detectada
- regla a mantener en adelante
