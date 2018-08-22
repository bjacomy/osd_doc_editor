import React, {
  Component,
  Fragment,
} from 'react';
import ReactDOM from 'react-dom';
import {
  EuiSelect,
  EuiCheckboxGroup,
  EuiSpacer,
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiTextColor,
  EuiTitle,
  EuiSwitch,
  EuiHeader,
  EuiHeaderBreadcrumbs,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderSectionItemButton,
  EuiHeaderLogo,
  EuiIcon,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiButtonEmpty,
  EuiCheckbox,
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

    this.timerID = null;
    this.indices = this.props.names;
    this.closeModal = this.closeModal.bind(this);
    this.showModal = this.showModal.bind(this);
    const idPrefix = '1';
    let groupOptions = [];

    this.state = {
      checkboxes: [],
      value: '',
      indexType: '',
      link:'',
      checkboxIdToSelectedMap: {},
      isButtonVisible:false,
      checked: false,
      isModalVisible: false,
      inputLabel: '',
      typeValue: '',
    };
  }
/*
  componentDidMount() {
        setInterval(() => {
            this.setState(() => {
                //console.log('setting state');
                return { unseen: "does not display" }
            });
        }, 1000);
  }*/

  componentWillUnmount() {
    console.log("componentWillUnmount: Component is about to be removed from the DOM!");
  }

    handle(event){
      this.setState({
        inputLabel: event.target.value
      })
    }

    onChangeSelectType = e => {
    this.setState({
      typeValue: e.target.value,
    });
    }

    closeModal() {
    this.setState({ isModalVisible: false });
    }

    showModal() {
    this.setState({ isModalVisible: true });
    }

    isItemSelected = itemId => {
      return this.state.checkboxIdToSelectedMap[itemId];
    }

    areAllItemsSelected = () => {
      const indexOfUnselectedItem = this.state.checkboxes.findIndex(item => !this.isItemSelected(item.id));
      return indexOfUnselectedItem === -1;
    }

    areAnyRowsSelected = () => {
      return Object.keys(this.state.checkboxIdToSelectedMap).findIndex(id => {
        return this.state.checkboxIdToSelectedMap[id];
      }) !== -1;
    }

    onChange = e => {
      this.setState({
        checked: e.target.checked,
      });
      const allSelected = this.areAllItemsSelected();
      const newItemIdToSelectedMap = {};
      this.state.checkboxes.forEach(item => newItemIdToSelectedMap[item.id] = !allSelected);
      console.log(this.state.checkboxIdToSelectedMap);
      this.setState({
        checkboxIdToSelectedMap: newItemIdToSelectedMap,
      });
      var exempleTimeout = setTimeout(this.columnParam, 500);
    };

    toggleItem = itemId => {
      this.setState(previousState => {
        const newItemIdToSelectedMap = {
          ...previousState.checkboxIdToSelectedMap,
          [itemId]: !previousState.checkboxIdToSelectedMap[itemId],
        };
        return {
          checkboxIdToSelectedMap: newItemIdToSelectedMap,
        };
      });
      var exempleTimeout = setTimeout(this.columnParam, 500);
    }

  onChangeCheck = optionId => {
    console.log(optionId);
    const newCheckboxIdToSelectedMap = ({ ...this.state.checkboxIdToSelectedMap, ...{
      [optionId]: !this.state.checkboxIdToSelectedMap[optionId],
    } });

    this.setState({
      checkboxIdToSelectedMap: newCheckboxIdToSelectedMap,
    });
     var exempleTimeout = setTimeout(this.columnParam, 500);
  };

  onChangeSelect = e => {
    this.setState({
      value: e.target.value,
      checkboxIdToSelectedMap:{}
    });
    this.checkMapping(e.target.value);
  }

  checkMapping = (index) => {
    console.log(this.indices);
    fetch("../api/label/"+index+"/_mapping", {
        method: 'get',
      })
      .then(res => res.json())
      .then(
        (result) => {
          var type = Object.keys(result[this.state.value]["mappings"])[0];
          this.setState({
            indexType: type
          })
          var colonne = [];
          var i = 0;
          for (var key in  result[this.state.value]["mappings"][type]["properties"]) {
            if(! result[this.state.value]["mappings"][type]["properties"][key]["type"]){
                var c = {};
                c["id"] = i.toString();
                c["label"] = key+"  (Complex Field)" ;
                c['disabled'] = true;
                colonne.push(c);
                i++;
            }
            else {
              var c = {};
              c["id"] = i.toString();
              c["label"] = key;
              c["disabled"] = false;
              colonne.push(c);
              i++;
            }

          }
          this.setState({
            checkboxes:colonne
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {

        }
      )
  };

  columnParam = () => {
    var param = "";
    for (var key in this.state.checkboxIdToSelectedMap){
      if(this.state.checkboxIdToSelectedMap[key] == true)
      {param+= key+",";
      this.setState({
        isButtonVisible: true,
      });
      }
    }
    this.setState({
      link: param,
      isButtonVisible: param !== '',
    });
  }

  "fields": {
                "keyword": {
                  "type": "keyword",
                  "ignore_above": 256
                }
              }

  getBody= () => {
    var mapReq = {};
    var type = {};
    type["type"] = this.state.typeValue;
    type["fields"] = {"keyword": {"type": "keyword","ignore_above": 256}};
    var property = {};
    property[this.state.inputLabel] = type;
    mapReq["properties"] = property;
    return mapReq;
  }

  saveLabel= () => {
    console.log(this.state.indexType);
    let body = this.getBody();
    let index = this.state.value;
    let type = this.state.indexType;
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
          this.checkMapping(index);
          this.setState({
            checkboxIdToSelectedMap:{}
          })

        },
        (error) => {

        }
      )
      this.closeModal();
  }

  render() {
    const { selectedOptions } = this.state;

    let button;

    if (this.state.isButtonVisible == true) {
      button = (
        <EuiButton href={"#/index/" + this.state.value +"/"+ this.state.link}
        iconSide="right"
        iconType="arrowRight"
        onClick={() => {
          ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
        }}
        >
          Next
        </EuiButton>
      );
    }else {
      button = (
      <EuiButton
        iconSide="right"
        iconType="arrowRight"
        onClick={() => window.alert('Check fields before !!')}
        isDisabled
      >
        Next
      </EuiButton>
    );
    }

    const formSample = (
      <EuiForm>
        <EuiFormRow label="Field name">
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
                Add a field to this index
              </EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
              {formSample}
              <Fragment>
                <EuiSpacer size="m" />
                <EuiFormRow label="Type">
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

    let todos = this.state.checkboxes.map((todo) => {return <div key={todo.id} style={{marginBottom: '10px'}}><EuiCheckbox
          id={todo.id}
          label={todo.label}
          checked={this.state.checkboxIdToSelectedMap[todo.id]}
          onChange={this.toggleItem.bind(this, todo.id)}
          disabled={todo.disabled}

        />
        </div>

        });
    let switcher;
    if(this.state.value !== ''){
      switcher = (
        <EuiFlexGroup gutterSize="m" >
          <EuiSwitch style={{paddingTop: '10px'}}
                    id={"a1"}
                    label="Check all"
                    checked={this.areAllItemsSelected()}
                    onChange={this.onChange}
          />

          <EuiFlexItem grow={false}>
          <div>
            <EuiButton
                onClick={this.showModal}
                iconSide="left"
                iconType="plusInCircle"
                style={{marginLeft: '170px',marginTop: '-15px'}}>
                Add field
            </EuiButton>
            {modal}
          </div>
          </EuiFlexItem>
        </EuiFlexGroup>
      );
    }
    return (

      <Fragment>
        <EuiHeader>
          <EuiHeaderSection>
            <EuiHeaderSectionItem border="right">
              <EuiHeaderLogo
                aria-label="Actions"
                iconType="indexEdit"
                size='xxl'
                style={{ color: '#025471', paddingLeft: '15px', marginTop: '-2px' ,width: '60px'}}
              />
            </EuiHeaderSectionItem>
            <EuiTitle size="l">
              <h1 style={{ color: '#025471', padding:'10px'}}>Doc Editor</h1>
            </EuiTitle>
          </EuiHeaderSection>
        </EuiHeader>

        <EuiSpacer size="l" />

        <EuiTitle>
          <h2 style={{ fontWeight: '600'}}>Elasticsearch indices</h2>
        </EuiTitle>
        <EuiSpacer size="l" />
        <EuiSelect
          options={this.indices}
          defaultValue={this.indices[0].value}
          onChange={this.onChangeSelect}
        />

        <EuiSpacer size="l" />
        {switcher}
        <EuiSpacer size="l" />
        <Fragment>
        {todos}
        </Fragment>

        <EuiSpacer size="l" />
        {button}
        <EuiSpacer size="l" />
      </Fragment>

    );
  }
}
