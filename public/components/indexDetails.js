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
  EuiText,
  EuiTextColor,
  EuiTitle,
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

    this.columnsType = [
      { value: 'choose type', text: 'choose type' , "disabled" : true },
      { value: 'text', text: 'text' },
      { value: 'double', text: 'double' },
      { value: 'boolean', text: 'boolean' },
    ];

    this.state = {
      itemIdToSelectedMap: {},
      itemIdToOpenActionsPopoverMap: {},
      sortedColumn: 'title',
      itemsPerPage: 10,
      searchValue:'',
      index: this.props.names,
      isModalVisible: false,
      isModalValueVisible: false,
      isSwitchChecked: true,
      inputValue: '',
      inputLabel: '',
      columns:[],
      items: this.props.names,
      allItems:[],
      value: '',
      typeValue: '',
    };

    this.items =  this.props.names;
    this.columnsProp = this.props.colonne;
    this.searchTab = this.props.recherche;
    this.total = this.props.total;
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

    this.pager = new Pager(this.total, this.state.itemsPerPage);
    this.state.firstItemIndex = this.pager.getFirstItemIndex();
    this.state.lastItemIndex = this.pager.getLastItemIndex();

    console.log(this.state.items);
    this.closeModal = this.closeModal.bind(this);
    this.closeModalValue = this.closeModalValue.bind(this);
    this.showModal = this.showModal.bind(this);
    this.showModalValue = this.showModalValue.bind(this);
    this.columnList = this.columnList.bind(this);
    this.mySearch = this.mySearch.bind(this);
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

  onChangeSelectType = e => {
    this.setState({
      typeValue: e.target.value,
    });
    console.log(e.target.value);
  }

  GetMapping= () => {
    var mapReq = {};
    var type = {};
    type["type"] = this.state.typeValue;
    var property = {};
    property[this.state.inputLabel] = type;
    mapReq["properties"] = property;
    return mapReq;
  }


  saveLabel= () => {
    let body = this.GetMapping();
    let index = this.state.items[0]._index;
    let type = this.state.items[0]._type;
    fetch("../api/label/"+index+"/_mapping/"+type, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'kbn-xsrf': 'reporting'
        },
        body:JSON.stringify(body)
      })
      .then(res => res.json())
      .then(
        (result) => {
          let col = {
          id: this.state.inputLabel,
          label: this.state.inputLabel,
          alignment: LEFT_ALIGNMENT,
          isSortable: true,
          };
          this.state.columns.splice(this.state.columns.length - 1, 0, col);

          let select = {
              text: this.state.inputLabel,
              value: this.state.inputLabel,
              };
              this.columnsProp.push(select);
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

    let index = this.state.items[0]._index;
    let type = this.state.items[0]._type;
    for (var property1 in this.state.itemIdToSelectedMap) {
      if(this.state.itemIdToSelectedMap[property1]){
      fetch("../api/label/"+index+"/"+type+"/"+property1+"/_update", {
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
    let index = this.state.items[0]._index;
    let type = this.state.items[0]._type;
    fetch("../api/label/search/"+index, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(
        (result) => {
          this.requestMapping(result.hits.total, result.hits.hits, null);
          this.setState({
            items: result.hits.hits
          })
          console.log(result.hits.hits);
          return result.hits.hits
        },
        (error) => {

        }
      )
  }

  requestMapping= (total, newItems, pageIndex) => {
    let index = this.state.items[0]._index;
    let type = this.state.items[0]._type;

          fetch("../api/label/"+index+"/_mapping", {
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
                for (var key in  mapping[index]["mappings"][type]["properties"]) {
                  if(newItems[v]._source[key])
                  {newItems[v][key]=newItems[v]._source[key];}
                  else
                  {newItems[v][key]="";}
                }
              }

              this.pager = new Pager(total , this.state.itemsPerPage);
              if(this.pager.totalPages - 1 == pageIndex){
                console.log("ici");
                this.setState({
                  items: newItems,
                  lastItemIndex: (total % 10) - 1,
                });
              }else {
                this.setState({
                  firstItemIndex: this.pager.getFirstItemIndex(),
                  lastItemIndex: this.pager.getLastItemIndex(),
                  items: newItems,
                });
              }

              console.log(this.pager);
              console.log(this.state.firstItemIndex);
              console.log(this.state.lastItemIndex);
              if (pageIndex != null) {
                  this.pager.goToPageIndex(pageIndex);
              }
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

  }

  mySearch= (event) => {
      this.setState({ searchValue: event.target.value });
      var exempleTimeout = setTimeout(this.Search(event.target.value, 0), 0);
  }

  Search = (varS, from) => {
    console.log(this.columnsProp);
    console.log(this.searchTab);
        let index = this.state.items[0]._index;
        let type = this.state.items[0]._type;
        var body = {};var query = {};
        query["match_all"] = {};
        body["query"] = query;
        body["size"] = 10;
        body["from"] = from;
        var fields = this.searchTab;
        if(varS != ''){
          if(varS.indexOf(":") != -1){
              if (varS.lastIndexOf(":") == varS.indexOf(":")) {
                var multi_match = {};
                var query = {};
                var searchField = varS.split(":");
                multi_match["default_field"] = searchField[0];
                multi_match["query"] = searchField[1];
                query["query_string"] = multi_match;
                body["query"] = query;
                body["size"] = 10;
                body["from"] = from;
              }
              else {
                var multi_match = {};
                var query = {};
                multi_match["query"] = varS;
                query["query_string"] = multi_match;
                body["query"] = query;
                body["size"] = 10;
                body["from"] = from;
              }
          }else{
                var multi_match = {};
                var query = {};
                multi_match["fields"] = fields;
                multi_match["query"] = varS;
                multi_match["type"] = "phrase_prefix";
                query["multi_match"] = multi_match;
                body["query"] = query;
                body["size"] = 10;
                body["from"] = from;
          }
        }
        console.log(body);
    fetch("../api/label/"+index+"/_search", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'kbn-xsrf': 'reporting'
        },
        body: JSON.stringify(body)
      })
      .then(res => res.json())
      .then(
        (result) => {

          if(result.hits.hits.length > 0){
            console.log("result if length"+ from);
            this.requestMapping(result.hits.total, result.hits.hits, from/10 )
          }
        },
        (error) => {

        }
      )
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

    selectTab.push({ value: 'choose label', text: 'choose label' , "disabled" : true });
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
    /*this.pager.goToPageIndex(pageIndex);
    this.setState({
      firstItemIndex: this.pager.getFirstItemIndex(),
      lastItemIndex: this.pager.getLastItemIndex(),
    });
    console.log(this.pager.getCurrentPageIndex());
    console.log(this.pager.getTotalPages());
    console.log(this.pager);*/
//console.log(pageIndex);
  if(this.state.searchValue != ''){
    var exempleTimeout = setTimeout(this.Search(this.state.searchValue, pageIndex * 10), 500);
  }else {
    let index = this.state.items[0]._index;
    let type = this.state.items[0]._type;
    var body = {};var query = {};
    query["match_all"] = {};
    body["query"] = query;
    body["from"] = pageIndex * 10 ;
    body["size"] = 10;

    fetch("../api/label/"+index+"/_search", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'kbn-xsrf': 'reporting'
        },
        body: JSON.stringify(body)
      })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          //console.log(this.state.items);
          console.log(pageIndex);
          //this.searchAll(result.hits.total);
          this.requestMapping(result.hits.total, result.hits.hits , pageIndex)
        },
        (error) => {

        }
      )
    }

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
    //this.searchAll(this.total)
    this.state.items.forEach(item => newItemIdToSelectedMap[item._id] = !allSelected);

    this.setState({
      itemIdToSelectedMap: newItemIdToSelectedMap,
    });
    console.log(this.state.itemIdToSelectedMap);
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
        let poptab;
        let key;let val;
        let popkey;
        let act = "";
        let child;
        //const popover = this.state.items.map(i => {
            poptab = Object.values(item);
            popkey = Object.keys(item);


            const keyValue = popkey.map(k => {
              if(k != "_source")
              { key = k + ":";
                val = item[k];}
              else {
                key = null;
                val = null;
              }
              return (
                <p key={key}> <span style={{ background: '#D9D9D9' }}>
                      <EuiTextColor>
                        {key}
                      </EuiTextColor>
                    </span>    {val}

                </p>

              );

              //console.log(k)
            }


            );



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
                anchorPosition="leftUp"

              >
                <EuiContextMenuPanel
                style={{ width: '600px',height: 20 * Object.keys(this.state.items[0]).length}}
                  items={[
                    (
                      <EuiContextMenuItem
                        key="A"
                        icon="pencil"
                        onClick={() => { this.closePopover(item._id); }}
                      >
                        {keyValue}
                      </EuiContextMenuItem>
                    )
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
              <EuiFormRow
                label="Label"
              >
        <EuiSelect
          options={this.columnsProp}
          defaultValue={this.columnsProp[0].value}
          onChange={this.onChangeSelect}
        />
        </EuiFormRow>

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
              <Fragment>
              <EuiSpacer size="m" />
              <EuiFormRow
                label="Type"
              >
        <EuiSelect
          options={this.columnsType}
          defaultValue={this.columnsType[0].value}
          onChange={this.onChangeSelectType}
        />
        </EuiFormRow>
          </Fragment>
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
            <EuiFieldSearch fullWidth onChange={this.mySearch.bind(this)} placeholder="Search..." />
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
