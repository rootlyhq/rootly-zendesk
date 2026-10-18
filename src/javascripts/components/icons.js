// Icons from @zendeskgarden/svg-icons (Apache-2.0), inlined as components.
// Props are spread so Garden wrappers (Button.StartIcon, MediaInput) can inject attributes.

export const PlusIcon = (props) => (
  <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' focusable='false' viewBox='0 0 12 12' {...props}>
    <path stroke='currentColor' strokeLinecap='round' strokeWidth='2' d='M6 2v8m4-4H2' />
  </svg>
)

export const MinusIcon = (props) => (
  <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' focusable='false' viewBox='0 0 12 12' {...props}>
    <path stroke='currentColor' strokeLinecap='round' strokeWidth='2' d='M3 6h6' />
  </svg>
)

export const SearchIcon = (props) => (
  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' focusable='false' viewBox='0 0 16 16' {...props}>
    <circle cx='6' cy='6' r='5.5' fill='none' stroke='currentColor' />
    <path stroke='currentColor' strokeLinecap='round' d='M15 15l-5-5' />
  </svg>
)
