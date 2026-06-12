import React, { useState, useRef, useEffect, useCallback } from 'react'
import GameShell from './GameShell.jsx'
import { drawPlotGrid, pixelToGrid, GRID_SIZE } from '../utils/plotGrid.js'

const k = 1 / Math.sqrt(2)
const VECTOR_TARGETS = [[3, 2], [2, -1], [-1, 3], [0, 2], [-2, -1]]
const ROUNDS = 5

function ModeToggle({ mode, setMode }) {
  return (
    <div className="game-mode-toggle">
      <button type="button" className={'btn-ghost btn-sm' + (mode === 'challenge' ? ' active' : '')} onClick={() => setMode('challenge')}>Challenge</button>
      <button type="button" className={'btn-ghost btn-sm' + (mode === 'free' ? ' active' : '')} onClick={() => setMode('free')}>Free play</button>
    </div>
  )
}

/* ---- Vector Plotter ---- */
function VectorGame({ onWin }) {
  const canvasRef = useRef(null)
  const [mode, setMode] = useState('challenge')
  const [vec, setVec] = useState(null)
  const targets = VECTOR_TARGETS.slice(0, ROUNDS)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [complete, setComplete] = useState(false)
  const target = targets[round]

  const redraw = useCallback((vx, vy) => {
    const c = canvasRef.current
    if (!c) return
    drawPlotGrid(c.getContext('2d'), vx !== undefined ? { vx, vy } : null)
  }, [])

  useEffect(() => {
    redraw()
  }, [round, mode, redraw])

  const finish = (finalScore) => {
    setComplete(true)
    onWin && onWin({ score: finalScore, total: ROUNDS })
  }

  const onClick = (e) => {
    const c = canvasRef.current
    const r = c.getBoundingClientRect()
    const px = (e.clientX - r.left) * (GRID_SIZE / r.width)
    const py = (e.clientY - r.top) * (GRID_SIZE / r.height)
    const { vx, vy } = pixelToGrid(px, py)
    redraw(vx, vy)
    setVec([vx, vy])
    if (mode === 'free' || complete) return
    const ok = vx === target[0] && vy === target[1]
    if (ok) {
      const ns = score + 1
      setFeedback({ ok: true, text: 'Correct [' + target[0] + ', ' + target[1] + ']' })
      setTimeout(() => {
        if (round + 1 >= ROUNDS) finish(ns)
        else {
          setRound((r) => r + 1)
          setFeedback(null)
          setScore(ns)
          setVec(null)
          redraw()
        }
      }, 600)
    } else {
      setFeedback({ ok: false, text: 'Target was [' + target[0] + ', ' + target[1] + ']. You plotted [' + vx + ', ' + vy + '].' })
    }
  }

  if (mode === 'free') {
    return (
      <div className="game">
        <div className="game-title">Vector plotter</div>
        <ModeToggle mode={mode} setMode={setMode} />
        <p className="game-hint">Tap the grid to place a vector from the origin.</p>
        <canvas ref={canvasRef} className="vec-grid" width={GRID_SIZE} height={GRID_SIZE} onClick={onClick} />
        <div className="vec-readout mono">{vec ? 'vector = [' + vec[0] + ', ' + vec[1] + ']' : 'Click the grid'}</div>
      </div>
    )
  }

  return (
    <GameShell
      title="Vector plotter"
      objective={'Plot 5 target vectors on the grid as fast as you can.'}
      round={round}
      totalRounds={ROUNDS}
      score={score}
      feedback={feedback}
      complete={complete}
      finalScore={score}
      onPlayAgain={() => { setRound(0); setScore(0); setFeedback(null); setComplete(false); setVec(null); redraw() }}
      onDone={() => finish(score)}
      modeToggle={<ModeToggle mode={mode} setMode={setMode} />}
    >
      <p className="mono game-target">Target: [{target[0]}, {target[1]}]</p>
      <canvas ref={canvasRef} className="vec-grid" width={GRID_SIZE} height={GRID_SIZE} onClick={onClick} />
    </GameShell>
  )
}

const GATE_ROUNDS = [
  { start: [1, 0], gate: 'X', prompt: 'Flip |0⟩ to |1⟩' },
  { start: [0, 1], gate: 'X', prompt: 'Flip |1⟩ to |0⟩' },
  { start: [1, 0], gate: 'H', prompt: 'Create equal superposition from |0⟩' },
  { start: [1, 0], gate: 'Z', prompt: 'Apply phase flip on |0⟩ (Z gate)' },
  { start: [0, 1], gate: 'H', prompt: 'Superpose from |1⟩' }
]

