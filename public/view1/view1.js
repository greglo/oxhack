'use strict';

angular.module('myApp.view1', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/party/:partyId', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])
.controller('View1Ctrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
	if ($routeParams.partyId === 'new') {
		$.post("/rooms", function(data) {
			$scope.$apply(function() {
				$scope.roomId = data.roomId;
				$location.path('/party/' + data.roomId);
			});
	    });
	    return;
	}

	$scope.roomId = $routeParams.partyId;

	$scope.currentTrack = null;
    $scope.isPlaying = false;
    $scope.queue = [];


	$scope.queueSorter = function(item) {
		return -(item.upvotes-item.downvotes);
	};
	/*$scope.upvote = function(item) {
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
	};*/

    var update = function(data) {
    	$scope.$apply(function() {
    		$scope.currentTrack = data.currentTrack;
    		$scope.queue = data.queue;

    		/*if ($scope.currentTrack === null) {
    			$scope.nextClicked();
    		}*/
    	});
    };

	var player = null;

	var play = function(trackName, artistName) {
		console.log(trackName + " "+ artistName + " " + player);
	    if (player != null && $scope.isPlaying) {
	      player.pause();
	    }
	    player = window.tomahkAPI.Track(trackName, artistName, {
	      width: 10,
	      height: 10,
	      disabledResolvers: [
	          "Youtube",
	          "Spotify"
	          // options: "SoundCloud", "Officialfm", "Lastfm", "Jamendo", "Youtube", "Rdio", "SpotifyMetadata", "Deezer", "Exfm"
	      ],
	      handlers: {
	          onloaded: function() {
	              console.log("api loaded");
	          },
	          onended: function() {
	          	$scope.nextClicked();
	          },
	          onplayable: function() {
	          	  console.log(trackName + " "+ artistName);
	              player.play();
	              $scope.isPlaying = true;
	          },
	          onresolved: function(resolver, result) {
	              //consoler.log(play.connection+":\n  Track found: "+resolver+" - "+ result.track + " by "+result.artist);
	          },
	          ontimeupdate: function(timeupdate) {
	          		var currentTime = timeupdate.currentTime;
	              	var duration = timeupdate.duration;
	              	
	          		$scope.$apply(function() {
	          			$scope.currentTime = parseInt(currentTime);
	              		$scope.duration = parseInt(duration);
	          		});
	              

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
          .append("<img class=\"dropthumbnail\" src=\"" + images[images.length - 1].url + "\"/>" + "<a style=\"float: left;\"> <span class=\"dropname\">" + item.name + "</span><br><span class=\"dropartist\">" + item.artists[0].name + "</span></a>")
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



      $scope.nextClicked = function() {
      	if (player != null && $scope.isPlaying) {
	      player.pause();
	      $scope.isPlaying = false;
	      player = null;
	    }
      	$.ajax({
          	type: "POST",
          	url: "/rooms/" + $scope.roomId + "/playNext",
          	contentType: "application/json",
          	success: function(data) {
          		update(data);
          		if ($scope.currentTrack != null) {
          			play($scope.currentTrack.name, $scope.currentTrack.artist);
          		}
          	},
          	dataType: "json"
        });
      };
      $scope.playClicked = function() {
      	if ($scope.isPlaying) {
      		return;
      	}
      	if (player != null) {
      		player.play();
      		$scope.isPlaying = true;
      	}
      	else {
      		$scope.nextClicked();
      	}
      };
      $scope.pauseClicked = function() {
      	if (player != null && $scope.isPlaying) {
	      player.pause();
	      $scope.isPlaying = false;
	    }
      };

      /*var fetch = function() {
      	$.ajax({
          	type: "GET",
          	url: "/rooms/" + $scope.roomId,
          	contentType: "application/json",
          	success: update,
          	dataType: "json",
          	cache: false
        });
      };
      fetch();
      setInterval(fetch, 2000);*/

}]);