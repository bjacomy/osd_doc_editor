import React, {
  Component,
} from 'react'

import 'brace/theme/github'
import 'brace/mode/json'
import 'brace/snippets/json'

import {
  EuiButton,
  EuiButtonEmpty,
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
  EuiPanel,
  EuiSwitch,
  EuiText,
  EuiTitle,
} from '@elastic/eui';

export default class extends Component {

  constructor(props) {
    super(props)

    // List of fields of the doc from mapping
    const docPropsObject = props.mapping[props.index]["mappings"]["properties"]
    this.docPropsList = Object.keys(docPropsObject)
      .map((name) => {
        let prop = docPropsObject[name]
        return {
          name,
          ...prop
        }
      })

    // Data for a doc when update case
    this.state = {
      body: props.docToEdit || {}
    }

    this.handleInput  = this.handleInput.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInput(e) {
    
    const {
      name,
      value
    } = e.target
      
    this.setState(previousState => ({ 
      body : {
        ...previousState.body,
        [name]: value  // with boolean, get checked params. else get value
      } 
    }))
  }

  handleSubmit(e) {

    this.props.saveDoc(this.state.body).then(result => {
      if (result)
        this.props.close()
    }).catch(err => {
      console.log("Unable to add the document. Error :", err)
    })
  }

  // loop on each props and display a form to manage it.
  // if a doc to edit is passed, fill the form input with the doc field value
  render() {

    const formProps = this.docPropsList.map(docProp => {
      
      const propName = docProp["name"]
      let propType = docProp["type"]
      console.log(propName, ' -> ', propType)
      let value = this.state.body[propName]
      let propField
      if (propType != 'undefined') {
        
        if (["long", "integer", "short", 
             "byte", "double", "float", 
             "half_float", "scaled_float"].includes(propType)) {
          propField  = <EuiFieldNumber
            name={propName}
            value={value ? Number(value) : ''}
            onChange={this.handleInput}
          />
        }
        else if (propType === "boolean") {
          propField = <EuiSwitch
            checked={value}
            onChange={ e => { 
              this.handleInput({
                target: {
                  name: propName, 
                  value: e.target.checked
                }
              }) 
            }}
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
        else {        
          propField = <EuiFieldText 
            name={propName} 
            value={value} 
            onChange={this.handleInput} 
          />
        }
      }

      return (
        <EuiFormRow key={propName} label={propName} helpText={propType}>
          {propField}
        </EuiFormRow>
      )
    });

    return (
      <EuiFlyout
        ownFocus={true}
        onClose={this.props.close}
        size="m"
      >
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id="AddNewDocumentToIndex">
              Add a new document
            </h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        
        <EuiFlyoutBody>
          <EuiText grow={false}>
            <h5>Fill the document form</h5>
          </EuiText>
          <EuiPanel 
            paddingSize="m" 
            hasShadow
            style={{ maxWidth: 500 }}>
            <EuiForm>
              {formProps}
            </EuiForm>
          </EuiPanel>
          
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
