import { describe, expect, it } from 'vitest'
import { slugifyText, resolveCourseSlug } from './slugs'

describe('slugifyText', () => {
  it('transliterates Cyrillic to Latin', () => {
    expect(slugifyText('Острый аппендицит')).toBe('ostryy-appendicit')
  })

  it('lowercases and collapses whitespace/punctuation into single dashes', () => {
    expect(slugifyText('Hello,   World!!')).toBe('hello-world')
  })

  it('strips leading and trailing dashes', () => {
    expect(slugifyText('  --Test--  ')).toBe('test')
  })

  it('returns an empty string for input with no sluggable characters', () => {
    expect(slugifyText('***')).toBe('')
  })

  it('handles soft/hard sign removal without leaving a dash', () => {
    expect(slugifyText('подъезд')).toBe('podezd')
  })
})

describe('resolveCourseSlug', () => {
  it('prefers an existing slug over the title', () => {
    expect(resolveCourseSlug({ slug: 'existing-slug', title: 'Ignored Title' })).toBe(
      'existing-slug'
    )
  })

  it('falls back to slugifying the title when slug is null', () => {
    expect(resolveCourseSlug({ slug: null, title: 'Новый курс' })).toBe('novyy-kurs')
  })

  it('falls back to slugifying the title when slug is an empty/whitespace string', () => {
    expect(resolveCourseSlug({ slug: '   ', title: 'Basic Surgery' })).toBe('basic-surgery')
  })
})
