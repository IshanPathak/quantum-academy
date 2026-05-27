import React from 'react'
import { resourceType, RESOURCE_TYPE_LABELS } from '../utils/resources.js'

export default function ResourceCards({ resources, title, emptyLabel }) {
  if (!resources || resources.length === 0) {
    if (emptyLabel) return <p className="resource-empty">{emptyLabel}</p>
    return null
  }
  return (
    <section className="resource-section">
      {title && <h3 className="resource-section-title">{title}</h3>}
      <div className="resource-grid resource-grid-inline">
        {resources.map(([name, url], i) => {
          const type = resourceType(url, name)
          return (
            <a
              key={i}
              className={'resource-card type-' + type}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="resource-type-badge">{RESOURCE_TYPE_LABELS[type]}</span>
              <span className="resource-card-title">{name}</span>
              <span className="resource-card-link">Open ↗</span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
