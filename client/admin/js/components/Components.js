angular.module('app')
.directive('sideBar', function(){
    return {
        templateUrl: 'views/components/sidebar.html'
    }
})
.directive('topBar', function () {
  return {
    templateUrl: 'views/components/topbar.html'
  }
})

.directive('fooTer', function () {
  return {
    templateUrl: 'views/components/footer.html'
  }
})