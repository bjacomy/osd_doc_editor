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
import Details from './components/indexDetails.js';
import IndexList from './components/indexList.js';




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
    liste.push({ value: 'choose index', text: 'choose index' , "disabled" : true });
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
  var total = 0;
  var body = {};var query = {};var sort = [];
  sort.push({"_id" : "asc"});
  body["sort"] = sort;
  query["match_all"] = {};
  body["query"] = query;
  body["size"] = 10;
  $http.post(`../api/label/${this.index}/_search`,body).then((response) => {
    this.status = response.data;
    $http.get(`../api/label/${this.index}/_mapping`).then((response) => {
      this.mapping = response.data;
      var type = Object.keys(this.mapping[this.index]["mappings"])[0];
      $scope.data = this.status.hits.hits;
      total = this.status.hits.total;
      for (var v in  this.status.hits.hits) {
        for (var key in  this.mapping[this.index]["mappings"][type]["properties"]) {
          if(! this.mapping[this.index]["mappings"][type]["properties"][key]["type"]){
            for (var subkey in  this.mapping[this.index]["mappings"][type]["properties"][key]["properties"]) {
              if(this.status.hits.hits[v]._source[key])
              {
                if(this.status.hits.hits[v]._source[key][subkey])
                {
                  this.status.hits.hits[v][key+"."+subkey]=this.status.hits.hits[v]._source[key][subkey];
                }
                else {
                  this.status.hits.hits[v][key+"."+subkey]="";
                }
              }
              else {
                this.status.hits.hits[v][key+"."+subkey]="";
              }
            }
          }
          else {
              if(this.status.hits.hits[v]._source[key])
              {
                this.status.hits.hits[v][key]=this.status.hits.hits[v]._source[key];
              }
              else {
                this.status.hits.hits[v][key]="";
              }
          }

        }
      }
      /*for (var v in  this.status.hits.hits) {
        for (var key in  this.mapping[this.index]["mappings"][type]["properties"]) {
          if(this.status.hits.hits[v]._source[key])
          { if(typeof this.status.hits.hits[v]._source[key] == "object"){
            console.log(Object.keys(this.status.hits.hits[v]._source[key]));
            for (var subkey in  Object.keys(this.status.hits.hits[v]._source[key])) {
              this.status.hits.hits[v][key+"."+Object.keys(this.status.hits.hits[v]._source[key])[subkey]]=this.status.hits.hits[v]._source[key][Object.keys(this.status.hits.hits[v]._source[key])[subkey]];
            }
            }
            else{
              this.status.hits.hits[v][key]=this.status.hits.hits[v]._source[key];
            }
          }
          else
          {this.status.hits.hits[v][key]="";}
        }
      }*/

      this.col = this.col.substring(0,this.col.length -1)
      var indiceColonne = this.col.split(",");
      var valeurColonne = [];
      var rechercheColonne = [];

        for (var v in $scope.data[0]){
          if(! v.startsWith("_")){
            if(! v.startsWith("$")){
              if ( ! v.startsWith("sort")) {
                valeurColonne.push(v);
                if(v["type"] == "text"){
                  rechercheColonne.push(v);
                }
              }
            }
          }
        }

      var colonneFinal = [];
      for (var key in indiceColonne){
        for (var v in valeurColonne){
          if(v == indiceColonne[key])
          {  colonneFinal.push(valeurColonne[v]);
          }
        }
      }
      console.log($scope.data);
      console.log(colonneFinal);
      display_UI($scope.data, colonneFinal, rechercheColonne, total);

    });
  });


  //Affichage des données dans une table html après conversion
function display_UI(tabNames, col, rechercheC, total) {

    ReactDOM.render(
      <Details names={tabNames} colonne={col} recherche={rechercheC} total={total}/>,
      document.getElementById("react_tabs")
    );

};

})
