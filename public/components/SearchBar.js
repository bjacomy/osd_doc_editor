import React, {
  Component,
  Fragment,
} from 'react';
import ReactDOM from 'react-dom';

import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFieldSearch,
  EuiSearchBar
} from '@elastic/eui';


export default function SearchBar(props) {

  const handleSearch = e => {
    props.search({query: e.queryText})
  }

  return (
    <EuiFlexGroup gutterSize="m">
      <EuiFlexItem>
        <EuiSearchBar fullWidth onChange={handleSearch} query={props.queryText || ""} placeholder="Search..." />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
  
}