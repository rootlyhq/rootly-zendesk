import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Title, Close } from '@zendeskgarden/react-notifications'
import { clearError } from '../../javascripts/redux/slices/error'

export default function ErrorNotice() {
  const dispatch = useDispatch()
  const error = useSelector((state) => state.error)

  if (!error) return null

  return (
    <Alert type="error">
      <Title>Error</Title>
      {error.message || "Internal error occurred. Please try again or contact Rootly support."}
      <Close aria-label="Dismiss error alert" onClick={() => dispatch(clearError())}/>
    </Alert>
  )
}
