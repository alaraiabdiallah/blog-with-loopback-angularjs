// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app', [
    'ui.router',
    'ui.grid', 
    'ui.grid.pagination',
    'lbServices',
    'ui.grid.selection',
    'ui.grid.cellNav',
    'angularFileUpload',
    'ngCookies',
    'summernote'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,
    $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'HomeController',
        templateUrl: 'views/home.html'
      })
      .state('blank', {
        url: '/blank',
        templateUrl: 'views/blank.html'
      })
      .state('categories', {
        url: '/categories',
        controller: 'CategoryController',
        templateUrl: 'views/category/index.html'
      })
      .state('posts', {
        url: '/posts',
        controller: 'PostController',
        templateUrl: 'views/post/index.html'
      })
      .state('post-create', {
        url: '/posts/create',
        controller: 'PostCreateController',
        templateUrl: 'views/post/create.html'
      })
      .state('post-edit', {
        url: '/posts/edit/:id',
        controller: 'PostEditController',
        templateUrl: 'views/post/edit.html'
      });
    $urlRouterProvider.otherwise('home');
  }])
  .run(['$rootScope', '$state', 'LoopBackAuth', 'AuthService', 'ModelBuilder', function ($rootScope, $state, LoopBackAuth, AuthService, ModelBuilder) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      // redirect to login page if not logged in
      if (toState.authenticate && !LoopBackAuth.accessTokenId) {
        event.preventDefault(); //prevent current page from loading

        // Maintain returnTo state in $rootScope that is used
        // by authService.login to redirect to after successful login.
        // http://www.jonahnisenson.com/angular-js-ui-router-redirect-after-login-to-requested-url/
        $rootScope.returnTo = {
          state: toState,
          params: toParams
        };

        $state.go('forbidden');
      }
    });

    ModelBuilder.build();

    // Get data from localstorage after pagerefresh
    // and load user data into rootscope.
    if (LoopBackAuth.accessTokenId && !$rootScope.currentUser) {
      AuthService.refresh(LoopBackAuth.accessTokenId);
    }
  }]);
