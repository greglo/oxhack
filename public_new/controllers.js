'use strict';

angular.module('noDJ').
controller('mainCtrl', ['$scope', '$timeout', '$rootScope', '$routeParams', '$location', 'MusicQueue',
	function($scope, $timeout, $rootScope, $routeParams, $location, MusicQueue) {
		if ($routeParams.roomId === 'new') {
			return $.post("/rooms", function(data) {
				$timeout(function() {
					$rootScope.roomId = data.roomId;
					$location.path('/' + data.roomId);
				});
		    });
		}

		$rootScope.roomId = $routeParams.roomId;
		$rootScope.currentTrack = null;
		$rootScope.queue = [];
		MusicQueue.update();

		$scope.queueSorter = function(item) {
			return -(item.upvotes-item.downvotes);
		};

		$scope.isPlaying = false;
		$scope.showPlayer = true;
		$scope.youtubeVideoId = '';
		$scope.youtubePlayerVars = {
			controls: 0
		};

		// https://github.com/brandly/angular-youtube-embed
		$scope.$on('youtube.player.ready', function($event) {
			console.log('player is ready')
			$scope.playClicked();
		});
		$scope.$on('youtube.player.ended', function($event) {
			console.log('current song ended')
			$scope.nextClicked();
		});

		$scope.playClicked = function() {
			if ($scope.youtubePlayer) {
				$scope.youtubePlayer.playVideo();
				$scope.isPlaying = true;
			}
			else {
				$scope.nextClicked();
			}
		};
		$scope.pauseClicked = function() {
			if ($scope.youtubePlayer) {
				$scope.youtubePlayer.pauseVideo();
				$scope.isPlaying = false;
			}
		};
		$scope.nextClicked = function() {
			MusicQueue.playNext();
		};

		// progress bar
		setInterval(function() {
			$timeout(function() {
				if ($scope.youtubePlayer) {
					$scope.currentTime = $scope.youtubePlayer.getCurrentTime();
					$scope.duration = $scope.youtubePlayer.getDuration();
				}
			});
		}, 200);

		// sync with server
		setInterval(function() {
			MusicQueue.update();
		}, 1000);

		$rootScope.$watch('currentTrack', function(newValue, oldValue) {
			console.log(oldValue + ' -> ' + newValue);
			console.dir(newValue);
			if (newValue) {
				$scope.youtubeVideoId = newValue.id;
				console.log('set id: ' + newValue.id);
			}
		});
	}
]);