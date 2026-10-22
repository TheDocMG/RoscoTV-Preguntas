import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const letters='ABCDEFGHIJKLMNOPQRSTUVXYZ';
const normal=s=>s.toUpperCase().replaceAll('Ñ','§').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('§','Ñ').trim();
const assert=(ok,message)=>{if(!ok)throw new Error(message)};
const text=x=>typeof x==='string'&&x.trim().length>0;
try{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'version.json'),'utf8'));
 assert(manifest.schemaVersion===2&&Number.isSafeInteger(manifest.version)&&manifest.version>=3,'Manifiesto inválido.');
 assert(text(manifest.file)&&path.basename(manifest.file)===manifest.file,'Nombre de archivo inválido.');
 const bank=JSON.parse(fs.readFileSync(path.join(root,manifest.file),'utf8'));
 assert(bank.schemaVersion===manifest.schemaVersion&&bank.version===manifest.version,'Las versiones del banco y del manifiesto no coinciden.');
 assert(bank.schemaVersion===2&&Number.isSafeInteger(bank.version)&&bank.version>=3,'Esquema o versión inválidos.');
 assert(Array.isArray(bank.questions)&&bank.questions.length===2700,'El catálogo debe tener 2700 preguntas.');
 const ids=new Set(),answers=new Map(),clues=new Set();
 for(const q of bank.questions){
  assert(text(q.id)&&!ids.has(q.id),'ID vacío o duplicado.');ids.add(q.id);
  assert(q.category==='classic'&&q.active===true&&Number.isSafeInteger(q.revision)&&q.revision>0,`Metadatos inválidos: ${q.id}`);
  assert(text(q.letter)&&q.letter.length===1&&letters.includes(q.letter),`Letra inválida: ${q.id}`);
  assert(['starts','contains'].includes(q.mode)&&['easy','medium','hard'].includes(q.difficulty)&&['free','premium'].includes(q.access),`Clasificación inválida: ${q.id}`);
  assert(text(q.variantGroup)&&text(q.definition)&&q.definition.length<=180,`Pista o grupo inválido: ${q.id}`);
  assert(Array.isArray(q.answers)&&q.answers.length&&q.answers.every(text),`Sin respuesta: ${q.id}`);
  for(const answer of q.answers){
   const a=normal(answer);
   assert(a.includes(q.letter)&&(q.mode==='starts')===a.startsWith(q.letter),`Respuesta incompatible con letra o modalidad: ${q.id}`);
   assert(!answers.has(a)||answers.get(a)===q.id,`Respuesta compartida por dos preguntas: ${answer}`);answers.set(a,q.id);
  }
  const clue=normal(q.definition);assert(!clues.has(clue),`Pista exactamente duplicada: ${q.id}`);clues.add(clue);
 }
 for(const letter of letters){
  for(const[access,total,levels]of [['free',8,[2,4,2]],['premium',100,[25,50,25]]]){
   const rows=bank.questions.filter(q=>q.letter===letter&&q.access===access);
   assert(rows.length===total,`${letter}: deben ser ${total} preguntas ${access}`);
   for(const [index,difficulty]of ['easy','medium','hard'].entries())assert(rows.filter(q=>q.difficulty===difficulty).length===levels[index],`${letter}: cupo de ${difficulty} incorrecto en ${access}`);
   if(access==='free')for(const mode of ['starts','contains']){
    const block=rows.filter(q=>q.mode===mode);assert(block.length===4,`${letter}: deben conservarse cuatro gratuitas ${mode}`);
    for(const [index,difficulty]of ['easy','medium','hard'].entries())assert(block.filter(q=>q.difficulty===difficulty).length===[1,2,1][index],`${letter}: bloque gratuito alterado`);
   }
  }
 }
 console.log('OK: 2700 de Clásico = 200 gratuitas + 2500 premium.');
 console.log('Cada letra: 8 gratuitas + 100 nuevas (25 fáciles / 50 medias / 25 difíciles).');
 console.log('IDs, respuestas, modalidades, grupos, revisiones y cantidades válidos.');
 console.log('Este control verifica estructura y duplicados exactos; la revisión editorial continúa por separado.');
}catch(error){console.error('ERROR:',error.message);process.exitCode=1;}
