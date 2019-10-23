import React, {
  Component
} from 'react';
import ReactDOM from 'react-dom';
import FontAwesome from 'react-fontawesome';

import {
  EuiHeader,
  EuiHeaderLogo,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiLink,
  EuiTitle,
} from '@elastic/eui';

export default function Header(props) {

  let firstPageLink
  if (props.firstPage !== true)
  firstPageLink = (
    <EuiHeaderSectionItem border="right">
      <EuiLink
        href="#/"
        onClick={e => {
          e.preventDefault()
          props.onClickHome()
        }}
      >
        <FontAwesome
        className='fas fa-arrow-circle-left'
        name='fas fa-arrow-circle-left'
        size='3x'
        style={{ color: '#025471', paddingLeft: '15px', marginTop: '10px' ,width: '70px'}}/>
      </EuiLink>
    </EuiHeaderSectionItem>
  )


  return (
    <div>
    <EuiHeader>
      <EuiHeaderSection>
        {firstPageLink}
        <EuiHeaderLogo
          aria-label="Doc Editor logo"
          iconType="indexEdit"
          size='xxl'
          style={{ color: '#025471', paddingLeft: '20px', marginTop: '10px', width: '50px'}}

        />
        <EuiTitle size="l">
          <h1 style={{ color: '#025471', padding:'10px'}}>Doc Editor</h1>
        </EuiTitle>

      </EuiHeaderSection>
    </EuiHeader>
    </div>
  )
  
}
