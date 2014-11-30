'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {
	$scope.queueSorter = function(item) {
		return -parseInt(item.votes, 10);
	}
	$scope.upvote = function(item) {
		item.upvotes += 1;
		$.ajax({
          	type: "POST",
          	url: "/rooms/" + $scope.roomId + "/tracks/" + item.id + "/upvote",
          	contentType: "application/json",
          	success: update,
          	dataType: "json"
        });
	};
	$scope.downvote = function(item) {
		item.downvotes += 1;
		$.ajax({
          	type: "POST",
          	url: "/rooms/" + $scope.roomId + "/tracks/" + item.id + "/downvote",
          	contentType: "application/json",
          	success: update,
          	dataType: "json"
        });
	};

	$scope.roomId = null;
    $scope.currentTrack = null;
    $scope.queue = [];

	$.post("/rooms", function(data) {
		$scope.$apply(function() {
			$scope.roomId = data.roomId;
		});
    });

    var update = function(data) {
    	$scope.$apply(function() {
    		$scope.currentTrack = data.currentTrack;
    		$scope.queue = data.queue;
    	});

    	console.log(data);
    };

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
          $("#song_search").val("");

          $.ajax({
          	type: "POST",
          	url: "/rooms/" + $scope.roomId + "/tracks",
          	data: JSON.stringify({
	            "name": ui.item.name,
	            "artist": ui.item.artists[0].name,
	            "album": ui.item.album.name,
	            "thumbnail": ui.item.album.images[0].url
          	}),
          	contentType: "application/json",
          	success: update,
          	dataType: "json"
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




      $scope.playClicked = function() {
      	$.ajax({
          	type: "POST",
          	url: "/rooms/" + $scope.roomId + "/playNext",
          	contentType: "application/json",
          	success: function(data) {
          		update(data);
          		play($scope.currentTrack.name, $scope.currentTrack.artist);
          	},
          	dataType: "json"
        });

      };   

}]);