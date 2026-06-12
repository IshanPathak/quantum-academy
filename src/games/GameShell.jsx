import React from 'react'

export default function GameShell({
  title,
  objective,
  round,
  totalRounds,
  score,
  feedback,
  complete,
  finalScore,
  onPlayAgain,
  onDone,
  children,
  modeToggle
}) {
  return (
    <div className="game">
      {title && <div className="game-title">{title}</div>}
      <p className="game-objective">{objective}</p>
      {modeToggle}
      {!complete && (
        <div className="game-round-bar mono">
          Round {Math.min(round + 1, totalRounds)} of {totalRounds} · Score {score}/{totalRounds}
        </div>
      )}
      {feedback && (
        <div className={'game-feedback ' + (feedback.ok ? 'ok' : 'no')}>{feedback.text}</div>
      )}
      {!complete && children}
      {complete && (
        <div className="game-complete">
          <p className="game-complete-score mono">Final score: {finalScore ?? score}/{totalRounds}</p>
          <div className="game-complete-actions">
            <button type="button" className="btn-primary btn-sm" onClick={onDone}>Done</button>
            <button type="button" className="btn-ghost btn-sm" onClick={onPlayAgain}>Play again</button>
          </div>
        </div>
      )}
    </div>
  )
}
