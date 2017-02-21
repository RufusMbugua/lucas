var PATH = {
  _modules:'app/retsu/',
  _globals:'app/yon/'
}

var VIEW ={
  _modules:function(path){
    return PATH._modules+path+'.tpl.html'
  },
  _globals:function(path){
    return PATH._globals+path+'.tpl.html'
  }
}

angular.module("unohana", [
  'ui.router',
  'restangular',
  'smart-table',
  'textAngular',
  'angularMoment',
  'ui.bootstrap',
  'highcharts-ng',
  'slick',
  'mgo-angular-wizard',
  'permission',
  'LocalStorageModule',
  'angularValidator',
  'btford.socket-io',
  'angular-loading-bar',
  'retsu.questions',
  'retsu.users',
  'retsu.admin',
  'retsu.surveys'
]);


/**
 * @ngdoc run
 * @name Main
 * @requires $http
 * @requires $rootScope
 * @memberof ClientApp
 */
angular.module("unohana").run(['$http', '$rootScope', '$state','localStorageService', function($http,
  rootScope,
  state,localStorageService) {
  rootScope.date = new Date();
  rootScope.title = 'KE.scrow';
  rootScope.messages = [];
  rootScope.menu = [];
  rootScope.errors = [];
  rootScope.state = state;
  if(localStorageService.get('user')){
    rootScope.user = localStorageService.get('user')
  }
}]);

angular.module("unohana").controller('appCtrl', ['$location', function(
  $location) {
    console.log('Hello');
}]);

/**
 * @ngdoc directive
 * @name isActiveNav
 * @param $location
 * @memberof ClientApp
 */
angular.module("unohana").directive('isActiveNav', ['$location', function(
  $location) {
  return {
    restrict: 'A',
    link: function(scope, element) {
      scope.location = $location;
      scope.$watch('location.path()', function(currentPath) {
        if ('#' + currentPath == element[0].hash) {
          element.parent().addClass('active');
        } else {
          element.parent().removeClass('active');
        }
      });
    }
  };
}]);

/**
 * @ngdoc directive
 * @name isActiveLink
 * @param $location
 * @memberof ClientApp
 */
angular.module("unohana").directive('isActiveLink', ['$location', function(
  $location) {
  return {
    restrict: 'A',
    link: function(scope, element) {
      scope.location = $location;
      scope.$watch('location.path()', function(currentPath) {
        if ('#' + currentPath == element[0].hash) {
          element.addClass('active');
        } else {
          element.removeClass('active');
        }
      });
    }
  };
}]);

/**
 * @ngdoc config
 * @name mainRouteConfig
 * @memberof ClientApp
 * @param $stateProvider {service}
 * @param $urlRouterProvider {service}
 */
 angular.module("unohana").config(function($stateProvider, $urlRouterProvider) {
   $urlRouterProvider.otherwise("/login");
 });

angular.module('retsu.admin',[]).controller('adminCtrl', ['$scope', 'Requests',
  '$state',
  function(scope, Requests, state) {
  }
])

angular.module('retsu.admin').config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('admin', {
    url: '/admin',
    views: {
      '': {
        controller: 'adminCtrl',
        templateUrl: VIEW._modules('admin/admin.main')
      },
      'admin.header@admin':{
        templateUrl: VIEW._modules('admin/admin.header')
      },
      'admin.sidebar@admin':{
        templateUrl: VIEW._modules('admin/admin.sidebar')
      }
    }
  }).
  state('admin.dashboard', {
    url: '/dashboard',
    views: {
      '': {
        templateUrl: VIEW._modules('admin/admin.dashboard')
      }
    }
  })
});