function GateGame({ onWin }) {
  const [mode, setMode] = useState('challenge')
  const [s, setS] = useState([1, 0])
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [complete, setComplete] = useState(false)
  const cur = GATE_ROUNDS[round % GATE_ROUNDS.length]
  const fmt = (v) => Math.abs(v) < 0.01 ? '0' : (Math.abs(v - Math.round(v)) < 0.01 ? String(Math.round(v)) : v.toFixed(2))

  useEffect(() => {
    if (mode === 'challenge' && !complete) setS(cur.start)
  }, [round, mode, complete, cur.start])

  const apply = (g) => {
    let n = s
    if (g === 'X') n = [s[1], s[0]]
    if (g === 'H') n = [k * (s[0] + s[1]), k * (s[0] - s[1])]
    if (g === 'Z') n = [s[0], -s[1]]
    setS(n)
    if (mode === 'free') return
    const ok = g === cur.gate
    if (ok) {
      const ns = score + 1
      setFeedback({ ok: true, text: cur.gate + ' is correct. ' + cur.prompt })
      setTimeout(() => {
        if (round + 1 >= GATE_ROUNDS.length) {
          setComplete(true)
          onWin && onWin({ score: ns, total: GATE_ROUNDS.length })
        } else {
          setRound((r) => r + 1)
          setScore(ns)
          setFeedback(null)
        }
      }, 700)
    } else {
      setFeedback({ ok: false, text: 'Needed ' + cur.gate + ' for: ' + cur.prompt })
    }
  }

  if (mode === 'free') {
    return (
      <div className="game">
        <div className="game-title">Gate lab</div>
        <ModeToggle mode={mode} setMode={setMode} />
        <div className="gate-prompt">State: <span className="state mono">[{fmt(s[0])}, {fmt(s[1])}]</span></div>
        <div className="gate-buttons">
          <button type="button" className="gate-btn" onClick={() => apply('X')}><div className="g-sym">X</div></button>
          <button type="button" className="gate-btn" onClick={() => apply('H')}><div className="g-sym">H</div></button>
          <button type="button" className="gate-btn" onClick={() => apply('Z')}><div className="g-sym">Z</div></button>
        </div>
        <button type="button" className="btn-ghost btn-sm" onClick={() => setS([1, 0])}>Reset to |0⟩</button>
      </div>
    )
  }

  return (
    <GameShell
      title="Gate lab"
      objective="Pick the single gate that matches each prompt."
      round={round}
      totalRounds={GATE_ROUNDS.length}
      score={score}
      feedback={feedback}
      complete={complete}
      finalScore={score}
      onPlayAgain={() => { setRound(0); setScore(0); setComplete(false); setFeedback(null); setS(GATE_ROUNDS[0].start) }}
      onDone={() => onWin && onWin({ score, total: GATE_ROUNDS.length })}
      modeToggle={<ModeToggle mode={mode} setMode={setMode} />}
    >
      <div className="gate-prompt">{cur.prompt}<br /><span className="mono">Start [{fmt(cur.start[0])}, {fmt(cur.start[1])}]</span></div>
      <div className="gate-buttons">
        <button type="button" className="gate-btn" onClick={() => apply('X')}><div className="g-sym">X</div></button>
        <button type="button" className="gate-btn" onClick={() => apply('H')}><div className="g-sym">H</div></button>
        <button type="button" className="gate-btn" onClick={() => apply('Z')}><div className="g-sym">Z</div></button>
      </div>
    </GameShell>
  )
}

const COIN_STATES = [
  { a: 0.6, b: 0.8, favor: '1' },
  { a: 1, b: 0, favor: '0' },
  { a: 0.5, b: 0.5, favor: 'tie' },
  { a: 0.8, b: 0.6, favor: '0' },
  { a: 0.707, b: 0.707, favor: 'tie' }
]

function CoinGame({ onWin }) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [complete, setComplete] = useState(false)
  const cur = COIN_STATES[round % COIN_STATES.length]
  const p0 = (cur.a * cur.a).toFixed(2)
  const p1 = (cur.b * cur.b).toFixed(2)

  const guess = (bit) => {
    if (complete) return
    let ok = false
    if (cur.favor === 'tie') ok = true
    else ok = bit === cur.favor
    const ns = score + (ok ? 1 : 0)
    setFeedback({
      ok,
      text: ok
        ? 'P(0)=' + p0 + ', P(1)=' + p1 + '. ' + (cur.favor === 'tie' ? 'Equal odds (either answer works).' : 'Higher for |' + cur.favor + '⟩.')
        : 'P(0)=' + p0 + ', P(1)=' + p1 + '. ' + (cur.favor === 'tie' ? 'Equal odds.' : 'More likely |' + cur.favor + '⟩.')
    })
    setTimeout(() => {
      if (round + 1 >= COIN_STATES.length) {
        setComplete(true)
        onWin && onWin({ score: ns, total: COIN_STATES.length })
      } else {
        setRound((r) => r + 1)
        setScore(ns)
        setFeedback(null)
      }
    }, 900)
  }

  return (
    <GameShell
      title="Quantum coin"
      objective="5 rounds: given amplitudes [α, β], predict which measurement outcome is more likely."
      round={round}
      totalRounds={COIN_STATES.length}
      score={score}
      feedback={feedback}
      complete={complete}
      finalScore={score}
      onPlayAgain={() => { setRound(0); setScore(0); setComplete(false); setFeedback(null) }}
      onDone={() => onWin && onWin({ score, total: COIN_STATES.length })}
    >
      <p className="mono game-target">Qubit state [α, β] = [{cur.a}, {cur.b}]</p>
      <p className="game-hint">Use the Born rule: compare α² and β².</p>
      <div className="tf-row">
        <button type="button" className="btn-action" onClick={() => guess('0')}>More likely |0⟩</button>
        <button type="button" className="btn-action" onClick={() => guess('1')}>More likely |1⟩</button>
      </div>
    </GameShell>
  )
}

