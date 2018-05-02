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
      value: this.indices[0].value,
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
    fetch("../api/label/"+e.target.value+"/_mapping/sales", {
        method: 'get',
      })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          var colonne = [];
          var i = 0;
          for (var key in  result[this.state.value]["mappings"]["sales"]["properties"]) {
            var c = {};
            console.log(key);
            c["id"] = i.toString();
            c["label"] = key;
            colonne.push(c);
            i++;
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
  
  nextPage = () => {
    var param = "";
    for (var key in this.state.checkboxIdToSelectedMap){
      if(this.state.checkboxIdToSelectedMap[key] == true)
      param+= key+",";
    }
    this.state.link = param;
    console.log(this.state.checkboxIdToSelectedMap);
    //this.props.column = this.state.checkboxIdToSelectedMap;
  }

  render() {
    const { selectedOptions } = this.state;
    return (
      <Fragment>
        <EuiSelect
          options={this.indices}
          value={this.state.value}
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
      
    </Fragment> 
        
     
    );
  }
}