import { DO_ACTIVITIES, getDoActivity, getRecallSet } from '../src/data/learningLoop.js'
import { CURRICULUM } from '../src/data/curriculum.js'

const l3 = CURRICULUM.L3.topics
for (const t of l3) {
  const d = getDoActivity(t)
  const r = getRecallSet(t)
  if (!DO_ACTIVITIES[t.id]) throw new Error(`no DO_ACTIVITIES ${t.id}`)
  if (d.type === 'guided') throw new Error(`${t.id} still defaultGuided`)
  if (r.todo) throw new Error(`recall todo ${t.id}`)
  if (r.questions.length < 5) throw new Error(`recall short ${t.id}: ${r.questions.length}`)
  if (r.passAt !== 4) throw new Error(`passAt ${t.id}: ${r.passAt}`)
  const rounds = d.rounds?.length || d.statements?.length || 0
  if (rounds < 5) throw new Error(`do rounds ${t.id}: ${rounds}`)
  console.log(t.id, d.type, `do=${rounds}`, `recall=${r.questions.length}`, t.game ? `play=${t.game}` : 'play=—')
}
console.log('L3 verify ok')
