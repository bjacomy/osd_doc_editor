import React, {
  Component,
  Fragment,
} from 'react';
import FontAwesome from 'react-fontawesome';
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
} from '@elastic/eui';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemIdToSelectedMap: {},
      itemIdToOpenActionsPopoverMap: {},
      itemsPerPage: 10,
      searchValue:'',
      isModalValueVisible: false,
      inputValue: '',
      inputLabel: '',
      columns:[],
      items: this.props.names,
      value: '',
      isPortalVisible: false,
      checkAllDoc:false,
      anyRowsSelected:true,
    };

    this.items =  this.props.names;
    this.columnsProp = this.props.colonne;
    this.searchTab = this.props.recherche;
    this.total = this.props.total;
    this.state.columns =this.columnList();

    this.pager = new Pager(this.total, this.state.itemsPerPage);
    this.state.firstItemIndex = this.pager.getFirstItemIndex();
    this.state.lastItemIndex = this.pager.getLastItemIndex();
    this.closeModalValue = this.closeModalValue.bind(this);
    this.showModalValue = this.showModalValue.bind(this);
    this.columnList = this.columnList.bind(this);
    this.mySearch = this.mySearch.bind(this);
    this.togglePortal = this.togglePortal.bind(this);
    this.areAllItemsSelected = this.areAllItemsSelected.bind(this);
    this.toggleItem = this.toggleItem.bind(this);
  }

  componentDidMount() {
        setInterval(() => {
            this.setState(() => {
                //console.log('setting state');
                return { unseen: "does not display" }
            });
        }, 1000);
  }

  togglePortal(allSelected,selectedI) {
    if(allSelected){
      this.setState({ isPortalVisible: false,
      anyRowsSelected: true,
    });
    }
    else{
      if(! this.areAnyRowsSelected()){
        this.setState({
          isPortalVisible: false,
        });
      }else {
        var isAllTrue = !this.state.itemIdToSelectedMap[selectedI];
        var isAllTrueIt = true;
        for (var item in this.state.itemIdToSelectedMap) {
          if (item === selectedI) continue;
          isAllTrue = isAllTrue && this.state.itemIdToSelectedMap[item];
        }
        for (var it in this.state.items) {
          var existe = false;
          for (var item in this.state.itemIdToSelectedMap) {
            if (this.state.items[it]._id === selectedI) { existe = true;}
            else {
              if(this.state.items[it]._id === item){ existe = true;}
            }
          }
          isAllTrueIt = isAllTrueIt && existe;
        }
        this.setState({
          isPortalVisible: isAllTrue && ((Object.keys(this.state.itemIdToSelectedMap).length) >= this.state.lastItemIndex) && isAllTrueIt == true,
          anyRowsSelected:true
        });
      }
    }
  }

  checkAllDocs = () => {
      this.setState({ checkAllDoc: !this.state.checkAllDoc});
  }

  onChangeSelect = e => {
    this.setState({
      value: e.target.value,
    });
  }

  addValueLabel= () => {
    let index = this.state.items[0]._index;
    let type = this.state.items[0]._type;
    if (this.state.checkAllDoc == false) {
      let secondBody = {};
      secondBody[this.state.value] = this.state.inputValue;
      let body = {
        "doc": secondBody
      };
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
              setTimeout(function() { this.Search(this.state.searchValue, this.pager.currentPageIndex * this.state.itemsPerPage, this.state.itemsPerPage) }.bind(this), 1000);
            },
            (error) => {

            }
        )
        }
      }
    }
    if (this.state.checkAllDoc == true && this .state.isPortalVisible == false) {
        let script = {};
        let query = {};
        let query_string = {};
        let body = {};
        if(this.state.searchValue !='')
        { query_string["query"] = this.state.searchValue;
          for (var property1 in this.state.itemIdToSelectedMap) {
            if(! this.state.itemIdToSelectedMap[property1]){
              query_string["query"] += " NOT _id:"+property1
            }
          }
          query["query_string"] = query_string;
        }else{
          query["match_all"] = {}
        }
        script["source"] = "ctx._source."+this.state.value+" = '"+this.state.inputValue+"'";
        script["lang"] = "painless";
        body["script"] = script;
        body["query"] = query;
        console.log(body);
        fetch("../api/label/"+index+"/_update_by_query", {
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
                setTimeout(function() { this.Search(this.state.searchValue, this.pager.currentPageIndex * this.state.itemsPerPage, this.state.itemsPerPage) }.bind(this), 1000);          },
            (error) => {

            }
        )
    }
    if (this.state.checkAllDoc == true && this .state.isPortalVisible == true) {
      let script = {};
      let query = {};
      let query_string = {};
      let body = {};
      if(this.state.searchValue !='')
      { query_string["query"] = this.state.searchValue;
        query["query_string"] = query_string;
      }else{
        query["match_all"] = {}
      }
      script["source"] = "ctx._source."+this.state.value+" = '"+this.state.inputValue+"'";
      script["lang"] = "painless";
      body["script"] = script;
      body["query"] = query;

      fetch("../api/label/"+index+"/_update_by_query", {
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
              setTimeout(function() { this.Search(this.state.searchValue, this.pager.currentPageIndex * this.state.itemsPerPage, this.state.itemsPerPage) }.bind(this), 1000);          },
          (error) => {

          }
      )
    }
    this.closeModalValue();
  }

  requestMapping= (total, newItems, pageIndex, itemPPage) => {
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

              this.pager = new Pager(total , itemPPage);
              if(this.pager.totalPages - 1 == pageIndex){
                this.setState({
                  items: newItems,
                  lastItemIndex: (total % itemPPage) - 1,
                });
              }else {
                this.setState({
                  firstItemIndex: this.pager.getFirstItemIndex(),
                  lastItemIndex: this.pager.getLastItemIndex(),
                  items: newItems,
                });
              }
              if (pageIndex != null) {
                  this.pager.goToPageIndex(pageIndex);
              }
            },
            (error) => {

            }
          )
  }


  handleValue(event){
    this.setState({
      inputValue: event.target.value
    })
  }

  mySearchHandle(event){
    this.setState({
      searchValue: event.target.value,
    })
    if (event.target.value ==='') {
      this.setState({ itemIdToSelectedMap: {},
                    isPortalVisible:false
      });
      var exempleTimeout = setTimeout(this.Search(event.target.value, 0, this.state.itemsPerPage), 100);
    }
  }

  closeModalValue() {
    this.setState({ isModalValueVisible: false });
  }

  mySearch= () => {
      this.setState({ itemIdToSelectedMap: {},
                    isPortalVisible:false
      });
      var exempleTimeout = setTimeout(this.Search(this.state.searchValue, 0, this.state.itemsPerPage), 100);
  }

  Search = (varS, from , itemPP) => {
    if(this.state.items.length != 0){

        let index = this.state.items[0]._index;
        let type = this.state.items[0]._type;
        var body = {};var query = {};var sort = [];
        if(from * itemPP < 10000)
        {sort.push({"_id" : "asc"});
          body["from"] = from;}
        else
        {sort.push({"_id" : "desc"});
          if((this.pager.currentPageIndex+1) == this.pager.totalPages)
          body["from"] = (this.pager.totalPages - (this.pager.currentPageIndex + 1)) * this.state.itemsPerPage ;
          else
          body["from"] = (this.pager.totalItems) % (this.pager.currentPageIndex+1);
        }
        body["sort"] = sort;
        query["match_all"] = {};
        body["query"] = query;
        body["size"] = itemPP;

        var fields = this.searchTab;
        if(varS != ''){
          if(varS.indexOf(":") != -1){
              if (varS.lastIndexOf(":") == varS.indexOf(":")) {
                var multi_match = {};
                var query = {};
                body["sort"] = sort;
                var searchField = varS.split(":");
                multi_match["default_field"] = searchField[0];
                multi_match["query"] = searchField[1];
                query["query_string"] = multi_match;
                body["query"] = query;
                body["size"] = itemPP;
                body["from"] = from;
              }
              else {
                var multi_match = {};
                var query = {};
                body["sort"] = sort;
                multi_match["query"] = varS;
                query["query_string"] = multi_match;
                body["query"] = query;
                body["size"] = itemPP;
                body["from"] = from;
              }
          }else{
                var multi_match = {};
                var query = {};
                body["sort"] = sort;
                multi_match["fields"] = fields;
                multi_match["query"] = varS;
                multi_match["type"] = "phrase_prefix";
                query["multi_match"] = multi_match;
                body["query"] = query;
                body["size"] = itemPP;
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
            this.pager = new Pager(result.hits.total , itemPP);
            if(this.pager.totalPages - 1 == from/itemPP){
              this.setState({
                items: result.hits.hits,
                lastItemIndex: (result.hits.total % itemPP) - 1,
              });
            }else {
              this.setState({
                firstItemIndex: this.pager.getFirstItemIndex(),
                lastItemIndex: this.pager.getLastItemIndex(),
                items: result.hits.hits,
              });
            }
            if(this.state.checkAllDoc){
              const allSelected = this.areAllItemsSelected();
              const newItemIdToSelectedMap = {};
              this.state.items.forEach(item => newItemIdToSelectedMap[item._id] = !allSelected);
              //this.state.itemIdToSelectedMap.concat(newItemIdToSelectedMap)
              this.setState({
                itemIdToSelectedMap: Object.assign(newItemIdToSelectedMap, this.state.itemIdToSelectedMap),
              });
            }
            this.requestMapping(result.hits.total, result.hits.hits, from/itemPP, itemPP );

          }
        },
        (error) => {

        }
      )
    }
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
      if(this.columnsProp[property1] != "_source"){
        if(this.columnsProp[property1] != "$$hashKey" ){
          let col = {
          id: this.columnsProp[property1],
          label: this.columnsProp[property1],
          alignment: LEFT_ALIGNMENT,
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
    var pageIndex = this.pager.currentPageIndex;
    this.pager.setItemsPerPage(itemsPerPage);
    var exempleTimeout = setTimeout(this.Search(this.state.searchValue, pageIndex * itemsPerPage, itemsPerPage), 500);
    this.setState({
      itemsPerPage,
    });

  }

  onChangePage = pageIndex => {
    var exempleTimeout = setTimeout(this.Search(this.state.searchValue, pageIndex * this.state.itemsPerPage, this.state.itemsPerPage), 500);
  };

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

    var allSelected = this.areAllItemsSelected();
    this.togglePortal(allSelected,itemId);

  }

  toggleAll = () => {
    const allSelected = this.areAllItemsSelected();
    const newItemIdToSelectedMap = {};
    this.state.items.forEach(item => newItemIdToSelectedMap[item._id] = !allSelected);

    this.setState({
      itemIdToSelectedMap: newItemIdToSelectedMap,
    });

    if(allSelected)
    { this.setState({ isPortalVisible: false,
                      checkAllDoc: false});
    }else {
      this.setState({ isPortalVisible: true});
    }
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
          style={{ color: '#025471'}}
        >
          {column.label}
        </EuiTableHeaderCell>
      );
    });
  }

  renderRows() {
    if(this.state.items.length != 0){
    const renderRow = item => {
      const cells = this.state.columns.map(column => {
        const cell = item[column.id];
        let poptab;
        let key;let val;
        let popkey;
        let act = "";
        let child;

            poptab = Object.values(item);
            popkey = Object.keys(item);

            const keyValue = popkey.map(k => {
              if(k != "_source")
              { key = k + ":";
                val = item[k];

              return (
                <div key={key}> <span style={{ background: '#D9D9D9' }}>
                      <EuiTextColor>
                        {key}
                      </EuiTextColor>
                    </span>    {val}
                    <EuiSpacer size="s" />
                </div>

              );
            }}
            );

        if (column.isCheckbox) {
          if(this.state.checkAllDoc == false)
          {return (
            <EuiTableRowCellCheckbox key={column.id}>
              <EuiCheckbox
                id={`${item._id}-checkbox`}
                checked={this.isItemSelected(item._id)}
                onChange={this.toggleItem.bind(this, item._id)}
                type="inList"
              />
            </EuiTableRowCellCheckbox>
          );}
          else {
            if(this.state.isPortalVisible)
              {return (
                <EuiTableRowCellCheckbox key={column.id}>
                  <EuiCheckbox
                    id={`${item._id}-checkbox`}
                    checked={true}
                    onChange={this.toggleItem.bind(this, item._id)}
                    type="inList"
                  />
                </EuiTableRowCellCheckbox>
              );}
            else {return (
              <EuiTableRowCellCheckbox key={column.id}>
                <EuiCheckbox
                  id={`${item._id}-checkbox`}
                  checked={this.state.itemIdToSelectedMap[item._id]}
                  onChange={this.toggleItem.bind(this, item._id)}
                  type="inList"
                />
              </EuiTableRowCellCheckbox>
            );}
          }
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
                    iconType="iInCircle"
                    style={{ width: '80px',height:'80px'}}
                    onClick={() => this.togglePopover(item._id)}
                  />
                )}
                isOpen={this.isPopoverOpen(item._id)}
                closePopover={() => this.closePopover(item._id)}
                panelPaddingSize="none"
                anchorPosition="leftUp"

              >
                <EuiContextMenuPanel
                style={{ width: '800px',height: 30 * Object.keys(this.state.items[0]).length, padding: '10px',backgroundColor: '#ffffff',border: '3px solid #005472'}}
                  items={[
                    (
                      <EuiContextMenuItem
                        key="A"
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
  }else {
    return <tr><td>Empty_index</td></tr>;
  }
  }

  render() {
    let portal;

    if (this.state.isPortalVisible == true && this.state.checkAllDoc == false) {
      portal = (
        <EuiPortal>
          <EuiBottomBar>
          <p align="center">
            The documents on this page are selected. {(
              <EuiLink
                onClick={this.checkAllDocs}
              >
                Select all documents?
              </EuiLink>
            )}
          </p>
          </EuiBottomBar>
        </EuiPortal>
      );
    }
    if (this.state.isPortalVisible == true && this.state.checkAllDoc == true)  {
      portal = (
        <EuiPortal>
          <EuiBottomBar>
          <p align="center">
            All documents are selected. {(
              <EuiLink
                onClick={this.checkAllDocs}
              >
                cancel the selection?
              </EuiLink>
            )}
          </p>
          </EuiBottomBar>
        </EuiPortal>
      );
    }

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

    if (this.areAnyRowsSelected() && this.state.anyRowsSelected) {
      optionalActionButtons = (
        <EuiFlexItem grow={false}>
          <EuiButton fill /*onClick={this.addValueLabel}*/ iconSide="left"
          iconType="indexEdit"
          onClick={this.showModalValue}
          style={{ width: '145px',marginTop: '8px'}}>Edit field value</EuiButton>
          <EuiSpacer size="s" />
          {modalValue}
        </EuiFlexItem>
      );
    }else {
      optionalActionButtons = (
      <EuiFlexItem grow={false}>
        <EuiSpacer size="xl" />
        <EuiSpacer size="l" />
      </EuiFlexItem>
      );
    }

    return (
      <div>
        <EuiHeader>
          <EuiHeaderSection>
            <EuiHeaderSectionItem border="right"
            >
            <EuiLink
              href="#/"
              onClick={(e) => {
                this.setState({
                  isPortalVisible:false
                });
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
              <h1 style={{ color: '#025471', fontWeight: '900', padding:'10px'}}>Index labeling</h1>
            </EuiTitle>
          </EuiHeaderSection>
        </EuiHeader>

        {optionalActionButtons}

        <EuiFlexGroup gutterSize="m">
          <EuiFlexItem>
            <EuiFieldSearch fullWidth onChange={this.mySearchHandle.bind(this)} placeholder="Search..." />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
          <div>
            <EuiButton onClick={this.mySearch}>
          Search
            </EuiButton>
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
        {optionalActionButtons}

        <br/><br/><br/><br/>
        {portal}
      </div>
    );
  }
}
