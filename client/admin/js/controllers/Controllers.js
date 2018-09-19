angular.module('app')
.controller('HomeController',['$scope',function($scope){

}])

.controller('CategoryController', ['$scope','$http','Category', ($scope,$http, Category) => {
    var modalContext = $('#categoryModal');
    $scope.pageTitle = "Categories";
    $scope.datas = [];
    $scope.searchKeyword = '';
    $scope.searchMsg = '';
    $scope.datasTemp = [];
    $scope.paging = {
        hasPaging: false,
        perPage: 10,
        totalData: 0,
        currentPos: 0,
        totalPage: 0,
        currentPage: 0
    }
    $scope.orderMethod = '-id';
    $scope.actionTitle = '';
    $scope.action = '';
    $scope.form = {id: 0,name: '',slug: '',description:''};
    
    let initPaging = () => {
        Category.count().$promise.then(res => {
            $scope.paging.totalData = res.count;
            $scope.paging.totalPage = Math.floor(res.count / $scope.paging.perPage);
            if ($scope.paging.currentPage > $scope.paging.totalPage) {
              $scope.paging.hasPaging = false;
            } else {
              $scope.paging.hasPaging = true;
            }
        });
    }

    let onLoadData = (res) => {
      $scope.paging.currentPos += $scope.paging.perPage;
      $scope.paging.currentPage++;
      if ($scope.paging.currentPage > $scope.paging.totalPage) {
        $scope.paging.hasPaging = false;
      } else {
        $scope.paging.hasPaging = true;
      }
      res.forEach(el => $scope.datas.push(el));
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

    let pagingReset = () =>{
        $scope.paging = {
          hasPaging: false,
          perPage: 10,
          totalData: 0,
          currentPos: 0,
          totalPage: 0,
          currentPage: 0
        }
    }

    $scope.init = () => {
        initPaging();
        $scope.loadData();
    }

    $scope.loadData = () => {
      let filter = {
        skip: $scope.paging.currentPos,
        limit: $scope.paging.perPage,
        order: 'id DESC'
      };
      Category.find({filter : filter},onLoadData);
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


    $scope.search = () => {
        if ($scope.searchKeyword != '') {
            $http.get('/api/categories?filter={"where":{"name":{"like":"' + $scope.searchKeyword + '","options":"i"}}}')
            .then((res)=>{
                if(res.data.length > 0){
                    if ($scope.datasTemp.length < 1) {
                      $scope.datasTemp = $scope.datas;
                    }
                    $scope.datas = res.data
                    $scope.searchMsg = "About " + res.data.length + " results";
                }
            })
        }

        if ($scope.searchKeyword == '') {
            $scope.datas = $scope.datasTemp;
            $scope.datasTemp = [];
            $scope.searchMsg = '';
        }

    };

    $scope.onNameChange = () => {
        $scope.form.slug = slugify($scope.form.name);
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
}])
.controller('PostController', ['$scope', '$http', 'Post', ($scope, $http, Post) => {
  var modalContext = $('#postModal');

  $scope.pageTitle = "Posts";
  $scope.datas = [];
  $scope.searchKeyword = '';
  $scope.searchMsg = '';
  $scope.datasTemp = [];
  $scope.paging = {
    hasPaging: false,
    perPage: 10,
    totalData: 0,
    currentPos: 0,
    totalPage: 0,
    currentPage: 0
  }
  $scope.orderMethod = '-id';
  $scope.actionTitle = '';
  $scope.action = '';

  let initPaging = () => {
    Post.count().$promise.then(res => {
      $scope.paging.totalData = res.count;
      $scope.paging.totalPage = Math.floor(res.count / $scope.paging.perPage);
      if ($scope.paging.currentPage > $scope.paging.totalPage) {
        $scope.paging.hasPaging = false;
      } else {
        $scope.paging.hasPaging = true;
      }
    });
  }

  let onLoadData = (res) => {
    $scope.paging.currentPos += $scope.paging.perPage;
    $scope.paging.currentPage++;
    if ($scope.paging.currentPage > $scope.paging.totalPage) {
      $scope.paging.hasPaging = false;
    } else {
      $scope.paging.hasPaging = true;
    }
    res.forEach(el => $scope.datas.push(el));
  }

  $scope.init = () => {
    initPaging();
    $scope.loadData();
  }

  $scope.loadData = () => {
    let filter = {
      skip: $scope.paging.currentPos,
      limit: $scope.paging.perPage,
      order: 'id DESC'
    };
    Post.find({filter: filter}, onLoadData);
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
          Post.deleteById({
            id: id
          }).$promise.then(() => {
            $scope.datas = $scope.datas.filter((item, i) => {
              return item.id != id
            });
            toastr.success('Success to delete data');
          })
        }
      });
  }


  $scope.search = () => {
    if ($scope.searchKeyword != '') {
      $http.get('/api/posts?filter={"where":{"name":{"like":"' + $scope.searchKeyword + '","options":"i"}}}')
        .then((res) => {
          if (res.data.length > 0) {
            if ($scope.datasTemp.length < 1) {
              $scope.datasTemp = $scope.datas;
            }
            $scope.datas = res.data
            $scope.searchMsg = "About " + res.data.length + " results";
          }
        })
    }

    if ($scope.searchKeyword == '') {
      $scope.datas = $scope.datasTemp;
      $scope.datasTemp = [];
      $scope.searchMsg = '';
    }

  };

  $scope.init();
}])
.controller('PostCreateController', ['$scope', '$window', '$cookies', '$state', 'Category', 'Post', ($scope, $window, $cookies, $state, Category, Post) => {
  $scope.pageTitle = "Create Posts";
    $scope.selectedCategory = [];
    $scope.published = false;
    $scope.searchCategory = '';
    $scope.baseUrl = baseUrl();
    $scope.hasChanges = false;
    $scope.saved = false;
    $scope.form = {
      id: 0,
      title: 'Untitled Post',
      slug: 'untitled-post-' + randText(),
      content: '',
      publishedAt: null
    };

    let fillForm = (data) => {
      $scope.form = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
        publishedAt: data.publishedAt
      };
    }

    let save = () => {
      let data = $scope.form;
      delete data.id;
      data.publishedAt = $scope.published ? (new Date()) : null;
      Post.create(data).$promise
        .then((data) => {
          fillForm(data);
          $cookies.post_id = data.id;
          toastr.success('Success to save data');
          $scope.hasChanges = false;
          $scope.saved = true;
        })
    }

    $scope.categories = Category.find({
      filter:{
        fields: {id: true, name: true}
      }
    });

    $scope.init = () => {
      if ($cookies.post_id !== undefined){
        $state.go('post-edit', {
          id: $cookies.post_id
        });
      }
    }
    
    $scope.publish = () => {
      published = $scope.published;
      $scope.published = published ? false : true;
      save();
    }
    $scope.save = () => {
      save();
    }
    
    $scope.onTitleChange = () => {
      $scope.hasChanges = true;
      $scope.form.slug = slugify($scope.form.title);
    }

    $scope.onSlugChange = () => {
      $scope.hasChanges = true;
      $scope.form.slug = slugify($scope.form.slug);
    }

    $scope.onContentChange = () => {
      $scope.hasChanges = true;
    }

    $scope.onSelectCategory = (id) => {
      var categories = $scope.selectedCategory;
      var selected = categories.indexOf(id);
      if (selected == -1) {
        categories.push(id);
      }else{
        categories.splice(selected, 1);
      }
      $scope.hasChanges = true;
    }

    $scope.onSlugClick = () => {
      $('[name=slug]').focus();
    }

    $scope.isSelected = (arr,value) => {
      return inArray(arr,value);
    }

    $scope.$on('$stateChangeStart', function (event) {
      delete $cookies.post_id;
      if ($scope.hasChanges) {
        if (!confirm('Want leave this page? Changes you made may not be saved.')) {
          event.preventDefault();
        }
      }
    });

    $window.onbeforeunload = function () {
      if ($scope.hasChanges) {
        return false;
      }
    }

    $scope.init();

}])

