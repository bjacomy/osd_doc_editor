(window["docEditor_bundle_jsonpfunction"] = window["docEditor_bundle_jsonpfunction"] || []).push([[1],{

/***/ "./public/application.tsx":
/*!********************************!*\
  !*** ./public/application.tsx ***!
  \********************************/
/*! exports provided: renderApp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderApp", function() { return renderApp; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/app */ "./public/components/app.tsx");



const renderApp = ({
  notifications,
  http
}, {
  navigation
}, {
  appBasePath,
  element
}) => {
  react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_app__WEBPACK_IMPORTED_MODULE_2__["DocEditorApp"], {
    basename: appBasePath,
    notifications: notifications,
    http: http,
    navigation: navigation
  }), element);
  return () => react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.unmountComponentAtNode(element);
};

/***/ }),

/***/ "./public/components/AddDocumentButton.js":
/*!************************************************!*\
  !*** ./public/components/AddDocumentButton.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);


/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButton"], {
    fill: true,
    iconSide: "right",
    iconType: "indexOpen",
    style: {
      backgroundColor: '#005472'
    },
    onClick: props.onClick
  }, "Add document");
});

/***/ }),

/***/ "./public/components/DatatableActions.js":
/*!***********************************************!*\
  !*** ./public/components/DatatableActions.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _AddDocumentButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AddDocumentButton */ "./public/components/AddDocumentButton.js");
/* harmony import */ var _wrapper_ManageDocWrapper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./wrapper/ManageDocWrapper */ "./public/components/wrapper/ManageDocWrapper.js");
/* harmony import */ var _wrapper_GroupUpdateDocsWrapper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./wrapper/GroupUpdateDocsWrapper */ "./public/components/wrapper/GroupUpdateDocsWrapper.js");
/* harmony import */ var _lib_items__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/items */ "./public/lib/items.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! axios */ "../../node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_6__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








/* harmony default export */ __webpack_exports__["default"] = (class extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props); // props.index
    // props.mapping
    // props.items
    // props.total {docs:999, pages:99}
    // props.areAllPagesItemsSelected
    // props.selectAllPagesItems  fn : avoid to manage an internal state with suplication of data
    // props.addCallback
    // props.updateCallback
    // props.deleteCallback

    _defineProperty(this, "onButtonClick", () => {
      this.setState(prevState => ({
        isPopoverOpen: !prevState.isPopoverOpen
      }));
    });

    _defineProperty(this, "closePopover", () => {
      this.setState({
        isPopoverOpen: false
      });
    });

    this.state = {
      isPopoverOpen: false
    };
    axios__WEBPACK_IMPORTED_MODULE_6___default.a.defaults.headers.post['kbn-xsrf'] = "reporting";
    axios__WEBPACK_IMPORTED_MODULE_6___default.a.defaults.headers.delete['kbn-xsrf'] = "reporting";
  }

  render() {
    const selectedItems = Object(_lib_items__WEBPACK_IMPORTED_MODULE_5__["getSelectedItems"])(this.props.items);
    const addButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_wrapper_ManageDocWrapper__WEBPACK_IMPORTED_MODULE_3__["default"], {
      index: this.props.index,
      mapping: this.props.mapping,
      data: {},
      submitCallback: this.props.addDocument()
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_AddDocumentButton__WEBPACK_IMPORTED_MODULE_2__["default"], null));
    const manageSelectedButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButton"], {
      iconType: "arrowDown",
      iconSide: "right",
      onClick: this.onButtonClick
    }, "Manage selected items");
    let deleteCb, updateCb;

    if (this.props.areAllPagesItemsSelected) {
      deleteCb = this.props.deleteCallback(null, `Delete all (${this.props.total.docs}) selected items?`, true);
      updateCb = this.props.updateDocument(null, true);
    } else {
      deleteCb = this.props.deleteCallback(selectedItems.map(i => i._id).join(','), `Delete this (${selectedItems.length}) selected items?`, false);
      updateCb = this.props.updateDocument(selectedItems.map(i => i._id).join(','), false);
    }

    const items = [/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_wrapper_GroupUpdateDocsWrapper__WEBPACK_IMPORTED_MODULE_4__["default"], {
      key: "UpdateWrapper",
      index: this.props.index,
      mapping: this.props.mapping,
      submitCallback: updateCb
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiContextMenuItem"], {
      key: "Update",
      icon: "pencil"
    }, "Update selected")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiContextMenuItem"], {
      key: "Delete",
      icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiIcon"], {
        type: "trash",
        color: "danger",
        size: "m"
      }),
      onClick: deleteCb
    }, "Delete selected")]; // when one item is selected, we can manage some group action

    let manageSelectedPopover;

    if (Object(_lib_items__WEBPACK_IMPORTED_MODULE_5__["areAtLeastOneCurrentPageItemsSelected"])(this.props.items)) {
      manageSelectedPopover = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPopover"], {
        id: "contextMenu",
        button: manageSelectedButton,
        isOpen: this.state.isPopoverOpen,
        closePopover: this.closePopover,
        panelPaddingSize: "none",
        withTitle: true,
        anchorPosition: "downLeft"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiContextMenuPanel"], {
        hasFocus: false // avoid a bug when key pressed on up or down arrows
        ,
        items: items
      }));
    } // when all items are selected, and multiple pages exists, we can select to apply updates on all docs by query


    let selectAllLink;

    if (Object(_lib_items__WEBPACK_IMPORTED_MODULE_5__["areAllCurrentPageItemsSelected"])(this.props.items) && this.props.total.pages > 1) {
      if (!this.props.areAllPagesItemsSelected) {
        selectAllLink = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], {
          style: {
            marginTop: "10px"
          }
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", null, "The ", this.props.items.length, " documents on this page are selected.", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLink"], {
          onClick: () => {
            this.props.selectAllPagesItems(true);
          }
        }, "\xA0Select all ", this.props.total.docs, " documents?")));
      } else {
        selectAllLink = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], {
          style: {
            marginTop: "10px"
          }
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", null, "All ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          style: {
            color: "#DD0A73"
          }
        }, this.props.total.docs, " documents are selected"), " (including all ", this.props.total.pages, " pages) !!", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLink"], {
          onClick: () => {
            this.props.selectAllPagesItems(false);
          }
        }, "\xA0Cancel the other pages selected?")));
      }
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], {
      gutterSize: "s"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
      key: "actionAdd",
      grow: false
    }, addButton), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
      key: "actionManage",
      grow: false
    }, manageSelectedPopover), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
      key: "actionSelectAll"
    }, selectAllLink));
  }

});

/***/ }),

