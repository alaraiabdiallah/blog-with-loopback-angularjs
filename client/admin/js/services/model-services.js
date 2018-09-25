// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
  .factory('CategoryService', ['Category','$q', '$rootScope',  function (
    Model, $q, $rootScope) {
    var grid = {
      enableFiltering: false,
      paginationPageSizes: [25, 50, 75],
      paginationPageSize: 25,
      columnDefs: [
        { name: 'name' },
        { name: 'createdAt' },
        { name: 'publishedAt' },
        {
          name: 'Action',
          cellTemplate: '<div class="text-center"><button class="btn btn-primary btn-xs" ng-click="grid.appScope.edit(row.entity.id)"><i class="fa fa-pencil"></i></button> ' +
          '<button class="btn btn-danger btn-xs" ng-click="grid.appScope.deleteAction(row.entity.id)"><i class="fa fa-trash-o"></i></button></div>',
          enableSorting: false
        }
      ]
    };

    var tableName = "categories";

    function buildModel(){
        let query = "CREATE TABLE "+tableName+" (id INT, name string, slug string, description string, createdAt DATETIME, modifiedAt DATETIME)";
        alasql(query);
    }

    function insert(data){
        Model.create(data,function(data){
            pushData(data);
            reloadGrid();
            toastr.success('Success to save data');
        },function(err) {
            toastr.error('Failed to save data');
        });
    }

    function findById(id){
        let sql = "SELECT * FROM " + tableName + " WHERE id = ?";
        let query = alasql(sql, [id]);
        return query.length > 0 ? query[0] : [];
    }

    function update(data) {
        Model.prototype$updateAttributes(data,function(data){
            alasql("DELETE FROM " + tableName + " WHERE id = ? ;", [data.id]);
            pushData(data);
            reloadGrid();
            toastr.success('Success to edit data');
        });
    }

    function deleteData(id){
        Model.deleteById({
          id: id
        }).$promise.then(() => {
          alasql("DELETE FROM "+tableName+" WHERE id = ? ;", [id]);
          reloadGrid();
          toastr.success('Success to delete data');
        })
    }

    function deleteMultiple(ids){
        Model.MultipleDelete({id:ids},() => {
            alasql("DELETE FROM " + tableName + " WHERE id IN(" + ids.join() + ")");
            toastr.success('Success to delete '+ ids.length + ' data');
            reloadGrid();
        }, () => toastr.error('Failed to delete data'));
    }

    function pushData(data){
        alasql.tables[tableName].data.push(data);
    }

    function onLoadData(data){
        alasql.tables.categories.data = data;
        grid.data = alasql("SELECT * FROM " + tableName + " ORDER BY id DESC");
    }

    function reloadGrid(){
        let datas = alasql("SELECT * FROM " + tableName + " ORDER BY id DESC");
        grid.data = datas;
    }

    function init(){
        Model.find({},onLoadData);
    }

    return {
      build: buildModel,
      insert: insert,
      grid : grid,
      init: init,
      reloadGrid: reloadGrid,
      deleteData: deleteData,
      findById: findById,
      update:update,
      deleteMultiple : deleteMultiple
    };
  }])
  .factory('ModelBuilder', ['CategoryService','$q', '$rootScope', '$state', function (
    CategoryService, $q, $rootScope, $state) {
    function buildModel() {
        CategoryService.build();
    }
    return {
      build: buildModel,
    };
  }]);

String.prototype.trimRight = function (charlist) {
  if (charlist === undefined)
    charlist = "\s";

  return this.replace(new RegExp("[" + charlist + "]+$"), "");
};