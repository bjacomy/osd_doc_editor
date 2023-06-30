import React, {
  Component,
  Fragment
} from 'react'

import {
  EuiButton,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLink,
  EuiPopover,
  EuiText
} from '@elastic/eui'

import AddDocumentButton from './AddDocumentButton'
import ManageDocWrapper from './wrapper/ManageDocWrapper'
import GroupUpdateDocsWrapper from './wrapper/GroupUpdateDocsWrapper'

import {
  getSelectedItems,
  areAllCurrentPageItemsSelected,
  areAtLeastOneCurrentPageItemsSelected
} from '../lib/items'

import axios from 'axios'

export default class extends Component {
  constructor(props) {
    super(props);

    // props.index
    // props.mapping
    // props.items
    // props.total {docs:999, pages:99}
    // props.areAllPagesItemsSelected
    // props.selectAllPagesItems  fn : avoid to manage an internal state with suplication of data
    // props.addCallback
    // props.updateCallback
    // props.deleteCallback

    this.state = {
      isPopoverOpen: false,
    }

    axios.defaults.headers.post['osd-xsrf'] = "reporting"
    axios.defaults.headers.delete['osd-xsrf'] = "reporting"
  }

  onButtonClick = () => {
    this.setState(prevState => ({
      isPopoverOpen: !prevState.isPopoverOpen,
    }));
  }

  closePopover = () => {
    this.setState({
      isPopoverOpen: false,
    });
  }

  render() {

    const selectedItems = getSelectedItems(this.props.items)

    const addButton = (
      <ManageDocWrapper
          index={this.props.index} 
          mapping={this.props.mapping}
          data={{}}
          submitCallback={this.props.addDocument()}
        >
          <AddDocumentButton/>
        </ManageDocWrapper>
    )

    const manageSelectedButton = (
      <EuiButton
        iconType="arrowDown"
        iconSide="right"
        onClick={this.onButtonClick}
      >
        Manage selected items
      </EuiButton>
    )

    

    let deleteCb, updateCb
    if (this.props.areAllPagesItemsSelected) {
      deleteCb = this.props.deleteCallback(null, 
      `Delete all (${this.props.total.docs}) selected items?`,
      true)
      updateCb = this.props.updateDocument(null, true)
    }
    else {
      deleteCb = this.props.deleteCallback(selectedItems.map(i => i._id).join(','), 
      `Delete this (${selectedItems.length}) selected items?`,
      false)
      updateCb = this.props.updateDocument(selectedItems.map(i => i._id).join(','), false)
    }

    
    const items =  [
      (
        <GroupUpdateDocsWrapper
          key="UpdateWrapper"
          index={this.props.index} 
          mapping={this.props.mapping}
          submitCallback={updateCb}
        >
          <EuiContextMenuItem
            key="Update"
            icon="pencil"
          >
            Update selected
          </EuiContextMenuItem>
        </GroupUpdateDocsWrapper>
        
      ), 
      (
        <EuiContextMenuItem
          key="Delete"
          icon={<EuiIcon
            type="trash"
            color="danger"
            size="m"
            />}
          onClick={deleteCb}
          >
          Delete selected
        </EuiContextMenuItem>
      )
    ]

    // when one item is selected, we can manage some group action
    let manageSelectedPopover
    if (areAtLeastOneCurrentPageItemsSelected(this.props.items)) {
      manageSelectedPopover = (
        <EuiPopover
          id="contextMenu"
          button={manageSelectedButton}
          isOpen={this.state.isPopoverOpen}
          closePopover={this.closePopover}
          panelPaddingSize="none"
          withTitle
          anchorPosition="downLeft"
          >
          <EuiContextMenuPanel 
            hasFocus={false} // avoid a bug when key pressed on up or down arrows
            items={items}
            />
        </EuiPopover>
      )
    }

    // when all items are selected, and multiple pages exists, we can select to apply updates on all docs by query
    let selectAllLink
    if (areAllCurrentPageItemsSelected(this.props.items) 
      && this.props.total.pages > 1) {
      
      if (!this.props.areAllPagesItemsSelected) {

        selectAllLink = (
          <EuiText style={{marginTop:"10px"}}>
            <h6>
              The {this.props.items.length} documents on this page are selected.
              <EuiLink onClick={() => {this.props.selectAllPagesItems(true)}}>
                &nbsp;Select all {this.props.total.docs} documents?
              </EuiLink>
            </h6>
          </EuiText>
        )
      } else {
        selectAllLink = (
          <EuiText style={{marginTop:"10px"}}>
            <h6>
              All <span style={{color: "#DD0A73"}}>{this.props.total.docs} documents are selected</span> (including all {this.props.total.pages} pages) !! 
              <EuiLink onClick={() => {this.props.selectAllPagesItems(false)}}>
                &nbsp;Cancel the other pages selected?
              </EuiLink>
            </h6>
          </EuiText>
        )
      }
    }
    
    return (
      <EuiFlexGroup gutterSize="s">
        <EuiFlexItem key="actionAdd" grow={false}>
          {addButton}
        </EuiFlexItem>
        <EuiFlexItem key="actionManage" grow={false}>
          {manageSelectedPopover}
        </EuiFlexItem>
        <EuiFlexItem key="actionSelectAll">
          {selectAllLink}
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }
}