/***/ "./public/components/FieldsSelector.js":
/*!*********************************************!*\
  !*** ./public/components/FieldsSelector.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/* harmony default export */ __webpack_exports__["default"] = (class extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "areAllFieldsSelected", () => {
      // return true if all elements is selected
      return this.getSelectedFields().length == this.props.fields.filter(f => !f.disabled).length;
    });

    _defineProperty(this, "onToggleAllFieldsChecked", e => {
      // no selected ids if all already selected, else all fields are selected
      let selectedFieldsLabels = this.areAllFieldsSelected() ? [] : this.props.fields.filter(f => !f.disabled).map(f => f.label);
      this.setState({
        selectedFieldsLabels
      });
      this.props.onSelectFields(selectedFieldsLabels);
    });

    _defineProperty(this, "onChangeSelectFields", selectedFields => {
      let selectedFieldsLabels = selectedFields.map(f => f.label);
      this.setState({
        selectedFieldsLabels
      });
      this.props.onSelectFields(selectedFieldsLabels);
    });

    this.state = {
      selectedFieldsLabels: []
    };
  }

  getFieldsByGroup() {
    // Get all unique type values
    let groupLabels = this.props.fields.map(p => p.type) // get the field datatype
    .filter((p, i, self) => self.indexOf(p) == i); // remove duplicates

    return groupLabels.map(g => ({
      key: g,
      label: g,
      options: this.props.fields.filter(f => f.type === g)
    }));
  }

  getSelectedFields() {
    return this.props.fields.filter(f => this.state.selectedFieldsLabels.includes(f.label));
  }

  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFormRow"], {
      label: "Select the fields to vizualize",
      helpText: "For some index with many existing fields, visualisation is better with a short preset of fields"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiComboBox"], {
      placeholder: "",
      options: this.getFieldsByGroup(),
      selectedOptions: this.getSelectedFields(),
      onChange: this.onChangeSelectFields,
      isClearable: true
    }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFlexItem"], {
      style: {
        marginTop: '40px'
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiSwitch"], {
      label: "Check all fields",
      checked: this.areAllFieldsSelected(),
      onChange: this.onToggleAllFieldsChecked
    }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiSpacer"], {
      size: "m"
    }));
  }

});

/***/ }),

/***/ "./public/components/Header.js":
/*!*************************************!*\
  !*** ./public/components/Header.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Header; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_fontawesome__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-fontawesome */ "./node_modules/react-fontawesome/lib/index.js");
/* harmony import */ var react_fontawesome__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_fontawesome__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__);




function Header(props) {
  let firstPageLink;
  if (props.firstPage !== true) firstPageLink = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiHeaderSectionItem"], {
    border: "right"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiLink"], {
    href: "#/",
    onClick: e => {
      e.preventDefault();
      props.onClickHome();
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_fontawesome__WEBPACK_IMPORTED_MODULE_2___default.a, {
    className: "fas fa-arrow-circle-left",
    name: "fas fa-arrow-circle-left",
    size: "3x",
    style: {
      color: '#025471',
      paddingLeft: '15px',
      marginTop: '10px',
      width: '70px'
    }
  })));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiHeader"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiHeaderSection"], null, firstPageLink, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiHeaderLogo"], {
    "aria-label": "Doc Editor logo",
    iconType: "indexEdit",
    size: "xxl",
    style: {
      color: '#025471',
      paddingLeft: '20px',
      marginTop: '10px',
      width: '50px'
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiTitle"], {
    size: "l"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", {
    style: {
      color: '#025471',
      padding: '10px'
    }
  }, "Doc Editor")))));
}

/***/ }),

/***/ "./public/components/IndexDetails.js":
/*!*******************************************!*\
  !*** ./public/components/IndexDetails.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui_dist_eui_theme_light_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui/dist/eui_theme_light.css */ "../../node_modules/@elastic/eui/dist/eui_theme_light.css");
/* harmony import */ var _elastic_eui_dist_eui_theme_light_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui_dist_eui_theme_light_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var brace_ext_language_tools__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! brace/ext/language_tools */ "../../node_modules/brace/ext/language_tools.js");
/* harmony import */ var brace_ext_language_tools__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(brace_ext_language_tools__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Header_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Header.js */ "./public/components/Header.js");
/* harmony import */ var _SearchBar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SearchBar */ "./public/components/SearchBar.js");
/* harmony import */ var _DatatableActions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DatatableActions */ "./public/components/DatatableActions.js");
/* harmony import */ var _AddDocumentButton__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AddDocumentButton */ "./public/components/AddDocumentButton.js");
/* harmony import */ var _wrapper_ManageDocWrapper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./wrapper/ManageDocWrapper */ "./public/components/wrapper/ManageDocWrapper.js");
/* harmony import */ var _lib_search__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../lib/search */ "./public/lib/search.js");
/* harmony import */ var _lib_items__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../lib/items */ "./public/lib/items.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../lib/utils */ "./public/lib/utils.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! axios */ "../../node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

 // import "@elastic/eui/dist/eui_theme_k6_light.css"













