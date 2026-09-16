import React from 'react'
import useRequireAuth from '../hooks/useRequireAuth';
export default function Message() {
  // Keep this placeholder route ready for the future messaging view.
  useRequireAuth();

  return (

    <div>
      Messages
    </div>
  )
}
