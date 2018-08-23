import React, {
  Component,
  Fragment,
} from 'react';
import "@elastic/eui/dist/eui_theme_k6_light.css";
import FontAwesome from 'react-fontawesome';
import Portal from './portal.js';
import Heads from './header.js';
import ReactDOM from 'react-dom';
import {
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
  EuiSelect,
  EuiText,
  EuiTextColor,
  EuiTitle,
  EuiHeader,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderSectionItemButton,
  EuiHeaderLogo,
  LEFT_ALIGNMENT,
  RIGHT_ALIGNMENT,
  Pager,
  EuiPopoverTitle,
  EuiDescriptionList,
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
      isModalVisible: false,
      inputValue: '',
      columns:[],
      items: this.props.names,
      value: '',
      itemsAreTrue: false,
      checkAllDoc:false,
      anyRowsSelected:true,
      isPortalVisible: false,
      checkAllPageIndex:'',
      currentPageIndex:0,
      itemIdToExpandedRowMap: {},
      total:this.props.total
    };

    this.columnsProp = this.props.colonne;
    this.searchTab = this.props.recherche;
    this.mapping = this.props.mapping;
    this.state.columns =this.columnList();
    this.bodyAdd = {};
    this.bodyEdit = {};
    this.indexFd = this.indexField();
    this.selectedFieldValues = [];

    this.pager = new Pager(this.state.total, this.state.itemsPerPage);
    this.state.firstItemIndex = this.pager.getFirstItemIndex();
    this.state.lastItemIndex = this.pager.getLastItemIndex();
    this.closeModalValue = this.closeModalValue.bind(this);
    this.showModalValue = this.showModalValue.bind(this);
    this.columnList = this.columnList.bind(this);
    this.mySearch = this.mySearch.bind(this);
    this.togglePortal = this.togglePortal.bind(this);
    this.areAllItemsSelected = this.areAllItemsSelected.bind(this);
    this.toggleItem = this.toggleItem.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  componentWillUnmount() {
    console.log('UNMOUNTED');
  }

//function that handles portal visibility
  togglePortal(allSelected,selectedI) {
    if(allSelected && ! this.state.checkAllDoc){
      this.setState({isPortalVisible: false,
                    });
    }else if(allSelected && this.state.checkAllDoc){
      this.setState({isPortalVisible: true,
                    });
    }
    if(allSelected){
      this.setState({ itemsAreTrue: false,
                      anyRowsSelected: true,
                    });
    }
    else{
      if(! this.areAnyRowsSelected()){
        this.setState({
          itemsAreTrue: false,
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
          itemsAreTrue: isAllTrue && ((Object.keys(this.state.itemIdToSelectedMap).length) >= this.state.lastItemIndex) && isAllTrueIt == true,
          isPortalVisible: isAllTrue  && isAllTrueIt == true || this.state.checkAllDoc,
          anyRowsSelected:true
        });
      }
    }
  }

//function that handles the check of all document
  checkAllDocs = () => {
    if (this.state.checkAllDoc==true) {
      this.setState({ checkAllDoc: !this.state.checkAllDoc,
                      itemIdToSelectedMap: {},
                      isPortalVisible: !this.state.isPortalVisible
                    });
    }else {
      this.setState({ checkAllDoc: !this.state.checkAllDoc});
    }
  }

//function that get the selected field after onch event
  onChangeSelect = e => {
    this.selectedFieldValues = [];
    this.setState({
      value: e.target.value,
    });
    let index = this.state.items[0]._index;
    let type = this.state.items[0]._type;
    var body = {};var aggs = {};var terms = {};var val = {};
    terms['field']=e.target.value+'.keyword';
    terms['size']=20;
    val['terms']=terms;
    aggs['val']=val;
    body['aggs']= aggs;
    body['size']= 0;
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
          for (var variable in result.aggregations.val.buckets) {
            this.selectedFieldValues.push(result.aggregations.val.buckets[variable].key)
          }
        },
        (error) => {

        }
      )
  }

