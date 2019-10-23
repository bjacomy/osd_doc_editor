import React from 'react'

import {
  EuiButton
} from '@elastic/eui'

export default function(props) {

  return (
    <EuiButton fill iconSide="right"
      iconType="indexOpen"
      style={{ backgroundColor: '#005472' }}
      onClick={props.onClick}
    >
      Add document
    </EuiButton>
  )
}