/* ---- Entanglement ---- */
function EntangleGame({ onWin }) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [secret, setSecret] = useState(() => (Math.random() < 0.5 ? 0 : 1))
  const [opened, setOpened] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [complete, setComplete] = useState(false)
  const total = 5

  const predict = (bit) => {
    if (opened || complete) return
    setOpened(true)
    const ok = bit === secret
    const ns = score + (ok ? 1 : 0)
    setFeedback({
      ok,
      text: ok
        ? 'Both boxes show ' + secret + '. Entangled pair: opening one fixes the other.'
        : 'Both boxes show ' + secret + '. You predicted ' + bit + ', but the pair was ' + secret + '.'
    })
    setTimeout(() => {
      if (round + 1 >= total) {
        setComplete(true)
        onWin && onWin({ score: ns, total })
      } else {
        setRound((r) => r + 1)
        setScore(ns)
        setSecret(Math.random() < 0.5 ? 0 : 1)
        setOpened(false)
        setFeedback(null)
      }
    }, 1000)
  }

  return (
    <GameShell
      title="Entanglement boxes"
      objective="Before opening a box, predict what value both boxes will show (0 or 1)."
      round={round}
      totalRounds={total}
      score={score}
      feedback={feedback}
      complete={complete}
      finalScore={score}
      onPlayAgain={() => {
        setRound(0)
        setScore(0)
        setComplete(false)
        setOpened(false)
        setFeedback(null)
        setSecret(Math.random() < 0.5 ? 0 : 1)
      }}
      onDone={() => onWin && onWin({ score, total })}
    >
      <div className="ent-boxes">
        <div className={'ent-box' + (opened ? ' opened' : '')}>{opened ? secret : '?'}</div>
        <div className={'ent-box' + (opened ? ' opened' : '')}>{opened ? secret : '?'}</div>
      </div>
      {!opened && (
        <div className="tf-row">
          <button type="button" className="btn-action" onClick={() => predict(0)}>Predict 0</button>
          <button type="button" className="btn-action" onClick={() => predict(1)}>Predict 1</button>
        </div>
      )}
    </GameShell>
  )
}

/* ---- Factor / RSA (shared) ---- */
function FactorGame({ targets, title, objective, winMsg, onWin }) {
  const pool = targets.slice(0, ROUNDS)
  const [round, setRound] = useState(0)
  const [target, setTarget] = useState(pool[0])
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [complete, setComplete] = useState(false)

  const check = () => {
    if (complete) return
    const na = +a
    const nb = +b
    if (na * nb === target && na > 1 && nb > 1) {
      const ns = score + 1
      setFeedback({ ok: true, text: winMsg(na, nb, target) })
      setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          setComplete(true)
          onWin && onWin({ score: ns, total: ROUNDS })
        } else {
          setRound((r) => r + 1)
          setTarget(pool[(round + 1) % pool.length])
          setScore(ns)
          setA('')
          setB('')
          setFeedback(null)
        }
      }, 800)
    } else {
      setFeedback({ ok: false, text: 'Not quite. ' + na + '×' + nb + '=' + (na * nb) + ', not ' + target + '.' })
    }
  }

  return (
    <GameShell
      title={title}
      objective={objective}
      round={round}
      totalRounds={ROUNDS}
      score={score}
      feedback={feedback}
      complete={complete}
      finalScore={score}
      onPlayAgain={() => {
        setRound(0)
        setTarget(pool[0])
        setScore(0)
        setComplete(false)
        setA('')
        setB('')
        setFeedback(null)
      }}
      onDone={() => onWin && onWin({ score, total: ROUNDS })}
    >
      <div className="factor-game">
        <div className="factor-num">{target}</div>
        <div className="factor-input">
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="?" />
          <span>×</span>
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="?" />
        </div>
        <button type="button" className="btn-action" onClick={check}>Check factors</button>
      </div>
    </GameShell>
  )
}

const BRAKET_ROUNDS = [
  { target: '1', label: 'Build |1⟩' },
  { target: '0', label: 'Build |0⟩' },
  { target: '+', label: 'Build |+⟩' },
  { target: '1', label: 'Vector [0, 1]' },
  { target: '0', label: 'Vector [1, 0]' }
]

