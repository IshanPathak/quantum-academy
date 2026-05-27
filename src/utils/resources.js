import { CURRICULUM, LORDER } from '../data/curriculum.js'

export function resourceType(url = '', label = '') {
  const u = (url || '').toLowerCase()
  const l = (label || '').toLowerCase()
  if (u.includes('youtube.com') || u.includes('youtu.be') || l.includes('▶') || l.includes('video')) return 'video'
  if (u.includes('arxiv.org') || l.includes('paper') || l.includes('survey')) return 'paper'
  if (u.includes('coursera') || l.includes('course') || l.includes('ocw')) return 'course'
  if (u.includes('nist.gov') || u.includes('fips') || u.includes('csrc.nist')) return 'standard'
  if (u.includes('github.com')) return 'code'
  return 'docs'
}

export const RESOURCE_TYPE_LABELS = {
  video: 'Video',
  docs: 'Documentation',
  course: 'Course',
  paper: 'Paper',
  standard: 'Standard',
  code: 'Code'
}

export function collectAllResources() {
  const items = []
  LORDER.forEach((lv) => {
    const level = CURRICULUM[lv]
    level.topics.forEach((t) => {
      ;(t.res || []).forEach(([name, url]) => {
        items.push({
          id: `${t.id}:res:${url}`,
          name,
          url,
          type: resourceType(url, name),
          topicId: t.id,
          topicTitle: t.title,
          levelId: lv,
          levelName: level.name,
          section: 'core'
        })
      })
      ;(t.extraResources || []).forEach(([name, url]) => {
        items.push({
          id: `${t.id}:extra:${url}`,
          name,
          url,
          type: resourceType(url, name),
          topicId: t.id,
          topicTitle: t.title,
          levelId: lv,
          levelName: level.name,
          section: 'deeper'
        })
      })
    })
  })
  return items
}
