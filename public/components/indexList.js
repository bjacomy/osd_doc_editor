import React, {
  Component,
  Fragment,
} from 'react';

import {
  EuiSelect,
  EuiCheckboxGroup,
  EuiSpacer,
  EuiComboBox,
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiTextColor,
  EuiTitle,
} from '@elastic/eui';

export default class extends Component {
  constructor(props) {
    super(props);

    this.indices = this.props.names;

    const idPrefix = '1';

    //this.checkboxes = [];

    //this.index = this.state.value;
    let groupOptions = [];

    this.state = {
      checkboxes: [],
      value: '',
      link:'',
      checkboxIdToSelectedMap: {},
    };
  }

  componentDidMount() {
        setInterval(() => {
            this.setState(() => {
                //console.log('setting state');
                return { unseen: "does not display" }
            });
        }, 1000);
    }

  onChangeCheck = optionId => {
    const newCheckboxIdToSelectedMap = ({ ...this.state.checkboxIdToSelectedMap, ...{
      [optionId]: !this.state.checkboxIdToSelectedMap[optionId],
    } });

    this.setState({
      checkboxIdToSelectedMap: newCheckboxIdToSelectedMap,
    });

     var exempleTimeout = setTimeout(this.columnParam, 1000);

  };

  onChangeSelect = e => {
    this.setState({
      value: e.target.value,
    });
    console.log(e.target.value);
    fetch("../api/label/"+e.target.value+"/_mapping", {
        method: 'get',
      })
      .then(res => res.json())
      .then(
        (result) => {
          var type = Object.keys(result[this.state.value]["mappings"])[0];
          var colonne = [];
          var i = 0;
          for (var key in  result[this.state.value]["mappings"][type]["properties"]) {
            if(! result[this.state.value]["mappings"][type]["properties"][key]["type"]){
              for (var subkey in  result[this.state.value]["mappings"][type]["properties"][key]["properties"]) {
                var newKey=key+"."+ subkey;
                var c = {};
                c["id"] = i.toString();
                c["label"] = newKey;
                colonne.push(c);
                i++;
              }
            }
            else {
              var c = {};
              c["id"] = i.toString();
              c["label"] = key;
              colonne.push(c);
              i++;
            }

          }
          console.log(colonne);
          this.state.checkboxes = colonne;
          console.log(this.state.checkboxes);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {

        }
      )

  };

  columnParam = () => {
    //console.log(this.state.checkboxIdToSelectedMap);
    var param = "";
    for (var key in this.state.checkboxIdToSelectedMap){
      if(this.state.checkboxIdToSelectedMap[key] == true)
      param+= key+",";
    }
    this.setState({
      link: param,
    });
  }



  /*nextPage = () => {
    var param = "";
    for (var key in this.state.checkboxIdToSelectedMap){
      if(this.state.checkboxIdToSelectedMap[key] == true)
      param+= key+",";
    }
    this.state.link = param;
    console.log(this.state.checkboxIdToSelectedMap);
    //this.props.column = this.state.checkboxIdToSelectedMap;
  }*/

  render() {
    const { selectedOptions } = this.state;
    return (

      <Fragment>

        <EuiSpacer size="l" />
        <EuiSelect
          options={this.indices}
          defaultValue={this.indices[0].value}
          onChange={this.onChangeSelect}
        />

        <EuiSpacer size="l" />


       <EuiCheckboxGroup
          options={this.state.checkboxes}
          idToSelectedMap={this.state.checkboxIdToSelectedMap}
          onChange={this.onChangeCheck}
        />

        <EuiSpacer size="l" />

        <EuiButton href={"#/index/" + this.state.value +"/"+ this.state.link}>
          Next
        </EuiButton>

        <EuiSpacer size="l" />


    </Fragment>


    );
  }
}
