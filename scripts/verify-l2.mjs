import { DO_ACTIVITIES, RECALL_BANK, getDoActivity, getRecallSet } from '../src/data/learningLoop.js'
import { CURRICULUM } from '../src/data/curriculum.js'

const t21 = new Function('input', `const a=input.trim().split(/\\s+/).map(Number);return String((a[0]||0)+(a[1]||0));`)
const t22 = new Function('input', `const [a,b]=input.trim().split(/\\s+/).map(Number);return \`\${b} \${a}\`;`)
const t23 = new Function('input', `const k=1/Math.sqrt(2);const a=k,b=k;const p0=(a*a).toFixed(2),p1=(b*b).toFixed(2);return \`P0=\${p0} P1=\${p1}\`;`)

for (const [inp, exp] of [
  ['2 3', '5'],
  ['10\n20', '30'],
  ['0 0', '0'],
  ['-5 8', '3']
]) {
  if (t21(inp) !== exp) throw new Error(`t21 ${JSON.stringify(inp)} got ${t21(inp)}`)
}
for (const [inp, exp] of [
  ['1 0', '0 1'],
  ['0 1', '1 0'],
  ['3 5', '5 3']
]) {
  if (t22(inp) !== exp) throw new Error(`t22 ${JSON.stringify(inp)} got ${t22(inp)}`)
}
if (t23('') !== 'P0=0.50 P1=0.50') throw new Error('t23')

const l2 = CURRICULUM.L2.topics
for (const t of l2) {
  const d = getDoActivity(t)
  const r = getRecallSet(t)
  if (!DO_ACTIVITIES[t.id]) throw new Error(`no DO_ACTIVITIES ${t.id}`)
  if (d.type === 'guided') throw new Error(`${t.id} still defaultGuided`)
  if (r.todo) throw new Error(`recall todo ${t.id}`)
  if (r.questions.length < 5) throw new Error(`recall short ${t.id}: ${r.questions.length}`)
  if (r.passAt !== 4) throw new Error(`passAt ${t.id}: ${r.passAt}`)
  const rounds = d.rounds?.length || d.statements?.length || 0
  if (rounds < 5) throw new Error(`do rounds ${t.id}: ${rounds}`)
  console.log(t.id, d.type, `do=${rounds}`, `recall=${r.questions.length}`)
}
console.log('L2 verify ok')
