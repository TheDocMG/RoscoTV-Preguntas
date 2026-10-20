# Rosco TV — banco inicial

Versión 1: dos roscos de Clásico, de 25 letras cada uno; 50 preguntas.
No hay roscos todavía para Kids, Pop & Cine, Picante ni Deportes.
Es una selección inicial para probar el juego, sin calibración de dificultad.

## Primera publicación

1. Abrir https://github.com/TheDocMG/RoscoTV-Preguntas
2. Usar Add file → Upload files.
3. Subir los archivos de esta carpeta directamente a la raíz del repositorio
   (no subir el ZIP ni la carpeta contenedora).
4. Guardar el commit en la rama main.
5. Abrir https://raw.githubusercontent.com/TheDocMG/RoscoTV-Preguntas/main/version.json
   y comprobar que muestra schemaVersion, version y file.
6. Reiniciar Rosco TV o usar el botón de actualización en configuración.

No requiere GitHub Pages ni Render. La app consulta la URL Raw configurada.
Si la rama publicada no es main, hay que ajustar VITE_QUESTION_BANK_URL
al nombre real de la rama y reiniciar el acceso de prueba.
La lectura real desde GitHub queda pendiente hasta publicar estos archivos.

## Validación local

Con Node instalado, abrir una terminal en esta carpeta y ejecutar:

    node validar-banco.mjs

No requiere npm install. Si informa ERROR, no publicar hasta corregirlo.
El control verifica estructura y correspondencia de letras, no exactitud editorial.

## Actualizaciones futuras

1. Copiar banco-v1.json a banco-v2.json, editar preguntas y poner version: 2.
2. En version.json poner version: 2 y file: "banco-v2.json".
3. Ejecutar node validar-banco.mjs.
4. Publicar primero banco-v2.json y después version.json, o ambos juntos
   en el mismo commit. No borrar los archivos de versiones anteriores.
5. Las apps que ya descargaron la versión 1 obtendrán la 2 al volver a iniciar
   o pulsar actualizar. No hay que reinstalar la aplicación.

No sobrescribir contenido de una versión publicada conservando el mismo número:
la app evita descargar otra vez una versión que ya tiene.
Cada versión contiene el banco completo; no son parches incrementales.

## Contrato

Manifiesto: schemaVersion, version entero positivo, file (nombre del archivo).
Banco: schemaVersion: 1, version idéntica al manifiesto, packs.
Pack: id único, category, questions.
Pregunta: id único, letter, mode, definition, answers (lista de respuestas válidas).
mode: starts (empieza por) o contains (contiene).

Alfabeto actual: ABCDEFGHIJKLMNOPQRSTUVXYZ, sin Ñ ni W.
Categorías: classic, kids, pop_cine, hot_previa, sports.
Cada rosco contiene exactamente una pregunta por cada letra del alfabeto.
Las mayúsculas y tildes se ignoran al validar correspondencia de respuesta y letra.

Si solo hay un rosco en una categoría ambos equipos pueden recibirlo;
si hay dos o más, la app elige uno diferente para cada equipo.