.controller('PostEditController', ['$scope', '$window', '$cookies', '$stateParams', 'Category', 'Post', ($scope, $window, $cookies, $stateParams, Category, Post,) => {
  $scope.pageTitle = "Edit Posts";
  $scope.selectedCategory = [];
  $scope.published = false;
  $scope.searchCategory = '';
  $scope.baseUrl = baseUrl();
  $scope.hasChanges = false;
  $scope.saved = false;
  $scope.form = {
    id: 0,
    title: 'Untitled Post',
    slug: 'untitled-post-' + randText(),
    content: '',
    publishedAt: null
  };

  let fillForm = (data) => {
    $scope.form = {
      id: data.id,
      title: data.title,
      slug: data.slug,
      content: data.content,
      publishedAt: data.publishedAt
    };
  }

  let findOne = (id) => {
    Post.findById({
      id: id
    }).$promise.then((data) => {
      fillForm(data)
    })
  }

  let save = () => {
    let data = $scope.form;
    delete data.id;
    data.publishedAt = $scope.published ? (new Date()) : null;
    Post.create(data).$promise
      .then((data) => {
        fillForm(data);
        toastr.success('Success to save data');
        $scope.hasChanges = false;
        $scope.saved = true;
      })
  }

  $scope.categories = Category.find({
    filter: {
      fields: {
        id: true,
        name: true
      }
    }
  });

  $scope.init = () => {
    delete $cookies.post_id;
    findOne($stateParams.id);
  }

  $scope.publish = () => {
    published = $scope.published;
    $scope.published = published ? false : true;
    save()
  }
  $scope.save = () => {
    save()
  }

  $scope.onTitleChange = () => {
    $scope.hasChanges = true;
    $scope.form.slug = slugify($scope.form.title);
  }

  $scope.onSlugChange = () => {
    $scope.hasChanges = true;
    $scope.form.slug = slugify($scope.form.slug);
  }

  $scope.onContentChange = () => {
    $scope.hasChanges = true;
  }

  $scope.onSelectCategory = (id) => {
    var categories = $scope.selectedCategory;
    var selected = categories.indexOf(id);
    if (selected == -1) {
      categories.push(id);
    } else {
      categories.splice(selected, 1);
    }
    $scope.hasChanges = true;
  }

  $scope.onSlugClick = () => {
    $('[name=slug]').focus();
  }

  $scope.isSelected = (arr, value) => {
    return inArray(arr, value);
  }

  $scope.$on('$stateChangeStart', function (event) {
    if ($scope.hasChanges) {
      if (!confirm('Want leave this page? Changes you made may not be saved.')) {
        event.preventDefault();
      }
    }
  });

  $window.onbeforeunload = function () {
    if ($scope.form.id > 0) {
      $cookies.post_id = $scope.form.id;
    }
    if ($scope.hasChanges) {
      return false;
    }
  }

  $scope.init();

}])




function randText() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function getHost(url) {
  var m = url.match(/^(?:https?:)?\/\/([^\/]+)/);
  return m ? m[1] : null;
}

function baseUrl(urlBase = '/'){
    protocol = window.location.protocol;
    host = window.location.host;
    return protocol + '//' + host;
}

function inArray(arr,value){
  return arr.indexOf(value) == -1? false: true; 
}