/* harmony default export */ __webpack_exports__["default"] = (class extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "onChangeItemsPerPage", itemsPerPage => {
      this.pager.setItemsPerPage(itemsPerPage);
      this.search({
        from: 0,
        size: itemsPerPage
      });
    });

    _defineProperty(this, "onChangePage", pageIndex => {
      this.search({
        from: pageIndex * this.state.search.size
      });
    });

    _defineProperty(this, "toggleSelectItem", itemToToggle => {
      return e => {
        this.setState(previousState => ({
          areAllPagesItemsSelected: false,
          items: previousState.items.map(item => {
            if (item === itemToToggle) item.selected = !(item.selected || false);
            return item;
          })
        }));
      };
    });

    _defineProperty(this, "toggleSelectAll", () => {
      return e => {
        this.setState(previousState => {
          const allSelected = !Object(_lib_items__WEBPACK_IMPORTED_MODULE_9__["areAllCurrentPageItemsSelected"])(previousState.items);
          return {
            areAllPagesItemsSelected: false,
            items: previousState.items.map(item => {
              item.selected = allSelected;
              return item;
            })
          };
        });
      };
    });

    _defineProperty(this, "toggleDetails", item => {
      let expandedItemIds = this.state.expandedItemIds;

      if (expandedItemIds.includes(item._id)) {
        expandedItemIds = expandedItemIds.filter(i => i !== item._id);
      } else {
        expandedItemIds = [...expandedItemIds, item._id];
      }

      this.setState({
        expandedItemIds
      });
    });

    _defineProperty(this, "selectAllPagesItems", isAllSelected => {
      this.setState({
        areAllPagesItemsSelected: isAllSelected
      });
    });

    this.index = props.index;
    this.selectedColumns = props.selectedColumns;
    this.onClickHome = props.onClickHome; // this.index = props.match.params.index
    // this.selectedColumns = props.match.params.cols

    this.state = {
      items: [],
      // the set of displayed docs in data table
      total: 0,
      // total items for pager
      search: {
        // search bar and pagination state
        query: "",
        from: 0,
        size: 10,
        sort: {
          "_id": "asc"
        }
      },
      areAllPagesItemsSelected: false,
      mapping: false,
      flyout: {
        isVisible: false,
        // condition the display of the global flyout
        type: false,
        // choose the flyout type to display : "new", "update" or "group"
        data: false // set the data by the flyout type : false when "new", single doc item when "update", list of docs when "group"

      },
      expandedItemIds: [] // set of expanded item ids

    };
    this.init();
    axios__WEBPACK_IMPORTED_MODULE_11___default.a.defaults.headers.post['kbn-xsrf'] = "reporting";
    axios__WEBPACK_IMPORTED_MODULE_11___default.a.defaults.headers.delete['kbn-xsrf'] = "reporting";
    this.search = this.search.bind(this);
    this.toggleSelectItem = this.toggleSelectItem.bind(this);
    this.toggleSelectAll = this.toggleSelectAll.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.onChangeItemsPerPage = this.onChangeItemsPerPage.bind(this);
    this.selectAllPagesItems = this.selectAllPagesItems.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.addDocument = this.addDocument.bind(this);
    this.updateDocument = this.updateDocument.bind(this);
  }

  async init() {
    await this.initMapping();
    await this.initHeaderColumns();
    await this.search();
    this.pager = new _elastic_eui__WEBPACK_IMPORTED_MODULE_12__["Pager"](this.state.total, this.state.search.size);
    this.state.firstItemIndex = this.pager.getFirstItemIndex();
    this.state.lastItemIndex = this.pager.getLastItemIndex();
  }

  async initMapping() {
    try {
      const mapping = await axios__WEBPACK_IMPORTED_MODULE_11___default.a.get(`../api/doc-editor/${this.index}/_mapping`);
      this.setState(() => ({
        mapping: mapping.data
      }));
    } catch (err) {
      console.log("Error on getting mapping. Check the network tab to find why the mapping request failed.");
    }
  }
  /**
   * Create the headerColumn object containing the datatable headers informations (used later in renderHeaderCells)
   */


  async initHeaderColumns() {
    let check = {
      id: 'checkbox',
      type: 'checkbox',
      textOnly: false,
      width: '50px',
      alignment: _elastic_eui__WEBPACK_IMPORTED_MODULE_12__["LEFT_ALIGNMENT"]
    };
    let actions = {
      id: 'actions',
      type: 'actions',
      label: 'actions',
      alignment: _elastic_eui__WEBPACK_IMPORTED_MODULE_12__["RIGHT_ALIGNMENT"],
      width: '90px'
    };
    let columns = this.selectedColumns.map(prop => ({
      id: prop,
      label: prop,
      alignment: _elastic_eui__WEBPACK_IMPORTED_MODULE_12__["LEFT_ALIGNMENT"]
    }));
    this.headerColumns = [check, ...columns, actions];
  }
  /**
   * Request a search to ES according to the filter bar and given pagination parameters
   */


  async search({
    query = false,
    from = false,
    size = false,
    sort = false
  } = {}) {
    // special case reset the from value if the query changes
    if (query !== false && from === false) from = 0; // Merge parameters with existing search

    query = query !== false ? query : this.state.search.query;
    from = from !== false ? from : this.state.search.from, size = size !== false ? size : this.state.search.size, sort = sort !== false ? sort : this.state.search.sort; // create the query json part, when query is empty or not

    let queryReq = Object(_lib_search__WEBPACK_IMPORTED_MODULE_8__["getQueryDslBySearchText"])(query); // let queryReq = { match_all: {} }

    var requestBody = {
      from,
      size,
      sort,
      query: queryReq
    };

    try {
      let result = (await axios__WEBPACK_IMPORTED_MODULE_11___default.a.post(`../api/doc-editor/${this.index}/_search`, requestBody)).data;
      this.pager = new _elastic_eui__WEBPACK_IMPORTED_MODULE_12__["Pager"](result.hits.total.value, size);
      this.setState({
        search: {
          query,
          from,
          size,
          sort
        },
        items: result.hits.hits,
        firstItemIndex: this.pager.getFirstItemIndex(),
        lastItemIndex: this.pager.getLastItemIndex(),
        total: result.hits.total.value
      });
    } catch (err) {
      console.log("Error during search", err);
    }
  }

  // END MANAGE SELECTED ITEMS
  // ---------------------
  // MANAGE ACTIONS ON DOC
  // ---------------------
  // Add a new document with given body and reload search
  addDocument() {
    // const {
    //   index: i,
    // } = this.state
    const i = this.index;
    const search = this.search;
    return async function (docBody) {
      try {
        const response = await axios__WEBPACK_IMPORTED_MODULE_11___default.a.post(`../api/doc-editor/${i}/_doc`, docBody);
        search();
        return response;
      } catch (err) {
        console.log("Error during adding document", err);
        return false;
      }
    };
  } // Delete the given item (or many separated by ,) and reload search


  deleteDocument(itemId, confirmMessage = "Delete this document?", applyByQueryOnAllDocs = false) {
    // const {
    //   index: i
    // } = this.state
    const i = this.index;
    const s = this.state.search; // used for by query request

    const search = this.search;
    return async function (e) {
      var result = confirm(confirmMessage);

      if (!result) {
        return false;
      }

      try {
        if (applyByQueryOnAllDocs) {
          await axios__WEBPACK_IMPORTED_MODULE_11___default.a.post(`../api/doc-editor/${i}/_doc/_delete_by_query`, {
            query: Object(_lib_search__WEBPACK_IMPORTED_MODULE_8__["getQueryDslBySearchText"])(s.query)
          });
        } else {
          await axios__WEBPACK_IMPORTED_MODULE_11___default.a.delete(`../api/doc-editor/${i}/_doc/${itemId}`);
        }

        search();
      } catch (err) {
        console.log("Error on deleting item(s) ", err);
      }
    };
  } // Update an existing document (or many separated by ,) by Id with given body and reload search


  updateDocument(docId, applyByQueryOnAllDocs = false) {
    // const {
    //   index: i,
    // } = this.state
    const i = this.index;
    const s = this.state.search; // used for by query request

    const search = this.search;
    return async function (docBody) {
      try {
        let response;

        if (applyByQueryOnAllDocs) {
          let script = Object.keys(docBody).map(key => `ctx._source.${key} = \"${docBody[key]}\"`).join(';');
          response = await axios__WEBPACK_IMPORTED_MODULE_11___default.a.post(`../api/doc-editor/${i}/_doc/_update_by_query`, {
            query: Object(_lib_search__WEBPACK_IMPORTED_MODULE_8__["getQueryDslBySearchText"])(s.query),
            script
          });
        } else {
          response = await axios__WEBPACK_IMPORTED_MODULE_11___default.a.post(`../api/doc-editor/${i}/_doc/${docId}/_update`, docBody);
        }

        search();
        return response;
      } catch (err) {
        console.log("Error during updating item(s)", err);
        return false;
      }
    };
  } // --------------
  // RENDER SECTION
  // --------------


  renderHeaderCells() {
    if (!this.headerColumns) {
      return null;
    }

    return this.headerColumns.map((column, columnIndex) => {
      if (column.type === "checkbox") {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiTableHeaderCellCheckbox"], {
          key: column.id,
          align: this.headerColumns[columnIndex].alignment,
          width: column.width
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiCheckbox"], {
          id: "selectAllCheckbox",
          checked: Object(_lib_items__WEBPACK_IMPORTED_MODULE_9__["areAllCurrentPageItemsSelected"])(this.state.items),
          onChange: this.toggleSelectAll(),
          type: "inList"
        }));
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiTableHeaderCell"], {
        key: column.id,
        align: this.headerColumns[columnIndex].alignment,
        width: column.width,
        style: {
          color: '#025471'
        }
      }, column.label);
    });
  }

  renderRows() {
    if (!this.headerColumns) {
      return null;
    }

    if (this.state.items.length == 0) {
      return null;
    } // Similar as a "1 -> n" array.map process
    // Loop on each items and create a main row and its expanded row


    return this.state.items.reduce((rows, item) => {
      // main item row
      rows.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiTableRow"] // add the main item row and render cells for each columns
      , {
        key: `${item._id}-row`,
        hasActions: true,
        isExpandable: true
      }, this.headerColumns.map(column => this.renderCell(item, column)))); // if expanded is toggled, add the expanded item row and render a full colSpan cell with expanded content

      if (this.state.expandedItemIds.includes(item._id)) {
        rows.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiTableRow"] // expanded item row
        , {
          key: `${item._id}-row-expanded`,
          isExpandedRow: this.state.expandedItemIds.includes(item._id)
        }, this.renderCellExpandedPart(item, this.headerColumns.length)));
      }

      return rows;
    }, []);
  }

  renderCheckboxCell(item, column) {
    let checked = Object(_lib_items__WEBPACK_IMPORTED_MODULE_9__["isItemSelected"])(item);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiTableRowCellCheckbox"], {
      key: column.id
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiCheckbox"], {
      id: `${item._id}-checkbox`,
      checked: checked,
      onChange: this.toggleSelectItem(item),
      type: "inList"
    }));
  }

  renderActionsCell(item, column) {
    const {
      expandedItemIds
    } = this.state;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiTableRowCell"], {
      key: column.id,
      textOnly: false,
      hasActions: true,
      isExpander: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_wrapper_ManageDocWrapper__WEBPACK_IMPORTED_MODULE_7__["default"], {
      index: this.index,
      mapping: this.state.mapping,
      data: item._source,
      submitCallback: this.updateDocument(item._id)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiButtonIcon"], {
      "aria-label": "Actions",
      iconType: "pencil",
      style: {
        width: '20px',
        height: '20px'
      }
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiButtonIcon"], {
      "aria-label": "Actions",
      iconType: "trash",
      style: {
        width: '20px',
        height: '20px',
        color: 'red'
      },
      onClick: this.deleteDocument(item._id)
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiButtonIcon"], {
      style: {
        width: '20px',
        height: '20px'
      },
      onClick: () => this.toggleDetails(item),
      "aria-label": expandedItemIds.includes(item._id) ? 'Collapse' : 'Expand',
      iconType: expandedItemIds.includes(item._id) ? 'arrowUp' : 'arrowDown'
    })));
  }

  renderCell(item, column) {
    switch (column.type) {
      case 'checkbox':
        return this.renderCheckboxCell(item, column);

      case 'actions':
        return this.renderActionsCell(item, column);
    } // else default common cell type


    let cellValue = item._source[column.id];

    if (cellValue === undefined) {
      cellValue = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        style: {
          opacity: 0.7
        }
      }, "-");
    } else if (typeof cellValue === 'boolean') {
      cellValue = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiSwitch"], {
        checked: cellValue,
        disabled: true
      });
    } else if (["object", "array", "nested"].includes(typeof cellValue)) {
      // if object or array or nested, display the content in tooltip
      let content = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("pre", {
        className: "prettyprint"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("code", null, Object(_lib_utils__WEBPACK_IMPORTED_MODULE_10__["stringifyOnce"])(cellValue, null, 2)));
      cellValue = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiToolTip"], {
        position: "top",
        content: content
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, "<", typeof cellValue, ">"));
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiTableRowCell"], {
      key: column.id,
      align: column.alignment,
      isExpander: false,
      truncateText: false,
      textOnly: false // necessary to display content on multiple line

    }, cellValue);
  }

  renderCellExpandedPart(item, colSpan) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiTableRowCell"], {
      key: "expanded-row-cell",
      align: _elastic_eui__WEBPACK_IMPORTED_MODULE_12__["LEFT_ALIGNMENT"],
      colSpan: colSpan,
      isExpander: true,
      truncateText: false,
      textOnly: false // necessary to display content on multiple line

    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiCodeBlock"], {
      language: "json",
      fontSize: "m",
      paddingSize: "m",
      color: "dark",
      overflowHeight: 300,
      isCopyable: true
    }, JSON.stringify(item, null, 2)));
  }

  renderDatatableActions() {
    if (!this.pager || !this.state.items.length) {
      return null;
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_DatatableActions__WEBPACK_IMPORTED_MODULE_5__["default"], {
      index: this.index,
      mapping: this.state.mapping,
      items: this.state.items,
      total: {
        docs: this.state.total,
        pages: this.pager.getTotalPages()
      },
      areAllPagesItemsSelected: this.state.areAllPagesItemsSelected,
      selectAllPagesItems: this.selectAllPagesItems
      /*selectedItems={this.getSelectedItems(this.state.items)}*/
      ,
      addDocument: this.addDocument,
      updateDocument: this.updateDocument,
      deleteCallback: this.deleteDocument
    });
  }

  renderDatatable() {
    if (!this.state.items.length) {
      return this.renderEmptyDatatable();
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiTable"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiTableHeader"], null, this.renderHeaderCells()), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiTableBody"], {
      style: {
        display: 'contents'
      }
    }, this.renderRows()));
  }

  renderEmptyDatatable() {
    let title,
        body,
        actions = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_wrapper_ManageDocWrapper__WEBPACK_IMPORTED_MODULE_7__["default"], {
      index: this.index,
      mapping: this.state.mapping,
      data: {},
      submitCallback: this.addDocument()
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_AddDocumentButton__WEBPACK_IMPORTED_MODULE_6__["default"], null));

    if (!this.state.search.query || this.state.search.query.trim() === "*") {
      title = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "You have no document in this index");
      body = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "No worries ! ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), "You can add a new one with this plugin :-)");
    } else {
      title = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "No document found with your filter");
      body = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "You should change your search query in the search bar. ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), "See the ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax",
        target: "_blank"
      }, "elasticsearch documentation"), " for more informations about the Query string syntax.");
      actions = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, actions, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiSpacer"], {
        size: "s"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiButton"], {
        onClick: () => {
          this.search({
            query: ""
          });
        }
      }, "Reset the current filter to view all documents"));
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiEmptyPrompt"], {
      iconType: "eyeClosed",
      title: title,
      body: body,
      actions: actions
    });
  }

  renderPagination() {
    if (!this.pager || !this.state.items.length) {
      return null;
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiTablePagination"], {
      activePage: this.state.search.from / this.state.search.size,
      itemsPerPage: this.state.search.size,
      itemsPerPageOptions: [10, 20, 50, 100],
      pageCount: this.pager.getTotalPages(),
      onChangeItemsPerPage: this.onChangeItemsPerPage,
      onChangePage: this.onChangePage
    });
  }

  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Header_js__WEBPACK_IMPORTED_MODULE_3__["default"], {
      onClickHome: this.onClickHome
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiSpacer"], {
      size: "m"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_SearchBar__WEBPACK_IMPORTED_MODULE_4__["default"], {
      search: this.search,
      query: this.state.search.query
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiSpacer"], {
      size: "m"
    }), this.renderDatatableActions(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiSpacer"], {
      size: "s"
    }), this.renderDatatable(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiSpacer"], {
      size: "s"
    }), this.renderDatatableActions(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiSpacer"], {
      size: "m"
    }), this.renderPagination(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_12__["EuiSpacer"], {
      size: "xl"
    }));
  } // END RENDER SECTION


});

