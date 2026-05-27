import React, { useEffect, useState } from 'react'

export function useMicroFeedback() {
  const [toast, setToast] = useState(null)

  const show = (message, type = 'xp') => {
    setToast({ message, type, id: Date.now() })
  }

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  return { toast, show }
}

export default function MicroFeedback({ toast, soundEnabled }) {
  useEffect(() => {
    if (!toast || !soundEnabled) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g)
      g.connect(ctx.destination)
      o.frequency.value = toast.type === 'unlock' ? 520 : 880
      g.gain.value = 0.04
      o.start()
      o.stop(ctx.currentTime + 0.08)
    } catch { /* optional sound */ }
  }, [toast, soundEnabled])

  if (!toast) return null
  return (
    <div className={'micro-toast micro-toast-' + toast.type} role="status">
      {toast.message}
    </div>
  )
}
