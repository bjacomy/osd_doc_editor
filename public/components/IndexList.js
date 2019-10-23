import React, {
  Component,
  Fragment,
} from 'react';

import ReactDOM from 'react-dom';

import {
  EuiButton,
  EuiComboBox,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiText,
  EuiTitle,
  EuiSpacer,

} from '@elastic/eui';

import AddNewFieldFlyout from './flyout/AddNewFieldFlyout'
import FieldsSelector    from './FieldsSelector'
import Header            from './Header'


export default class extends Component {

  constructor(props) {

    super(props);

    this.onClickNextButton = props.onClickNextButton
    this.defaultIndexChoice = { label: 'choose index', disabled: true };
    let otherIndexChoices = this.props.indices.sort().map((i) => ({"label": i}));

    this.indices = [this.defaultIndexChoice, ...otherIndexChoices];

    this.closeNewFieldModal = this.closeNewFieldModal.bind(this);
    this.showNewFieldModal = this.showNewFieldModal.bind(this);

    this.state = {
      availableFields: false,
      selectedIndex: this.defaultIndexChoice,
      isNextButtonActive: false,
      isModalVisible: false,
    };
  }

  closeNewFieldModal() {
    this.setState({ isModalVisible: false });
  }

  showNewFieldModal() {
    this.setState({ isModalVisible: true });
  }


  onChangeSelectIndex = (selectedIndices) => {

    let selectedIndex = selectedIndices[0];
    this.setState({
      selectedIndex,
      availableFields: false
    });
    this.refreshMapping(selectedIndex.label);
  }

  refreshMapping = (selectedIndexName) => {

    let index = selectedIndexName;

    fetch(`../api/doc-editor/${index}/_mapping`, {
        method: 'get',
      })
      .then(res => res.json())
      .then(result => {

        let mappings = result[index]["mappings"]

        let indexProps = mappings["properties"]
        let availableFields = Object.keys(indexProps).map((key, i) =>
        {
          if (indexProps[key]["type"]) {
            return {
              "id": i.toString(),
              "label": key,
              "type": indexProps[key]["type"],
              "disabled" : false
            }
          }
          else {
            return {
              "id": i.toString(),
              "label": key + " (Complex Field not supported)",
              "type": "complex",
              "disabled" : true
            }
          }

        });

        this.setState({
          availableFields: availableFields
        });
      })
      .catch(err => {
        console.log("Error to refresh the mapping :", err)
      })
  }

  changeSelectFields = (selectedFields) => {

    this.setState({
      selectedFieldsParams: selectedFields.join(","),
      isNextButtonActive: selectedFields && this.state.selectedIndex.label
    });
  }


  render() {
    const {
      selectedOptions,
      selectedFieldsParams,
      selectedIndex,
      isNextButtonActive
    } = this.state;

    let nextButton = (
      <EuiButton
        // href={`#/index/${selectedIndex.label}/${selectedFieldsParams}`}
        iconSide="right"
        iconType="arrowRight"
        isDisabled={!isNextButtonActive}
        fill
        onClick={() => this.onClickNextButton(selectedIndex.label, selectedFieldsParams)}
        // onClick={() => { ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode) }}
      >
        Next
      </EuiButton>
    );

    let fieldsSelector
    let addNewFieldFlyout
    let addNewFieldButton

    if(this.state.selectedIndex !== this.defaultIndexChoice) {

      if (this.state.availableFields !== false) {

        if (!this.state.availableFields.length) {
          fieldsSelector = <EuiText>No fields found for this index</EuiText>;
        }
        else {
          fieldsSelector = <FieldsSelector onSelectFields={this.changeSelectFields} fields={this.state.availableFields}/>;
        }
      }

      addNewFieldButton = <EuiButton
          onClick={this.showNewFieldModal}
          iconSide="left"
          iconType="plusInCircle">
          Add a new field
      </EuiButton>;


      if (this.state.isModalVisible) {
        addNewFieldFlyout = (
            <AddNewFieldFlyout close={this.closeNewFieldModal}
                                refreshMapping={this.refreshMapping}
                                index={this.state.selectedIndex.label} />
        );
      }
    }

    return (

      <Fragment>
        <Header firstPage={true}/>

        <EuiSpacer size="l" />

        <EuiTitle>
          <h2 style={{ fontWeight: '600'}}>Elasticsearch indices</h2>
        </EuiTitle>
        <EuiSpacer size="l" />

        <EuiFormRow
          label="Select the index to manage"
          helpText="You can add new document, edit or delete existing and append new datafields to the selected index"
        >
          <EuiComboBox
            placeholder=""
            singleSelection={{ asPlainText: true }}
            options={this.indices}
            selectedOptions={[this.state.selectedIndex]}
            onChange={this.onChangeSelectIndex}
            isClearable={false}
          />
        </EuiFormRow>

        <EuiSpacer size="m" />

        {fieldsSelector}

        <EuiFlexItem grow={false}>
          <div>
            {addNewFieldButton}
            {addNewFieldFlyout}
          </div>
        </EuiFlexItem>

        <EuiSpacer size="l" />

        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <div >
              {nextButton}
            </div>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="l" />
      </Fragment>

    );
  }
}