function BraketGame({ onWin }) {
  const [mode, setMode] = useState('challenge')
  const [state, setState] = useState({ s: '|0⟩', v: '= [1, 0]' })
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [complete, setComplete] = useState(false)
  const cur = BRAKET_ROUNDS[round % BRAKET_ROUNDS.length]

  const pick = (w) => {
    if (w === '0') setState({ s: '|0⟩', v: '= [1, 0]' })
    if (w === '1') setState({ s: '|1⟩', v: '= [0, 1]' })
    if (w === '+') setState({ s: '|+⟩', v: '= [0.707, 0.707]' })
    if (mode === 'free') return
    const ok = w === cur.target
    const ns = score + (ok ? 1 : 0)
    setFeedback({ ok, text: ok ? cur.label + ' matched.' : 'Needed ' + cur.label })
    setTimeout(() => {
      if (round + 1 >= BRAKET_ROUNDS.length) {
        setComplete(true)
        onWin && onWin({ score: ns, total: BRAKET_ROUNDS.length })
      } else {
        setRound((r) => r + 1)
        setScore(ns)
        setFeedback(null)
      }
    }, 700)
  }

  if (mode === 'free') {
    return (
      <div className="game">
        <div className="game-title">Bra-ket builder</div>
        <ModeToggle mode={mode} setMode={setMode} />
        <div className="gate-prompt"><span className="state">{state.s}</span><span className="mono">{state.v}</span></div>
        <div className="gate-buttons">
          <button type="button" className="gate-btn" onClick={() => pick('0')}><div className="g-sym">|0⟩</div></button>
          <button type="button" className="gate-btn" onClick={() => pick('1')}><div className="g-sym">|1⟩</div></button>
          <button type="button" className="gate-btn" onClick={() => pick('+')}><div className="g-sym">|+⟩</div></button>
        </div>
      </div>
    )
  }

  return (
    <GameShell
      title="Bra-ket builder"
      objective="Tap the ket that matches each prompt."
      round={round}
      totalRounds={BRAKET_ROUNDS.length}
      score={score}
      feedback={feedback}
      complete={complete}
      finalScore={score}
      onPlayAgain={() => { setRound(0); setScore(0); setComplete(false); setFeedback(null) }}
      onDone={() => onWin && onWin({ score, total: BRAKET_ROUNDS.length })}
      modeToggle={<ModeToggle mode={mode} setMode={setMode} />}
    >
      <p className="game-target">{cur.label}</p>
      <div className="gate-buttons">
        <button type="button" className="gate-btn" onClick={() => pick('0')}><div className="g-sym">|0⟩</div></button>
        <button type="button" className="gate-btn" onClick={() => pick('1')}><div className="g-sym">|1⟩</div></button>
        <button type="button" className="gate-btn" onClick={() => pick('+')}><div className="g-sym">|+⟩</div></button>
      </div>
    </GameShell>
  )
}

const BLOCH_ROUNDS = [
  { gate: 'X', init: 0, check: (s) => Math.abs(s.theta - Math.PI) < 0.2, prompt: 'Start at |0⟩. Apply the gate that moves to |1⟩ (south).' },
  { gate: 'X', init: Math.PI, check: (s) => Math.abs(s.theta) < 0.2, prompt: 'Start at |1⟩. Apply the gate that returns to |0⟩ (north).' },
  { gate: 'H', init: 0, check: (s) => Math.abs(s.theta - Math.PI / 2) < 0.2, prompt: 'From |0⟩, apply the gate that creates equal superposition (equator).' },
  { gate: 'H', init: Math.PI / 2, check: (s) => Math.abs(s.theta) < 0.2, prompt: 'From the equator, apply H to return toward |0⟩.' },
  { gate: 'Z', init: Math.PI / 2, check: (s) => Math.abs(s.theta - Math.PI / 2) < 0.2 && Math.abs(s.phi - Math.PI) < 0.3, prompt: 'On the equator, apply Z to add a π phase (point stays on equator).' }
]

function BlochCanvas({ stateRef, onGate }) {
  const canvasRef = useRef(null)
  const draw = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    const s = stateRef.current
    ctx.clearRect(0, 0, 280, 280)
    const cx = 140
    const cy = 140
    const R = 90
    ctx.strokeStyle = '#2a2a55'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, 7)
    ctx.stroke()
    ctx.strokeStyle = '#1c1c3a'
    ctx.beginPath()
    ctx.ellipse(cx, cy, R, R * Math.abs(Math.sin(s.rotX)), 0, 0, 7)
    ctx.stroke()
    ctx.fillStyle = '#5a5a85'
    ctx.font = '11px monospace'
    ctx.fillText('|0⟩', cx - 9, cy - R - 6)
    ctx.fillText('|1⟩', cx - 9, cy + R + 16)
    const th = s.theta
    const ph = s.phi
    const x = Math.sin(th) * Math.cos(ph)
    const y = Math.sin(th) * Math.sin(ph)
    const z = Math.cos(th)
    const ry = s.rotX
    const z2 = y * Math.sin(ry) + z * Math.cos(ry)
    const px = cx + x * R
    const py = cy - z2 * R
    ctx.strokeStyle = '#c084fc'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(px, py)
    ctx.stroke()
    ctx.fillStyle = '#c084fc'
    ctx.beginPath()
    ctx.arc(px, py, 6, 0, 7)
    ctx.fill()
  }, [stateRef])

  useEffect(() => {
    draw()
    const c = canvasRef.current
    let dragging = false
    let ly = 0
    const down = (e) => { dragging = true; ly = e.clientY }
    const move = (e) => {
      if (!dragging) return
      stateRef.current.rotX += (e.clientY - ly) * 0.01
      ly = e.clientY
      draw()
    }
    const up = () => { dragging = false }
    c.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      c.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [draw, stateRef])

  const gate = (g) => {
    const s = stateRef.current
    if (g === 'X') s.theta = Math.PI - s.theta
    if (g === 'H') s.theta = Math.abs(s.theta) < 0.1 ? Math.PI / 2 : 0
    if (g === 'Z') s.phi += Math.PI
    draw()
    onGate && onGate(g)
  }

  return (
    <>
      <canvas ref={canvasRef} className="vec-grid" width="280" height="280" style={{ cursor: 'grab' }} />
      <div className="gate-buttons" style={{ marginTop: 'var(--space-3)' }}>
        <button type="button" className="gate-btn" onClick={() => gate('X')}><div className="g-sym">X</div></button>
        <button type="button" className="gate-btn" onClick={() => gate('H')}><div className="g-sym">H</div></button>
        <button type="button" className="gate-btn" onClick={() => gate('Z')}><div className="g-sym">Z</div></button>
      </div>
    </>
  )
}

