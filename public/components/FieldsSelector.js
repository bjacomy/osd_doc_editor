import React, {
  Component,
  Fragment,
} from 'react';
import ReactDOM from 'react-dom';
import {
  EuiComboBox,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSpacer,
  EuiSwitch,
} from '@elastic/eui';

export default class extends Component {

  constructor(props) {

    super(props);

    this.state = {
      selectedFieldsLabels: []
    }
  }

  getFieldsByGroup() {

    // Get all unique type values
    let groupLabels = this.props.fields.map(p => p.type) // get the field datatype
                                       .filter((p, i, self) => (self.indexOf(p) == i)) // remove duplicates

    return groupLabels.map(g => ({
      key: g,
      label: g,
      options: this.props.fields.filter(f => (f.type === g))
    }))

  }

  getSelectedFields() {
    return this.props.fields.filter(f => this.state.selectedFieldsLabels.includes(f.label));
  }

  areAllFieldsSelected = () => {
    // return true if all elements is selected
    return this.getSelectedFields().length == this.props.fields.filter(f => !f.disabled).length;
  }

  onToggleAllFieldsChecked = e => {

    // no selected ids if all already selected, else all fields are selected
    let selectedFieldsLabels = this.areAllFieldsSelected() ?
      [] : this.props.fields.filter(f => !f.disabled).map(f => f.label)

    this.setState({ selectedFieldsLabels })
    this.props.onSelectFields(selectedFieldsLabels)
  }

  onChangeSelectFields = (selectedFields) => {

    let selectedFieldsLabels = selectedFields.map(f => f.label)

    this.setState({ selectedFieldsLabels })
    this.props.onSelectFields(selectedFieldsLabels)

  }

  render() {

    return (
      <Fragment>
        <EuiFlexGroup >
          <EuiFlexItem grow={false}>
            <EuiFormRow
              label="Select the fields to vizualize"
              helpText="For some index with many existing fields, visualisation is better with a short preset of fields"
            >
              <EuiComboBox
                placeholder=""
                options={this.getFieldsByGroup()}
                selectedOptions={this.getSelectedFields()}
                onChange={this.onChangeSelectFields}
                isClearable={true}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem style={{marginTop: '40px'}}>
            <EuiSwitch label="Check all fields"
                      checked={this.areAllFieldsSelected()}
                      onChange={this.onToggleAllFieldsChecked}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer size="m" />
      </Fragment>
    )
  }
}
