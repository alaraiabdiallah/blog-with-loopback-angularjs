angular.module('app')

.controller('HomeController',['$scope',function($scope){

}])

.controller('CategoryController', ['$scope','$http','Category', ($scope,$http, Category) => {
    var modalContext = $('#categoryModal');
    
    $scope.datas = [];
    $scope.paging = {
        hasPaging: false,
        perPage: 10,
        totalData: 0,
        currentPos: 0,
        totalPage: 0,
        currentPage: 0
    }
    $scope.actionTitle = '';
    $scope.action = '';

    $scope.form = {id: 0,name: '',slug: '',description:''};
    let initPaging = () => {
        Category.count().$promise.then(res => {
            $scope.paging.totalData = res.count;
            $scope.paging.totalPage = Math.floor(res.count / $scope.paging.perPage);
            $scope.paging.currentPage++;
        });
    }
    let store = () => {
      data = $scope.form;
      delete data.id;
      Category.create(data).$promise
        .then((data) => {
          $scope.datas.push(data);
          toastr.success('Success to store data');
        })
      $scope.formClear();
    }

    let update = () => {
      Category.prototype$updateAttributes($scope.form).$promise.then(() => {
        categoryIndex = $scope.datas.findIndex((obj => obj.id == $scope.form.id));
        $scope.datas[categoryIndex] = $scope.form;
        toastr.success('Success to edit data');
      });
    }

    let findOne = (id) => {
      Category.findById({
        id: id
      }).$promise.then((data) => {
        $scope.form.id = data.id;
        $scope.form.name = data.name;
        $scope.form.slug = data.slug;
        $scope.form.description = data.description;
      })
    }

    

    $scope.init = () => {
        initPaging();
        $scope.loadData();
    }


    $scope.loadData = () => {
      $http.get('/api/categories?filter[limit]=' + $scope.paging.perPage + '&filter[skip]=' + $scope.paging.currentPos)
        .then((res) => {
          res.data.forEach(el => $scope.datas.push(el));
          $scope.paging.currentPos += $scope.paging.perPage;
          $scope.paging.currentPage++;
          if ($scope.paging.currentPage > $scope.paging.totalPage) {
            $scope.paging.hasPaging = false;
          } else {
            $scope.paging.hasPaging = true;
          }
        })
    }

    $scope.create = () => {
        $scope.action = 'create';
        $scope.actionTitle = 'Add new category';
        $scope.formClear();
        modalContext.modal('show');
    }

    $scope.edit = (id) => {
        $scope.action = 'edit';
        $scope.actionTitle = 'Edit category';
        $scope.formClear();
        findOne(id);
        modalContext.modal('show');
    }

    $scope.save = () => {
        let action = $scope.action;
        if (action == 'create') store();
        if (action == 'edit') update();
    }
    
    $scope.saveAndClose = () => {
      $scope.save();
      modalContext.modal('hide');
    }
    
    $scope.deleteAction = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this data!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                Category.deleteById({id: id}).$promise.then(() => {
                    $scope.datas = $scope.datas.filter((item, i) => {
                        return item.id != id
                    });
                    toastr.success('Success to delete data');
                }) 
            }
        });
    }
    $scope.formClear = () => {
        $scope.form = {
            id: 0,
            name: '',
            slug: '',
            description: ''
        };
    }

    $scope.init();
}]);

