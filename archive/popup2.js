var app = angular.module('abook', []);

/*
Attention: add strict mode
myApp.config(function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
});
That tweak disables appending scope to elements, making scopes inaccessible from the console. The second one can be set as a directive:

<html ng-app=“myApp” ng-strict-di>
*/

app.factory('dataSource', ['$http', function($http){
	return {
		getLogin: function(next){
			var 	data;

			if(_rand.bool()){
				data = {
					login: 'mr. ' + _rand.string(5),
					group: 'user',
				};
			}
			
			next(data);
		},
		login: function(next){
			next({
				login: 'mr. ' + _rand.string(5),
				group: 'user',
			});
		},
		logout: function(next){
			next(null);
		},
	};
}]);
app.factory('popupBus', function(){
	return {
		_handlers: {},
		add: function(conf){
			var addHandlers = this._handlers['add'];
			
			if(Array.isArray(addHandlers)){
				for(var i = 0, len = addHandlers.length; i < len; i++){
					addHandlers[i](conf);
				}
			}
		},
		subscribe: function(eventName, cb){
			if(!Array.isArray(this._handlers[eventName])){
				this._handlers[eventName] = [];
			}
			
			this._handlers[eventName].push(cb);
		}
	};
});

// Widget for modal dialogues - popup
app.controller('popups', ['$scope', '$element', 'popupBus', function ($scope, $element, $popups) {
	$scope.collection = [];
	
	// create new popup by signal from popupBus
	$popups.subscribe('add', function(conf){
		$scope.collection.push(conf);
	});
	
	// to close popup
	$scope.closePopup = function(popupData){
		console.log('[closePopup]');

		var pos = $scope.collection.indexOf(popupData);
		
		if(~pos){
			$scope.collection.splice(pos, 1);
		}
	}
}]);

// http://jsfiddle.net/STEVER/8e59shvc/
// Example fof component
app.component('counterCom', {
  bindings: {
    count: '='
  },
  // Attention: this function can be changed on Class!
  controller: function(){ 
    function increment() {
      this.count++;
    }
    function decrement() {
      this.count--;
    }
    this.increment = increment;
    this.decrement = decrement; 
  }, // {{$ctrl.x}}
  template: 
  '<div class="todo">' +
    '<input type="text" ng-model="$ctrl.count">' +
    '<button type="button" ng-click="$ctrl.decrement();">-</button>' +
    '<button type="button" ng-click="$ctrl.increment();">+</button>' +
  '</div>'
});
// Example of directive
app.directive('counterDir', function counter() {
  return {
    scope: {

    },
    bindToController: {
      count: '='
    },
    controller: function(){
      this.increment = function increment(){
        this.count++;
      };
      this.decrement = function decrement() {
        this.count--;
      };
    },
    controllerAs: 'counter',
    template: [
      '<div class="todo">',
        '<input type="text" ng-model="counter.count">',
        '<button type="button" ng-click="counter.decrement();">-</button>',
        '<button type="button" ng-click="counter.increment();">+</button>',
      '</div>'
    ].join('')
  };
});

//====================================
// loginForm
//====================================
app.component('loginForm', {
  bindings: {
    count: '=',
    profile: '=',
  },
  controller: class{
  	constructor(){

  	}
  	submit(){
  		console.log('Submit');
    	console.dir(arguments);
    	console.dir(this)		
  	}
  	reset(){
  		console.log('Reset');
    	console.dir(arguments);
    	console.dir(this)		
  	}
  },
  link: function(scope, element, attrs, ngModelCtrl) {
  	console.log('LoginForm==');
    console.log(ngModelCtrl);
    scope.disabled = true;
  },
  template: // {{$ctrl.x}}
  '<form class="loginform" ng-submit="$ctrl.submit()" ng-reset="$ctrl.reset()">' +
    // '<input type="text" ng-model="$ctrl.count">' +
    '<div>' +
    	'<input type="text" ng-model="$ctrl.formLogin"/>' +
    '</div>' +
    '<div>' +
    	'<input type="password" ng-model="$ctrl.formPassword"/>' +
    '</div>' +
    '<div>' +
    	'<label>' +
    		'<input type="checkbox" ng-model="$ctrl.formRemember"/>' +
    		'remember' +
    	'</label>' +
    	'<button type="submit">Submit</submit>' +
    	'<button type="reset">Reset</submit>' +
    '</div>' +
  '</form>'
});









// Popup wrapper (get content from controller)
app.directive('abookPopupWrap', function ($compile) {
//	`content` and `config` attributes would be shared to child directives!
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			'close': '&onClose',
			'content': '=content',
			'config': '=config',
			'tests': '=tests',
		},
		template: 
		'<div class="popup-wrap">' +
			'<div class="popup-inner">' +
				'<div class="popup-close"><div ng-click="close()">[X]</div></div>' +
				'<div data-co="content"></div>' +
			'</div>' +
		'</div>',
		link: function (scope, elem, attr){
			var contentSource = $compile(scope.content)(scope);
			var inner = elem[0].querySelector('[data-co=content]');
			
			if(inner && contentSource[0]){
				inner.appendChild(contentSource[0]);
			}
			// also can listen on `elem`
			// scope.$on('$destroy', function(){
				// // ...
			// });

			console.log('Popup link');
			console.dir(scope);
			console.dir(contentSource);
		},
	}
});