/***/ }),

/***/ "./public/components/IndexList.js":
/*!****************************************!*\
  !*** ./public/components/IndexList.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _flyout_AddNewFieldFlyout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./flyout/AddNewFieldFlyout */ "./public/components/flyout/AddNewFieldFlyout.js");
/* harmony import */ var _FieldsSelector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FieldsSelector */ "./public/components/FieldsSelector.js");
/* harmony import */ var _Header__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Header */ "./public/components/Header.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

 // import ReactDOM from 'react-dom';





/* harmony default export */ __webpack_exports__["default"] = (class extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "onChangeSelectIndex", selectedIndices => {
      let selectedIndex = selectedIndices[0];
      this.setState({
        selectedIndex,
        availableFields: false
      });
      this.refreshMapping(selectedIndex.label);
    });

    _defineProperty(this, "refreshMapping", selectedIndexName => {
      let index = selectedIndexName;
      fetch(`../api/doc-editor/${index}/_mapping`, {
        method: 'get'
      }).then(res => res.json()).then(result => {
        let mappings = result[index]["mappings"];
        let indexProps = mappings["properties"];
        let availableFields = Object.keys(indexProps).map((key, i) => {
          if (indexProps[key]["type"]) {
            return {
              "id": i.toString(),
              "label": key,
              "type": indexProps[key]["type"],
              "disabled": false
            };
          } else {
            return {
              "id": i.toString(),
              "label": key + " (Complex Field not supported)",
              "type": "complex",
              "disabled": true
            };
          }
        });
        this.setState({
          availableFields: availableFields
        });
      }).catch(err => {
        console.log("Error to refresh the mapping :", err);
      });
    });

    _defineProperty(this, "changeSelectFields", selectedFields => {
      this.setState({
        selectedFieldsParams: selectedFields.join(","),
        isNextButtonActive: selectedFields && this.state.selectedIndex.label
      });
    });

    this.onClickNextButton = props.onClickNextButton;
    this.defaultIndexChoice = {
      label: 'choose index',
      disabled: true
    };
    let otherIndexChoices = this.props.indices.sort().map(i => ({
      "label": i
    }));
    this.indices = [this.defaultIndexChoice, ...otherIndexChoices];
    this.closeNewFieldModal = this.closeNewFieldModal.bind(this);
    this.showNewFieldModal = this.showNewFieldModal.bind(this);
    this.state = {
      availableFields: false,
      selectedIndex: this.defaultIndexChoice,
      isNextButtonActive: false,
      isModalVisible: false
    };
  }

  closeNewFieldModal() {
    this.setState({
      isModalVisible: false
    });
  }

  showNewFieldModal() {
    this.setState({
      isModalVisible: true
    });
  }

  render() {
    const {
      selectedOptions,
      selectedFieldsParams,
      selectedIndex,
      isNextButtonActive
    } = this.state;
    let nextButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButton"] // href={`#/index/${selectedIndex.label}/${selectedFieldsParams}`}
    , {
      iconSide: "right",
      iconType: "arrowRight",
      isDisabled: !isNextButtonActive,
      fill: true,
      onClick: () => this.onClickNextButton(selectedIndex.label, selectedFieldsParams) // onClick={() => { ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode) }}

    }, "Next");
    let fieldsSelector;
    let addNewFieldFlyout;
    let addNewFieldButton;

    if (this.state.selectedIndex !== this.defaultIndexChoice) {
      if (this.state.availableFields !== false) {
        if (!this.state.availableFields.length) {
          fieldsSelector = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], null, "No fields found for this index");
        } else {
          fieldsSelector = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_FieldsSelector__WEBPACK_IMPORTED_MODULE_3__["default"], {
            onSelectFields: this.changeSelectFields,
            fields: this.state.availableFields
          });
        }
      }

      addNewFieldButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButton"], {
        onClick: this.showNewFieldModal,
        iconSide: "left",
        iconType: "plusInCircle"
      }, "Add a new field");

      if (this.state.isModalVisible) {
        addNewFieldFlyout = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_flyout_AddNewFieldFlyout__WEBPACK_IMPORTED_MODULE_2__["default"], {
          close: this.closeNewFieldModal,
          refreshMapping: this.refreshMapping,
          index: this.state.selectedIndex.label
        });
      }
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Header__WEBPACK_IMPORTED_MODULE_4__["default"], {
      firstPage: true
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], {
      size: "l"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
      style: {
        fontWeight: '600'
      }
    }, "Elasticsearch indices")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], {
      size: "l"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "Select the index to manage",
      helpText: "You can add new document, edit or delete existing and append new datafields to the selected index"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiComboBox"], {
      placeholder: "",
      singleSelection: {
        asPlainText: true
      },
      options: this.indices,
      selectedOptions: [this.state.selectedIndex],
      onChange: this.onChangeSelectIndex,
      isClearable: false
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], {
      size: "m"
    }), fieldsSelector, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, addNewFieldButton, addNewFieldFlyout)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], {
      size: "l"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, nextButton))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], {
      size: "l"
    }));
  }

});

