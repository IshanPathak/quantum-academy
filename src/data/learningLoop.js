/** Do activities, recall banks, exercise scaffolding. L1–L3 authored; others use fallbacks. */

export const RECALL_PASS_RATIO = 0.8

export const DO_ACTIVITIES = {
  t11: {
    type: 'vectorGuided',
    intro: 'Walk through how coordinates work on the grid, then place one vector yourself.',
    steps: [
      { title: 'Axes and ticks', body: 'The horizontal axis is x (right positive). The vertical axis is y (+y points up). Integers -5 to 5 are labeled on both axes.' },
      { title: 'From origin to tip', body: 'A vector [a, b] starts at (0, 0). Move a units along x, then b units along y. Example: [2, -1] is 2 right, 1 down.' },
      { title: 'Read before you click', body: 'Find the tick labels first. The arrow tip must land on the grid intersection for that pair.' },
      { title: 'Your turn', body: 'Place [2, -1] on the grid. Use the hint if you need a nudge.' }
    ],
    practice: {
      target: [2, -1],
      hint: 'From (0, 0): move 2 steps right on x, then 1 step down on y (negative y).'
    }
  },
  t12: {
    type: 'guided',
    intro: 'Walk through one matrix-vector multiply, then try the check.',
    steps: [
      { title: 'Setup', body: 'Matrix X = [[0,1],[1,0]] swaps components. Vector v = [1, 0].' },
      { title: 'Row 0', body: 'New x = 0·1 + 1·0 = 0.' },
      { title: 'Row 1', body: 'New y = 1·1 + 0·0 = 1. Result [0, 1], which is |1⟩.' },
      { title: 'Check', body: 'X gate on |0⟩ always gives |1⟩. You just computed it.' }
    ]
  },
  t13: {
    type: 'fillBlank',
    intro: 'Add and multiply complex numbers in Cartesian form.',
    rounds: [
      { prompt: '(1 + 2i) + (3 + 4i) = ?', accept: ['4+6i', '4 + 6i'], explain: 'Add real parts (4) and imaginary parts (6i).' },
      { prompt: '|3 + 4i| = ?', accept: ['5'], explain: '√(3² + 4²) = 5.' },
      { prompt: 'i² = ?', accept: ['-1'], explain: 'By definition i = √(-1), so i² = -1.' }
    ]
  },
  t14: {
    type: 'trueFalse',
    intro: 'Five quick Born-rule checks. True or false.',
    statements: [
      { text: 'For [0.6, 0.8], P(0) = 0.36.', answer: true, explain: '0.6² = 0.36. The amplitudes must be squared.' },
      { text: 'Probabilities from amplitudes can be negative.', answer: false, explain: 'Probabilities are squared magnitudes, always ≥ 0.' },
      { text: 'A normalized qubit state has |α|² + |β|² = 1.', answer: true, explain: 'Normalization ensures outcomes sum to 1.' },
      { text: 'Measuring |0⟩ always returns amplitude 0.', answer: false, explain: 'Measurement returns outcome 0 or 1, not the amplitude.' },
      { text: 'For [1/√2, 1/√2], P(0) = 0.5.', answer: true, explain: '(1/√2)² = 0.5 for each outcome.' }
    ]
  },
  t15: {
    type: 'mcq',
    intro: 'Match bra-ket notation to column vectors.',
    rounds: [
      {
        q: 'Which vector is |1⟩?',
        opts: ['[1, 0]', '[0, 1]', '[1, 1]'],
        correct: 1,
        explain: '|1⟩ is the second basis vector [0, 1].'
      },
      {
        q: '|0⟩ + |1⟩ (before normalization) as a vector?',
        opts: ['[1, 1]', '[0, 0]', '[1, 0]'],
        correct: 0,
        explain: 'Add component-wise: [1,0] + [0,1] = [1,1].'
      },
      {
        q: 'α|0⟩ + β|1⟩ in numbers is:',
        opts: ['[α, β]', '[β, α]', '[α+β, 0]'],
        correct: 0,
        explain: 'Ket notation maps directly to the column [α, β].'
      }
    ]
  },
  t16: {
    type: 'fillBlank',
    intro: 'Clock math: compute remainders mod n.',
    rounds: [
      { prompt: '17 mod 5 = ?', accept: ['2'], explain: '17 = 3×5 + 2.' },
      { prompt: '(7 × 8) mod 10 = ?', accept: ['6'], explain: '56 mod 10 = 6.' },
      { prompt: '100 mod 9 = ?', accept: ['1'], explain: '99 is divisible by 9, remainder 1.' }
    ]
  },
  t17: {
    type: 'trueFalse',
    intro: 'Entropy and key strength.',
    statements: [
      { text: 'High entropy means a key is hard to guess.', answer: true, explain: 'Unpredictability is what entropy measures.' },
      { text: 'password123 has high entropy.', answer: false, explain: 'Common patterns are easy to guess.' },
      { text: '8 fair coin flips give about 8 bits of entropy.', answer: true, explain: '2⁸ equally likely outcomes → log₂(256) = 8 bits.' },
      { text: 'Entropy only matters for symmetric ciphers.', answer: false, explain: 'Every key, nonce, and seed needs unpredictable bits.' },
      { text: 'QRNG can supply entropy for key generation.', answer: true, explain: 'Physical randomness is one source of high-quality bits.' }
    ]
  },
  t21: {
    type: 'fillBlank',
    intro: 'Five quick checks on parsing input and returning strings, the same habits you need in the Exercise tab (JavaScript stands in for Python here).',
    rounds: [
      {
        prompt: 'In JS, input.trim().split(/\\s+/) on "2 3" gives how many tokens?',
        accept: ['2'],
        explain: 'Split on whitespace: ["2", "3"]. Two tokens to add.'
      },
      {
        prompt: '0.8 ** 2 equals? (power operator)',
        accept: ['0.64'],
        explain: '** is exponentiation: 0.8×0.8 = 0.64.'
      },
      {
        prompt: 'Input "1\\n2" (newline). Sum as string:',
        accept: ['3'],
        explain: 'trim and split still give two numbers; 1+2=3.'
      },
      {
        prompt: 'Sum of 10 and 20 as a string answer:',
        accept: ['30'],
        explain: '10+20=30; exercises want "30" not 30.'
      },
      {
        prompt: 'Input "-5 8". Sum as string:',
        accept: ['3'],
        explain: 'Treat split parts as numbers: -5+8=3.'
      }
    ]
  },
  t22: {
    type: 'mcq',
    intro: 'Five prompts on arrays as state vectors and gates as matrices, separate from the Gate Lab game.',
    rounds: [
      {
        q: 'X gate on state [1, 0] gives:',
        opts: ['[1, 0]', '[0, 1]', '[0, 0]'],
        correct: 1,
        explain: 'X swaps components: [1,0] becomes [0,1].'
      },
      {
        q: 'In NumPy, U @ ψ means:',
        opts: ['Element-wise multiply', 'Matrix-vector multiply', 'Dot product of scalars'],
        correct: 1,
        explain: '@ applies matrix U to column vector ψ, same as a quantum gate.'
      },
      {
        q: 'Row 0 of [[2,0],[0,3]] times [1,1] equals:',
        opts: ['2', '3', '1'],
        correct: 0,
        explain: '2·1 + 0·1 = 2 (top row dot product).'
      },
      {
        q: 'Hadamard on |0⟩=[1,0] gives amplitudes [1/√2, 1/√2]. P(0)?',
        opts: ['0.707', '0.5', '1.0'],
        correct: 1,
        explain: '(1/√2)² = 0.5. Equal superposition.'
      },
      {
        q: 'A qubit state as code is best written as:',
        opts: ['A single number', 'An array of two amplitudes', 'A 2×2 matrix'],
        correct: 1,
        explain: 'One qubit = two amplitudes [α, β] in ℂ².'
      }
    ]
  },
  t23: {
    type: 'trueFalse',
    intro: 'Five checks on what a toy simulator must track before you wire gates in code.',
    statements: [
      {
        text: 'A simulator outputs measurement probabilities by squaring amplitudes.',
        answer: true,
        explain: 'Born rule: P(i) = |amplitude_i|² after normalization.'
      },
      {
        text: 'For n qubits, the state vector has length n.',
        answer: false,
        explain: 'Length is 2^n: three qubits need 8 amplitudes.'
      },
      {
        text: 'The Z gate can change phase without changing P(0) and P(1) immediately.',
        answer: true,
        explain: 'Z flips sign on |1⟩; probabilities use squares so signs may cancel later in interference.'
      },
      {
        text: 'Building H, X, Z, and a measure() function is enough for single-qubit learning sims.',
        answer: true,
        explain: 'Those gates plus measurement reproduce core framework behavior.'
      },
      {
        text: 'Classical simulation stays cheap even at 100 qubits.',
        answer: false,
        explain: '2^100 amplitudes is infeasible; ~40-50 qubits strains laptops.'
      }
    ]
  },
  t31: {
    type: 'mcq',
    intro: 'Five prompts on superposition, measurement, and why algorithms need interference (Play uses the Quantum Coin game).',
    rounds: [
      {
        q: 'Hadamard on |0⟩ mainly prepares:',
        opts: ['A definite 0 or 1', 'Equal superposition of 0 and 1', 'An entangled pair'],
        correct: 1,
        explain: 'H maps |0⟩ to (|0⟩+|1⟩)/√2: both amplitudes nonzero.'
      },
      {
        q: 'One projective measurement on a qubit returns:',
        opts: ['Both amplitudes as classical bits', 'One outcome 0 or 1', 'The full state vector'],
        correct: 1,
        explain: 'Born rule gives one random bit; amplitudes are not directly read out.'
      },
      {
        q: 'Why is superposition useful for algorithms?',
        opts: ['More RAM', 'Explore many paths, interference picks the answer', 'Deterministic outputs'],
        correct: 1,
        explain: 'Superposition explores branches; interference amplifies the right one.'
      },
      {
        q: 'Superposition is best described as:',
        opts: ['Unknown classical bits', 'One vector with amplitudes for 0 and 1', 'Two separate qubits'],
        correct: 1,
        explain: 'Not ignorance: a single quantum state in ℂ².'
      },
      {
        q: 'Equal superposition |+⟩ has P(0) = ?',
        opts: ['0.25', '0.5', '1.0'],
        correct: 1,
        explain: '|1/√2|² = 0.5 for each outcome.'
      }
    ]
  },
  t32: {
    type: 'mcq',
    intro: 'Five Bloch-sphere checks (poles, equator, gates as rotations). Pair with the Bloch Sphere Play tab.',
    rounds: [
      {
        q: 'On the Bloch sphere, the north pole is:',
        opts: ['|1⟩', '|0⟩', 'Maximal entanglement'],
        correct: 1,
        explain: 'Convention: north = |0⟩, south = |1⟩.'
      },
      {
        q: 'The equator mostly represents:',
        opts: ['Classical mixtures only', 'Superpositions with equal |0⟩ and |1⟩ weight', 'Two-qubit states'],
        correct: 1,
        explain: 'Equal superpositions sit on the equator; poles are basis states.'
      },
      {
        q: 'Applying H to |0⟩ (north pole) moves the state toward:',
        opts: ['The equator', 'The south pole', 'Outside the sphere'],
        correct: 0,
        explain: 'H rotates |0⟩ into an equal superposition on the equator.'
      },
      {
        q: 'The X gate on the Bloch picture is like:',
        opts: ['A 180° flip between |0⟩ and |1⟩', 'A measurement', 'Decoherence'],
        correct: 0,
        explain: 'X swaps poles: rotation about an equatorial axis by π.'
      },
      {
        q: 'A point inside the Bloch sphere (not on the surface) means:',
        opts: ['A valid pure qubit state', 'A mixed state (classical uncertainty)', 'An entangled two-qubit state'],
        correct: 1,
        explain: 'Pure states are on the surface; interior points are mixed.'
      }
    ]
  },
  t33: {
    type: 'trueFalse',
    intro: 'Five statements on entanglement and why it matters for QKD (Play: Entanglement Lab).',
    statements: [
      {
        text: 'A Bell pair shows perfectly correlated measurement outcomes along the same basis.',
        answer: true,
        explain: 'H then CNOT on |00⟩ yields |Φ+⟩: outcomes match in the standard basis.'
      },
      {
        text: 'Entanglement lets you send classical bits faster than light.',
        answer: false,
        explain: 'Correlations appear when both sides compare results; no FTL signaling.'
      },
      {
        text: 'Measuring an entangled qubit disturbs the joint state, which QKD exploits.',
        answer: true,
        explain: 'Eavesdropping introduces detectable errors.'
      },
      {
        text: 'Entanglement is the same as "maybe 0, maybe 1" on one qubit alone.',
        answer: false,
        explain: 'Entanglement is a joint property of two or more qubits.'
      },
      {
        text: 'CNOT after H on qubit 0 can entangle two qubits starting from |00⟩.',
        answer: true,
        explain: 'Standard Bell-state circuit: qc.h(0); qc.cx(0,1).'
      }
    ]
  },
  t34: {
    type: 'fillBlank',
    intro: 'Five quick 2^n counts for multi-qubit state space (no Play tab for this topic).',
    rounds: [
      { prompt: 'Two qubits: how many computational basis states (00, 01, …)?', accept: ['4'], explain: '2² = 4: 00, 01, 10, 11.' },
      { prompt: 'Three qubits: state vector length?', accept: ['8'], explain: '2³ = 8 amplitudes.' },
      { prompt: 'Four qubits: how many states?', accept: ['16'], explain: '2⁴ = 16.' },
      { prompt: 'Ten qubits: 2^10 = ?', accept: ['1024'], explain: 'Each added qubit doubles the space.' },
      { prompt: 'n = 20 qubits: 2^20 = ?', accept: ['1048576'], explain: 'Over one million amplitudes to track classically.' }
    ]
  },
  t35: {
    type: 'trueFalse',
    intro: 'Five checks on measurement collapse and decoherence as an engineering challenge.',
    statements: [
      {
        text: 'Projective measurement collapses a superposition to one classical outcome.',
        answer: true,
        explain: 'After measurement the state is an eigenstate of the measured observable.'
      },
      {
        text: 'Decoherence is the environment effectively "measuring" the qubit and destroying coherence.',
        answer: true,
        explain: 'Uncontrolled coupling leaks which-path information into the environment.'
      },
      {
        text: 'Decoherence is just another name for the Hadamard gate.',
        answer: false,
        explain: 'H is a controlled unitary; decoherence is unwanted noise.'
      },
      {
        text: 'Cryogenic isolation helps qubits stay coherent longer.',
        answer: true,
        explain: 'Less thermal noise and fewer stray interactions.'
      },
      {
        text: 'You can freely undo a measurement and recover the pre-measurement superposition.',
        answer: false,
        explain: 'Measurement is effectively irreversible for that run.'
      }
    ]
  },
  t36: {
    type: 'mcq',
    intro: 'Five prompts linking quantum error correction to realistic crypto threat timelines.',
    rounds: [
      {
        q: 'A logical qubit in QEC is:',
        opts: ['One perfect physical qubit', 'Many physical qubits encoding one protected bit', 'A classical backup copy'],
        correct: 1,
        explain: 'Redundancy detects and corrects errors without reading the data directly.'
      },
      {
        q: 'Why does QEC affect when Shor threatens RSA?',
        opts: ['It breaks AES', 'Shor needs huge numbers of reliable logical qubits', 'It removes the need for PQC'],
        correct: 1,
        explain: 'Physical qubits are noisy; useful machines need massive overhead.'
      },
      {
        q: 'Syndrome measurement in QEC is designed to:',
        opts: ['Reveal the logical 0/1 every cycle', 'Flag errors without collapsing the encoded data', 'Speed up Grover'],
        correct: 1,
        explain: 'Measure ancillas for error patterns, not the logical state directly.'
      },
      {
        q: 'Physical qubits on real hardware are:',
        opts: ['Error-free at room temperature', 'Noisy and short-lived', 'Only used for QKD'],
        correct: 1,
        explain: 'Decoherence and gate errors motivate QEC.'
      },
      {
        q: 'For long-lived secrets, the security lesson is:',
        opts: ['Wait for QEC then migrate', 'Harvest-now-decrypt-later means migrate before machines exist', 'QEC replaces lattice crypto'],
        correct: 1,
        explain: 'Timelines for hardware and data lifetime are different; PQC migration cannot wait.'
      }
    ]
  }
}

