import React, { useState, useRef, useEffect } from 'react'

const k = 1 / Math.sqrt(2)

/* ---- Vector Plotter ---- */
function VectorGame() {
  const canvasRef = useRef(null)
  const [vec, setVec] = useState(null)

  const draw = (vx, vy) => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, 280, 280)
    ctx.strokeStyle = '#1c1c3a'; ctx.lineWidth = 1
    for (let i = 0; i <= 280; i += 28) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 280); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(280, i); ctx.stroke()
    }
    ctx.strokeStyle = '#3a3a6a'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(140, 0); ctx.lineTo(140, 280); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, 140); ctx.lineTo(280, 140); ctx.stroke()
    if (vx !== undefined) {
      const ex = 140 + vx * 28, ey = 140 - vy * 28
      ctx.strokeStyle = '#22d3ee'; ctx.fillStyle = '#22d3ee'; ctx.lineWidth = 3
      ctx.beginPath(); ctx.moveTo(140, 140); ctx.lineTo(ex, ey); ctx.stroke()
      ctx.beginPath(); ctx.arc(ex, ey, 5, 0, 7); ctx.fill()
    }
  }
  useEffect(() => { draw() }, [])

  const onClick = (e) => {
    const c = canvasRef.current
    const r = c.getBoundingClientRect()
    const px = (e.clientX - r.left) * (280 / r.width)
    const py = (e.clientY - r.top) * (280 / r.height)
    const vx = Math.round((px - 140) / 28), vy = Math.round((140 - py) / 28)
    draw(vx, vy); setVec([vx, vy])
  }

  return (
    <div className="game">
      <div className="game-title">🎮 Vector Plotter</div>
      <div className="game-hint">Tap the grid to drop a vector from center. Watch [x,y] update.</div>
      <canvas ref={canvasRef} className="vec-grid" width="280" height="280" onClick={onClick} />
      <div className="vec-readout">{vec ? `vector = [${vec[0]}, ${vec[1]}]` : 'tap the grid →'}</div>
    </div>
  )
}

/* ---- Gate Lab ---- */
function GateGame({ onWin }) {
  const [s, setS] = useState([1, 0])
  const [msg, setMsg] = useState('Tap a gate')
  const fmt = (v) => Math.abs(v) < 0.01 ? '0' : (Math.abs(v - Math.round(v)) < 0.01 ? String(Math.round(v)) : v.toFixed(2))
  const label = (st) => {
    if (Math.abs(st[0] - 1) < 0.01 && Math.abs(st[1]) < 0.01) return '|0⟩ = '
    if (Math.abs(st[1] - 1) < 0.01 && Math.abs(st[0]) < 0.01) return '|1⟩ = '
    return ''
  }
  const apply = (g) => {
    let n
    if (g === 'X') n = [s[1], s[0]]
    if (g === 'H') n = [k * (s[0] + s[1]), k * (s[0] - s[1])]
    if (g === 'Z') n = [s[0], -s[1]]
    setS(n)
    setMsg(`${g} → P(0)=${(n[0] * n[0] * 100).toFixed(0)}% P(1)=${(n[1] * n[1] * 100).toFixed(0)}%`)
  }
  return (
    <div className="game">
      <div className="game-title">🎮 Gate Lab</div>
      <div className="game-hint">Tap a gate, watch the qubit state change live.</div>
      <div className="gate-game">
        <div className="gate-prompt">State: <span className="state">{label(s)}[{fmt(s[0])}, {fmt(s[1])}]</span></div>
        <div className="gate-buttons">
          <div className="gate-btn" onClick={() => apply('X')}><div className="g-sym">X</div><div className="g-name">flip</div></div>
          <div className="gate-btn" onClick={() => apply('H')}><div className="g-sym">H</div><div className="g-name">superpose</div></div>
          <div className="gate-btn" onClick={() => apply('Z')}><div className="g-sym">Z</div><div className="g-name">phase</div></div>
        </div>
        <div className="game-score">{msg}</div>
        <button className="btn-action" style={{ display: 'block', margin: '10px auto 0' }} onClick={() => { setS([1, 0]); setMsg('Reset') }}>↺ Reset</button>
      </div>
    </div>
  )
}

