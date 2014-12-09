'use strict';

angular.module('noDJ', [
  'ngRoute',
  'youtube-embed'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
	//$locationProvider.html5Mode(true);
	$routeProvider.
	when('/:roomId', {
		templateUrl: 'main.html'
	}).
	otherwise({
		redirectTo: '/new'
	});
}]);
