import React from 'react'

export default function About() {
  return (
    <div className="about-page">
      <h1 className="page-title">About Quantum Academy</h1>
      <p className="page-lead">
        A free, browser-based path through quantum security: math, quantum computing, classical crypto,
        the threat model, NIST post-quantum standards, and hands-on labs.
      </p>

      <section className="about-section">
        <h2>How to use this app</h2>
        <ul className="about-list">
          <li><b>Learn view:</b> Open levels, complete topics, and use tabs (Learn, Do, Play, Exercise, Recall).</li>
          <li><b>Keyboard:</b> Press ↑ and ↓ to jump between topics. Press Esc to close modals.</li>
          <li><b>Review:</b> Practice due flashcards and quizzes with spaced repetition.</li>
          <li><b>Dashboard:</b> Track XP, export progress JSON, and import on another device.</li>
          <li><b>Resources:</b> Use labeled cards in each topic or the Resource Library for all links.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Accuracy note</h2>
        <p className="page-lead">
          Content follows NIST PQC standards (FIPS 203 ML-KEM, 204 ML-DSA, 205 SLH-DSA), Shor on RSA/DH/ECC,
          Grover as a quadratic speedup on symmetric search, and harvest-now-decrypt-later as a present risk.
          Always verify against current NIST publications for production decisions.
        </p>
      </section>

      <section className="about-section">
        <h2>Settings</h2>
        <p className="page-lead">
          Toggle the animated background and optional sound from the top bar. Sound is off by default.
          Progress is stored locally under key <code>qacad_react_v1</code>.
        </p>
      </section>
    </div>
  )
}
