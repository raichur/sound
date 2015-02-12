// Get list of sounds based on search input
var delay = (function(){
	var timer = 0;
	return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();

$('#search').keyup(function() {
	delay(function(){
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
			}
		});
	}, 500);
});

var audioPlayer = document.getElementById('player');

// Get sound from SoundCloud
function trackClick(){
	var clientid = 'client_id=0bcc7c4bcd2b5b55b23ab538c02f70c0';
	$('#tracks_list a').click(function(){
		var url = $(this).data('url') + "?"+ clientid;
		var title = $(this).data('title');
		var artist = $(this).data('artist');
		$(this).addClass('playedSong');
		$('#navbar h2').html(title);
		audioPlayer.src = url;
		audioPlayer.load();
		document.getElementById('player').play();
		return false;
	});
}

// Click events for control
$('.playPauseToggle').click(function(e){
	e.preventDefault();
	if(audioPlayer.paused){
		audioPlayer.play();
		$('.playPauseToggle').text("Pause");
	} else {
		audioPlayer.pause();
		$('.playPauseToggle').text("Play");
	}
});
