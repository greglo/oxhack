'use strict';

angular.module('noDJ').
directive('searchSongAutocomplete', ['$rootScope', 'MusicQueue', 'SearchSong',
	function($rootScope, MusicQueue, SearchSong) {
		return {
			restrict: 'A',
			link: function(scope, elem, attr) {
				$(elem).autocomplete({
	        		minLength: 3,
			        source: function(req, res) {
			        	SearchSong(req.term, function(err, data) {
			        		if (!err) res(data);
			        	});
			        },
			        focus: function(event, ui) {
						$(elem).val(ui.item.title);

						return false;
			        },
	        		select: function(event, ui) {
	        			$(elem).val('');

	        			MusicQueue.addTrack(ui.item);

						return false;
					},
					_resizeMenu: function() {
					  this.menu.element.outerWidth(500);
					}
				})
	    		.autocomplete("instance")._renderItem = function(ul, item) {
	        		return $("<li>")
	          			.append("<img class=\"dropthumbnail\" src=\"" + item.thumbnail_small + "\"/>" + "<a style=\"float: left;\"> <span class=\"dropname\">" + item.title + "</span><br><span class=\"dropartist\">" + item.title + "</span></a>")
	          			.appendTo(ul);
	      		};
	      		// search enter
	      		$(elem).keypress(function(e) {
	        		if(e.keyCode == 13) {
	          			e.preventDefault();
	          			// sendSelected(this.value);
	          			$(this).autocomplete('close');
	        		}
	      		});   
			}
		};
	}
]);