/***/ }),

/***/ "./public/components/SearchBar.js":
/*!****************************************!*\
  !*** ./public/components/SearchBar.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SearchBar; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__);



function SearchBar(props) {
  const handleSearch = e => {
    props.search({
      query: e.queryText
    });
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFlexGroup"], {
    gutterSize: "m"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiSearchBar"], {
    fullWidth: true,
    onChange: handleSearch,
    query: props.queryText || "",
    placeholder: "Search..."
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFlexItem"], {
    grow: false
  }));
}

/***/ }),

/***/ "./public/components/app.tsx":
/*!***********************************!*\
  !*** ./public/components/app.tsx ***!
  \***********************************/
/*! exports provided: DocEditorApp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DocEditorApp", function() { return DocEditorApp; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @kbn/i18n/react */ "@kbn/i18n/react");
/* harmony import */ var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _IndexDetails__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./IndexDetails */ "./public/components/IndexDetails.js");
/* harmony import */ var _IndexList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./IndexList */ "./public/components/IndexList.js");
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */






const DocEditorApp = ({
  basename,
  http
}) => {
  // Use React hooks to manage state.
  const [atHome, setAtHome] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(true);
  const [indices, setIndices] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);
  const [index, setIndex] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({});
  const [toggleRefresh, setToggleRefresh] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const [isLoading, setIsLoading] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);

  const handleOnClickNextButton = (index, cols) => {
    setAtHome(false);
    setIndex({
      name: index,
      selectedColumns: cols.split(',')
    });
  };

  const handleOnclickHome = () => {
    setAtHome(true);
    setToggleRefresh(!toggleRefresh);
  };

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    const getIndices = async () => {
      setIsLoading(true);
      const result = await http.get('../api/doc-editor/indices');
      setIndices(result.data);
      setIsLoading(false);
    };

    getIndices();
    console.log('useEffect toggleRefresh: ', toggleRefresh);
  }, [toggleRefresh]); // Render the application DOM.

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["BrowserRouter"], {
    basename: basename
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_1__["I18nProvider"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiPage"], {
    restrictWidth: "1000px"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiPageBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiPageContent"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiPageContentBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiText"], null, atHome ? isLoading ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Loading ...") : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_IndexList__WEBPACK_IMPORTED_MODULE_5__["default"], {
    indices: indices,
    column: [],
    onClickNextButton: handleOnClickNextButton
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_IndexDetails__WEBPACK_IMPORTED_MODULE_4__["default"], {
    index: index.name,
    onClickHome: handleOnclickHome,
    selectedColumns: index.selectedColumns
  })))))))));
};