function defaultGuided(topic) {
  const steps = (topic.steps || [])
    .filter((s) => !/watch|khan|video|paper|→/i.test(s))
    .slice(0, 3)
  if (!steps.length) {
    return {
      type: 'guided',
      intro: 'Work through the core idea in three short steps.',
      steps: [
        { title: 'Read', body: 'Skim the Learn tab for the definition and notation.' },
        { title: 'Connect', body: topic.analogy || 'Relate the idea to a concrete example.' },
        { title: 'Check', body: 'Open Recall and answer without peeking at Learn.' }
      ]
    }
  }
  return {
    type: 'guided',
    intro: 'Guided walkthrough from this topic (in-app, no external homework).',
    steps: steps.map((s, i) => ({ title: 'Step ' + (i + 1), body: s.replace(/→.*$/, '').trim() }))
  }
}

export function getDoActivity(topic) {
  if (DO_ACTIVITIES[topic.id]) return DO_ACTIVITIES[topic.id]
  return defaultGuided(topic)
}

export const RECALL_BANK = {
  t11: {
    passAt: 4,
    questions: [
      { id: 't11-r1', type: 'mcq', q: 'A=[1,0], B=[0,1]. A+B = ?', opts: ['[0,0]', '[1,1]', '[1,0]'], correct: 1, explain: 'Add each component: [1,1].' },
      { id: 't11-r2', type: 'tf', q: 'A qubit state is a vector in ℂ².', answer: true, explain: 'Two complex amplitudes describe one qubit.' },
      {
        id: 't11-r3',
        type: 'fill',
        q: 'Vector [3, 4] has length √(3²+4²) = ?',
        accept: ['5'],
        numeric: true,
        explain: 'Correct. √(9 + 16) = √25 = 5.',
        wrongExplain: 'Length of [a, b] is √(a² + b²). For [3, 4]: √(9 + 16) = √25 = 5.'
      },
      { id: 't11-r4', type: 'apply', q: 'Superposition [0.5, 0.5] (unnormalized). Scale so |α|²+|β|²=1. First component?', opts: ['0.707', '0.5', '1'], correct: 0, explain: 'Divide by √2: amplitudes become 1/√2 ≈ 0.707.' },
      { id: 't11-r5', type: 'mcq', q: 'Why normalize qubit states?', opts: ['Faster simulation', 'Probabilities sum to 1', 'Smaller vectors'], correct: 1, explain: 'Measurement probabilities must total 1.' }
    ]
  },
  t12: {
    passAt: 4,
    questions: [
      { id: 't12-r1', type: 'mcq', q: 'X gate [[0,1],[1,0]] on [1,0]?', opts: ['[1,0]', '[0,1]', '[2,0]'], correct: 1, explain: 'Rows times column → [0,1].' },
      { id: 't12-r2', type: 'tf', q: 'Every quantum gate matrix is unitary.', answer: true, explain: 'Unitary maps preserve total probability.' },
      { id: 't12-r3', type: 'mcq', q: '[[2,0],[0,3]] × [1,1] = ?', opts: ['[2, 3]', '[1, 1]', '[3, 2]'], correct: 0, explain: 'Scale each component: [2,3].' },
      { id: 't12-r4', type: 'apply', q: 'Which gate swaps |0⟩ and |1⟩?', opts: ['Z', 'X', 'H'], correct: 1, explain: 'X flips computational basis states.' },
      { id: 't12-r5', type: 'mcq', q: 'Relative phase matters because:', opts: ['It changes interference', 'It changes vector length', 'It removes entanglement'], correct: 0, explain: 'Phases affect how amplitudes add before measurement.' }
    ]
  },
  t13: {
    passAt: 4,
    questions: [
      { id: 't13-r1', type: 'mcq', q: '(1+2i)+(3+4i) = ?', opts: ['4+6i²', '4+6i', '3+8i'], correct: 1, explain: 'Add reals and imaginaries separately.' },
      { id: 't13-r2', type: 'tf', q: 'Complex amplitudes enable destructive interference.', answer: true, explain: 'Opposite phases can cancel before squaring.' },
      { id: 't13-r3', type: 'fill', q: '|3+4i|² = ?', accept: ['25'], numeric: true, explain: '3² + 4² = 25.', wrongExplain: '|3+4i|² = 3² + 4² = 9 + 16 = 25.' },
      { id: 't13-r4', type: 'apply', q: 'Probability uses:', opts: ['|amplitude|', '|amplitude|²', 'amplitude² only if real'], correct: 1, explain: 'Born rule: square the magnitude.' },
      { id: 't13-r5', type: 'mcq', q: 'e^(iπ) equals:', opts: ['1', '-1', 'i'], correct: 1, explain: 'Euler: cos π + i sin π = -1.' }
    ]
  },
  t14: {
    passAt: 4,
    questions: [
      { id: 't14-r1', type: 'mcq', q: '[0.8,0.6]. P(1)?', opts: ['0.6', '0.64', '0.36'], correct: 2, explain: '0.6² = 0.36 (check: 0.64+0.36=1).' },
      { id: 't14-r2', type: 'tf', q: 'Measurement basis choice changes outcome probabilities.', answer: true, explain: 'Same state, different measurement → different odds.' },
      { id: 't14-r3', type: 'mcq', q: 'State [1/√2, 1/√2] (normalized). P(0)?', opts: ['0.25', '0.5', '1'], correct: 1, explain: '(1/√2)² = 0.5 for each outcome.' },
      { id: 't14-r4', type: 'apply', q: 'QKD exploits:', opts: ['Faster factoring', 'Measurement disturbance', 'Infinite keys'], correct: 1, explain: 'Eavesdropping disturbs quantum states detectably.' },
      { id: 't14-r5', type: 'mcq', q: 'Amplitudes add; probabilities come from:', opts: ['Adding amplitudes', 'Squaring magnitudes', 'Measuring twice'], correct: 1, explain: 'Interference happens in amplitudes, then square.' }
    ]
  },
  t15: {
    passAt: 4,
    questions: [
      { id: 't15-r1', type: 'mcq', q: '|1⟩ vector?', opts: ['[1,0]', '[0,1]', '[1,1]'], correct: 1, explain: '|1⟩ = [0,1].' },
      { id: 't15-r2', type: 'tf', q: '⟨φ|ψ⟩ is an inner product (a scalar).', answer: true, explain: 'Bra times ket yields a complex number.' },
      { id: 't15-r3', type: 'mcq', q: '|0⟩ as a column vector:', opts: ['[1, 0]', '[0, 1]', '[1, 1]'], correct: 0, explain: 'First basis vector [1,0].' },
      { id: 't15-r4', type: 'apply', q: 'Tensor product |0⟩⊗|0⟩ is written:', opts: ['|00⟩', '|0+0⟩', '|0,0⟩'], correct: 0, explain: 'Concatenate basis labels: |00⟩.' },
      { id: 't15-r5', type: 'mcq', q: 'Projector |0⟩⟨0| keeps:', opts: ['Only |0⟩ component', 'Only |1⟩ component', 'Both equally'], correct: 0, explain: 'Projects onto the |0⟩ subspace.' }
    ]
  },
  t16: {
    passAt: 4,
    questions: [
      { id: 't16-r1', type: 'mcq', q: '17 mod 5 = ?', opts: ['3', '2', '12'], correct: 1, explain: 'Remainder 2.' },
      { id: 't16-r2', type: 'tf', q: 'RSA arithmetic uses mod N for N = pq.', answer: true, explain: 'Operations wrap in ℤ_N.' },
      { id: 't16-r3', type: 'fill', q: '23 mod 7 = ?', accept: ['2'], numeric: true, explain: '21 is 3×7, remainder 2.', wrongExplain: '23 ÷ 7 = 3 remainder 2, so 23 mod 7 = 2.' },
      { id: 't16-r4', type: 'apply', q: 'Hard in crypto: given g^x mod p, find x. That is the:', opts: ['Discrete log problem', 'Sorting problem', 'Grover problem'], correct: 0, explain: 'Discrete log hardness underpins DH/ECC.' },
      { id: 't16-r5', type: 'mcq', q: 'a ≡ b (mod n) means:', opts: ['a = b', 'a−b is a multiple of n', 'a+b = n'], correct: 1, explain: 'Congruence: same remainder class.' }
    ]
  },
  t17: {
    passAt: 4,
    questions: [
      { id: 't17-r1', type: 'mcq', q: 'High entropy means:', opts: ['Short key', 'Hard to guess', 'Fast cipher'], correct: 1, explain: 'Unpredictability protects keys.' },
      { id: 't17-r2', type: 'tf', q: 'Biased RNG output can be fixed with extraction.', answer: true, explain: 'Hash/extractors turn weak randomness into usable keys.' },
      { id: 't17-r3', type: 'fill', q: 'Uniform 256-bit key has how many bits of entropy?', accept: ['256'], numeric: true, explain: 'Each bit equally unknown gives 256 bits.', wrongExplain: 'A uniform 256-bit string has 256 bits of entropy because each bit is an independent coin flip.' },
      { id: 't17-r4', type: 'apply', q: 'Repeated TLS nonces break security because:', opts: ['Low entropy reuse', 'AES is slow', 'Hashes collide'], correct: 0, explain: 'Nonce reuse can leak plaintext (e.g. GCM).' },
      { id: 't17-r5', type: 'mcq', q: 'Min-entropy captures:', opts: ['Average guessability', 'Worst-case guessability', 'Key length'], correct: 1, explain: 'Conservative measure for adversaries.' }
    ]
  },
  t21: {
    passAt: 4,
    questions: [
      {
        id: 't21-r1',
        type: 'mcq',
        q: 'In this app, exercises use JavaScript because:',
        opts: ['Python is wrong for quantum', 'Browsers cannot run Python directly', 'JS is faster than C'],
        correct: 1,
        explain: 'We practice the same logic in an in-browser sandbox.'
      },
      {
        id: 't21-r2',
        type: 'fill',
        q: '0.8 ** 2 = ?',
        accept: ['0.64'],
        numeric: true,
        explain: 'Power operator: 0.64.',
        wrongExplain: 'Use ** for powers: 0.8×0.8 = 0.64 (a Born-rule style probability).'
      },
      {
        id: 't21-r3',
        type: 'tf',
        q: 'Qiskit, Cirq, and PennyLane expose quantum tools primarily through Python.',
        answer: true,
        explain: 'Industry learning paths assume comfort reading small Python scripts.'
      },
      {
        id: 't21-r4',
        type: 'apply',
        q: 'Input "2 3" should return sum "5". First step in solve(input)?',
        opts: ['input.trim().split(/\\s+/)', 'return 5 immediately', 'import numpy'],
        correct: 0,
        explain: 'Parse tokens, map to numbers, then add and String(...) the result.'
      },
      {
        id: 't21-r5',
        type: 'mcq',
        q: 'Level 2 goal is to:',
        opts: ['Memorize all of Python', 'Read, edit, and interpret small scripts for quantum tooling', 'Replace math with code only'],
        correct: 1,
        explain: 'Comfort with snippets beats professional software engineering here.'
      }
    ]
  },
  t22: {
    passAt: 4,
    questions: [
      { id: 't22-r1', type: 'mcq', q: 'X gate matrix [[0,1],[1,0]] on [1,0]?', opts: ['[1,0]', '[0,1]', '[2,0]'], correct: 1, explain: 'Swap: [0,1].' },
      { id: 't22-r2', type: 'tf', q: 'NumPy @ is used for matrix-vector multiply in simulators.', answer: true, explain: 'Same as applying gate matrix U to state ψ.' },
      {
        id: 't22-r3',
        type: 'fill',
        q: '[[2,0],[0,3]] · [1,1] first component?',
        accept: ['2'],
        numeric: true,
        explain: '2·1 + 0·1 = 2.',
        wrongExplain: 'Top row: m00·v0 + m01·v1 = 2·1 + 0·1 = 2.'
      },
      {
        id: 't22-r4',
        type: 'apply',
        q: 'H|0⟩ has equal amplitudes. P(measuring 0)?',
        opts: ['0.5', '0.707', '1.0'],
        correct: 0,
        explain: 'Each amplitude is 1/√2; square gives 0.5.'
      },
      { id: 't22-r5', type: 'mcq', q: 'Gate Lab Play practices gates; Do here focuses on:', opts: ['Installing Python', 'Matrix-vector meaning in code', 'Breaking RSA'], correct: 1, explain: 'Do ties Level 1 math to arrays and @.' }
    ]
  },
  t23: {
    passAt: 4,
    questions: [
      { id: 't23-r1', type: 'mcq', q: 'Core of a single-qubit simulator:', opts: ['Random number GUI', 'Vectors, gates, measure by squaring', 'Only Bloch sphere drawing'], correct: 1, explain: 'State + unitary steps + Born rule.' },
      { id: 't23-r2', type: 'tf', q: 'Tracking complex phases can matter even when P(0),P(1) stay the same after one gate.', answer: true, explain: 'Interference needs relative phase before measurement.' },
      {
        id: 't23-r3',
        type: 'fill',
        q: 'H|0⟩ normalized: P0 + P1 = ?',
        accept: ['1', '1.0'],
        numeric: true,
        explain: '0.5 + 0.5 = 1.',
        wrongExplain: 'Each probability is 0.5; valid distributions sum to 1.'
      },
      {
        id: 't23-r4',
        type: 'apply',
        q: 'Why is simulating 60 qubits classically impractical?',
        opts: ['Python is slow', 'State has 2^60 amplitudes', 'Gates do not exist'],
        correct: 1,
        explain: 'Exponential memory and time in qubit count.'
      },
      { id: 't23-r5', type: 'mcq', q: 'After H on |0⟩, exercise output P0=0.50 P1=0.50 reflects:', opts: ['The Born rule', 'A bug in NumPy', 'RSA security'], correct: 0, explain: 'Squared amplitudes become measurement odds.' }
    ]
  },
  t31: {
    passAt: 4,
    questions: [
      { id: 't31-r1', type: 'mcq', q: 'Which gate creates equal superposition from |0⟩?', opts: ['X', 'H', 'Z'], correct: 1, explain: 'Hadamard maps |0⟩ to (|0⟩+|1⟩)/√2.' },
      { id: 't31-r2', type: 'tf', q: 'Measuring a superposition always returns both 0 and 1 in one shot.', answer: false, explain: 'You get one random bit per measurement.' },
      {
        id: 't31-r3',
        type: 'fill',
        q: 'Equal superposition: P(0) = ?',
        accept: ['0.5', '0.50'],
        numeric: true,
        explain: '(1/√2)² = 0.5.',
        wrongExplain: 'Square each amplitude: (1/√2)² = 0.5.'
      },
      { id: 't31-r4', type: 'apply', q: 'Algorithms need superposition plus:', opts: ['More disk', 'Interference', 'Classical cloning'], correct: 1, explain: 'Wrong paths cancel; right paths reinforce.' },
      { id: 't31-r5', type: 'mcq', q: 'Superposition is not:', opts: ['A state vector with two amplitudes', 'Unknown classical bits', 'Useful for QKD'], correct: 1, explain: 'It is genuine quantum coherence, not ignorance.' }
    ]
  },
  t32: {
    passAt: 4,
    questions: [
      { id: 't32-r1', type: 'mcq', q: 'Bloch north and south poles are:', opts: ['|0⟩ and |1⟩', 'Both |+⟩', 'Entangled pairs'], correct: 0, explain: 'North = |0⟩, south = |1⟩.' },
      { id: 't32-r2', type: 'tf', q: 'The equator holds many equal superpositions.', answer: true, explain: 'Phase on the equator; equal |0⟩/|1⟩ weight.' },
      { id: 't32-r3', type: 'mcq', q: 'H on |0⟩ moves the Bloch vector toward:', opts: ['The equator', 'The south pole only', 'Outside the sphere'], correct: 0, explain: 'From north pole to equator.' },
      { id: 't32-r4', type: 'apply', q: 'X gate on the Bloch sphere:', opts: ['Swaps |0⟩ and |1⟩ poles', 'Measures the qubit', 'Adds decoherence'], correct: 0, explain: 'π rotation exchanging poles.' },
      { id: 't32-r5', type: 'mcq', q: 'Interior Bloch points represent:', opts: ['Pure states', 'Mixed states', 'Entanglement'], correct: 1, explain: 'Only the surface is pure single-qubit states.' }
    ]
  },
  t33: {
    passAt: 4,
    questions: [
      { id: 't33-r1', type: 'mcq', q: 'Bell-state outcomes (same basis) are:', opts: ['Always opposite', 'Perfectly correlated', 'Uncorrelated'], correct: 1, explain: 'Measure both: matching bits for |Φ+⟩.' },
      { id: 't33-r2', type: 'tf', q: 'Entanglement enables faster-than-light messaging alone.', answer: false, explain: 'No signaling; correlations need classical comparison.' },
      { id: 't33-r3', type: 'mcq', q: 'QKD uses entanglement because eavesdropping:', opts: ['Speeds up keys', 'Disturbs the state detectably', 'Clones qubits freely'], correct: 1, explain: 'Measurement leaves traces.' },
      { id: 't33-r4', type: 'apply', q: 'Standard Bell prep on |00⟩:', opts: ['H on 0 then CNOT 0→1', 'X then Z', 'Measure immediately'], correct: 0, explain: 'qc.h(0); qc.cx(0,1).' },
      { id: 't33-r5', type: 'mcq', q: 'Entanglement is a property of:', opts: ['One qubit only', 'A joint multi-qubit state', 'Classical XOR'], correct: 1, explain: 'Cannot factor into separate pure states.' }
    ]
  },
  t34: {
    passAt: 4,
    questions: [
      { id: 't34-r1', type: 'mcq', q: 'Two qubits have how many basis labels?', opts: ['2', '4', '8'], correct: 1, explain: '00, 01, 10, 11.' },
      { id: 't34-r2', type: 'fill', q: '2^4 = ?', accept: ['16'], numeric: true, explain: 'Four qubits → 16 states.', wrongExplain: 'Each qubit doubles the space: 2⁴ = 16.' },
      { id: 't34-r3', type: 'tf', q: 'n qubits need a state vector of length 2^n.', answer: true, explain: 'Exponential growth is the simulation bottleneck.' },
      { id: 't34-r4', type: 'apply', q: '10 qubits classically track how many amplitudes?', opts: ['10', '1024', '2^10^10'], correct: 1, explain: '2^10 = 1024.' },
      { id: 't34-r5', type: 'mcq', q: '300 qubits roughly means:', opts: ['300 classical bits', 'More basis states than atoms in the universe', 'No exponential cost'], correct: 1, explain: '2^300 is astronomically large.' }
    ]
  },
  t35: {
    passAt: 4,
    questions: [
      { id: 't35-r1', type: 'mcq', q: 'Decoherence is:', opts: ['A gate', 'Environment destroying quantum behavior', 'A measurement outcome'], correct: 1, explain: 'Unwanted coupling to the environment.' },
      { id: 't35-r2', type: 'tf', q: 'Measurement collapses superposition irreversibly for that run.', answer: true, explain: 'State becomes an eigenstate of the measured observable.' },
      { id: 't35-r3', type: 'mcq', q: 'Engineers fight decoherence with:', opts: ['Warmer chips', 'Isolation and cryogenics', 'Bigger fonts'], correct: 1, explain: 'Reduce noise and stray interactions.' },
      { id: 't35-r4', type: 'apply', q: 'Superposition is fragile like:', opts: ['A soap bubble', 'A steel beam', 'A hash function'], correct: 0, explain: 'Noise or measurement "pops" coherence.' },
      { id: 't35-r5', type: 'mcq', q: 'After measurement, the qubit is:', opts: ['Still in the old superposition', 'In one classical outcome state', 'Entangled with the lab book only'], correct: 1, explain: 'Collapse to |0⟩ or |1⟩ (in that basis).' }
    ]
  },
  t36: {
    passAt: 4,
    questions: [
      { id: 't36-r1', type: 'mcq', q: 'One logical qubit typically needs:', opts: ['One perfect physical qubit', 'Many physical qubits', 'No physical qubits'], correct: 1, explain: 'Redundancy for error detection/correction.' },
      { id: 't36-r2', type: 'tf', q: 'Shor at scale needs large numbers of error-corrected qubits.', answer: true, explain: 'Physical noise and overhead delay cryptographically relevant machines.' },
      { id: 't36-r3', type: 'mcq', q: 'QEC syndrome measurements aim to:', opts: ['Read the logical 0/1 directly', 'Find errors without destroying encoded data', 'Break RSA today'], correct: 1, explain: 'Ancilla checks flag error patterns.' },
      { id: 't36-r4', type: 'apply', q: 'Harvest-now-decrypt-later implies:', opts: ['Wait for QEC', 'Migrate sensitive data to PQC before CRQCs exist', 'Disable all crypto'], correct: 1, explain: 'Data lifetime can exceed hardware timelines.' },
      { id: 't36-r5', type: 'mcq', q: 'QEC matters for security timelines because:', opts: ['It replaces AES', 'It sets how soon Shor-scale machines are realistic', 'It removes entanglement'], correct: 1, explain: 'Millions of physical qubits per logical qubit is costly.' }
    ]
  }
}

