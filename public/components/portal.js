import React, {
  Component,
  Fragment,
} from 'react';
import FontAwesome from 'react-fontawesome';
import ReactDOM from 'react-dom';
import {
  EuiSelect,
  EuiCheckboxGroup,
  EuiSpacer,
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiTextColor,
  EuiTitle,
  EuiSwitch,
  EuiHeader,
  EuiHeaderBreadcrumbs,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderSectionItemButton,
  EuiHeaderLogo,
  EuiIcon,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiButtonEmpty,
  EuiCheckbox,
  EuiLink,
} from '@elastic/eui';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPortalVisible: this.props.visible,
      checkAllDoc: this.props.checkAllDoc,
      tabItems: this.props.tabItems,
      itemsAreTrue: this.props.itemsAreTrue,
      total:this.props.total
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({isPortalVisible: nextProps.visible,
                   checkAllDoc: nextProps.checkAllDoc,
                   tabItems: nextProps.tabItems,
                   itemsAreTrue: nextProps.itemsAreTrue,
                   total:this.props.total
                   })
  }

  checkAllDocs = () => {
        this.props.checkAllDocs();
  }

  render() {
    let portal;

    if (this.state.isPortalVisible == true && this.state.checkAllDoc == false) {
      portal = (
        <div style={{display: 'block',marginLeft: '28%', marginRight: 'auto',padding: '15px',marginTop: '-45px'}}>
          <p style={{fontWeight: 'bold'}}>
            The {(this.state.tabItems)} documents on this page are selected. {(
              <EuiLink
                onClick={this.checkAllDocs}
              >
                Select all the {(this.state.total)} documents?
              </EuiLink>
            )}
          </p>
        </div>
      );
    }
    if (this.state.isPortalVisible == true && this.state.checkAllDoc == true && this.state.itemsAreTrue)  {
      portal = (
        <div style={{display: 'block',marginLeft: '33%', marginRight: 'auto',padding: '15px',marginTop: '-45px'}}>
          <p style={{fontWeight: 'bold'}}>
            All the {(this.state.total)} documents are selected. {(
              <EuiLink
                onClick={this.checkAllDocs}
              >
                cancel the selection?
              </EuiLink>
            )}
          </p>
        </div>
      );
    }
    if (this.state.isPortalVisible == true && this.state.checkAllDoc == true && ! this.state.itemsAreTrue)  {
      portal = (
        <div style={{display: 'block',marginLeft: '27%', marginRight: 'auto',padding: '15px',marginTop: '-45px'}}>
          <p style={{fontWeight: 'bold'}}>
            All documents are selected except those you have unchecked. {(
              <EuiLink
                onClick={this.checkAllDocs}
              >
                cancel the selection?
              </EuiLink>
            )}
          </p>
        </div>
      );
    }
    if(this.state.tabItems == 0){
      portal = (
        <div style={{display: 'block',marginLeft: '40%', marginRight: 'auto'}}>
        <FontAwesome
        className='fas fa-exclamation-triangle'
        name='fas fa-exclamation-triangle'
        size='2x'
        style={{ color: '#0079a5',height: '40px'}}
        />
        <EuiTitle size="m">
          <h1 style={{ color: '#0079a5', fontWeight: '900', padding:'10px', marginTop: '-50px', marginLeft:'25px'}}>Empty Index</h1>
        </EuiTitle>
        </div>
      );
    }

    return (
    	<div>
      {portal}
      </div>
    );
  }
}
