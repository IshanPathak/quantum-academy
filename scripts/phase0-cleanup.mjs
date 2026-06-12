import fs from 'fs'

const files = ['src/data/curriculum.js', 'src/data/l8Tracks.js']
const iconMap = {
  '🌍': 'globe',
  '📐': 'math',
  '🐍': 'code',
  '⚛️': 'atom',
  '🔁': 'circuit',
  '🔑': 'key',
  '⚔️': 'threat',
  '🛡️': 'shield',
  '🎓': 'graduate',
  '🚀': 'capstone'
}

for (const p of files) {
  let s = fs.readFileSync(p, 'utf8')
  for (const [emoji, key] of Object.entries(iconMap)) {
    s = s.replaceAll(`icon:'${emoji}'`, `icon:'${key}'`)
  }
  s = s.replaceAll('  -  ', ', ')
  s = s.replaceAll("trackLabel:'🔐 Post-Quantum Cryptography Track'", "trackLabel:'Post-Quantum Cryptography Track'")
  s = s.replaceAll("trackLabel:'⚔️ Quantum Cryptanalysis Track'", "trackLabel:'Quantum Cryptanalysis Track'")
  fs.writeFileSync(p, s)
  console.log('Updated', p)
}
