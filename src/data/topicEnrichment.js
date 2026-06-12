const WHY = {
  t01: 'Every HTTPS session, bank transfer, and password manager depends on encryption that quantum computers will eventually break.',
  t02: 'Long-lived secrets (health records, state archives) sent under RSA today may already be stored for future decryption.',
  t03: 'Knowing the full path helps you prioritize time and pick a career branch in PQC, QKD, governance, or research.',
  t11: 'Qubit states are vectors. You need this language before Bloch spheres, gates, and simulators make sense.',
  t12: 'Every quantum gate is a matrix. Matrix multiplication is how circuits transform qubit states.',
  t13: 'Amplitudes are complex numbers. Interference (and thus Grover and many quantum effects) needs complex math.',
  t14: 'Measurement probabilities come from amplitudes squared. This links quantum math to the random outcomes you measure.',
  t15: 'Papers, textbooks, and IBM docs use bra-ket notation. Recognizing it prevents notation from blocking your reading.',
  t16: 'RSA, Diffie-Hellman, and ECC all live on modular arithmetic. Shor attacks that same structure.',
  t17: 'Key strength is unpredictability. Low entropy keys fail even when the algorithm is quantum-safe.',
  t21: 'Qiskit, Cirq, and lab scripts are Python-first. Comfort here unlocks hands-on quantum and crypto tooling.',
  t22: 'Simulators and many PQC demos apply matrices to vectors. NumPy thinking maps directly to gate operations.',
  t23: 'Building a toy simulator proves you understand states, gates, and measurement without trusting a black box.',
  t31: 'Superposition is the fuel for quantum algorithms and for understanding why simulation scales as 2^n.',
  t32: 'The Bloch sphere is the standard mental model for single-qubit gates used in labs and textbooks.',
  t33: 'Entanglement underpins QKD security arguments and many quantum networking ideas.',
  t34: 'Multi-qubit state space growth explains why breaking RSA needs millions of qubits, not hundreds.',
  t35: 'Decoherence and measurement limits set realistic timelines for cryptographically relevant quantum computers.',
  t36: 'Error correction overhead is the main reason Shor on RSA-2048 needs huge machines, not a laptop qubit count.',
  t41: 'Reading circuits lets you follow Shor/Grover diagrams and vendor documentation without getting lost.',
  t42: 'Deutsch-Jozsa is the simplest proof that quantum query complexity can beat classical limits.',
  t43: 'Shor is why governments and enterprises are migrating off RSA, DH, and ECC right now.',
  t44: 'Grover is why NIST and industry recommend AES-256 and larger hashes for long-term symmetric security.',
  t51: 'Defenders must know which algorithms Shor kills vs which ones only need larger keys.',
  t52: 'RSA is still everywhere in legacy systems. You need to know exactly what Shor breaks.',
  t53: 'Integrity and certificates rely on hashes. Grover changes how much margin you need in hash output size.',
  t54: 'TLS and VPN key exchange use DH/ECDHE today. Those sessions need PQC KEMs during migration.',
  t55: 'Bulk data encryption (disk, TLS payloads) is mostly AES. Grover determines whether AES-128 is enough.',
  t56: 'TLS 1.3 and modern apps use ECC for handshakes. Shor forces hybrid and PQC replacements.',
  t57: 'PKI and TLS are how users actually encounter crypto. Migration happens at certificates and cipher suites.',
  t58: 'Code signing and document trust move to ML-DSA (FIPS 204) and SLH-DSA (FIPS 205) over time.',
  t61: 'Security teams triage by attack type: replace asymmetric first, harden symmetric second.',
  t62: 'Timelines are uncertain, but harvest-now-decrypt-later means waiting for certainty is unsafe.',
  t63: 'PQC math can be strong while the implementation leaks keys through timing or power analysis.',
  t64: 'Resource estimates turn "quantum threat" into planning inputs for budgets and migration dates.',
  t65: 'CNSA 2.0 and similar policies set real deadlines for vendors selling to government and defense.',
  t71: 'FIPS 203/204/205 are the standards your organization will cite in procurement and architecture docs.',
  t72: 'QKD is a niche but real tool for high-value links where physics-based key delivery is worth the cost.',
  t73: 'True randomness strengthens keys for both classical and post-quantum algorithms.',
  t74: 'Kyber (ML-KEM) is the algorithm most TLS hybrid deployments add first.',
  t75: 'Signatures affect firmware, packages, and certificates. Dilithium and SLH-DSA sizes matter for bandwidth.',
  t76: 'Hybrid TLS is what browsers and CDNs ship today: classical plus PQC during the transition.',
  t77: 'Honest QKD limits prevent over-selling quantum links where PQC plus good auth is enough.',
  t78: 'Algorithm diversity limits damage if one mathematical family is broken unexpectedly.',
  t79: 'Toy LWE exercises build intuition for why Kyber noise and parameters matter (without rolling your own crypto).',
  t81: 'The PQC track mirrors how engineering teams deploy Kyber, Dilithium, and audited libraries.',
  t8p1: 'Module-LWE hardness is the security story behind ML-KEM and ML-DSA.',
  t8p2: 'Kyber is practical because Module-LWE shrinks keys and speeds up polynomial math.',
  t8p3: 'Encaps/decaps is the interface OpenSSL and TLS hybrids actually call.',
  t8p4: 'Production PQC is integration and side-channel hardening, not reimplementing lattice math.',
  t8p5: 'Signature size and verification speed drive TLS certificate and firmware update planning.',
  t8p6: 'Lattice implementations have leaked keys in other eras. Constant-time code matters here too.',
  t8p7: 'Migration is a multi-year engineering program, not a single algorithm swap.',
  t82: 'QKD specialists need physics literacy plus classical authentication awareness.',
  t83: 'Cryptanalysis literacy helps you read timelines and separate hype from resource estimates.',
  t8c1: 'Classical attacks still matter during migration. Weak RSA-1024 fails before Shor arrives.',
  t8c2: 'Period finding plus QFT is the conceptual core every defender should recognize.',
  t8c3: 'Qubit count headlines only make sense with error correction and gate cost context.',
  t8c4: 'Grover iteration counts explain why symmetric keys need doubling, not abandoning AES.',
  t8c5: 'Symmetric policy (AES-256, SHA-384+) is the fast win while asymmetric migration proceeds.',
  t8c6: 'Reading papers lets you update risk models when estimates improve.',
  t84: 'QRNG feeds key generation; it does not replace ciphers or signatures.',
  t85: 'Governance roles own inventory, policy, and compliance timelines for PQC.',
  t86: 'Network security architects combine PQC, QKD, and operations for backbone designs.',
  t87: 'liboqs and oqs-provider are how most teams first touch real Kyber bytes on the wire.',
  t88: 'Inventory and migration plans are what CISOs fund. This is employable work.',
  t89: 'Specializing early helps you build a portfolio that matches job postings.',
  t91: 'Hiring managers look for repos and write-ups, not completion badges alone.',
  t92: 'CTFs and communities turn knowledge into reflexes and professional connections.',
  t93: 'Capstone projects demonstrate end-to-end ability across math, code, and policy.',
  t94: 'The field moves yearly. Maintenance learning is part of the job, not an optional extra.'
}