/* ---- Quantum Coin ---- */
function CoinGame() {
  const [t, setT] = useState({ z: 0, o: 0 })
  const [face, setFace] = useState('?')
  const [spin, setSpin] = useState(false)
  const flip = (n) => {
    setSpin(true)
    setTimeout(() => {
      setSpin(false)
      let z = 0, o = 0
      for (let i = 0; i < n; i++) Math.random() < 0.5 ? z++ : o++
      setT(p => ({ z: p.z + z, o: p.o + o }))
      setFace(Math.random() < 0.5 ? '0' : '1')
    }, n > 1 ? 300 : 200)
  }
  return (
    <div className="game">
      <div className="game-title">🎮 Quantum Coin</div>
      <div className="game-hint">Superposition = spinning coin, 50/50 until measured. Flip many times.</div>
      <div className="coin-stage">
        <div className={'coin' + (spin ? ' spinning' : '')} style={{ borderColor: face === '1' ? '#f472b6' : '#22d3ee' }}>{face}</div>
        <button className="btn-action" onClick={() => flip(1)}>Measure ×1</button>
        <button className="btn-action" onClick={() => flip(100)}>Measure ×100</button>
        <div className="tally">
          <div className="t0"><div className="big">{t.z}</div><div className="lbl">got 0</div></div>
          <div className="t1"><div className="big">{t.o}</div><div className="lbl">got 1</div></div>
        </div>
      </div>
    </div>
  )
}

/* ---- Entanglement ---- */
function EntangleGame() {
  const [val, setVal] = useState(null)
  const open = () => { if (val === null) setVal(Math.random() < 0.5 ? 0 : 1) }
  const reset = () => setVal(null)
  const cls = val === 0 ? 'zero' : val === 1 ? 'one' : ''
  return (
    <div className="game">
      <div className="game-title">🎮 Entanglement Boxes</div>
      <div className="game-hint">Open ONE box — the other instantly matches. Always.</div>
      <div className="ent-boxes">
        <div className={'ent-box ' + (val !== null ? 'opened ' + cls : '')} onClick={open}>{val !== null ? val : '📦'}<span className="ent-label">Qubit A</span></div>
        <div className={'ent-box ' + (val !== null ? 'opened ' + cls : '')} onClick={open}>{val !== null ? val : '📦'}<span className="ent-label">Qubit B</span></div>
      </div>
      <div className="game-score">{val !== null ? `Both = ${val}. Perfectly correlated! ✓` : 'Tap either box'}</div>
      <button className="btn-action" style={{ display: 'block', margin: '10px auto 0' }} onClick={reset}>↺ New pair</button>
    </div>
  )
}

/* ---- Factor / RSA (shared) ---- */
function FactorGame({ targets, title, hint, winMsg, onWin }) {
  const [target, setTarget] = useState(targets[0])
  const [a, setA] = useState(''); const [b, setB] = useState('')
  const [score, setScore] = useState({ text: '', good: false })
  const check = () => {
    const na = +a, nb = +b
    if (na * nb === target && na > 1 && nb > 1) { setScore({ text: winMsg(na, nb, target), good: true }); onWin && onWin() }
    else setScore({ text: `✗ ${na}×${nb}=${na * nb}, not ${target}.`, good: false })
  }
  const next = () => { setTarget(targets[Math.floor(Math.random() * targets.length)]); setA(''); setB(''); setScore({ text: '', good: false }) }
  return (
    <div className="game">
      <div className="game-title">{title}</div>
      <div className="game-hint">{hint}</div>
      <div className="factor-game">
        <div className="factor-num">{target}</div>
        <div className="factor-input">
          <input type="number" value={a} onChange={e => setA(e.target.value)} placeholder="?" />
          <span>×</span>
          <input type="number" value={b} onChange={e => setB(e.target.value)} placeholder="?" />
        </div>
        <button className="btn-action" onClick={check}>Check</button>
        <button className="btn-action" onClick={next}>New</button>
        <div className="game-score" style={{ color: score.good ? '#a3e635' : '#f472b6' }}>{score.text}</div>
      </div>
    </div>
  )
}

