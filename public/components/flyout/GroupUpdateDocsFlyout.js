import React, {
  Component,
  Fragment
} from 'react';

import 'brace/theme/github'
import 'brace/mode/json'
import 'brace/snippets/json'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiCheckbox,
  EuiCodeEditor,
  EuiFieldText,
  EuiFieldNumber,
  EuiFlexItem,
  EuiFlexGroup,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiForm,
  EuiFormRow,
  EuiListGroup,
  EuiListGroupItem,
  EuiPanel,
  EuiSpacer,
  EuiSuperSelect,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import axios from 'axios'

export default class extends Component {

  constructor(props) {
    super(props)

    // List of fields of the doc from mapping
    const docPropsObject = props.mapping[props.index]["mappings"]["properties"]
    this.docPropsList = Object.keys(docPropsObject).map((name) => {
      let prop = docPropsObject[name]
      return {
        name,
        ...prop
      }
    })

    this.state = {
      fieldsToUpdate: [],
      newDocPropNameValue: "",
      body : {},
      bodyComplete : {}
    }

    this.options = this.docPropsList.map(docProp => ({
      value: docProp.name,
      inputDisplay: docProp.name,
      disabled: this.state.fieldsToUpdate.includes(docProp.name)
    }))

    this.onChangeNewDocProp = this.onChangeNewDocProp.bind(this)
    this.onAddNewDocProp    = this.onAddNewDocProp.bind(this)
    this.onRemoveNewDocProp = this.onRemoveNewDocProp.bind(this)
    
    this.handleInput        = this.handleInput.bind(this)
    this.handleSubmit       = this.handleSubmit.bind(this)
  }

  onChangeNewDocProp = value => {
    this.setState({ newDocPropNameValue: value })
  };

  onAddNewDocProp = e => {
    if (!this.state.newDocPropNameValue)
      return false

    this.setState(previousState => ({
      fieldsToUpdate: [...previousState.fieldsToUpdate, previousState.newDocPropNameValue],
      newDocPropNameValue: "", // reset the select
      body : {
        ...previousState.body,
        [previousState.newDocPropNameValue]: "" // add an initial empty value
      },
      bodyComplete : {} // reset all fields completion on new prop event
    }))
  }

  onRemoveNewDocProp = fieldToRemove => e => {
    
    this.setState(previousState => {
      
      // Destructuring assignement tricks
      // https://stackoverflow.com/questions/33053310/remove-value-from-object-without-mutating-it
      let {[fieldToRemove]: omit, ...bodyWithoutField} = previousState.body

      return {
        fieldsToUpdate: previousState.fieldsToUpdate.filter(f => f !== fieldToRemove),
        body : bodyWithoutField
      } 
    })
    
  }

  async handleInput(e) {
    
    const {
      name,
      value
    } = e.target

    const {
      index: i
    } = this.props

    this.setState(previousState => ({ 
      body : {
        ...previousState.body,
        [name]: value
      }
    }))

    let searchableFieldName // to search top hits values in current field or it's multifield
    this.docPropsList.forEach(f => {

      if (f.name !== name)
        return

      if (f.type === "keyword") {
        searchableFieldName = f.name
        return
      }

      if (f.fields) {
        let multiFields = Object.keys(f.fields)
        multiFields.forEach(sf => {
          if (f.fields[sf].type === "keyword")
            searchableFieldName = f.name + "." + sf
        })
      }
    })

    if (searchableFieldName) {

      const complete = await axios.get(`../api/doc-editor/${i}/_hits/${searchableFieldName}?beginwith=${value}`)
          
      this.setState(previousState => ({ 
        bodyComplete: {
          [name]: complete.data ? complete.data.map(c => c.key) : []
        }
      }))
    
    }

  }

  handleSubmit(e) {

    // save the same (partial) body for each docs, or by query
    this.props.saveDocs(this.state.body).then(result => {
      if (result)
        this.props.close()
    }).catch(err => {
      console.log("Unable to update the group of documents. Error :", err)
    })
  }

  getDocPropByName(name) {

    return this.docPropsList.find(docProp => docProp.name === name)
  }

