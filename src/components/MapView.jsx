import React from 'react'
import JourneyMap from './JourneyMap.jsx'
import { CURRICULUM, LORDER } from '../data/curriculum.js'

export default function MapView({ unlockedFlags, levelProgress, currentLevel, onSelectLevel }) {
  return (
    <div className="map-view">
      <header className="page-head">
        <h1 className="page-title">Journey map</h1>
        <p className="page-lead">All 10 levels on one path. Select a level to open its first topic in Learn.</p>
      </header>
      <JourneyMap
        unlockedFlags={unlockedFlags}
        levelProgress={levelProgress}
        currentLevel={currentLevel}
        onSelectLevel={onSelectLevel}
      />
      <div className="map-level-list">
        {LORDER.map((lv, i) => {
          const data = CURRICULUM[lv]
          const unlocked = unlockedFlags[i]
          const prog = levelProgress(lv)
          return (
            <button
              key={lv}
              type="button"
              className={'map-level-row' + (unlocked ? '' : ' locked') + (currentLevel === lv ? ' current' : '')}
              disabled={!unlocked}
              onClick={() => onSelectLevel && onSelectLevel(lv)}
            >
              <span className="map-level-tag">{data.tag}</span>
              <span className="map-level-name">{data.name}</span>
              <span className="map-level-prog mono">
                {unlocked ? prog.done + '/' + prog.total + ' topics' : 'Locked'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