function BlochGame({ onWin }) {
  const [mode, setMode] = useState('challenge')
  const stateRef = useRef({ theta: 0, phi: 0, rotX: -0.3 })
  const [readout, setReadout] = useState('|0⟩ at north pole')
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [complete, setComplete] = useState(false)
  const cur = BLOCH_ROUNDS[round % BLOCH_ROUNDS.length]

  const resetState = (theta) => {
    stateRef.current.theta = theta
    stateRef.current.phi = 0
  }

  useEffect(() => {
    if (mode === 'challenge' && !complete) resetState(cur.init)
  }, [round, mode, complete, cur.init])

  const onGate = (g) => {
    const s = stateRef.current
    const lbl = Math.abs(s.theta) < 0.15 ? '|0⟩ (north)' : Math.abs(s.theta - Math.PI) < 0.15 ? '|1⟩ (south)' : 'superposition (equator)'
    setReadout(g + ' applied → ' + lbl)
    if (mode === 'free' || complete) return
    const ok = g === cur.gate && cur.check(s)
    if (ok) {
      const ns = score + 1
      setFeedback({ ok: true, text: 'Correct. ' + cur.prompt })
      setTimeout(() => {
        if (round + 1 >= BLOCH_ROUNDS.length) {
          setComplete(true)
          onWin && onWin({ score: ns, total: BLOCH_ROUNDS.length })
        } else {
          setRound((r) => r + 1)
          setScore(ns)
          setFeedback(null)
        }
      }, 700)
    } else {
      setFeedback({ ok: false, text: 'Not quite. ' + cur.prompt })
    }
  }

  if (mode === 'free') {
    return (
      <div className="game">
        <div className="game-title">Bloch sphere</div>
        <ModeToggle mode={mode} setMode={setMode} />
        <p className="game-hint">Drag to rotate. Tap gates to move the qubit point.</p>
        <BlochCanvas stateRef={stateRef} onGate={onGate} />
        <div className="vec-readout">{readout}</div>
      </div>
    )
  }

  return (
    <GameShell
      title="Bloch sphere"
      objective="Apply the right single-qubit gate for each target state on the Bloch sphere."
      round={round}
      totalRounds={BLOCH_ROUNDS.length}
      score={score}
      feedback={feedback}
      complete={complete}
      finalScore={score}
      onPlayAgain={() => {
        setRound(0)
        setScore(0)
        setComplete(false)
        setFeedback(null)
        resetState(0)
      }}
      onDone={() => onWin && onWin({ score, total: BLOCH_ROUNDS.length })}
      modeToggle={<ModeToggle mode={mode} setMode={setMode} />}
    >
      <p className="game-target">{cur.prompt}</p>
      <BlochCanvas stateRef={stateRef} onGate={onGate} />
      <div className="vec-readout">{readout}</div>
    </GameShell>
  )
}

function genLattice() {
  const s = Math.floor(Math.random() * 7)
  const a = 2 + Math.floor(Math.random() * 4)
  const noise = Math.random() < 0.5 ? 0 : 1
  return { s, a, res: (a * s + noise) % 7 }
}