  // loop on each props and display a form to manage it.
  // if a doc to edit is passed, fill the form input with the doc field value
  render() {
    
    // ICI une select box pour choisir le champ à modifier
    // en enlevant ceux deja choisit, et uniquement format compatible
    const selectFieldToUpdate = (
      <Fragment>
        <EuiText>Choose a field you want to update</EuiText>
        
            <EuiSuperSelect
              options={this.options}
              valueOfSelected={this.state.newDocPropNameValue}
              onChange={this.onChangeNewDocProp}
            />
            <EuiButton 
              onClick={this.onAddNewDocProp}
              style={{marginLeft: "10px"}}
            >
              Add...
            </EuiButton>
          
      </Fragment>
    )
    
    const formProps = this.state.fieldsToUpdate.map(docPropName => {

      const docProp = this.getDocPropByName(docPropName)
      
      const propName = docProp["name"]
      let propType = docProp["type"]
      let value = this.state.body[propName]
      let propField = null
      let propComplete = null
      if (propType != 'undefined') {
        
        if (["long", "integer", "short", 
             "byte", "double", "float", 
             "half_float", "scaled_float"].includes(propType)) {
            propField = <EuiFieldNumber
            name={propName}
            value={value ? Number(value) : ''}
            onChange={this.handleInput}
          />
        }
        else if (
          ["object", "geo_point"].includes(propType) ||
          typeof value === 'array' ||
          typeof value === 'object'
        ) {
          propField = <EuiCodeEditor
            mode="json"
            theme="github"
            width="100%"
            height="200px"
            name={propName}
            value={JSON.stringify(value, null, 4)}
            onChange={ e => { 
              this.handleInput({
                target: {
                  name: propName, 
                  value: JSON.parse(e)
                }
              }) 
            }}
            setOptions={{
              fontSize: '12px',
              enableBasicAutocompletion: false,
              enableSnippets: true,
              enableLiveAutocompletion: false,
            }}
            aria-label={ "Edit json for " + propName }
          />
        }
        else if (propType === "boolean") {
          propField = <EuiCheckbox
            checked={value}
            onChange={this.handleInput}
          />
        }
        else {
          propField = <EuiFieldText 
            name={propName} 
            value={value} 
            autoComplete="off"
            onChange={this.handleInput}
          />

          // add the auto-complete suggest list if existing for the field
          if (this.state.bodyComplete[propName] && this.state.bodyComplete[propName].length) {
            propComplete = (
              <EuiListGroup flush={true} bordered={true}>
                {this.state.bodyComplete[propName].map(complete => (
                  <EuiListGroupItem 
                    key={complete}
                    label={complete}
                    onClick={e => {this.setState(previousState => ({ 
                      body: { 
                        ...previousState.body,
                        [propName]: complete 
                      }, 
                      bodyComplete: {}
                    }))}}
                  ></EuiListGroupItem>
                ))}
              </EuiListGroup>
            )
          } 
        }
      }

      const propLabel = (
        <span>
          {propName}
          <EuiButtonIcon
            iconSize="s"
            iconType="cross"
            color="danger"
            onClick={this.onRemoveNewDocProp(propName)}
            aria-label="Remove the field from the form"
            title="Remove the field from the form"
          />
        </span>
      )

      return (
        <EuiFormRow key={propName} label={propLabel} helpText={propType}>
          <Fragment>
            {propField}
            {propComplete}
          </Fragment>
        </EuiFormRow>
      )
    });

    let formPropsPanel
    if (this.state.fieldsToUpdate.length) {
      formPropsPanel = (
        <Fragment>
          <EuiText grow={false}>
            <h5>Fill the document form</h5>
            Only chosen field will be updated.
          </EuiText>
          <EuiSpacer size="s"/>
          <EuiPanel 
            paddingSize="m" 
            hasShadow
            style={{ maxWidth: 500 }}>
            <EuiForm>
              {formProps}
            </EuiForm>
          </EuiPanel>
          <EuiSpacer size="m"/>
        </Fragment>
      )
    }



    return (
      <EuiFlyout
        ownFocus={true}
        onClose={this.props.close}
        size="m"
      >
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id="AddNewDocumentToIndex">
              Update all selected doc
            </h2>
          </EuiTitle>
        </EuiFlyoutHeader>

        <EuiFlyoutBody>
          {formPropsPanel}
          {selectFieldToUpdate}
        </EuiFlyoutBody>

        <EuiFlyoutFooter>
          <EuiFlexGroup justifyContent="spaceBetween">
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                iconType="cross"
                onClick={this.props.close}
                flush="left"
              >
                Close
              </EuiButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton
                onClick={this.handleSubmit}
                fill
              >
                Save
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutFooter>
      </EuiFlyout>
    )
  }
}