/***/ }),

/***/ "./public/components/flyout/AddNewFieldFlyout.js":
/*!*******************************************************!*\
  !*** ./public/components/flyout/AddNewFieldFlyout.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__);



/* harmony default export */ __webpack_exports__["default"] = (class extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      fieldName: "",
      selectedTypes: [],
      isInvalidName: false,
      isInvalidDatatype: false
    };
    this.datatypes = [{
      key: 'Text',
      label: 'Text',
      options: [{
        label: 'text'
      }, {
        label: 'keyword'
      }, {
        label: 'text+keyword'
      }]
    }, {
      key: 'Number',
      label: 'Number',
      options: [{
        label: 'short'
      }, {
        label: 'integer'
      }, {
        label: 'long'
      }, {
        label: 'float'
      }, {
        label: 'double'
      }]
    }, {
      key: 'Boolean',
      label: 'Boolean',
      options: [{
        label: 'boolean'
      }]
    }, {
      key: 'Date',
      label: 'Date',
      options: [{
        label: 'date'
      }]
    }];
    this.close = this.props.close;
    this.handleInputFieldname = this.handleInputFieldname.bind(this);
    this.handleChangeDatatype = this.handleChangeDatatype.bind(this);
    this.handleCreateNewField = this.handleCreateNewField.bind(this);
  }

  handleInputFieldname(e) {
    this.setState({
      fieldName: e.target.value,
      isInvalidName: this.isInvalidName(e.target.value)
    });
  }

  handleChangeDatatype(selectedTypes) {
    this.setState({
      selectedTypes,
      isInvalidDatatype: this.isInvalidDatatype(selectedTypes)
    });
  }

  isInvalidName(name) {
    return name.trim() === '';
  }

  isInvalidDatatype(types) {
    return !types || !types.length;
  }

  handleCreateNewField() {
    const {
      fieldName,
      selectedTypes
    } = this.state;
    const isInvalidName = this.isInvalidName(fieldName);
    const isInvalidDatatype = this.isInvalidDatatype(selectedTypes);

    if (isInvalidName || isInvalidDatatype) {
      this.setState({
        isInvalidName,
        isInvalidDatatype
      });
      return;
    }

    let body = this.getBody(fieldName, selectedTypes[0].label);
    fetch(`../api/doc-editor/${this.props.index}/_mapping`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'kbn-xsrf': 'reporting'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(result => {
      this.props.refreshMapping(this.props.index);
    }).catch(err => {
      console.log(`Error to create a new field ${fieldName} in index ${this.props.index}`, err);
    });
    this.close();
  }

  getBody(name, datatype, ignoreAbove = 512) {
    let type = {
      "type": datatype
    };

    if (datatype == "text+keyword") {
      type = {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": ignoreAbove
          }
        }
      };
    }

    return {
      "properties": {
        [name]: type
      }
    };
  }

  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFlyout"], {
      onClose: this.close,
      size: "m"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFlyoutHeader"], {
      hasBorder: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiTitle"], {
      size: "m"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
      id: "AddNewFieldToIndex"
    }, "Add a new field to this index"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFlyoutBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiForm"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFormRow"], {
      label: "Field name"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFieldText"], {
      name: "fieldname",
      value: this.state.fieldName,
      onChange: this.handleInputFieldname,
      isInvalid: this.state.isInvalidName
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiSpacer"], {
      size: "m"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFormRow"], {
      label: "Field datatype"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiComboBox"], {
      placeholder: "Choose a type",
      options: this.datatypes,
      selectedOptions: this.state.selectedTypes,
      onChange: this.handleChangeDatatype,
      isInvalid: this.state.isInvalidDatatype,
      isClearable: false,
      singleSelection: {
        asPlainText: true
      }
    })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFlyoutFooter"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFlexGroup"], {
      justifyContent: "spaceBetween"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiButtonEmpty"], {
      iconType: "cross",
      onClick: this.close,
      flush: "left"
    }, "Close")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiButton"], {
      onClick: this.handleCreateNewField,
      fill: true
    }, "Save")))));
  }

});

/***/ }),

/***/ "./public/components/flyout/GroupUpdateDocsFlyout.js":
/*!***********************************************************!*\
  !*** ./public/components/flyout/GroupUpdateDocsFlyout.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var brace_theme_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! brace/theme/github */ "../../node_modules/brace/theme/github.js");