/* ---- LWE Lattice ---- */
function LatticeGame({ onWin }) {
  const [round, setRound] = useState(0)
  const [puzzle, setPuzzle] = useState(() => genLattice())
  const [guess, setGuess] = useState('')
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [complete, setComplete] = useState(false)

  const check = () => {
    if (complete) return
    if (+guess === puzzle.s) {
      const ns = score + 1
      setFeedback({
        ok: true,
        text: 'Correct. Secret s=' + puzzle.s + '. Tiny LWE is easy; 256-dimensional lattices stay hard even for quantum computers.'
      })
      setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          setComplete(true)
          onWin && onWin({ score: ns, total: ROUNDS })
        } else {
          setRound((r) => r + 1)
          setScore(ns)
          setPuzzle(genLattice())
          setGuess('')
          setFeedback(null)
        }
      }, 800)
    } else {
      setFeedback({ ok: false, text: 'Not quite. Hint: ' + puzzle.a + '·s should be near ' + puzzle.res + ' mod 7.' })
    }
  }

  return (
    <GameShell
      title="Lattice Puzzle (LWE)"
      objective="Guess the secret s in five noisy modular equations (toy LWE)."
      round={round}
      totalRounds={ROUNDS}
      score={score}
      feedback={feedback}
      complete={complete}
      finalScore={score}
      onPlayAgain={() => {
        setRound(0)
        setScore(0)
        setComplete(false)
        setPuzzle(genLattice())
        setGuess('')
        setFeedback(null)
      }}
      onDone={() => onWin && onWin({ score, total: ROUNDS })}
    >
      <div className="factor-game">
        <div className="mono">{puzzle.a}·s + small_noise ≈ {puzzle.res} (mod 7)</div>
        <div className="factor-input">
          <input type="number" value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="s=?" />
        </div>
        <button type="button" className="btn-action" onClick={check}>Guess s</button>
      </div>
    </GameShell>
  )
}

const BB84_ROUNDS = [
  { spy: false, err: 2 },
  { spy: true, err: 24 },
  { spy: false, err: 1 },
  { spy: true, err: 22 },
  { spy: false, err: 0 }
]

/* ---- BB84 ---- */
function BB84Game({ onWin }) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [complete, setComplete] = useState(false)
  const cur = BB84_ROUNDS[round % BB84_ROUNDS.length]
  const err = cur.err + (round % 2)

  const judge = (compromised) => {
    if (complete) return
    const shouldCompromise = cur.spy
    const ok = compromised === shouldCompromise
    const ns = score + (ok ? 1 : 0)
    setFeedback({
      ok,
      text: ok
        ? (shouldCompromise
          ? 'Correct. Error rate ' + err + '% is high; eavesdropper detected, key discarded.'
          : 'Correct. Error rate ' + err + '% is low; key accepted.')
        : (shouldCompromise
          ? 'Not quite. Error rate ' + err + '% is high because someone was measuring the channel.'
          : 'Not quite. Error rate ' + err + '% is low; treat the key as safe.')
    })
    setTimeout(() => {
      if (round + 1 >= BB84_ROUNDS.length) {
        setComplete(true)
        onWin && onWin({ score: ns, total: BB84_ROUNDS.length })
      } else {
        setRound((r) => r + 1)
        setScore(ns)
        setFeedback(null)
      }
    }, 900)
  }

  return (
    <GameShell
      title="BB84 Eavesdrop Detector"
      objective="After each simulated photon batch, decide if the key is safe or compromised from the error rate."
      round={round}
      totalRounds={BB84_ROUNDS.length}
      score={score}
      feedback={feedback}
      complete={complete}
      finalScore={score}
      onPlayAgain={() => {
        setRound(0)
        setScore(0)
        setComplete(false)
        setFeedback(null)
      }}
      onDone={() => onWin && onWin({ score, total: BB84_ROUNDS.length })}
    >
      <p className="mono game-target">Measured error rate: {err}%</p>
      <p className="game-hint">Is this key safe to use or compromised?</p>
      <div className="tf-row">
        <button type="button" className="btn-action" onClick={() => judge(false)}>Key safe (low error)</button>
        <button type="button" className="btn-action" onClick={() => judge(true)}>Key compromised (high error)</button>
      </div>
    </GameShell>
  )
}

const GROVER_ROUNDS = [
  { n: 64, answer: 'grover' },
  { n: 256, answer: 'grover' },
  { n: 1024, answer: 'grover' },
  { n: 4096, answer: 'grover' },
  { n: 16384, answer: 'grover' }
]

