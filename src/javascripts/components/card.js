import React from 'react'
import { PALETTE } from '@zendeskgarden/react-theming'

export default function Card ({ style, children }) {
  return (
    <div style={{
      border: `1px solid ${PALETTE.grey['300']}`,
      borderRadius: '.25em',
      margin: '.5em 0',
      padding: '1em',
      ...style
    }}
    >
      {children}
    </div>
  )
}