/* harmony import */ var brace_theme_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(brace_theme_github__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var brace_mode_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! brace/mode/json */ "../../node_modules/brace/mode/json.js");
/* harmony import */ var brace_mode_json__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(brace_mode_json__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var brace_snippets_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! brace/snippets/json */ "../../node_modules/brace/snippets/json.js");
/* harmony import */ var brace_snippets_json__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(brace_snippets_json__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! axios */ "../../node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_5__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







/* harmony default export */ __webpack_exports__["default"] = (class extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props); // List of fields of the doc from mapping

    _defineProperty(this, "onChangeNewDocProp", value => {
      this.setState({
        newDocPropNameValue: value
      });
    });

    _defineProperty(this, "onAddNewDocProp", e => {
      if (!this.state.newDocPropNameValue) return false;
      this.setState(previousState => ({
        fieldsToUpdate: [...previousState.fieldsToUpdate, previousState.newDocPropNameValue],
        newDocPropNameValue: "",
        // reset the select
        body: { ...previousState.body,
          [previousState.newDocPropNameValue]: "" // add an initial empty value

        },
        bodyComplete: {} // reset all fields completion on new prop event

      }));
    });

    _defineProperty(this, "onRemoveNewDocProp", fieldToRemove => e => {
      this.setState(previousState => {
        // Destructuring assignement tricks
        // https://stackoverflow.com/questions/33053310/remove-value-from-object-without-mutating-it
        let {
          [fieldToRemove]: omit,
          ...bodyWithoutField
        } = previousState.body;
        return {
          fieldsToUpdate: previousState.fieldsToUpdate.filter(f => f !== fieldToRemove),
          body: bodyWithoutField
        };
      });
    });

    const docPropsObject = props.mapping[props.index]["mappings"]["properties"];
    this.docPropsList = Object.keys(docPropsObject).map(name => {
      let prop = docPropsObject[name];
      return {
        name,
        ...prop
      };
    });
    this.state = {
      fieldsToUpdate: [],
      newDocPropNameValue: "",
      body: {},
      bodyComplete: {}
    };
    this.options = this.docPropsList.map(docProp => ({
      value: docProp.name,
      inputDisplay: docProp.name,
      disabled: this.state.fieldsToUpdate.includes(docProp.name)
    }));
    this.onChangeNewDocProp = this.onChangeNewDocProp.bind(this);
    this.onAddNewDocProp = this.onAddNewDocProp.bind(this);
    this.onRemoveNewDocProp = this.onRemoveNewDocProp.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleInput(e) {
    const {
      name,
      value
    } = e.target;
    const {
      index: i
    } = this.props;
    this.setState(previousState => ({
      body: { ...previousState.body,
        [name]: value
      }
    }));
    let searchableFieldName; // to search top hits values in current field or it's multifield

    this.docPropsList.forEach(f => {
      if (f.name !== name) return;

      if (f.type === "keyword") {
        searchableFieldName = f.name;
        return;
      }

      if (f.fields) {
        let multiFields = Object.keys(f.fields);
        multiFields.forEach(sf => {
          if (f.fields[sf].type === "keyword") searchableFieldName = f.name + "." + sf;
        });
      }
    });

    if (searchableFieldName) {
      const complete = await axios__WEBPACK_IMPORTED_MODULE_5___default.a.get(`../api/doc-editor/${i}/_hits/${searchableFieldName}?beginwith=${value}`);
      this.setState(previousState => ({
        bodyComplete: {
          [name]: complete.data ? complete.data.map(c => c.key) : []
        }
      }));
    }
  }

  handleSubmit(e) {
    // save the same (partial) body for each docs, or by query
    this.props.saveDocs(this.state.body).then(result => {
      if (result) this.props.close();
    }).catch(err => {
      console.log("Unable to update the group of documents. Error :", err);
    });
  }

  getDocPropByName(name) {
    return this.docPropsList.find(docProp => docProp.name === name);
  } // loop on each props and display a form to manage it.
  // if a doc to edit is passed, fill the form input with the doc field value


  render() {
    // ICI une select box pour choisir le champ à modifier
    // en enlevant ceux deja choisit, et uniquement format compatible
    const selectFieldToUpdate = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiText"], null, "Choose a field you want to update"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiSuperSelect"], {
      options: this.options,
      valueOfSelected: this.state.newDocPropNameValue,
      onChange: this.onChangeNewDocProp
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiButton"], {
      onClick: this.onAddNewDocProp,
      style: {
        marginLeft: "10px"
      }
    }, "Add..."));
    const formProps = this.state.fieldsToUpdate.map(docPropName => {
      const docProp = this.getDocPropByName(docPropName);
      const propName = docProp["name"];
      let propType = docProp["type"];
      let value = this.state.body[propName];
      let propField = null;
      let propComplete = null;

      if (propType != 'undefined') {
        if (["long", "integer", "short", "byte", "double", "float", "half_float", "scaled_float"].includes(propType)) {
          propField = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFieldNumber"], {
            name: propName,
            value: value ? Number(value) : '',
            onChange: this.handleInput
          });
        } else if (["object", "geo_point"].includes(propType) || typeof value === 'array' || typeof value === 'object') {
          propField = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiCodeEditor"], {
            mode: "json",
            theme: "github",
            width: "100%",
            height: "200px",
            name: propName,
            value: JSON.stringify(value, null, 4),
            onChange: e => {
              this.handleInput({
                target: {
                  name: propName,
                  value: JSON.parse(e)
                }
              });
            },
            setOptions: {
              fontSize: '12px',
              enableBasicAutocompletion: false,
              enableSnippets: true,
              enableLiveAutocompletion: false
            },
            "aria-label": "Edit json for " + propName
          });
        } else if (propType === "boolean") {
          propField = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiCheckbox"], {
            checked: value,
            onChange: this.handleInput
          });
        } else {
          propField = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFieldText"], {
            name: propName,
            value: value,
            autoComplete: "off",
            onChange: this.handleInput
          }); // add the auto-complete suggest list if existing for the field

          if (this.state.bodyComplete[propName] && this.state.bodyComplete[propName].length) {
            propComplete = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiListGroup"], {
              flush: true,
              bordered: true
            }, this.state.bodyComplete[propName].map(complete => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiListGroupItem"], {
              key: complete,
              label: complete,
              onClick: e => {
                this.setState(previousState => ({
                  body: { ...previousState.body,
                    [propName]: complete
                  },
                  bodyComplete: {}
                }));
              }
            })));
          }
        }
      }

      const propLabel = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, propName, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiButtonIcon"], {
        iconSize: "s",
        iconType: "cross",
        color: "danger",
        onClick: this.onRemoveNewDocProp(propName),
        "aria-label": "Remove the field from the form",
        title: "Remove the field from the form"
      }));
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFormRow"], {
        key: propName,
        label: propLabel,
        helpText: propType
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, propField, propComplete));
    });
    let formPropsPanel;

    if (this.state.fieldsToUpdate.length) {
      formPropsPanel = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiText"], {
        grow: false
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", null, "Fill the document form"), "Only chosen field will be updated."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiSpacer"], {
        size: "s"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiPanel"], {
        paddingSize: "m",
        hasShadow: true,
        style: {
          maxWidth: 500
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiForm"], null, formProps)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiSpacer"], {
        size: "m"
      }));
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlyout"], {
      ownFocus: true,
      onClose: this.props.close,
      size: "m"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlyoutHeader"], {
      hasBorder: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiTitle"], {
      size: "m"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
      id: "AddNewDocumentToIndex"
    }, "Update all selected doc"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlyoutBody"], null, formPropsPanel, selectFieldToUpdate), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlyoutFooter"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlexGroup"], {
      justifyContent: "spaceBetween"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiButtonEmpty"], {
      iconType: "cross",
      onClick: this.props.close,
      flush: "left"
    }, "Close")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiButton"], {
      onClick: this.handleSubmit,
      fill: true
    }, "Save")))));
  }

});

/***/ }),

/***/ "./public/components/flyout/ManageDocFlyout.js":
/*!*****************************************************!*\
  !*** ./public/components/flyout/ManageDocFlyout.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var brace_theme_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! brace/theme/github */ "../../node_modules/brace/theme/github.js");
/* harmony import */ var brace_theme_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(brace_theme_github__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var brace_mode_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! brace/mode/json */ "../../node_modules/brace/mode/json.js");
/* harmony import */ var brace_mode_json__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(brace_mode_json__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var brace_snippets_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! brace/snippets/json */ "../../node_modules/brace/snippets/json.js");
/* harmony import */ var brace_snippets_json__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(brace_snippets_json__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__);





