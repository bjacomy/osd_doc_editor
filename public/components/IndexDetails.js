import React, {
  Component,
  Fragment
} from 'react'

// import "@elastic/eui/dist/eui_theme_k6_light.css"
import "@elastic/eui/dist/eui_theme_light.css"
import 'brace/ext/language_tools'

import Header             from './Header.js'
import SearchBar          from './SearchBar'
import DatatableActions   from './DatatableActions'
import AddDocumentButton  from './AddDocumentButton'

import ManageDocWrapper from './wrapper/ManageDocWrapper'

import { getQueryDslBySearchText } from '../lib/search'

import {
  isItemSelected,
  areAllCurrentPageItemsSelected
} from '../lib/items'

import {stringifyOnce} from '../lib/utils'

import axios from 'axios'

import {
  EuiButton,
  EuiButtonIcon,
  EuiCheckbox,
  EuiCodeBlock,
  EuiEmptyPrompt,
  EuiSpacer,
  EuiSwitch,
  EuiTable,
  EuiTableBody,
  EuiTableHeader,
  EuiTableHeaderCell,
  EuiTableHeaderCellCheckbox,
  EuiTablePagination,
  EuiTableRow,
  EuiTableRowCell,
  EuiTableRowCellCheckbox,
  EuiToolTip,
  Pager,
  LEFT_ALIGNMENT,
  RIGHT_ALIGNMENT
} from '@elastic/eui'


export default class extends Component {

  constructor(props) {

    super(props);

    this.index = props.index
    this.selectedColumns = props.selectedColumns
    this.onClickHome = props.onClickHome
    // this.index = props.match.params.index
    // this.selectedColumns = props.match.params.cols

    this.state = {
      items: [], // the set of displayed docs in data table
      total: 0,  // total items for pager
      search: {  // search bar and pagination state
        query: "",
        from: 0,
        size: 10,
        sort: {"_id" : "asc"}
      },
      areAllPagesItemsSelected: false,
      mapping: false,
      flyout: {
        isVisible: false, // condition the display of the global flyout
        type: false,      // choose the flyout type to display : "new", "update" or "group"
        data: false       // set the data by the flyout type : false when "new", single doc item when "update", list of docs when "group"
      },
      expandedItemIds: [] // set of expanded item ids
    };

    this.init()

    axios.defaults.headers.post['kbn-xsrf']   = "reporting"
    axios.defaults.headers.delete['kbn-xsrf'] = "reporting"

    this.search                    = this.search.bind(this)
    this.toggleSelectItem          = this.toggleSelectItem.bind(this)
    this.toggleSelectAll           = this.toggleSelectAll.bind(this)
    this.toggleDetails             = this.toggleDetails.bind(this)
    this.onChangePage              = this.onChangePage.bind(this)
    this.onChangeItemsPerPage      = this.onChangeItemsPerPage.bind(this)

    this.selectAllPagesItems       = this.selectAllPagesItems.bind(this)

    this.deleteDocument            = this.deleteDocument.bind(this)
    this.addDocument               = this.addDocument.bind(this)
    this.updateDocument            = this.updateDocument.bind(this)

  }

  async init() {

    await this.initMapping()
    await this.initHeaderColumns()

    await this.search()

    this.pager                = new Pager(this.state.total, this.state.search.size)
    this.state.firstItemIndex = this.pager.getFirstItemIndex()
    this.state.lastItemIndex  = this.pager.getLastItemIndex()

  }

  async initMapping() {

    try {

      const mapping = await axios.get(
        `../api/doc-editor/${this.index}/_mapping`
      )

      this.setState( () => ({
        mapping: mapping.data
      }))
    }
    catch (err) {
      console.log("Error on getting mapping. Check the network tab to find why the mapping request failed.")
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
      alignment: LEFT_ALIGNMENT
    }

    let actions = {
      id: 'actions',
      type: 'actions',
      label: 'actions',
      alignment: RIGHT_ALIGNMENT,
      width: '90px'
    }

    let columns = this.selectedColumns.map((prop) => ({
      id: prop,
      label: prop,
      alignment: LEFT_ALIGNMENT,
    }))

    this.headerColumns = [check, ...columns, actions]

  }