app.controller('DevController', ['$scope', 'dataSource', 'popupBus', function BookController($scope, dataSource, $popups){
	$scope.openPopup = function(){
		$popups.add({
			content:
				'<form>' + 
					'<input type="text"/>'  +
					'<button ng-click="onNewPopup()" data-co="openNew">Open popup</button>' +
					'<div>' +
						'<button type="submit">Apply</button>' +
						'<button type="reset">Cancel</button>' +
					'</div>' +
					'<counter-dir count="5"></counter-dir>' +
					'<counter-com count="4"></counter-com>' +
					'<div class="test"></div>' +
				'</form>',
			config: {
				button: 'Add',
				onsubmit: function(name, tel){
					console.log('Submit');
					console.dir($cope);
			
				},
				events: {
					'onclick [data-co="openNew"]': function(){
						console.log('Open New');
					}
				},
				extraScope: {
					'11': 11,
				}
			},
			tests: {
				'onclick [data-co="openNew"]': function(){
					console.log('Open New');
				}
			},
			
		});
	};
}]);


// TODO try to chanege at class 
app.controller('UserController', ['$scope', 'UserProfile', 'popupBus',  function BookController($scope, $profile, $popups){
	// $scope.profile = {};

	$scope.profile = $profile.get();	

	$profile.checkAutorization(function(d){
		console.log('Login');
		console.dir(d);
		$scope.profile = d || {};
	});

	$scope.login = function(){
		$profile.login({
			login: 'mr. ' + _rand.string(5),

		}, function(d){
			$scope.profile = d;
		});
	}
	$scope.logout = function(){
		$profile.logout(function(){
			// $scope.profile = null;
		});		
	}

	
}]);


/*

TODO: create setters for that

		// _userData = {
		// 	login: conf.login,
		// 	group: 'user',
		// };
		_userData.login = conf.login;
		_userData.group = 'user';



*/
// Both initialized one time!
// return singleton
app.factory('testFactory', function TestFactory(){
	console.log('Init testFactory');
	console.dir(this);

	return {
		method: function(){}
	}
})
// return instance of class!
app.service('testService', function TestService(){
	console.log('Init testService');
	console.dir(this);
	this.method = function(){

	}
})


//===========================================
// UserProfile - shared store to profile data
//=========================================
app.factory('UserProfile', ['$http', function UserProfile($http){
	console.log('INIT UserProfile');
	console.dir(this)
	var _userData = {};

	return {
		checkAutorization: function(next){
			if(_rand.bool()){
				_userData = {
					login: 'mr. ' + _rand.string(5),
					group: 'user',
				};
			}
			
			next(_userData);
		},
		// @param conf.login
		// @param conf.password
		// @param conf.remember
		login: function(conf, next){
			// TODO change on set
			_userData.login = conf.login;
			_userData.group = 'user';
			next(_userData);
		},
		logout: function(next){
			// TODO request
			// _userData = {};
			_userData.login = null;
			_userData.group = null;
			next(null);
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


app.directive('loginForm2', function counter() {
  return {
  	restrict: 'EA',
  	transclude: true,
    scope: {},
	bindings: {
	    view: '<',
	    _login: '<',
	},
    controller: ['$scope','$element','$attrs', 'UserProfile', 'testFactory', function($scope, $e, $attrs, $profile, $t1, $t2){
    	console.group();
    	console.log('[Conroller loginForm2]');
    	console.dir($scope);
    	console.dir($e);
    	console.dir($attrs);
    	console.dir($profile);
    	console.groupEnd();
        this.getForm = function() {
            return $scope[$attrs['ngForm']];
        }
        this.submit = function(){
	    	console.log('Submit2');
	    	console.group();
	    	console.dir(this);
	    	console.dir($scope);
	    	console.dir($e);
	    	console.dir($attrs);
	    	console.dir($profile);
	    	console.groupEnd();
	    	$profile.login({
				login: 'mr. ' + _rand.string(5),

			}, function(d){
				// TODO solve problem with
				// $scope.profile = d;
			});
	    };
	    // Example: how to add native event listeners
	    // $e.bind('reset', function(e){
	    // 	e.preventDefault();
	    // 	console.log('Native RESET');
	    // 	console.dir(e);
	    // });
    }],
    bindToController: {
       form: '=',
       profile: '=',
    },
    link: function(scope, $e, attrs, ngModelCtrl) {
	  	console.log('LoginForm2==');
	    console.log(arguments);
	    scope.disabled = true;
	    // $e.bind('submit', function(e){
	    // 	e.preventDefault();
	    // 	console.log('Native SUBMIT');
	    // 	console.dir(e);
	    // 	console.dir(this);
	    // });
	},
    controllerAs: 'form',
    template: 
    '<form class="loginform" ng-submit="form.submit()">' +
	    '<div>' +
	    	'<input type="text" ng-model="form.formLogin"/>' +
	    '</div>' +
	    '<div>' +
	    	'<input type="password" ng-model="form.formPassword"/>' +
	    '</div>' +
	    '<div>' +
	    	'<label>' +
	    		'<input type="checkbox" ng-model="form.formRemember"/>' +
	    		'remember' +
	    	'</label>' +
	    	'<button type="submit">Login</submit>' +
	    '</div>' +
	  '</form>'
  };
});