//function that add value of the selected field for one or many documents
  addValueLabel= () => {
    let index = this.state.items[0]._index;
    let type = this.state.items[0]._type;
    let script = {};
    let query = {};
    let query_string = {};
    let body = {};
    let secondBody = {};
    if (this.state.checkAllDoc == false) {
      secondBody[this.state.value] = this.state.inputValue;
      body = {"doc": secondBody};
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
    if (this.state.checkAllDoc == true && this.state.itemsAreTrue == false) {
        if(this.state.searchValue !='')
        {   query_string["query"] = this.state.searchValue;
            for (var property1 in this.state.itemIdToSelectedMap) {
              if(! this.state.itemIdToSelectedMap[property1]){
                query_string["query"] += " NOT _id:"+property1
              }
            }
            query["query_string"] = query_string;
        }else{
            query_string["query"] = '_id:*';
            for (var property1 in this.state.itemIdToSelectedMap) {
              if(! this.state.itemIdToSelectedMap[property1]){
                query_string["query"] += " NOT _id:"+property1
              }
            }
            query["query_string"] = query_string;
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
    if (this.state.checkAllDoc == true && this.state.itemsAreTrue == true) {
        if(this.state.searchValue !='')
        {   query_string["query"] = this.state.searchValue;
            query["query_string"] = query_string;
        }else{
            query["match_all"] = {}
        } // my\ field
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

//function that update the view
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
                  if(mapping[index]["mappings"][type]["properties"][key]["type"]){
                    if(newItems[v]._source[key])
                    {newItems[v][key]=newItems[v]._source[key];}
                    else
                    {newItems[v][key]="";}
                  }
                }
              }

              this.pager = new Pager(total , itemPPage);
              if(this.pager.totalPages - 1 == pageIndex){
                if(total != itemPPage){
                  this.setState({
                    items: newItems,
                    lastItemIndex: (total % itemPPage) - 1,
                    currentPageIndex: this.pager.currentPageIndex
                  });
                }else {
                  this.setState({
                    items: newItems,
                    lastItemIndex: total - 1,
                    currentPageIndex: this.pager.currentPageIndex
                  });
                }
              }else {
                this.setState({
                  firstItemIndex: this.pager.getFirstItemIndex(),
                  lastItemIndex: this.pager.getLastItemIndex(),
                  items: newItems,
                  currentPageIndex: this.pager.currentPageIndex
                });
              }
              if (pageIndex != null) {
                  this.pager.goToPageIndex(pageIndex);
                  this.setState({
                    currentPageIndex: this.pager.currentPageIndex
                  })
              }
            },
            (error) => {

            }
          )
  }

//function that get the input value of the field value textfield
  handleValue(event){
    this.setState({
      inputValue: event.target.value
    })
  }

//function that get the input value of search
  mySearchHandle(event){
    this.setState({
      searchValue: event.target.value,
    })
    if (event.target.value ==='') {
      this.setState({ itemIdToSelectedMap: {},
                    isPortalVisible:false,
                    checkAllDoc: false
      });
      var exempleTimeout = setTimeout(this.Search(event.target.value, 0, this.state.itemsPerPage), 100);
    }
  }

  closeModalValue() {
    this.setState({ isModalValueVisible: false,
                    value: ''
                  });
    this.selectedFieldValues =  []
  }

//function that call the search function
  mySearch= () => {
      this.setState({ itemIdToSelectedMap: {},
                    isPortalVisible:false,
                    checkAllDoc: false
      });
      var exempleTimeout = setTimeout(this.Search(this.state.searchValue, 0, this.state.itemsPerPage), 100);
  }

//function that make the search
  Search = (varS, from , itemPP) => {
    var index = Object.keys(this.mapping)[0]
    var type = Object.keys(this.mapping[Object.keys(this.mapping)[0]]["mappings"])[0];
        var body = {};var query = {};var sort = [];
        if(from < 10000)
        { sort.push({"_id" : "asc"});
          body["from"] = from;
          body["size"] = itemPP;}
        else
        { sort.push({"_id" : "desc"});
          if(((from/itemPP)+1) == this.pager.totalPages){
            body["size"] = (this.pager.totalItems) % itemPP;
            body["from"] = 0;}
          else
          {
            body["from"] = (this.pager.totalItems) % ((from/itemPP)+1);
            body["size"] = itemPP;
          }
        }
        body["sort"] = sort;
        query["match_all"] = {};
        body["query"] = query;

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
              if (result.hits.total == itemPP) {
                this.setState({
                  items: result.hits.hits,
                  firstItemIndex: 0,
                  lastItemIndex: result.hits.total - 1,
                  total:result.hits.total
                });
              }else {
                this.setState({
                  items: result.hits.hits,
                  firstItemIndex: 0,
                  lastItemIndex: (result.hits.total % itemPP) - 1,
                  total:result.hits.total
                });
              }
            }else {
              this.setState({
                firstItemIndex: this.pager.getFirstItemIndex(),
                lastItemIndex: this.pager.getLastItemIndex(),
                items: result.hits.hits,
                total:result.hits.total
              });
            }
            if(this.state.checkAllDoc){
              const allSelected = this.areAllItemsSelected();
              const newItemIdToSelectedMap = {};
              this.state.items.forEach(item => newItemIdToSelectedMap[item._id] = !allSelected);
              this.setState({
                itemIdToSelectedMap: Object.assign(newItemIdToSelectedMap, this.state.itemIdToSelectedMap),
              });
            }
            setTimeout(function() { this.requestMapping(result.hits.total, result.hits.hits, from/itemPP, itemPP ) }.bind(this), 1000);
          }
        },
        (error) => {

        }
      )
  }

  showModalValue= () => {
    this.setState({ isModalValueVisible: true });
  }

