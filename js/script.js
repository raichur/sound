// Get list of sounds based on search input
var clientid = 'client_id=0bcc7c4bcd2b5b55b23ab538c02f70c0';
var audioPlayer = document.getElementById('player');
var soundName = "";
var favSongs = ['Heroes', 'Ed Sheeran', 'Smle', 'Maroon 5', 'The Script', 'Coldplay', 'Skrillex', 'Deadmau5'];
var itemsArray = [];
var currentSongUrl;

function getSongs() {
	$.ajax({
		url: "https://api.soundcloud.com/tracks.json?" + $('#search').serialize(),
		dataType: 'json',
		beforeSend:
		function(data){
			$('#sounds').empty();
		},
		success:
		function(data){
			$('#sounds').html('');
			itemsArray = [];
			var items = [];
			$.each(data, function(key, val){
				if(val.stream_url) {
					itemsArray.push(val.stream_url);
					items.push("<div id='tracks_list'><a data-artist='"+val.user.username+"' data-title='"+val.title+ "' data-url=" + val.stream_url + " href='javascript:void();'><li><h2>"+val.title+"</h2><span class='plays'><b>"+ val.user.username+  "</b> " + val.playback_count + " plays " +  ((val.duration)/60000).toFixed(2) + " min</span></li></a>");
				}
			});
			$('#sounds').html(items.join(' '));
			trackClick();
			if(audioPlayer.paused){
				var url = $('#tracks_list:first-child a').data('url') + "?"+ clientid;
				soundName = $('#tracks_list:first-child a').data('title');
				var title = $('#tracks_list:first-child a').data('title');
				var artist = $('#tracks_list:first-child a').data('artist');
				$('#navbar h2').html(title);
				audioPlayer.src = url;
				currentSongUrl = url;
				audioPlayer.load();
				document.getElementById('player').play();
				return false;
			}
		}
	});
}

$('#search').keyup(function() {
	getSongs();
});

$(function(){
	$('#q').attr('value', favSongs[Math.floor(Math.random()*favSongs.length)]);
	getSongs();
	$('body').keyup(function(e){
	   if(e.keyCode == 32 && !($("#q").is(":focus"))){
			e.preventDefault();
			if(audioPlayer.paused){
				audioPlayer.play();
				$('#play').html('<svg width="2em"><use xlink:href="#icon-pause"/></svg>');
			} else {
				audioPlayer.pause();
				$('#play').html('<svg width="2em"><use xlink:href="#icon-play"/></svg>');
			}
	   }
	});
});

$('#next').click(function(){
	next();
});

$('#previous').click(function(){
	previous();
});

document.getElementById('player').addEventListener("ended", function() {
	next();
});

function previous(){
	audioPlayer.src = itemsArray[itemsArray.indexOf(currentSongUrl)] + "?"+ clientid;
	audioPlayer.load();
	currentSongUrl = itemsArray[itemsArray.indexOf(currentSongUrl)-1];
	document.getElementById('player').play();
}

function next(){
	audioPlayer.src = itemsArray[itemsArray.indexOf(currentSongUrl)+2] + "?"+ clientid;
	audioPlayer.load();
	currentSongUrl = itemsArray[itemsArray.indexOf(currentSongUrl)+1];
	document.getElementById('player').play();
}

// Get sound from SoundCloud
function trackClick(){
	$('#tracks_list a').click(function(){
		var url = $(this).data('url') + "?"+ clientid;
		var title = $(this).data('title');
		soundName = $(this).data('title');
		var artist = $(this).data('artist');
		$('#navbar h2').html(title);
		audioPlayer.src = url;
		currentSongUrl = url;
		audioPlayer.load();
		document.getElementById('player').play();
		return false;
	});
}

// Click events for control
$('#play').click(function(e){
	e.preventDefault();
	if(audioPlayer.paused){
		audioPlayer.play();
		$('#play').html('<svg width="2em"><use xlink:href="#icon-pause"/></svg>');
	} else {
		audioPlayer.pause();
		$('#play').html('<svg width="2em"><use xlink:href="#icon-play"/></svg>');
	}
});
(function ($) {

    var PPSliderClass = function (el, opts) {
        var element = $(el);
        var options = opts;
        var isMouseDown = false;
        var currentVal = 0;

        element.wrap('<div/>');
        var container = $(el).parent();

        container.addClass('pp-slider');

        container.append('<div class="pp-slider-min">-</div><div class="pp-slider-scale"><div class="pp-slider-button"><div class="pp-slider-divies"></div></div><div class="pp-slider-tooltip"></div></div><div class="pp-slider-max">+</div>');

        if (typeof(options) != 'undefined' && typeof(options.hideTooltip) != 'undefined' && options.hideTooltip === true)
        {
          container.find('.pp-slider-tooltip').hide();
        }

        if (typeof(options.width) != 'undefined')
        {
          container.css('width',(options.width+'px'));
        }
        container.find('.pp-slider-scale').css('width',(container.width()-30)+'px');

        var startSlide = function (e) {

          isMouseDown = true;
          var pos = getMousePosition(e);
          startMouseX = pos.x;

          lastElemLeft = ($(this).offset().left - $(this).parent().offset().left);
          updatePosition(e);

          return false;
        };

        var getMousePosition = function (e) {

          var posx = 0;
          var posy = 0;

          if (!e) e = window.event;

          if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
          }
          else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
          }

          return { 'x': posx, 'y': posy };
        };

        var updatePosition = function (e) {
          var pos = getMousePosition(e);

          var spanX = (pos.x - startMouseX);

          var newPos = (lastElemLeft + spanX);
          var upperBound = (container.find('.pp-slider-scale').width()-container.find('.pp-slider-button').width());
          newPos = Math.max(0,newPos);
          newPos = Math.min(newPos,upperBound);
          currentVal = Math.round((newPos/upperBound)*100,0);

          container.find('.pp-slider-button').css("left", newPos);
          container.find('.pp-slider-tooltip').html(currentVal+'%');
          container.find('.pp-slider-tooltip').css('left', newPos-6);
					audioPlayer.volume = (currentVal/100);
        };

        var moving = function (e) {
          if(isMouseDown){
            updatePosition(e);
            return false;
          }
        };

        var dropCallback = function (e) {
          isMouseDown = false;
          element.val(currentVal);
          if(typeof element.options != 'undefined' && typeof element.options.onChanged == 'function'){
            element.options.onChanged.call(this, null);
          }

        };

        container.find('.pp-slider-button').bind('mousedown',startSlide);

        $(document).mousemove(function(e) { moving(e); });
        $(document).mouseup(function(e){ dropCallback(e); });

    };

    $.fn.PPSlider = function (options) {
        var opts = $.extend({}, $.fn.PPSlider.defaults, options);

        return this.each(function () {
            new PPSliderClass($(this), opts);
        });
    };

    $.fn.PPSlider.defaults = {
        width: 150
    };


})(jQuery);


$("#volume").PPSlider({width: 100});