angular.module('retsu.surveys',[]).controller('surveysCtrl', ['$scope', 'Requests',
'$state','$rootScope',
function(scope, Requests, state,rootScope) {
  scope.survey={};
  scope.filterOptions = ['Date', 'Tags'];
  get();
  get_options();

  function get() {
    var payload = {};
    Requests.get('surveys', payload, function(data) {
      scope.surveys = data;
    });
  }

  function get_options(){
    scope.options =[
      {
        id:1,
        name:'Radio'
      },
      {
        id:2,
        name:'Select One'
      },
      {
        id:3,
        name:'Select Many'
      },
      {
        id:4,
        name:'Text Field'
      },
      {
        id:5,
        name:'Large Text Field'
      },
      {
        id:6,
        name:'DatePicker'
      },
      {
        id:7,
        name:'Checkbox'
      }
    ]
  }

  scope.add = function add() {
    var payload = scope.survey;
    payload.user_id = rootScope.user.id;
    Requests.post('surveys', payload, function(data) {
      if(data.success){
        get();
        state.go('admin.surveys.list')
      }
    });
  }
  scope.edit = function edit() {
    var payload = scope.survey;
    Requests.put('surveys/' + payload.id, payload, function(data) {
      if(data.success){
        state.go('admin.surveys.list')
      }
    });
  }

  scope.view = function view(survey) {
    scope.survey = survey;
    console.log(survey);
    state.go('admin.surveys.build')
  }

  scope.addQuestion = function addQuestion(section){
    var question = {
      description:"",
      option_type:"",
      options:""
    }
    section.questions.push(question)
  }

  scope.addSection = function addSection(sections){
    var section = {
      name:'Section ...',
      questions:[]
    }
    sections.push(section)
  }

  scope.build = function build(){
    state.go('admin.surveys.view')
  }

  scope.store = function store(){
    buildSurvey();
  }

  function buildSurvey(){
    survey = scope.survey;

    angular.forEach(scope.survey.sections,function(v){
      v.survey_id = scope.survey.id;
      v.order = v.$index;
      Requests.post('sections', v, function(data) {
        sectionData = data;
        if(data.success){

          angular.forEach(v.questions,function(question){

            Requests.post('questions', question, function(data) {
              if(data.success){
                questionData = data;


                Requests.post('options', question.options, function(d) {
                  optionData = data;

                  if(data.success){
                    questionCurrent = {question_id:questionData.id,section_id:sectionData.id}
                    Requests.post('questioncurrent', data, function(d) {
                      if(data.success){


                      }
                    });

                  }
                });

              }
            });

          })

        }
      });

    });

  }

}
])


angular.module('retsu.surveys').directive('sTable', function() {
  return {
    // transclude: true,

    templateUrl: VIEW._modules('surveys/surveys.table'),
    link: function(scope, element) {
      // Add Attributes

      element.find('table').addClass(
        'table table-bordered table-condensed')
      element.find('input').addClass('form-control')
    }
  };
});

angular.module('retsu.surveys').directive('sDash', function() {
  return {
    // transclude: true,

    templateUrl: VIEW._modules('surveys/surveys.dash'),
    link: function(scope, element) {
      // Add Attributes


    }
  };
});


angular.module('retsu.surveys').config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('admin.surveys', {
    url: '/surveys',
    views: {
      '': {
        controller: "surveysCtrl",
        templateUrl: VIEW._modules('surveys/surveys.main')
      }
    }
  }).
  state('admin.surveys.dashboard', {
    url: '/dashboard',
    views: {
      '': {
        template: '<s-dash></s-dash>'
      },
      'surveys-total-widget@admin.surveys.dashboard': {
        templateUrl: VIEW._modules('surveys/surveys.widget.total')
      },
      'surveys-actions-widget@admin.surveys.dashboard': {
        templateUrl: VIEW._modules('surveys/surveys.widget.actions')
      },
    }
  }).
  state('admin.surveys.list', {
    url: '/list',
    template: '<s-table st-table="surveys"></s-table>'
  }).
  state('admin.surveys.add', {
    url: '/add',
    templateUrl: VIEW._modules('surveys/surveys.add')
  }).
  state('admin.surveys.build', {
    url: '/build',
    templateUrl: VIEW._modules('surveys/surveys.build')
  }).
  state('admin.surveys.view', {
    url: '/view',
    templateUrl: VIEW._modules('surveys/surveys.view')
  }).
  state('admin.surveys.start', {
    url: '/start',
    templateUrl: VIEW._modules('surveys/surveys.start')
  })
});

angular.module('retsu.questions',[]).controller('questionsCtrl', ['$scope', 'Requests',
  '$state',
  function(scope, Requests, state) {
    scope.responses = []
    scope.question = {};
    scope.questions = [];
    scope.currentQuestion = {"xwcwcwc":"cwcw"};

    scope.filterOptions = ['Date', 'Tags'];
    get();
    get_options();

    function get() {
      var payload = {};
      Requests.get('questions', payload, function(data) {
        scope.questions = data;
      });
    }

    function get_options(){
      scope.options =[
        {
          id:1,
          name:'Radio'
        },
        {
          id:2,
          name:'Select'
        },
        {
          id:3,
          name:'Text Field'
        },
        {
          id:4,
          name:'Large Text Field'
        },
        {
          id:5,
          name:'DatePicker'
        }
      ]
    }

    scope.add = function add() {
      var payload = scope.question;
      Requests.post('questions', payload, function(data) {
        if(data.success){
          get();
          state.go('admin.questions.list')
        }
      });
    }
    scope.edit = function edit() {
      var payload = scope.question;
      Requests.put('questions/' + payload.id, payload, function(data) {
        if(data.success){
          state.go('admin.questions.list')
        }
      });
    }

    scope.view = function view(question) {
      console.log(question)
      scope.currentQuestion = question;
      state.go('admin.questions.view')
    }
  }
])


