import React, { useEffect } from 'react'

export default function fireConfetti() {
  const colors = ['#22d3ee', '#a3e635', '#fb923c', '#c084fc', '#f472b6']
  for (let i = 0; i < 30; i++) {
    const c = document.createElement('div')
    c.className = 'confetti'
    c.style.left = Math.random() * 100 + 'vw'
    c.style.top = '-10px'
    c.style.background = colors[i % 5]
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'
    document.body.appendChild(c)
    const dur = 1 + Math.random() * 1.5, dx = (Math.random() - 0.5) * 200
    c.animate([
      { transform: 'translateY(0) rotate(0)', opacity: 1 },
      { transform: `translateY(100vh) translateX(${dx}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], { duration: dur * 1000, easing: 'cubic-bezier(.3,.7,.5,1)' })
    setTimeout(() => c.remove(), dur * 1000)
  }
}