//function that create the list of column
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

    selectTab.push({ value: 'choose field', text: 'choose field' , "disabled" : true });
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
    var pageIndex = 0;
    this.pager.setItemsPerPage(itemsPerPage);
    var exempleTimeout = setTimeout(this.Search(this.state.searchValue, pageIndex * itemsPerPage, itemsPerPage), 500);
    this.setState({
      itemsPerPage,
      itemIdToExpandedRowMap: {},
    });
  }

  onChangePage = pageIndex => {
    var exempleTimeout = setTimeout(this.Search(this.state.searchValue, pageIndex * this.state.itemsPerPage, this.state.itemsPerPage), 500);
    this.setState({
      itemIdToExpandedRowMap: {},
    });
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

//function that handles the check of all checkboxes
  toggleAll = () => {
    const allSelected = this.areAllItemsSelected();
    const newItemIdToSelectedMap = {};
    this.state.items.forEach(item => newItemIdToSelectedMap[item._id] = !allSelected);

    this.setState({
      itemIdToSelectedMap: newItemIdToSelectedMap,
    });

    if(allSelected)
    { this.setState({ itemsAreTrue: false,
                      checkAllDoc: false,
                      isPortalVisible: false
                    });
    }else {
      this.setState({ itemsAreTrue: true,
                      isPortalVisible: true
                    });
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

//function that get the fields of the index
  indexField(){
    var tab = [];
    var index = Object.keys(this.mapping)[0]
    var type = Object.keys(this.mapping[Object.keys(this.mapping)[0]]["mappings"])[0];
    for (var v in Object.keys(this.mapping[index]["mappings"][type]["properties"])) {
      if(this.mapping[index]["mappings"][type]["properties"][Object.keys(this.mapping[index]["mappings"][type]["properties"])[v]]["type"]){
        if((! Object.keys(this.mapping[index]["mappings"][type]["properties"])[v].startsWith("_"))&&(! Object.keys(this.mapping[index]["mappings"][type]["properties"])[v].startsWith("$"))&&( ! Object.keys(this.mapping[index]["mappings"][type]["properties"])[v].startsWith("sort"))) {
          tab.push(Object.keys(this.mapping[index]["mappings"][type]["properties"])[v])
          this.bodyAdd[Object.keys(this.mapping[index]["mappings"][type]["properties"])[v]] = '';
        }
      }
    }
    return tab;
  }

//function that get the input value textfield of add Document interface
  handleInput(event){
    this.bodyAdd[event.target.name] = event.target.value;
  }

  handleDelete(id){
    if(this.state.items.length != 0){
    let index = this.state.items[0]._index;
    let type = this.state.items[0]._type;
    fetch("../api/label/"+index+"/"+type+"/"+id, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
      'kbn-xsrf': 'reporting'
      }
    })
    .then(res => res.json())
    .then(
    (result) => {
      if(this.state.items.length == 1){
        if (this.state.total <= 1) {
          this.pager = new Pager(0 , this.state.itemsPerPage);

            this.setState({
              items: [],
            });
            setTimeout(function() { this.Search(this.state.searchValue, this.pager.currentPageIndex * this.state.itemsPerPage, this.state.itemsPerPage) }.bind(this), 1000);
        } else {
          this.setState({ total: this.state.total - 1});
          setTimeout(function() { this.Search(this.state.searchValue, (this.pager.currentPageIndex - 1) * this.state.itemsPerPage, this.state.itemsPerPage) }.bind(this), 1000);
        }
      }else {
        setTimeout(function() { this.Search(this.state.searchValue, this.pager.currentPageIndex * this.state.itemsPerPage, this.state.itemsPerPage) }.bind(this), 1000);
      }
    },
    (error) => {
    }
  )
  }
  }

  addDocument = () => {
    var index = Object.keys(this.mapping)[0]
    var type = Object.keys(this.mapping[Object.keys(this.mapping)[0]]["mappings"])[0];
    fetch("../api/label/"+index+"/"+type+"/", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'kbn-xsrf': 'reporting'
        },
        body:JSON.stringify(this.bodyAdd)
      })
      .then(res => res.json())
      .then(
        (result) => {
          setTimeout(function() { this.Search(this.state.searchValue, this.pager.currentPageIndex * this.state.itemsPerPage, this.state.itemsPerPage) }.bind(this), 1000);
          this.bodyAdd = {};
        },
        (error) => {
        }
      )
  }