angular.module('retsu.questions').directive('qTable', function() {
  return {
    // transclude: true,

    templateUrl: VIEW._modules('questions/questions.table'),
    link: function(scope, element) {
      // Add Attributes

      element.find('table').addClass(
        'table table-bordered table-condensed')
      element.find('input').addClass('form-control')
    }
  };
});

angular.module('retsu.questions').directive('qDash', function() {
  return {
    // transclude: true,

    templateUrl: VIEW._modules('questions/questions.dash'),
    link: function(scope, element) {
      // Add Attributes


    }
  };
});


angular.module('retsu.questions').config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('admin.questions', {
    url: '/questions',
    views: {
      '': {
        controller: "questionsCtrl",
        templateUrl: VIEW._modules('questions/questions.main')
      }
    }
  }).
  state('admin.questions.dashboard', {
    url: '/dashboard',
    views: {
      '': {
        template: '<q-dash></q-dash>'
      },
      'questions-total-widget@admin.questions.dashboard': {
        templateUrl: VIEW._modules('questions/questions.widget.total')
      },
      'questions-responses-widget@admin.questions.dashboard': {
        templateUrl: VIEW._modules('questions/questions.widget.responses')
      },
      'questions-recent-widget@admin.questions.dashboard': {
        templateUrl: VIEW._modules('questions/questions.widget.recent')
      },
      'questions-actions-widget@admin.questions.dashboard': {
        templateUrl: VIEW._modules('questions/questions.widget.actions')
      },
      'questions-frequency-widget@admin.questions.dashboard': {
        templateUrl: VIEW._modules('questions/questions.graph.frequency')
      }
    }
  }).
  state('admin.questions.list', {
    url: '/list',
    template: '<q-table st-table="questions"></q-table>'
  }).
  state('admin.questions.add', {
    url: '/add',
    views:{
      '':{
        templateUrl: VIEW._modules('questions/questions.add')
      },
      'questions-total-widget@admin.questions.add': {
        templateUrl: VIEW._modules('questions/questions.widget.total')
      },
    }

  }).
  state('admin.questions.view', {
    url: '/view',
    views: {
      '': {
        templateUrl: VIEW._modules('questions/questions.view')
      },
      'questions-widget-single-responses@admin.questions.view': {
        templateUrl: VIEW._modules('questions/questions.widget.single.responses')
      },
      'questions-widget-single-recent@admin.questions.view': {
        templateUrl: VIEW._modules('questions/questions.widget.single.recent')
      },
      'questions-graph-single-frequency@admin.questions.view': {
        templateUrl: VIEW._modules('questions/questions.graph.single.frequency')
      },
      'questions-graph-single-responses@admin.questions.view': {
        templateUrl: VIEW._modules('questions/questions.graph.single.responses')
      },
      'questions-graphic-distribution@admin.questions.view': {
        templateUrl: VIEW._modules('questions/questions.graphic.distribution')
      },
      'questions-widget-single-actions@admin.questions.view': {
        templateUrl: VIEW._modules('questions/questions.widget.single.actions')
      }
    }
  })
});

angular.module('retsu.users',[]).controller('usersCtrl', ['$scope', 'Requests',
  '$state','$rootScope','localStorageService',
  function(scope, Requests, state,rootScope,localStorageService) {
    scope.user = {};

    scope.filterOptions = ['Date', 'Tags'];

    function get() {
      var payload = {};
      Requests.get('questions', payload, function(data) {
        scope.questions = data.success.data;
      });
    }

    scope.add = function add() {
      var payload = scope.question;
      Requests.post('questions', payload, function(data) {
        if(data.success){
          state.go('admin.questions.list')
        }
      });
    }

    scope.login = function login() {
      var payload = scope.user;
      Requests.post('auth', payload, function(data) {
        if(data.success){
          scope.user = data.user;
          rootScope.user = scope.user;
          localStorageService.set('user',rootScope.user)
          state.go('admin.questions.dashboard')
        }

      });
    }

    scope.edit = function edit() {
      var payload = scope.question;
      Requests.put('questions/' + payload.id, payload, function(data) {
        scope.question = data.success.data;
      });
    }

    scope.view = function view(question) {
      scope.currentQuestion = question;
      state.go('questions.view')
    }
  }
])

angular.module('retsu.users').config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('users', {
    url: '/users',
    views: {
      '': {
        templateUrl: 'app/questions/questions.main.tpl.html'
      }
    }

  }).
  state('login', {
    url: '/login',
    views: {
      '': {
        controller: 'usersCtrl',
        templateUrl: 'app/retsu/users/users.login.tpl.html'
      }
    }
  })
});