const DEEP_KP = {
  t01: {
    keyPoints: ['Quantum threatens widely deployed public-key crypto', 'PQC, QKD, and threat analysis are the three pillars', 'Migration work exists in industry today']
  },
  t03: {
    deep: 'Levels build on each other: math and code before algorithms, classical crypto before PQC, threat model before specialization. Skipping foundations makes later topics feel like magic rather than engineering.\n\nUse the journey map to see progress. Unlocking a level means you have recall-level familiarity with prerequisites, not perfection.',
    keyPoints: ['Foundations before specialization', 'Each level unlocks the next', 'Games and exercises reinforce recall']
  },
  t32: {
    deep: 'The Bloch vector (x,y,z) maps to state parameters. Rotations around x, y, z axes correspond to common gates (RX, RY, RZ). Global phase does not change measurement statistics but matters for interference in multi-gate circuits.',
    keyPoints: ['|0⟩ north pole, |1⟩ south pole', 'Equator = equal superpositions', 'Gates = rotations on the sphere']
  },
  t33: {
    deep: 'Bell states are maximally entangled two-qubit states. Correlations cannot be explained by shared classical randomness alone (Bell inequality violations). For security: entanglement-based QKD protocols rely on monogamy and measurement disturbance.',
    keyPoints: ['Entangled qubits show correlated outcomes', 'No faster-than-light signaling', 'QKD exploits disturbance on intercept']
  },
  t34: {
    deep: 'Tensor products build multi-qubit state spaces. An n-qubit register has dimension 2^n. Most gates are local (act on one or two qubits) but embed into the full 2^n space. Simulation cost is why classical brute force of 256-bit keys is hard but 40-qubit states strain laptops.',
    keyPoints: ['n qubits → 2^n amplitudes', 'Exponential state space', 'Classical simulation hits walls near ~40-50 qubits']
  },
  t35: {
    deep: 'Measurement projects the state onto a basis. Decoherence is entanglement with the environment, effectively leaking which-basis information. T1 (energy relaxation) and T2 (dephasing) times quantify how long superposition survives on hardware.',
    keyPoints: ['Measurement collapses superposition', 'Decoherence = unwanted measurement', 'Hardware coherence times limit circuit depth']
  },
  t36: {
    deep: 'Surface codes are a leading family: logical error rate drops exponentially with code distance if physical error rates stay below a threshold. Shor circuits need logical qubits for modular exponentiation, so physical qubit counts balloon.',
    keyPoints: ['Many physical qubits per logical qubit', 'Shor needs logical depth + width', 'Timelines depend on QEC progress']
  },
  t51: {
    deep: 'Symmetric keys must stay secret; asymmetric uses public keys for distribution and signatures. Quantum attacks split: Shor on public-key structures, Grover on brute-force search of symmetric keys and hash preimages (with different constants).',
    keyPoints: ['Symmetric = shared secret', 'Asymmetric = public/private pair', 'Shor vs Grover map to different families']
  },
  t52: {
    deep: 'RSA key generation picks primes p,q, sets N=pq, chooses public exponent e, private d with ed≡1 (mod φ(N)). Encryption uses modular exponentiation. Security reduces to factoring N. Shor factors N in polynomial time on a large enough quantum computer.',
    keyPoints: ['Security = factoring hardness', 'Key sizes (2048, 3072) set classical margin', 'Shor removes that margin']
  },
  t53: {
    deep: 'Collision resistance: hard to find x≠y with H(x)=H(y). Preimage resistance: given y, hard to find x with H(x)=y. Grover speeds search roughly quadratically, so hash output lengths are sized with quantum margin in mind.',
    keyPoints: ['Hashes are one-way fingerprints', 'Collisions break integrity', 'Use larger outputs for long-term hashes']
  },
  t54: {
    deep: 'DH exchanges g^a and g^b over a group; shared secret is g^(ab). ECC uses curve points instead of integers. Both reduce to discrete log hardness. Recorded TLS handshakes with classical DH/ECDHE are harvestable for later Shor attacks.',
    keyPoints: ['Shared secret without sending it', 'Discrete log hardness', 'Replace with PQC KEM in TLS']
  },
  t61: {
    deep: 'Run an inventory: asymmetric (RSA, ECC, DH), symmetric (AES modes), hashes, signatures, protocols (TLS, VPN, email). Prioritize long-lived confidentiality and authentication that must survive 10+ years.',
    keyPoints: ['Shor → RSA/ECC/DH first', 'Grover → AES/hash sizing', 'Inventory drives migration order']
  },
  t62: {
    deep: 'Predictions range widely because qubit quality, error rates, and algorithm improvements move targets. Risk management uses conservative estimates while starting migration now for data with long confidentiality needs.',
    keyPoints: ['Hardware still noisy and small', 'Timelines uncertain', 'HNDL drives action before certainty']
  },
  t63: {
    deep: 'Timing attacks observe how long operations take. Power analysis correlates energy use with secret bits. PQC implementations must use constant-time decaps and careful memory access like classical crypto already demands.',
    keyPoints: ['Math strength ≠ implementation safety', 'Constant-time code matters', 'Test with side-channel tooling in staging']
  },
  t72: {
    deep: 'BB84 uses two non-commuting bases. Eavesdropping introduces detectable error rates. Practical QKD still needs authenticated classical channels for sifting and error correction. Device flaws (detector blinding) have broken commercial systems in research settings.',
    keyPoints: ['Security from measurement disturbance', 'Needs special hardware', 'Authentication still required']
  },
  t73: {
    deep: 'Pseudo-random generators are deterministic given seed state. QRNGs harvest quantum noise (photon paths, vacuum fluctuations). Use QRNG output to seed CSPRNGs or derive keys per product design. QRNG does not replace encryption algorithms.',
    keyPoints: ['True randomness for key material', 'Not a cipher by itself', 'Pairs with proper key derivation']
  },
  t82: {
    deep: 'QKD deployments target dedicated fiber links, government backbones, and financial hubs. Combine with PQC for internet-scale use cases. Understand BB84 error rates, key rates, and trusted-node architectures.',
    keyPoints: ['Physics-based key delivery', 'Distance and rate limits', 'Complements, not replaces, PQC']
  },
  t84: {
    deep: 'Entropy sources must be vetted. Health tests detect stuck outputs. QRNG integrates into HSMs and key ceremonies. Compliance frameworks may require documented randomness sources.',
    keyPoints: ['Feeds key generation', 'Health monitoring required', 'Part of broader key management']
  },
  t85: {
    deep: 'Roles include policy writers, auditors, and program managers tracking algorithm inventory, vendor roadmaps, and NIST/CNSA deadlines. Technical depth plus communication skills are the differentiator.',
    keyPoints: ['Inventory and compliance timelines', 'Vendor and standards tracking', 'Bridge technical and business teams']
  },
  t86: {
    deep: 'Combines TLS/PQC migration on general networks with optional QKD on high-value links. Threat modeling includes both mathematical breaks and operational compromise of endpoints.',
    keyPoints: ['Layered controls', 'PQC for scale, QKD for select links', 'Operations matter as much as algorithms']
  },
  t91: {
    deep: 'Portfolio pieces should be reproducible: README with threat model, setup steps, and demo commands. Link blog posts that explain one finding in plain language for non-specialist hiring managers.',
    keyPoints: ['Public repos with READMEs', 'Demonstrate one vertical deeply', 'Write for technical and general readers']
  },
  t92: {
    deep: 'CTFs teach implementation bugs and protocol misuse faster than reading alone. Conferences (PQCrypto, RWC) expose you to current research. Balance depth in one branch with awareness of the full field.',
    keyPoints: ['Practice beats passive reading', 'Community for jobs and papers', 'Pick a branch and go deep']
  }
}