export function getRecallSet(topic) {
  const bank = RECALL_BANK[topic.id]
  if (bank) return bank
  if (!topic.quiz) return { passAt: 1, questions: [], todo: true }
  return {
    passAt: 1,
    questions: [{
      id: 'quiz:' + topic.id,
      type: 'mcq',
      q: topic.quiz.q,
      opts: topic.quiz.opts,
      correct: topic.quiz.correct,
      explain: topic.quiz.ok || 'Correct.'
    }],
    todo: true
  }
}

export const EXERCISE_SCAFFOLD = {
  t11: {
    pseudocode: ['Read four numbers: ax, ay, bx, by', 'Add x components: cx = ax + bx', 'Add y components: cy = ay + by', 'Return cx and cy as a string with a space'],
    syntaxHelp: ['input.trim().split(/\\s+/) splits on whitespace', 'map(Number) converts strings to numbers', 'Return with template string: `${cx} ${cy}`'],
    hints: ['Vectors add component-wise, not by length.', 'Parse four numbers from the input string first.', 'Return `${ax+bx} ${ay+by}` with a space between.']
  },
  t12: {
    pseudocode: ['Parse m00,m01,m10,m11,vx,vy from input', 'Row 0: x = m00*vx + m01*vy', 'Row 1: y = m10*vx + m11*vy', 'Return "x y"'],
    syntaxHelp: ['Six numbers in one line, space-separated', 'Matrix multiply: dot each row with the column vector', 'Return two numbers as a string'],
    hints: ['Think rows of M times column v.', 'First output number uses top row of M.', 'return `${m00*vx+m01*vy} ${m10*vx+m11*vy}`']
  },
  t14: {
    pseudocode: ['Read real amplitudes alpha and beta', 'Compute alpha² and beta²', 'Return alpha² / (alpha² + beta²) as decimal string'],
    syntaxHelp: ['a*a for squaring', 'Divide for ratio', 'String(...) or template for return type'],
    hints: ['Born rule: probability of |0⟩ is |α|² over the sum.', 'Square both amplitudes before dividing.', 'Round if needed: Math.round(p*100)/100']
  },
  t16: {
    pseudocode: ['Read integers a, b, n', 'Multiply a*b', 'Take remainder mod n (handle negatives)'],
    syntaxHelp: ['(a*b) % n in JavaScript', 'For negatives: ((r%n)+n)%n', 'Return String(result)'],
    hints: ['Modular multiplication wraps like clock arithmetic.', 'JS % can be negative; normalize into 0..n-1.', 'return String(((a*b)%n+n)%n)']
  },
  t21: {
    pseudocode: [
      'Trim input and split on whitespace',
      'Map each token with Number(...)',
      'Add the first two numbers (default 0 if missing)',
      'Return the sum as a string with String(...)'
    ],
    syntaxHelp: [
      'input.trim().split(/\\s+/) handles spaces or newlines',
      'const [x,y] = ...map(Number)',
      'return String(x + y) satisfies the test harness'
    ],
    hints: [
      'Do not return a number type; tests expect a string.',
      'Handle "10\\n20" the same as "10 20" after trim and split.',
      'Example: return String((a[0]||0) + (a[1]||0))'
    ]
  },
  t22: {
    pseudocode: [
      'Parse two numbers a and b from input',
      'X gate swaps: output is b then a',
      'Return two numbers as a string with a space'
    ],
    syntaxHelp: [
      'const [a,b] = input.trim().split(/\\s+/).map(Number)',
      'X matrix [[0,1],[1,0]] swaps components',
      'Template: return `${b} ${a}`'
    ],
    hints: [
      'You do not need full matrix code; X always swaps the two entries.',
      'Order matters: first number in output is the old second component.',
      'Match spacing: "0 1" not "0,1".'
    ]
  },
  t23: {
    pseudocode: [
      'Start with |0⟩ amplitudes a=1, b=0 (ignore input)',
      'Apply H: both amplitudes become 1/√2',
      'Square each amplitude for P0 and P1',
      'Format as P0=0.50 P1=0.50 with toFixed(2)'
    ],
    syntaxHelp: [
      'const k = 1/Math.sqrt(2)',
      'const p0 = (k*k).toFixed(2)',
      'return `P0=${p0} P1=${p1}`'
    ],
    hints: [
      'H|0⟩ is equal superposition, not [1,0].',
      'Probabilities use squares: (1/√2)² = 0.5.',
      'Print exactly two decimals: 0.50 not 0.5.'
    ]
  }
}

export function getExerciseScaffold(topic) {
  const s = EXERCISE_SCAFFOLD[topic.id]
  const hints = topic.exercise?.hints || []
  if (s) {
    return {
      pseudocode: s.pseudocode,
      syntaxHelp: s.syntaxHelp,
      hints: s.hints.length >= 3 ? s.hints : [...s.hints, ...hints].slice(0, 3)
    }
  }
  return {
    pseudocode: ['Read input from the prompt', 'Apply the rule described in Learn', 'Return a string matching the format example'],
    syntaxHelp: ['function solve(input) { ... }', 'input is a string; parse with split/map', 'return must be a string'],
    hints: hints.length ? hints : ['Re-read the prompt for the exact output shape.', 'Break the problem into parse, compute, return.', 'Check the format example before running tests.']
  }
}
