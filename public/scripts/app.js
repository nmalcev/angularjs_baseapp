var log_app = angular.module('loganalyzer', ['ngRoute']);

// Attention: html5 routing need a fix at nginx confug file!
// log_app.config(function($locationProvider) {
// 	$locationProvider.html5Mode(true);
// });
log_app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/login', {  
		controller: 'LoginController',
		template: 
			'<div class="login-page">' +
				'<div class="login-wrap">' +
					'<div class="login-wrap_cell">' + '&nbsp;'+'</div>' +
					'<div class="login-wrap_cell">' + 
						'<login-form class="login-form"></login-form>' +
						'<i class="h-vertical-middlle"></i>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="layout-footer">' + 
				'<div class="login-footer-wrap h-clearfix">' +
					'<a href="#" class="layout-footer_link">Link1</a>' +
					'<a href="#" class="layout-footer_link">Link2</a>' +
					'<a href="#" class="layout-footer_link">Link3</a>' +
					'<div class="layout-footer_logo"></div>' + 
				'</div>' +
			'</div>',
	}).when('/dashboard', {  
		controller: 'DashboardController',
		template: 
			'<div class="layout-top">' + 
				'<div class="layout-top-wrap h-clearfix">' +
					'<i class="layout-top_btn" ng-click="logout()"></i>' +
					'<i class="layout-top_btn"></i>' +
					'<i class="layout-top_btn" ng-click="gotoUsersPage()"></i>' +
					'<div class="layout-footer_logo"></div>' + 
				'</div>' +	
			'</div>' + 
			'<div class="layout-content">' +
				'<div>dashboard page</div>' +
			'</div>' +
			'<div class="layout-footer">' + 
				'<div class="layout-footer-wrap h-clearfix">' +
					'<a href="#" class="layout-footer_link">Link1</a>' +
					'<a href="#" class="layout-footer_link">Link2</a>' +
					'<a href="#" class="layout-footer_link">Link3</a>' +
					'<div class="layout-footer_logo"></div>' + 
				'</div>' +
			'</div>',
		resolve:{
			loggedIn: function($location, $q, UserProfile){
				var 	_deferred = $q.defer();

				if(UserProfile.get().login){
					// Recently autorizated
					_deferred.resolve();
				}else{
					UserProfile.checkAutorization(function(d){
						if(d.login){
							_deferred.resolve();
						}else{
							_deferred.reject();
							$location.url('/login');
						}
					});
				}

				return _deferred.promise;
			}
		}
	}).when('/users', {  
		controller: 'UsersController',
		template: 
			'<div class="layout-top">' + 
				'<div class="layout-top-wrap h-clearfix">' +
					'<i class="layout-top_btn" ng-click="logout()"></i>' +
					'<i class="layout-top_btn"></i>' +
					'<i class="layout-top_btn"></i>' +
					'<div class="layout-footer_logo" ng-click="gotoDasboardPage()"></div>' + 
				'</div>' +	
			'</div>' + 
			'<div class="layout-content">' +
				'<div>Users page</div>' +
			'</div>' +
			'<div class="layout-footer">' + 
				'<div class="layout-footer-wrap h-clearfix">' +
					'<a href="#" class="layout-footer_link">Link1</a>' +
					'<a href="#" class="layout-footer_link">Link2</a>' +
					'<a href="#" class="layout-footer_link">Link3</a>' +
					'<div class="layout-footer_logo"></div>' + 
				'</div>' +
			'</div>',
		resolve:{
			loggedIn: function($location, $q, UserProfile){
				var 	_deferred = $q.defer();

				if(UserProfile.get().login){
					// Recently autorizated
					_deferred.resolve();
				}else{
					UserProfile.checkAutorization(function(d){
						if(d.login){
							_deferred.resolve();
						}else{
							_deferred.reject();
							$location.url('/login');
						}
					});
				}

				return _deferred.promise;
			}
		}
	}).otherwise({  
		redirectTo: '/login'  
	});  
}]);  


// Attention: also available event listening inside root controller
log_app.run(['$rootScope', '$location', 'UserProfile', function($rootScope, $location, $profile){
    /*
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        var logged = _rand.bool();

        //check if the user is going to the login page
        // i use ui.route so not exactly sure about this one but you get the picture
        var appTo = currRoute.path.indexOf('/dashboard') !== -1;

        if(appTo && !logged) {
            event.preventDefault();
            $location.path('/login');
        }
    });
    */
}]);


log_app.controller('LoginController', ['$scope', 'UserProfile', function LoginController($scope, $profile){
	$scope.profile = $profile.get();	
}]);

log_app.controller('DashboardController', ['$scope', 'UserProfile', '$location', function DashboardController($scope, $profile, $location){
	$scope.profile = $profile.get();	
	$scope.logout = function(){
		console.log('LOGOUT');
		$profile.logout();
	};
	$scope.gotoUsersPage = function(){
		$location.url('/users');
	};
}]);

