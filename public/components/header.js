import React, {
  Component,
  Fragment,
} from 'react';
import FontAwesome from 'react-fontawesome';
import ReactDOM from 'react-dom';
import {
  EuiBadge,
  EuiHealth,
  EuiButton,
  EuiButtonIcon,
  EuiCheckbox,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLink,
  EuiPopover,
  EuiSpacer,
  EuiTable,
  EuiTableBody,
  EuiTableHeader,
  EuiTableHeaderCell,
  EuiTableHeaderCellCheckbox,
  EuiTablePagination,
  EuiTableRow,
  EuiTableRowCell,
  EuiTableRowCellCheckbox,
  EuiButtonEmpty,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiRange,
  EuiSwitch,
  EuiSelect,
  EuiText,
  EuiTextColor,
  EuiTitle,
  EuiPortal,
  EuiBottomBar,
  EuiHeader,
  EuiHeaderBreadcrumbs,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderSectionItemButton,
  EuiHeaderLogo,
  makeId,
  LEFT_ALIGNMENT,
  RIGHT_ALIGNMENT,
  Pager,
  SortableProperties,
  EuiPopoverTitle,
  EuiDescriptionList,
  EuiComboBox,
} from '@elastic/eui';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPortalVisible: this.props.pVisible,
      isModalVisible: this.props.mVisible,
    };

    this.indexFd = this.props.indexFd;
    this.mapping = this.props.mapping;
    this.closeFunction = this.closeFunction.bind(this);
    this.showFunction = this.showFunction.bind(this);
  }

  componentWillUnmount() {
    console.log('UNMOUNTED');
  }

  closeFunction() {
    this.setState({ isModalVisible: false });
  }

  showFunction() {
    console.log(this.indexFd);
    console.log(this.mapping);
    this.setState({ isModalVisible: true });
    console.log(ReactDOM.findDOMNode(this).parentNode.parentNode);
  }

  addDocMethod = () => {
        this.props.addDocMethod();
        this.setState({ isModalVisible: false });
  }

  render() {
    const formSample = this.indexFd.map(k => {
      var index = Object.keys(this.mapping)[0]
      var type = Object.keys(this.mapping[Object.keys(this.mapping)[0]]["mappings"])[0];

      if(this.mapping[index]["mappings"][type]["properties"][k]["type"] != 'undefined'){
        var tt = this.mapping[index]["mappings"][type]["properties"][k]["type"];
        if(this.mapping[index]["mappings"][type]["properties"][k]["type"] == 'double'){
          tt = 'number';
        }

      }
      return (
            <EuiFormRow key={k} label={k} helpText={tt}>
              <EuiFieldText name={k} onChange={this.props.handleInput} type={tt}/>
            </EuiFormRow>
      );
    });

    let modal;
    if (this.state.isModalVisible) {
      modal = (
        <EuiOverlayMask>
          <EuiModal
            onClose={this.closeFunction}
            style={{ width: '800px',height:'850px',overflowY:'auto' }}
          >
            <EuiModalHeader>
              <EuiModalHeaderTitle >
              <EuiTitle size="l">
                <h1 style={{ color: '#025471', fontWeight: '900', padding:'10px'}}>Add Document</h1>
              </EuiTitle>
              </EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
            <EuiForm>
              {formSample}
            </EuiForm>
            </EuiModalBody>

            <EuiModalFooter>
              <EuiButtonEmpty
                onClick={this.closeFunction}
              >
                Cancel
              </EuiButtonEmpty>

              <EuiButton
                onClick={this.addDocMethod}
                fill
              >
                Save
              </EuiButton>
            </EuiModalFooter>
          </EuiModal>
        </EuiOverlayMask>
      );
    }

    return (
    	<div>
      <EuiHeader>
        <EuiHeaderSection>
          <EuiHeaderSectionItem border="right">
          <EuiLink
            href="#/"
            onClick={(e) => {
              this.setState({
                isPortalVisible:false
              });
              ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode.parentNode);
            }}
          >
            <FontAwesome
            className='far fa-arrow-circle-left'
            name='far fa-arrow-circle-left'
            size='3x'
            style={{ color: '#025471', paddingLeft: '15px', marginTop: '5px' ,width: '70px'}}/>
          </EuiLink>
          </EuiHeaderSectionItem>
          <EuiHeaderLogo
            aria-label="Actions"
            iconType="indexOpen"
            size='xxl'
            style={{ color: '#025471', paddingLeft: '27px', marginTop: '-8px' ,width: '60px'}}

          />
          <EuiTitle size="l">
            <h1 style={{ color: '#025471', fontWeight: '900', padding:'10px'}}>Doc Editor</h1>
          </EuiTitle>

        </EuiHeaderSection>
        <EuiHeaderSection side="right">
            <EuiFlexItem grow={false}>
              <EuiButton fill /*onClick={this.addValueLabel}*/ iconSide="left"
              iconType="indexOpen"
              onClick={this.showFunction}
              style={{ width: '147px',marginTop: '8px', backgroundColor: '#005472'}}>Add document</EuiButton>
              <EuiSpacer size="s" />
              {modal}
            </EuiFlexItem>
        </EuiHeaderSection>
      </EuiHeader>
      </div>
    );
  }
}