/* ---- Grover Search ---- */
function GroverGame({ onWin }) {
  const [mode, setMode] = useState('challenge')
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [complete, setComplete] = useState(false)
  const [n, setN] = useState(256)
  const cur = GROVER_ROUNDS[round % GROVER_ROUNDS.length]
  const classical = cur.n
  const grover = Math.round(Math.sqrt(cur.n))

  const pick = (which) => {
    if (complete) return
    const ok = which === cur.answer
    const ns = score + (ok ? 1 : 0)
    setFeedback({
      ok,
      text: ok
        ? 'Correct. Grover needs about √N ≈ ' + grover + ' queries vs ' + classical + ' classically.'
        : 'Not quite. For N=' + cur.n + ', Grover uses √N ≈ ' + grover + ' tries, not N.'
    })
    setTimeout(() => {
      if (round + 1 >= GROVER_ROUNDS.length) {
        setComplete(true)
        onWin && onWin({ score: ns, total: GROVER_ROUNDS.length })
      } else {
        setRound((r) => r + 1)
        setScore(ns)
        setFeedback(null)
      }
    }, 900)
  }

  if (mode === 'free') {
    const classicalFree = n
    const groverFree = Math.round(Math.sqrt(n))
    return (
      <div className="game">
        <div className="game-title">Grover&apos;s Search</div>
        <ModeToggle mode={mode} setMode={setMode} />
        <p className="game-hint">Classical search checks every item. Grover needs only √N. That is why AES key sizes must double.</p>
        <div className="factor-game">
          <div>Database size: <b>{n}</b> items</div>
          <input type="range" min="16" max="65536" step="16" value={n} onChange={(e) => setN(+e.target.value)} style={{ width: '100%', margin: 'var(--space-3) 0' }} />
          <div className="grover-compare">
            <div><span className="lbl">Classical tries</span><span className="big t0">{classicalFree.toLocaleString()}</span></div>
            <div><span className="lbl">Grover tries (√N)</span><span className="big t1">{groverFree.toLocaleString()}</span></div>
          </div>
          <p className="game-hint">AES-{n <= 256 ? '128' : '256'} under Grover ≈ {Math.log2(groverFree).toFixed(1)}-bit effective security. Prefer AES-256.</p>
        </div>
      </div>
    )
  }

  return (
    <GameShell
      title="Grover&apos;s Search"
      objective="Five rounds: pick which search strategy needs fewer queries for the given database size N."
      round={round}
      totalRounds={GROVER_ROUNDS.length}
      score={score}
      feedback={feedback}
      complete={complete}
      finalScore={score}
      onPlayAgain={() => { setRound(0); setScore(0); setComplete(false); setFeedback(null) }}
      onDone={() => onWin && onWin({ score, total: GROVER_ROUNDS.length })}
      modeToggle={<ModeToggle mode={mode} setMode={setMode} />}
    >
      <p className="mono game-target">N = {cur.n} items</p>
      <div className="tf-row">
        <button type="button" className="btn-action" onClick={() => pick('classical')}>Classical (~N)</button>
        <button type="button" className="btn-action" onClick={() => pick('grover')}>Grover (~√N)</button>
      </div>
    </GameShell>
  )
}

/* ---- Migration Triage ---- */
const TRIAGE_ITEMS = [
  { id: 'rsa', label: 'RSA-2048 TLS certificate', bucket: 'replace' },
  { id: 'ecc', label: 'ECDH key exchange (P-256)', bucket: 'replace' },
  { id: 'aes128', label: 'AES-128 disk encryption', bucket: 'strengthen' },
  { id: 'aes256', label: 'AES-256 VPN tunnel', bucket: 'ok' },
  { id: 'sha256', label: 'SHA-256 integrity (no collision attack)', bucket: 'ok' }
]

function TriageGame({ onWin }) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [complete, setComplete] = useState(false)
  const item = TRIAGE_ITEMS[round % TRIAGE_ITEMS.length]

  const assign = (bucket) => {
    if (complete) return
    const ok = bucket === item.bucket
    const ns = score + (ok ? 1 : 0)
    setFeedback({
      ok,
      text: ok
        ? 'Correct. ' + item.label + ' → ' + bucket + '.'
        : 'Not quite. Shor breaks asymmetric first; Grover only weakens symmetric. ' + item.label + ' should be ' + item.bucket + '.'
    })
    setTimeout(() => {
      if (round + 1 >= TRIAGE_ITEMS.length) {
        setComplete(true)
        onWin && onWin({ score: ns, total: TRIAGE_ITEMS.length })
      } else {
        setRound((r) => r + 1)
        setScore(ns)
        setFeedback(null)
      }
    }, 900)
  }

  return (
    <GameShell
      title="Migration Triage"
      objective="Assign each system to replace now, strengthen, or OK for now (5 systems)."
      round={round}
      totalRounds={TRIAGE_ITEMS.length}
      score={score}
      feedback={feedback}
      complete={complete}
      finalScore={score}
      onPlayAgain={() => { setRound(0); setScore(0); setComplete(false); setFeedback(null) }}
      onDone={() => onWin && onWin({ score, total: TRIAGE_ITEMS.length })}
    >
      <p className="game-target">{item.label}</p>
      <div className="triage-btns" style={{ justifyContent: 'center' }}>
        {['replace', 'strengthen', 'ok'].map((b) => (
          <button key={b} type="button" className="btn-action" onClick={() => assign(b)}>{b}</button>
        ))}
      </div>
    </GameShell>
  )
}

/* ---- Hybrid TLS Builder ---- */
const HYBRID_PAIRS = [
  { classical: 'X25519', pqc: 'ML-KEM-768 (Kyber)', ok: true },
  { classical: 'RSA-2048', pqc: 'ML-KEM-768 (Kyber)', ok: false },
  { classical: 'X25519', pqc: 'ML-DSA-65 (Dilithium)', ok: false },
  { classical: 'ECDHE P-256', pqc: 'ML-KEM-768 (Kyber)', ok: true },
  { classical: 'RSA-4096', pqc: 'ML-DSA-65 (Dilithium)', ok: false }
]

