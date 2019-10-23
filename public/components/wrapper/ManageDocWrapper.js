import React, {
  Component, 
  Fragment
} from 'react'

import {
  EuiPortal
} from '@elastic/eui'

import ManageDocFlyout from '../flyout/ManageDocFlyout';


export default class ManageDocWrapper extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isVisible: false
    }

    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
  }

  open(e) {
    this.setState({isVisible:true})
  }

  close(e) {
    this.setState({isVisible:false})
  }
  
  render() {

    let portal = null
    if (this.state.isVisible) {
      portal = (
        <EuiPortal>
          <ManageDocFlyout
            close={this.close} 
            index={this.props.index}  
            mapping={this.props.mapping}
            docToEdit={this.props.data}
            saveDoc={this.props.submitCallback}
          />
        </EuiPortal>
      )
    }
  
  
    return (
      <Fragment>
        {portal}
        {React.cloneElement(this.props.children, { 
          onClick: this.open 
          })}
      </Fragment>
    )
  }
}