/* ---- Bra-Ket ---- */
function BraketGame() {
  const [state, setState] = useState({ s: '|0⟩', v: '= [1, 0]' })
  const set = (w) => {
    if (w === '0') setState({ s: '|0⟩', v: '= [1, 0]' })
    if (w === '1') setState({ s: '|1⟩', v: '= [0, 1]' })
    if (w === '+') setState({ s: '|+⟩ = (|0⟩+|1⟩)/√2', v: '= [0.707, 0.707]' })
  }
  return (
    <div className="game">
      <div className="game-title">🎮 Bra-Ket Builder</div>
      <div className="game-hint">Tap to build a state and see its vector form.</div>
      <div className="gate-game">
        <div className="gate-prompt"><span className="state">{state.s}</span><br /><span style={{ fontSize: '13px', color: 'var(--muted)' }}>{state.v}</span></div>
        <div className="gate-buttons">
          <div className="gate-btn" onClick={() => set('0')}><div className="g-sym">|0⟩</div></div>
          <div className="gate-btn" onClick={() => set('1')}><div className="g-sym">|1⟩</div></div>
          <div className="gate-btn" onClick={() => set('+')}><div className="g-sym">|+⟩</div><div className="g-name">superpos</div></div>
        </div>
      </div>
    </div>
  )
}