  /**
   * Request a search to ES according to the filter bar and given pagination parameters
   */
  async search({query = false, from = false, size = false, sort = false} = {}) {

    // special case reset the from value if the query changes
    if (query !== false && from === false) from = 0

    // Merge parameters with existing search
    query = query !== false ? query : this.state.search.query
    from  = from  !== false ? from  : this.state.search.from,
    size  = size  !== false ? size  : this.state.search.size,
    sort  = sort  !== false ? sort  : this.state.search.sort

    // create the query json part, when query is empty or not
    let queryReq = getQueryDslBySearchText(query)
    // let queryReq = { match_all: {} }

    var requestBody = {
      from,
      size,
      sort,
      query: queryReq
    }

    try {
      let rawResult = await axios.post(`../api/doc-editor/${this.index}/_search`, requestBody)

      let result = rawResult.data

      this.pager = new Pager(result.hits.total.value, size)

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
      })

    }
    catch (err) {
      console.log("Error during search", err)
    }
  }

  onChangeItemsPerPage = itemsPerPage => {
    this.pager.setItemsPerPage(itemsPerPage)
    this.search({from: 0, size: itemsPerPage})
  }

  onChangePage = pageIndex => {
    this.search({from: pageIndex * this.state.search.size})
  }

  // ---------------------
  // MANAGE SELECTED ITEMS
  // ---------------------

  // function that handles the check of one given document
  toggleSelectItem = itemToToggle => {

    return (e) => {
      this.setState(previousState => ({
        areAllPagesItemsSelected: false,
        items: previousState.items.map((item) => {
          if (item === itemToToggle)
            item.selected = !(item.selected || false)
          return item
        })
      }))
    }
  }

  // function that handles the check of all checkboxes
  toggleSelectAll = () => {

    return (e) => {
      this.setState(previousState => {
        const allSelected = !areAllCurrentPageItemsSelected(previousState.items)
        return {
          areAllPagesItemsSelected: false,
          items: previousState.items.map((item) => {
            item.selected = allSelected
            return item
          })
        }

      })
    }
  }

  // function that set/unset an item id as expanded view
  toggleDetails = (item) => {

    let expandedItemIds = this.state.expandedItemIds
    if (expandedItemIds.includes(item._id)) {
      expandedItemIds = expandedItemIds.filter(i => i !== item._id)
    } else {
      expandedItemIds = [ ...expandedItemIds, item._id]
    }
    this.setState({ expandedItemIds });
  }

  // select all page items
  selectAllPagesItems = (isAllSelected) => {
    this.setState({ areAllPagesItemsSelected: isAllSelected })
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
    const i = this.index

    const search = this.search

    return async function(docBody) {

      try {
        const response = await axios.post(`../api/doc-editor/${i}/_doc`, docBody)
        search()

        return response
      }
      catch (err) {
        console.log("Error during adding document", err)

        return false
      }
    }
  }

  // Delete the given item (or many separated by ,) and reload search
  deleteDocument(itemId, confirmMessage="Delete this document?", applyByQueryOnAllDocs = false) {

    // const {
    //   index: i
    // } = this.state
    const i = this.index

    const s = this.state.search // used for by query request
    const search = this.search

    return async function(e) {

      var result = confirm(confirmMessage);
      if (!result) {
        return false
      }

      try {
        if (applyByQueryOnAllDocs) {
          await axios.post(`../api/doc-editor/${i}/_doc/_delete_by_query`, {query: getQueryDslBySearchText(s.query)})
        }
        else {
          await axios.delete(`../api/doc-editor/${i}/_doc/${itemId}`)
        }
        search()
      }
      catch(err) {
        console.log("Error on deleting item(s) ", err)
      }
    }
  }

  // Update an existing document (or many separated by ,) by Id with given body and reload search
  updateDocument(docId, applyByQueryOnAllDocs = false) {

    // const {
    //   index: i,
    // } = this.state
    const i = this.index

    const s = this.state.search // used for by query request
    const search = this.search

    return async function(docBody) {

      try {
        let response
        if (applyByQueryOnAllDocs) {
          let script = Object.keys(docBody)
            .map(key => `ctx._source.${key} = \"${docBody[key]}\"`)
            .join(';')
          response = await axios.post(`../api/doc-editor/${i}/_doc/_update_by_query`, {
            query: getQueryDslBySearchText(s.query),
            script
          })
        }
        else {
          response = await axios.post(`../api/doc-editor/${i}/_doc/${docId}/_update`, docBody)
        }
        search()

        return response
      }
      catch (err) {
        console.log("Error during updating item(s)", err)
        return false
      }
    }
  }


  // --------------
  // RENDER SECTION
  // --------------

  renderHeaderCells() {

    if (!this.headerColumns) {
      return null
    }

    return this.headerColumns.map((column, columnIndex) => {

      if (column.type === "checkbox") {
        return (
          <EuiTableHeaderCellCheckbox key={column.id}
            align={this.headerColumns[columnIndex].alignment}
            width={column.width}
            >
            <EuiCheckbox
              id="selectAllCheckbox"
              checked={areAllCurrentPageItemsSelected(this.state.items)}
              onChange={this.toggleSelectAll()}
              type="inList"
            />
          </EuiTableHeaderCellCheckbox>
        )
      }

      return (
        <EuiTableHeaderCell key={column.id}
          align={this.headerColumns[columnIndex].alignment}
          width={column.width}
          style={{ color: '#025471'}}
          >
          {column.label}
        </EuiTableHeaderCell>
      )
    })

  }

  renderRows() {

    if (!this.headerColumns) {
      return null
    }

    if (this.state.items.length == 0) {
      return null
    }

    // Similar as a "1 -> n" array.map process
    // Loop on each items and create a main row and its expanded row
    return this.state.items.reduce((rows, item) => {

      // main item row
      rows.push(
        <EuiTableRow // add the main item row and render cells for each columns
          key={`${item._id}-row`}
          hasActions={true}
          isExpandable={true}
          >
          {this.headerColumns.map(column => this.renderCell(item, column))}
          </EuiTableRow>
      )

      // if expanded is toggled, add the expanded item row and render a full colSpan cell with expanded content
      if (this.state.expandedItemIds.includes(item._id)) {
        rows.push(
          <EuiTableRow // expanded item row
            key={`${item._id}-row-expanded`}
            isExpandedRow={this.state.expandedItemIds.includes(item._id)}
            >
            {this.renderCellExpandedPart(item, this.headerColumns.length)}
          </EuiTableRow>
        )
      }

      return rows

    }, [])

  }

  renderCheckboxCell(item, column){
    let checked = isItemSelected(item)

    return (
      <EuiTableRowCellCheckbox key={column.id}>
        <EuiCheckbox
          id={`${item._id}-checkbox`}
          checked={checked}
          onChange={this.toggleSelectItem(item)}
          type="inList"
        />
      </EuiTableRowCellCheckbox>
    )
  }

  renderActionsCell(item, column) {

    const {
      expandedItemIds,
    } = this.state

    return (
      <EuiTableRowCell
        key={column.id}
        textOnly={false}
        hasActions={true}
        isExpander={true}
      >
        <div>
          <ManageDocWrapper
            index={this.index}
            mapping={this.state.mapping}
            data={item._source}
            submitCallback={this.updateDocument(item._id)}
          >
          <EuiButtonIcon
            aria-label="Actions"
            iconType="pencil"
            style={{ width: '20px',height:'20px'}}
            />
          </ManageDocWrapper>
          <EuiButtonIcon
            aria-label="Actions"
            iconType="trash"
            style={{ width: '20px',height:'20px', color: 'red'}}
            onClick={this.deleteDocument(item._id)}
          />
          <EuiButtonIcon
            style={{ width: '20px',height:'20px'}}
            onClick={() => this.toggleDetails(item)}
            aria-label={expandedItemIds.includes(item._id) ? 'Collapse' : 'Expand'}
            iconType={expandedItemIds.includes(item._id) ? 'arrowUp' : 'arrowDown'}
          />
        </div>
      </EuiTableRowCell>
    )
  }


  renderCell(item, column) {

    switch (column.type) {

      case 'checkbox':
        return this.renderCheckboxCell(item, column)

      case 'actions':
        return this.renderActionsCell(item, column);
    }

    // else default common cell type
    let cellValue = item._source[column.id]

    if (cellValue === undefined) {
      cellValue = (<span style={{opacity: 0.7}}>-</span>)
    }

    else if (typeof cellValue === 'boolean') {
      cellValue = <EuiSwitch
        checked={cellValue}
        disabled
      />
    }

    else if ( ["object", "array", "nested"].includes(typeof cellValue) ) { // if object or array or nested, display the content in tooltip
      let content = (
        <pre className="prettyprint">
          <code>{stringifyOnce(cellValue, null, 2)}</code>
        </pre>
      )
      cellValue = (
        <EuiToolTip
          position="top"
          content={content}
        >
          <span>&lt;{typeof cellValue}&gt;</span>
        </EuiToolTip>
      )
    }

    return (
      <EuiTableRowCell
        key={column.id}
        align={column.alignment}
        isExpander={false}
        truncateText={false}
        textOnly={false}  // necessary to display content on multiple line
      >
        { cellValue }
      </EuiTableRowCell>
    )
  }

  renderCellExpandedPart(item, colSpan) {

    return (
      <EuiTableRowCell
        key="expanded-row-cell"
        align={LEFT_ALIGNMENT}
        colSpan={colSpan}
        isExpander={true}
        truncateText={false}
        textOnly={false}  // necessary to display content on multiple line
      >
        <EuiCodeBlock language="json" fontSize="m" paddingSize="m" color="dark" overflowHeight={300} isCopyable>
          {JSON.stringify(item, null, 2)}
        </EuiCodeBlock>
      </EuiTableRowCell>
    )
  }

  renderDatatableActions() {

    if (!this.pager || !this.state.items.length) {
      return null
    }

    return (
      <DatatableActions
        index={this.index}
        mapping={this.state.mapping}
        items={this.state.items}
        total={{
          docs: this.state.total,
          pages: this.pager.getTotalPages()
        }}
        areAllPagesItemsSelected={this.state.areAllPagesItemsSelected}
        selectAllPagesItems={this.selectAllPagesItems}
        /*selectedItems={this.getSelectedItems(this.state.items)}*/
        addDocument={this.addDocument}
        updateDocument={this.updateDocument}
        deleteCallback={this.deleteDocument}
      />
    )
  }

  renderDatatable() {

    if (!this.state.items.length) {
      return this.renderEmptyDatatable()
    }

    return (
      <EuiTable>
        <EuiTableHeader >
          {this.renderHeaderCells()}
        </EuiTableHeader>
        <EuiTableBody style={{ display:'contents'}}>
          {this.renderRows()}
        </EuiTableBody>
      </EuiTable>
    )
  }

  renderEmptyDatatable() {

    let title,
        body,
        actions= (
      <ManageDocWrapper
        index={this.index}
        mapping={this.state.mapping}
        data={{}}
        submitCallback={this.addDocument()}
      >
        <AddDocumentButton/>
      </ManageDocWrapper>
    )

    if (!this.state.search.query || this.state.search.query.trim() === "*") {

      title = <h2>You have no document in this index</h2>
      body = (
        <p>
          No worries ! <br/>
          You can add a new one with this plugin :-)
        </p>
      )
    }
    else {
      title = <h2>No document found with your filter</h2>
      body = (
        <p>
          You should change your search query in the search bar. <br/>
          See the <a
            href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax"
            target='_blank'>
            elasticsearch documentation
          </a> for more informations about the Query string syntax.
        </p>
      )
      actions = (
        <Fragment>
          {actions}
          <EuiSpacer size="s"/>
          <EuiButton onClick={() => {this.search({query: ""})}}>
            Reset the current filter to view all documents
          </EuiButton>
        </Fragment>
      )
    }

    return (
      <EuiEmptyPrompt
        iconType="eyeClosed"
        title={title}
        body={body}
        actions={actions}
      />
    )
  }

  renderPagination() {

    if (!this.pager || !this.state.items.length) {
      return null
    }

    return (
      <EuiTablePagination
        activePage={ this.state.search.from / this.state.search.size}
        itemsPerPage={this.state.search.size}
        itemsPerPageOptions={[10, 20, 50, 100]}
        pageCount={this.pager.getTotalPages()}
        onChangeItemsPerPage={this.onChangeItemsPerPage}
        onChangePage={this.onChangePage}
      />
    )
  }

  render() {

    return (
      <div>
        <Header onClickHome={this.onClickHome}/>

        <EuiSpacer size="m" />
        <SearchBar search={this.search} query={this.state.search.query} />
        <EuiSpacer size="m" />

        {this.renderDatatableActions()}
        <EuiSpacer size="s" />

        {this.renderDatatable()}

        <EuiSpacer size="s" />
        {this.renderDatatableActions()}

        <EuiSpacer size="m" />
        {this.renderPagination()}

        <EuiSpacer size="xl" />
        {/*this.renderFlyoutPortal()*/}

      </div>
    );
  }

  // END RENDER SECTION
}