//function that get the input value textfield of edit Document interface
  handleInputEdit(event){
    this.bodyEdit[event.target.name] = event.target.value;
  }

  editDoc(id){
    if(this.state.items.length != 0){
      let index = this.state.items[0]._index;
      let type = this.state.items[0]._type;
      let body = {
        "doc": this.bodyEdit
      };
        fetch("../api/label/"+index+"/"+type+"/"+id+"/_update", {
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
              this.bodyEdit = {};
            },
            (error) => {
            }
        )}
  }

//function that show document details
  toggleDetails = (item) => {
    const itemIdToExpandedRowMap = { ...this.state.itemIdToExpandedRowMap };
    if (itemIdToExpandedRowMap[item._id]) {
      delete itemIdToExpandedRowMap[item._id];
    } else {
      const listItems = [];
      itemIdToExpandedRowMap[item._id] = (
        <EuiDescriptionList listItems={listItems} />
      );
    }
    this.setState({ itemIdToExpandedRowMap });
  };

  renderHeaderCells() {
    return this.state.columns.map((column, columnIndex) => {
      if (column.isCheckbox) {
        return (
          <EuiTableHeaderCellCheckbox key={column.id} width={column.width}>
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
    var expRow;
    if(this.state.items.length != 0){
    const renderRow = item => {
      const cells = this.state.columns.map(column => {
        const cell = item[column.id];
        let poptab = Object.values(item);
        let key;let val;
        let popkey = Object.keys(item);
        let act = "";
        let child;

            const keyValue = popkey.map(k => {
              if((k != "_source") && (! k.startsWith("_")) && (! k.startsWith("_")) && (! k.startsWith("sort")))
              { key = k;
                val = item[k];

              return (
                <div key={key}>
                        <EuiFormRow key={k} label={k} style={{ marginLeft: '80px' }}>
                          <EuiFieldText name={key} onChange={this.handleInputEdit.bind(this)} defaultValue={val+''}/>
                        </EuiFormRow>
                    <EuiSpacer size="xs" />
                </div>
              );
            }}
            );

            expRow = popkey.map(k => {
              if(k != "_source")
              { key = k + " : ";
                val = item[k];

              return (
                <div key={key}>
                    <span style={{ color: '#005472' }}>

                        {key}

                    </span>
                    <EuiTextColor color="default">{val}</EuiTextColor>
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
            if(this.state.itemsAreTrue)
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
            <EuiTableRowCell key={column.id} textOnly={false} align="right">
              <EuiPopover
                id={`${item._id}-actions`}
                ownFocus
                button={(
                  <div style={{ width: '121px'}}>
                    <EuiButtonIcon
                      aria-label="Actions"
                      iconType="pencil"
                      style={{ width: '40px',height:'40px',marginLeft: '-100px'}}
                      onClick={() => this.togglePopover(item._id)}
                    />
                    <EuiButtonIcon
                      aria-label="Actions"
                      iconType="trash"
                      style={{ width: '40px',height:'40px', color: 'red'}}
                      onClick={() => {var result = confirm("Want to delete?");
                      if (result) {
                          this.handleDelete(item._id)}}
                      }
                    />
                    <EuiButtonIcon
                      style={{ width: '40px',height:'40px'}}
                      onClick={() => this.toggleDetails(item)}
                      aria-label={this.state.itemIdToExpandedRowMap[item._id] ? 'Collapse' : 'Expand'}
                      iconType={this.state.itemIdToExpandedRowMap[item._id] ? 'arrowUp' : 'arrowDown'}
                    />
                  </div>
                )}
                isOpen={this.isPopoverOpen(item._id)}
                closePopover={() => this.closePopover(item._id)}
                panelPaddingSize="none"
                anchorPosition="leftCenter"
              >

              <EuiPopoverTitle style={{ width: '820px',height: '440px', padding: '20px',backgroundColor: '#ffffff',border: '3px solid #005472',overflowY:'auto'}}>
                <EuiTitle size="m">
                  <h1 style={{ color: '#005472', fontWeight: '900', textAlign:'center', paddingBottom:'40px'}}>DOCUMENT DETAILS</h1>
                </EuiTitle>
                {keyValue}
                <EuiButtonEmpty onClick={() => this.closePopover(item._id)} style={{float:'right',position: 'fixed',right: '165px',bottom: '15px'}}>
                  Cancel
                </EuiButtonEmpty>
                <EuiButton onClick={() => this.editDoc(item._id)} fill style={{float:'right',position: 'fixed',right: '30px',bottom: '15px'}}>
                  Save
                </EuiButton>
              </EuiPopoverTitle>

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
          <EuiTableRowCell key={column.id} align={column.alignment} textOnly={cell ? cell.textOnly : true}>
            {child}
          </EuiTableRowCell>
        );
      });

      return (
        <EuiTableBody key={item._id+'-'} style={{ display:'contents'}}>
        <EuiTableRow key={item._id} isSelected={this.isItemSelected(item._id)}>
          {cells}
        </EuiTableRow>
        <EuiTableRow key={item._id+'_'} isSelected={this.isItemSelected(item._id)}
          style={{ display: this.state.itemIdToExpandedRowMap[item._id] ? 'contents' : 'none'}}
        >
        <td style={{ backgroundColor: '#fbfbfb'}}></td>
        <td colSpan={this.state.columns.length - 1} style={{ paddingTop: '10px', backgroundColor: '#fbfbfb'}}>
          {expRow}
        </td>
        </EuiTableRow>
        </EuiTableBody>
      );
    };

    const rows = [];
    for (let itemIndex = this.state.firstItemIndex; itemIndex <= this.state.lastItemIndex; itemIndex++) {
      const item = this.state.items[itemIndex];
      rows.push(renderRow(item));
    }
    return rows;
  }
  }

  render() {
    let optionalActionButtons;
    const formS = this.selectedFieldValues.map(k => {
      return (
          <option key={k} value={k}/>
      );
    }
    );

    let saveB;
    if (this.state.value !='') {
      saveB = (
      <EuiButton onClick={this.addValueLabel} fill>Save</EuiButton>
    );
    }else {
      saveB = (
      <EuiButton onClick={this.addValueLabel} fill isDisabled>Save</EuiButton>
    );
    }

    let modalValue;
    if (this.state.isModalValueVisible) {
      modalValue = (
        <EuiOverlayMask>
          <EuiModal onClose={this.closeModalValue} style={{ width: '800px' }}>
            <EuiModalHeader>
              <EuiModalHeaderTitle style={{ color: '#025471'}}>
                Add a value to this field
              </EuiModalHeaderTitle>
            </EuiModalHeader>
            <EuiSpacer size="s" />
            <span style={{ marginLeft: '20px' }}> ( All aggregatable fields are autocompleted. )</span>
            <EuiModalBody>
              <Fragment>
                <EuiFormRow label="Field name">
                  <EuiSelect
                    options={this.columnsProp}
                    defaultValue={this.columnsProp[0].value}
                    onChange={this.onChangeSelect}
                  />
                </EuiFormRow>
                <EuiSpacer size="m" />
                <label style={{fontWeight: '600', fontSize: '13px'}}>Value</label><br></br><br></br>
                <EuiFieldText list="val" type="text" id="choix_val" name="popValue" onChange={this.handleValue.bind(this)}/>
                <datalist id="val">
                  {formS}
                </datalist>
          </Fragment>
            </EuiModalBody>
            <EuiModalFooter>
              <EuiButtonEmpty onClick={this.closeModalValue}>
                Cancel
              </EuiButtonEmpty>
              {saveB}
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
          style={{ width: '148px',marginTop: '8px'}}>Edit field value</EuiButton>
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
        <Heads addDocMethod={this.addDocument} handleInput={this.handleInput} showModal={this.showModal} closeModal={this.closeModal} indexFd={this.indexFd} mapping={this.mapping} mVisible={this.state.isModalVisible} pVisible={this.state.isPortalVisible}/>
        {optionalActionButtons}

        <Portal tabItems={this.state.items.length} total={this.state.total} visible={this.state.isPortalVisible} checkAllDoc={this.state.checkAllDoc} itemsAreTrue={this.state.itemsAreTrue} checkAllDocs={this.checkAllDocs}/>
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
            {this.renderRows()}
        </EuiTable>

        <EuiSpacer size="m" />

        <EuiTablePagination
          activePage={this.state.currentPageIndex}
          itemsPerPage={this.state.itemsPerPage}
          itemsPerPageOptions={[5, 10, 20]}
          pageCount={this.pager.getTotalPages()}
          onChangeItemsPerPage={this.onChangeItemsPerPage.bind(this)}
          onChangePage={this.onChangePage.bind(this)}
        />
        {optionalActionButtons}
        <EuiSpacer size="xl" />
      </div>
    );
  }
}