function HybridGame({ onWin }) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [complete, setComplete] = useState(false)
  const pair = HYBRID_PAIRS[round % HYBRID_PAIRS.length]

  const answer = (yes) => {
    if (complete) return
    const right = yes === pair.ok
    const ns = score + (right ? 1 : 0)
    setFeedback({
      ok: right,
      text: right
        ? (pair.ok
          ? 'Correct. Classical ECDH/X25519 plus Kyber KEM is the industry hybrid pattern.'
          : 'Correct. That pairing is invalid (signatures are not KEMs, or the classical leg is wrong).')
        : 'Not quite. Hybrid TLS combines a classical key exchange with a PQC KEM (Kyber), not signatures for key exchange.'
    })
    setTimeout(() => {
      if (round + 1 >= HYBRID_PAIRS.length) {
        setComplete(true)
        onWin && onWin({ score: ns, total: HYBRID_PAIRS.length })
      } else {
        setRound((r) => r + 1)
        setScore(ns)
        setFeedback(null)
      }
    }, 900)
  }

  return (
    <GameShell
      title="Hybrid TLS Builder"
      objective="Judge five classical + PQC pairs: valid hybrid key exchange or not?"
      round={round}
      totalRounds={HYBRID_PAIRS.length}
      score={score}
      feedback={feedback}
      complete={complete}
      finalScore={score}
      onPlayAgain={() => { setRound(0); setScore(0); setComplete(false); setFeedback(null) }}
      onDone={() => onWin && onWin({ score, total: HYBRID_PAIRS.length })}
    >
      <div className="hybrid-pair">
        <div>{pair.classical}</div>
        <div className="hybrid-plus">+</div>
        <div>{pair.pqc}</div>
      </div>
      <div className="tf-row">
        <button type="button" className="btn-action" onClick={() => answer(true)}>Valid hybrid</button>
        <button type="button" className="btn-action" onClick={() => answer(false)}>Invalid</button>
      </div>
    </GameShell>
  )
}

/* ---- Entropy Meter ---- */
const ENTROPY_SAMPLES = [
  { label: 'password123', bits: 2, weak: true },
  { label: 'a8f#K2!mQ9@xL4pZ7', bits: 10, weak: false },
  { label: '00000000', bits: 0, weak: true },
  { label: 'QRNG output (256 bits)', bits: 10, weak: false },
  { label: 'TrulyRandom2024!xK9', bits: 10, weak: false }
]
function EntropyGame({ onWin }) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [complete, setComplete] = useState(false)
  const total = ENTROPY_SAMPLES.length
  const s = ENTROPY_SAMPLES[round % total]

  const rate = (weak) => {
    if (complete) return
    const ok = weak === s.weak
    const ns = score + (ok ? 1 : 0)
    setFeedback({
      ok,
      text: ok
        ? (s.weak ? 'Weak: predictable patterns mean low entropy.' : 'Strong: high unpredictability, good for keys.')
        : 'Entropy measures guessability. Patterns and repetition are weak.'
    })
    setTimeout(() => {
      if (round + 1 >= total) {
        setComplete(true)
        onWin && onWin({ score: ns, total })
      } else {
        setRound((r) => r + 1)
        setScore(ns)
        setFeedback(null)
      }
    }, 900)
  }

  return (
    <GameShell
      title="Entropy meter"
      objective="Rate 5 key samples as weak or strong entropy."
      round={round}
      totalRounds={total}
      score={score}
      feedback={feedback}
      complete={complete}
      finalScore={score}
      onPlayAgain={() => { setRound(0); setScore(0); setComplete(false); setFeedback(null) }}
      onDone={() => onWin && onWin({ score, total })}
    >
      <div className="entropy-sample">{s.label}</div>
      <div className="tf-row">
        <button type="button" className="btn-action" onClick={() => rate(true)}>Weak entropy</button>
        <button type="button" className="btn-action" onClick={() => rate(false)}>Strong entropy</button>
      </div>
    </GameShell>
  )
}

/* ---- Dispatcher ---- */
export default function Game({ type, onWin }) {
  switch (type) {
    case 'vector': return <VectorGame onWin={onWin} />
    case 'gate': return <GateGame onWin={onWin} />
    case 'coin': return <CoinGame onWin={onWin} />
    case 'entangle': return <EntangleGame onWin={onWin} />
    case 'factor': return <FactorGame targets={[15, 21, 35, 33, 77, 91]} title="Be Shor's Algorithm" objective="Factor five composite numbers the way Shor's algorithm would (toy sizes)." winMsg={(a, b, t) => 'Correct. ' + a + '×' + b + '=' + t + '. That is what Shor does to break RSA.'} onWin={onWin} />
    case 'rsa': return <FactorGame targets={[35, 77, 143, 221, 323]} title="Attack RSA" objective="Find the two prime factors of N for five RSA-style public moduli." winMsg={(a, b, t) => 'Cracked. ' + a + '×' + b + '=' + t + '. Private key exposed.'} onWin={onWin} />
    case 'braket': return <BraketGame onWin={onWin} />
    case 'bloch': return <BlochGame onWin={onWin} />
    case 'lattice': return <LatticeGame onWin={onWin} />
    case 'bb84': return <BB84Game onWin={onWin} />
    case 'grover': return <GroverGame onWin={onWin} />
    case 'triage': return <TriageGame onWin={onWin} />
    case 'hybrid': return <HybridGame onWin={onWin} />
    case 'entropy': return <EntropyGame onWin={onWin} />
    default: return null
  }
}
