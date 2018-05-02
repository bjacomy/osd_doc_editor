import React, {
  Component,
  Fragment,
} from 'react';

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
} from '@elastic/eui';

import {
  makeId,
  LEFT_ALIGNMENT,
  RIGHT_ALIGNMENT,
  Pager,
  SortableProperties,
} from '@elastic/eui';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemIdToSelectedMap: {},
      itemIdToOpenActionsPopoverMap: {},
      sortedColumn: 'title',
      itemsPerPage: 20,
      tabNames: this.props.names,
      index: this.props.names,
      isModalVisible: false,
      isModalValueVisible: false,
      isSwitchChecked: true,
      inputValue: '',
      inputLabel: '',
      columns:[],
      items: this.props.names,
      value: '',
    };

    this.items =  this.props.names;
    this.columnsProp = this.props.colonne;
    ////

    this.sortableProperties = new SortableProperties([{
      name: 'title',
      getValue: item => item._id.toLowerCase(),
      isAscending: true,
    }, {
      name: 'dateCreated',
      getValue: item => item._index.toLowerCase(),
      isAscending: true,
    }, {
      name: 'magnitude',
      getValue: item => item._type.toLowerCase(),
      isAscending: true,
    }], this.state.sortedColumn);


    this.state.columns =this.columnList();

    this.pager = new Pager(this.state.items.length, this.state.itemsPerPage);
    this.state.firstItemIndex = this.pager.getFirstItemIndex();
    this.state.lastItemIndex = this.pager.getLastItemIndex();

    this.closeModal = this.closeModal.bind(this);
    this.closeModalValue = this.closeModalValue.bind(this);
    this.showModal = this.showModal.bind(this);
    this.showModalValue = this.showModalValue.bind(this);
    this.columnList = this.columnList.bind(this);
    var self = this.state.items;
  }

  componentDidMount() {
        setInterval(() => {
            this.setState(() => {
                //console.log('setting state');
                return { unseen: "does not display" }
            });
        }, 1000);
    }

  onSwitchChange = () => {
    this.setState({
      isSwitchChecked: !this.state.isSwitchChecked,
    });
  }

  onChangeSelect = e => {
    this.setState({
      value: e.target.value,
    });
    console.log(e.target.value);
  }

  GetMapping= () => {
  var mapping_request = '{"properties": {';
    mapping_request += '"'+ this.state.inputLabel +'": { "type": "text" }';
    mapping_request += '} }';

    return mapping_request;
  }

  
  saveLabel= () => {
    let body = this.GetMapping();
    //console.log(body);
    let index = this.state.index[0]._index;
    fetch("../api/label/transactions/_mapping/sales", {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'kbn-xsrf': 'reporting'
        },
        body:body
      })
      .then(res => res.json())
      .then(
        (result) => {
          //console.log("result"+body);
          //console.log(result);
        },
        (error) => {
          
        }
      )
      this.closeModal();
  }

  addValueLabel= () => {
    let secondBody = {};
    secondBody[this.state.value] = this.state.inputValue;
    let body = {
      "doc": secondBody 
    };

    console.log(body);
    let index = this.state.index[0]._index;
    for (var property1 in this.state.itemIdToSelectedMap) {
      if(this.state.itemIdToSelectedMap[property1]){
      fetch("../api/label/transactions/sales/"+property1+"/_update", {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'kbn-xsrf': 'reporting'
          },
          body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(
          (result) => {

          },
          (error) => {
            
          }
      )
      }
    }
    var exempleTimeout = setTimeout(this.refreshItems, 1000);
    this.closeModalValue();
  }

  refreshItems= () => {
    let index = this.state.index[0]._index;
    fetch("../api/label/search/transactions", {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(
        (result) => {
          var newItems = result.hits.hits;
          /////
          fetch("../api/label/transactions/_mapping/sales", {
            method: 'get',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => res.json())
          .then(
            (result) => {
              var mapping = result;
              for (var v in  newItems) {
                for (var key in  mapping["transactions"]["mappings"]["sales"]["properties"]) {
                  if(newItems[v]._source[key])
                  {newItems[v][key]=newItems[v]._source[key];}
                  else
                  {newItems[v][key]="";}
                }
              }

              this.setState({
                items: newItems
              })
              
            },
            (error) => {
              
            }
          )  
              ////

          this.setState({
            items: newItems
          })
        },
        (error) => {
              
        }
      )
  }

  handle(event){
    this.setState({
      inputLabel: event.target.value
    })
  }

  handleValue(event){
    this.setState({
      inputValue: event.target.value
    })
  }

  closeModal() {
    this.setState({ isModalVisible: false });
  }

  closeModalValue() {
    this.setState({ isModalValueVisible: false });
  }

  showModal() {
    this.setState({ isModalVisible: true });
    console.log(this.areAnyRowsSelected());
  }

  showModalValue= () => {
    this.setState({ isModalValueVisible: true });
  }

  columnList= () => {
    let tab = [];
    let selectTab = [];
    let check = {
      id: 'checkbox',
      isCheckbox: true,
      textOnly: false,
      width: '24px',
    };
    tab.push(check);
    for (var property1 in this.columnsProp) {
      console.log(this.columnsProp);
      if(this.columnsProp[property1] != "_source"){
        if(this.columnsProp[property1] != "$$hashKey" ){
          let col = {
          id: this.columnsProp[property1],
          label: this.columnsProp[property1],
          alignment: LEFT_ALIGNMENT,
          isSortable: true,
          };
          tab.push(col);
          }
        }
      }
    let act = {
      id: 'actions',
      label: '',
      alignment: RIGHT_ALIGNMENT,
      isActionsPopover: true,
      width: '32px',
    };
    tab.push(act);
    //console.log(tab);
    //this.columnsProp = [];
    for (var v in this.columnsProp) {
      let select = {
          text: this.columnsProp[v],
          value: this.columnsProp[v],
          };
          selectTab.push(select);
    }
    this.columnsProp = [];
    this.columnsProp = selectTab; 

    return tab;
  }

  onChangeItemsPerPage = itemsPerPage => {
    this.pager.setItemsPerPage(itemsPerPage);
    this.setState({
      itemsPerPage,
      firstItemIndex: this.pager.getFirstItemIndex(),
      lastItemIndex: this.pager.getLastItemIndex(),
    });
  }

  onChangePage = pageIndex => {
    this.pager.goToPageIndex(pageIndex);
    this.setState({
      firstItemIndex: this.pager.getFirstItemIndex(),
      lastItemIndex: this.pager.getLastItemIndex(),
    });
  };

  onSort = prop => {
    this.sortableProperties.sortOn(prop);

    this.setState({
      sortedColumn: prop,
    });
  }

  toggleItem = itemId => {
    this.setState(previousState => {
      const newItemIdToSelectedMap = {
        ...previousState.itemIdToSelectedMap,
        [itemId]: !previousState.itemIdToSelectedMap[itemId],
      };
      return {
        itemIdToSelectedMap: newItemIdToSelectedMap,
      };
    });
  }

  toggleAll = () => {
    const allSelected = this.areAllItemsSelected();
    const newItemIdToSelectedMap = {};
    this.state.items.forEach(item => newItemIdToSelectedMap[item._id] = !allSelected);

    this.setState({
      itemIdToSelectedMap: newItemIdToSelectedMap,
    });
  }

  isItemSelected = itemId => {
    return this.state.itemIdToSelectedMap[itemId];
  }

  areAllItemsSelected = () => {
    const indexOfUnselectedItem = this.state.items.findIndex(item => !this.isItemSelected(item._id));
    return indexOfUnselectedItem === -1;
  }

  areAnyRowsSelected = () => {
    return Object.keys(this.state.itemIdToSelectedMap).findIndex(id => {
      return this.state.itemIdToSelectedMap[id];
    }) !== -1;
  }

  togglePopover = itemId => {
    this.setState(previousState => {
      const newItemIdToOpenActionsPopoverMap = {
        ...previousState.itemIdToOpenActionsPopoverMap,
        [itemId]: !previousState.itemIdToOpenActionsPopoverMap[itemId],
      };

      return {
        itemIdToOpenActionsPopoverMap: newItemIdToOpenActionsPopoverMap,
      };
    });
  };

  closePopover = itemId => {
    this.setState(previousState => {
      const newItemIdToOpenActionsPopoverMap = {
        ...previousState.itemIdToOpenActionsPopoverMap,
        [itemId]: false,
      };

      return {
        itemIdToOpenActionsPopoverMap: newItemIdToOpenActionsPopoverMap,
      };
    });
  };

  isPopoverOpen = itemId => {
    return this.state.itemIdToOpenActionsPopoverMap[itemId];
  };

  renderHeaderCells() {
    return this.state.columns.map((column, columnIndex) => {
      if (column.isCheckbox) {
        return (
          <EuiTableHeaderCellCheckbox
            key={column.id}
            width={column.width}
          >
            <EuiCheckbox
              id="selectAllCheckbox"
              checked={this.areAllItemsSelected()}
              onChange={this.toggleAll.bind(this)}
              type="inList"
            />
          </EuiTableHeaderCellCheckbox>
        );
      }

      return (
        <EuiTableHeaderCell
          key={column.id}
          align={this.state.columns[columnIndex].alignment}
          width={column.width}
          onSort={column.isSortable ? this.onSort.bind(this, column.id) : undefined}
          isSorted={this.state.sortedColumn === column.id}
          isSortAscending={this.sortableProperties.isAscendingByName(column.id)}
        >
          {column.label}
        </EuiTableHeaderCell>
      );
    });
  }

  renderRows() {
    const renderRow = item => {
      const cells = this.state.columns.map(column => {
        const cell = item[column.id];

        let child;

        if (column.isCheckbox) {
          return (
            <EuiTableRowCellCheckbox key={column.id}>
              <EuiCheckbox
                id={`${item._id}-checkbox`}
                checked={this.isItemSelected(item._id)}
                onChange={this.toggleItem.bind(this, item._id)}
                type="inList"
              />
            </EuiTableRowCellCheckbox>
          );
        }

        if (column.isActionsPopover) {
          return (
            <EuiTableRowCell
              key={column.id}
              textOnly={false}
              align="right"
            >
              <EuiPopover
                id={`${item._id}-actions`}
                button={(
                  <EuiButtonIcon
                    aria-label="Actions"
                    iconType="gear"
                    size="s"
                    color="text"
                    onClick={() => this.togglePopover(item._id)}
                  />
                )}
                isOpen={this.isPopoverOpen(item._id)}
                closePopover={() => this.closePopover(item._id)}
                panelPaddingSize="none"
                anchorPosition="leftCenter"
              >
                <EuiContextMenuPanel
                  items={[
                    (
                      <EuiContextMenuItem
                        key="A"
                        icon="pencil"
                        onClick={() => { this.closePopover(item._id); }}
                      >
                        Edit
                      </EuiContextMenuItem>
                    ), (
                      <EuiContextMenuItem
                        key="B"
                        icon="share"
                        onClick={() => { this.closePopover(item._id); }}
                      >
                        Share
                      </EuiContextMenuItem>
                    ), (
                      <EuiContextMenuItem
                        key="C"
                        icon="trash"
                        onClick={() => { this.closePopover(item._id); }}
                      >
                        Delete
                      </EuiContextMenuItem>
                    ),
                  ]}
                />
              </EuiPopover>
            </EuiTableRowCell>
          );
        }

        if (column.cellProvider) {
          child = column.cellProvider(cell);
        } else {
          child = cell;
        }

        return (
          <EuiTableRowCell
            key={column.id}
            align={column.alignment}
            //truncateText={cell && cell.truncateText}
            textOnly={cell ? cell.textOnly : true}
          >
            {child}
          </EuiTableRowCell>
        );
      });

      return (
        <EuiTableRow
          key={item._id}
          isSelected={this.isItemSelected(item._id)}
        >
          {cells}
        </EuiTableRow>
      );
    };

    const rows = [];

    for (let itemIndex = this.state.firstItemIndex; itemIndex <= this.state.lastItemIndex; itemIndex++) {
      const item = this.state.items[itemIndex];
      rows.push(renderRow(item));
    }

    return rows;
  }

  render() {
    let optionalActionButtons;
    const formSampleValue = (
      <EuiForm>

        <EuiFormRow
          label="Label Value"
        >
          <EuiFieldText name="popValue" onChange={this.handleValue.bind(this)}/>
        </EuiFormRow>

        
      </EuiForm>
    );

    let modalValue;

    if (this.state.isModalValueVisible) {
      modalValue = (
        <EuiOverlayMask>
          <EuiModal
            onClose={this.closeModalValue}
            style={{ width: '800px' }}
          >
            <EuiModalHeader>
              <EuiModalHeaderTitle >
                Add a value for the label
              </EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
              <Fragment>
        <EuiSelect
          options={this.columnsProp}
          //value={this.state.value}
          onChange={this.onChangeSelect}
        />


              <EuiSpacer size="m" />
          </Fragment>
              {formSampleValue}
            </EuiModalBody>

            <EuiModalFooter>
              <EuiButtonEmpty
                onClick={this.closeModalValue}
              >
                Cancel
              </EuiButtonEmpty>

              <EuiButton
                onClick={this.addValueLabel}
                fill
              >
                Save
              </EuiButton>
            </EuiModalFooter>
          </EuiModal>
        </EuiOverlayMask>
      );
    }

    if (this.areAnyRowsSelected() > 0) {
      optionalActionButtons = (
        <EuiFlexItem grow={false}>
          <EuiButton color="danger" /*onClick={this.addValueLabel}*/ onClick={this.showModalValue} >Label value</EuiButton>
          {modalValue}
        </EuiFlexItem>
      );
    }

    const formSample = (
      <EuiForm>
        

        <EuiFormRow
          label="Label"
        >
          <EuiFieldText name="popfirst" onChange={this.handle.bind(this)}/>
        </EuiFormRow>

        
      </EuiForm>
    );


    let modal;

    if (this.state.isModalVisible) {
      modal = (
        <EuiOverlayMask>
          <EuiModal
            onClose={this.closeModal}
            style={{ width: '800px' }}
          >
            <EuiModalHeader>
              <EuiModalHeaderTitle >
                Add a label to this index
              </EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
              {formSample}
            </EuiModalBody>

            <EuiModalFooter>
              <EuiButtonEmpty
                onClick={this.closeModal}
              >
                Cancel
              </EuiButtonEmpty>

              <EuiButton
                onClick={this.saveLabel}
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
        <EuiFlexGroup gutterSize="m">
          {optionalActionButtons}

          <EuiFlexItem>
            <EuiFieldSearch fullWidth placeholder="Search..." />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
          <div>
            <EuiButton onClick={this.showModal}>
          Add label
            </EuiButton>
            {modal}
          </div>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="m" />

        <EuiTable>
          <EuiTableHeader>
            {this.renderHeaderCells()}
          </EuiTableHeader>

          <EuiTableBody>
            {this.renderRows()}
          </EuiTableBody>
        </EuiTable>

        <EuiSpacer size="m" />

        <EuiTablePagination
          activePage={this.pager.getCurrentPageIndex()}
          itemsPerPage={this.state.itemsPerPage}
          itemsPerPageOptions={[5, 10, 20]}
          pageCount={this.pager.getTotalPages()}
          onChangeItemsPerPage={this.onChangeItemsPerPage}
          onChangePage={this.onChangePage}
        />
      </div>
    );
  }
}