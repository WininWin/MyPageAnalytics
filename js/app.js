var app = angular.module('mymind',['appControllers','FBServices','ui.router', 'ngMaterial','nvd3', 'angular-jqcloud']);

app.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
   $mdThemingProvider.theme('default')
    .primaryPalette('light-blue', {
      'default': '400',
      'hue-1': '900',
      'hue-2' : '600'
    })
    .accentPalette('light-green', {
      'default': '800',
      'hue-1': '400'
    })
    .warnPalette('red', {
      'default': '600'
    })
    .backgroundPalette('grey', {
      'default': 'A100'
    });


$urlRouterProvider.otherwise('/');
 
  $stateProvider
    .state('app',{
      url: '/',
      views: {
        'header': {
          templateUrl: 'partials/header.html'
        },
        'main': {
          templateUrl: 'partials/login.html' 
        },
        'footer': {
          templateUrl: 'partials/footer.html'
        }
      }
    })

    .state('app.main', {

      url: 'main',
      views:{
        'main@' : {
          templateUrl: 'partials/main.html'
        }
      }

    })

     .state('app.privacy', {

      url: 'privacy',
      views:{
        'main@' : {
          templateUrl: 'partials/privacyinfo.html'
        }
      }

    })



    ;
  }]);

app.run(['$rootScope', '$window','$state',
  function($rootScope, $window, $state) {

     $rootScope.user = {};

   function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.

      FB.api('/me', function(response) {
          $rootScope.user.name = response.name;
     
           $state.go('app.main');
      });

  
   

    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.


  

  $window.fbAsyncInit = function() {
    // Executed when the SDK is loaded

    FB.init({

      /*
       The app id of the web app;
       To register a new app visit Facebook App Dashboard
       ( https://developers.facebook.com/apps/ )
      localtest : 877976802338807
      hosttest : 783986768404478
      test3 : 893074757495678 for remove use less permission

      */

      appId: '783986768404478',

      /*
       Set if you want to check the authentication status
       at the start up of the app
      */

      //status: true,

      /*
       Enable cookies to allow the server to access
       the session
      */

      cookie: true,

      /* Parse XFBML */

      xfbml: true,

      version    : 'v2.8'
    });

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };


//future use 
// (function(window, nextTick, process, prefixes, i, p, fnc) {
//     p = window[process] || (window[process] = {});
//     while (!fnc && i < prefixes.length) {
//         fnc = window[prefixes[i++] + 'equestAnimationFrame'];
//     }
//     p[nextTick] = p[nextTick] || (fnc && fnc.bind(window)) || window.setImmediate || window.setTimeout;
// })(window, 'nextTick', 'process', 'r webkitR mozR msR oR'.split(' '), 0);

  (function(d){
    // load the Facebook javascript SDK

    var js,
    id = 'facebook-jssdk',
    ref = d.getElementsByTagName('script')[0];

    if (d.getElementById(id)) {
      return;
    }

    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/sdk.js";

    ref.parentNode.insertBefore(js, ref);

  }(document));


}]);
