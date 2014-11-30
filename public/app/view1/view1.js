'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {
	$scope.queue = [
		{
			name      : 'Yellow Submarine',
			artist    : "The Beatles",
			album    : "No idea",
			thumbnail : "http://www.avsforum.com/photopost/data/2277869/9/9f/9f50538d_test.jpeg",
			votes: 0
		},
		{
			name      : 'Yellow Submarine2',
			artist    : "The Beatles",
			album    : "No idea",
			thumbnail : "http://www.avsforum.com/photopost/data/2277869/9/9f/9f50538d_test.jpeg",
			votes: 0
		}
	];
	$scope.queueSorter = function(item) {
		return -parseInt(item.votes, 10);
	}
	$scope.vote = function(item, delta) {
		item.votes += delta;
	};

	$scope.roomId = null;
    $scope.currentTrack = null;

	$.getJSON("/rooms", function(data) {
          $scope.roomId = data.roomId;

          //$(".overlay").hide()

    });

	var player = null;

	var play = function(trackName, artistName) {
	    if (player != null) {
	      player.pause();
	    }
	    player = window.tomahkAPI.Track(trackName, artistName, {
	      width: 0,
	      height: 0,
	      disabledResolvers: [
	          "SoundCloud",
	          "Youtube"
	          // options: "SoundCloud", "Officialfm", "Lastfm", "Jamendo", "Youtube", "Rdio", "SpotifyMetadata", "Deezer", "Exfm"
	      ],
	      handlers: {
	          onloaded: function() {
	              //log(currentTrack.connection+":\n  api loaded");
	          },
	          onended: function() {
	              //log(currentTrack.connection+":\n  Song ended: "+track.artist+" - "+track.title);
	          },
	          onplayable: function() {
	              //log(currentTrack.connection+":\n  playable");
	              console.log("playable");
	              player.play();
	          },
	          onresolved: function(resolver, result) {
	              //log(currentTrack.connection+":\n  Track found: "+resolver+" - "+ result.track + " by "+result.artist);
	          },
	          ontimeupdate: function(timeupdate) {
	              var currentTime = timeupdate.currentTime;
	              var duration = timeupdate.duration;
	              currentTime = parseInt(currentTime);
	              duration = parseInt(duration);

	              //log(currentTrack.connection+":\n  Time update: "+currentTime + " "+duration);
	          }
	      }
	    });
	    $("#player_dummy").append(player.render());
	};

      
      // search autocomplete
      $("#song_search").autocomplete({
        minLength: 3,
        source: function(request, response) {
          $.getJSON("https://api.spotify.com/v1/search?q=" + request.term + "&type=track", function(data) {
              response(data.tracks.items.slice(0, 5));
            });
        },
        focus: function(event, ui) {
          $("#song_search").val(ui.item.name + ", " + ui.item.artists[0].name);

          return false;
        },
        select: function(event, ui) {
          $("#song_search").val(ui.item.name + ", " + ui.item.artists[0].name);

          play(ui.item.name, ui.item.artists[0].name);

          $.post("addTrack", {
            roomId: $scope.roomId,
            name: ui.item.name,
            artist: ui.item.artists[0].name,
            album: ui.item.album.name,
            thumbnail: ui.item.album.images[0].url
          });

          $scope.$apply(function() {
          	$scope.queue.push({
	          	name: ui.item.name,
	            artist: ui.item.artists[0].name,
	            album: ui.item.album.name,
	            thumbnail: ui.item.album.images[0].url
	        });
          });

          return false;
        },
        _resizeMenu: function() {
          this.menu.element.outerWidth(500);
        }
      })
      .autocomplete("instance")._renderItem = function(ul, item) {
        var images = item.album.images;
        return $("<li>")
          .append("<img src=\"" + images[images.length - 1].url + "\" style=\"float: left; height:100%; \"/>" +
            "<a style=\"float: left;\">" + item.name + "<br>" + item.artists[0].name + "</a>")
          .appendTo(ul);
      };
      // search enter
      $("#song_search").keypress(function(e) {
        if(e.keyCode == 13) {
          e.preventDefault();
          sendSelected(this.value);
          $(this).autocomplete('close');
        }
      });       

}]);