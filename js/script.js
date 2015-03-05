// Get list of sounds based on search input
var clientid = 'client_id=0bcc7c4bcd2b5b55b23ab538c02f70c0';
var audioPlayer = document.getElementById('player');
var soundName = "";
var favSongs = ['Heroes', 'Ed Sheeran', 'Smle', 'Maroon 5', 'The Script', 'Coldplay', 'Skrillex', 'Deadmau5'];


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
			var items = [];
			$.each(data, function(key, val){
				items.push("<div id='tracks_list'><a data-artist='"+val.user.username+"' data-title='"+val.title+ "' data-url=" + val.stream_url + " href='javascript:void();'><li><h2>"+val.title+"</h2><span class='plays'><b>"+ val.user.username+  "</b> " + val.playback_count+ " plays</span></li></a>");
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
});

// Get sound from SoundCloud
function trackClick(){
	$('#tracks_list a').click(function(){
		var url = $(this).data('url') + "?"+ clientid;
		var title = $(this).data('title');
		soundName = $(this).data('title');
		var artist = $(this).data('artist');
		$('#navbar h2').html(title);
		audioPlayer.src = url;
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