/* ---- Bloch Sphere ---- */
function BlochGame() {
  const canvasRef = useRef(null)
  const stateRef = useRef({ theta: 0, phi: 0, rotX: -0.3 })
  const [readout, setReadout] = useState('|0⟩ at north pole')

  const draw = () => {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext('2d'); const s = stateRef.current
    ctx.clearRect(0, 0, 280, 280)
    const cx = 140, cy = 140, R = 90
    ctx.strokeStyle = '#2a2a55'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke()
    ctx.strokeStyle = '#1c1c3a'; ctx.beginPath(); ctx.ellipse(cx, cy, R, R * Math.abs(Math.sin(s.rotX)), 0, 0, 7); ctx.stroke()
    ctx.fillStyle = '#5a5a85'; ctx.font = '11px monospace'; ctx.fillText('|0⟩', cx - 9, cy - R - 6); ctx.fillText('|1⟩', cx - 9, cy + R + 16)
    const th = s.theta, ph = s.phi
    let x = Math.sin(th) * Math.cos(ph), y = Math.sin(th) * Math.sin(ph), z = Math.cos(th)
    const ry = s.rotX; let z2 = y * Math.sin(ry) + z * Math.cos(ry)
    const px = cx + x * R, py = cy - z2 * R
    ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke()
    ctx.fillStyle = '#c084fc'; ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 12
    ctx.beginPath(); ctx.arc(px, py, 6, 0, 7); ctx.fill(); ctx.shadowBlur = 0
  }
  useEffect(() => {
    draw()
    const c = canvasRef.current
    let dragging = false, ly
    const down = e => { dragging = true; ly = e.clientY }
    const move = e => { if (!dragging) return; stateRef.current.rotX += (e.clientY - ly) * 0.01; ly = e.clientY; draw() }
    const up = () => { dragging = false }
    c.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => { c.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [])
  const gate = (g) => {
    const s = stateRef.current
    if (g === 'X') s.theta = Math.PI - s.theta
    if (g === 'H') s.theta = Math.abs(s.theta) < 0.1 ? Math.PI / 2 : 0
    if (g === 'Z') s.phi += Math.PI
    draw()
    const lbl = Math.abs(s.theta) < 0.1 ? '|0⟩ (north)' : Math.abs(s.theta - Math.PI) < 0.1 ? '|1⟩ (south)' : 'superposition (equator)'
    setReadout(`${g} applied → ${lbl}`)
  }
  return (
    <div className="game">
      <div className="game-title">🎮 Bloch Sphere</div>
      <div className="game-hint">Drag to rotate. Tap gates to move the qubit's point.</div>
      <canvas ref={canvasRef} className="vec-grid" width="280" height="280" style={{ cursor: 'grab' }} />
      <div className="gate-buttons" style={{ marginTop: '10px' }}>
        <div className="gate-btn" onClick={() => gate('X')}><div className="g-sym">X</div></div>
        <div className="gate-btn" onClick={() => gate('H')}><div className="g-sym">H</div></div>
        <div className="gate-btn" onClick={() => gate('Z')}><div className="g-sym">Z</div></div>
      </div>
      <div className="vec-readout">{readout}</div>
    </div>
  )
}

/* ---- LWE Lattice ---- */
function LatticeGame({ onWin }) {
  const [puzzle, setPuzzle] = useState(() => gen())
  const [guess, setGuess] = useState('')
  const [score, setScore] = useState({ text: '', good: false })
  function gen() { const s = Math.floor(Math.random() * 7), a = 2 + Math.floor(Math.random() * 4), noise = Math.random() < 0.5 ? 0 : 1; return { s, a, res: (a * s + noise) % 7 } }
  const check = () => {
    if (+guess === puzzle.s) { setScore({ text: `✓ Secret was ${puzzle.s}! Easy for tiny numbers — but with 256-dimensional lattices, no quantum computer can do this.`, good: true }); onWin && onWin() }
    else setScore({ text: `✗ Try again. Hint: ${puzzle.a}·s should be near ${puzzle.res} mod 7.`, good: false })
  }
  return (
    <div className="game">
      <div className="game-title">🎮 Lattice Puzzle (LWE)</div>
      <div className="game-hint">LWE hides a secret in noisy equations. Guess the secret s. Quantum can't solve big versions!</div>
      <div className="factor-game">
        <div>{puzzle.a}·s + small_noise ≈ {puzzle.res} (mod 7)</div>
        <div className="factor-input"><input type="number" value={guess} onChange={e => setGuess(e.target.value)} placeholder="s=?" /></div>
        <button className="btn-action" onClick={check}>Guess</button>
        <button className="btn-action" onClick={() => { setPuzzle(gen()); setGuess(''); setScore({ text: '', good: false }) }}>New puzzle</button>
        <div className="game-score" style={{ color: score.good ? '#a3e635' : '#f472b6' }}>{score.text}</div>
      </div>
    </div>
  )
}

/* ---- BB84 ---- */
function BB84Game({ onWin }) {
  const [score, setScore] = useState({ text: 'Send photons to measure error rate', good: null })
  const send = (spy) => {
    const err = spy ? (20 + Math.floor(Math.random() * 8)) : Math.floor(Math.random() * 3)
    if (spy) setScore({ text: `🕵️ Error rate: ${err}% — HIGH! Eavesdropper detected, key discarded.`, good: false })
    else { setScore({ text: `Error rate: ${err}% — low. Safe! Key accepted. ✓`, good: true }); onWin && onWin() }
  }
  return (
    <div className="game">
      <div className="game-title">🎮 BB84 Eavesdrop Detector</div>
      <div className="game-hint">Send photons. Toggle the eavesdropper — watch the error rate spike when someone's listening.</div>
      <div className="factor-game">
        <button className="btn-action" onClick={() => send(false)}>Send (no spy)</button>
        <button className="btn-action" onClick={() => send(true)}>Send (with spy 🕵️)</button>
        <div className="game-score" style={{ marginTop: '14px', color: score.good === false ? '#f472b6' : '#a3e635' }}>{score.text}</div>
      </div>
    </div>
  )
}

/* ---- Grover Search ---- */
function GroverGame() {
  const [n, setN] = useState(256)
  const classical = n
  const grover = Math.round(Math.sqrt(n))
  return (
    <div className="game">
      <div className="game-title">🎮 Grover's Search</div>
      <div className="game-hint">Classical search checks every item. Grover needs only √N — that's why AES key sizes must double.</div>
      <div className="factor-game">
        <div>Database size: <b>{n}</b> items</div>
        <input type="range" min="16" max="65536" step="16" value={n} onChange={e => setN(+e.target.value)} style={{ width: '100%', margin: '12px 0' }} />
        <div className="grover-compare">
          <div><span className="lbl">Classical tries</span><span className="big t0">{classical.toLocaleString()}</span></div>
          <div><span className="lbl">Grover tries (√N)</span><span className="big t1">{grover.toLocaleString()}</span></div>
        </div>
        <div className="game-score">AES-{n <= 256 ? '128' : '256'} under Grover ≈ {Math.log2(grover)}-bit effective security — use AES-256.</div>
      </div>
    </div>
  )
}

/* ---- Migration Triage ---- */
const TRIAGE_ITEMS = [
  { id: 'rsa', label: 'RSA-2048 TLS certificate', bucket: 'replace' },
  { id: 'ecc', label: 'ECDH key exchange (P-256)', bucket: 'replace' },
  { id: 'aes128', label: 'AES-128 disk encryption', bucket: 'strengthen' },
  { id: 'aes256', label: 'AES-256 VPN tunnel', bucket: 'ok' },
  { id: 'sha256', label: 'SHA-256 integrity (no collision attack)', bucket: 'ok' },
  { id: 'dh', label: 'Legacy DH parameters (1024-bit)', bucket: 'replace' },
]
function TriageGame({ onWin }) {
  const [assign, setAssign] = useState({})
  const [msg, setMsg] = useState('Assign each system to the right migration priority.')
  const set = (id, bucket) => setAssign(a => ({ ...a, [id]: bucket }))
  const check = () => {
    const ok = TRIAGE_ITEMS.every(i => assign[i.id] === i.bucket)
    if (ok) { setMsg('✓ Perfect triage! Replace asymmetric first, strengthen symmetric, keep strong configs.'); onWin && onWin() }
    else setMsg('✗ Prioritize: RSA/ECC/DH → Replace now. AES-128 → Strengthen. AES-256/SHA-256 → OK for now.')
  }
  return (
    <div className="game">
      <div className="game-title">🎮 Migration Triage</div>
      <div className="game-hint">Shor breaks asymmetric crypto first. Grover only weakens symmetric — prioritize replacements correctly.</div>
      {TRIAGE_ITEMS.map(i => (
        <div key={i.id} className="triage-row">
          <span>{i.label}</span>
          <div className="triage-btns">
            {['replace', 'strengthen', 'ok'].map(b => (
              <button key={b} type="button" className={'btn-action' + (assign[i.id] === b ? ' active' : '')} onClick={() => set(i.id, b)}>{b}</button>
            ))}
          </div>
        </div>
      ))}
      <button className="btn-action" onClick={check}>Check triage</button>
      <div className="game-score">{msg}</div>
    </div>
  )
}

/* ---- Hybrid TLS Builder ---- */
const HYBRID_PAIRS = [
  { classical: 'X25519', pqc: 'ML-KEM-768 (Kyber)', ok: true },
  { classical: 'RSA-2048', pqc: 'ML-KEM-768 (Kyber)', ok: false },
  { classical: 'X25519', pqc: 'ML-DSA-65 (Dilithium)', ok: false },
  { classical: 'ECDHE P-256', pqc: 'ML-KEM-768 (Kyber)', ok: true },
]
function HybridGame({ onWin }) {
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState({ text: 'Is this a valid hybrid key-exchange pair for TLS migration?', good: null })
  const pair = HYBRID_PAIRS[idx % HYBRID_PAIRS.length]
  const answer = (yes) => {
    const right = yes === pair.ok
    setScore({
      text: right
        ? (pair.ok ? '✓ Yes — classical ECDH/X25519 + Kyber KEM is the industry hybrid pattern.' : '✓ Correct — that pairing is wrong (signatures ≠ KEM, or weak classical leg).')
        : '✗ Hybrid TLS uses a classical key exchange PLUS a PQC KEM (Kyber), not signatures for key exchange.',
      good: right
    })
    if (right) onWin && onWin()
    setTimeout(() => setIdx(i => i + 1), 1200)
  }
  return (
    <div className="game">
      <div className="game-title">🎮 Hybrid TLS Builder</div>
      <div className="game-hint">During migration, combine a proven classical algorithm with a PQC KEM for defense in depth.</div>
      <div className="hybrid-pair">
        <div>{pair.classical}</div>
        <div className="hybrid-plus">+</div>
        <div>{pair.pqc}</div>
      </div>
      <button className="btn-action" onClick={() => answer(true)}>Valid hybrid ✓</button>
      <button className="btn-action" onClick={() => answer(false)}>Invalid ✗</button>
      <div className="game-score" style={{ color: score.good ? '#a3e635' : score.good === false ? '#f472b6' : 'var(--muted)' }}>{score.text}</div>
    </div>
  )
}

/* ---- Entropy Meter ---- */
const ENTROPY_SAMPLES = [
  { label: 'password123', bits: 2, weak: true },
  { label: 'a8f#K2!mQ9@xL4pZ7', bits: 10, weak: false },
  { label: '00000000', bits: 0, weak: true },
  { label: 'QRNG output (256 bits)', bits: 10, weak: false },
]
function EntropyGame() {
  const [i, setI] = useState(0)
  const s = ENTROPY_SAMPLES[i % ENTROPY_SAMPLES.length]
  const [msg, setMsg] = useState('Rate the entropy of this key material.')
  const rate = (weak) => {
    const right = weak === s.weak
    setMsg(right
      ? (s.weak ? '✓ Weak — predictable patterns = low entropy. Never use for real keys.' : '✓ Strong — high entropy, suitable for cryptographic keys (especially with QRNG).')
      : '✗ Re-read: entropy = unpredictability. Patterns and repetition = weak.')
    setTimeout(() => { setI(x => x + 1); setMsg('Rate the entropy of this key material.') }, 1400)
  }
  return (
    <div className="game">
      <div className="game-title">🎮 Entropy Meter</div>
      <div className="game-hint">Every key starts with randomness. Weak entropy = breakable keys even with perfect algorithms.</div>
      <div className="entropy-sample">{s.label}</div>
      <button className="btn-action" onClick={() => rate(true)}>Weak entropy</button>
      <button className="btn-action" onClick={() => rate(false)}>Strong entropy</button>
      <div className="game-score">{msg}</div>
    </div>
  )
}

/* ---- Dispatcher ---- */
export default function Game({ type, onWin }) {
  switch (type) {
    case 'vector': return <VectorGame />
    case 'gate': return <GateGame onWin={onWin} />
    case 'coin': return <CoinGame />
    case 'entangle': return <EntangleGame />
    case 'factor': return <FactorGame targets={[15, 21, 35, 33, 77, 91]} title="🎮 Be Shor's Algorithm" hint="Find two factors. Shor does this for 600-digit numbers — breaking RSA." winMsg={(a, b, t) => `✓ ${a}×${b}=${t}! You did what Shor's does — RSA broken.`} onWin={onWin} />
    case 'rsa': return <FactorGame targets={[35, 77, 143, 221, 323]} title="🎮 Attack RSA" hint="RSA's public number N is the product of two secret primes. Find them to crack the key." winMsg={(a, b, t) => `✓ Cracked! ${a}×${b}=${t}. Private key exposed — the quantum threat.`} onWin={onWin} />
    case 'braket': return <BraketGame />
    case 'bloch': return <BlochGame />
    case 'lattice': return <LatticeGame onWin={onWin} />
    case 'bb84': return <BB84Game onWin={onWin} />
    case 'grover': return <GroverGame />
    case 'triage': return <TriageGame onWin={onWin} />
    case 'hybrid': return <HybridGame onWin={onWin} />
    case 'entropy': return <EntropyGame />
    default: return null
  }
}