/* harmony default export */ __webpack_exports__["default"] = (class extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props); // List of fields of the doc from mapping

    const docPropsObject = props.mapping[props.index]["mappings"]["properties"];
    this.docPropsList = Object.keys(docPropsObject).map(name => {
      let prop = docPropsObject[name];
      return {
        name,
        ...prop
      };
    }); // Data for a doc when update case

    this.state = {
      body: props.docToEdit || {}
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(e) {
    const {
      name,
      value
    } = e.target;
    this.setState(previousState => ({
      body: { ...previousState.body,
        [name]: value // with boolean, get checked params. else get value

      }
    }));
  }

  handleSubmit(e) {
    this.props.saveDoc(this.state.body).then(result => {
      if (result) this.props.close();
    }).catch(err => {
      console.log("Unable to add the document. Error :", err);
    });
  } // loop on each props and display a form to manage it.
  // if a doc to edit is passed, fill the form input with the doc field value


  render() {
    const formProps = this.docPropsList.map(docProp => {
      const propName = docProp["name"];
      let propType = docProp["type"];
      console.log(propName, ' -> ', propType);
      let value = this.state.body[propName];
      let propField;

      if (propType != 'undefined') {
        if (["long", "integer", "short", "byte", "double", "float", "half_float", "scaled_float"].includes(propType)) {
          propField = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFieldNumber"], {
            name: propName,
            value: value ? Number(value) : '',
            onChange: this.handleInput
          });
        } else if (propType === "boolean") {
          propField = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiSwitch"], {
            checked: value,
            onChange: e => {
              this.handleInput({
                target: {
                  name: propName,
                  value: e.target.checked
                }
              });
            }
          });
        } else if (["object", "geo_point"].includes(propType) || typeof value === 'array' || typeof value === 'object') {
          propField = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiCodeEditor"], {
            mode: "json",
            theme: "github",
            width: "100%",
            height: "200px",
            name: propName,
            value: JSON.stringify(value, null, 4),
            onChange: e => {
              this.handleInput({
                target: {
                  name: propName,
                  value: JSON.parse(e)
                }
              });
            },
            setOptions: {
              fontSize: '12px',
              enableBasicAutocompletion: false,
              enableSnippets: true,
              enableLiveAutocompletion: false
            },
            "aria-label": "Edit json for " + propName
          });
        } else {
          propField = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFieldText"], {
            name: propName,
            value: value,
            onChange: this.handleInput
          });
        }
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFormRow"], {
        key: propName,
        label: propName,
        helpText: propType
      }, propField);
    });
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlyout"], {
      ownFocus: true,
      onClose: this.props.close,
      size: "m"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlyoutHeader"], {
      hasBorder: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiTitle"], {
      size: "m"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
      id: "AddNewDocumentToIndex"
    }, "Add a new document"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlyoutBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiText"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", null, "Fill the document form")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiPanel"], {
      paddingSize: "m",
      hasShadow: true,
      style: {
        maxWidth: 500
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiForm"], null, formProps))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlyoutFooter"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlexGroup"], {
      justifyContent: "spaceBetween"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiButtonEmpty"], {
      iconType: "cross",
      onClick: this.props.close,
      flush: "left"
    }, "Close")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiButton"], {
      onClick: this.handleSubmit,
      fill: true
    }, "Save")))));
  }

});

/***/ }),

/***/ "./public/components/wrapper/GroupUpdateDocsWrapper.js":
/*!*************************************************************!*\
  !*** ./public/components/wrapper/GroupUpdateDocsWrapper.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return GroupUpdateDocsWrapper; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _flyout_GroupUpdateDocsFlyout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../flyout/GroupUpdateDocsFlyout */ "./public/components/flyout/GroupUpdateDocsFlyout.js");



class GroupUpdateDocsWrapper extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open(e) {
    this.setState({
      isVisible: true
    });
  }

  close(e) {
    this.setState({
      isVisible: false
    });
  }

  render() {
    let portal = null;

    if (this.state.isVisible) {
      portal = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPortal"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_flyout_GroupUpdateDocsFlyout__WEBPACK_IMPORTED_MODULE_2__["default"], {
        close: this.close,
        index: this.props.index,
        mapping: this.props.mapping,
        saveDocs: this.props.submitCallback
      }));
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, portal, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.cloneElement(this.props.children, {
      onClick: this.open
    }));
  }

}

/***/ }),

/***/ "./public/components/wrapper/ManageDocWrapper.js":
/*!*******************************************************!*\
  !*** ./public/components/wrapper/ManageDocWrapper.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ManageDocWrapper; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _flyout_ManageDocFlyout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../flyout/ManageDocFlyout */ "./public/components/flyout/ManageDocFlyout.js");



class ManageDocWrapper extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open(e) {
    this.setState({
      isVisible: true
    });
  }

  close(e) {
    this.setState({
      isVisible: false
    });
  }

  render() {
    let portal = null;

    if (this.state.isVisible) {
      portal = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPortal"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_flyout_ManageDocFlyout__WEBPACK_IMPORTED_MODULE_2__["default"], {
        close: this.close,
        index: this.props.index,
        mapping: this.props.mapping,
        docToEdit: this.props.data,
        saveDoc: this.props.submitCallback
      }));
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, portal, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.cloneElement(this.props.children, {
      onClick: this.open
    }));
  }

}

/***/ }),

/***/ "./public/lib/items.js":
/*!*****************************!*\
  !*** ./public/lib/items.js ***!
  \*****************************/
/*! exports provided: getSelectedItems, isItemSelected, areAllCurrentPageItemsSelected, areAtLeastOneCurrentPageItemsSelected */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSelectedItems", function() { return getSelectedItems; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isItemSelected", function() { return isItemSelected; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "areAllCurrentPageItemsSelected", function() { return areAllCurrentPageItemsSelected; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "areAtLeastOneCurrentPageItemsSelected", function() { return areAtLeastOneCurrentPageItemsSelected; });
function getSelectedItems(items) {
  return items.filter(item => isItemSelected(item));
}
function isItemSelected(item) {
  return item.selected || false;
}
function areAllCurrentPageItemsSelected(items) {
  if (!items.length) {
    return false;
  }

  const unselectedItem = items.find(item => !isItemSelected(item)); // return true if all items of the page are selected

  return unselectedItem === undefined;
}
function areAtLeastOneCurrentPageItemsSelected(items) {
  const selectedItem = items.find(item => isItemSelected(item)); // return true if all items of the page are selected

  return selectedItem !== undefined;
}

/***/ }),

/***/ "./public/lib/search.js":
/*!******************************!*\
  !*** ./public/lib/search.js ***!
  \******************************/
/*! exports provided: getQueryDslBySearchText */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getQueryDslBySearchText", function() { return getQueryDslBySearchText; });
function getQueryDslBySearchText(query) {
  return query.trim() ? {
    query_string: {
      query
    }
  } : {
    match_all: {}
  };
}

/***/ }),

/***/ "./public/lib/utils.js":
/*!*****************************!*\
  !*** ./public/lib/utils.js ***!
  \*****************************/
/*! exports provided: stringifyOnce */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringifyOnce", function() { return stringifyOnce; });
/**
 * Stringify method
 * Avoid infinite recursion in objects
 * @param {*} obj the object to stringify
 * @param {fn} replacer a possible dedicated repacer function
 * @param {int} indent Nb of spaces for code indentation
 */
function stringifyOnce(obj, replacer, indent) {
  var printedObjects = [];
  var printedObjectKeys = [];

  function printOnceReplacer(key, value) {
    if (printedObjects.length > 2000) {
      // browsers will not print more than 20K, I don't see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
      return 'object too long';
    }

    var printedObjIndex = false;
    printedObjects.forEach(function (obj, index) {
      if (obj === value) {
        printedObjIndex = index;
      }
    });

    if (key == '') {
      //root element
      printedObjects.push(obj);
      printedObjectKeys.push("root");
      return value;
    } else if (printedObjIndex + "" != "false" && typeof value == "object") {
      if (printedObjectKeys[printedObjIndex] == "root") {
        return "(pointer to root)";
      } else {
        return "(see " + (!!value && !!value.constructor ? value.constructor.name.toLowerCase() : typeof value) + " with key " + printedObjectKeys[printedObjIndex] + ")";
      }
    } else {
      var qualifiedKey = key || "(empty key)";
      printedObjects.push(value);
      printedObjectKeys.push(qualifiedKey);

      if (replacer) {
        return replacer(key, value);
      } else {
        return value;
      }
    }
  }

  return JSON.stringify(obj, printOnceReplacer, indent);
}
;

/***/ })

}]);
//# sourceMappingURL=1.plugin.js.map