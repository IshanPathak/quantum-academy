import React, { useState } from 'react'

const SLIDES = [
  {
    title: 'Welcome to Quantum Academy',
    body: 'A guided path from math and quantum basics to post-quantum cryptography and real migration work. Progress saves in your browser.'
  },
  {
    title: 'How each topic works',
    body: 'Use Learn for concepts, Do for steps, Play for games, Exercise for coding drills, and Recall for quizzes. Complete topics to earn XP and unlock levels.'
  },
  {
    title: 'Review and Dashboard',
    body: 'Review uses spaced repetition on quizzes and flashcards (check the due badge). Dashboard shows stats and lets you export or import progress JSON.'
  },
  {
    title: 'You are ready',
    body: 'Open Map to see all 10 levels. Use the sidebar to pick topics. Arrow keys move between topics while you read. Open the glossary anytime. Start with Level 0.'
  }
]

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const slide = SLIDES[step]
  const last = step === SLIDES.length - 1

  return (
    <div className="modal-backdrop onboarding-backdrop" role="dialog" aria-modal="true">
      <div className="onboarding-card">
        <div className="onboarding-dots">
          {SLIDES.map((_, i) => (
            <span key={i} className={'onboarding-dot' + (i === step ? ' active' : '')} />
          ))}
        </div>
        <h2 className="onboarding-title">{slide.title}</h2>
        <p className="onboarding-body">{slide.body}</p>
        <div className="onboarding-actions">
          <button type="button" className="btn-ghost" onClick={onComplete}>Skip</button>
          {!last ? (
            <button type="button" className="btn-primary" onClick={() => setStep((s) => s + 1)}>Next</button>
          ) : (
            <button type="button" className="btn-primary" onClick={onComplete}>Start learning</button>
          )}
        </div>
      </div>
    </div>
  )
}
