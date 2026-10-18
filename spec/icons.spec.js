import { createRoot } from 'react-dom/client'
import { act } from 'react'
import { PlusIcon, MinusIcon, SearchIcon } from '../src/javascripts/components/icons'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('icons', () => {
  let container = null
  let root = null

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it.each([
    ['PlusIcon', PlusIcon, '12'],
    ['MinusIcon', MinusIcon, '12'],
    ['SearchIcon', SearchIcon, '16']
  ])('%s renders an svg and forwards props', (_, Icon, size) => {
    act(() => root.render(<Icon className='injected' aria-hidden='true' />))
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg.getAttribute('width')).toBe(size)
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${size} ${size}`)
    expect(svg.getAttribute('class')).toBe('injected')
    expect(svg.getAttribute('aria-hidden')).toBe('true')
  })
})
