import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const filled = value => typeof value === 'string' && value.trim().length > 0;
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8'));
  assert(manifest.schemaVersion === 1 && Number.isSafeInteger(manifest.version) && manifest.version > 0, 'Manifiesto inválido');
  assert(filled(manifest.file) && path.basename(manifest.file) === manifest.file, 'file debe ser un nombre de archivo en esta carpeta');
  const bank = JSON.parse(fs.readFileSync(path.join(root, manifest.file), 'utf8'));
  assert(bank.schemaVersion === 1 && bank.version === manifest.version, 'Las versiones no coinciden');
  assert(Array.isArray(bank.packs) && bank.packs.length > 0, 'Banco sin packs');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVXYZ';
  const categories = ['classic', 'kids', 'pop_cine', 'hot_previa', 'sports'];
  const packs = new Set(), questions = new Set();
  for (const pack of bank.packs) {
    assert(pack && filled(pack.id) && !packs.has(pack.id), 'ID de pack inválido o repetido'); packs.add(pack.id);
    assert(categories.includes(pack.category), `Categoría inválida en ${pack.id}`);
    assert(Array.isArray(pack.questions) && pack.questions.length === alphabet.length, `Rosco incompleto: ${pack.id}`);
    const letters = new Set();
    for (const q of pack.questions) {
      assert(q && filled(q.id) && !questions.has(q.id), 'ID de pregunta inválido o repetido'); questions.add(q.id);
      assert(filled(q.letter) && q.letter.length === 1 && alphabet.includes(q.letter) && !letters.has(q.letter), `Letra inválida en ${q.id}`); letters.add(q.letter);
      assert(['starts','contains'].includes(q.mode) && filled(q.definition), `Definición o modo inválido: ${q.id}`);
      assert(Array.isArray(q.answers) && q.answers.length && q.answers.every(filled), `Sin respuestas: ${q.id}`);
      for (const answer of q.answers) {
        const a = answer.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
        assert(q.mode === 'starts' ? a.startsWith(q.letter) : a.includes(q.letter), `Respuesta incompatible con letra: ${q.id}`);
      }
    }
  }
  console.log(`OK — versión ${bank.version}, ${packs.size} roscos y ${questions.size} preguntas.`);
} catch (error) { console.error('ERROR:', error.message); process.exitCode = 1; }
