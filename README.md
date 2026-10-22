# Rosco TV — Preguntas

Banco externo de Rosco TV. Esta edición contiene **2700 preguntas del modo Clásico**: 200 con access=free y 2500 con access=premium. Cada letra suma 108: 8 del banco gratuito anterior más 100 nuevas, repartidas en 25 fáciles, 50 medias y 25 difíciles. Se usan 25 letras: ABCDEFGHIJKLMNOPQRSTUVXYZ.

## Estado actual: pruebas completas

La Entrega 18 de la app permite jugar con **todas las preguntas activas**, independientemente de access. Las etiquetas se conservan para la monetización futura. Este repositorio es público y, por decisión del proyecto para esta etapa, sirve también el contenido premium sin exigir compras.

El catálogo de esta versión corresponde al Clásico. Kids y los Especiales se habilitarán en la app cuando este banco incluya suficientes preguntas de sus respectivas categorías; la app ya admite categorías con preguntas premium durante las pruebas.

## Archivos que lee la app

- version.json: manifiesto que anuncia la versión y el archivo del banco.
- banco-clasico-v3.json: catálogo de esquema 2, versión 3, con las 2700 preguntas.

El campo file del manifiesto debe coincidir exactamente con el nombre del catálogo. Subir ambos a la raíz de la rama main en el mismo commit. No renombrarlos ni subir la carpeta que los contiene.

Dirección configurada en la app:
https://raw.githubusercontent.com/TheDocMG/RoscoTV-Preguntas/main/version.json

Archivo anunciado:
https://raw.githubusercontent.com/TheDocMG/RoscoTV-Preguntas/main/banco-clasico-v3.json

Al iniciar, la app consulta el manifiesto, descarga el catálogo si es nuevo y conserva una copia válida en caché. También permite actualizar manualmente desde configuración. La primera descarga requiere Internet; TV y celulares deben compartir la red local para jugar.

## Validación y edición

Con Node instalado, ejecutar: node validar-banco.mjs

El control valida las cantidades de esta edición, esquema, versiones, IDs, categorías, modalidades, dificultades y respuestas compatibles con las letras. Para ampliar a otras categorías o aumentar cantidades hay que actualizar esos cupos del validador; no es un límite de la app.

Para corregir una pregunta: conservar id y variantGroup, editar la pista o alternativas e incrementar revision. Para publicar contenido nuevo: incrementar también version tanto en el banco como en version.json y subirlos juntos. No borrar el historial de la app al actualizar preguntas.

REVISION-PREGUNTAS.csv permite revisar el catálogo en una planilla. La dificultad es inicial; las pruebas técnicas no sustituyen la revisión editorial de todas las pistas. Las fuentes están identificadas en los documentos incluidos y en los registros que contienen source.
