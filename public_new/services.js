'use strict';

angular.module('noDJ').
service('SearchSong', ['$http', function($http) {
	return function(query, cb) {
		$http({
			method: 'GET',
			url: 'https://www.googleapis.com/youtube/v3/search',
			params: {
				key: 'AIzaSyAi-zSFThCDRGmvv5SQPIqo5m0GnYzGVxw',
				part: 'id,snippet',
				q: query,
				safeSearch: 'none',
				type:'video',
				category: 'music',
				videoEmbeddable: 'true',
				videoSyndicated: 'true',
				maxResults: 5
			}
		}).success(function(data) {
			var res = data.items;
			console.log(res);
			res = res.map(function(item) {
				return {
					id: item.id.videoId,
					title: item.snippet.title,
					thumbnail_small: item.snippet.thumbnails.medium.url,
					thumbnail: item.snippet.thumbnails.high.url
				};
			});
			cb(undefined, res);
		}).error(function(err) {
			cb(err);
		});
	};
}]).
service('MusicQueue', ['$rootScope', '$timeout', '$http',
	function($rootScope, $timeout, $http) {
		function updateScope(data) {
			$timeout(function() {
				$rootScope.queue = data.queue;
				$rootScope.currentTrack = data.currentTrack;
				if (!$rootScope.currentTrack)
					playNext();

			});
		}
		function update() {
			$http.get('/rooms/' + $rootScope.roomId).success(updateScope);
		}
		function addTrack(track) {
			$http({
				method: 'POST',
				url: '/rooms/' + $rootScope.roomId + '/tracks',
				data: {
					id: track.id,
					name: track.title,
					artist: track.title,
					album: track.title,
					thumbnail: track.thumbnail
				},
			}).success(updateScope);
		}
		function playNext() {
			$http.post('/rooms/' + $rootScope.roomId + '/playNext').success(updateScope);
		}
		function upvote(id) {
			$http({
				method: 'POST',
				url: '/rooms/' + $rootScope.roomId + '/tracks/' + id + '/upvote',

			}).success(updateScope);
		}
		function downvote(id) {
			$http({
				method: 'POST',
				url: '/rooms/' + $rootScope.roomId + '/tracks/' + id + '/downvote',

			}).success(updateScope);
		}
		return {
			update: update,
			addTrack: addTrack,
			playNext: playNext,
			upvote: upvote,
			downvote: downvote
		};
	}
]);