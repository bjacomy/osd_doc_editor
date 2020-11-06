import React, {
  Component,
} from 'react';
import ReactDOM from 'react-dom';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiComboBox,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';


export default class extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fieldName: "",
      selectedTypes: [],
      isInvalidName: false,
      isInvalidDatatype: false
    };

    this.datatypes = [
      {
        key: 'Text',
        label: 'Text',
        options: [
          { label: 'text' },
          { label: 'keyword' },
          { label: 'text+keyword' }
        ],
      },
      {
        key: 'Number',
        label: 'Number',
        options: [
          { label: 'short' },
          { label: 'integer'},
          { label: 'long' },
          { label: 'float' },
          { label: 'double' }
        ],
      },
      {
        key: 'Boolean',
        label: 'Boolean',
        options: [
          { label: 'boolean' }
        ],
      },
      {
        key: 'Date',
        label: 'Date',
        options: [
          { label: 'date' }
        ]
      }
    ]

    this.close = this.props.close

    this.handleInputFieldname = this.handleInputFieldname.bind(this)
    this.handleChangeDatatype = this.handleChangeDatatype.bind(this)
    this.handleCreateNewField = this.handleCreateNewField.bind(this)
  }

  handleInputFieldname(e){
    this.setState({
      fieldName: e.target.value,
      isInvalidName: this.isInvalidName(e.target.value)
    })
  }

  handleChangeDatatype(selectedTypes) {

    this.setState({
      selectedTypes,
      isInvalidDatatype: this.isInvalidDatatype(selectedTypes)
    })
  }

  isInvalidName(name) {
    return name.trim() === ''
  }

  isInvalidDatatype(types) {
    return !types || !types.length
  }

  handleCreateNewField() {

    const {
      fieldName,
      selectedTypes
    } = this.state

    const isInvalidName     = this.isInvalidName(fieldName)
    const isInvalidDatatype = this.isInvalidDatatype(selectedTypes)

    if (isInvalidName || isInvalidDatatype) {

      this.setState({
        isInvalidName,
        isInvalidDatatype
      })

      return
    }

    let body = this.getBody(fieldName, selectedTypes[0].label)

    fetch(`../api/doc-editor/${this.props.index}/_mapping`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'kbn-xsrf': 'reporting'
        },
        body: JSON.stringify(body)
      })
      .then(res => res.json())
      .then(result => {
          this.props.refreshMapping(this.props.index);
      })
      .catch(err => {
        console.log (`Error to create a new field ${fieldName} in index ${this.props.index}`, err);
      })

      this.close();
  }

  getBody(name, datatype, ignoreAbove=512) {

    let type = {
      "type": datatype
    }

    if (datatype == "text+keyword") {
      type = {
        "type": "text",
        "fields": { "keyword": {"type": "keyword","ignore_above": ignoreAbove} }
      }
    }

    return {
      "properties": {
        [name]: type
      }
    };
  }

  render() {

    return (
      <EuiFlyout
        onClose={this.close}
        size="m"
      >
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id="AddNewFieldToIndex">
              Add a new field to this index
            </h2>
          </EuiTitle>
        </EuiFlyoutHeader>

        <EuiFlyoutBody>
          <EuiForm>
            <EuiFormRow label="Field name">
              <EuiFieldText
                name="fieldname"
                value={this.state.fieldName}
                onChange={this.handleInputFieldname}
                isInvalid={this.state.isInvalidName}
              />
            </EuiFormRow>
            <EuiSpacer size="m" />
            <EuiFormRow label="Field datatype">
              <EuiComboBox
                placeholder="Choose a type"
                options={this.datatypes}
                selectedOptions={this.state.selectedTypes}
                onChange={this.handleChangeDatatype}
                isInvalid={this.state.isInvalidDatatype}
                isClearable={false}
                singleSelection={{ asPlainText: true }}
              />
            </EuiFormRow>
          </EuiForm>

        </EuiFlyoutBody>

        <EuiFlyoutFooter>
          <EuiFlexGroup justifyContent="spaceBetween">
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                iconType="cross"
                onClick={this.close}
                flush="left"
              >
                Close
              </EuiButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton
                onClick={this.handleCreateNewField}
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