const EXERCISE_META = {
  t11: {
    formatExample: 'Return two numbers as a space-separated string, e.g. "3 4"',
    hints: ['Add x components, then y components.', 'Do not return brackets or commas.']
  },
  t16: {
    formatExample: 'Return one integer string in range 0..n-1, e.g. "6"',
    hints: ['Use (a*b) % n, then fix negatives with ((r%n)+n)%n.', '17 mod 5 = 2.']
  },
  t21: { formatExample: 'Return one integer as a string, e.g. "42"', hints: ['Use ** for power in JS.', 'Return String(n), not a number type.'] },
  t22: { formatExample: 'Return dot product as a string, e.g. "11"', hints: ['Sum products of matching components.', 'ax*bx + ay*by'] },
  t23: { formatExample: 'Return four amplitudes space-separated, e.g. "0 0 1 0"', hints: ['Flip sign at index m.', 'Reflect about average: 2*avg - x'] },
  t43: { formatExample: 'Return one integer string, e.g. "4"', hints: ['Use modular exponentiation (square-and-multiply).', 'Reduce mod n after each step.'] },
  t44: { formatExample: 'Return four numbers space-separated, e.g. "0 0 1 0"', hints: ['Same reflection pattern as t23.', 'Mark index m by negating that slot.'] },
  t74: {
    formatExample: 'Return FIPS number as digits, e.g. "203"',
    hints: ['kem → 203, sig → 204, hashsig → 205.', 'Input is lowercase keyword only.']
  },
  t79: {
    formatExample: 'Return b as a string integer, e.g. "6"',
    hints: ['b = (a*s + e) mod q.', 'For negatives: ((b % q) + q) % q.']
  },
  t8c4: {
    formatExample: 'Return iteration count as a string, e.g. "13"',
    hints: ['Use Math.round((Math.PI/4) * Math.sqrt(N)).', 'N=256 → sqrt(N)=16 → about 13 iterations.']
  }
}

export function enrichAll(curriculum) {
  Object.keys(curriculum).forEach((lv) => {
    const lvData = curriculum[lv]
    curriculum[lv].topics.forEach((topic) => {
      if (WHY[topic.id] && !topic.whyMatters) topic.whyMatters = WHY[topic.id]
      const extra = DEEP_KP[topic.id]
      if (extra) {
        if (extra.deep && !topic.deep) topic.deep = extra.deep
        if (extra.keyPoints && (!topic.keyPoints || !topic.keyPoints.length)) {
          topic.keyPoints = extra.keyPoints
        }
      }
      if (!topic.keyPoints || !topic.keyPoints.length) {
        if (topic.deep) {
          topic.keyPoints = [topic.learn.replace(/<[^>]+>/g, '').slice(0, 120) + '…']
        }
      }
      if (topic.exercise && EXERCISE_META[topic.id]) {
        Object.assign(topic.exercise, EXERCISE_META[topic.id])
      }
    })
  })
}
