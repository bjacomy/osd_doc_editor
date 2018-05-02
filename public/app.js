import moment from 'moment';
import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import overviewTemplate from './templates/index.html';
import detailTemplate from './templates/detail.html';
import React from 'react';
import ReactDOM from 'react-dom';
import MyTabs from './components/mytabs.js';
import Test from './components/test.js';
import IndexList from './components/indexList.js';
import SearchTest from './components/search.js';



import 'fixed-data-table-2/dist/fixed-data-table.css';
import 'angular-translate';



var column = [];


uiRoutes.enable();
uiRoutes
.when('/', {
  template: overviewTemplate,
  controller: 'elasticsearchStatusController',
  controllerAs: 'ctrl'
})
.when('/index/:name/:col', {
  template: detailTemplate,
  controller: 'elasticsearchDetailController',
  controllerAs: 'ctrl'
});

uiModules
.get('app/label')
.controller('elasticsearchStatusController', function ($scope, $routeParams, $http) {
  $http.get('../api/label/indices').then((response) => {
    this.indices = response.data;
    var liste = [];
    for (var v in  this.indices) {
       let comp = {};
       comp["value"]= this.indices[v];
       comp["text"]= this.indices[v];
       liste.push(comp); 
    }
    display_indexList(liste,column);
  });

  function display_indexList(indexNames,column) {

    ReactDOM.render(
      <IndexList names={indexNames} column={column}/>,
      document.getElementById("react_list")
    );

}
})
.controller('elasticsearchDetailController', function($scope, $routeParams, $http) {
  this.index = $routeParams.name;
  this.col = $routeParams.col;
  $scope.index = this.index;
  $http.get(`../api/label/search/${this.index}`).then((response) => {
    this.status = response.data;
    $http.get(`../api/label/${this.index}/_mapping/sales`).then((response) => {
      this.mapping = response.data;
      $scope.data = this.status.hits.hits;
      for (var v in  this.status.hits.hits) {
        for (var key in  this.mapping[this.index]["mappings"]["sales"]["properties"]) {
        if(this.status.hits.hits[v]._source[key])
        {this.status.hits.hits[v][key]=this.status.hits.hits[v]._source[key];}
        else
        {this.status.hits.hits[v][key]="";}
      }
      }

      this.col = this.col.substring(0,this.col.length -1)  
      var colonne = this.col.split(",");
      var columns = [];
      
        for (var v in $scope.data[0]){
          if(! v.startsWith("_")){
            if(! v.startsWith("$")){    
            columns.push(v);
            }
          }
        }

      var colonneFinal = [];
      for (var key in colonne){
        for (var v in columns){
          if(v == colonne[key])
          {  colonneFinal.push(columns[v]);
          }
        }
      }   
   
      display_UI($scope.data, colonneFinal);
      //displaySearch_UI();
      
    });
  });


  //Affichage des données dans une table html après conversion
function display_UI(tabNames, col) {

    ReactDOM.render(
      <Test names={tabNames} colonne={col}/>,
      document.getElementById("react_tabs")
    );

};

function displaySearch_UI() {

    ReactDOM.render(
      <SearchTest/>,
      document.getElementById("react_search")
    );

}

})