log_app.controller('UsersController', ['$scope', 'UserProfile', '$location', function DashboardController($scope, $profile, $location){
	$scope.profile = $profile.get();	
	$scope.logout = function(){
		console.log('LOGOUT');
		$profile.logout();
	};
	$scope.gotoDasboardPage = function(){
		$location.url('/dashboard');
	};
}]);


//===========================================
// UserProfile - shared store to profile data
//===========================================
log_app.factory('UserProfile', ['$http', '$location', function UserProfile($http, $location){
	var _userData = {};

	return {
		checkAutorization: function(next){
			/*
			$http({
				method: 'GET', 
				url: '/api/login',
			}).then(function(d){
				_userData.login = d.data.login;
				_userData.group = d.data.category_id;
				next(_userData);
			}).catch(function(d){ // Enter unvalid data at form (major send no data)
				delete _userData.login;
				delete _userData.group;
				next(_userData);
			});
			*/

			// Fake code:
			if(_rand.bool()){
				_userData.login = 'mr. ' + _rand.string(5);
				_userData.group = 'user';
			}else{
				delete _userData.login;
				delete _userData.group;
			}
			next(_userData);
		},
		// @param conf.login
		// @param conf.password
		// @param conf.remember
		login: function(conf, next){
			var 	shaObj = new window.jsSHA("SHA-256", "TEXT");

			shaObj.update(conf.password || '');
			conf.password = shaObj.getHash('HEX');

			/*
			$http({
				method: 'POST', 
				url: '/api/login',
				data: conf
			}).then(function(d){
				if(d.status == 200){
					_userData.login = conf.login;
					_userData.group = d.data.category_id;	
					$location.url('/dashboard');
				}else{ // Enter incorrect credential pair
					// Wrong autorization data
					next();
				}
			}).catch(function(d){ // Enter unvalid data at form (major send no data)
				next();
			});
			*/

			// Fake code:
			if(conf.login == 'admin'){
				_userData.login = conf.login;
				_userData.group = 'user';	
				$location.url('/dashboard');
			}else{
				next();
			}
		},
		logout: function(next){
			/*
			$http({
				method: 'GET', 
				url: '/api/logout',
			}).then(function(d){
				_userData.login = null;
				_userData.group = null;
				$location.url('/login');
			}).catch(function(d){ // Enter unvalid data at form (major send no data)
				_userData.login = null;
				_userData.group = null;
				$location.url('/login');
			});
			*/

			// Fake code:
			_userData.login = null;
			_userData.group = null;
			$location.url('/login');
		},
		get: function(){
			return _userData;
		},
		// TODO
		set: function(){
			if(arguments.length == 2){
				_userData[arguments[0]] = arguments[1];
			}else if(arguments.length == 1){
				// Object.assign()
				// TODO
			}
		}
	};
}]);


log_app.directive('loginForm', function counter() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		bindings: {},
		controller: ['$scope','$element','$attrs', 'UserProfile', function($scope, $e, $attrs, $profile){
			this.authorizationFailed = false;
		    this.onsubmit = function(onFail){
				$profile.login({
					login: this.formLogin,
					password: this.formPassword,
					remember: this.formRemember
				}, onFail);
			};
			this.focusOnLogin = function(){
				$scope.$broadcast('focusOnLogin');
			};
		}],
		link: function($s, $e, attrs, $c) {
		    $c.focusOnLogin();
		    $e.bind('submit', function(e){
		    	e.preventDefault();
		    	$e.attr('disabled', true);
		    	$c.authorizationFailed = false;
		    	$e.attr('disabled', true);
				$c.onsubmit(function(){
					$e.attr('disabled', false);
					$c.focusOnLogin();
					$c.authorizationFailed = true;
				});
		    });
		    // Example: how to add native event listeners
			// $e.bind('reset', function(e){
			// 	e.preventDefault();
			// 	console.log('Native RESET');
			// 	console.dir(e);
			// });
		},
		controllerAs: 'form',
		template: 
		'<form class="loginform">' +
			'<div class="errormes" ng-show="form.authorizationFailed">' + VOC.error_incorrect_credentials + '</div>' +
			'<div class="login-form_row">' +
				'<input type="text" ng-model="form.formLogin" required focus-on="focusOnLogin"/>' +
			'</div>' +
			'<div class="login-form_row">' +
				'<input type="password" ng-model="form.formPassword" required/>' +
			'</div>' +
			'<div>' +
				'<label class="login-form_halfspace">' +
					'<input type="checkbox" ng-model="form.formRemember" class="h-vertical"/>' +
					'<span class="h-vertical">' + VOC.remember + '</span>' +
				'</label>' +
				'<button type="submit" class="login-form_halfspace">' + VOC.login + '</button>' +
			'</div>' +
		'</form>'
	};
});

log_app.directive('focusOn', function(){
	return function(scope, elem, attr){
		scope.$on(attr.focusOn, function(e){
			elem[0].focus();
		});
	};
});