angular.module('unohana').factory('ArrayHelper', function() {

  var ArrayHelper = {};

  ArrayHelper.clean = function clean(data) {
    var defaults = [
      'createdAt', 'updatedAt', 'created_at', 'updated_at'
    ];

    angular.forEach(data, function(value, key) {
      angular.forEach(value, function(v, k) {
        value.prop(k);
      })
    });
    return data;
  }

  return ArrayHelper;
});

angular.module("unohana").factory('errorInterceptor', ['$q', '$log',
  '$rootScope', '$timeout',
  '$injector',
  function(q, log, rootScope, timeout, injector) {
    rootScope.error = null;
    return {
      // optional method
      'requestError': function(rejection) {
        // do something on error
        if (canRecover(rejection)) {
          return responseOrNewPromise
        }
        return $q.reject(rejection);
      },
      // optional method
      'response': function(response) {
        if (response.data.success) {
          var success = {
            "icon": "ion-check",
            "type": "success",
            "code": response.status,
            "msg": response.statusText,
            "message": response.data.message
          };
          rootScope.success = success;
          rootScope.showSuccess = true;
          timeout(function() {
            rootScope.showSuccess = false;
          }, 2000);
        }
        return response;
      },


      // optional method
      'responseError': function(response) {
        console.log(response);
        if (!response.data.success) {
          var error = {
            "icon": "ion-android-alert",
            "type": "danger",
            "code": response.status,
            "msg": response.statusText,
            "message": response.data.message
          };
          rootScope.error = error;
          rootScope.showError = true;
          timeout(function() {
            rootScope.showError = false;
          }, 3000);

          // do something on error
          var stateService = injector.get('$state');
          if (response.status == 401) {
            timeout(function() {
              stateService.go('login');
            }, 3000)
          }
        }
        return q.reject(response);
      }
    }
  }
]);

angular.module("unohana").config(['$httpProvider', function(httpProvider) {
  httpProvider.interceptors.push('errorInterceptor');
}]);

angular.module('unohana').factory('Requests', ['$http', '$rootScope', function(
  http, rootScope) {
  var Requests = {};
  Requests.data = [];
  Requests.post_data = []
  var base_url = "api/";
  var url = null;

  /**
   * Post Data
   * @param  {[type]} resource [description]
   * @param  {[type]} object   [description]
   * @return {[type]}          [description]
   */
  Requests.post = function post(resource, object, callBack) {
    var request_url = '';
    if (object.top_level) {
      request_url = resource;
    } else {
      request_url = base_url + resource;
    }
    var req = {
      method: 'POST',
      url: request_url,
      data: object
    };

    /**
     * Check if Post Data exists
     * @param  {[type]} object [description]
     * @return {[type]}        [description]
     */

    if (object) {
      http(req)
        .success(function(data) {
          //this is the key
          callBack(data);
        })
        .error(function(data, response) {
          console.log(response + " " + data);
        });;
    }
  }

  /**
   * @description Put Data
   * @param resource
   * @param object
   * @param callBack
   */
  Requests.put = function put(resource, object, callBack) {

    var req = {
      method: 'PUT',
      url: base_url + resource,
      data: object
    };

    /**
     * Check if Post Data exists
     * @param  {[type]} object [description]
     * @return {[type]}        [description]
     */
    if (object) {
      http(req)
        .success(function(data) {
          //this is the key
          callBack(data);
        })
        .error(function(data, response) {
          console.log(response + " " + data);
        });;
    }
  }

  Requests.destroy = function destroy(resource, object, callBack) {

    var req = {
      method: 'DELETE',
      url: base_url + resource,
      data: object
    };

    /**
     * Check if Post Data exists
     * @param  {[type]} object [description]
     * @return {[type]}        [description]
     */
    if (object) {
      http(req)
        .success(function(data) {
          //this is the key
          callBack(data);
        })
        .error(function(data, response) {
          console.log(response + " " + data);
        });;
    }
  }


  /**
   * [get description]
   * @return {[type]} [description]
   */
  Requests.get = function get(resource, object, callBack) {
    var req;
    var request_url = '';
    if (object.top_level) {
      request_url = resource;
      delete(object.top_level);
    } else {
      request_url = base_url + resource;
    }
    req = {
      method: 'GET',
      url: request_url,
      headers: {
        'Content-Type': 'application/json'
      },
      params: object
    };

    http(req)
      .success(function(data) {
        //this is the key
        callBack(data);
      })
      .error(function(data, response) {
        console.log(response + " " + data);
      });;
  }
  return Requests;
}])
